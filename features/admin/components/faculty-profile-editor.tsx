"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { saveFacultyProfileAction } from "@/app/[locale]/admin/content/actions";
import type { FacultyMember } from "@/features/marketing/components/about-faculty-section";
import type { FacultyProfile } from "@/server/content/faculty-profile";
import { MediaField } from "./media-field";

const field = "mt-2 w-full rounded-sm border border-border bg-background p-3 text-sm";
export function FacultyProfileEditor({ members, profiles, locale, connected, canPublish, canEdit }: {
  members: FacultyMember[]; profiles: FacultyProfile[]; locale: FacultyProfile["locale"]; connected: boolean; canPublish: boolean; canEdit: boolean;
}) {
  const t=useTranslations("adminOperations"), router=useRouter();
  const [id, setId]=useState(members[0]?.id ?? ""), [pending,setPending]=useState(false), [uploading,setUploading]=useState(false), [message,setMessage]=useState("");
  const existing=profiles.find((p)=>p.id===id && p.locale===locale);
  const base=members.find((p)=>p.id===id);
  const member=existing ?? base;
  const isNew=id==="__new";
  const options=[...members.map(p=>({id:p.id,name:p.name})), ...profiles.filter(p=>p.locale===locale && !members.some(m=>m.id===p.id)).map(p=>({id:p.id,name:p.name}))];
  const disabled=!connected || !canEdit || pending || uploading || (Boolean(existing?.approved) && !canPublish);
  return <section className="page-shell space-y-6 pb-16">
    <p className="text-sm leading-7 text-muted-foreground">{t("profileHint")}</p>
    {!connected ? <p role="status" className="border-s-2 border-destructive p-4">{t("statusGuide")}</p> : null}
    <label className="block max-w-xl text-sm">{t("chooseProfile")}<select value={id} disabled={pending || uploading} onChange={(e)=>{setId(e.target.value);setMessage("");}} className={field}>{options.map((p)=><option value={p.id} key={p.id}>{p.name}</option>)}<option value="__new">+ {t("newItem")}</option></select></label>
    {member || isNew ? <form key={`${id}-${locale}`} className="space-y-6" onSubmit={async(e)=>{
      e.preventDefault();const data=new FormData(e.currentTarget);setPending(true);setMessage("");
      const value=(key:string)=>String(data.get(key)??"").trim();
      try {const profileId=isNew?value("newId"):id;await saveFacultyProfileAction({id:profileId,locale,name:value("name"),role:value("role"),bio:value("bio"),languages:value("languages"),works:value("works").split("\n").map(x=>x.trim()).filter(Boolean),image:value("image")||undefined,approved:data.get("approved")==="true"});setId(profileId);setMessage(t("saved"));router.refresh();}
      catch {setMessage(t("failed"));}finally{setPending(false);}
    }}>
      <fieldset disabled={disabled} className="grid gap-5 md:grid-cols-2">
        {isNew ? <label className="text-sm">ID / slug<input name="newId" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="teacher-name" className={field}/></label> : null}
        <label className="text-sm">{t("profileName")}<input name="name" required defaultValue={member.name} className={field}/></label>
        <label className="text-sm">{t("profileRole")}<input name="role" required defaultValue={member.role} className={field}/></label>
        <label className="text-sm md:col-span-2">{t("profileBio")}<textarea name="bio" required rows={8} defaultValue={member.bio} className={field}/></label>
        <label className="text-sm">{t("profileLanguages")}<input name="languages" defaultValue={member.languages} className={field}/></label>
        <label className="text-sm">{t("profileWorks")}<textarea name="works" rows={5} defaultValue={member.works?.join("\n")} className={field}/></label>
        {canPublish ? <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="approved" value="true" defaultChecked={existing?.approved}/>{t("approved")}</label> : null}
      </fieldset>
      <MediaField name="image" purpose="cms-image" defaultValue={existing?.image} disabled={disabled} label={t("image")} onBusy={setUploading}/>
      <button disabled={disabled} className="bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-40">{t("save")}</button>
    </form> : null}
    {message ? <p role="status" className="border border-border p-4 text-sm">{message}</p>:null}
  </section>;
}
