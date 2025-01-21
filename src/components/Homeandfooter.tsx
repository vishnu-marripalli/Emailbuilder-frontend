import React from 'react';
import { Mail, PenTool, Download, Share2, ArrowRight, Github } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
      <Icon size={24} className="text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const HeroSection = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Create Beautiful Email Templates
          <span className="text-blue-600"> Without Code</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Design professional email templates with our intuitive drag-and-drop builder. 
          Perfect for marketing campaigns, newsletters, and announcements.
        </p>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
         Due to my time constraints, I have made this project in a very short time.
         Due which I have not been able to add all the features.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            Start Building
            <ArrowRight size={20} />
          </button>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-200">
            View Templates
          </button>
        </div> */}
      </div>
    </div>
    {/* <div className="mt-16 flex justify-center px-4">
      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 bg-gradient-to-t from-white opacity-25"></div>
        <img 
          src="/api/placeholder/1200/600" 
          alt="Email Builder Interface" 
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div> */}
  </div>
);

export const FeaturesSection = () => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Everything You Need to Create Amazing Emails
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our email builder comes packed with features to help you create 
          professional email templates quickly and easily.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={PenTool}
          title="Drag & Drop Editor"
          description="Intuitive drag and drop interface makes it easy to design emails exactly how you want them."
        />
        <FeatureCard 
          icon={Download}
          title="Export Options"
          description="Export your templates as PDF or send directly to your Gmail account with one click."
        />
        <FeatureCard 
          icon={Share2}
          title="Easy Sharing"
          description="Share your templates with team members and collaborate on designs together."
        />
      </div>
    </div>
  </div>
);

export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={24} className="text-blue-400" />
            <span className="text-xl font-bold">EmailBuilder</span>
          </div>
          <p className="text-gray-400 mb-4">
            Create beautiful email templates without any coding knowledge. 
            Perfect for marketers, designers, and businesses.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        {/* <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div> */}
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} EmailBuilder. All rights reserved. Vishnuvardhan Marripalli</p>
      </div>
    </div>
  </footer>
);

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <HeroSection />
//       <FeaturesSection />
//       <Footer />
//     </div>
//   );
// };

