import React from 'react';

interface FooterProps {
  primaryColor?: string;
}

const Footer: React.FC<FooterProps> = ({ primaryColor = '#7c3aed' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Fireexcheck</h3>
            <p className="text-sm text-gray-600">
              Professional fire extinguisher management system. Keep your premises safe and compliant.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  style={{
                    color: undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@firexcheck.com"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://firexcheck.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="mailto:security@firexcheck.com"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Report Security Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://firexcheck.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://firexcheck.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-600">
                  Status: <span className="text-green-600">All Systems Operational</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 mt-8 border-t border-gray-200">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} Fireexcheck. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>PCI-DSS Level 1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
