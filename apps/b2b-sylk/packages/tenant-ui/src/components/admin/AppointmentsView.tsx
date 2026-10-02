"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";

interface Appointment {
  id: string;
  tenant_id: string;
  prospect_name: string;
  prospect_email?: string;
  prospect_phone?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration: number;
  status: string;
  notes?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmé" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isUpcoming(dateStr: string, timeStr?: string) {
  const now = new Date();
  const date = new Date(dateStr + "T00:00:00");
  if (date > now) return true;
  if (date.toDateString() === now.toDateString() && timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    date.setHours(h, m);
    return date > now;
  }
  return false;
}

export function AppointmentsView({ tenantId }: { tenantId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const pageSize = 20;

  const fetchAppts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      tenant_id: tenantId,
      status: filter,
      limit: String(pageSize),
      offset: String(page * pageSize),
    });
    const res = await fetch(`/api/admin/appointments?${params}`);
    const json = await res.json();
    if (json.data) setAppointments(json.data);
    if (json.total !== undefined) setTotal(json.total);
    if (json.upcoming !== undefined) setUpcoming(json.upcoming);
    setLoading(false);
  }, [tenantId, filter, page]);

  useEffect(() => {
    fetchAppts();
  }, [fetchAppts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce rendez-vous ?")) return;
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    fetchAppts();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Rendez-vous</h2>
          <p className="text-sm text-gray-500">
            {upcoming} à venir · {total} au total
          </p>
        </div>
        <button
          onClick={() => {
            setEditAppt(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nouveau rendez-vous
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilter(opt.value);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === opt.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-gray-300 animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Aucun rendez-vous trouvé</div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {appointments.map((appt) => {
                const upcoming = isUpcoming(appt.date, appt.time);
                return (
                  <div key={appt.id} className="px-4 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {appt.prospect_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{appt.title}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(appt.date)}
                            </span>
                            {appt.time && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {appt.time}
                              </span>
                            )}
                            <span>{appt.duration} min</span>
                          </div>
                          {(appt.prospect_email || appt.prospect_phone) && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              {appt.prospect_email && (
                                <span className="flex items-center gap-1">
                                  <Mail size={11} />
                                  {appt.prospect_email}
                                </span>
                              )}
                              {appt.prospect_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={11} />
                                  {appt.prospect_phone}
                                </span>
                              )}
                            </div>
                          )}
                          {appt.notes && (
                            <p className="text-xs text-gray-400 mt-1.5 italic line-clamp-1">
                              {appt.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {appt.status === "completed" && <CheckCircle2 size={11} />}
                          {appt.status === "cancelled" && <XCircle size={11} />}
                          {appt.status === "pending" && <AlertCircle size={11} />}
                          {appt.status === "confirmed" && <CheckCircle2 size={11} />}
                          {STATUS_LABELS[appt.status] || appt.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditAppt(appt);
                              setShowModal(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(appt.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {page + 1} sur {totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <AppointmentModal
          tenantId={tenantId}
          appointment={editAppt}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchAppts();
          }}
        />
      )}
    </div>
  );
}

function AppointmentModal({
  tenantId,
  appointment,
  onClose,
  onSaved,
}: {
  tenantId: string;
  appointment: Appointment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    prospect_name: appointment?.prospect_name || "",
    prospect_email: appointment?.prospect_email || "",
    prospect_phone: appointment?.prospect_phone || "",
    title: appointment?.title || "Rendez-vous",
    description: appointment?.description || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    duration: appointment?.duration || 30,
    status: appointment?.status || "pending",
    notes: appointment?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = appointment
      ? `/api/admin/appointments/${appointment.id}`
      : "/api/admin/appointments";
    const method = appointment ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tenant_id: tenantId }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Nom du prospect *
            </label>
            <input
              required
              value={form.prospect_name}
              onChange={(e) => setForm({ ...form, prospect_name: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                value={form.prospect_email}
                onChange={(e) => setForm({ ...form, prospect_email: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone</label>
              <input
                value={form.prospect_phone}
                onChange={(e) => setForm({ ...form, prospect_phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Titre</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Date *</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Heure</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Durée (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              >
                {STATUS_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {appointment ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
