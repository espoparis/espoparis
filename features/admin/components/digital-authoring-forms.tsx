"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { MediaField } from "./media-field";
import { driveFileId } from "@/server/media/files";
import { useRouter } from "next/navigation";
import { saveLearningRecordAction, transitionLearningRecordAction } from "@/app/[locale]/admin/learning/actions";
import { saveLibraryRecordAction, transitionLibraryRecordAction } from "@/app/[locale]/admin/library/actions";
import { canTransitionDigitalRecord, type DigitalRecordStatus, type LearningCatalogRecord, type LibraryCatalogRecord } from "@/server/digital/catalog";
import type { AccessLevel, UserRole } from "@/server/platform/types";

export type DigitalAuthoringCopy = {
  libraryFormTitle: string; learningFormTitle: string; newRecord: string; selectRecord: string; noRecords: string;
  currentStatus: string; readOnly: string; identifier: string; slug: string; title: string; author: string;
  description: string; language: string; category: string; accessLevel: string; pdfFileId: string; coverFileId: string;
  publicationYear: string; pageCount: string; academicYear: string; year: string; semester: string; courseId: string;
  courseTitle: string; lessonOrder: string; videoFileId: string; audioFileId: string; attachments: string;
  saveDraft: string; saveChanges: string; submitReview: string; returnDraft: string; publish: string; archive: string;
  restoreDraft: string; saved: string; transitionComplete: string; failed: string;
  accessPublic: string; accessRegistered: string; accessStudent: string; accessPaid: string;
};

const fieldClass = "mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "text-sm font-medium";

function text(data: FormData, key: string) { return String(data.get(key) ?? "").trim(); }
function optionalNumber(data: FormData, key: string) { const value = text(data, key); return value ? Number(value) : undefined; }
function recordId(data: FormData) { return text(data, "id") || globalThis.crypto.randomUUID(); }
function attachments(value: string) { return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean); }

function AccessSelect({ copy, defaultValue, disabled }: { copy: DigitalAuthoringCopy; defaultValue: AccessLevel; disabled: boolean }) {
  return <label className={labelClass}>{copy.accessLevel}<select name="accessLevel" defaultValue={defaultValue} disabled={disabled} className={fieldClass}>
    <option value="public">{copy.accessPublic}</option><option value="registered-free">{copy.accessRegistered}</option>
    <option value="student-only">{copy.accessStudent}</option><option value="paid">{copy.accessPaid}</option>
  </select></label>;
}

function StatusActions({ status, role, kind, labels, disabled, onTransition }: {
  status: DigitalRecordStatus; role: UserRole; kind: "library" | "learning"; labels: DigitalAuthoringCopy; disabled: boolean;
  onTransition: (status: DigitalRecordStatus) => void;
}) {
  const t = useTranslations("adminOperations");
  const options: { status: DigitalRecordStatus; label: string }[] = status === "draft"
    ? [{ status: "review", label: labels.submitReview }, { status: "archived", label: t("hide") }]
    : status === "review"
      ? [{ status: "draft", label: labels.returnDraft }, { status: "published", label: labels.publish }, { status: "archived", label: t("hide") }]
      : status === "published" ? [{ status: "archived", label: t("hide") }]
        : [{ status: "draft", label: labels.restoreDraft }];
  return <div className="flex flex-wrap gap-2">
    {options.filter((option) => canTransitionDigitalRecord(role, kind, status, option.status)).map((option) => (
      <button key={option.status} type="button" disabled={disabled} onClick={() => onTransition(option.status)} className="rounded-sm border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50">
        {option.label}
      </button>
    ))}
  </div>;
}

