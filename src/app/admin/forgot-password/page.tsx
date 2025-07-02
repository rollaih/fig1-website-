'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail(''); // Clear form
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF5F5'}}>
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/Fig1_Finallogo.png"
                alt="Fig1 Logo"
                width={120}
                height={40}
                className="h-12 w-auto mx-auto cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-light" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#D959B3'}}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/admin/login"
              className="text-[#D959B3] hover:text-[#B8479E] text-sm font-medium"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}