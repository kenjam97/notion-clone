"use client";

import { cn } from "@/lib/utils";
import {
  Archive,
  ChevronsLeftIcon,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

export const Navigation = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearch();
  const settings = useSettings();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const createDocument = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    } else {
      resetSidebarWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [pathname, isMobile]);

  const handleNavbarMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleNavbarMouseMove);
    document.addEventListener("mouseup", handleNavbarMouseUp);
  };

  const handleNavbarMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleNavbarMouseUp = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleNavbarMouseMove);
    document.removeEventListener("mouseup", handleNavbarMouseUp);
  };

  const resetSidebarWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapseSidebar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleCreateDocument = () => {
    const promise = createDocument({ title: "Untitled" }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new document...",
      success: "Successfully created a new document",
      error: "Failed to create a new document",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapseSidebar}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeftIcon className="w-6 h-6" />
        </div>
        <div>
          <UserItem />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />
          <Item onClick={settings.onOpen} label="Settings" icon={Settings} />
          <Item
            onClick={handleCreateDocument}
            label="New document"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item
            onClick={handleCreateDocument}
            label="New document"
            icon={Plus}
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Archive" icon={Archive} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleNavbarMouseDown}
          onClick={resetSidebarWidth}
          className="absolute top-0 right-0 w-1 h-full transition opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize bg-primary/10"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebarWidth} />
        ) : (
          <nav className="w-full px-3 py-2 bg-transparent">
            {isCollapsed && (
              <MenuIcon
                role="button"
                onClick={resetSidebarWidth}
                className="w-6 h-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
