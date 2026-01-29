import { notFound } from 'next/navigation';
import CaseStudyDetail from '@/components/ui/CaseStudyDetail';
import * as PortfolioModel from '@/lib/mongodb/models/Portfolio';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const project = await PortfolioModel.getPortfolioProjectBySlug(slug);
    
    if (!project) {
      return {
        title: 'Case Study Not Found',
      };
    }

    return generatePageMetadata({
      title: `${project.title} | DevAndDone Case Study`,
      description: project.problem || project.solution || project.description || project.title,
      path: `/work/${slug}`,
    });
  } catch (error) {
    return {
      title: 'Case Study Not Found',
    };
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  
  let project = null;
  try {
    project = await PortfolioModel.getPortfolioProjectBySlug(slug);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
  }

  if (!project) {
    notFound();
  }

  // Transform to case study format for compatibility
  const caseStudy = {
    id: project._id.toString(),
    slug: project.slug,
    title: project.title,
    category: project.category || 'Web Development',
    client: project.client || '',
    problem: project.problem || project.description || '',
    solution: project.solution || '',
    result: project.result || '',
    metrics: project.metrics || [],
    techStack: project.techStack || [],
    image: project.image || '/case-studies/default.jpg',
    featured: project.featured || false,
    githubLink: project.githubLink || '',
    liveLink: project.liveLink || '',
    demoVideo: project.demoVideo || '',
  };

  return <CaseStudyDetail caseStudy={caseStudy} />;
}
