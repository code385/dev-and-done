import { notFound } from 'next/navigation';
import CaseStudyDetail from '@/components/ui/CaseStudyDetail';
import { getCaseStudyBySlug, caseStudies } from '@/data/caseStudies';

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export function generateMetadata({ params }) {
  const caseStudy = getCaseStudyBySlug(params.slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: caseStudy.title,
    description: caseStudy.problem,
  };
}

export default function CaseStudyPage({ params }) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyDetail caseStudy={caseStudy} />;
}

