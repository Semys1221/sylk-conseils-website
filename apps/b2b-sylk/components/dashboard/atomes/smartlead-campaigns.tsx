"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CampaignStats {
  total_sent?: number;
  total_opened?: number;
  total_clicked?: number;
  total_replied?: number;
  total_bounced?: number;
}

interface Campaign {
  id: number;
  name: string;
  status: string;
  total_leads: number;
  stats?: CampaignStats;
  analytics?: CampaignStats;
  sequences?: unknown[];
  detail?: Record<string, unknown> | null;
}

interface ApiResponse {
  error: string | null;
  data: Campaign[];
}

function statusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500";
    case "PAUSED":
      return "bg-yellow-500";
    case "DRAFTED":
      return "bg-neutral-400";
    case "STOPPED":
      return "bg-red-500";
    default:
      return "bg-neutral-300";
  }
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const stats = campaign.analytics || campaign.stats || {};
  const totalSent = stats.total_sent ?? 0;
  const openRate = totalSent > 0 ? (((stats.total_opened ?? 0) / totalSent) * 100).toFixed(1) : "-";
  const clickRate =
    totalSent > 0 ? (((stats.total_clicked ?? 0) / totalSent) * 100).toFixed(1) : "-";
  const replyRate =
    totalSent > 0 ? (((stats.total_replied ?? 0) / totalSent) * 100).toFixed(1) : "-";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusColor(campaign.status)}`} />
          <CardTitle className="truncate text-sm">{campaign.name}</CardTitle>
          <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
            #{campaign.id}
          </Badge>
        </div>
        <CardDescription>
          Leads: {campaign.total_leads ?? 0} &middot; Status: {campaign.status}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-sm font-semibold">{stats.total_sent ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Sent</p>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-sm font-semibold">{openRate}%</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-sm font-semibold">{clickRate}%</p>
            <p className="text-[10px] text-muted-foreground">Click</p>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-sm font-semibold">{replyRate}%</p>
            <p className="text-[10px] text-muted-foreground">Reply</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SmartLeadCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/smartlead");
      const json: ApiResponse = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setCampaigns(json.data || []);
    } catch {
      setError("Failed to load SmartLead campaign data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalSent = campaigns.reduce(
    (sum, c) => sum + (c.analytics?.total_sent ?? c.stats?.total_sent ?? 0),
    0
  );
  const activeCount = campaigns.filter((c) => c.status === "ACTIVE").length;
  const pausedCount = campaigns.filter((c) => c.status === "PAUSED").length;

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">SmartLead Campaigns</h2>
          <p className="text-sm text-muted-foreground">Live stats for all SmartLead campaigns</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <svg
            className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </div>

      {campaigns.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pausedCount}</p>
              <p className="text-xs text-muted-foreground">Paused</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No campaigns found in SmartLead.
            </CardContent>
          </Card>
        )}
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
