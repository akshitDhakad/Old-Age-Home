/**
 * Login Page
 * Modern auth page with background image and glassy form
 */

import { LoginForm } from '../features/auth/LoginForm';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-800/50 to-accent-900/60 backdrop-blur-sm" />
      </div>

      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 w-20 h-20 lg:w-28 lg:h-28 opacity-20 animate-float z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20,50 Q30,20 50,30 T80,50 Q70,80 50,70 T20,50" className="animate-pulse-slow" />
          <circle cx="35" cy="45" r="3" fill="currentColor" />
          <circle cx="65" cy="55" r="3" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute bottom-10 right-10 w-24 h-24 lg:w-32 lg:h-32 opacity-15 animate-slide z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M30,30 Q50,10 70,30 Q50,50 30,70 Q10,50 30,30" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full grid lg:grid-cols-2">
        {/* Left Side - Auth Form with Glassy Effect */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Glassy Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 lg:p-10">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">Home-First Care</span>
              </Link>

              {/* Form */}
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="hidden lg:flex items-center justify-center p-12 text-white">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome Back to Professional Elderly Care
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Access your dashboard to manage caregivers, schedule appointments, and provide the best care for your loved ones.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Caregivers</h3>
                  <p className="text-sm text-white/80">Access to thoroughly vetted professional caregivers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Scheduling</h3>
                  <p className="text-sm text-white/80">Book and manage appointments with ease</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm text-white/80">Round-the-clock assistance when you need it</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-white/80">Families</p>
              </div>
              <div>
                <p className="text-3xl font-bold">2K+</p>
                <p className="text-sm text-white/80">Caregivers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm text-white/80">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

