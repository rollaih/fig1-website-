'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store the token in localStorage and redirect
        localStorage.setItem('adminToken', result.token);
        router.push('/admin');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF5F5'}}>
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg p-8" style={{borderRadius: '22px'}}>
          {/* Header */}
          <div className="text-center mb-8">
            <Image
              src="/Fig1_Finallogo.png"
              alt="Fig1 Logo"
              width={120}
              height={40}
              className="h-10 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-light mb-2" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
              Admin Login
            </h1>
            <p className="text-gray-600 text-sm">
              Access the Fig.1 admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                placeholder="admin@fig1.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{backgroundColor: '#D959B3'}}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-2">
            <Link 
              href="/admin/forgot-password"
              className="text-[#D959B3] hover:text-[#B8479E] text-sm font-medium"
            >
              Forgot your password?
            </Link>
            <p className="text-xs text-gray-500">
              Need help? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}