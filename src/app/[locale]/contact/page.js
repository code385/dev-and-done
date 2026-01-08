'use client';

import Section from '@/components/ui/Section';
import ContactForm from '@/components/ui/ContactForm';
import TrustBadges from '@/components/ui/TrustBadges';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Mail, Clock, Phone, MessageCircle, MapPin, Calendar, Zap, Headphones } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ContactPage() {
  // Use NEXT_PUBLIC_ prefix for client component access, or fallback to default
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@devanddone.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';
  const whatsappMessage = encodeURIComponent("Hello! I'm interested in your services. Can we discuss my project?");
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: 'Available 24/7',
      href: whatsappUrl,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Phone,
      title: 'Schedule a Call',
      description: 'Book a consultation',
      value: 'Via contact form',
      href: '#contact-form',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const features = [
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'We typically respond within 24 hours during business days',
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'Get your project started quickly with our streamlined process',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Our team is here to help you every step of the way',
    },
  ];

  return (
    <Section className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Ready to start your project? Have questions? We're here to help. Choose your preferred way to reach us.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  {method.href.startsWith('#') ? (
                    <a
                      href={method.href}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {method.value}
                      <span>→</span>
                    </a>
                  ) : (
                    <a
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {method.value}
                      <span>→</span>
                    </a>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Contact Form - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
            id="contact-form"
          >
            <Card className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <ContactForm />
            </Card>
          </motion.div>

          {/* Contact Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Info Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-500 hover:underline"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Response Time</p>
                      <p className="text-sm text-muted-foreground">
                        Within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/estimator">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Project Estimate
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Chat Assistant
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Tech Playground
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <TrustBadges />
        </motion.div>
      </div>
    </Section>
  );
}

