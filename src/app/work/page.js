import Section from '@/components/ui/Section';
import CaseStudyCard from '@/components/ui/CaseStudyCard';
import * as PortfolioModel from '@/lib/mongodb/models/Portfolio';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Our Work | DevAndDone',
    description: 'Explore our portfolio of successful projects. Case studies showcasing our web development, mobile apps, and AI solutions.',
    path: '/work',
  });
}

export default async function WorkPage() {
  // Fetch published portfolio projects from database
  let projects = [];
  try {
    projects = await PortfolioModel.getPortfolioProjects(
      {},
      {
        limit: 50,
        published: true,
        sort: { order: -1, createdAt: -1 },
      }
    );
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    // Fallback to empty array if database fails
  }

  // Transform to case study format for compatibility
  const caseStudies = projects.map((project) => ({
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
  }));

  return (
    <Section className="pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Real projects, real results. Explore case studies from our portfolio showcasing 
          successful web applications, mobile apps, and AI solutions.
        </p>
      </div>

      {caseStudies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyCard key={`${caseStudy.id}-${caseStudy.slug}-${index}`} caseStudy={caseStudy} delay={index * 0.1} />
          ))}
        </div>
      )}
    </Section>
  );
}
