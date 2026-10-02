// Types & Context
export { TenantProvider, useTenant } from "./tenant-config";
export type { TenantConfig, FunnelStep, FunnelOption, FunnelContent, Slide } from "./tenant-config";

// Utils
export { cn } from "./lib/utils";
export {
  ADMIN_SESSION_KEY,
  getAdminSession,
  setAdminSession,
  clearAdminSession,
} from "./lib/admin-session";
export type { AdminSession } from "./lib/admin-session";

// Components
export { TenantRoot } from "./components/TenantRoot";
export { Footer } from "./components/Footer";
export { PageHero } from "./components/PageHero";
export { Testimonials } from "./components/ui/testimonials";
export { AdminSidebar } from "./components/admin/AdminSidebar";
export { AdminLayout } from "./components/admin/AdminLayout";
export { LeadsView } from "./components/admin/LeadsView";
export { AppointmentsView } from "./components/admin/AppointmentsView";
export { TasksView } from "./components/admin/TasksView";
export { KpiView } from "./components/admin/KpiView";
export { DataView } from "./components/admin/DataView";

// Lib
export { SERVICES, ENV_VARS } from "./lib/services";
export type { ServiceDefinition, EnvVarDefinition } from "./lib/services";

// Funnel
export { FunnelApp } from "./components/funnel/FunnelApp";
export { FunnelDiagnostic } from "./components/funnel/FunnelDiagnostic";
export { FunnelEligible } from "./components/funnel/FunnelEligible";
export { ProgressionCircle } from "./components/funnel/ProgressionCircle";
export { VideoCall } from "./components/funnel/VideoCall";
export { useFunnel } from "./components/funnel/FunnelApp";
export { MeshBackground } from "./components/funnel/MeshBackground";

// Hooks
export { useCallConfig } from "./hooks/useCallConfig";
export type {
  CallConfig,
  CallConfigCategory,
  CallConfigBranding,
  CallConfigPhase,
} from "./hooks/useCallConfig";

// Email blocs
export { FiscalSimulatorInline } from "./emails/blocs/FiscalSimulatorInline";

// Salle de Vente
export { SlideViewer } from "./components/salle-de-vente/SlideViewer";
export { SlideController } from "./components/salle-de-vente/SlideController";

// Admin — CRM & Settings
export { CRMView } from "./components/admin/CRMView";
export { SettingsView } from "./components/admin/SettingsView";
export { UpcomingCallsCard } from "./components/admin/UpcomingCallsCard";
export { AnalyticsView } from "./components/admin/AnalyticsView";

// Stores
export { useAdminStore } from "./stores/admin-store";
export type { AdminView, SelectedUser } from "./stores/admin-store";
