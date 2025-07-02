'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  tags: string[];
  categories: string[];
  seoTitle?: string;
  seoDescription?: string;
}

// Sample related posts
const relatedPosts = [
  {
    id: '2',
    title: 'Building User-Centered Digital Experiences',
    excerpt: 'A deep dive into UX/UI design principles that create meaningful connections between brands and users.',
    featuredImage: '/Background.png',
    readingTime: 7,
    slug: 'building-user-centered-digital-experiences'
  },
  {
    id: '3',
    title: 'Data-Driven Marketing Strategies for 2024',
    excerpt: 'Learn how to leverage advanced analytics and machine learning to create marketing campaigns that deliver results.',
    featuredImage: '/Background.png',
    readingTime: 6,
    slug: 'data-driven-marketing-strategies-2024'
  }
];

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`);
      const result = await response.json();
      
      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.error || 'Post not found');
      }
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
        <Header />
        <div className="pt-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D959B3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
        <Header />
        <div className="pt-32 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
          <Link 
            href="/blog"
            className="bg-[#D959B3] text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-extralight mb-6 leading-tight" style={{fontFamily: 'var(--font-gowun-batang)', fontSize: '48px', letterSpacing: '-2px', color: '#09090A'}}>
              {post.title}
            </h1>
            <p className="text-lg mb-6 leading-tight" style={{color: '#777777', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 400}}>
              {post.excerpt}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm" style={{color: '#777777'}}>
              <span style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                By {post.author}
              </span>
              <span>•</span>
              <span style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                {formatDate(post.createdAt)}
              </span>
              <span>•</span>
              <span style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                {calculateReadingTime(post.content)} min read
              </span>
            </div>
          </div>
          
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12">
              <div className="relative overflow-hidden" style={{borderRadius: '22px'}}>
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                  style={{borderRadius: '22px'}}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Article Content */}
      <section className="pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <article 
            className="prose prose-lg max-w-none blog-content"
            style={{
              color: '#09090A',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              lineHeight: '1.7'
            }}
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '') }}
          />
          
          <style jsx>{`
            .blog-content h1 {
              font-family: 'var(--font-gowun-batang)';
              font-size: 2.5rem;
              font-weight: 300;
              color: #09090A;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              line-height: 1.2;
            }
            
            .blog-content h2 {
              font-family: '"Helvetica Neue", Helvetica, Arial, sans-serif';
              font-size: 1.5rem;
              font-weight: 700;
              color: #09090A;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              line-height: 1.3;
            }
            
            .blog-content p {
              margin-bottom: 1rem;
              font-size: 1.1rem !important;
              line-height: 1.7;
              font-weight: normal !important;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            }
            
            .blog-content ul {
              margin: 1rem 0;
              padding-left: 1.5rem;
              list-style-type: disc !important;
              list-style-position: outside !important;
            }
            
            .blog-content li {
              margin-bottom: 0.25rem;
              font-size: 1.1rem;
              line-height: 1.6;
              display: list-item !important;
              list-style-type: disc !important;
            }
            
            .blog-content img {
              border-radius: 16px;
              margin: 2rem 0;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            /* Ensure consistent text sizing after lists */
            .blog-content ul + p,
            .blog-content ol + p {
              font-size: 1.1rem !important;
              font-weight: normal !important;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            }
            
            /* Reset any text that might not be in paragraphs */
            .blog-content > div,
            .blog-content > span,
            .blog-content > text {
              font-size: 1.1rem !important;
              font-weight: normal !important;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
              line-height: 1.7;
            }
            
            /* Ensure all text elements have consistent sizing */
            .blog-content {
              font-size: 1.1rem !important;
              font-weight: normal !important;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
              line-height: 1.7;
            }
            
            .blog-content strong {
              font-weight: 600 !important;
              font-size: inherit !important;
            }
          `}</style>
        </div>
      </section>
      
      {/* Back to Blog Navigation - only for non-case-study posts */}
      {!post.categories.includes('case-study') && 
       !post.slug.includes('ataitecs-digital-sales-agent') && 
       !post.slug.includes('smart-ads-smarter-agents') && 
       !post.slug.includes('ai-sommelier-in-store-activation') && (
        <section className="py-16 px-6 md:px-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center bg-[#D959B3] text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#B8479E] hover:shadow-lg"
            >
              ← Back to Main Blog Page
            </Link>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Image
                src="/Fig1_Finallogo.png"
                alt="Fig1 Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
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