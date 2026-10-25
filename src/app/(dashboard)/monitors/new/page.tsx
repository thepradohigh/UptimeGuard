"use client";
import React from "react";
import { MonitorForm } from "@/components/monitors/monitor-form";

export default function NewMonitorPage() {
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Monitor</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new endpoint to monitor its availability</p>
      </div>
      <MonitorForm mode="create" />
    </div>
  );
}