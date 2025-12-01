import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Flame, AlertCircle, X } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-violet-600 to-purple-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-violet-100">
            <Flame className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Fire Extinguisher Manager</h1>
          <p className="mt-2 text-gray-600">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
          <p className="mt-1 text-sm font-medium text-violet-600">Firexcheck.com</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="John Doe"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {!isRegister && (
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
              required
            />
            {isRegister && (
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 border-l-4 border-red-500 rounded-lg shadow-sm bg-red-50 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Authentication Failed</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="flex-shrink-0 text-red-400 transition-colors hover:text-red-600"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              'Please wait...'
            ) : isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className="font-medium text-violet-600 hover:text-violet-700"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to Fire Extinguisher Manager?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-violet-600 hover:text-violet-700"
                >
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>

        {!isRegister && (
          <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
            <p className="mb-2 text-sm font-medium text-blue-800">Demo Credentials:</p>
            <p className="text-xs text-blue-700">
              Use the register form to create a new account, or contact your administrator for login credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
