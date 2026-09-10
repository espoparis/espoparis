import { AlertTriangle, CheckCircle2, CloudOff, Database, FilePlus2, Quote, Trash2 } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canCms, type CmsItem, type DailyReflection } from "@/server/content/cms";
import type { CmsAdminSnapshot } from "@/server/content/cms-repository";
import { createCmsItemAction, createReflectionAction, deleteCmsItemAction, deleteReflectionAction, transitionCmsItemAction } from "@/app/[locale]/admin/content/actions";

export type CmsLiveCopy = {
  liveTitle: string; liveDescription: string; connected: string; notConfigured: string; error: string;
  newContentTitle: string; titleLabel: string; slugLabel: string; kindLabel: string; excerptLabel: string; bodyLabel: string; publishAtLabel: string; unpublishAtLabel: string; saveDraft: string;
  currentContentTitle: string; noContent: string; statusLabel: string; publish: string; review: string; archive: string; delete: string;
  reflectionFormTitle: string; arabicTextLabel: string; sourceLabel: string; reflectionKindLabel: string; occasionLabel: string; priorityLabel: string; activeFromLabel: string; activeUntilLabel: string; saveReflection: string; currentReflectionsTitle: string; noReflections: string; approvedLabel: string; pendingLabel: string;
};

function StateBadge({ snapshot, copy }: { snapshot: CmsAdminSnapshot; copy: CmsLiveCopy }) {
  const state = snapshot.state;
  const Icon = state === "connected" ? CheckCircle2 : state === "not-configured" ? CloudOff : AlertTriangle;
  const label = state === "connected" ? copy.connected : state === "not-configured" ? copy.notConfigured : copy.error;
  return <span className="inline-flex items-center gap-2 rounded-full border border-[#dccca9] bg-white px-3 py-1.5 text-xs font-semibold dark:border-white/10 dark:bg-white/[0.04]"><Icon className="size-3.5 text-[#98772f]" />{label}</span>;
}

