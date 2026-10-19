import Link from "next/link";

const styles = {
  solid: "bg-brand text-brand-foreground",
  outline: "border-2 border-brand text-brand bg-transparent",
};

type Variant = keyof typeof styles;

const base =
  "flex w-full items-center justify-center rounded-brand px-4 py-3 text-center font-semibold transition active:scale-[0.98] disabled:opacity-60";

export function ButtonLink({
  href,
  variant = "solid",
  children,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "solid",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
