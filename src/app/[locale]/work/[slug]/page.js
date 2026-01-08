import { notFound } from 'next/navigation';
import CaseStudyDetail from '@/components/ui/CaseStudyDetail';
import { getCaseStudyBySlug, caseStudies } from '@/data/caseStudies';

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/work/${slug}`;
  const image = caseStudy.image 
    ? (caseStudy.image.startsWith('http') ? caseStudy.image : `${baseUrl}${caseStudy.image}`)
    : `${baseUrl}/og-image.jpg`;

  return {
    title: `${caseStudy.title} | DevAndDone Case Study`,
    description: caseStudy.problem || caseStudy.solution || caseStudy.title,
    keywords: [caseStudy.category, 'DevAndDone', 'case study', 'portfolio'],
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.problem || caseStudy.solution || caseStudy.title,
      url: url,
      siteName: 'DevAndDone',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      section: caseStudy.category,
      tags: caseStudy.techStack || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.problem || caseStudy.solution || caseStudy.title,
      images: [image],
      creator: '@devanddone',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyDetail caseStudy={caseStudy} />;
}

