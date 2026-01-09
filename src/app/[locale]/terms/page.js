import Section from '@/components/ui/Section';
import { Link } from '@/i18n/routing';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for DevAndDone - Read our terms and conditions for using our website and services.',
};

export default function TermsOfServicePage() {
  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using the DevAndDone website ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all visitors, users, and others who access or use the Service. DevAndDone ("we," "us," or "our") reserves the right to update, change, or replace any part of these Terms by posting updates and changes to our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily access the materials on DevAndDone's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p className="text-muted-foreground">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by DevAndDone at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Services Description</h2>
            <p className="text-muted-foreground mb-4">
              DevAndDone provides web development, mobile app development, AI solutions, and related technology services. We strive to provide accurate descriptions of our services, but we do not warrant that service descriptions are accurate, complete, reliable, current, or error-free.
            </p>
            <p className="text-muted-foreground">
              The tools and services provided on our website, including but not limited to the Project Estimator and Tech Playground, are provided for informational and demonstration purposes only. Estimates provided are approximations and should not be considered binding quotes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. User Accounts and Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us or use our services, you must provide information that is accurate, complete, and current at all times. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and truthful information</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">You may not use our Service:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of DevAndDone and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, DevAndDone:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Excludes all representations, warranties, and conditions relating to our website and the use of this website</li>
              <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
            </ul>
            <p className="text-muted-foreground">
              Nothing in this disclaimer will limit or exclude our liability for death or personal injury resulting from negligence, limit or exclude our liability for fraud or fraudulent misrepresentation, or limit any of our liabilities in any way that is not permitted under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall DevAndDone, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to defend, indemnify, and hold harmless DevAndDone and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Your use and access of the Service</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third party right, including without limitation any copyright, property, or privacy right</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-muted-foreground">
              If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which DevAndDone operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-muted-foreground">
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p className="text-foreground"><strong>DevAndDone</strong></p>
              <p className="text-muted-foreground">
                Email: <a href="mailto:info@devanddone.com" className="text-primary hover:underline">info@devanddone.com</a>
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

