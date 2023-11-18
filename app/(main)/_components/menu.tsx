"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Archive, MoreHorizontal, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
  documentId: Id<"documents">;
  isArchived: boolean;
}

export const Menu = ({ documentId, isArchived }: MenuProps) => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Archiving...",
      success: "Document archived",
      error: "Failed to archive document",
    });
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring...",
      success: "Document restored",
      error: "Failed to restore document",
    });
  };

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing...",
      success: "Document removed",
      error: "Failed to remove document",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        {!isArchived && (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
        )}
        {isArchived && (
          <DropdownMenuItem onClick={onRestore}>
            <Undo className="w-4 h-4 mr-2" />
            Restore
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onRemove}>
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="w-10 h-10" />;
};
