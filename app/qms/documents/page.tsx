"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  FileText as FileTextIcon,
  Folder as FolderIcon,
  MoreHorizontal as MoreHorizontalIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";

interface DocumentCardProps {
  title: string;
  type: string;
  department: string;
  version: string;
  lastUpdated: string;
  status: "Published" | "Draft" | "Under Review" | "Expired";
  icon: React.ReactNode;
}

function DocumentCard({
  title,
  type,
  department,
  version,
  lastUpdated,
  status,
  icon,
}: DocumentCardProps) {
  function getStatusColor() {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Under Review":
        return "bg-amber-100 text-amber-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusIcon() {
    switch (status) {
      case "Published":
        return <CheckCircleIcon size={14} className="mr-1 text-green-700" />;
      case "Draft":
        return <ClockIcon size={14} className="mr-1 text-gray-700" />;
      case "Under Review":
        return <ClockIcon size={14} className="mr-1 text-amber-700" />;
      case "Expired":
        return <AlertCircleIcon size={14} className="mr-1 text-red-700" />;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-border dark:bg-card">
      <div className="flex items-start">
        <div className="mr-3 rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-foreground">
            {title}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-muted dark:text-muted-foreground">
              {type}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-muted dark:text-muted-foreground">
              {department}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-muted dark:text-muted-foreground">
              v{version}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-muted-foreground">
              Updated: {lastUpdated}
            </span>
            <div
              className={`flex items-center rounded px-2 py-1 text-xs ${getStatusColor()}`}
            >
              {getStatusIcon()}
              {status}
            </div>
          </div>
        </div>
        <button
          aria-label="More options"
          className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-muted-foreground dark:hover:text-foreground"
          tabIndex={0}
        >
          <MoreHorizontalIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const documents: DocumentCardProps[] = [
    {
      title: "Quality Manual",
      type: "Manual",
      department: "Quality",
      version: "2.3",
      lastUpdated: "May 15, 2023",
      status: "Published",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
    {
      title: "Product Testing Procedure",
      type: "Procedure",
      department: "R&D",
      version: "1.7",
      lastUpdated: "June 2, 2023",
      status: "Under Review",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
    {
      title: "Employee Training Form",
      type: "Form",
      department: "HR",
      version: "3.1",
      lastUpdated: "April 28, 2023",
      status: "Published",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
    {
      title: "Equipment Calibration SOP",
      type: "SOP",
      department: "Engineering",
      version: "2.0",
      lastUpdated: "May 30, 2023",
      status: "Draft",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
    {
      title: "Supplier Evaluation Checklist",
      type: "Checklist",
      department: "Procurement",
      version: "1.3",
      lastUpdated: "March 12, 2023",
      status: "Expired",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
    {
      title: "Internal Audit Templates",
      type: "Template",
      department: "Quality",
      version: "2.5",
      lastUpdated: "May 22, 2023",
      status: "Published",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
    },
  ];

  const documentFolders = [
    {
      name: "Quality Manuals",
      count: 5,
      icon: <FolderIcon size={24} className="text-amber-600" />,
    },
    {
      name: "Procedures",
      count: 23,
      icon: <FolderIcon size={24} className="text-amber-600" />,
    },
    {
      name: "Work Instructions",
      count: 42,
      icon: <FolderIcon size={24} className="text-amber-600" />,
    },
    {
      name: "Forms",
      count: 18,
      icon: <FolderIcon size={24} className="text-amber-600" />,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
              Document Control
            </h1>
            <p className="text-gray-600 dark:text-muted-foreground">
              Manage quality documents and procedures
            </p>
          </div>
          <button
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            disabled
            title="Static demo"
          >
            <PlusIcon size={16} className="mr-2" />
            New Document
          </button>
        </div>

        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              aria-label="Search documents"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:border-border dark:bg-background"
              disabled
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <button
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-accent"
            disabled
            title="Static demo"
          >
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {documentFolders.map((folder, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-border dark:bg-card"
              tabIndex={0}
              aria-label={`${folder.name} folder`}
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-lg bg-amber-50 p-2 dark:bg-amber-950/30">
                  {folder.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-foreground">
                    {folder.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-muted-foreground">
                    {folder.count} documents
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Recent Documents</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc, index) => (
              <DocumentCard key={index} {...doc} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
