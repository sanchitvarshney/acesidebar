import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DomainAdd from './DomainAdd';
import BrandSetup from './BrandSetup';
import SMTPConfig from './SMTPConfig';
import WhatsappConfig from './WhatsappConfig';
import RecaptchaConfig from './RecaptchaConfig';
import Completion from './Completion';

// Import wizard icons
import domainIcon from '../assets/wizard/domain.png';
import brandIcon from '../assets/wizard/brand.png';
import smtpIcon from '../assets/wizard/smtp.png';
import whatsappIcon from '../assets/wizard/whatsapp.png';
import captchaIcon from '../assets/wizard/captcha.png';
import completeIcon from '../assets/wizard/complete.png';

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    domain: null,
    brand: {},
    smtp: {},
    whatsapp: {},
    recaptcha: {}
  });

  const steps = [
    {
      id: 'domain',
      title: 'Domain Add',
      icon: domainIcon,
      component: DomainAdd
    },
    {
      id: 'brand',
      title: 'Brand Info',
      icon: brandIcon,
      component: BrandSetup
    },
    {
      id: 'smtp',
      title: 'SMTP Config',
      icon: smtpIcon,
      component: SMTPConfig
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Config',
      icon: whatsappIcon,
      component: WhatsappConfig
    },
    {
      id: 'recaptcha',
      title: 'Google reCAPTCHA',
      icon: captchaIcon,
      component: RecaptchaConfig
    },
    {
      id: 'completion',
      title: 'Completion',
      icon: completeIcon,
      component: Completion
    }
  ];

  const handleNext = (stepData) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 2-Grid Layout */}
      <div className="grid grid-cols-[320px_1fr] min-h-screen">
        
        {/* Left Grid - Fixed Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-80 text-white z-30" style={{ backgroundColor: '#20364d' }}>
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-6">Setup Progress</h2>
            
            {/* Timeline UI */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-400"></div>
              
              {steps.map((step, index) => (
                <div key={step.id} className="relative mb-8 last:mb-0">
                  {/* Timeline Node */}
                  <div className="flex items-start space-x-4">
                    {/* Step Number & Icon */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-blue-500 border-blue-300 shadow-lg shadow-blue-500/50'
                            : index < currentStep
                            ? 'bg-green-500 border-green-300'
                            : 'bg-gray-600 border-gray-400'
                        }`}
                      >
                        {index < currentStep ? (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Icon */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                        <img 
                          src={step.icon} 
                          alt={step.title}
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`p-4 rounded-lg transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-blue-500/20 border border-blue-300'
                            : index < currentStep
                            ? 'bg-green-500/20 border border-green-300'
                            : 'bg-gray-600/20 border border-gray-400'
                        }`}
                      >
                        <h3 className={`font-semibold text-sm mb-1 ${
                          index === currentStep
                            ? 'text-blue-100'
                            : index < currentStep
                            ? 'text-green-100'
                            : 'text-gray-300'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs ${
                          index === currentStep
                            ? 'text-blue-200'
                            : index < currentStep
                            ? 'text-green-200'
                            : 'text-gray-400'
                        }`}>
                          {index === currentStep
                            ? 'In Progress'
                            : index < currentStep
                            ? 'Completed'
                            : 'Pending'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Summary */}
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-200">Progress</span>
                <span className="text-sm text-gray-300">
                  {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Right Grid - Body Section */}
        <div className="ml-80 flex flex-col min-h-screen">
          
          {/* Fixed Header */}
          <div className="fixed top-0 left-80 right-0 bg-yellow-100 border-b border-yellow-200 px-6 py-4 z-40" style={{ width: 'calc(100% - 320px)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Ticket Management Setup</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout? Your progress will be saved.')) {
                      window.location.href = '/login';
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors group"
                  title="Logout"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pt-20 pb-20">
            <div className="grid grid-cols-[65%_35%] h-full">
              
              {/* Main Content - 65% */}
              <div className="p-8 overflow-y-auto flex items-center justify-center">
                <div className="w-full max-w-4xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CurrentComponent
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                        data={wizardData}
                        isFirstStep={currentStep === 0}
                        isLastStep={currentStep === steps.length - 1}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Help Section - 35% */}
              <div className="bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
                <div className="sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & Tips
                  </h3>
                  
                  {/* Current Step Help */}
                  <div className="space-y-4">
                    {currentStep === 0 && (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                            </svg>
                            Domain Setup
                          </h4>
                          <p className="text-sm text-blue-700">
                            Add your existing domain to start receiving tickets. Make sure you have access to your domain's DNS settings.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">📋 Requirements</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Domain ownership verification</li>
                            <li>• DNS access permissions</li>
                            <li>• SSL certificate (recommended)</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">⚡ Quick Setup</h5>
                          <p className="text-sm text-gray-600">
                            You can skip this step and configure your domain later in the admin panel.
                          </p>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 1 && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Brand Configuration
                          </h4>
                          <p className="text-sm text-green-700">
                            Customize your brand identity. Upload your logo and set your brand colors to match your company's style.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">🎨 Brand Elements</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Company logo (PNG, JPG, SVG)</li>
                            <li>• Primary brand color</li>
                            <li>• Secondary accent color</li>
                            <li>• Contact information</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">💡 Tips</h5>
                          <p className="text-sm text-gray-600">
                            Use high-resolution logos for better quality. Recommended size: 200x200px or larger.
                          </p>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 2 && (
                      <>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            SMTP Configuration
                          </h4>
                          <p className="text-sm text-purple-700">
                            Configure your email server settings to send notifications and ticket updates to your customers.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">📧 Email Settings</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• SMTP Host (e.g., smtp.gmail.com)</li>
                            <li>• Port (587 for TLS, 465 for SSL)</li>
                            <li>• Username & Password</li>
                            <li>• Encryption (TLS/SSL)</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">🔧 Common Providers</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>• Gmail: smtp.gmail.com:587</div>
                            <div>• Outlook: smtp-mail.outlook.com:587</div>
                            <div>• Yahoo: smtp.mail.yahoo.com:587</div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 3 && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            WhatsApp Integration
                          </h4>
                          <p className="text-sm text-green-700">
                            Connect your WhatsApp Business API to enable customer support through WhatsApp messaging.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">📱 WhatsApp Business</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• WhatsApp Business API key</li>
                            <li>• Phone number verification</li>
                            <li>• Business profile setup</li>
                            <li>• Message templates</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">🚀 Benefits</h5>
                          <p className="text-sm text-gray-600">
                            Enable customers to create tickets directly through WhatsApp for faster support.
                          </p>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 4 && (
                      <>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Security Setup
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Add Google reCAPTCHA to protect your forms from spam and automated attacks.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">🔒 Security Features</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Bot protection</li>
                            <li>• Spam prevention</li>
                            <li>• Form validation</li>
                            <li>• User verification</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">⚙️ Setup Required</h5>
                          <p className="text-sm text-gray-600">
                            Get your Site Key and Secret Key from Google reCAPTCHA console.
                          </p>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 5 && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Setup Complete!
                          </h4>
                          <p className="text-sm text-green-700">
                            Congratulations! Your ticket management system is ready. You can now invite agents and start managing tickets.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">🎯 Next Actions</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Invite team members</li>
                            <li>• Configure workflows</li>
                            <li>• Set up automation</li>
                            <li>• Create ticket categories</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">📊 Dashboard Access</h5>
                          <p className="text-sm text-gray-600">
                            Access your admin panel to manage settings, users, and system configuration.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* General Tips */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Quick Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        You can skip any step and configure it later
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        All settings can be modified after setup
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Contact support if you need assistance
                      </li>
                    </ul>
                  </div>

                  {/* Support Contact */}
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Our support team is here to help you get started.
                    </p>
                    <div className="space-y-2">
                      <a href="/support" className="text-blue-600 hover:text-blue-800 text-sm underline block">
                        📞 Contact Support
                      </a>
                      <a href="/docs" className="text-blue-600 hover:text-blue-800 text-sm underline block">
                        📚 Documentation
                      </a>
                      <a href="/video-tutorials" className="text-blue-600 hover:text-blue-800 text-sm underline block">
                        🎥 Video Tutorials
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer - Hidden on completion page */}
          {currentStep < steps.length - 1 && (
            <div className="fixed bottom-0 left-80 right-0 shadow-lg z-50" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0', width: 'calc(100% - 320px)' }}>
              <div className="w-full px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  {/* Center Info */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <div className="flex space-x-1">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentStep
                              ? 'bg-blue-600'
                              : index < currentStep
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Next/Skip Button */}
                  <div className="flex items-center space-x-3">
                    {currentStep < steps.length - 1 && (
                      <button
                        onClick={handleSkip}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                      >
                        Skip
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (currentStep < steps.length - 1) {
                          // Trigger form submission for current step
                          const currentComponent = steps[currentStep].component;
                          if (currentComponent === DomainAdd) {
                            // Handle domain step
                            handleNext({ domain: { type: 'new', value: 'new_domain' } });
                          } else {
                            // For other steps, just move to next
                            setCurrentStep(currentStep + 1);
                          }
                        } else {
                          // Handle completion
                          console.log('Setup completed!', wizardData);
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        currentStep === steps.length - 1
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                      {currentStep < steps.length - 1 && (
                        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
