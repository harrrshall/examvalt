'use client'

import Image from 'next/image'
import Link from "next/link"
import { Menu, X, Quote } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
// import { BorderBeam } from './ui/border-beam'
import { Playfair_Display, Inter } from 'next/font/google'
import { Footer } from './footer'


const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <Link href={href} onClick={onClick} className={`${inter.className} hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50`}>
    {children}
  </Link>
)

interface Testimonial {
  id: number
  content: string
  author: string
  role: string
  avatarSrc: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "ExamVault transformed my study routine. The personalized questions and adaptive learning path helped me ace my finals with confidence.",
    author: "Alex Johnson",
    role: "Computer Science Student",
    avatarSrc: "/man.png"
  },
  {
    id: 2,
    content: "As a working professional pursuing an MBA, time is precious. ExamVault's efficient study plans and real-time analytics made my exam preparation so much more effective.",
    author: "Samantha Lee",
    role: "MBA Candidate",
    avatarSrc: "/man.png"
  },
  {
    id: 3,
    content: "The AI-generated questions in ExamVault are incredibly relevant and challenging. It's like having a personal tutor available 24/7.",
    author: "Michael Torres",
    role: "Medical Student",
    avatarSrc: "/man.png"
  }
]

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-xl p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-blue-100">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
    <div className="absolute top-4 left-4 text-blue-200 opacity-50">
      <Quote size={64} />
    </div>
    <div className="relative z-10">
      <p className={`${playfair.className} text-gray-800 mb-6 italic text-lg leading-relaxed`}>{testimonial.content}</p>
    </div>
    <div className="flex items-center mt-4 relative z-10">
      <div className="flex-shrink-0 mr-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur"></div>
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.author}
            width={64}
            height={64}
            className="rounded-full border-2 border-white relative z-10"
          />
        </div>
      </div>
      <div>
        <h4 className={`${playfair.className} font-bold text-gray-900 text-xl`}>{testimonial.author}</h4>
        <p className={`${inter.className} text-blue-600 text-sm font-medium`}>{testimonial.role}</p>
      </div>
    </div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-100 rounded-tl-full opacity-50"></div>
  </div>
)


export function TestimonialsSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <header className="fixed top-0 z-50 w-full px-8 py-4 bg-gray-50">
        <div className="relative mx-auto flex flex-row justify-between items-center rounded-md border p-2 shadow-sm backdrop-blur transition-colors lg:w-full bg-background/80">
          <Link href="/" title="brand-logo" className={`${playfair.className} relative flex items-center space-x-2`}>
            <span className="text-xl font-bold">ExamVault</span>
          </Link>
          <nav className="hidden lg:flex flex-grow justify-center">
            <ul className="flex space-x-12 justify-center">
              <NavLink href="/">Features</NavLink>
              <li><NavLink href="/pricing">Pricing</NavLink></li>
              <li><NavLink href="/testimonials">Testimonials</NavLink></li>
            </ul>
          </nav>

          <div className="lg:hidden" ref={dropdownRef}>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="Open Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out origin-top-right transform scale-100 opacity-100">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <NavLink href="/" onClick={closeMenu}>Features</NavLink>
                  <NavLink href="/testimonials" onClick={closeMenu}>Testimonials</NavLink>
                  <NavLink href="/pricing" onClick={closeMenu}>Pricing</NavLink>
                </div>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <Link href="/get-started" className={`${inter.className} px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200`}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className={`${playfair.className} text-5xl font-bold text-gray-900 mb-4`}>What Our Users Say</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how ExamVault has helped students and professionals achieve their academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="#" className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Join ExamVault Today
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}