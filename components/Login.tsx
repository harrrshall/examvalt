import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  isSignInWithEmailLink, 
  signInWithEmailLink,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { db } from '../lib/firebase'; // Add this import
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Add this import
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { ArrowRight, Mail, Lock } from 'lucide-react';


import { Menu, X } from 'lucide-react'

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

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

export const AuthComponent: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // const router = useRouter() // Use useRouter from next/navigation

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

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            router.push('/dashboard');
          })
          .catch((error: Error) => {
            setError(`Error signing in with email link: ${error.message}`);
          });
      }
    }
  }, [router]);
  const createUserDocument = async (userId: string, email: string) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: email,
        credits: 2, // Start with 2 free credits
        files: [], // Empty array to store file references later
        createdAt: new Date(),
      });
    }
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Please verify your email before logging in.');
          await sendEmailVerification(userCredential.user);
          setStep(2);
        } else {
          router.push('/dashboard');
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
          await createUserDocument(userCredential.user.uid, email);
          setStep(2);
        }
      }
    } catch (error) {
      setError(`Authentication error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsProcessing(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetPasswordSent(true);
    } catch (error) {
      setError(`Error sending password reset email: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user.uid, user.email!);
      router.push('/dashboard');
    } catch (error) {
      setError(`Google sign-in error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`${inter.className} min-h-screen flex items-center justify-center bg-gray-50 relative`}>
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

      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" className="text-gray-200">
          <pattern id="dot-pattern" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h2 className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
              {isLogin ? 'Welcome Back' : 'Join ExamVault'}
            </h2>
            <p className="text-gray-600">
              {step === 1 ? (isLogin ? 'Log in to your account' : 'Create your account') : 'Verify your email'}
            </p>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {step === 1 && (
            <>
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <span className="mr-2">{isLogin ? 'Log In' : 'Sign Up'}</span>
                  <ArrowRight size={20} />
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-center text-gray-600">
                A verification email has been sent to your email address. Please check your inbox and click the verification link to {isLogin ? 'log in' : 'complete your registration'}.
              </p>
              <button
                onClick={() => sendEmailVerification(auth.currentUser!)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Resend Verification Email
              </button>
            </div>
          )}

          {step === 1 && isLogin && (
            <div className="text-center">
              <button
                onClick={handleResetPassword}
                disabled={isProcessing}
                className="text-sm text-blue-600 hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
              {resetPasswordSent && (
                <p className="mt-2 text-sm text-green-600">
                  Password reset email sent. Please check your inbox.
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isProcessing}
                  className="ml-1 text-blue-600 hover:underline focus:outline-none"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            {step === 2 ? 'Login' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};