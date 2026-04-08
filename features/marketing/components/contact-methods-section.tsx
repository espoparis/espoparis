import { Mail, MapPin, Phone, Users2 } from "lucide-react";

type ContactMethod = {
  title: string;
  description: string;
  value: string;
  href: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  methods: ContactMethod[];
};

const icons = [Mail, Users2, Phone, MapPin];

export function ContactMethodsSection({
  eyebrow,
  title,
  description,
  methods,
}: Props) {
  return (
    <section id="contact-methods" className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60 md:grid-cols-2">
          {methods.map((method, index) => {
            const Icon = icons[index] ?? Mail;

            return (
              <a
                key={method.title}
                href={method.href}
                className="group bg-background/82 p-7 transition-colors hover:bg-background/94 sm:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="public-card-heading mt-5">
                  {method.title}
                </h3>
                <p className="public-card-copy mt-3 max-w-md">
                  {method.description}
                </p>
                <p className="mt-5 text-base font-medium text-primary sm:text-lg">
                  {method.value}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
