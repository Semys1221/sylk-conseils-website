"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Send, ArrowLeft, BookOpen, Users, TrendingUp } from "lucide-react";

interface FunnelEligibleProps {
  onBack: () => void;
  onEmailSubmitted: () => void;
}

export function FunnelEligible({ onBack, onEmailSubmitted }: FunnelEligibleProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/funnel/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Network error");
      setSubmitted(true);
      onEmailSubmitted();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[520px] w-full mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center mb-6 mx-auto">
          <Mail size={32} className="text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 leading-tight">
          Merci, {email.split("@")[0]} !
        </h2>
        <p className="text-[#666666] text-base leading-relaxed font-light mb-8">
          Nous avons bien reçu votre demande. Un membre de notre équipe vous contactera dans les
          plus brefs délais pour échanger sur votre situation.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 border border-[#D4D4D4] text-[#111111] px-8 py-[0.875rem] rounded-full font-medium hover:bg-[#F9F9F9] transition-all duration-300 active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Retour à l&apos;accueil</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[520px] mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F4B400]/10 border border-[#F4B400]/20 flex items-center justify-center mb-6">
        <BookOpen size={32} className="text-[#F4B400]" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 leading-tight">
        Votre profil ne correspond pas exactement à nos critères
      </h2>
      <p className="text-[#666666] text-base leading-relaxed font-light mb-8">
        Ce n&apos;est pas un refus. Nous accompagnons principalement des CGP et cabinets établis. En
        attendant, voici quelques ressources qui pourraient vous intéresser.
      </p>

      <div className="space-y-3 mb-8">
        <a
          href="/blog"
          className="flex items-center gap-4 bg-white border border-[#E4E1DC] rounded-2xl p-4 hover:border-[#111111] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F9F9F9] flex items-center justify-center shrink-0">
            <Users size={20} className="text-[#666666]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111111]">Cas clients CGP</p>
            <p className="text-xs text-[#999999] mt-0.5">
              Découvrez comment d&apos;autres CGP développent leur cabinet
            </p>
          </div>
          <BookOpen
            size={16}
            className="text-[#999999] group-hover:text-[#111111] transition-colors shrink-0"
          />
        </a>
        <a
          href="/expertises"
          className="flex items-center gap-4 bg-white border border-[#E4E1DC] rounded-2xl p-4 hover:border-[#111111] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F9F9F9] flex items-center justify-center shrink-0">
            <TrendingUp size={20} className="text-[#666666]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111111]">Guide prospection</p>
            <p className="text-xs text-[#999999] mt-0.5">
              Les meilleures pratiques pour trouver des clients BNC et BIC
            </p>
          </div>
          <BookOpen
            size={16}
            className="text-[#999999] group-hover:text-[#111111] transition-colors shrink-0"
          />
        </a>
      </div>

      <div className="bg-[#F9F9F9] border border-[#E4E1DC] rounded-2xl p-6 mb-6">
        <p className="text-sm font-semibold text-[#111111] mb-3">
          Laissez-nous votre email — nous vous recontacterons
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full bg-white border border-[#E4E1DC] rounded-full pl-10 pr-4 py-3 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#2a2a2a] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              "Envoi..."
            ) : (
              <>
                <span>Je suis contacté</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#111111] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Retour à l&apos;accueil</span>
      </button>
    </motion.div>
  );
}
