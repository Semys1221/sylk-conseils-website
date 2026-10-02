"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useAdminDataStore } from "@/lib/admin-data-store";

type Tab = "analytics" | "traffic";

export default function Website() {
  const [tab, setTab] = useState<Tab>("analytics");
  const { analytics: data, loading } = useAdminDataStore();

  const totalPageviews = data.reduce((s, d) => s + d.pageviews, 0);
  const totalSessions = data.reduce((s, d) => s + d.sessions, 0);

  const chartData = data.map((d) => ({
    month: d.date,
    desktop: tab === "analytics" ? d.pageviews : d.sessions,
  }));

  const chartConfig = {
    desktop: {
      label: tab === "analytics" ? "Pages vues" : "Sessions",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (loading && data.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="size-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pages vues (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">
              {totalPageviews.toLocaleString("fr-FR")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-violet-400">
              {totalSessions.toLocaleString("fr-FR")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <ButtonGroup>
          <Button
            variant={tab === "analytics" ? "default" : "outline"}
            onClick={() => setTab("analytics")}
          >
            Analytics
          </Button>
          <Button
            variant={tab === "traffic" ? "default" : "outline"}
            onClick={() => setTab("traffic")}
          >
            Trafic
          </Button>
        </ButtonGroup>
      </div>

      {tab === "analytics" && (
        <Card>
          <CardHeader>
            <CardTitle>Pages vues</CardTitle>
            <CardDescription>Évolution des pages vues sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4" />
              Total : {totalPageviews.toLocaleString("fr-FR")} pages vues sur 30 jours
            </div>
            <div className="leading-none text-muted-foreground">Données via PostHog</div>
          </CardFooter>
        </Card>
      )}

      {tab === "traffic" && (
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>Évolution des sessions sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4" />
              Total : {totalSessions.toLocaleString("fr-FR")} sessions sur 30 jours
            </div>
            <div className="leading-none text-muted-foreground">Données via PostHog</div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
