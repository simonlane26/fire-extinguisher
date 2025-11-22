import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../lib/api';
import { Flame, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    try {
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage(response.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification failed. The token may be invalid or expired.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    setResending(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail(email);
      setResendSuccess(true);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Flame className="text-violet-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
          <p className="text-sm text-violet-600 font-medium">Fireexcheck.com</p>
        </div>

        {status === 'verifying' && (
          <div className="text-center py-8">
            <Loader2 className="animate-spin text-violet-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500 mb-6">Redirecting to login...</p>
            <Link
              to="/login"
              className="inline-block bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <XCircle className="text-red-600 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Need a new verification link?</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
                <button
                  onClick={handleResendVerification}
                  disabled={resending || !email}
                  className="w-full bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                {resendSuccess && (
                  <p className="text-sm text-green-600">
                    Verification email sent! Please check your inbox.
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/login"
              className="inline-block text-violet-600 hover:text-violet-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
