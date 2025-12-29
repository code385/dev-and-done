'use client';

import { motion } from 'framer-motion';

export default function PortfolioTemplate({ demoComponent, demoName }) {
  const projects = [
    { id: 1, title: 'E-Commerce Platform', category: 'Web Development', image: '🛒' },
    { id: 2, title: 'Mobile App Design', category: 'UI/UX Design', image: '📱' },
    { id: 3, title: 'Brand Identity', category: 'Branding', image: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
          >
            Alex Morgan
          </motion.div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#work" className="text-sm text-muted-foreground hover:text-foreground transition">Work</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">About</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Demo */}
        <div className="absolute inset-0 -z-10 opacity-50">
          {demoComponent}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            Creative
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Designer
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            I craft beautiful digital experiences that tell your story
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-background rounded-lg font-semibold"
            >
              View My Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-border rounded-lg font-semibold"
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Featured Projects
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/50 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {project.image}
                </div>
                <div className="p-6">
                  <span className="text-xs text-muted-foreground uppercase">{project.category}</span>
                  <h3 className="text-xl font-semibold mt-2 mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">View Project →</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 8 years of experience in digital design, I specialize in creating 
              user-centered experiences that combine beautiful aesthetics with functional design. 
              I work with startups and established brands to bring their vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Let's Work Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground mb-8"
          >
            Have a project in mind? I'd love to hear about it.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-background rounded-lg text-lg font-semibold"
          >
            Send Message
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 Alex Morgan. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

