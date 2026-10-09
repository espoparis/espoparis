"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { InstituteRecord } from "@/server/content/institute";
import { saveInstituteAction, deleteInstituteAction } from "@/app/[locale]/admin/content/actions";
const field = "mt-2 w-full rounded-sm border border-border bg-background p-3 text-sm";
export function InstituteEditor({ items, locale, canEdit, canPublish, canDelete, connected }: {
  items: InstituteRecord[]; locale: InstituteRecord["locale"]; canEdit: boolean; canPublish: boolean; canDelete: boolean; connected: boolean;
}) {
  const t = useTranslations("adminInstitutes"), common = useTranslations("adminOperations"), router = useRouter();
  const [id, setId] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const item = items.find(x => x.id === id && x.locale === locale);
  const disabled = busy || !connected || !canEdit || (Boolean(item?.approved) && !canPublish);
  return <section className="page-shell space-y-6 pb-16">
    <p className="text-sm leading-7 text-muted-foreground">{t("hint")}</p>
    {!connected && <p role="status">{common("statusGuide")}</p>}
    <label className="block text-sm">{t("select")}<select className={field} value={id} disabled={busy} onChange={e => {setId(e.target.value);setMessage("");}}><option value="">{t("new")}</option>{items.filter(x => x.locale === locale).map(x => <option key={x.id} value={x.id}>{x.institute}</option>)}</select></label>
    <form key={`${id}:${locale}`} className="space-y-6" onSubmit={async e => {
      e.preventDefault(); const data = new FormData(e.currentTarget); const value = (key: string) => String(data.get(key) ?? "").trim(); setBusy(true);setMessage("");
      try { const nextId = id || crypto.randomUUID(); await saveInstituteAction({id:nextId,locale,country:value("country"),institute:value("institute"),details:value("details").split("\n").map(x => x.trim()).filter(Boolean),order:Number(value("order")),approved:data.get("approved") === "true"}); setId(nextId);setMessage(common("saved"));router.refresh(); }
      catch {setMessage(common("failed"));} finally {setBusy(false);}
    }}>
      <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
        <label>{t("name")}<input className={field} name="institute" required defaultValue={item?.institute}/></label>
        <label>{t("country")}<input className={field} name="country" required defaultValue={item?.country}/></label>
        <label className="sm:col-span-2">{t("details")}<textarea className={field} name="details" rows={6} required defaultValue={item?.details.join("\n")}/></label>
        <label>{t("order")}<input className={field} type="number" min="0" step="1" name="order" required defaultValue={item?.order ?? 0}/></label>
        {canPublish && <label className="flex items-center gap-3"><input type="checkbox" name="approved" value="true" defaultChecked={item?.approved}/>{common("approved")}</label>}
        <button className="bg-primary px-6 py-3 text-primary-foreground disabled:opacity-40" disabled={disabled}>{common("save")}</button>
      </fieldset>
    </form>
    {item && canDelete && <button type="button" disabled={busy || !connected} className="border border-destructive px-6 py-3 text-destructive" onClick={async () => {if (!window.confirm(t("confirmDelete"))) return;setBusy(true);try {await deleteInstituteAction(id,locale);setId("");setMessage(common("saved"));router.refresh();}catch{setMessage(common("failed"));}finally{setBusy(false);}}}>{t("delete")}</button>}
    <p role="status" aria-live="polite">{message}</p>
  </section>;
}
