import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Database, Trash2, Download, Lock } from 'lucide-react';
const PrivacyPolicyPage = () => {
  return <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Your privacy is important to us. This policy explains how ClipSync collects, uses, and protects your data.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>ClipSync collects the following types of information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Email address and authentication data when you create an account</li>
                  <li><strong>Content Data:</strong> Text and files you choose to store or share through our service</li>
                  <li><strong>Usage Analytics:</strong> Anonymous usage statistics to improve our service (content types, timestamps)</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, and device information for security purposes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  How We Use Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your data is used solely for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing clipboard synchronization and file sharing services</li>
                  <li>Maintaining account security and authentication</li>
                  <li>Improving service performance and user experience</li>
                  <li>Generating anonymous analytics for service optimization</li>
                </ul>
                <p className="font-semibold text-primary">
                  We never sell, rent, or share your personal data with third parties for marketing purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>ClipSync implements industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Authentication:</strong> Secure user authentication through Supabase Auth</li>
                  <li><strong>Access Controls:</strong> Role-based access with strict permissions</li>
                  <li><strong>Regular Audits:</strong> Security reviews and vulnerability assessments</li>
                  <li><strong>Data Isolation:</strong> User data is isolated using Row Level Security (RLS)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Data Retention & Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Our data retention policy ensures your privacy:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Clips:</strong> User clips expire after 30 days by default</li>
                  <li><strong>Quick Shares:</strong> Anonymous shares expire after 1 hour</li>
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Automated Cleanup:</strong> Expired content is automatically deleted</li>
                  <li><strong>Account Deletion:</strong> All associated data is permanently deleted when you close your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data</li>
                </ul>
                <p className="text-sm text-muted-foreground">To exercise these rights, contact us at praiseofumaduadike@gmail.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>If you have questions about this Privacy Policy, please contact us: praiseofumaduadike@gmail.com</p>
                <div className="mt-4 space-y-1">
                  
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default PrivacyPolicyPage;