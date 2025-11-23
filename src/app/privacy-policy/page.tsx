"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-heading">Privacy Policy</h1>
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
              <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to NutraScan AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Account information (email address, password)</li>
                <li>Profile information (name, age, weight, height, health goals)</li>
                <li>Supplement analysis data (product photos, ingredient lists)</li>
                <li>Usage data and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Analyze supplements and provide personalized recommendations</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Data Storage and Security</h2>
              <p className="text-muted-foreground">
                We use industry-standard security measures to protect your personal information. Your data is stored securely using Supabase, a trusted cloud database provider. We implement encryption, access controls, and regular security audits to ensure the safety of your information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Sharing Your Information</h2>
              <p className="text-muted-foreground mb-2">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who assist in our operations</li>
                <li>To protect the rights and safety of our users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Disable analytics data collection in settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-primary font-medium mt-2">
                support@nutrascan.ai
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
