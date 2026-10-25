"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { Monitor } from "@/types";

export function MonitorForm({ monitor, mode }: { monitor?: Monitor; mode: "create" | "edit" }) {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: monitor?.name || "",
    url: monitor?.url || "",
    method: monitor?.method || "GET",
    expectedStatus: monitor?.expectedStatus || 200,
    interval: monitor?.interval || 5,
    timeout: monitor?.timeout || 10,
    keyword: monitor?.keyword || "",
    headers: monitor?.headers ? JSON.stringify(monitor.headers, null, 2) : "",
    body: monitor?.body || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");

      let headers: Record<string, string> | null = null;
      if (form.headers.trim()) {
        try { headers = JSON.parse(form.headers); }
        catch { setError("Headers must be valid JSON"); setIsSubmitting(false); return; }
      }

      const payload = {
        name: form.name,
        url: form.url,
        method: form.method,
        expectedStatus: Number(form.expectedStatus),
        interval: Number(form.interval),
        timeout: Number(form.timeout),
        keyword: form.keyword || null,
        headers,
        body: form.body || null,
      };

      const url = mode === "create" ? "/api/monitors" : `/api/monitors/${monitor!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      router.push("/monitors");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-4 text-sm">{error}</div>)}

      <Card>
        <CardHeader><CardTitle className="text-lg">Basic Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Monitor Name</Label>
            <Input id="name" placeholder="My Website" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://example.com/api/health" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>HTTP Method</Label>
              <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedStatus">Expected Status</Label>
              <Input id="expectedStatus" type="number" min={100} max={599} value={form.expectedStatus} onChange={(e) => setForm({ ...form, expectedStatus: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check Interval</Label>
              <Select value={String(form.interval)} onValueChange={(v) => setForm({ ...form, interval: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every 1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input id="timeout" type="number" min={1} max={60} value={form.timeout} onChange={(e) => setForm({ ...form, timeout: parseInt(e.target.value) })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Advanced Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword Check (optional)</Label>
            <Input id="keyword" placeholder="Enter a keyword to search in response body" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
            <p className="text-xs text-muted-foreground">If specified, the check will fail if this string is not found in the response body</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headers">Custom Headers (JSON, optional)</Label>
            <Textarea id="headers" placeholder='{"Authorization": "Bearer token"}' value={form.headers} onChange={(e) => setForm({ ...form, headers: e.target.value })} className="font-mono text-sm" rows={4} />
          </div>
          {["POST", "PUT", "PATCH"].includes(form.method) && (
            <div className="space-y-2">
              <Label htmlFor="body">Request Body (optional)</Label>
              <Textarea id="body" placeholder='{"key": "value"}' value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="font-mono text-sm" rows={4} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={isSubmitting}>{mode === "create" ? "Create Monitor" : "Save Changes"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}