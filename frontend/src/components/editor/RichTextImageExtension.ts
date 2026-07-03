/** Tiptap Image — simpan URL asli (Drive/imgbb), tampilkan seperti di kuis. */

import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { getDisplayImageCandidates } from "@/lib/image";

export const RichTextImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("data-original-src") || element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return {
            src: getDisplayImageCandidates(attributes.src)[0],
            "data-original-src": attributes.src,
          };
        },
      },
      alt: {
        default: "Gambar ilustrasi",
        parseHTML: (element) => element.getAttribute("alt") || "Gambar ilustrasi",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const el = element as HTMLElement;
          return {
            src: el.getAttribute("data-original-src") || el.getAttribute("src"),
            alt: el.getAttribute("alt") || "Gambar ilustrasi",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        class: "rich-text-editor-image",
        referrerPolicy: "no-referrer",
      }),
    ];
  },
}).configure({
  inline: false,
  allowBase64: false,
});
