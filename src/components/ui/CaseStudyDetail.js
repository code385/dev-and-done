'use client';

import Section from './Section';
import TechStackBadge from './TechStackBadge';
import Card from './Card';
import SocialShare from './SocialShare';
import { motion } from 'framer-motion';

export default function CaseStudyDetail({ caseStudy }) {
  return (
    <Section className="pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                {caseStudy.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
              <p className="text-lg text-muted-foreground">Client: {caseStudy.client}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Share:</span>
              <SocialShare
                url={`/work/${caseStudy.slug}`}
                title={caseStudy.title}
                description={caseStudy.problem || caseStudy.solution}
                contentType="work"
                contentId={caseStudy.id || caseStudy.slug}
                image={caseStudy.image}
                variant="horizontal"
                size="md"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {caseStudy.metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">The Problem</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{caseStudy.problem}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{caseStudy.solution}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4">The Result</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{caseStudy.result}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.techStack.map((tech) => (
                <TechStackBadge key={tech} tech={tech} />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}

