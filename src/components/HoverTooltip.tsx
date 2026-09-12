"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type TooltipPos = {
  top: number;
  left: number;
};

type HoverTooltipProps = {
  className?: string;
  label: string;
  children: ReactNode;
  content: ReactNode;
};

export function HoverTooltip({
  className,
  label,
  children,
  content,
}: HoverTooltipProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPos | null>(null);

  useLayoutEffect(() => {
    if (!open || !slotRef.current) {
      setPos(null);
      return;
    }

    function update() {
      const slot = slotRef.current;
      if (!slot) return;
      const rect = slot.getBoundingClientRect();
      setPos({ top: rect.bottom - 12, left: rect.right - 12 });
    }

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const tooltip =
    open && pos
      ? createPortal(
          <div
            className="talent-tooltip"
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
          >
            {content}
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={slotRef}
      className={className}
      aria-label={label}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {tooltip}
    </div>
  );
}
