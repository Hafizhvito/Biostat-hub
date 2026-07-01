/** Sanitized HTML output for section/video descriptions. */

import type { ReactNode } from "react";
import DOMPurify from "isomorphic-dompurify";

import { isEmptyRichText } from "@/lib/rich-text";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "del",
    "strike",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "style"],
};

interface RichTextContentProps {
  html: string | null | undefined;
  className?: string;
  fallback?: ReactNode;
}

export function RichTextContent({ html, className = "", fallback = null }: RichTextContentProps) {
  if (isEmptyRichText(html)) {
    return fallback ? <>{fallback}</> : null;
  }

  const clean = DOMPurify.sanitize(html!, {
    ...SANITIZE_CONFIG,
    ADD_ATTR: ["target", "rel"],
  });

  return (
    <div
      className={`rich-text-content text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
