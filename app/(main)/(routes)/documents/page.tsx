"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();

  const createDocumentMutation = useMutation(api.documents.create);

  const createDocument = () => {
    const promise = createDocumentMutation({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating document...",
      success: "New document created!",
      error: "Failed to create document.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.emailAddresses[0].emailAddress}&apos;s Jotion
      </h2>
      <Button onClick={createDocument}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a document
      </Button>
    </div>
  );
};

export default DocumentsPage;
