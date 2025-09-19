"use client";

import React from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
