"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing document...",
      success: "Document removed!",
      error: "Failed to remove document.",
    });

    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored!",
      error: "Failed to restore document.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 text-sm text-center text-white bg-rose-500 gap-x-2">
      <p>This document is archived.</p>
      <div className="flex items-center justify-center mt-2 gap-x-2">
        <Button
          size="sm"
          onClick={onRestore}
          variant="outline"
          className="h-auto p-1 px-2 font-normal text-white bg-transparent border-white hover:bg-primary/5 hover:text-white"
        >
          Restore document
        </Button>
        <ConfirmModal onConfirm={onRemove}>
          <Button
            size="sm"
            variant="outline"
            className="h-auto p-1 px-2 font-normal text-white bg-transparent border-white hover:bg-primary/5 hover:text-white"
          >
            Delete forever
          </Button>
        </ConfirmModal>
      </div>
    </div>
  );
};
