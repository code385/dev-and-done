'use client';

import Section from './Section';
import TechStackBadge from './TechStackBadge';
import Card from './Card';
import SocialShare from './SocialShare';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Globe } from 'lucide-react';

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

        {/* Links and Demo Video */}
        {(caseStudy.githubLink || caseStudy.liveLink || caseStudy.demoVideo) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Action Links */}
            <Card>
              <h3 className="text-xl font-bold mb-4">Project Links</h3>
              <div className="flex flex-wrap gap-3">
                {caseStudy.githubLink && (
                  <a
                    href={caseStudy.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {caseStudy.liveLink && (
                  <a
                    href={caseStudy.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>

            {/* Demo Video */}
            {caseStudy.demoVideo && (
              <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Demo Video
                </h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                  {(() => {
                    const videoUrl = caseStudy.demoVideo;
                    // YouTube embed
                    if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
                      const videoId = videoUrl.includes('youtu.be/')
                        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                        : videoUrl.split('v=')[1]?.split('&')[0];
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Demo Video"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    // Vimeo embed
                    if (videoUrl.includes('vimeo.com/')) {
                      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
                      return (
                        <iframe
                          src={`https://player.vimeo.com/video/${videoId}`}
                          title="Demo Video"
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    // Direct video URL
                    return (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full"
                        controlsList="nodownload"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  })()}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
}

