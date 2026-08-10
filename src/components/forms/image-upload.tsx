"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import {
  uploadGalleryImage,
  type UploadImageState,
} from "@/features/veterinarians/actions/upload-gallery-image";
import { deleteGalleryImage } from "@/features/veterinarians/actions/delete-gallery-image";
import { validateImageFile } from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface ImageUploadProps {
  veterinarianId: string;
  images: { id: string; image_url: string }[];
}

const initialState: UploadImageState = { error: null };

export function ImageUpload({ veterinarianId, images }: ImageUploadProps) {
  const [state, formAction, isPending] = useActionState(
    uploadGalleryImage,
    initialState,
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      setClientError(error);
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setClientError(null);
    setSelectedFile(file);
  }

  function handleUpload() {
    if (!selectedFile) {
      setClientError("Elegí una foto para subir.");
      return;
    }

    const fd = new FormData();
    fd.append("veterinarian_id", veterinarianId);
    fd.append("file", selectedFile);

    setClientError(null);
    startTransition(() => {
      formAction(fd);
    });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    // No usa <form> a propósito: esto vive anidado dentro del form principal
    // de VeterinarianForm, y HTML no permite forms anidados.
    <div className="space-y-4">
      <h2 className="text-sm font-medium">Fotos</h2>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <img
                src={image.image_url}
                alt=""
                className="aspect-square w-full rounded-lg border object-cover"
              />
              <div className="absolute top-1 right-1">
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive" size="icon-sm">
                      ×
                    </Button>
                  }
                  title="Eliminar foto"
                  description="Esta foto se borra del almacenamiento y no se puede deshacer. ¿Confirmás?"
                  action={deleteGalleryImage.bind(
                    null,
                    veterinarianId,
                    image.id,
                    image.image_url,
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={16} />
          Seleccionar imagen
        </Button>

        <span className="max-w-50 truncate text-sm text-muted-foreground">
          {selectedFile ? selectedFile.name : "Ningún archivo elegido"}
        </span>

        <Button
          type="button"
          variant="outline"
          onClick={handleUpload}
          disabled={!selectedFile || isPending}
        >
          {isPending ? "Subiendo..." : "Subir foto"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPG, PNG o WEBP. Hasta 5MB.
      </p>

      {(clientError || state.error) && (
        <p className="text-sm text-destructive">
          {clientError ?? state.error}
        </p>
      )}
    </div>
  );
}
