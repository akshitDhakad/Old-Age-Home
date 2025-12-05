/**
 * Landing / Marketing Page
 * Modern redesigned homepage with professional UI/UX
 */

import { Link } from 'react-router-dom';
import { Button } from '../components';
import { useState, useEffect } from 'react';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Fixed Navigation with Glassy Effect */}
      <header
        className={`fixed top-0 left-0 right-0 md:top-4 md:left-4 md:right-4 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b md:border md:border-white/20'
            : 'bg-white/70 backdrop-blur-lg border-b md:border md:border-white/30'
        } md:rounded-2xl`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-300 transition-all duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
              <span className="text-lg font-bold text-gray-900 font-display">
                Home-First Care
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="#services"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Reviews
              </a>
              <a
                href="#trust"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Trust & Safety
              </a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-primary-600 hover:bg-primary-50/50"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-primary-50/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="py-4 space-y-2 border-t border-gray-200/50 mt-2">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Reviews
              </a>
              <a
                href="#trust"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50/50"
              >
                Trust & Safety
              </a>
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-700 hover:text-primary-600 hover:bg-primary-50/50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md shadow-primary-200"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 overflow-hidden">
        {/* Background with Enhanced Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />

        {/* Clean Repeated Pattern - Minimal Dots Grid */}
        <div
          className="absolute inset-0 opacity-[0.15] -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='2' fill='%23059669'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Clean Repeated Pattern - Diagonal Lines */}
        <div
          className="absolute inset-0 opacity-[0.08] -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%23059669' stroke-width='1' stroke-linecap='square'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Clean Repeated Pattern - Small Squares */}
        <div
          className="absolute inset-0 opacity-[0.1] -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='20' y='20' width='10' height='10' fill='none' stroke='%23059669' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        {/* Moving Doodle 1 - Top Right (Floating) */}
        <div className="absolute top-20 right-10 lg:right-20 w-24 h-24 lg:w-32 lg:h-32 -z-10 animate-float">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary-300/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M20,50 Q30,20 50,30 T80,50 Q70,80 50,70 T20,50"
              className="animate-pulse-slow"
            />
            <circle cx="35" cy="45" r="3" fill="currentColor" />
            <circle cx="65" cy="55" r="3" fill="currentColor" />
            <path d="M40,60 Q50,65 60,60" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Moving Doodle 2 - Bottom Left (Sliding) */}
        <div className="absolute bottom-20 left-10 lg:left-20 w-20 h-20 lg:w-28 lg:h-28 -z-10 animate-slide">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-accent-300/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M30,30 Q50,10 70,30 Q50,50 30,70 Q10,50 30,30" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <path d="M20,50 L80,50" strokeWidth="1.5" />
            <path d="M50,20 L50,80" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Moving Doodle 3 - Top Left (Rotating) */}
        <div className="absolute top-40 left-10 lg:left-20 w-16 h-16 lg:w-24 lg:h-24 -z-10 animate-rotate">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary-400/25"
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

        {/* Moving Doodle 4 - Center Right (Bouncing) */}
        <div className="absolute top-1/2 right-32 lg:right-40 w-18 h-18 lg:w-24 lg:h-24 -z-10 animate-bounce-slow">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-accent-400/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M50,20 L30,60 L50,50 L70,60 Z" />
            <circle cx="50" cy="35" r="3" fill="currentColor" />
            <path d="M40,45 Q50,50 60,45" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Plan/Rounded Line Doodle - Bottom Right */}
        <div className="absolute bottom-32 right-32 lg:right-48 w-32 h-32 lg:w-40 lg:h-40 -z-10 animate-move">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary-300/35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Rounded line plan/diagram */}
            <path
              d="M20,20 Q30,10 40,20 T60,20 T80,20"
              className="animate-pulse-slow"
            />
            <path
              d="M20,40 Q30,30 40,40 T60,40 T80,40"
              className="animate-pulse-slow"
              style={{ animationDelay: '0.5s' }}
            />
            <path
              d="M20,60 Q30,50 40,60 T60,60 T80,60"
              className="animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <path
              d="M20,80 Q30,70 40,80 T60,80 T80,80"
              className="animate-pulse-slow"
              style={{ animationDelay: '1.5s' }}
            />
            {/* Connecting vertical rounded lines */}
            <path d="M20,20 Q15,30 20,40" strokeWidth="1.5" />
            <path d="M40,20 Q35,30 40,40" strokeWidth="1.5" />
            <path d="M60,20 Q55,30 60,40" strokeWidth="1.5" />
            <path d="M80,20 Q75,30 80,40" strokeWidth="1.5" />
            {/* Dots at intersections */}
            <circle cx="20" cy="20" r="2" fill="currentColor" />
            <circle cx="40" cy="20" r="2" fill="currentColor" />
            <circle cx="60" cy="20" r="2" fill="currentColor" />
            <circle cx="80" cy="20" r="2" fill="currentColor" />
            <circle cx="20" cy="40" r="2" fill="currentColor" />
            <circle cx="40" cy="40" r="2" fill="currentColor" />
            <circle cx="60" cy="40" r="2" fill="currentColor" />
            <circle cx="80" cy="40" r="2" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content - 6 columns */}
            <div className="lg:col-span-6 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-primary-100">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span className="text-xs font-semibold text-primary-700">
                  Trusted by 10,000+ Families
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Professional <span className="text-gradient">Elderly Care</span>{' '}
                at Your Home
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Connect with verified caregivers, access telehealth services,
                and rent medical equipment—all from the comfort of your home.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/register">
                  <Button
                    size="md"
                    className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all duration-300"
                  >
                    Find Caregivers
                    <svg
                      className="w-4 h-4 ml-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link to="/caregiver/onboarding">
                  <Button
                    size="md"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Become a Caregiver
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">
                    Verified
                  </p>
                  <p className="text-xs text-gray-600">Caregivers</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Secure</p>
                  <p className="text-xs text-gray-600">Platform</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">24/7</p>
                  <p className="text-xs text-gray-600">Support</p>
                </div>
              </div>
            </div>

            {/* Right - Images Grid - 6 columns */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Large Image - Top Left */}
                <div className="col-span-2 relative group overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=500&fit=crop"
                    alt="Caregiver helping elderly woman with daily activities"
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-semibold">Professional Care</p>
                    <p className="text-xs opacity-90">At Your Home</p>
                  </div>
                </div>

                {/* Small Image - Bottom Left */}
                <div className="relative group overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
                    alt="Certified caregiver with elderly patient"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-semibold">Certified Experts</p>
                  </div>
                </div>

                {/* Small Image - Bottom Right */}
                <div className="relative group overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=400&fit=crop"
                    alt="Medical equipment and home care services"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-semibold">24/7 Available</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Badge */}
              <div className="mt-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">2K+</p>
                    <p className="text-xs text-gray-600">Caregivers</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div>
                    <p className="text-2xl font-bold text-primary-600">10K+</p>
                    <p className="text-xs text-gray-600">Families</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div>
                    <p className="text-2xl font-bold text-primary-600">4.9</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="relative py-20 lg:py-24 px-6 bg-white overflow-hidden"
      >
        {/* Decorative Doodle */}
        <div className="absolute bottom-10 left-10 w-20 h-20 lg:w-28 lg:h-28 opacity-20 animate-float">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary-400"
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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything your loved ones need for quality home-based elderly
              care
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Verified Caregivers
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Background-checked professionals for nursing, physiotherapy, and
                daily living assistance
              </p>
            </div>

            {/* Service 2 */}
            <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Telehealth Services
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Virtual consultations with doctors and specialists available
                24/7
              </p>
            </div>

            {/* Service 3 */}
            <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Medical Equipment
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rent wheelchairs, oxygen concentrators, and hospital beds
              </p>
            </div>

            {/* Service 4 */}
            <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Flexible Plans
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hourly rates or subscription plans tailored to your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Banner Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop"
                alt="Home healthcare professional"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold mb-1">Expert Care</p>
                <p className="text-sm opacity-90">
                  Licensed professionals with years of experience
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                alt="Medical equipment at home"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold mb-1">Quality Equipment</p>
                <p className="text-sm opacity-90">
                  Medical-grade devices delivered to your home
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop"
                alt="Telehealth consultation"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold mb-1">Virtual Care</p>
                <p className="text-sm opacity-90">
                  Connect with doctors from anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative py-20 lg:py-24 px-6 bg-white overflow-hidden"
      >
        {/* Decorative Doodle */}
        <div className="absolute top-20 right-10 lg:right-20 w-16 h-16 lg:w-24 lg:h-24 opacity-15 animate-float">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-accent-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20,80 Q40,20 80,80" className="animate-pulse-slow" />
            <circle cx="30" cy="60" r="3" fill="currentColor" />
            <circle cx="70" cy="60" r="3" fill="currentColor" />
            <path d="M45,50 Q50,40 55,50" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with quality home care in just three simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 opacity-20" />

            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-300">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Search & Select
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Browse verified caregivers in your area and find the perfect
                    match
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-300">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Book & Schedule
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Choose your time slot and book instantly with flexible
                    scheduling
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-300">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Receive Care
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Professional caregiver arrives on time with compassionate
                    care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section with Images */}
      <section
        id="trust"
        className="py-20 lg:py-24 px-6 bg-gradient-to-br from-gray-50 to-primary-50/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1.5 bg-white text-primary-700 rounded-full font-semibold text-xs shadow-sm border border-primary-100">
                  Trust & Safety
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Your Safety Is Our Priority
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                We ensure every caregiver meets rigorous standards of excellence
                and trustworthiness
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Background Verification
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Comprehensive checks including criminal records and
                      references
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Professional Credentials
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Verified qualifications and ongoing training
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Reviewed by Families
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Real reviews and ratings from families
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative group overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop"
                    alt="Nurse checking patient vitals"
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative group overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop"
                    alt="Healthcare certification"
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative group overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop"
                    alt="Caregiver with elderly patient"
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative group overflow-hidden rounded-xl bg-primary-600 p-6 text-white">
                  <div className="text-center">
                    <p className="text-4xl font-bold mb-1">98%</p>
                    <p className="text-sm opacity-90">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 lg:py-24 px-6 bg-white relative overflow-hidden"
      >
        {/* Decorative Doodle */}
        <div className="absolute bottom-10 right-10 lg:right-20 w-20 h-20 lg:w-28 lg:h-28 opacity-15 animate-float">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M30,30 Q50,10 70,30 Q50,50 30,70 Q10,50 30,30" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs">
                Flexible Pricing
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Select the plan that works best for you.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* One-Time Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">One-Time</h3>
                <p className="text-sm text-gray-600">Pay as you go</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-bold text-gray-900 mt-1">$</span>
                  <span className="text-5xl font-bold text-gray-900">25</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">per hour</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">No commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Verified caregivers</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Basic support</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Flexible scheduling</span>
                </li>
              </ul>

              <Button fullWidth variant="outline" className="border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50">
                Get Started
              </Button>
            </div>

            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly</h3>
                <p className="text-sm text-gray-600">Best for regular care</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-bold text-primary-600 mt-1">$</span>
                  <span className="text-5xl font-bold text-primary-600">399</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">per month</p>
                <p className="text-xs text-primary-600 font-semibold mt-1">Save 20%</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">20 hours included</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Priority booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">24/7 support</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Dedicated coordinator</span>
                </li>
              </ul>

              <Button fullWidth className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                Get Started
              </Button>
            </div>

            {/* 6-Month Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">6 Months</h3>
                <p className="text-sm text-gray-600">Better savings</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-bold text-gray-900 mt-1">$</span>
                  <span className="text-5xl font-bold text-gray-900">339</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">per month</p>
                <p className="text-xs text-accent-600 font-semibold mt-1">Save 30%</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">25 hours/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">All Monthly features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Free equipment rental</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Monthly health reports</span>
                </li>
              </ul>

              <Button fullWidth variant="outline" className="border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50">
                Get Started
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl p-8 border-2 border-accent-500 hover:shadow-xl transition-all duration-300 text-white relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-secondary-400 text-accent-900 text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Yearly</h3>
                <p className="text-sm text-accent-100">Maximum savings</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-bold mt-1">$</span>
                  <span className="text-5xl font-bold">279</span>
                </div>
                <p className="text-sm text-accent-100 mt-2">per month</p>
                <p className="text-xs text-secondary-300 font-semibold mt-1">Save 45%</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-secondary-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-accent-50">30 hours/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-secondary-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-accent-50">All 6-month features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-secondary-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-accent-50">Free telehealth</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-secondary-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-accent-50">Premium support</span>
                </li>
              </ul>

              <Button fullWidth className="bg-white text-accent-700 hover:bg-accent-50 font-semibold">
                Get Started
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              All plans include verified caregivers, secure platform, and flexible scheduling.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Need a custom plan?{' '}
              <a href="#" className="text-primary-600 font-semibold hover:underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 lg:py-24 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-1">
                10K+
              </p>
              <p className="text-sm text-primary-100">Families Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-1">
                2K+
              </p>
              <p className="text-sm text-primary-100">Caregivers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-1">
                50K+
              </p>
              <p className="text-sm text-primary-100">Care Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-1">
                4.9
              </p>
              <p className="text-sm text-primary-100">Average Rating</p>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              What Families Say
            </h2>
            <p className="text-lg text-primary-100">
              Real stories from real families
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-secondary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-white text-base mb-6 leading-relaxed">
                "The caregiver we found has been a blessing for our mother.
                Professional, caring, and always on time."
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-primary-800 font-bold">
                  RS
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Rajesh Sharma
                  </p>
                  <p className="text-xs text-primary-100">Mumbai</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-secondary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-white text-base mb-6 leading-relaxed">
                "Easy booking, transparent pricing, and excellent caregivers. So
                simple to find help for my father."
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-primary-800 font-bold">
                  PM
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Priya Mehta
                  </p>
                  <p className="text-xs text-primary-100">Bangalore</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-secondary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-white text-base mb-6 leading-relaxed">
                "The medical equipment rental is fantastic. Got a hospital bed
                delivered same day!"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-primary-800 font-bold">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Anil Kumar</p>
                  <p className="text-xs text-primary-100">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of families who trust Home-First Care for their
            elderly care needs
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/register">
              <Button
                size="md"
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all duration-300"
              >
                Find Caregivers Now
                <svg
                  className="w-4 h-4 ml-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Link to="/caregiver/onboarding">
              <Button
                size="md"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300"
              >
                Join as Caregiver
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-10 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4 font-medium">
              Trusted and secured by
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="px-5 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                ISO Certified
              </div>
              <div className="px-5 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                HIPAA Compliant
              </div>
              <div className="px-5 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                Verified Secure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/50">
                  <svg
                    className="w-5 h-5 text-white"
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
                <span className="text-lg font-bold">Home-First Care</span>
              </Link>
              <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
                Providing compassionate, professional home-based elderly care
                services. Quality care when you need it most.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* For Families */}
            <div>
              <h3 className="font-bold mb-4 text-base">For Families</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/caregivers"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Find Caregivers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Subscription Plans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/devices"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Medical Devices
                  </Link>
                </li>
                <li>
                  <Link
                    to="/telehealth"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Telehealth
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold mb-4 text-base">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/caregiver/onboarding"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Become a Caregiver
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-400">
                &copy; 2024 Home-First Care. All rights reserved.
              </p>
              <div className="flex gap-6 text-xs text-gray-400">
                <Link
                  to="/privacy"
                  className="hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookie-policy"
                  className="hover:text-primary-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
