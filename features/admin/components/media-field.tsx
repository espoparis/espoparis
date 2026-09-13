"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { uploadMediaAction } from "@/features/admin/media-actions";
import type { UploadPurpose } from "@/server/media/files";

async function prepareImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("image");
    context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("image")), "image/jpeg", 0.85));
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } finally { bitmap.close(); }
}
export function MediaField({ name, purpose, defaultValue = "", disabled = false, label, onBusy }: {
  name: string; purpose: UploadPurpose; defaultValue?: string; disabled?: boolean; label: string; onBusy?: (busy: boolean) => void;
}) {
  const t = useTranslations("adminOperations");
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const image = purpose !== "book-pdf";
  const folder = purpose === "book-pdf" ? "1SvUs5GA91RweQkJACbZhe5oIX0r0cczh" : "1pWWG3AI0NpnPyROc5TCSONTN59flIZGc";
  return <div className="space-y-3 border-t border-border pt-4">
    <p className="text-sm font-medium">{label}</p>
    <input type="hidden" name={name} value={value} />
    <label className="block text-sm">{busy ? t("uploading") : t("upload")}
      <input type="file" accept={image ? "image/jpeg,image/png,image/webp" : "application/pdf"} disabled={disabled || busy} className="mt-2 block w-full text-sm file:me-3 file:border file:border-border file:bg-secondary file:px-4 file:py-2" onChange={async (event) => {
        const input = event.currentTarget; const chosen = input.files?.[0]; if (!chosen) return;
        setBusy(true); onBusy?.(true); setError("");
        try {
          if (chosen.size > (image ? 15 * 1024 * 1024 : 3 * 1024 * 1024)) throw new Error("size");
          if (image && !["image/jpeg", "image/png", "image/webp"].includes(chosen.type)) throw new Error("type");
          const file = image ? await prepareImage(chosen) : chosen;
          const data = new FormData(); data.set("file", file); data.set("purpose", purpose);
          const result = await uploadMediaAction(data);
          if (!result.value) throw new Error(result.error);
          setValue(result.value);
        } catch { setError(t("uploadFailed")); }
        finally { setBusy(false); onBusy?.(false); input.value = ""; }
      }} />
    </label>
    <p className="text-xs leading-6 text-muted-foreground">{t(image ? "uploadHint" : "pdfHint")}</p>
    {purpose !== "cms-image" ? <>
      <label className="block text-sm">{t("fileReference")}<input dir="ltr" value={value} onChange={(event) => setValue(event.target.value)} disabled={disabled || busy} className="mt-2 w-full rounded-sm border border-border bg-background p-3" /></label>
      <a href={`https://drive.google.com/drive/folders/${folder}`} target="_blank" rel="noopener noreferrer" className="inline-block text-sm underline underline-offset-4">{t("driveFolder")}</a>
    </> : <>
      {value ? <div className="flex items-start gap-4">
        {/* Native image avoids remote image configuration and preserves posters. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt={label} className="max-h-48 max-w-full object-contain" />
        <button type="button" disabled={disabled || busy} onClick={() => setValue("")} className="text-sm underline">{t("clear")}</button>
      </div> : null}
    </>}
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
  </div>;
}
