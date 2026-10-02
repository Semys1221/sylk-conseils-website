import { PageHero } from "@workspace/tenant-ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPageContent } from "@/lib/cms/get-content";

export const dynamic = "force-dynamic";

export default async function ExpertisesHub() {
  const content = await getPageContent("expertises");

  return (
    <div className="bg-white">
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} />

      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {content.cards.map((card) => (
            <Link
              key={card.slug}
              href={`/expertises/${card.slug}`}
              className="group block h-full"
            >
              <div className="bg-neutral-50 rounded-3xl p-10 h-full border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <h3 className="heading-3 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-lead text-neutral-500 leading-relaxed mb-12">{card.description}</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  {content.cardCta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
