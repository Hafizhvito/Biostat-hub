/** Ubah HTML aman menjadi React nodes — gambar pakai logika yang sama dengan kuis. */

import { createElement, type CSSProperties, type ReactNode } from "react";

import { QuizQuestionImage } from "@/components/quiz/QuizQuestionImage";

const VOID_TAGS = new Set(["br", "img"]);

function parseInlineStyle(style: string): CSSProperties {
  const result: Record<string, string> = {};
  style.split(";").forEach((rule) => {
    const colonIndex = rule.indexOf(":");
    if (colonIndex === -1) return;
    const prop = rule.slice(0, colonIndex).trim();
    const value = rule.slice(colonIndex + 1).trim();
    if (!prop || !value) return;
    const camelProp = prop.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    result[camelProp] = value;
  });
  return result as CSSProperties;
}

function domNodeToReact(node: ChildNode, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "img") {
    const src = element.getAttribute("data-original-src") || element.getAttribute("src") || "";
    if (!src) return null;
    return (
      <QuizQuestionImage
        key={key}
        url={src}
        alt={element.getAttribute("alt") || "Gambar ilustrasi"}
        className="mx-auto max-h-[28rem] w-full rounded-lg object-contain"
      />
    );
  }

  const children = Array.from(element.childNodes)
    .map((child, childIndex) => domNodeToReact(child, childIndex))
    .filter((child) => child !== null);

  const props: Record<string, string | number | CSSProperties> = { key };

  if (element.className) {
    props.className = element.className;
  }

  const style = element.getAttribute("style");
  if (style) {
    props.style = parseInlineStyle(style);
  }

  if (tag === "a") {
    const href = element.getAttribute("href");
    if (href) props.href = href;
    const target = element.getAttribute("target");
    if (target) props.target = target;
    const rel = element.getAttribute("rel");
    if (rel) props.rel = rel;
  }

  if (VOID_TAGS.has(tag)) {
    return createElement(tag, props);
  }

  return createElement(tag, props, ...children);
}

export function parseRichTextHtmlToReact(html: string): ReactNode[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.body.childNodes)
    .map((node, index) => domNodeToReact(node, index))
    .filter((node) => node !== null);
}
