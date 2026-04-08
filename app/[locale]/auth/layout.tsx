import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <style>{`
        [data-site-header],
        [data-site-footer],
        .app-grid {
          display: none !important;
        }

        [data-site-main] {
          padding-top: 0 !important;
        }
      `}</style>
      <div className="min-h-screen">{children}</div>
    </>
  );
}
