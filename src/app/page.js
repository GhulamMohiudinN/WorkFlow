'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiUsers, 
  FiLayers, 
  FiTrendingUp, 
  FiZap, 
  FiShield, 
  FiGlobe,
  FiBriefcase,
  FiBarChart2,
  FiPlayCircle,
  FiChevronRight,
  FiStar,
  FiMessageSquare,
  FiCpu
} from 'react-icons/fi';

import homeOne from '@/assists/homeOne.png';
import homeTwo from '@/assists/homeTwo.png';
import homeThree from '@/assists/homeThree.png';
import homeFour from '@/assists/homeFour.png';
import homeFive from '@/assists/homeFive.png';
import homeSix from '@/assists/homeSix.png';  
import homeSeven from '@/assists/homeSeven.png';
import homeEight from '@/assists/homeEight.png';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <FiLayers className="h-6 w-6" />,
      title: "Visual Workflow Builder",
      description: "Drag-and-drop interface to create processes step by step"
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Team Management",
      description: "Add team members, assign roles, manage permissions"
    },
    {
      icon: <FiZap className="h-6 w-6" />,
      title: "AI-Powered Automation",
      description: "Smart suggestions to optimize and automate workflows"
    },
    {
      icon: <FiTrendingUp className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Monitor performance, bottlenecks, and productivity"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "MongoDB encryption, company data isolation"
    },
    {
      icon: <FiCpu className="h-6 w-6" />,
      title: "Flexible Integrations",
      description: "Connect with Slack, Teams, Jira, and more"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Director, TechFlow Inc",
      content: "WorkflowPro reduced our process setup time by 70%. The AI suggestions are game-changing.",
      company: "Tech Company"
    },
    {
      name: "Marcus Rodriguez",
      role: "HR Manager, GrowthCorp",
      content: "From onboarding to approvals, everything runs smoothly. Team collaboration has never been easier.",
      company: "Enterprise"
    },
    {
      name: "Priya Sharma",
      role: "CEO, StartupScale",
      content: "The perfect balance of simplicity and power. Our small team manages like an enterprise.",
      company: "Startup"
    }
  ];

  const handleGetStarted = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-amber-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">WorkflowPro</span>
                <span className="text-xs text-amber-600 font-medium ml-2 bg-amber-100 px-2 py-0.5 rounded">BETA</span>
              </div>
            </div>
            {/* <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-amber-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-amber-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-amber-600 transition-colors">Testimonials</a>
              <Link href="/login" className="text-gray-700 hover:text-amber-600 transition-colors">Sign In</Link>
            </div> */}
            <button
              onClick={handleGetStarted}
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <FiStar className="h-4 w-4 mr-2" />
                Trusted by 500+ companies worldwide
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Streamline Your Business 
                <span className="text-amber-600"> Workflows</span> 
                with AI-Powered Precision
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create, automate, and optimize your company`s processes in one secure platform. 
                From team onboarding to complex approval systems—everything managed in your private workspace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="group flex items-center justify-center bg-linear-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
                >
                  Start Free Trial
                  <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all duration-200">
                  <FiPlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>No credit card required • 14-day free trial • Cancel anytime</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={homeOne} 
                  alt="Team collaborating on workflows"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-amber-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FiBarChart2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">+45% Efficiency</p>
                    <p className="text-xs text-gray-500">Average improvement</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-amber-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FiUsers className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">500+ Teams</p>
                    <p className="text-xs text-gray-500">Globally</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <div className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-8">Trusted by innovative companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {['TechCorp', 'GrowthLab', 'InnovateCo', 'ScaleUp', 'FutureSys', 'ProFlow'].map((company) => (
              <div key={company} className="text-center">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Process Excellence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From small teams to large enterprises, WorkflowPro provides the tools to manage your entire operation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <div className="text-amber-600 group-hover:text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src={homeTwo}
                alt="Workflow visualization"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visualize, Build, Execute</h3>
              <p className="text-gray-600 mb-6">
                Create complex workflows with our intuitive drag-and-drop builder. Map out every step, assign tasks, and set conditions—all without writing a single line of code.
              </p>
              <ul className="space-y-4">
                {['Step-by-step process mapping', 'Role-based task assignments', 'Conditional logic and approvals', 'Real-time progress tracking'].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Setup, Powerful Results</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get your company running on WorkflowPro in just a few minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { number: '01', title: 'Create Account', desc: 'Sign up with your company email', icon: <FiBriefcase /> },
              { number: '02', title: 'Setup Workspace', desc: 'Configure your company details', icon: <FiLayers /> },
              { number: '03', title: 'Add Your Team', desc: 'Invite members, assign roles', icon: <FiUsers /> },
              { number: '04', title: 'Build Workflows', desc: 'Start creating processes', icon: <FiZap /> }
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-white text-2xl font-bold">{step.number}</div>
                  </div>
                  <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-amber-300 hidden md:block"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI That Works With You</h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes your workflows and suggests optimizations, automations, and improvements. It learns from your team`s patterns to make your processes more efficient over time.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiZap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Automation</h4>
                    <p className="text-sm text-gray-600">Identify repetitive tasks to automate</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiTrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Performance Insights</h4>
                    <p className="text-sm text-gray-600">Spot bottlenecks and improvement areas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Image 
                src={homeFive}
                alt="AI assistant helping with workflows"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Teams Worldwide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how companies of all sizes transform their operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiMessageSquare className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 text-amber-500 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Image 
                  src={homeThree}
                  alt="Team collaboration"
                  className="rounded-xl"
                />
                <Image 
                  src={homeFour}
                  alt="Remote collaboration"
                  className="rounded-xl mt-8"
                />
                <Image 
                  src={homeSix}
                  alt="Analytics dashboard"
                  className="rounded-xl"
                />
                <Image 
                  src={homeSeven}
                  alt="Team workflow"
                  className="rounded-xl mt-8"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Built for Modern Teams</h3>
              <p className="text-gray-600 mb-6">
                Whether your team is in the office, remote, or hybrid, WorkflowPro keeps everyone connected. Real-time updates, collaborative editing, and seamless communication built right in.
              </p>
              <ul className="space-y-4 mb-8">
                {['Real-time collaboration', 'Remote-friendly interface', 'Mobile-responsive design', 'Offline capability'].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                Start your free trial
                <FiChevronRight className="ml-1 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Workflows?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust WorkflowPro to manage their critical processes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              onClick={handleGetStarted}
              className="flex-1 bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg"
            >
              Start Free Trial
            </button>
            <Link
              href="/login"
              className="flex-1 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
            >
              Schedule Demo
            </Link>
          </div>
          
          <p className="text-amber-100/80 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <FiBriefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">WorkflowPro</span>
              </div>
              <p className="text-sm">
                Enterprise workflow management platform powered by AI and MongoDB.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} WorkflowPro. All rights reserved.</p>
            <p className="mt-2">Built with MongoDB • Enterprise-ready • SOC 2 Type II Certified</p>
          </div>
        </div>
      </footer>
    </div>
  );
}