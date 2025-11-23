"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TermsOfServicePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-b from-primary/10 to-background border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/settings")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-heading">Terms of Service</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Last updated: November 22, 2025
          </p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using NutraScan AI ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                NutraScan AI is a supplement analysis application that uses artificial intelligence to evaluate nutritional supplements, provide ingredient analysis, and suggest alternatives. The App is designed for informational purposes only and should not be considered medical advice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground mb-2">When creating an account, you agree to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly notify us of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Subscription and Payments</h2>
              <p className="text-muted-foreground mb-2">For premium subscriptions:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Payments are processed securely through Stripe</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Refunds are handled according to our refund policy</li>
                <li>Prices may change with 30 days advance notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-muted-foreground mb-2">You agree not to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Use the App for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the App's functionality</li>
                <li>Upload malicious content or viruses</li>
                <li>Scrape or collect data without permission</li>
                <li>Resell or redistribute our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Medical Disclaimer</h2>
              <p className="text-muted-foreground">
                <strong>Important:</strong> NutraScan AI is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting any supplement regimen. The information provided by our App is for educational purposes only. We do not guarantee the accuracy of supplement analyses or recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of NutraScan AI, including but not limited to text, graphics, logos, and software, are owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, NutraScan AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of the App.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless NutraScan AI and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the App or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">10. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms in the App. Continued use of the App after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">13. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-primary font-medium mt-2">
                legal@nutrascan.ai
              </p>
            </section>
          </div>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => router.push("/settings")}>
            Back to Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
