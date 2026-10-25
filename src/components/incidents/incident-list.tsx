"use client";
import React from "react";
import { Incident } from "@/types";
import { formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function IncidentList({ incidents, isLoading }: { incidents: Incident[]; isLoading: boolean }) {
  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>;

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-1">No incidents</h3>
        <p className="text-sm text-muted-foreground">All your monitors have been running without issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((inc) => (
        <Card key={inc.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {inc.resolvedAt ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {inc.monitor && <Link href={`/monitors/${inc.monitorId}`} className="font-semibold text-sm hover:text-primary">{inc.monitor.name}</Link>}
                  <Badge variant={inc.resolvedAt ? "success" : "destructive"}>{inc.resolvedAt ? "Resolved" : "Ongoing"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{inc.cause || inc.lastError || "Service unavailable"}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Started: {format(new Date(inc.startedAt), "MMM dd, HH:mm:ss")}</span>
                  {inc.resolvedAt && <span>Resolved: {format(new Date(inc.resolvedAt), "MMM dd, HH:mm:ss")}</span>}
                  {inc.duration && <span className="font-semibold">Duration: {formatDuration(inc.duration)}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}