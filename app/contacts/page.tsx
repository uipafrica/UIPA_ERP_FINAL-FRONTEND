"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Tag,
  Grid,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Contact, ContactCategory } from "@/types";
import { getInitials } from "@/lib/utils";
import { contactApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AddContactModal } from "@/components/contacts/AddContactModal";

const getCategoryColor = (category: ContactCategory): string => {
  switch (category) {
    case "customer":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "supplier":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "service provider":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "internal":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

type ViewType = "list" | "grid";

const ContactCard: React.FC<{
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
}> = ({ contact, onViewDetails }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer h-full"
      onClick={() => onViewDetails(contact)}
    >
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarFallback className="text-sm sm:text-base">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold truncate">
                  {contact.name}
                </h3>
                {contact.position && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {contact.position}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {contact.email && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              )}
              {contact.companyName && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.companyName}</span>
                </div>
              )}
              {contact.notes && (
                <div className="hidden md:flex items-start text-xs sm:text-sm text-muted-foreground">
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{contact.notes}</span>
                </div>
              )}

              {contact.category && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <span
                    className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getCategoryColor(
                      contact.category
                    )}`}
                  >
                    {contact.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactListItem: React.FC<{
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
}> = ({ contact, onViewDetails }) => {
  return (
    <Card
      className="hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onViewDetails(contact)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="text-sm">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.position || contact.companyName || "No position"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {contact.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">
                          {contact.email}
                        </span>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="hidden sm:flex items-center space-x-1">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}

                    {contact.companyName && (
                      <div className="hidden md:flex items-center space-x-1">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span>{contact.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    contact.category
                  )}`}
                >
                  {contact.category}
                </span>
              </div>
            </div>

            {/* Mobile-only second row for additional info */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:hidden">
              {contact.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.companyName && (
                <div className="flex items-center space-x-1">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{contact.companyName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ContactCategory | "all"
  >("all");
  const [viewType, setViewType] = useState<ViewType>("list"); // Default to list view
  const [showAddModal, setShowAddModal] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // Fetch contacts using React Query
  const {
    data: contacts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "contacts",
      {
        search: searchTerm,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      },
    ],
    queryFn: () =>
      contactApi.getAll(
        {
          search: searchTerm || undefined,
          category: selectedCategory === "all" ? undefined : selectedCategory,
        },
        localStorage.getItem("access_token") || undefined
      ),
    enabled: !!user, // Only fetch if user is authenticated
  });

  // console.log(contacts);

  const handleViewDetails = (contact: Contact) => {
    router.push(`/contacts/${contact._id}`);
  };

  const handleAddContact = () => {
    setShowAddModal(true);
  };

  // Filter contacts based on search term (client-side filtering for immediate response)
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact: Contact) => {
      const matchesSearch =
        !searchTerm ||
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || contact.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchTerm, selectedCategory]);

  const categories: (ContactCategory | "all")[] = [
    "all",
    "customer",
    "supplier",
    "service provider",
    "internal",
    "other",
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your business contacts and relationships
            </p>
          </div>
          <Button onClick={handleAddContact}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Directory</CardTitle>
            <CardDescription>
              Search and filter through all your contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* View toggle buttons */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewType === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewType("list")}
                    className="rounded-r-none border-r"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewType === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewType("grid")}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
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

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading contacts...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                <div className="text-center">
                  <p className="text-destructive font-medium">
                    Failed to load contacts
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Contact Display */}
            {!isLoading && !error && (
              <>
                {viewType === "grid" ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredContacts.map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredContacts.map((contact) => (
                      <ContactListItem
                        key={contact.id}
                        contact={contact}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filteredContacts.length === 0 && contacts.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No contacts found matching your criteria.
                    </p>
                  </div>
                )}

                {filteredContacts.length === 0 && contacts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No contacts have been added yet.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddContactModal open={showAddModal} onOpenChange={setShowAddModal} />
      </div>
    </AppShell>
  );
}
