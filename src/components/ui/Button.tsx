import { forwardRef } from "react";
import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  href?: string;
  children: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", href, children, className = "", ...props }, ref) {
    const base = variant === "primary" ? "btn-primary" : "btn-secondary";
    const cls = `${base} ${className}`.trim();
    if (href) {
      return (
        <Link href={href} className={cls} ref={ref as React.Ref<HTMLAnchorElement>}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" className={cls} ref={ref as React.Ref<HTMLButtonElement>} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }
);
