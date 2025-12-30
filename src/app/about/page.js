'use client';

import Section from '@/components/ui/Section';
import FounderStory from '@/components/sections/FounderStory';
import Vision from '@/components/sections/Vision';
import TeamCarousel from '@/components/ui/TeamCarousel';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      title: 'Technical Excellence',
      description: 'We stay at the forefront of technology, using the latest tools and best practices to build robust, scalable solutions.',
      icon: '⚡',
    },
    {
      title: 'Business-First Approach',
      description: 'Every line of code serves a business purpose. We understand your goals and build solutions that drive results.',
      icon: '🎯',
    },
    {
      title: 'Long-Term Partnership',
      description: 'We\'re not just contractors. We build lasting relationships and support your growth every step of the way.',
      icon: '🤝',
    },
    {
      title: 'Transparency & Trust',
      description: 'Clear communication, honest estimates, and no surprises. You always know where your project stands.',
      icon: '💎',
    },
  ];

  const teamMembers = [
    {
      name: 'Muhammad Irfan',
      role: 'Founder & CEO',
      shortBio: "Founder & CEO leading vision, growth, and execution. Full-stack engineer skilled in modern web technologies including React, Next.js, Node.js, and scalable cloud-ready architectures.",
      bio: 'Serial entrepreneur with 10+ years in software development. Passionate about building products that solve real problems and drive business growth.',
      skills: [
        'Python',
        'React.js',
        'Next.js',
        'Node.js',
        'Laravel',
        'Java Script',
        'Figma',
        'React Native',
        'MongoDB',
        'MySQL',
        'Firebase',
        'Git & GitHub',
        'Vercel Deployment',
        'Responsive UI Design'
      ],
      portfolio: 'https://irfan.devanddone.com',
      linkedin: 'https://www.linkedin.com/in/irfan-khan1074/',
      github: 'https://github.com/code385',
      email: 'codingwithme178@gmail.com',
      avatar: '/team/IRFAN_FINAL.jpeg', // Add your team member image to /public/team/irfan.jpg
    },
    {
      name: 'Tayyab Sajjad',
      role: 'Chief Operating Officer (COO)',
      avatar: '/team/TAYYAB_FINAL.jpeg', // Add your team member images to /public/team/Tayyab.jpg
      shortBio: 'Chief Operating Officer overseeing execution, processes, and operational excellence. Tech-driven leader with hands-on experience across full-stack web, mobile development, and modern development tools.',
      bio: 'Full-stack architect specializing in scalable systems. Led engineering teams at Fortune 500 companies before co-founding DevAndDone.',
      skills: [
        'JavaScript',
        'React.js',
        'Next.js',
        'Node.js',
        'Laravel',
        'REST APIs',
        'MongoDB',
        'MySQL',
        'Firebase',
        'Git & GitHub',
        'Vercel Deployment',
        'Responsive UI Design'
      ],
      portfolio: 'https://tayyab.devanddone.com',
      linkedin: 'https://www.linkedin.com/in/tayyab-sajjad/',
      github: 'https://github.com/tayyab2203',
      email: 'tayyabsajjad4679@gmail.com',
    },
    {
      name: 'Fazal Abbas',
      role: 'Chief Technology Officer (CTO)',
      avatar: '/team/FAZAL_FINAL.jpeg', // Add your team member images to /public/team/
      shortBio: 'Chief Technology Officer leading technical vision and architecture. Full-stack engineer experienced in web and mobile technologies including React, Next.js, Node.js, Laravel, Flutter, and scalable system design.',
      bio: 'Financial strategist with expertise in tech startups. Ensures sustainable growth and financial health while maintaining our commitment to quality.',
      skills: [
        'JavaScript',
        'React.js',
        'Next.js',
        'Node.js',
        'Laravel',
        'Symfony',
        'Flutter',
        'React Native',
        'MongoDB',
        'MySQL',
        'Firebase',
        'Git & GitHub',
        'Vercel Deployment',
        'Responsive UI Design'
      ],
      portfolio: 'https://fazal.devanddone.com',
      linkedin: 'https://www.linkedin.com/in/fazalabbas2052/',
      github: 'https://github.com/Fazal-Abbas2052',
      email: 'fazalabbas2052@gmail.com',
    },
    {
      name: 'Muhammad Naveed Saleem',
      role: 'Chief Strategy & Growth Officer (CSGO)',
      avatar: '/team/NAVEED_FINAL.jpeg', // Add your team member images to /public/team/
      shortBio: 'Chief Strategy & Growth Officer driving scalable growth and market expansion. Tech-enabled leader with hands-on experience in building and integrating modern web products using JavaScript frameworks, APIs, and data-driven systems.',
      bio: 'Award-winning UX/UI designer with a focus on user-centered design. Transforms complex requirements into intuitive, beautiful interfaces.',
      skills: [
        'JavaScript',
        'React.js',
        'Next.js',
        'Node.js',
        'Laravel',
        'REST APIs',
        'MongoDB',
        'MySQL',
        'Firebase',
        'Git & GitHub',
        'Vercel Deployment',
        'Responsive UI Design'
      ],
      portfolio: 'https://naveedsaleem.devanddone.com',
      linkedin: 'https://www.linkedin.com/in/muhammad-naveed-saleem',
      github: 'https://github.com/muhammadnaveedsaleem774',
      email: 'navidbscs2239@gmail.com',
    },
    {
      name: 'Talha Shehzad',
      role: 'Chief Marketing Officer (CMO)',
      avatar: '/team/TALHA_FINAL.png', // Add your team member images to /public/team/
      shortBio: 'Chief Marketing Officer driving growth through strategy and innovation. AI Engineer focused on intelligent, data-driven systems using machine learning, NLP, and modern generative AI frameworks.',
      bio: 'Full-stack engineer passionate about modern web technologies. Expert in React, Next.js, and cloud architecture with a track record of delivering high-performance applications.',
      skills: [
        'Python',
        'Machine Learning',
        'Deep Learning',
        'NLP',
        'Scikit-learn',
        'PyTorch',
        'Data Analysis',
        'Data Preprocessing',
        'Model Training & Evaluation',
        'MLOps',
        'MLflow',
        'LangChain',
        'LangGraph',
        'RAG Pipelines',
        'Git & GitHub'
      ],
      portfolio: 'https://talha.devanddone.com',
      linkedin: 'https://www.linkedin.com/in/talhashahzad-ai/',
      github: 'https://github.com/TalhaShahzad-321',
      email: 'shahzadtalha843@gmail.com',
    },
    {
      name: 'Muhammad Kamil',
      role: 'Chief Product Officer (CPO)',
      avatar: '/team/KAMIL_FINAL.png', // Add your team member images to /public/team/
      shortBio: 'Chief Product Officer shaping product vision and user experience. Product-focused full-stack engineer experienced in building scalable, user-centric web applications using modern JavaScript frameworks and APIs.',
      bio: 'Operations specialist ensuring smooth project delivery and client satisfaction. Manages timelines, resources, and quality assurance across all projects.',
      skills: ['Project Management', 'Quality Assurance', 'Process Optimization'],
      portfolio: 'https://lisaanderson.dev',
      linkedin: 'https://linkedin.com/in/lisaanderson',
      github: 'https://github.com/lisaanderson',
      email: 'lisa@devanddone.com',
    },
  ];

  const stats = [
    { value: '7+', label: 'Projects Delivered' },
    { value: '3+', label: 'Happy Clients' },
    { value: '2+', label: 'Years Experience' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <Section className="pt-24">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About DevAndDone
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're not a normal dev agency. We're a founder-led team building
            next-generation digital products that drive real business results.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Founder Story */}
      <div className="max-w-4xl mx-auto mb-16">
        <FounderStory />
      </div>

      {/* Vision */}
      <div className="max-w-4xl mx-auto mb-16">
        <Vision />
      </div>

      {/* Our Values */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A diverse group of experts passionate about technology, innovation, and delivering
            exceptional results for our clients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <TeamCarousel members={teamMembers} />
        </motion.div>
      </div>

      {/* Why DevAndDone Exists */}
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <h2 className="text-3xl font-bold mb-6">Why DevAndDone Exists</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                The development industry is filled with agencies that overpromise and underdeliver.
                Projects drag on, budgets balloon, and clients are left with solutions that don't
                meet their needs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                DevAndDone exists to change that. We believe in:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Building products, not just writing code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Transparent processes and honest communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Modern technology stacks that stand the test of time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Partnerships that extend beyond project completion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Delivering value that exceeds expectations</span>
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let's discuss how DevAndDone can help bring your vision to life.
                We're here to answer your questions and explore how we can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get in Touch
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 bg-background border border-border text-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  View Our Services
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}