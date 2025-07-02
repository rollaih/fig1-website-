'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF5F5'}}>
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <Link href="/">
              <Image
                src="/Fig1_Finallogo.png"
                alt="Fig1 Logo"
                width={120}
                height={40}
                className="h-12 w-auto mx-auto cursor-pointer"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-light" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              This password reset link is invalid or has expired.
            </p>
            <div className="mt-6">
              <Link 
                href="/admin/forgot-password"
                className="text-[#D959B3] hover:text-[#B8479E] text-sm font-medium"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">{message}</p>
            <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
              placeholder="Enter new password"
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
              placeholder="Confirm new password"
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#D959B3'}}
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
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