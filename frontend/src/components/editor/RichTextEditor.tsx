"use client";

/** Tiptap WYSIWYG for admin section/video descriptions. */

import type { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { useEffect, useState } from "react";

import { RichTextImageExtension } from "@/components/editor/RichTextImageExtension";
import {
  FONT_SIZE_OPTIONS,
  richTextStyleExtensions,
} from "@/components/editor/RichTextFontSizeExtension";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
  placeholder?: string;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-brand-teal text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px bg-gray-300" aria-hidden />;
}

function getHeadingValue(editor: Editor | null) {
  if (!editor) return "p";
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  return "p";
}

function getFontSizeValue(editor: Editor | null) {
  if (!editor) return "";
  const fontSize = editor.getAttributes("textStyle").fontSize as string | undefined;
  return fontSize ?? "";
}

export function RichTextEditor({
  label,
  value,
  onChange,
  error,
  placeholder = "Tulis deskripsi...",
}: RichTextEditorProps) {
  const [, setToolbarRevision] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      RichTextImageExtension,
      ...richTextStyleExtensions,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[120px] px-3 py-2 text-sm text-gray-800 focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const refresh = () => setToolbarRevision((revision) => revision + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  function insertImage() {
    if (!editor) return;
    const url = window.prompt(
      "Link gambar (Google Drive atau imgbb Direct link):",
      "https://drive.google.com/file/d/...",
    );
    if (url === null || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  }

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL tautan:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function setHeading(level: "p" | "h2" | "h3") {
    if (!editor) return;
    if (level === "p") {
      editor.chain().focus().setParagraph().run();
      return;
    }
    editor.chain().focus().setHeading({ level: level === "h2" ? 2 : 3 }).run();
  }

  function setFontSize(fontSize: string) {
    if (!editor) return;
    if (!fontSize) {
      editor.chain().focus().unsetFontSize().run();
      return;
    }
    editor.chain().focus().setFontSize(fontSize).run();
  }

  const fieldId = `rich-text-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      <div
        className={`rich-text-editor overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal-soft ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
          <ToolbarButton
            title="Urungkan"
            disabled={!editor || !editor.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Ulangi"
            disabled={!editor || !editor.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <select
            title="Gaya teks"
            disabled={!editor}
            value={getHeadingValue(editor)}
            onChange={(event) => setHeading(event.target.value as "p" | "h2" | "h3")}
            className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs text-gray-700 outline-none focus:border-brand-teal disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="p">Paragraf</option>
            <option value="h2">Judul 2</option>
            <option value="h3">Judul 3</option>
          </select>

          <select
            title="Ukuran huruf"
            disabled={!editor}
            value={getFontSizeValue(editor)}
            onChange={(event) => setFontSize(event.target.value)}
            className="h-7 rounded border border-gray-300 bg-white px-1.5 text-xs text-gray-700 outline-none focus:border-brand-teal disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="">Ukuran</option>
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ToolbarDivider />

          <ToolbarButton
            title="Tebal"
            active={editor?.isActive("bold")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Miring"
            active={editor?.isActive("italic")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Coret"
            active={editor?.isActive("strike")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Garis bawah"
            active={editor?.isActive("underline")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            title="Rata kiri"
            active={editor?.isActive({ textAlign: "left" })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Rata tengah"
            active={editor?.isActive({ textAlign: "center" })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Rata kanan"
            active={editor?.isActive({ textAlign: "right" })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            title="Daftar bullet"
            active={editor?.isActive("bulletList")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Daftar bernomor"
            active={editor?.isActive("orderedList")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            title="Tambah tautan"
            active={editor?.isActive("link")}
            disabled={!editor}
            onClick={setLink}
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Hapus tautan"
            disabled={!editor || !editor.isActive("link")}
            onClick={() => editor?.chain().focus().unsetLink().run()}
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton title="Sisip gambar" disabled={!editor} onClick={insertImage}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <EditorContent id={fieldId} editor={editor} />
        <p className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500">
          <strong>Gambar:</strong> klik ikon gambar di atas (bukan ikon link). Google Drive → Bagikan →
          Siapa saja dengan link. ImgBB → salin <strong>Direct link</strong> (
          <code className="rounded bg-gray-100 px-1">i.ibb.co/...</code>). Letakkan kursor di antara
          paragraf untuk urutan teks → gambar → teks.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
