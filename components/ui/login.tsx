"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { AuthSplitShell } from "@/components/ui/auth-split-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AuthFormSplitScreenProps {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  onSubmit: (data: FormValues) => void | Promise<void>;
  forgotPasswordHref: string;
  createAccountHref: string;
  submitLabel: string;
  pendingLabel: string;
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  rememberMeLabel: string;
  forgotPasswordLabel: string;
  noAccountText: string;
  createAccountText: string;
  error?: string;
  visualEyebrow: string;
  visualTitle: string;
  visualDescription: string;
}

export function AuthFormSplitScreen({
  locale,
  eyebrow,
  title,
  description,
  onSubmit,
  forgotPasswordHref,
  createAccountHref,
  submitLabel,
  pendingLabel,
  emailLabel,
  passwordLabel,
  emailPlaceholder,
  passwordPlaceholder,
  rememberMeLabel,
  forgotPasswordLabel,
  noAccountText,
  createAccountText,
  error,
  visualEyebrow,
  visualTitle,
  visualDescription,
}: AuthFormSplitScreenProps) {
  const [isLoading, startTransition] = React.useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    startTransition(async () => {
      await onSubmit(data);
    });
  };

  return (
    <AuthSplitShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      visualEyebrow={visualEyebrow}
      visualTitle={visualTitle}
      visualDescription={visualDescription}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          {noAccountText}{" "}
          <Link
            href={createAccountHref}
            locale={locale}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            {createAccountText}
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <input type="hidden" name="locale" value={locale} />

        <div className="space-y-2">
          <Label htmlFor="email">{emailLabel}</Label>
          <Input
            id="email"
            type="email"
            placeholder={emailPlaceholder}
            autoComplete="email"
            disabled={isLoading}
            size="lg"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{passwordLabel}</Label>
          <Input
            id="password"
            type="password"
            placeholder={passwordPlaceholder}
            autoComplete="current-password"
            disabled={isLoading}
            size="lg"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={form.watch("rememberMe")}
              onCheckedChange={(checked) => form.setValue("rememberMe", Boolean(checked))}
              disabled={isLoading}
            />
            <span>{rememberMeLabel}</span>
          </label>

          <Link
            href={forgotPasswordHref}
            locale={locale}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {forgotPasswordLabel}
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
            {error}
          </div>
        ) : null}

        <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? pendingLabel : submitLabel}
        </Button>
      </form>
    </AuthSplitShell>
  );
}

export type { FormValues };
