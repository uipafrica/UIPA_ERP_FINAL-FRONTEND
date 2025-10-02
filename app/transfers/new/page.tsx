"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transferApi } from "@/lib/api";
import { Folder, FilePlus2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUploadProgress } from "@/lib/hooks/useUploadProgress";
import { UploadProgress } from "@/components/upload/UploadProgress";

export default function NewTransferPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [maxDownloads, setMaxDownloads] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [paths, setPaths] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadMode, setUploadMode] = React.useState<"files" | "folder" | null>(
    null
  );
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const folderInputRef = React.useRef<HTMLInputElement | null>(null);
  const uploadXhrRef = React.useRef<XMLHttpRequest | null>(null);

  const {
    uploadState,
    uploadFiles,
    startUpload,
    updateFileProgress,
    completeFile,
    setFileError,
    completeUpload,
    resetUpload,
  } = useUploadProgress();
  React.useEffect(() => {
    if (folderInputRef.current) {
      (folderInputRef.current as any).setAttribute("webkitdirectory", "");
      (folderInputRef.current as any).setAttribute("directory", "");
    }
  }, []);

  const handleFilesChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
    const rel = selected.map((f: any) => f.webkitRelativePath || "");
    setPaths(rel);
  };
  const handleSelectFiles = () => setUploadMode("files");
  const handleSelectFolder = () => setUploadMode("folder");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title || files.length === 0) {
      toast.error("Please provide a title and select files to upload");
      return;
    }
    try {
      setIsSubmitting(true);

      // Start upload progress tracking
      startUpload(files);

      const res = await transferApi.create(
        {
          title,
          description: description || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
          maxDownloads: maxDownloads ? Number(maxDownloads) : undefined,
          files,
          paths,
        },
        (progress) => {
          // Update overall progress
          updateFileProgress(0, progress);
        }
      );

      // Complete upload
      completeUpload();

      // Show success toast
      toast.success("Transfer created successfully!", {
        description: `Share code: ${(res as any).shortCode}`,
      });

      // Copy share URL to clipboard
      if ((res as any).shareUrl) {
        await navigator.clipboard.writeText((res as any).shareUrl);
        toast.info("Share link copied to clipboard!");
      }

      // Redirect to transfers page after a short delay
      setTimeout(() => {
        router.push("/transfers");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setFileError(0, err?.message || "Upload failed");
      toast.error("Failed to create transfer", {
        description: err?.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelUpload = () => {
    if (uploadXhrRef.current) {
      uploadXhrRef.current.abort();
    }
    resetUpload();
    setIsSubmitting(false);
    toast.info("Upload cancelled");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="">
          {/*  add a back button here */}
          <Button variant="ghost" onClick={() => router.push("/transfers")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Transfer</h1>
            <p className="text-muted-foreground">
              Upload files and create a shareable link
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Transfer</CardTitle>
            <CardDescription>
              Fill in the details and upload files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Upload Progress */}
            <UploadProgress
              isUploading={uploadState.isUploading}
              progress={uploadState.progress}
              currentFile={uploadState.currentFile}
              totalFiles={uploadState.totalFiles}
              completedFiles={uploadState.completedFiles}
              error={uploadState.error}
              uploadFiles={uploadFiles}
              onCancel={handleCancelUpload}
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Upload</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {/* File upload card */}
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                    onClick={handleSelectFiles}
                  >
                    <div
                      className={`rounded-lg p-4 h-full flex items-center justify-between ${
                        uploadMode === "files"
                          ? "bg-primary text-primary-foreground ring-2 ring-primary"
                          : "bg-primary/80 text-primary-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FilePlus2 className="h-6 w-6" />
                        <div>
                          <div className="text-sm font-semibold">
                            Upload Files
                          </div>
                          <div className="text-xs opacity-90">
                            Select one or more files
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                    ref={fileInputRef}
                  />

                  {uploadMode === "files" && files.length > 0 ? (
                    <div className="rounded-lg border p-4 bg-card">
                      <div className="text-sm font-semibold mb-2">
                        Selected Files
                      </div>
                      <ul className="max-h-40 overflow-auto space-y-1 text-sm">
                        {files.map((f, idx) => (
                          <li key={idx} className="truncate" title={f.name}>
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}

                  {/* Folder upload card */}
                  <label
                    htmlFor="folder-upload"
                    className="cursor-pointer"
                    onClick={handleSelectFolder}
                  >
                    <div
                      className={`rounded-lg p-4 h-full flex items-center justify-between ${
                        uploadMode === "folder"
                          ? "bg-primary text-primary-foreground ring-2 ring-primary"
                          : "bg-primary/80 text-primary-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="h-6 w-6" />
                        <div>
                          <div className="text-sm font-semibold">
                            Upload Folder
                          </div>
                          <div className="text-xs opacity-90">
                            Preserves subfolders
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                  {/* Using vendor attribute to pick directories in Chromium */}
                  <input
                    id="folder-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                    ref={folderInputRef}
                  />
                  {uploadMode === "folder" && files.length > 0 ? (
                    <div className="rounded-lg border p-4 bg-card">
                      <div className="text-sm font-semibold mb-2">
                        Selected Folder Items
                      </div>
                      <ul className="max-h-40 overflow-auto space-y-1 text-sm">
                        {files.map((f: any, idx) => (
                          <li
                            key={idx}
                            className="truncate"
                            title={f.webkitRelativePath || f.name}
                          >
                            {f.webkitRelativePath || f.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>
                {files.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {files.length} item(s) selected
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiry (optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDownloads">Max Downloads (optional)</Label>
                  <Input
                    id="maxDownloads"
                    inputMode="numeric"
                    value={maxDownloads}
                    onChange={(e) => setMaxDownloads(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title || files.length === 0}
                >
                  {isSubmitting ? "Creating..." : "Create Transfer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/transfers")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
