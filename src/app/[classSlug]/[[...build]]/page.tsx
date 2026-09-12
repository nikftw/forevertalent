import { notFound } from "next/navigation";
import { TalentCalculator } from "@/components/TalentCalculator";
import { CLASSES, getClass, isClassSlug } from "@/lib/classes";

type CalculatorPageProps = {
  params: Promise<{
    classSlug: string;
    build?: string[];
  }>;
};

export function generateStaticParams() {
  return CLASSES.map((cls) => ({ classSlug: cls.slug }));
}

export async function generateMetadata({ params }: CalculatorPageProps) {
  const { classSlug } = await params;
  const cls = getClass(classSlug);
  if (!cls) return { title: "Talent Calculator" };
  return { title: `${cls.name} Talent Calculator — WoW Forever` };
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { classSlug, build } = await params;
  if (!isClassSlug(classSlug)) notFound();
  const cls = getClass(classSlug);
  if (!cls) notFound();

  return (
    <TalentCalculator key={cls.slug} cls={cls} initialBuild={build?.[0] ?? ""} />
  );
}
