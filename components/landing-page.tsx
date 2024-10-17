'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import DotPattern from "./ui/dot-pattern"
import { FeaturesSection } from './landing/featurescomponent'
import { Footer } from './landing/footer'
import { useRouter } from 'next/navigation'
import { Playfair_Display, Inter } from 'next/font/google'

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

export function LandingPageComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), [])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  const handleGetStarted = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/auth')
  }, [router])

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
    <div className={`${inter.className} relative overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <DotPattern
          width={22}
          height={22}
          cx={2}
          cy={2}
          cr={1}
          className="text-gray-200"
        />
      </div>

      <div className="relative z-10">
        <header className="fixed top-0 z-50 w-full px-8 py-4">
          <div className="relative mx-auto flex flex-row justify-between items-center rounded-md border p-2 shadow-sm backdrop-blur transition-colors lg:w-full bg-background/80">
            <Link href="/" title="brand-logo" className={`${playfair.className} relative flex items-center space-x-2`}>
              <span className="text-xl font-bold">ExamVault</span>
            </Link>
            <nav className="hidden lg:flex flex-grow justify-center">
              <ul className="flex space-x-12 justify-center">
                <NavLink href="#features">Features</NavLink>
                <li><NavLink href="/pricing">Pricing</NavLink></li>
                <li><NavLink href="/testimonials" onClick={closeMenu}>Testimonials</NavLink></li>
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
                    <NavLink href="#features" onClick={closeMenu}>Features</NavLink>
                    <NavLink href="/testimonials" onClick={closeMenu}>Testimonials</NavLink>
                    <NavLink href="/pricing" onClick={closeMenu}>Pricing</NavLink>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <button onClick={handleGetStarted} className={`${inter.className} px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200`}>
                Get Started
              </button>
            </div>
          </div>
        </header>
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className={`${playfair.className} text-5xl font-bold mb-4`}>
                Ace Your Exams with ExamVault
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your study materials into personalized practice questions, timed tests, and expert-guided preparation plans.
              </p>
              <div className="flex justify-center space-x-4">
                <button onClick={handleGetStarted} className={`${inter.className} px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200`}>
                  Start Free Trial
                </button>
                <Link href="/pricing" className={`${inter.className} border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200`}>
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </main>
        <FeaturesSection id="features" />
        <Footer />
      </div>
    </div>
  )
}