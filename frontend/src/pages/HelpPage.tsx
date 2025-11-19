import { useState } from 'react';
import {
  HelpCircle,
  Book,
  ChevronDown,
  ChevronUp,
  Flame,
  QrCode,
  FileText,
  Bell,
  Building2,
  Package,
  Users,
  CreditCard,
  Settings,
  Camera,
  Download,
  Upload,
  Search,
  Calendar,
  Shield,
  Mail,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FeatureSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const featureSections: FeatureSection[] = [
    {
      title: 'Fire Extinguisher Management',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      description: 'Track and manage all your fire extinguishers in one place.',
      features: [
        'Add extinguishers with detailed information (type, size, location, building)',
        'Track condition status: OK, Needs Attention, or Out of Service',
        'Record inspection dates and next service dates',
        'View inspection history and maintenance records',
        'Filter and search extinguishers by various criteria',
        'Export data to CSV for reporting',
        'Import extinguishers from CSV files',
      ],
    },
    {
      title: 'QR Code System',
      icon: <QrCode className="w-6 h-6 text-blue-500" />,
      description: 'Generate and scan QR codes for quick extinguisher access.',
      features: [
        'Generate unique QR codes for each extinguisher',
        'Bulk generate QR codes for multiple extinguishers',
        'Download QR codes as images or print them',
        'Scan QR codes to quickly access extinguisher details',
        'Public verification page for anyone to check extinguisher status',
        'QR codes link directly to extinguisher information',
      ],
    },
    {
      title: 'Inspection & Reports',
      icon: <FileText className="w-6 h-6 text-green-500" />,
      description: 'Document inspections and generate professional reports.',
      features: [
        'Record inspection results with photos',
        'Take photos directly from the app during inspections',
        'Generate PDF service reports with photos',
        'Track inspection history over time',
        'Set next inspection dates and receive reminders',
        'Professional branded reports for clients',
      ],
    },
    {
      title: 'Sites & Locations',
      icon: <Building2 className="w-6 h-6 text-purple-500" />,
      description: 'Organize extinguishers by sites and buildings.',
      features: [
        'Create multiple sites (client locations)',
        'Add address and contact information for each site',
        'Assign extinguishers to specific sites',
        'View all extinguishers at a site',
        'Filter dashboard by site',
        'Generate site-specific reports',
      ],
    },
    {
      title: 'Inventory Management',
      icon: <Package className="w-6 h-6 text-orange-500" />,
      description: 'Track your stock of parts, supplies, and equipment.',
      features: [
        'Add inventory items with stock levels',
        'Set minimum stock thresholds for alerts',
        'Track usage and consumption',
        'Record when items are used on extinguishers',
        'View low stock alerts',
        'Generate inventory reports',
      ],
    },
    {
      title: 'Push Notifications',
      icon: <Bell className="w-6 h-6 text-yellow-500" />,
      description: 'Stay informed with real-time notifications.',
      features: [
        'Receive alerts for upcoming inspections',
        'Get notified when extinguisher status changes',
        'Maintenance reminders before due dates',
        'Low stock inventory alerts',
        'Enable/disable notifications per device',
        'Test notifications from settings',
      ],
    },
    {
      title: 'Team Management',
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      description: 'Manage your team and their permissions.',
      features: [
        'Invite team members to your organization',
        'Assign roles: Admin, Technician, or Viewer',
        'Control access to sensitive features',
        'Track who made changes to records',
        'Remove or update team member access',
      ],
    },
    {
      title: 'Billing & Subscription',
      icon: <CreditCard className="w-6 h-6 text-pink-500" />,
      description: 'Manage your subscription and billing.',
      features: [
        'View current subscription plan',
        'Upgrade or downgrade your plan',
        'Access billing portal for invoices',
        'Update payment methods',
        'View usage against plan limits',
      ],
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'How do I add a new fire extinguisher?',
      answer: 'Click the "Add Extinguisher" button on the Overview page. Fill in the required details including building, location, type, and size. You can also add optional information like serial number, manufacture date, and next service date.',
    },
    {
      question: 'How do I generate QR codes for my extinguishers?',
      answer: 'Go to the QR Codes tab and click "Generate QR Codes". Select the extinguishers you want to generate codes for, then download them individually or as a bulk ZIP file. Print and attach these codes to your physical extinguishers.',
    },
    {
      question: 'How do I record an inspection?',
      answer: 'Open an extinguisher\'s details by clicking on it in the table. Update the condition status, last inspection date, and any notes. You can also upload photos of the inspection. Click "Generate Report" to create a PDF service report.',
    },
    {
      question: 'What do the condition statuses mean?',
      answer: 'OK (green): Extinguisher is in good working condition. Needs Attention (yellow): Requires maintenance or minor repairs. Out of Service (red): Extinguisher should not be used and needs immediate attention or replacement.',
    },
    {
      question: 'How do I import extinguishers from a CSV file?',
      answer: 'On the Overview page, click "Import CSV". Download the template to see the required format. Fill in your data and upload the file. The system will validate and import your extinguishers.',
    },
    {
      question: 'How do I set up push notifications?',
      answer: 'Go to Settings and find the Notification Settings section. Click "Enable Notifications" and allow notifications in your browser. You\'ll receive alerts for inspections, status changes, and maintenance reminders.',
    },
    {
      question: 'How do I add team members?',
      answer: 'Go to the Users tab (Admin only). Click "Invite User" and enter their email address. Choose their role (Admin, Technician, or Viewer). They\'ll receive an email invitation to join your organization.',
    },
    {
      question: 'What\'s the difference between user roles?',
      answer: 'Admin: Full access to all features including billing and user management. Technician: Can view and edit extinguishers, perform inspections, and generate reports. Viewer: Read-only access to view extinguishers and reports.',
    },
    {
      question: 'How do I create a site/location?',
      answer: 'Go to the Sites tab and click "Add Site". Enter the site name, address, and contact information. Once created, you can assign extinguishers to this site when adding or editing them.',
    },
    {
      question: 'How do I generate a service report?',
      answer: 'Open an extinguisher\'s details and click the "Generate Report" button. The system will create a professional PDF report including all extinguisher details, inspection history, and any photos you\'ve uploaded.',
    },
    {
      question: 'Can customers verify extinguisher status?',
      answer: 'Yes! When someone scans a QR code, they\'re taken to a public verification page showing the extinguisher\'s current status, last inspection date, and location. No login required.',
    },
    {
      question: 'How do I track inventory/stock?',
      answer: 'Go to the Stock tab to manage your inventory. Add items with their current quantity and minimum stock level. When you use items during servicing, record the usage to keep counts accurate.',
    },
    {
      question: 'How do I upgrade my subscription?',
      answer: 'Go to the Billing tab to see available plans. Click "Upgrade" on the plan you want. You\'ll be taken to the secure payment portal to complete the upgrade.',
    },
    {
      question: 'How do I export my data?',
      answer: 'On the Overview page, click "Export CSV" to download all your extinguisher data. This includes all fields and can be opened in Excel or Google Sheets for further analysis.',
    },
    {
      question: 'What extinguisher types are supported?',
      answer: 'The system supports: CO2, Water, Foam, Dry Powder, Dry Powder D Class, Wet Chemical, Fire Blanket, Aqua Spray, Lithium, Zenova, Lith Ex, and P50 variants (Foam, Powder, Water Mist, Eco, F Class).',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Help & Documentation</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Learn how to use FireXCheck to manage your fire extinguisher inspections and maintenance.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveSection('getting-started')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === 'getting-started'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Getting Started
        </button>
        <button
          onClick={() => setActiveSection('features')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === 'features'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Features
        </button>
        <button
          onClick={() => setActiveSection('faq')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === 'faq'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveSection('support')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === 'support'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Support
        </button>
      </div>

      {/* Getting Started Section */}
      {activeSection === 'getting-started' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-gray-600 mb-6">
              Welcome to FireXCheck! Follow these steps to get started with managing your fire extinguishers.
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Add Your First Extinguisher</h3>
                  <p className="text-gray-600">
                    Click the "Add Extinguisher" button on the Overview page. Enter the building name,
                    specific location, extinguisher type, and size. Add optional details like serial number
                    and manufacture date for complete records.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Generate QR Codes</h3>
                  <p className="text-gray-600">
                    Go to the QR Codes tab and generate codes for your extinguishers. Print these codes
                    and attach them to the physical extinguishers. Anyone can scan the code to verify
                    the extinguisher's status.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Record Inspections</h3>
                  <p className="text-gray-600">
                    Click on an extinguisher to open its details. Update the condition, add inspection notes,
                    and upload photos. Set the next inspection date to receive reminders.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Generate Reports</h3>
                  <p className="text-gray-600">
                    Create professional PDF service reports with the "Generate Report" button. Reports
                    include all extinguisher details, inspection history, and photos - perfect for client
                    documentation.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Enable Notifications</h3>
                  <p className="text-gray-600">
                    Go to Settings and enable push notifications. You'll receive alerts for upcoming
                    inspections, status changes, and maintenance reminders so you never miss a service date.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <Search className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Use the search and filter options to quickly find specific extinguishers</span>
              </li>
              <li className="flex items-start gap-2">
                <Upload className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Import existing data from CSV files to save time on initial setup</span>
              </li>
              <li className="flex items-start gap-2">
                <Camera className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Take photos during inspections to document condition and issues</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Set next service dates to stay on top of maintenance schedules</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Features Section */}
      {activeSection === 'features' && (
        <div className="grid md:grid-cols-2 gap-6">
          {featureSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Section */}
      {activeSection === 'faq' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find answers to common questions about using FireXCheck.
            </p>
          </div>

          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Support Section */}
      {activeSection === 'support' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-6">
              Need help? Our support team is here to assist you.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    For general inquiries and technical support
                  </p>
                  <a
                    href="mailto:support@firexcheck.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    support@firexcheck.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Security Issues</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Report security vulnerabilities privately
                  </p>
                  <a
                    href="mailto:security@firexcheck.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    security@firexcheck.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Book className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Browse our full documentation online
                  </p>
                  <a
                    href="https://firexcheck.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    firexcheck.com/docs
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Account Issues</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    For billing and account-related questions
                  </p>
                  <a
                    href="mailto:accounts@firexcheck.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    accounts@firexcheck.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Expected Response Times</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center justify-between">
                <span>General Support</span>
                <span className="text-gray-500">Within 24 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Technical Issues</span>
                <span className="text-gray-500">Within 12 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Security Reports</span>
                <span className="text-gray-500">Within 4 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Billing Questions</span>
                <span className="text-gray-500">Within 48 hours</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
