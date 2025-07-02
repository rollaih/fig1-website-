
'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    email: '',
    vision: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const templateParams = {
        to_email: 'rolla@fig1.com',
        from_name: formData.name,
        from_email: formData.email,
        brand: formData.brand,
        vision: formData.vision
      };

      await emailjs.send(
        'service_e7o8agl',
        'template_ch1ztf3',
        templateParams,
        'YD-24PjfhiGVN1Zdb'
      );

      setSubmitStatus('success');
      setFormData({ name: '', brand: '', email: '', vision: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/Background.png")'}}>
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-extralight mb-6 leading-tight" style={{fontFamily: 'var(--font-gowun-batang)', fontSize: '51px', letterSpacing: '-2px', color: '#09090A'}}>
            Shaping the Future of Advertising,<br />
            <span style={{color: '#D959B3'}}>One Brand At A Time</span>
          </h1>
          <p className="text-base mb-8 max-w-3xl mx-auto leading-tight" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
            Bold creative, smart strategy, and cutting-edge AI. At Fig.1, we empower brands through creative and performance advertising, app development, and intelligent digital experiences, helping shape the brands of tomorrow.
          </p>
          
          <div className="flex justify-center mb-12">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform cursor-pointer" 
              style={{background: 'linear-gradient(90deg, #B8479E 0%, #E492D0 100%)'}}
            >
              Get Started
            </button>
          </div>
          
          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {/* Large Image - Left Side */}
            <div className="aspect-[4/4.5] relative overflow-hidden bg-cover bg-center group cursor-pointer" style={{borderRadius: '22px', backgroundImage: 'url("/Kohler.png")'}}>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <h3 className="absolute bottom-14 left-6 text-white text-3xl md:text-5xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: 'var(--font-gowun-batang)'}}>
                Kohler
              </h3>
              <span className="absolute bottom-6 left-6 bg-white px-3 py-0.5 text-sm text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300}}>
                Application
              </span>
            </div>
            
            {/* Right Side - 3 different sized images */}
            <div className="flex flex-col gap-4 h-full">
              {/* Top Right - Larger */}
              <div className="flex-1 relative overflow-hidden min-h-[280px] bg-cover bg-center group cursor-pointer" style={{borderRadius: '22px', backgroundImage: 'url("/Constellation.png")'}}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <h3 className="absolute bottom-14 left-5 md:left-5 text-white text-3xl md:text-5xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight text-left" style={{fontFamily: 'var(--font-gowun-batang)'}}>
                  <span className="md:hidden">Constellation<br />Brands</span>
                  <span className="hidden md:inline">Constellation Brands</span>
                </h3>
                <span className="absolute bottom-6 left-5 bg-white px-3 py-0.5 text-sm text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300}}>
                  Advertising
                </span>
              </div>
              
              {/* Bottom Row - Two smaller images side by side */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Bottom Left */}
                <div className="relative overflow-hidden bg-cover bg-center min-h-[240px] md:min-h-[160px] group cursor-pointer" style={{borderRadius: '22px', backgroundImage: 'url("/Dude.png")'}}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <h3 className="absolute bottom-14 left-4 text-white text-3xl md:text-5xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: 'var(--font-gowun-batang)'}}>
                    Dude
                  </h3>
                  <span className="absolute bottom-6 left-4 bg-white px-3 py-0.5 text-sm text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300}}>
                    Digital Advertising
                  </span>
                </div>
                
                {/* Bottom Right */}
                <div className="relative overflow-hidden min-h-[240px] md:min-h-[160px] bg-cover bg-center group cursor-pointer" style={{borderRadius: '22px', backgroundImage: 'url("/marsh.png")'}}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <h3 className="absolute bottom-14 left-4 text-white text-3xl md:text-5xl font-light text-left leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: 'var(--font-gowun-batang)', letterSpacing: '-1px'}}>
                    Marsh<br />McLennan Agency
                  </h3>
                  <span className="absolute bottom-6 left-4 bg-white px-3 py-0.5 text-sm text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300}}>
                    Application
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Logos Section */}
      <section className="px-6 md:px-12 py-4">
        <div className="max-w-6xl mx-auto text-center">
          <img src="/clientlogos_mobile.png" alt="Client Logos" className="block md:hidden w-full opacity-70" />
          <img src="/Clients.png" alt="Client Logos" className="hidden md:block w-full max-w-4xl mx-auto opacity-70" />
        </div>
      </section>
      </div>
      
      {/* Services Section */}
      <section className="bg-black pt-8 pb-12 md:py-24 px-6 md:px-12" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 - Title and Performance Marketing */}
            <div className="space-y-8 md:space-y-6">
              <div className="flex items-center py-4 md:h-72 lg:h-80">
                <h2 className="text-center md:text-left text-5xl md:text-5xl lg:text-6xl font-light text-white leading-tight w-full" style={{fontFamily: 'var(--font-gowun-batang)'}}>
                  What we<br />do best
                </h2>
              </div>
              <div className="px-8 py-8 md:px-9 md:py-8 h-auto md:h-72 lg:h-80 flex flex-col" style={{borderRadius: '22px', backgroundColor: '#272832'}}>
                <div className="w-10 h-10 bg-white rounded-lg mb-6 md:mb-10 flex items-center justify-center">
                  <img src="/Icon_marketing.png" alt="Marketing Icon" className="w-11 h-11" />
                </div>
                <h3 className="font-medium text-white mb-3" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.83rem)', lineHeight: '110%'}}>
                  Performance<br />Marketing
                </h3>
                <p className="leading-relaxed md:leading-tight flex-1" style={{fontSize: 'clamp(0.85rem, 0.8vw, 0.7rem)', color: '#B4B4B4'}}>
                  We plan, launch, and optimize digital advertising across every major channel—
                  social, search, display, and more. From awareness to conversion, we blend bold 
                  creative with performance strategy to maximize results at every stage of the 
                  funnel.
                </p>
              </div>
            </div>
            
            {/* Column 2 - AI Digital Engagement and Creative Content */}
            <div className="space-y-4 md:space-y-6">
              <div className="px-8 py-8 md:px-9 md:py-8 h-auto md:h-72 lg:h-80 flex flex-col relative" style={{borderRadius: '22px', backgroundColor: '#272832'}}>
                <div className="flex justify-between items-start mb-6 md:mb-10">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <img src="/Icon_AIAgents.png" alt="AI Agents Icon" className="w-11 h-11" />
                  </div>
                  <div className="flex justify-end">
                    <span className="text-2xl font-bold uppercase" style={{background: 'linear-gradient(90deg, #B237FF 0%, #EAC0FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>NEW: FIG.1 AI</span>
                  </div>
                </div>
                <h3 className="font-medium text-white mb-3" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.83rem)', lineHeight: '110%'}}>
                  AI Digital<br />Engagement Agents
                </h3>
                <p className="leading-relaxed md:leading-tight flex-1" style={{fontSize: 'clamp(0.85rem, 0.8vw, 0.7rem)', color: '#B4B4B4'}}>
                  Intelligent brand agents that engage, convert, and support—powered by AI. From 
                  chat-based experiences to sales enablement tools, Fig.1 AI bridges creativity 
                  and machine learning to redefine how brands connect, and convert.
                </p>
              </div>
              <div className="px-8 py-8 md:px-9 md:py-8 h-auto md:h-72 lg:h-80 flex flex-col" style={{borderRadius: '22px', backgroundColor: '#272832'}}>
                <div className="w-10 h-10 bg-white rounded-lg mb-6 md:mb-10 flex items-center justify-center">
                  <img src="/Icon_Creative.png" alt="Creative Icon" className="w-11 h-11" />
                </div>
                <h3 className="font-medium text-white mb-3" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.83rem)', lineHeight: '110%'}}>
                  Creative<br />Content
                </h3>
                <p className="leading-relaxed md:leading-tight flex-1" style={{fontSize: 'clamp(0.85rem, 0.8vw, 0.7rem)', color: '#B4B4B4'}}>
                  From standout social assets to full-scale brand storytelling, we craft content that 
                  captures attention and drives engagement. Our creative is built to perform—strategic, 
                  scroll-stopping, and always on-brand.
                </p>
              </div>
            </div>
            
            {/* Column 3 - Next Gen App Development and Campaigns & Strategy */}
            <div className="space-y-4 md:space-y-6">
              <div className="px-8 py-8 md:px-9 md:py-8 h-auto md:h-72 lg:h-80 flex flex-col" style={{borderRadius: '22px', backgroundColor: '#272832'}}>
                <div className="w-10 h-10 bg-white rounded-lg mb-6 md:mb-10 flex items-center justify-center">
                  <img src="/Icon_App.png" alt="App Development Icon" className="w-11 h-11" />
                </div>
                <h3 className="font-medium text-white mb-3" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.83rem)', lineHeight: '110%'}}>
                  Next Gen App<br />Development
                </h3>
                <p className="leading-relaxed md:leading-tight flex-1" style={{fontSize: 'clamp(0.85rem, 0.8vw, 0.7rem)', color: '#B4B4B4'}}>
                  We build custom applications that go beyond functionality—apps that are intuitive, 
                  scalable, and built with the future in mind. Whether it's a product experience or a 
                  marketing tool, our work blends design and engineering seamlessly.
                </p>
              </div>
              <div className="px-8 py-8 md:px-9 md:py-8 h-auto md:h-72 lg:h-80 flex flex-col" style={{borderRadius: '22px', backgroundColor: '#272832'}}>
                <div className="w-10 h-10 bg-white rounded-lg mb-6 md:mb-10 flex items-center justify-center">
                  <img src="/Icon_CampaignStrategy.png" alt="Campaign Strategy Icon" className="w-11 h-11" />
                </div>
                <h3 className="font-medium text-white mb-3" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.83rem)', lineHeight: '110%'}}>
                  Campaigns &<br />Strategy
                </h3>
                <p className="leading-relaxed md:leading-tight flex-1" style={{fontSize: 'clamp(0.85rem, 0.8vw, 0.7rem)', color: '#B4B4B4'}}>
                  From first insight to final launch, we build end-to-end campaigns that integrate 
                  everything we do—creative, performance, app development, and AI. Whether you need 
                  a full-funnel strategy or a bold one-off idea, we connect the dots to deliver results that 
                  matter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 px-6 bg-white" id="about">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/New-Fig1AI.png" alt="New Fig1 AI" className="mx-auto mb-4 h-8" />
          <h2 className="text-4xl md:text-5xl font-light mb-6" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A', lineHeight: '1.15'}}>
            Reimagining Brand<br />
            Experiences Through AI
          </h2>
          <p className="text-base mb-8 max-w-3xl mx-auto leading-tight" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
            Introducing Fig.1's newest category: a dedicated arm focused on building intelligent digital agents that help brands engage, educate, and convert—through personalized, AI-powered interactions across web, in-store, and beyond.
          </p>
          
          <div className="flex justify-center mb-8">
            <a 
              href="https://www.fig1.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent px-5 py-2 font-medium transition-all duration-300 hover:shadow-lg border-2 rounded-full inline-block hover:!text-white hover:bg-[#D959B3]" 
              style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '16px', color: '#D959B3', borderColor: '#D959B3'}}
            >
              Learn More
            </a>
          </div>
          
          <div className="relative h-80 md:h-[28rem] mb-8 overflow-hidden mx-auto max-w-4xl" style={{borderRadius: '22px'}}>
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop
              playsInline
              controls
            >
              <source src="/FigAI_Promovideo_Final.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      
      {/* Portfolio Section */}
      <section className="py-20 px-6" id="work">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>Our Work</h2>
            <p className="text-base mb-8 max-w-3xl mx-auto leading-tight" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
              We've helped dozens of brands turn big ideas into real-world results. From breakthrough campaigns to innovative digital builds, here's a look at some of our standout work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col h-full">
              <div className="h-72 bg-cover bg-center overflow-hidden" style={{borderRadius: '22px', backgroundImage: 'url("/Ataitec_Clientwork.png")'}}></div>
              <div className="flex flex-col justify-between flex-1 mt-4">
                <h3 className="text-3xl font-medium mb-2 leading-tight" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>AtaiTec's Digital<br />Sales Agent</h3>
                <p style={{color: '#868686', lineHeight: '1.4', fontSize: '15px'}}>We partnered with AtaiTec to design and launch a custom AI sales agent that helps explain their ISD technology, capture leads, and streamline customer interactions—turning technical complexity into a seamless digital experience.</p>
                <div className="mt-auto pt-6">
                  <a 
                    href="/blog/ataitecs-digital-sales-agent" 
                    className="bg-transparent border border-[#D959B3] text-[#D959B3] px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white inline-block"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="h-72 bg-cover bg-center overflow-hidden" style={{borderRadius: '22px', backgroundImage: 'url("/Mathnasium_Clientwork.png")'}}></div>
              <div className="flex flex-col justify-between flex-1 mt-4">
                <h3 className="text-3xl font-medium mb-2 leading-tight" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>Smart Ads +<br />Smarter Agent</h3>
                <p style={{color: '#868686', lineHeight: '1.4', fontSize: '15px'}}>We built an AI agent that simulates a Mathnasium instructor—helping parents understand their personalized learning approach and prompting bookings. Supported by paid social campaigns, the rollout included 8 custom agents across 8 locations.</p>
                <div className="mt-auto pt-6">
                  <a 
                    href="/blog/smart-ads-smarter-agents" 
                    className="bg-transparent border border-[#D959B3] text-[#D959B3] px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white inline-block"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="h-72 bg-cover bg-center overflow-hidden" style={{borderRadius: '22px', backgroundImage: 'url("/corksandcheers_clientwork.png")'}}></div>
              <div className="flex flex-col justify-between flex-1 mt-4">
                <h3 className="text-3xl font-medium mb-2 leading-tight" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>AI Sommelier<br />In-Store Activation</h3>
                <p style={{color: '#868686', lineHeight: '1.4', fontSize: '15px'}}>We developed an AI-powered wine sommelier for Corks & Cheers, helping shoppers discover personalized wine recommendations based on taste, occasion, and meal pairing. It supported their in-store engagement & elevated product discovery.</p>
                <div className="mt-auto pt-6">
                  <a 
                    href="/blog/ai-sommelier-in-store-activation" 
                    className="bg-transparent border border-[#D959B3] text-[#D959B3] px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white inline-block"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 px-6" style={{backgroundColor: '#FFF5F5'}} id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-left" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
                Let's <span style={{color: '#D959B3'}}>Work</span><br />
                Together
              </h2>
              <p className="text-base mb-8 leading-tight text-left max-w-sm" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
                Have a bold idea, a big challenge, or just want to see what's possible? We'd love to hear from you. Let's build what's next—together.
              </p>
              
            </div>
            
            <div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-base font-medium mb-2" style={{color: '#615E5E'}}>Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-5/6 p-4 border border-gray-200 focus:outline-none focus:border-[#D959B3] bg-white text-lg text-black" style={{borderRadius: '22px'}}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2" style={{color: '#615E5E'}}>Your Brand</label>
                  <input 
                    type="text" 
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-5/6 p-4 border border-gray-200 focus:outline-none focus:border-[#D959B3] bg-white text-lg text-black" style={{borderRadius: '22px'}}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2" style={{color: '#615E5E'}}>Your Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                    className="w-5/6 p-4 border border-gray-200 focus:outline-none focus:border-[#D959B3] bg-white text-lg text-black" style={{borderRadius: '22px'}}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2" style={{color: '#615E5E'}}>Your Vision</label>
                  <textarea 
                    rows={4}
                    name="vision"
                    value={formData.vision}
                    onChange={handleInputChange}
                    required
                    className="w-5/6 p-4 border border-gray-200 focus:outline-none focus:border-[#D959B3] bg-white text-lg text-black" style={{borderRadius: '22px'}}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-block text-white px-5 py-2 font-medium transition-colors hover:opacity-90 rounded-full disabled:opacity-50" style={{backgroundColor: '#D959B3'}}
                >
                  {isSubmitting ? 'Sending...' : "Let's Chat"}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="mt-6 text-left w-5/6">
                    <p className="font-bold" style={{color: '#D959B3'}}>Message Sent Successfully!</p>
                    <p className="text-sm mt-1" style={{color: '#B8479E'}}>Thanks for reaching out! We'll get back to you within 24 hours at the email you provided. Let's build something amazing together.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-full text-center">
                    <p className="text-red-700 font-medium">Oops! Something went wrong.</p>
                    <p className="text-red-600 text-sm mt-1">Please try again or email us directly at rolla@fig1.com</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6" style={{backgroundColor: '#FFF5F5'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <a href="/">
                <Image
                  src="/Fig1_Finallogo.png"
                  alt="Fig1 Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto cursor-pointer"
                />
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              {/* Social Media Icons */}
              <div className="flex items-center justify-end space-x-4">
                <a href="https://www.instagram.com/_fig.1/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#D959B3] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=100070048278412" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#D959B3] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/fig1studio/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#D959B3] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              
              {/* Copyright */}
              <div className="flex items-center justify-end">
                <div className="text-sm" style={{color: '#777777'}}>
                  © 2025 Fig1. All rights Reserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
