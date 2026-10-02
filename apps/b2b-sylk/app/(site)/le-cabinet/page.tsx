import { PageHero } from "@workspace/tenant-ui";
import { getPageContent } from "@/lib/cms/get-content";

export const dynamic = "force-dynamic";

export default async function LeCabinet() {
  const content = await getPageContent("leCabinet");

  return (
    <div className="bg-white">
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>{content.intro}</p>

          <h2 className="heading-3 text-black tracking-tight mt-12 mb-6">{content.approach.title}</h2>
          <p>{content.approach.paragraph1}</p>
          <p>{content.approach.paragraph2}</p>

          <h2 className="heading-3 text-black tracking-tight mt-12 mb-6">{content.domains.title}</h2>
          <p>{content.domains.paragraph}</p>

          <p className="pt-8">
            <span className="font-medium text-black">{content.closingLine}</span>
          </p>
        </div>
      </section>
    </div>
  );
}
