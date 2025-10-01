"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transferApi } from "@/lib/api";
import { Folder, FileText, ChevronDown, ChevronUp, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TransferFile {
  id: string;
  name: string;
  originalName?: string;
  size: number;
  sizeBytes?: number;
  relativePath?: string;
}

interface Transfer {
  id: string;
  title: string;
  shortCode: string;
  files?: TransferFile[];
}

export default function TransfersPage() {
  const [items, setItems] = React.useState<Transfer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [foldersExpanded, setFoldersExpanded] = React.useState(true);
  const [filesExpanded, setFilesExpanded] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [transferToDelete, setTransferToDelete] = React.useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadTransfers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await transferApi.listMy();
      console.log("API Response:", res);
      console.log("Transfers:", res?.transfers);
      setItems(res?.transfers || []);
    } catch (e: any) {
      console.error("Error loading transfers:", e);
      setError(e?.message || "Failed to load transfers");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

  const handleDeleteClick = (id: string, title: string) => {
    setTransferToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transferToDelete) return;

    console.log("Deleting transfer:", transferToDelete);
    console.log("Transfer ID:", transferToDelete.id);

    try {
      setDeleting(true);
      const result = await transferApi.delete(transferToDelete.id);
      console.log("Delete result:", result);

      // Remove the deleted transfer from the list
      setItems((prev) =>
        prev.filter((item) => item.id !== transferToDelete.id)
      );

      // Show success toast
      toast.success("Transfer deleted successfully!", {
        description: `"${transferToDelete.title}" has been removed`,
      });

      setDeleteDialogOpen(false);
      setTransferToDelete(null);
    } catch (e: any) {
      console.error("Error deleting transfer:", e);
      toast.error("Failed to delete transfer", {
        description: e?.message || "Please try again",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Function to organize ALL files from ALL transfers into folders and individual files
  const organizeAllFiles = () => {
    const folders: {
      [key: string]: {
        files: TransferFile[];
        transferTitle: string;
        shortCode: string;
      };
    } = {};
    const individualFiles: (TransferFile & {
      transferTitle: string;
      shortCode: string;
    })[] = [];

    console.log("Items:", items);

    items.forEach((transfer) => {
      const files = transfer.files || [];
      files.forEach((file) => {
        const relativePath = file.relativePath || "";
        if (relativePath) {
          // File has a path, it's part of a folder
          const folderName = relativePath.split("/")[0];
          if (!folders[folderName]) {
            folders[folderName] = {
              files: [],
              transferTitle: transfer.title,
              shortCode: transfer.shortCode,
            };
          }
          folders[folderName].files.push(file);
        } else {
          // File without path is an individual file
          individualFiles.push({
            ...file,
            transferTitle: transfer.title,
            shortCode: transfer.shortCode,
          });
        }
      });
    });

    return { folders, individualFiles };
  };

  const { folders, individualFiles } = organizeAllFiles();
  const folderNames = Object.keys(folders);
  const hasFolders = folderNames.length > 0;
  const hasFiles = individualFiles.length > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
            <p className="text-muted-foreground">
              Create shareable links for large files
            </p>
          </div>
          <Button asChild>
            <Link href="/transfers/new">New Transfer</Link>
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Loading…</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">No transfers yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Folders Section */}
            {hasFolders && (
              <Card>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setFoldersExpanded(!foldersExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-6 w-6 text-yellow-500" />
                      <CardTitle>Folders</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFoldersExpanded(!foldersExpanded);
                      }}
                    >
                      {foldersExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>
                    {folderNames.length} folder
                    {folderNames.length !== 1 ? "s" : ""} transferred
                  </CardDescription>
                </CardHeader>
                {foldersExpanded && (
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {folderNames.map((folderName) => {
                        const folderData = folders[folderName];
                        const transfer = items.find(
                          (t) => t.shortCode === folderData.shortCode
                        );
                        return (
                          <div
                            key={folderName}
                            className="relative flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <button
                              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (transfer) {
                                  handleDeleteClick(
                                    transfer.id,
                                    transfer.title
                                  );
                                }
                              }}
                              title="Delete transfer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div
                              className="flex flex-col items-center cursor-pointer w-full"
                              onClick={() =>
                                window.open(
                                  `/t/${folderData.shortCode}`,
                                  "_blank"
                                )
                              }
                            >
                              <Folder className="h-16 w-16 text-yellow-500 mb-3 group-hover:scale-110 transition-transform" />
                              <p
                                className="text-sm font-medium text-center truncate w-full"
                                title={folderName}
                              >
                                {folderName}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Files Section */}
            {hasFiles && (
              <Card>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setFilesExpanded(!filesExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <CardTitle>Files</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilesExpanded(!filesExpanded);
                      }}
                    >
                      {filesExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>
                    {individualFiles.length} file
                    {individualFiles.length !== 1 ? "s" : ""} transferred
                  </CardDescription>
                </CardHeader>
                {filesExpanded && (
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {individualFiles.map((file) => {
                        const fileName = file.originalName || file.name;
                        const transfer = items.find(
                          (t) => t.shortCode === file.shortCode
                        );

                        return (
                          <div
                            key={file.id}
                            className="relative flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <button
                              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (transfer) {
                                  handleDeleteClick(
                                    transfer.id,
                                    transfer.title
                                  );
                                }
                              }}
                              title="Delete transfer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div
                              className="flex flex-col items-center cursor-pointer w-full"
                              onClick={() =>
                                window.open(`/t/${file.shortCode}`, "_blank")
                              }
                            >
                              <FileText className="h-16 w-16 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                              <p
                                className="text-sm font-medium text-center truncate w-full"
                                title={fileName}
                              >
                                {fileName}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {!hasFolders && !hasFiles && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    No files or folders transferred yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the transfer "
              <strong>{transferToDelete?.title}</strong>"? This will permanently
              delete all associated files and access logs. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
