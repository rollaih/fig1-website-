import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF5F5'}}>
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <Image
            src="/Fig1_Finallogo.png"
            alt="Fig1 Logo"
            width={120}
            height={40}
            className="h-12 w-auto mx-auto mb-8"
          />
        </div>
        
        <h1 className="text-6xl font-light mb-4" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
          404
        </h1>
        
        <h2 className="text-2xl font-light mb-6" style={{fontFamily: 'var(--font-gowun-batang)', color: '#D959B3'}}>
          Page Not Found
        </h2>
        
        <p className="text-base mb-8 leading-relaxed" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            style={{background: 'linear-gradient(90deg, #B8479E 0%, #E492D0 100%)'}}
          >
            Back to Home
          </Link>
          
          <div className="text-sm">
            <Link 
              href="/team"
              className="text-gray-600 hover:text-[#D959B3] transition-colors mx-3"
            >
              Team
            </Link>
            <Link 
              href="/blog"
              className="text-gray-600 hover:text-[#D959B3] transition-colors mx-3"
            >
              Blog
            </Link>
            <Link 
              href="/#contact"
              className="text-gray-600 hover:text-[#D959B3] transition-colors mx-3"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}