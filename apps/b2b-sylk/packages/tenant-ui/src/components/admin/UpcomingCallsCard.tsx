"use client";

import { useState, useEffect } from "react";
import { Phone, Calendar, Clock, Loader2, ExternalLink, Video } from "lucide-react";

interface UpcomingCall {
  id: string;
  prospect_name: string;
  prospect_email: string;
  start_time: string;
  duration: number;
  status: string;
}

interface UpcomingCallsCardProps {
  tenantId: string;
}

export function UpcomingCallsCard({ tenantId }: UpcomingCallsCardProps) {
  const [calls, setCalls] = useState<UpcomingCall[]>([]);
  const [dailyRoomUrl, setDailyRoomUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const res = await fetch(`/api/appointments/upcoming?tenant_id=${tenantId}`);
        if (res.ok) {
          const json = await res.json();
          setCalls(json.data ?? []);
          setDailyRoomUrl(json.config?.dailyRoomUrl ?? "");
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, [tenantId]);

  const handleJoin = () => {
    if (dailyRoomUrl) {
      window.open(dailyRoomUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-center py-6">
          <Loader2 size={16} className="text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-violet-50 p-2 rounded-xl">
            <Phone size={16} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Prochains appels</h3>
          </div>
        </div>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-6">
          <Calendar size={20} className="text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Aucun appel à venir</p>
        </div>
      ) : (
        <div className="space-y-2">
          {calls.map((call) => (
            <div key={call.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{call.prospect_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">
                    {new Date(call.start_time).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    {new Date(call.start_time).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {call.duration && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">{call.duration}min</span>
                    </>
                  )}
                </div>
              </div>
              {dailyRoomUrl && (
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-[11px] font-medium hover:bg-violet-100 transition-colors"
                >
                  <Video size={12} />
                  Rejoindre
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {dailyRoomUrl && (
        <a
          href={dailyRoomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ExternalLink size={10} />
          Salle de réunion Daily.co
        </a>
      )}
    </div>
  );
}
