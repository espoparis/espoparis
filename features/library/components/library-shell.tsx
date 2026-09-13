"use client";

import { useMemo, useState } from "react";
import { BookOpen, Download, Filter, LibraryBig, Search, ShieldCheck, Tags } from "lucide-react";
import type { PublishedBookMetadata } from "@/server/platform/types";

export type LibraryCopy = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  allCategories: string;
  categories: string[];
  emptyTitle: string;
  emptyDescription: string;
  readerLabel: string;
  downloadLabel: string;
  capabilitiesTitle: string;
  capabilities: { title: string; description: string; icon: "reader" | "metadata" | "access" }[];
  metadataLabel: string;
};

const capabilityIcons = { reader: BookOpen, metadata: Tags, access: ShieldCheck };

export function LibraryShell({ copy, books }: { copy: LibraryCopy; books: PublishedBookMetadata[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(copy.allCategories);
  const hasFilters = useMemo(() => query.trim().length > 0 || category !== copy.allCategories, [query, category, copy.allCategories]);
  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === copy.allCategories || book.category === category;
      const haystack = `${book.title} ${book.author} ${book.category} ${book.language}`.toLocaleLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [books, category, copy.allCategories, query]);

  return (
    <div className="page-shell pb-24 pt-12 sm:pt-16 lg:pb-32 lg:pt-20">
      <header className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1.1] tracking-[-.025em]">{copy.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
      </header>

      <div className="mx-auto mt-12 max-w-6xl rounded-sm border border-border/70 bg-card/80 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className="h-12 w-full rounded-sm border border-border bg-background ps-12 pe-4 text-sm outline-none ring-primary/20 transition focus:ring-4"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:max-w-[52%]">
            <Filter className="size-4 shrink-0 text-primary" />
            {[copy.allCategories, ...copy.categories].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-sm border px-4 py-2 text-sm transition ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-sm border border-border/70 bg-card p-6 sm:p-8">
          {filteredBooks.length === 0 ? (
            <div className="border-dashed border-border bg-secondary/20 p-6 text-center sm:p-8">
              <div className="mx-auto flex size-14 items-center justify-center rounded-sm bg-primary/10 text-primary"><LibraryBig className="size-6" /></div>
              <h2 className="mt-5 font-display text-2xl font-semibold">{copy.emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{copy.emptyDescription}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                <span className="inline-flex items-center gap-2"><BookOpen className="size-4" />{copy.readerLabel}</span>
                <span className="inline-flex items-center gap-2"><Download className="size-4" />{copy.downloadLabel}</span>
              </div>
              <p className="mt-5 text-xs text-muted-foreground/70">{copy.metadataLabel}</p>
              <p className="sr-only">{hasFilters ? `${query} ${category}` : ""}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredBooks.map((book) => (
                <article key={book.id} className="border-t border-border p-5">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">{book.category} · {book.language}</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold">{book.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{book.author}</p>
                  {book.description ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{book.description}</p> : null}
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-sm bg-[#082e24] p-7 text-white sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#d7b56d]">{copy.eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold">{copy.capabilitiesTitle}</h2>
          <div className="mt-7 space-y-4">
            {copy.capabilities.map((item) => {
              const Icon = capabilityIcons[item.icon];
              return (
                <article key={item.title} className="border-t border-white/25 p-5">
                  <Icon className="size-5 text-[#e2c27b]" />
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
