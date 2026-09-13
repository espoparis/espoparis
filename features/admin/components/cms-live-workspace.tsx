"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { AuthSession } from "@/server/auth/types";
import { canCms, canTransitionContent, type CmsItem, type DailyReflection, type ContentStatus } from "@/server/content/cms";
import type { CmsAdminSnapshot } from "@/server/content/cms-repository";
import { createCmsItemAction, createReflectionAction, deleteCmsItemAction, deleteReflectionAction, transitionCmsItemAction } from "@/app/[locale]/admin/content/actions";
import { MediaField } from "./media-field";

export type CmsLiveCopy = Record<string, string>;
const field = "mt-2 w-full rounded-sm border border-border bg-background p-3 text-sm disabled:opacity-50";
function localDate(value?: string) {
  if (!value) return "";
  const date = new Date(value); if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
}
function dates(data: FormData, keys: string[]) {
  for (const key of keys) { const value = String(data.get(key) ?? ""); if (value) data.set(key, new Date(value).toISOString()); }
}
export function CmsLiveWorkspace({ locale, session, snapshot }: { locale: string; session: AuthSession; snapshot: CmsAdminSnapshot; copy: CmsLiveCopy }) {
  const t = useTranslations("adminOperations"), c = useTranslations("adminContent.live");
  const router = useRouter();
  const role = session.identity?.role ?? "visitor";
  const connected = snapshot.state === "connected";
  const [selected, select] = useState("");
  const [reflectionId, selectReflection] = useState("");
  const [pending, setPending] = useState(false), [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [generation, setGeneration] = useState(0);
  const item = snapshot.items.find((x) => x.id === selected);
  const reflection = snapshot.reflections.find((x) => x.id === reflectionId);
  const canPublish = canCms(role, "content.publish");
  const disabled = !connected || pending || uploading;
  const itemDisabled = disabled || !canCms(role, "content.edit") || (item?.status === "published" && !canPublish);
  const reflectionDisabled = disabled || !canCms(role, "reflection.manage") || (Boolean(reflection?.approved) && !canPublish);
  async function run(task: () => Promise<unknown>, reset = false) {
    setPending(true); setMessage("");
    try { await task(); setMessage(t("saved")); if (reset) { select(""); selectReflection(""); setGeneration((n) => n + 1); } router.refresh(); }
    catch { setMessage(t("failed")); }
    finally { setPending(false); }
  }
  function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); dates(data, ["publishAt", "unpublishAt"]);
    void run(() => createCmsItemAction(locale, data), !item);
  }
  function submitReflection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); dates(data, ["activeFrom", "activeUntil"]);
    void run(() => createReflectionAction(locale, data), !reflection);
  }
  function transition(status: ContentStatus) {
    if (!item) return; const data = new FormData(); data.set("id", item.id); data.set("status", status);
    void run(() => transitionCmsItemAction(locale, data));
  }
  const states: ContentStatus[] = ["review", "published", "archived", "draft"];
  return <section className="page-shell space-y-12 pb-16">
    <p role="status" className={`border-s-2 p-4 text-sm ${connected ? "border-primary bg-secondary" : "border-destructive bg-destructive/5"}`}>{c(connected ? "connected" : snapshot.state === "error" ? "error" : "notConfigured")}</p>
    {message ? <p role="status" className="border border-border p-4 text-sm">{message}</p> : null}
    <section className="border-t border-border pt-8" aria-labelledby="content-editor-title">
      <div className="flex flex-wrap items-end justify-between gap-5"><h2 id="content-editor-title" className="font-display text-3xl">{t("newItem")}</h2>
        <label className="text-sm">{t("edit")}<select value={selected} onChange={(e) => {select(e.target.value);setMessage("");}} disabled={pending || uploading} className={field}><option value="">{t("newItem")}</option>{snapshot.items.map((x) => <option key={x.id} value={x.id}>{x.title} · {t(x.status)}</option>)}</select></label>
      </div>
      <form key={`item-${selected}-${generation}`} onSubmit={submitItem} className="mt-7 space-y-6">
        <input type="hidden" name="id" value={item?.id ?? ""}/>
        <fieldset disabled={itemDisabled} className="grid min-w-0 gap-5 md:grid-cols-2">
          <label className="text-sm">{c("titleLabel")}<input name="title" required maxLength={300} defaultValue={item?.title} className={field}/></label>
          <label className="text-sm">{c("kindLabel")}<select name="kind" defaultValue={item?.kind ?? "activity"} className={field}>{["activity","announcement","news"].map((k) => <option key={k} value={k}>{t(k)}</option>)}</select></label>
          <label className="text-sm md:col-span-2">{c("excerptLabel")}<textarea name="excerpt" rows={2} maxLength={1500} defaultValue={item?.excerpt} className={field}/></label>
          <label className="text-sm md:col-span-2">{c("bodyLabel")}<textarea name="body" rows={6} maxLength={30000} defaultValue={item?.body} className={field}/></label>
          <label className="text-sm">{c("publishAtLabel")}<input name="publishAt" type="datetime-local" defaultValue={localDate(item?.schedule?.publishAt)} className={field}/></label>
          <label className="text-sm">{c("unpublishAtLabel")}<input name="unpublishAt" type="datetime-local" defaultValue={localDate(item?.schedule?.unpublishAt)} className={field}/></label>
          <p className="text-xs leading-6 text-muted-foreground md:col-span-2">{t("scheduleHint")}</p>
          <label className="text-sm">{c("slugLabel")}<input name="slug" dir="ltr" pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={item?.slug} placeholder={t("autoSlug")} className={field}/></label>
        </fieldset>
        <MediaField name="coverImage" purpose="cms-image" label={t("image")} defaultValue={item?.coverImage} disabled={itemDisabled} onBusy={setUploading}/>
        <div className="flex flex-wrap gap-3">
          <button disabled={itemDisabled} className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40">{item ? t("save") : c("saveDraft")}</button>
          {item ? states.filter((status) => canTransitionContent(role, item.status, status)).map((status) => <button key={status} type="button" disabled={disabled} onClick={() => transition(status)} className="border border-border px-4 py-3 text-sm disabled:opacity-40">{status === "archived" ? t("hide") : status === "draft" ? t("restore") : status === "published" ? c("publish") : c("review")}</button>) : null}
          {item && canCms(role,"content.delete") ? <button type="button" disabled={disabled} className="px-4 py-3 text-sm text-destructive" onClick={() => {
            if (!window.confirm(t("confirmDelete"))) return;
            const data = new FormData(); data.set("id",item.id); void run(() => deleteCmsItemAction(locale,data),true);
          }}>{t("remove")}</button> : null}
        </div>
      </form>
    </section>
    <section className="border-t border-border pt-8" aria-labelledby="reflection-editor-title">
      <div className="flex flex-wrap items-end justify-between gap-5"><h2 id="reflection-editor-title" className="font-display text-3xl">{t("newReflection")}</h2>
        <label className="text-sm">{t("chooseReflection")}<select value={reflectionId} disabled={pending} onChange={(e) => {selectReflection(e.target.value);setMessage("");}} className={field}><option value="">{t("newReflection")}</option>{snapshot.reflections.map((x) => <option key={x.id} value={x.id}>{x.arabicText.slice(0,70)} · {x.sourceLabel}</option>)}</select></label>
      </div>
      <form key={`reflection-${reflectionId}-${generation}`} onSubmit={submitReflection} className="mt-7 space-y-5">
        <input type="hidden" name="id" value={reflection?.id ?? ""}/>
        <fieldset disabled={reflectionDisabled} className="grid min-w-0 gap-5 md:grid-cols-2">
          <label className="text-sm">{c("reflectionKindLabel")}<select name="kind" defaultValue={reflection?.kind ?? "quran"} className={field}>{["quran","hadith","wisdom"].map((k) => <option key={k} value={k}>{t(k)}</option>)}</select></label>
          <label className="text-sm">{c("sourceLabel")}<input name="sourceLabel" required defaultValue={reflection?.sourceLabel} className={field}/></label>
          <label className="text-sm md:col-span-2">{c("arabicTextLabel")}<textarea name="arabicText" dir="rtl" required rows={4} defaultValue={reflection?.arabicText} className={field}/></label>
          {(["en","fr","ar","fa"] as const).map((lang) => <label key={lang} className="text-sm">{t("translation")} · {lang.toUpperCase()}<textarea name={`translation${lang[0].toUpperCase()+lang.slice(1)}`} dir={lang === "ar" || lang === "fa" ? "rtl" : "ltr"} rows={3} defaultValue={reflection?.translations?.[lang]} className={field}/></label>)}
          <label className="text-sm">{c("activeFromLabel")}<input name="activeFrom" type="datetime-local" defaultValue={localDate(reflection?.activeFrom)} className={field}/></label>
          <label className="text-sm">{c("activeUntilLabel")}<input name="activeUntil" type="datetime-local" defaultValue={localDate(reflection?.activeUntil)} className={field}/></label>
          <p className="text-xs leading-6 text-muted-foreground md:col-span-2">{t("scheduleHint")}</p>
          <label className="text-sm">{c("priorityLabel")}<input name="priority" type="number" defaultValue={reflection?.priority ?? 10} className={field}/></label>
          <label className="text-sm">{c("occasionLabel")}<input name="occasionLabel" defaultValue={reflection?.occasionLabel} className={field}/></label>
          {canPublish ? <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="approved" value="true" defaultChecked={reflection?.approved}/>{t("approved")}</label> : null}
        </fieldset>
        <div className="flex flex-wrap gap-3"><button disabled={reflectionDisabled} className="bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-40">{t("save")}</button>
          {reflection && canCms(role,"content.delete") ? <button type="button" disabled={disabled} className="px-4 py-3 text-sm text-destructive" onClick={() => {if(!window.confirm(t("confirmDelete")))return;const data=new FormData();data.set("id",reflection.id);void run(()=>deleteReflectionAction(locale,data),true);}}>{t("remove")}</button> : null}
        </div>
      </form>
    </section>
  </section>;
}
