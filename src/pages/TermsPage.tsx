import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Shield, Users, Gavel } from 'lucide-react';
const TermsPage = () => {
  return <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Please read these terms carefully before using ClipSync.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  By accessing and using ClipSync, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>ClipSync provides:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Clipboard synchronization across devices</li>
                  <li>Secure file sharing capabilities</li>
                  <li>Anonymous quick sharing features</li>
                  <li>Cloud storage for clips and files</li>
                </ul>
                <p className="text-primary font-semibold">
                  ClipSync is provided as a free service to all users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Users are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of their account credentials</li>
                  <li>Ensuring content shared does not violate any laws or third-party rights</li>
                  <li>Using the service in accordance with these terms</li>
                  <li>Reporting any security vulnerabilities or misuse</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You may not use ClipSync to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Share illegal, harmful, or offensive content</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Distribute malware or malicious code</li>
                  <li>Engage in spam or harassment</li>
                  <li>Use the service for commercial purposes without permission</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data and Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>User clips automatically expire after 30 days</li>
                  <li>Quick shares expire after 1 hour</li>
                  <li>We implement strong security measures to protect your data</li>
                  <li>See our Privacy Policy for detailed information about data handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  While we strive to maintain high availability, ClipSync is provided "as is" without warranties. 
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or discontinue the service with notice</li>
                  <li>Implement maintenance windows</li>
                  <li>Update these terms as necessary</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  ClipSync and its operators shall not be liable for any direct, indirect, incidental, special, 
                  consequential, or punitive damages resulting from your use of the service. Users assume full 
                  responsibility for their use of the service and any content shared.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We reserve the right to terminate accounts that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate these terms of service</li>
                  <li>Engage in abusive or harmful behavior</li>
                  <li>Compromise service security or performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>For questions about these Terms and Conditions contact us via email</p>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default TermsPage;