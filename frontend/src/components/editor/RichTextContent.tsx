"use client";

/** Render deskripsi rich text — teks + gambar (link Drive/imgbb, sama seperti kuis). */

import DOMPurify from "isomorphic-dompurify";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { parseRichTextHtmlToReact } from "@/components/editor/richTextDom";
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
    "img",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "style", "src", "alt", "data-original-src", "class"],
};

interface RichTextContentProps {
  html: string | null | undefined;
  className?: string;
  fallback?: ReactNode;
}

export function RichTextContent({ html, className = "", fallback = null }: RichTextContentProps) {
  const [mounted, setMounted] = useState(false);

  const cleanHtml = useMemo(() => {
    if (isEmptyRichText(html)) return "";
    return DOMPurify.sanitize(html!, {
      ...SANITIZE_CONFIG,
      ADD_ATTR: ["target", "rel", "data-original-src"],
    });
  }, [html]);

  const nodes = useMemo(() => {
    if (!mounted || !cleanHtml) return null;
    return parseRichTextHtmlToReact(cleanHtml);
  }, [mounted, cleanHtml]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isEmptyRichText(html)) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className={`rich-text-content text-sm leading-relaxed ${className}`}>
      {nodes ?? <p className="text-xs text-gray-400">Memuat konten...</p>}
    </div>
  );
}
