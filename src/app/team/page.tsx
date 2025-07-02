import Header from '@/components/Header';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Team | Fig.1 - Meet Our AI & Marketing Experts",
  description: "Meet the team behind Fig.1's innovative advertising solutions. Our diverse group of strategists, creatives, and technologists shape the future of AI-powered marketing.",
  keywords: "Fig.1 team, marketing experts, AI specialists, creative team, advertising professionals, leadership team",
  openGraph: {
    title: "Our Team | Fig.1 - Meet Our AI & Marketing Experts",
    description: "Meet the diverse team of strategists, creatives, and technologists behind Fig.1's innovative AI-powered advertising solutions.",
    url: 'https://fig1.com/team',
    siteName: 'Fig.1',
    images: [
      {
        url: '/Fig1_Finallogo.png',
        width: 1200,
        height: 630,
        alt: 'Fig.1 Team - AI & Marketing Experts',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Team | Fig.1 - AI & Marketing Experts",
    description: "Meet the team shaping the future of advertising through bold creativity, smart strategy, and cutting-edge AI innovation.",
    images: ['/Fig1_Finallogo.png'],
  },
  alternates: {
    canonical: 'https://fig1.com/team',
  },
};

export default function Team() {
  const teamMembers = [
    {
      name: "Jim Figliulo",
      title: "Chief Executive Officer",
      description: "Jim Figliulo, the founder of Fig.1, has for the last 15 years expertly navigated the company from the early gold rush of application development to its current stature as a leader in AI innovation. His strategic foresight has been instrumental in firmly positioning Fig.1 at the forefront of the AI-advertising and AI-application revolution.",
      image: "/Jim.JPG"
    },
    {
      name: "Todd Dobozi",
      title: "Chief Growth Officer",
      description: "Todd Dobozi has over 25 years of experience reshaping the wine and spirits landscape, pioneering innovative strategies for the world's largest alcohol brands, and cementing enduring relationships with industry titans. His nuanced understanding of market dynamics, paired with a visionary leadership style, distinguishes him as a cornerstone in the sector.",
      image: "/ToddD.png"
    },
    {
      name: "Lindsay Oplinger",
      title: "Chief Operating and Financial Officer",
      description: "Lindsay Oplinger has over 15 years of experience in financial services, human resources, and operations. Her expertise lies in strategic financial planning and analysis, alongside a proven track record of optimizing operational efficiencies. She is known for her innovative approach to problem-solving and her commitment to fostering sustainable growth.",
      image: "/Lindsay+2.png"
    },
    {
      name: "Jeremy Wagner",
      title: "Chief Marketing and Technology Officer",
      description: "Jeremy brings over 24 years of experience in omnichannel marketing and e-commerce, managing small to multi-million-dollar budgets and driving significant returns. At his core, Jeremy is a problem solver with deep platform expertise in Shopify, Magento and WordPress development while being further enabled by his advanced data modeling techniques. As an early adopter of AI technologies, he also helps develop cutting-edge solutions to enhance CX and empower clients.",
      image: "/jeremy.png"
    },
    {
      name: "Rolla Hammoud",
      title: "Chief Product Officer",
      description: "Rolla Hammoud is a product, marketing, and design leader with 10+ years of experience building digital brands and user-centered experiences. With a background in UX/UI, content strategy, and cross-functional leadership, she blends creative instinct with strategic thinking to launch products that connect and perform.",
      image: "/Rolla.png"
    },
    {
      name: "Mari Pepin",
      title: "Media Director",
      description: "Mariela Pepin is an alumna of Towson University, where she earned her degree in Communications. She has developed a robust career in social media and digital marketing, collaborating with a diverse array of brands across multiple sectors, including medical, beauty and aesthetics, restaurants, and consumer goods. Her expertise lies in leveraging digital platforms to enhance brand visibility and engage target audiences effectively.",
      image: "/mari.png"
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-extralight mb-6 leading-tight" style={{fontFamily: 'var(--font-gowun-batang)', fontSize: '51px', letterSpacing: '-2px', color: '#09090A'}}>
            Meet the <span style={{color: '#D959B3'}}>Team</span><br />
            Behind Fig.1
          </h1>
          <p className="text-base mb-12 max-w-3xl mx-auto leading-tight" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
            Our diverse team of strategists, creatives, and technologists work together to shape the future of advertising through bold creativity, smart strategy, and cutting-edge AI innovation.
          </p>
        </div>
      </section>
      
      {/* Team Members Section */}
      <section className="pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col h-full">
                <div className="h-[28rem] bg-cover bg-center overflow-hidden mb-4 relative group" style={{borderRadius: '22px'}}>
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={320}
                      className="w-full h-full object-cover"
                      style={{borderRadius: '22px'}}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{borderRadius: '22px'}}>
                      <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                  {/* Overlay with name and title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 transition-opacity duration-300" style={{borderRadius: '22px'}}></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-medium mb-1 leading-tight" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                      {member.name}
                    </h3>
                    <h4 className="text-xl font-light text-white" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                      {member.title}
                    </h4>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <p className="leading-relaxed" style={{color: '#777777', lineHeight: '1.4', fontSize: '15px'}}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
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
                <a href="#" className="text-gray-600 hover:text-[#D959B3] transition-colors">
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