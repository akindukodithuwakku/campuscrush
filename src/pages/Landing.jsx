import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = [
        "hero",
        "about",
        "features",
        "why",
        "privacy",
        "register",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "why", label: "Why Join?" },
    { id: "privacy", label: "Privacy" },
    { id: "register", label: "Get Started" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold gradient-text">
                Campus Crush
              </span>
            </div>

                        <div className="hidden md:flex space-x-8">
              {navItems.slice(0, -1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-all duration-300 hover:text-primary-600 ${
                    activeSection === item.id 
                      ? "text-primary-600 scale-110" 
                      : "text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/login"
                className="font-medium transition-all duration-300 hover:text-primary-600 text-gray-700"
              >
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button className="btn-primary text-sm py-2 px-4">Menu</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Campus Crush</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate university chat app that connects students through
              meaningful conversations, shared interests, and authentic
              relationships. Find your perfect study partner, make lifelong
              friends, or discover something more.
            </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="btn-primary text-lg px-8 py-4"
              >
                Start Your Journey
              </Link>
              <button 
                onClick={() => scrollToSection("features")}
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="relative mt-16">
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-primary-200 rounded-full opacity-60 animate-bounce-gentle"></div>
            <div
              className="absolute top-8 right-1/4 w-16 h-16 bg-secondary-200 rounded-full opacity-60 animate-bounce-gentle"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-16 left-1/3 w-12 h-12 bg-accent-200 rounded-full opacity-60 animate-bounce-gentle"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="section-card text-center">
            <h2 className="text-4xl font-bold gradient-text mb-6">
              About Campus Crush
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Campus Crush is more than just a dating app – it's a comprehensive
              platform designed specifically for university students. We
              understand the unique challenges and opportunities of campus life,
              and we've created a safe, engaging environment where students can
              connect based on shared academic interests, career goals, and
              personal passions.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Academic Focus
                </h3>
                <p className="text-gray-600">
                  Connect with students from your faculty, degree program, or
                  academic year
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-romantic-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Privacy First
                </h3>
                <p className="text-gray-600">
                  Your data is encrypted and protected with enterprise-grade
                  security
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Real Connections
                </h3>
                <p className="text-gray-600">
                  Build meaningful relationships through our intelligent
                  matching system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Amazing Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for meaningful campus connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔥",
                title: "Smart Matching",
                description:
                  "AI-powered algorithm matches you with compatible students based on interests, degree, and goals",
              },
              {
                icon: "💬",
                title: "Real-time Chat",
                description:
                  "Firebase-powered instant messaging with end-to-end encryption for secure conversations",
              },
              {
                icon: "📱",
                title: "Mobile First",
                description:
                  "Responsive design that works perfectly on all devices - from phones to tablets",
              },
              {
                icon: "🎯",
                title: "Interest Groups",
                description:
                  "Join clubs, societies, and interest groups to meet like-minded students",
              },
              {
                icon: "🔐",
                title: "University Verification",
                description:
                  "Secure login with your university email ensures authentic student community",
              },
              {
                icon: "📊",
                title: "Privacy Controls",
                description:
                  "Full control over your profile visibility and data sharing preferences",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="section-card text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="section-card">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold gradient-text mb-6">
                  Why Choose Campus Crush?
                </h2>
                <div className="space-y-4">
                  {[
                    "Connect with students who share your academic interests and career goals",
                    "Safe, verified community of university students only",
                    "Advanced privacy controls and data encryption",
                    "Real-time chat with message history and media sharing",
                    "Mobile-optimized experience for on-the-go connections",
                    "Free to use with premium features available",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollToSection("register")}
                  className="btn-primary mt-8"
                >
                  Join Now - It's Free!
                </button>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎓💕</div>
                    <p className="text-xl font-semibold text-gray-700">
                      Your Campus Journey Starts Here
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-200 rounded-full opacity-60 animate-bounce-gentle"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-romantic-200 rounded-full opacity-60 animate-bounce-gentle"
                  style={{ animationDelay: "0.7s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="section-card text-center">
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Your Privacy Matters
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              We take your privacy and data security seriously. Campus Crush is
              built with enterprise-grade security measures to protect your
              personal information.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  End-to-End Encryption
                </h3>
                <p className="text-gray-600">
                  All messages are encrypted and secure
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Data Protection
                </h3>
                <p className="text-gray-600">
                  GDPR compliant with strict data handling policies
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Privacy Controls
                </h3>
                <p className="text-gray-600">
                  Full control over your profile and data visibility
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-gray-600">
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </a>{" "}
                •
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 underline ml-2"
                >
                  Cookie Policy
                </a>{" "}
                •
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 underline ml-2"
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="section-card text-center">
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of university students who are already connecting
              on Campus Crush. It only takes a few minutes to create your
              profile and start meeting amazing people.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  For Students
                </h3>
                <p className="text-gray-600 mb-4">
                  Connect with peers, find study partners, and build meaningful
                  relationships
                </p>
                <Link to="/signup" className="btn-primary">Sign Up Free</Link>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-romantic-50 rounded-xl">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  For Universities
                </h3>
                <p className="text-gray-600 mb-4">
                  Partner with us to enhance student engagement and campus life
                </p>
                <button className="btn-secondary">Contact Us</button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                How It Works
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className="text-gray-600">
                    Sign up with your university email
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className="text-gray-600">Complete your profile</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className="text-gray-600">Discover matches</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-romantic-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <p className="text-gray-600">Start chatting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">Campus Crush</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting university students through meaningful conversations
                and shared interests.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Campus Crush. Built for educational purposes. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
