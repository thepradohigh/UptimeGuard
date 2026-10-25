"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/auth-provider";
import { Save, MessageCircle, Mail, Bell } from "lucide-react";

export default function SettingsPage() {
  const { getAccessToken, user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", telegramChatId: "", emailNotifications: true, notifyCooldown: 5 });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        telegramChatId: user.telegramChatId || "",
        emailNotifications: user.emailNotifications,
        notifyCooldown: user.notifyCooldown || 5,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          telegramChatId: form.telegramChatId || null,
          emailNotifications: form.emailNotifications,
          notifyCooldown: form.notifyCooldown,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      updateUser(data.data);
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and notification preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Mail className="w-5 h-5" />Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive alerts via email when monitors go down</p>
            </div>
            <Switch checked={form.emailNotifications} onCheckedChange={(c) => setForm({ ...form, emailNotifications: c })} />
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <p className="font-medium text-sm">Telegram Notifications</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
              <Input id="telegramChatId" placeholder="e.g. 123456789" value={form.telegramChatId} onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })} />
              <p className="text-xs text-muted-foreground">Send /start to your Telegram bot to get your Chat ID. Leave empty to disable.</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="cooldown">Alert Cooldown (minutes)</Label>
            <Input id="cooldown" type="number" min={1} max={60} value={form.notifyCooldown} onChange={(e) => setForm({ ...form, notifyCooldown: parseInt(e.target.value) || 5 })} />
            <p className="text-xs text-muted-foreground">Minimum time between repeated alerts for the same monitor</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} loading={isSaving} className="w-full sm:w-auto">
        <Save className="w-4 h-4 mr-2" />Save Settings
      </Button>
    </div>
  );
}