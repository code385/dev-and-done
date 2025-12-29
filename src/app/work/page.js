import Section from '@/components/ui/Section';
import CaseStudyCard from '@/components/ui/CaseStudyCard';
import { caseStudies } from '@/data/caseStudies';

export const metadata = {
  title: 'Work',
  description: 'Explore our portfolio of successful projects. Case studies showcasing our web development, mobile apps, and AI solutions.',
};

export default function WorkPage() {
  return (
    <Section className="pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Real projects, real results. Explore case studies from our portfolio showcasing 
          successful web applications, mobile apps, and AI solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((caseStudy, index) => (
          <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} delay={index * 0.1} />
        ))}
      </div>
    </Section>
  );
}

