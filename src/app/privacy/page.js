import Section from '@/components/ui/Section';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DevAndDone - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to DevAndDone ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at{' '}
              <a href="https://devanddone.com" className="text-primary hover:underline">devanddone.com</a>.
            </p>
            <p className="text-muted-foreground">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
            <p className="text-muted-foreground mb-4">
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Contact us through our contact forms</li>
              <li>Subscribe to our newsletter</li>
              <li>Use our Project Estimator tool</li>
              <li>Engage with our AI chat interface</li>
              <li>Request information about our services</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              This information may include: name, email address, phone number, company name, project details, and any other information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages you visit and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device identifiers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
              <li>Generate project estimates and provide AI-powered assistance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as email delivery, hosting, and analytics.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
              <li><strong>With Your Consent:</strong> We may share information with your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your personal information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@devanddone.com" className="text-primary hover:underline">privacy@devanddone.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
            <p className="text-muted-foreground mb-4">
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to the transfer of your information to our facilities and those third parties with whom we share it as described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p className="text-foreground"><strong>DevAndDone</strong></p>
              <p className="text-muted-foreground">
                Email: <a href="mailto:privacy@devanddone.com" className="text-primary hover:underline">privacy@devanddone.com</a>
              </p>
              <p className="text-muted-foreground">
                Website: <a href="https://devanddone.com" className="text-primary hover:underline">devanddone.com</a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href="/" 
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </Section>
  );
}

