import { notFound } from "next/navigation";
import { getModule } from "@/content/modules";
import { getSessionRole } from "@/lib/auth";
import { getModuleQuestionsReview } from "@/lib/reviews";
import { MODULE_QUESTIONS_SECTION_ID } from "@/types/reviews";
import { ModuleHub } from "@/components/ModuleHub";
import { SectionReviewProvider } from "@/components/SectionReviewContext";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const [questionsReview, sessionRole] = await Promise.all([
    getModuleQuestionsReview(moduleId),
    getSessionRole(),
  ]);

  return (
    <SectionReviewProvider
      moduleId={moduleId}
      sectionId={MODULE_QUESTIONS_SECTION_ID}
      initialReview={questionsReview}
      sessionRole={sessionRole}
    >
      <ModuleHub mod={mod} />
    </SectionReviewProvider>
  );
}
