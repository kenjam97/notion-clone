"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your ideas, Documents, and conversations live together. Welcome to{" "}
        <span className="underline">Jotion</span>.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Jotion is a new way to work. <br />
        collaborate on ideas, together.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Jotion
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isLoading && !isAuthenticated && (
        <SignInButton mode="modal">
          <Button>
            Get Jotion free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
