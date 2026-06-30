/** Tombol ↑ ↓ untuk ubah urutan materi atau video di admin. */

import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ReorderButtonsProps {
  onReorder: (direction: "up" | "down") => void;
  disabled?: boolean;
}

export function ReorderButtons({ onReorder, disabled = false }: ReorderButtonsProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="secondary"
        className="px-2 py-1"
        onClick={() => onReorder("up")}
        disabled={disabled}
        aria-label="Naikkan urutan"
        title="Naikkan"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        className="px-2 py-1"
        onClick={() => onReorder("down")}
        disabled={disabled}
        aria-label="Turunkan urutan"
        title="Turunkan"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
