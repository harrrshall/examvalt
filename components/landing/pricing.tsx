'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Playfair_Display, Inter } from 'next/font/google';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'
import { Footer } from './footer'


const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

interface PricingTierProps {
    title: string;
    price: string;
    features: string[];
    buttonText: string;
    highlighted?: boolean;
}
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

const PricingTier: React.FC<PricingTierProps> = ({ title, price, features, buttonText, highlighted = false }) => (
    <div className={`${highlighted ? 'border-blue-500 shadow-lg' : 'border-gray-200'} border-2 rounded-lg p-6 flex flex-col`}>
        <h3 className={`${playfair.className} text-2xl font-bold mb-4`}>{title}</h3>
        <p className={`${inter.className} text-4xl font-bold mb-6`}>{price}<span className="text-lg font-normal">/3 months</span></p>
        <ul className="mb-6 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                    <Check className="text-green-500 mr-2" size={20} />
                    <span className={`${inter.className} text-sm`}>{feature}</span>
                </li>
            ))}
        </ul>
        <Link href="/get-started" className={`${inter.className} ${highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} text-center py-2 px-4 rounded-md transition-colors duration-200`}>
            {buttonText}
        </Link>
    </div>
);

const PricingContent: React.FC = () => {


    return (
        <div className={`${inter.className} min-h-screen bg-gray-50 py-20`}>
            <div className="container mx-auto px-4">
                <h2 className={`${playfair.className} text-4xl font-bold text-center mb-12 mt-12`}>Choose Your Plan</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <PricingTier
                        title="Starting "
                        price="₹500"
                        features={[
                            "Upload handwritten notes, scanned PDFs, or text files",
                            "Generate subjective or MCQ questions",
                            "Set number of questions",
                            "Combine most important questions"
                        ]}
                        buttonText="Get Started"
                    />
                    <PricingTier
                        title="Standard"
                        price="₹1,500"
                        features={[
                            "All Basic features",
                            "Take timed tests",
                            "Get analyzed about topic and chapter-wise performance",
                            "Personalized study recommendations"
                        ]}
                        buttonText="Choose Standard"
                        highlighted={true}
                    />
                    <PricingTier
                        title="Premium "
                        price="₹3,000"
                        features={[
                            "All Standard features",
                            "Comprehensive notes and tests",
                            "Customized preparation level guidance",
                            "Live doubt solving with teachers"
                        ]}
                        buttonText="Go Premium"
                    />
                </div>
            </div>
        </div>
    );
};

const Pricing: React.FC = () => {
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
        <>
            <header className="fixed top-0 z-50 w-full px-8 py-4">
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

            {/* Main content */}
            <main>
                <PricingContent />
            </main>

            <Footer />
        </>
    );
};

export default Pricing;