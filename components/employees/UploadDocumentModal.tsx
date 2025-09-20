"use client";

import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, File, X } from "lucide-react";
import { employeeApi } from "@/lib/api";
import { toast } from "sonner";

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
}

const DOCUMENT_TYPES = [
  { value: "idCard", label: "ID Card", requiresName: false },
  { value: "resume", label: "Resume", requiresName: false },
  { value: "contract", label: "Contract", requiresName: true },
  { value: "certificate", label: "Certificate", requiresName: true },
];

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const selectedDocType = DOCUMENT_TYPES.find(
    (type) => type.value === documentType
  );

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      type,
      name,
    }: {
      file: File;
      type: string;
      name?: string;
    }) =>
      employeeApi.uploadDocument(
        employee._id || employee.id,
        file,
        type,
        name,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["employee", employee._id || employee.id],
      });
      toast.success(`${selectedDocType?.label} uploaded successfully`);
      handleClose();
    },
    onError: (error: any) => {
      console.error("Failed to upload document:", error);
      toast.error(error?.message || "Failed to upload document");
    },
  });

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "File type not allowed. Please upload PDF, Word documents, or images.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size too large. Maximum size is 10MB.";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedFile(file);

    // Auto-set document name for types that require it
    if (selectedDocType?.requiresName && !documentName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocumentName(nameWithoutExt);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (selectedDocType?.requiresName && !documentName.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    uploadMutation.mutate(
      {
        file: selectedFile,
        type: documentType,
        name: selectedDocType?.requiresName ? documentName.trim() : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["employee", employee._id || employee.id],
          });
          toast.success(`${selectedDocType?.label} uploaded successfully`);
          handleClose();
        },

        onError: (error: any) => {
          console.error("Failed to upload document:", error);
          toast.error(error?.message || "Failed to upload document");
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      setDocumentType("");
      setDocumentName("");
      setSelectedFile(null);
      setDragActive(false);
      onOpenChange(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for {employee?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="documentType">Document Type *</Label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => {
                  setDocumentType(e.target.value);
                  setDocumentName("");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={uploadMutation.isPending}
                required
              >
                <option value="">Select document type</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedDocType?.requiresName && (
              <div>
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder={`Enter ${selectedDocType.label.toLowerCase()} name`}
                  disabled={uploadMutation.isPending}
                  required
                />
              </div>
            )}

            <div>
              <Label>File *</Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                } ${
                  uploadMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeSelectedFile}
                      disabled={uploadMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadMutation.isPending}
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, or Image files up to 10MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_FILE_TYPES.join(",")}
                  onChange={handleFileInputChange}
                  disabled={uploadMutation.isPending}
                />
              </div>
            </div>
          </div>

          {uploadMutation.error && (
            <div className="text-sm text-destructive">
              {uploadMutation.error instanceof Error
                ? uploadMutation.error.message
                : "Failed to upload document"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                uploadMutation.isPending ||
                !documentType ||
                !selectedFile ||
                (selectedDocType?.requiresName && !documentName.trim())
              }
            >
              {uploadMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
