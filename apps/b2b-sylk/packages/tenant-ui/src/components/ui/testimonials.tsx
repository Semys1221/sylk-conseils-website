"use client";

import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarFallback } from "./avatar";
import { Star } from "lucide-react";
import { useTenant } from "../../tenant-config";

export function Testimonials() {
  const tenant = useTenant();
  const { items, heading, description } = tenant.testimonials;

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-[#F8F9FA] rounded-t-[40px] lg:rounded-t-[80px]">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-16 px-4 sm:px-6">
        <div className="relative z-10 mx-auto max-w-2xl space-y-4 md:space-y-6 text-center">
          <div className="text-[10px] md:text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Témoignages
          </div>
          <h2 className="text-3xl xs:text-4xl font-light lg:text-5xl text-[#1A1A1A] tracking-tight leading-tight px-2">
            {heading}
          </h2>
          {description && (
            <p className="text-slate-500 font-light leading-relaxed max-w-xl mx-auto text-sm md:text-base px-2">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Card
              key={i}
              className={`flex flex-col bg-white border border-gray-100 shadow-sm rounded-2xl ${
                i === 2 ? "sm:col-span-2 md:col-span-1" : ""
              }`}
            >
              <CardHeader className="p-5 md:p-6 pb-0">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-5 md:p-6 pt-2 flex flex-col flex-1 justify-between gap-6">
                <blockquote className="flex-1">
                  <p className="text-sm md:text-base font-light leading-relaxed text-[#1A1A1A]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-slate-200">
                    <AvatarFallback className="bg-slate-100 text-slate-600">
                      {t.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-xs md:text-sm font-medium not-italic text-slate-900 block">
                      {t.author}
                    </cite>
                    <span className="text-slate-500 block text-[10px] md:text-xs">{t.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-200/60 max-w-md mx-auto space-y-2">
          <p className="text-[10px] md:text-xs hover:text-slate-600 text-slate-400 tracking-wider font-light uppercase text-center px-4">
            {tenant.socialProof.ratingText}
          </p>
        </div>
      </div>
    </section>
  );
}
