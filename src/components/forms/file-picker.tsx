"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { validateImageFile } from "@/lib/gallery";
import { Button } from "@/components/ui/button";

interface FilePickerProps {
  name: string;
  label?: string;
}

export function FilePicker({ name, label = "Seleccionar imagen" }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setFileName(null);
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      setFileName(null);
      e.target.value = "";
      return;
    }

    setError(null);
    setFileName(file.name);
  }

  return (
    <div className="space-y-2 px-6">
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={16} />
          {label}
        </Button>

        <span className="max-w-50 truncate text-sm text-muted-foreground">
          {fileName ?? "Ningún archivo elegido"}
        </span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPG, PNG o WEBP. Hasta 5MB.
      </p>
    </div>
  );
}
