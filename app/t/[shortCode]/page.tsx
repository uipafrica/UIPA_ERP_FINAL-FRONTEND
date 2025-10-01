"use client";

import React from "react";
import { useParams } from "next/navigation";
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

export default function PublicTransferPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [meta, setMeta] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState("");
  const [access, setAccess] = React.useState<any | null>(null);
  const [accessError, setAccessError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await transferApi.resolve(shortCode);
        if (mounted) setMeta(res);
      } catch (e: any) {
        setError(e?.message || "Failed to load transfer");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [shortCode]);

  const handleRequestAccess = async () => {
    try {
      setAccessError(null);
      const res = await transferApi.requestAccess(
        shortCode,
        meta?.needsPassword ? password : undefined
      );
      setAccess(res);
    } catch (e: any) {
      setAccessError(e?.data?.error || e?.message || "Access failed");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : meta ? (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
            {meta.description ? (
              <p className="text-muted-foreground">{meta.description}</p>
            ) : null}
          </div>

          {meta.expired ? (
            <Card>
              <CardHeader>
                <CardTitle>Link expired</CardTitle>
                <CardDescription>
                  This transfer is no longer available.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  {meta.files?.length || 0} file(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {access ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {access.files.map((f: any) => (
                        <div key={f.id} className="rounded border p-3">
                          <div
                            className="text-sm font-medium truncate"
                            title={f.name}
                          >
                            {f.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(f.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                          <div className="mt-2">
                            <Button asChild size="sm" variant="secondary">
                              <a href={f.url}>Download</a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {access.downloadAllUrl ? (
                      <div>
                        <Button asChild>
                          <a href={access.downloadAllUrl}>Download All</a>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meta.needsPassword ? (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    ) : null}
                    <Button onClick={handleRequestAccess}>Access Files</Button>
                    {accessError ? (
                      <p className="text-sm text-red-600">{accessError}</p>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
