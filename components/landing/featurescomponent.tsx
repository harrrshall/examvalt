// featurescomponent.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import DotPattern from '../ui/dot-pattern'
import { MagicCard } from '../ui/magic-card'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

interface Feature {
  title: string
  description: string
  imageSrc: string
}

const features: Feature[] = [
  {
    title: "AI-Powered Question Generation",
    description: "Our advanced AI algorithms analyze your study materials and generate tailored practice questions, ensuring comprehensive coverage of all topics.",
    imageSrc: "/image1.png"
  },
  {
    title: "Personalized Study Plans",
    description: "Get a customized study schedule based on your exam date, current knowledge level, and learning pace. Our system adapts to your progress, ensuring optimal preparation.",
    imageSrc: "/image2.png"
  },
  {
    title: "Real-time Performance Analytics",
    description: "Track your progress with detailed analytics and insights. Identify your strengths and weaknesses, and focus your efforts where they matter most.",
    imageSrc: "/image3.png"
  }
]

const FeatureRow: React.FC<{ feature: Feature; isReversed: boolean }> = ({ feature, isReversed }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className={`${inter.className} relative flex flex-col md:flex-row items-center justify-between gap-8 p-8`}>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="absolute inset-0 h-full w-full text-gray-200 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:text-gray-800"
      />
      <div className={`flex flex-1 flex-col ${isReversed ? 'md:order-last' : ''}`}>
        <MagicCard
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          gradientSize={isHovered ? 300 : 200}
          gradientOpacity={isHovered ? 0.2 : 0.1}
          className="p-6 transition-all duration-300 ease-in-out h-full"
        >
          <h3 className={`${playfair.className} text-2xl font-bold mb-4`}>{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
        </MagicCard>
      </div>
      <div className="flex-1 relative" style={{ width: '100%', paddingBottom: '60%' }}>
        <Image
          src={feature.imageSrc}
          alt={feature.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  )
}

interface FeaturesSectionProps {
  id?: string;
}

export function FeaturesSection({ id }: FeaturesSectionProps) {
  return (
    <section id={id} className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <h2 className={`${playfair.className} text-4xl font-bold text-center mb-12`}>Our Features</h2>
        {features.map((feature, index) => (
          <FeatureRow key={index} feature={feature} isReversed={index % 2 !== 0} />
        ))}
    </section>
  )
}