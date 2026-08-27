import type { ReactNode } from "react";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "materialize" | "mask-up" | "sweep";

export function Reveal({
  children,
  className,
  variant = "mask-up",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  variant?: Variant | undefined;
  delay?: number;
  as?: "div" | "section" | "li" | "h2" | "p" | "span";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const anim =
    variant === "materialize"
      ? "anim-materialize"
      : variant === "sweep"
        ? "anim-sweep"
        : "anim-mask-up";

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      className={cn(className, inView ? anim : "opacity-0")}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
