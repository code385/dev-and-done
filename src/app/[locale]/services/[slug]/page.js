import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TechStackBadge from '@/components/ui/TechStackBadge';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { Link } from '@/i18n/routing';
import { services } from '@/data/services';

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.id,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.id === slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.title} | DevAndDone`,
    description: service.longDescription,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">{service.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {service.description}
            </p>
          </div>

          {/* Conversational Introduction */}
          <Card className="mb-8 p-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-lg leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: service.detailedContent || `
                    <p>Hey there! 👋 So you're interested in <strong>${service.title}</strong>? That's awesome! 
                    Let me tell you a bit about what we do and how we can help bring your vision to life.</p>
                    <p>${service.longDescription}</p>
                    <p>Whether you're a startup looking to build your first product or an established business 
                    ready to scale, we've got the expertise and passion to make it happen. Let's dive into 
                    the details, shall we?</p>
                  `
                }}
              />
            </div>
          </Card>

          {/* Tech Stack */}
          <Card className="mb-8 p-8">
            <h2 className="text-2xl font-bold mb-4">Technologies We Use</h2>
            <p className="text-muted-foreground mb-6">
              We stay on the cutting edge of technology to ensure your project is built with the best tools available. 
              Here's what we typically work with for {service.title}:
            </p>
            <div className="flex flex-wrap gap-3">
              {service.techStack.map((tech) => (
                <TechStackBadge key={tech} tech={tech} />
              ))}
            </div>
          </Card>

          {/* Our Process */}
          <Card className="mb-8 p-8">
            <h2 className="text-2xl font-bold mb-4">How We Work Together</h2>
            <p className="text-muted-foreground mb-6">
              Every great project starts with a solid process. Here's how we'll work together to bring your 
              {service.title.toLowerCase()} project to life:
            </p>
            <ol className="space-y-4">
              {service.process.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.processDetails && service.processDetails[index] 
                        ? service.processDetails[index]
                        : (index === 0 && "We'll start by understanding your goals, target audience, and vision. This is where we ask lots of questions and listen carefully.")
                        || (index === 1 && "Next, we'll create designs and prototypes that bring your ideas to life. You'll see exactly what we're building before we write a single line of code.")
                        || (index === 2 && "This is where the magic happens! We'll build your project with clean, maintainable code while keeping you updated every step of the way.")
                        || (index === 3 && "Before launch, we'll thoroughly test everything to ensure it works perfectly. Then we'll deploy it and make sure everything runs smoothly.")
                        || (index === 4 && "Our relationship doesn't end at launch. We'll be here to support you, fix any issues, and help you grow as your needs evolve.")
                      }
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {/* Expected Outcomes */}
          <Card className="mb-8 p-8">
            <h2 className="text-2xl font-bold mb-4">What You Can Expect</h2>
            <p className="text-muted-foreground mb-6">
              When we work together on your {service.title.toLowerCase()} project, here's what you'll get:
            </p>
            <ul className="space-y-3">
              {service.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary text-xl mt-1">✓</span>
                  <span className="text-foreground">{outcome}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Testimonials */}
          <TestimonialsSection serviceType={slug} limit={3} />

          {/* Call to Action */}
          <Card className="mb-8 p-8 bg-primary/5 border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We'd love to hear about your project and see how we can help. Whether you have a clear vision 
                or just a rough idea, let's chat! We offer free consultations to discuss your needs and see if 
                we're a good fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-service">
                  <Button variant="primary" size="lg">
                    Book a Consultation
                  </Button>
                </Link>
                <Link href="/estimator">
                  <Button variant="outline" size="lg">
                    Get a Quick Estimate
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Back to Services */}
          <div className="text-center">
            <Link 
              href="/services"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Services
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

