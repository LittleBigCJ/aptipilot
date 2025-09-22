"use client";

import { useEffect } from "react";

export default function AutoSubmit({ formSelector }: { formSelector: string }) {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(formSelector);
    if (form) form.requestSubmit?.();
  }, [formSelector]);

  return null;
}
