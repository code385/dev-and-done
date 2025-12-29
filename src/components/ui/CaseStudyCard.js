'use client';

import Card from './Card';
import Link from 'next/link';
import TechStackBadge from './TechStackBadge';
import { motion } from 'framer-motion';

export default function CaseStudyCard({ caseStudy, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link href={`/work/${caseStudy.slug}`}>
        <Card hover className="h-full">
          {caseStudy.featured && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Featured
            </span>
          )}
          <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{caseStudy.category}</p>
          <p className="text-muted-foreground mb-4 line-clamp-3">{caseStudy.problem}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {caseStudy.techStack.slice(0, 4).map((tech) => (
              <TechStackBadge key={tech} tech={tech} />
            ))}
          </div>

          <div className="flex items-center text-primary font-medium">
            View Case Study
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

