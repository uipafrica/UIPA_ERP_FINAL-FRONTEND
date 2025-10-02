"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  currentFile: string | null;
  totalFiles: number;
  completedFiles: number;
  error: string | null;
  uploadFiles: Array<{
    file: File;
    progress: number;
    status: "pending" | "uploading" | "completed" | "error";
    error?: string;
  }>;
  onCancel?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  progress,
  currentFile,
  totalFiles,
  completedFiles,
  error,
  uploadFiles,
  onCancel,
}) => {
  if (!isUploading && !error) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "uploading":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Uploading Files
          </CardTitle>
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>
              {completedFiles} of {totalFiles} files
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {currentFile && `Uploading: ${currentFile}`}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* File List */}
        {uploadFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Files</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {uploadFiles.map((fileState, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-md bg-gray-50"
                >
                  {getStatusIcon(fileState.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {fileState.file.name}
                      </p>
                      <span
                        className={cn(
                          "text-xs",
                          getStatusColor(fileState.status)
                        )}
                      >
                        {fileState.status === "uploading"
                          ? `${fileState.progress}%`
                          : fileState.status}
                      </span>
                    </div>
                    {fileState.status === "uploading" && (
                      <Progress
                        value={fileState.progress}
                        className="h-1 mt-1"
                      />
                    )}
                    {fileState.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {fileState.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
