"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { Document, DocumentCategory, User as UserType } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";

// Mock document data
const mockDocuments: (Document & { uploader: UserType })[] = [
  {
    id: "1",
    referenceNumber: "DOC-2024-001",
    title: "Employee Handbook 2024",
    description: "Updated employee policies and procedures",
    category: "policy",
    fileUrl: "/documents/employee-handbook-2024.pdf",
    fileName: "employee-handbook-2024.pdf",
    fileSize: 2048576, // 2MB
    mimeType: "application/pdf",
    version: 2,
    uploadedBy: "admin1",
    expiryDate: "2025-01-01",
    isPublic: true,
    tags: ["HR", "Policy", "2024"],
    uploader: {
      id: "admin1",
      email: "admin@uip.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    referenceNumber: "DOC-2024-002",
    title: "Q4 Financial Report",
    description: "Quarterly financial performance report",
    category: "report",
    fileUrl: "/documents/q4-financial-report.pdf",
    fileName: "q4-financial-report.pdf",
    fileSize: 1536000, // 1.5MB
    mimeType: "application/pdf",
    version: 1,
    uploadedBy: "finance1",
    isPublic: false,
    tags: ["Finance", "Q4", "Report"],
    uploader: {
      id: "finance1",
      email: "finance@uip.com",
      firstName: "Finance",
      lastName: "Manager",
      role: "approver",
      isActive: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    referenceNumber: "DOC-2024-003",
    title: "Safety Procedures",
    description: "Workplace safety guidelines and emergency procedures",
    category: "procedure",
    fileUrl: "/documents/safety-procedures.pdf",
    fileName: "safety-procedures.pdf",
    fileSize: 3072000, // 3MB
    mimeType: "application/pdf",
    version: 1,
    uploadedBy: "hr1",
    expiryDate: "2024-02-01", // Expiring soon
    isPublic: true,
    tags: ["Safety", "Emergency", "Procedures"],
    uploader: {
      id: "hr1",
      email: "hr@uip.com",
      firstName: "HR",
      lastName: "Manager",
      role: "approver",
      isActive: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

const getCategoryColor = (category: DocumentCategory): string => {
  switch (category) {
    case "policy":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "procedure":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "form":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "report":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "contract":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isExpiringSoon = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};

const isExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  return expiry < now;
};

const DocumentCard: React.FC<{
  document: Document & { uploader: UserType };
}> = ({ document }) => {
  const expiringSoon = isExpiringSoon(document.expiryDate);
  const expired = isExpired(document.expiryDate);

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        expired ? "border-red-200" : expiringSoon ? "border-orange-200" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {document.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {document.referenceNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                document.category
              )}`}
            >
              {document.category}
            </span>
            {expired && (
              <div className="flex items-center text-xs text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Expired
              </div>
            )}
            {expiringSoon && !expired && (
              <div className="flex items-center text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Expiring Soon
              </div>
            )}
          </div>
        </div>

        {document.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {document.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-2" />
            {document.uploader.firstName} {document.uploader.lastName}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" />
            {formatDateTime(document.createdAt)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2">📄</span>
            {formatFileSize(document.fileSize)} • v{document.version}
          </div>
          {document.expiryDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-2">⏰</span>
              Expires: {formatDate(document.expiryDate)}
            </div>
          )}
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {document.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
              >
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    DocumentCategory | "all"
  >("all");
  const [documents] = useState(mockDocuments);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.referenceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      document.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || document.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: (DocumentCategory | "all")[] = [
    "all",
    "policy",
    "procedure",
    "form",
    "report",
    "contract",
    "other",
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage and access your document library
            </p>
          </div>
          <Button onClick={() => setShowUploadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <DocumentUploadForm
            onUploadComplete={(document) => {
              console.log("Document uploaded:", document);
              setShowUploadForm(false);
            }}
            onCancel={() => setShowUploadForm(false)}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Document Library</CardTitle>
            <CardDescription>
              Search and filter through all documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No documents found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
