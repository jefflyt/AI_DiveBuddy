"use client";

import React, { useState, useRef, useEffect } from "react";

type DropdownProps = {
  triggerLabel?: string;
  children: React.ReactNode;
};

export default function Dropdown({ triggerLabel = "Open", children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-sm"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-white shadow-lg dark:bg-card">
          <div className="flex flex-col p-2">{children}</div>
        </div>
      )}
    </div>
  );
}
