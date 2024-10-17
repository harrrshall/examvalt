'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import DotPattern from '@/components/ui/dot-pattern';
import { Playfair_Display, Inter } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function PaymentPage() {
  const handleCopyUPI = () => {
    navigator.clipboard.writeText('your.upi@provider');
    alert('UPI ID copied to clipboard!');
  };

  const upiId = 'your.upi@provider';
  const whatsappLink = 'https://wa.me/your_number';
  const linkedinLink = 'https://linkedin.com/in/your_profile';
  const twitterLink = 'https://twitter.com/your_handle';

  return (
    <div className={`${inter.className} relative min-h-screen overflow-hidden bg-gray-50`}>
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

      <div className="relative z-10 container mx-auto px-4 py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className={`${playfair.className} text-3xl font-bold mb-6 text-center`}>
            Complete Your Payment
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
            <p className="text-blue-700">
              Special Offer: Get ₹50 discount on your payment!
              After payment, please share the QR screenshot through any of the social links below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <div className="flex items-center">
                    <code className="flex-1 p-3 bg-gray-100 rounded-l-md">
                      {upiId}
                    </code>
                    <button
                      onClick={handleCopyUPI}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scan QR Code
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image
                      src="/api/placeholder/200/200"
                      alt="Payment QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Share Payment Proof</h2>
              <div className="flex justify-center space-x-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <MessageSquare className="h-6 w-6" />
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}