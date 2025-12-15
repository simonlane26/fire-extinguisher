import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  QrCode,
  Calendar,
  Camera,
  FileText,
  Users,
  Building2,
  Shield,
  Clock,
  BarChart3,
  Smartphone,
  Cloud,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: QrCode,
      title: 'Digital Extinguisher Register',
      description: 'QR code-based tracking for instant access to extinguisher records and history.',
    },
    {
      icon: Calendar,
      title: 'Inspection Scheduling',
      description: 'Never miss a service date with automated reminders and scheduling.',
    },
    {
      icon: Camera,
      title: 'Photo Capture & Defects',
      description: 'Document defects with photos, notes, and priority levels during inspections.',
    },
    {
      icon: FileText,
      title: 'Compliance Reporting',
      description: 'Generate audit-ready reports and export to PDF/CSV for regulatory compliance.',
    },
    {
      icon: Building2,
      title: 'Multi-Site Management',
      description: 'Manage fire safety across multiple locations from one central dashboard.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multiple user access with role-based permissions for your team.',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Stay Compliant',
      description: 'Meet BS 5306 and regulatory requirements with digital audit trails.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Reduce admin work by 70% with automated scheduling and digital records.',
    },
    {
      icon: BarChart3,
      title: 'Better Insights',
      description: 'Track service history, identify trends, and make data-driven decisions.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First',
      description: 'Conduct inspections on-site using smartphones or tablets.',
    },
  ];

  const targetAudiences = [
    {
      title: 'Facilities Managers',
      description: 'Manage compliance across all your buildings with ease.',
    },
    {
      title: 'Fire Safety Contractors',
      description: 'Streamline inspections and provide better service to clients.',
    },
    {
      title: 'Compliance Teams',
      description: 'Maintain audit-ready records and never miss a deadline.',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '£19',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 50 extinguishers',
        '3 users',
        'QR code generation',
        'Email reminders',
        'Basic reports',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '£49',
      period: '/month',
      description: 'For growing organizations',
      features: [
        'Up to 250 extinguishers',
        '10 users',
        'Advanced analytics',
        'Custom branding',
        'PDF/CSV exports',
        'Priority email support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '£99',
      period: '/month',
      description: 'For large enterprises',
      features: [
        'Up to 1,000 extinguishers',
        'Unlimited users',
        'API access',
        'Custom domain',
        'Priority support',
        'Dedicated account manager',
      ],
      cta: 'Book a Demo',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-2">
            <Flame className="text-red-600" size={32} />
            <span className="text-2xl font-bold text-gray-900">FirexCheck</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Start Free Trial
            </button>
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Fire Extinguisher Compliance Made Simple
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Digital fire safety management for facilities managers, contractors, and compliance teams.
                Track inspections, maintain records, and stay audit-ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-lg flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold text-lg"
                >
                  Book a Demo
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                <CheckCircle className="inline text-green-600 mr-2" size={16} />
                No credit card required • 14-day free trial
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 space-y-4">
                  {/* Mock dashboard header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <Flame className="text-white" size={20} />
                      </div>
                      <span className="font-semibold text-gray-700">FirexCheck Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-green-100 rounded"></div>
                      <div className="w-16 h-6 bg-blue-100 rounded"></div>
                    </div>
                  </div>

                  {/* Mock stats cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Total Extinguishers</div>
                      <div className="text-2xl font-bold text-gray-900">247</div>
                      <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Due This Week</div>
                      <div className="text-2xl font-bold text-orange-600">18</div>
                      <div className="text-xs text-gray-500 mt-1">Needs attention</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Compliance</div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-xs text-green-600 mt-1">Excellent</div>
                    </div>
                  </div>

                  {/* Mock table */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Recent Inspections</div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              <QrCode size={16} className="text-red-600" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900">FEP-{String(i).padStart(3, '0')}</div>
                              <div className="text-xs text-gray-500">Building {i}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <span className="text-xs text-gray-600">{i === 2 ? 'Warning' : 'Passed'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Fire Safety Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to simplify fire extinguisher management and keep you compliant.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="text-red-600 mb-4" size={40} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FirexCheck?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by fire safety professionals across the UK.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <benefit.icon className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Fire Safety Professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {targetAudiences.map((audience, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl text-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {audience.title}
                </h3>
                <p className="text-gray-700">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-red-600 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mb-6 ${
                    plan.highlighted ? 'text-red-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={plan.highlighted ? 'text-red-100' : 'text-gray-600'}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle
                        className={
                          plan.highlighted ? 'text-red-200' : 'text-green-600'
                        }
                        size={20}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        className={plan.highlighted ? 'text-red-50' : 'text-gray-700'}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.highlighted
                      ? 'bg-white text-red-600 hover:bg-red-50'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Shield className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  BS 5306 Compliant
                </h3>
                <p className="text-gray-700">
                  Built to meet UK fire safety standards and regulations.
                </p>
              </div>
              <div>
                <Cloud className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-700">
                  Bank-level encryption with automated backups and 99.9% uptime.
                </p>
              </div>
              <div>
                <Users className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Expert Support
                </h3>
                <p className="text-gray-700">
                  Built by fire service professionals, supported by industry experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Fire Safety Compliance?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join hundreds of facilities managers and fire safety professionals using FirexCheck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-red-50 font-semibold text-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-red-700 font-semibold text-lg"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="text-red-600" size={24} />
                <span className="text-xl font-bold text-white">FirexCheck</span>
              </div>
              <p className="text-sm">
                Fire extinguisher management software for compliance-focused businesses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/signup" className="hover:text-white">Sign Up</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="mailto:ignistech999@gmail.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy.html" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms-of-service.html" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} FirexCheck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
