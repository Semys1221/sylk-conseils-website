"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar,
  Flag,
  Loader2,
  X,
  GripVertical,
  Circle,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface Task {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  created_at: string;
}

const COLUMNS = [
  { key: "todo", label: "À faire", color: "border-t-gray-300" },
  { key: "in_progress", label: "En cours", color: "border-t-blue-400" },
  { key: "done", label: "Terminé", color: "border-t-emerald-400" },
] as const;

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-500",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-orange-50 text-orange-600",
  urgent: "bg-red-50 text-red-600",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

const PRIORITY_ICONS: Record<string, typeof Flag> = {
  low: Flag,
  medium: Flag,
  high: ArrowUpCircle,
  urgent: AlertCircle,
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function TasksView({ tenantId }: { tenantId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/tasks?tenant_id=${tenantId}&limit=200`);
    const json = await res.json();
    if (json.data) setTasks(json.data);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setMoving(taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    await fetch(`/api/admin/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setMoving(null);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const getColumnTasks = (status: string) => tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tâches</h2>
          <p className="text-sm text-gray-500">{tasks.length} tâches</p>
        </div>
        <button
          onClick={() => {
            setEditTask(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nouvelle tâche
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const columnTasks = getColumnTasks(col.key);
          return (
            <div
              key={col.key}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div
                className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${col.color}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      col.key === "todo"
                        ? "bg-gray-400"
                        : col.key === "in_progress"
                          ? "bg-blue-400"
                          : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-sm font-semibold text-gray-900">{col.label}</span>
                </div>
                <span className="text-xs text-gray-400">{columnTasks.length}</span>
              </div>

              <div className="p-3 space-y-2 min-h-[200px]">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-300">Aucune tâche</div>
                ) : (
                  columnTasks.map((task) => {
                    const PriorityIcon = PRIORITY_ICONS[task.priority] || Flag;
                    return (
                      <div
                        key={task.id}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${PRIORITY_STYLES[task.priority] || "bg-gray-100 text-gray-500"}`}
                              >
                                <PriorityIcon size={10} />
                                {PRIORITY_LABELS[task.priority] || task.priority}
                              </span>
                              {task.due_date && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                  <Calendar size={10} />
                                  {formatDate(task.due_date)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200/50">
                          {col.key !== "todo" && (
                            <button
                              onClick={() => handleStatusChange(task.id, "todo")}
                              disabled={moving === task.id}
                              className="flex-1 py-1 text-[10px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                            >
                              À faire
                            </button>
                          )}
                          {col.key !== "in_progress" && (
                            <button
                              onClick={() => handleStatusChange(task.id, "in_progress")}
                              disabled={moving === task.id}
                              className="flex-1 py-1 text-[10px] text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                            >
                              En cours
                            </button>
                          )}
                          {col.key !== "done" && (
                            <button
                              onClick={() => handleStatusChange(task.id, "done")}
                              disabled={moving === task.id}
                              className="flex-1 py-1 text-[10px] text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                            >
                              Terminé
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <TaskModal
          tenantId={tenantId}
          task={editTask}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

function TaskModal({
  tenantId,
  task,
  onClose,
  onSaved,
}: {
  tenantId: string;
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    due_date: task?.due_date || "",
    assigned_to: task?.assigned_to || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = task ? `/api/admin/tasks/${task.id}` : "/api/admin/tasks";
    const method = task ? "PUT" : "POST";

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
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Titre *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Priorité</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              >
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Date d&apos;échéance
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Assigné à</label>
              <input
                value={form.assigned_to}
                onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
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
              {task ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
