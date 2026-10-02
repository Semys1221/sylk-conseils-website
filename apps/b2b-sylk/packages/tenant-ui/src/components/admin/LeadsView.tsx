"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Globe,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
} from "lucide-react";

interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  domain?: string;
  phone_number?: string;
  source: string;
  status: string;
  location?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "raw", label: "Brut" },
  { value: "cleaned", label: "Nettoyé" },
  { value: "ready_to_send", label: "Prêt à envoyer" },
  { value: "active_in_sequence", label: "En séquence" },
  { value: "booked", label: "Rendez-vous pris" },
  { value: "blacklist", label: "Blacklisté" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  raw: "bg-gray-100 text-gray-600",
  cleaned: "bg-blue-50 text-blue-600",
  ready_to_send: "bg-violet-50 text-violet-600",
  active_in_sequence: "bg-amber-50 text-amber-600",
  booked: "bg-emerald-50 text-emerald-600",
  blacklist: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  raw: "Brut",
  cleaned: "Nettoyé",
  ready_to_send: "Prêt",
  active_in_sequence: "En séquence",
  booked: "RDV pris",
  blacklist: "Blacklisté",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LeadsView({ tenantId }: { tenantId: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const pageSize = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      tenant_id: tenantId,
      status: statusFilter,
      limit: String(pageSize),
      offset: String(page * pageSize),
    });
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/leads?${params}`);
    const json = await res.json();
    if (json.data) setLeads(json.data);
    if (json.total !== undefined) setTotal(json.total);
    if (json.today !== undefined) setToday(json.today);
    setLoading(false);
  }, [tenantId, statusFilter, search, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce lead ?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    fetchLeads();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500">
            {total} au total · {today} aujourd&apos;hui
          </p>
        </div>
        <button
          onClick={() => {
            setEditLead(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nouveau lead
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Rechercher par nom, email, société..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
            />
          </div>
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-gray-300 animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Aucun lead trouvé</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Société
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={14} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {lead.first_name || lead.last_name
                                ? `${lead.first_name || ""} ${lead.last_name || ""}`.trim()
                                : "—"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mail size={10} />
                                {lead.email}
                              </span>
                              {lead.phone_number && (
                                <span className="flex items-center gap-1">
                                  <Phone size={10} />
                                  {lead.phone_number}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {lead.company_name ? (
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Building2 size={13} className="text-gray-400" />
                            {lead.company_name}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                        {lead.domain && (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Globe size={10} />
                            {lead.domain}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{lead.source}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[lead.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {STATUS_LABELS[lead.status] || lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditLead(lead);
                              setShowModal(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {page + 1} sur {totalPages || 1} ({total} résultats)
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
        <LeadModal
          tenantId={tenantId}
          lead={editLead}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

function LeadModal({
  tenantId,
  lead,
  onClose,
  onSaved,
}: {
  tenantId: string;
  lead: Lead | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    email: lead?.email || "",
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    company_name: lead?.company_name || "",
    phone_number: lead?.phone_number || "",
    location: lead?.location || "",
    source: lead?.source || "manual",
    status: lead?.status || "raw",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = lead ? `/api/admin/leads/${lead.id}` : "/api/admin/leads";
    const method = lead ? "PUT" : "POST";

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
            {lead ? "Modifier le lead" : "Nouveau lead"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Prénom</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
            <input
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Société</label>
              <input
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone</label>
              <input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              >
                <option value="manual">Manuel</option>
                <option value="funnel">Tunnel</option>
                <option value="linkedin_scrape">LinkedIn</option>
                <option value="apollo">Apollo</option>
                <option value="csv_import">Import CSV</option>
                <option value="google_maps">Google Maps</option>
              </select>
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Localisation</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
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
              {lead ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
