/**
 * Register Page
 * Modern registration page with background image and glassy form
 */

import { RegisterForm } from '../features/auth/RegisterForm';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-800/50 to-accent-900/60 backdrop-blur-sm" />
      </div>

      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 w-20 h-20 lg:w-28 lg:h-28 opacity-20 animate-float z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="50" cy="50" r="30" />
          <path
            d="M50,20 L50,50 L70,70"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute bottom-10 right-10 w-24 h-24 lg:w-32 lg:h-32 opacity-15 animate-slide z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M50,10 Q70,30 50,50 Q30,70 50,90"
            className="animate-pulse-slow"
          />
          <circle cx="50" cy="30" r="4" fill="currentColor" />
          <circle cx="50" cy="70" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-16 w-20 h-20 lg:w-28 lg:h-28 opacity-15 animate-bounce-slow z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M50,20 L30,60 L50,50 L70,60 Z" />
          <circle cx="50" cy="35" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full grid lg:grid-cols-2">
        {/* Left Side - Auth Form with Glassy Effect */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            {/* Glassy Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 lg:p-10">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Home-First Care
                </span>
              </Link>

              {/* Form */}
              <RegisterForm />
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="hidden lg:flex items-center justify-center p-12 text-white">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Start Your Journey with Professional Care
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Join thousands of families and caregivers who trust Home-First
              Care for compassionate, professional elderly care services.
            </p>

            {/* Benefits */}
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Free Registration</h3>
                  <p className="text-sm text-white/80">
                    Create your account at no cost and explore our services
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Setup</h3>
                  <p className="text-sm text-white/80">
                    Get started in minutes with our simple onboarding process
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Platform</h3>
                  <p className="text-sm text-white/80">
                    Your data is protected with industry-standard encryption
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm text-white/80">
                    Our team is here to help you anytime you need assistance
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-white/80">Happy Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold">2K+</p>
                <p className="text-sm text-white/80">Caregivers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm text-white/80">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