export function CmsLiveWorkspace({ locale, session, snapshot, copy }: { locale: string; session: AuthSession; snapshot: CmsAdminSnapshot; copy: CmsLiveCopy }) {
  const role = session.identity?.role ?? "visitor";
  const canCreate = canCms(role, "content.create");
  const canPublish = canCms(role, "content.publish");
  const canDelete = canCms(role, "content.delete");
  const canReflection = canCms(role, "reflection.manage");
  const disabled = snapshot.state !== "connected";

  return <section className="page-shell pb-20">
    <div className="rounded-[2rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><Database className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-2xl font-medium">{copy.liveTitle}</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.liveDescription}</p></div><StateBadge snapshot={snapshot} copy={copy}/></div>
      {snapshot.error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100">{snapshot.error}</p> : null}
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
      <form action={createCmsItemAction.bind(null, locale)} className="rounded-[2rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
        <FilePlus2 className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-2xl">{copy.newContentTitle}</h2>
        <div className="mt-5 grid gap-4">
          <label className="text-sm font-medium">{copy.titleLabel}<input name="title" required disabled={disabled || !canCreate} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label>
          <label className="text-sm font-medium">{copy.slugLabel}<input name="slug" disabled={disabled || !canCreate} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label>
          <label className="text-sm font-medium">{copy.kindLabel}<select name="kind" disabled={disabled || !canCreate} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"><option value="news">News</option><option value="activity">Activity</option><option value="announcement">Announcement</option></select></label>
          <label className="text-sm font-medium">{copy.excerptLabel}<textarea name="excerpt" disabled={disabled || !canCreate} rows={2} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label>
          <label className="text-sm font-medium">{copy.bodyLabel}<textarea name="body" disabled={disabled || !canCreate} rows={6} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">{copy.publishAtLabel}<input name="publishAt" type="datetime-local" disabled={disabled || !canCreate} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label><label className="text-sm font-medium">{copy.unpublishAtLabel}<input name="unpublishAt" type="datetime-local" disabled={disabled || !canCreate} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label></div>
          <input type="hidden" name="status" value="draft"/><button disabled={disabled || !canCreate} className="rounded-full bg-[#0f4738] px-5 py-3 text-sm font-semibold text-[#f4e4b6] disabled:cursor-not-allowed disabled:opacity-40">{copy.saveDraft}</button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><h2 className="font-display text-2xl">{copy.currentContentTitle}</h2><div className="mt-5 space-y-3">{snapshot.items.length ? snapshot.items.map((item: CmsItem)=><article key={item.id} className="rounded-2xl border border-[#e5d9bd] p-4 dark:border-white/10"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-[#98772f]">{item.kind}</p><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-1 text-xs text-[#68766f]">/{item.slug} · {copy.statusLabel}: {item.status}</p></div><div className="flex flex-wrap gap-2">{item.status === "draft" ? <form action={transitionCmsItemAction.bind(null, locale)}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="review"/><button className="rounded-full border px-3 py-1.5 text-xs">{copy.review}</button></form> : null}{canPublish && (item.status === "review" || item.status === "scheduled") ? <form action={transitionCmsItemAction.bind(null, locale)}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="published"/><button className="rounded-full bg-[#0f4738] px-3 py-1.5 text-xs text-white">{copy.publish}</button></form> : null}{item.status !== "archived" ? <form action={transitionCmsItemAction.bind(null, locale)}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="archived"/><button className="rounded-full border px-3 py-1.5 text-xs">{copy.archive}</button></form> : null}{canDelete ? <form action={deleteCmsItemAction.bind(null, locale)}><input type="hidden" name="id" value={item.id}/><button className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700"><Trash2 className="size-3.5"/></button></form> : null}</div></div></article>) : <p className="text-sm text-[#68766f]">{copy.noContent}</p>}</div></div>
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
      <form action={createReflectionAction.bind(null, locale)} className="rounded-[2rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Quote className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-2xl">{copy.reflectionFormTitle}</h2><div className="mt-5 grid gap-4"><label className="text-sm font-medium">{copy.arabicTextLabel}<textarea name="arabicText" dir="rtl" required disabled={disabled || !canReflection} rows={4} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-lg"/></label><label className="text-sm font-medium">{copy.sourceLabel}<input name="sourceLabel" required disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">{copy.reflectionKindLabel}<select name="kind" disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"><option value="quran">Qur'an</option><option value="hadith">Hadith</option></select></label><label className="text-sm font-medium">{copy.priorityLabel}<input name="priority" type="number" defaultValue="10" disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label></div><label className="text-sm font-medium">{copy.occasionLabel}<input name="occasionLabel" disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">{copy.activeFromLabel}<input name="activeFrom" type="datetime-local" disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label><label className="text-sm font-medium">{copy.activeUntilLabel}<input name="activeUntil" type="datetime-local" disabled={disabled || !canReflection} className="mt-2 w-full rounded-xl border border-[#d9cfb8] bg-transparent px-3 py-2.5 text-sm"/></label></div><input type="hidden" name="approved" value="false"/><button disabled={disabled || !canReflection} className="rounded-full bg-[#0f4738] px-5 py-3 text-sm font-semibold text-[#f4e4b6] disabled:opacity-40">{copy.saveReflection}</button></div></form>
      <div className="rounded-[2rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><h2 className="font-display text-2xl">{copy.currentReflectionsTitle}</h2><div className="mt-5 space-y-3">{snapshot.reflections.length ? snapshot.reflections.map((r: DailyReflection)=><article key={r.id} className="rounded-2xl border border-[#e5d9bd] p-4 dark:border-white/10"><div className="flex justify-between gap-4"><div><p dir="rtl" className="text-base font-medium">{r.arabicText}</p><p className="mt-2 text-xs text-[#68766f]">{r.sourceLabel} · {r.approved ? copy.approvedLabel : copy.pendingLabel}</p></div>{canDelete ? <form action={deleteReflectionAction.bind(null, locale)}><input type="hidden" name="id" value={r.id}/><button className="rounded-full border border-red-200 p-2 text-red-700"><Trash2 className="size-3.5"/></button></form> : null}</div></article>) : <p className="text-sm text-[#68766f]">{copy.noReflections}</p>}</div></div>
    </div>
  </section>;
}
