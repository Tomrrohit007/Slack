"use client";
import React from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Toolbar } from "@/components/toolbar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { parentMessageId, onCloseMessage } = usePanel();
  const showPanel = !!parentMessageId;
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                Load thread
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