function Feedback({ message }: { message: { ok: boolean; text: string } | null }) {
  return message ? <p role="status" className={`rounded-sm px-4 py-3 text-sm ${message.ok ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}>{message.text}</p> : null;
}

export function LibraryAuthoringForm({ records, locale, role, copy, connected }: { records: LibraryCatalogRecord[]; locale: string; role: UserRole; copy: DigitalAuthoringCopy; connected: boolean }) {
  const t = useTranslations("adminOperations");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const selected = records.find((record) => record.id === selectedId);
  const editable = connected && !uploading && (!selected || selected.status === "draft" || selected.status === "review");

  function run(task: () => Promise<void>, success: string) {
    setMessage(null);
    startTransition(async () => { try { await task(); setMessage({ ok: true, text: success }); router.refresh(); } catch (error) { setMessage({ ok: false, text: copy.failed }); } });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pdfFileId = driveFileId(text(data, "pdfFileId"));
    const coverFileId = driveFileId(text(data, "coverFileId")) || undefined;
    if (!pdfFileId || (text(data, "coverFileId") && !coverFileId)) { setMessage({ ok: false, text: t("uploadFailed") }); return; }
    const record: LibraryCatalogRecord = {
      id: selected?.id ?? recordId(data), slug: text(data, "slug") || `book-${globalThis.crypto.randomUUID().slice(0,8)}`, title: text(data, "title"), author: text(data, "author"),
      description: text(data, "description") || undefined, language: text(data, "language"), category: text(data, "category"),
      publicationYear: optionalNumber(data, "publicationYear"), pageCount: optionalNumber(data, "pageCount"),
      pdfFileId, coverFileId, pdfAssetId: pdfFileId, coverAssetId: coverFileId,
      accessLevel: text(data, "accessLevel") as AccessLevel, status: selected?.status ?? "draft", published: selected?.status === "published",
    };
    run(async () => { await saveLibraryRecordAction(locale, record); setSelectedId(record.id); }, copy.saved);
  }

  const key = selected?.id ?? "new";
  return <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-3xl font-semibold">{copy.libraryFormTitle}</h2>{selected && <p className="mt-2 text-sm text-muted-foreground">{copy.currentStatus}: {selected.status}</p>}</div>
      <label className={`${labelClass} min-w-0 sm:min-w-64`}>{copy.selectRecord}<select value={selectedId} disabled={pending || uploading} onChange={(event) => { setSelectedId(event.target.value); setMessage(null); }} className={fieldClass}><option value="">{copy.newRecord}</option>{records.map((record) => <option key={record.id} value={record.id}>{record.title} · {record.status}</option>)}</select></label></div>
    {!records.length && connected ? <p className="mt-4 text-sm text-muted-foreground">{copy.noRecords}</p> : null}
    <form key={key} onSubmit={submit} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={labelClass}>{copy.identifier}<input name="id" defaultValue={selected?.id} disabled={Boolean(selected) || !editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.slug}<input name="slug" placeholder={t("autoSlug")} defaultValue={selected?.slug} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.title}<input name="title" required defaultValue={selected?.title} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.author}<input name="author" required defaultValue={selected?.author} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.language}<input name="language" required defaultValue={selected?.language} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.category}<input name="category" required defaultValue={selected?.category} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.publicationYear}<input name="publicationYear" type="number" min="1" defaultValue={selected?.publicationYear} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.pageCount}<input name="pageCount" type="number" min="1" defaultValue={selected?.pageCount} disabled={!editable} className={fieldClass} /></label>
        <AccessSelect copy={copy} defaultValue={selected?.accessLevel ?? "public"} disabled={!editable} />
        <div className="sm:col-span-2"><MediaField name="pdfFileId" purpose="book-pdf" label={copy.pdfFileId} defaultValue={selected?.pdfFileId} disabled={!editable || pending} onBusy={setUploading}/></div>
        <MediaField name="coverFileId" purpose="book-cover" label={copy.coverFileId} defaultValue={selected?.coverFileId} disabled={!editable || pending} onBusy={setUploading}/>
      </div>
      <label className={labelClass}>{copy.description}<textarea name="description" rows={4} defaultValue={selected?.description} disabled={!editable} className={fieldClass} /></label>
      {!editable && selected ? <p className="text-sm text-muted-foreground">{copy.readOnly}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="submit" disabled={!editable || pending} className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{selected ? copy.saveChanges : copy.saveDraft}</button>
        {selected ? <StatusActions status={selected.status} role={role} kind="library" labels={copy} disabled={pending} onTransition={(status) => run(() => transitionLibraryRecordAction(locale, selected.id, status), copy.transitionComplete)} /> : null}
      </div><Feedback message={message} />
    </form>
  </section>;
}

export function LearningAuthoringForm({ records, locale, role, copy, connected }: { records: LearningCatalogRecord[]; locale: string; role: UserRole; copy: DigitalAuthoringCopy; connected: boolean }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const selected = records.find((record) => record.id === selectedId);
  const editable = connected && (!selected || selected.status === "draft" || selected.status === "review");
  function run(task: () => Promise<void>, success: string) { setMessage(null); startTransition(async () => { try { await task(); setMessage({ ok: true, text: success }); router.refresh(); } catch (error) { setMessage({ ok: false, text: copy.failed }); } }); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const videoFileId = text(data, "videoFileId") || undefined, audioFileId = text(data, "audioFileId") || undefined;
    const attachmentFileIds = attachments(text(data, "attachments"));
    const record: LearningCatalogRecord = {
      id: selected?.id ?? recordId(data), courseId: text(data, "courseId"), courseTitle: text(data, "courseTitle"), title: text(data, "title"),
      description: text(data, "description") || undefined, academicYear: text(data, "academicYear"), year: Number(text(data, "year")),
      semester: Number(text(data, "semester")), order: Number(text(data, "order") || "0"), videoFileId, audioFileId,
      attachmentFileIds, videoAssetId: videoFileId, audioAssetId: audioFileId, attachmentAssetIds: attachmentFileIds,
      accessLevel: text(data, "accessLevel") as AccessLevel, status: selected?.status ?? "draft", published: selected?.status === "published",
    };
    run(() => saveLearningRecordAction(locale, record), copy.saved);
  }
  const key = selected?.id ?? "new";
  return <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-3xl font-semibold">{copy.learningFormTitle}</h2>{selected && <p className="mt-2 text-sm text-muted-foreground">{copy.currentStatus}: {selected.status}</p>}</div>
      <label className={`${labelClass} min-w-0 sm:min-w-64`}>{copy.selectRecord}<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setMessage(null); }} className={fieldClass}><option value="">{copy.newRecord}</option>{records.map((record) => <option key={record.id} value={record.id}>{record.title} · {record.status}</option>)}</select></label></div>
    {!records.length && connected ? <p className="mt-4 text-sm text-muted-foreground">{copy.noRecords}</p> : null}
    <form key={key} onSubmit={submit} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={labelClass}>{copy.identifier}<input name="id" defaultValue={selected?.id} disabled={Boolean(selected) || !editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.courseId}<input name="courseId" required defaultValue={selected?.courseId} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.courseTitle}<input name="courseTitle" required defaultValue={selected?.courseTitle} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.title}<input name="title" required defaultValue={selected?.title} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.academicYear}<input name="academicYear" required defaultValue={selected?.academicYear ?? "2026-2027"} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.year}<input name="year" required type="number" min="1" max="4" defaultValue={selected?.year ?? 1} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.semester}<input name="semester" required type="number" min="1" max="8" defaultValue={selected?.semester ?? 1} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.lessonOrder}<input name="order" required type="number" min="0" defaultValue={selected?.order ?? 0} disabled={!editable} className={fieldClass} /></label>
        <AccessSelect copy={copy} defaultValue={selected?.accessLevel ?? "student-only"} disabled={!editable} />
        <label className={labelClass}>{copy.videoFileId}<input name="videoFileId" defaultValue={selected?.videoFileId} disabled={!editable} className={fieldClass} /></label>
        <label className={labelClass}>{copy.audioFileId}<input name="audioFileId" defaultValue={selected?.audioFileId} disabled={!editable} className={fieldClass} /></label>
        <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>{copy.attachments}<textarea name="attachments" rows={3} defaultValue={selected?.attachmentFileIds.join("\n")} disabled={!editable} className={fieldClass} /></label>
      </div>
      <label className={labelClass}>{copy.description}<textarea name="description" rows={4} defaultValue={selected?.description} disabled={!editable} className={fieldClass} /></label>
      {!editable && selected ? <p className="text-sm text-muted-foreground">{copy.readOnly}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="submit" disabled={!editable || pending} className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{selected ? copy.saveChanges : copy.saveDraft}</button>
        {selected ? <StatusActions status={selected.status} role={role} kind="learning" labels={copy} disabled={pending} onTransition={(status) => run(() => transitionLearningRecordAction(locale, selected.id, status), copy.transitionComplete)} /> : null}
      </div><Feedback message={message} />
    </form>
  </section>;
}
