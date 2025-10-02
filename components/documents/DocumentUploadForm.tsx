"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadProgress } from "@/lib/hooks/useUploadProgress";
import { UploadProgress } from "@/components/upload/UploadProgress";

interface DocumentUploadFormProps {
  onUploadComplete?: (document: any) => void;
  onCancel?: () => void;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  onUploadComplete,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "policy" | "procedure" | "form" | "report" | "contract" | "other"
  >("other");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !selectedFile) {
      toast.error("Please provide a title and select a file");
      return;
    }

    try {
      setIsUploading(true);

      // Start upload progress tracking
      startUpload([selectedFile]);

      // Create form data
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("department", department);
      formData.append("type", "report"); // Default type
      formData.append("subType", "general"); // Default subType

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          updateFileProgress(0, progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            completeUpload();
            toast.success("Document uploaded successfully!");
            onUploadComplete?.(response);
            resetUpload();
            setTitle("");
            setDescription("");
            setDepartment("");
            setSelectedFile(null);
          } catch (error) {
            setFileError(0, "Invalid response format");
            toast.error("Upload failed: Invalid response");
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            setFileError(0, errorData.error || "Upload failed");
            toast.error("Upload failed", {
              description: errorData.error || "Please try again",
            });
          } catch {
            setFileError(0, "Upload failed");
            toast.error("Upload failed");
          }
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        setFileError(0, "Network error");
        toast.error("Upload failed: Network error");
        setIsUploading(false);
      });

      xhr.open("POST", "/api/documents");
      xhr.withCredentials = true;
      xhr.send(formData);
    } catch (error: any) {
      console.error(error);
      setFileError(0, error?.message || "Upload failed");
      toast.error("Upload failed", {
        description: error?.message || "Please try again",
      });
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    resetUpload();
    setIsUploading(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="policy">Policy</option>
                  <option value="procedure">Procedure</option>
                  <option value="form">Form</option>
                  <option value="report">Report</option>
                  <option value="contract">Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Document File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  required
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isUploading || !title || !selectedFile || !department}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      <UploadProgress
        isUploading={uploadState.isUploading}
        progress={uploadState.progress}
        currentFile={uploadState.currentFile}
        totalFiles={uploadState.totalFiles}
        completedFiles={uploadState.completedFiles}
        error={uploadState.error}
        uploadFiles={uploadFiles}
        onCancel={handleCancel}
      />
    </div>
  );
};
