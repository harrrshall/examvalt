'use client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { LayoutDashboard, FileText, BarChart2, GraduationCap, Upload, FileQuestion, Brain, PenTool, Lock, Clock, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from "@/lib/utils"
import DotPattern from '../ui/dot-pattern'
import { useAuth } from '@/lib/AuthContext'
import StudyMaterialsComponent from './study-material'
import SubscriptionComponent from './subscription'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [studyMaterial, setStudyMaterial] = useState<File | null>(null)
  const [previousYearPapers, setPreviousYearPapers] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [numQuestions, setNumQuestions] = useState('')
  const [isClient, setIsClient] = useState(false)

  const { user, userData, isSubscriptionActive, daysLeftInSubscription, refreshUserData, logout } = useAuth()
  const router = useRouter()

  const studyMaterialRef = useRef<HTMLInputElement>(null)
  const previousYearPapersRef = useRef<HTMLInputElement>(null)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GraduationCap size={24} />, label: 'Study Materials', path: '/study_materials' },
    { icon: <FileText size={24} />, label: 'Subscription', path: '/subscription' },
    { icon: <BarChart2 size={24} />, label: 'Performance Analysis', locked: true },
  ]

  useEffect(() => {
    setIsClient(true)
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>, fileType: 'studyMaterial' | 'previousYearPapers') => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        if (fileType === 'studyMaterial') {
          setStudyMaterial(file)
        } else {
          setPreviousYearPapers(file)
        }
        setErrorMessage('')
        await refreshUserData()
      } else {
        setErrorMessage('Please upload only PDF or DOCX files.')
      }
    } else {
      setErrorMessage('No file selected.')
    }
  }

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click()
  }

  const handleSidebarItemClick = (item: string, path?: string) => {
    setActiveItem(item)
    if (path && isClient) {
      router.push(path)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
      setErrorMessage('Logout failed. Please try again.')
    }
  }

  const TrialStatus = () => {
    if (isSubscriptionActive && !isNaN(daysLeftInSubscription) && daysLeftInSubscription > 0) {
      return (
        <div className={cn(
          "flex items-center mb-6 p-2 bg-blue-50",
          isSidebarOpen ? "mx-4 justify-start" : "mx-2 justify-center"
        )}>
          <Clock size={24} className="text-blue-600 mr-2" />
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-semibold">Days remaining</span>
              <span className="text-sm text-blue-600">
                {daysLeftInSubscription} day{daysLeftInSubscription !== 1 ? 's' : ''} left
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const renderDashboardContent = () => (
    <div className="relative">
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
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Question Generator Box */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className={`${playfair.className} text-xl font-semibold mb-4`}>Question Generator</h3>
              <div className="flex flex-col space-y-3">
                <input
                  type="file"
                  ref={studyMaterialRef}
                  onChange={(e) => handleFileUpload(e, 'studyMaterial')}
                  accept=".pdf,.docx"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => triggerFileInput(studyMaterialRef)}
                >
                  <Upload className="mr-2" size={18} />
                  {studyMaterial ? studyMaterial.name : 'Upload Study Material'}
                </Button>
                
                <input
                  type="file"
                  ref={previousYearPapersRef}
                  onChange={(e) => handleFileUpload(e, 'previousYearPapers')}
                  accept=".pdf,.docx"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => triggerFileInput(previousYearPapersRef)}
                >
                  <Upload className="mr-2" size={18} />
                  {previousYearPapers ? previousYearPapers.name : 'Upload Previous Year Papers (Optional)'}
                </Button>
                
                <Input 
                  type="number" 
                  placeholder="Number of questions" 
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  required 
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileQuestion className="mr-1" size={14} />
                    Subjective
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Brain className="mr-1" size={14} />
                    MCQ
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <PenTool className="mr-1" size={14} />
                    Important
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  disabled={!studyMaterial || !numQuestions || !isSubscriptionActive}
                >
                  Generate Questions {isSubscriptionActive ? `(${daysLeftInSubscription} day${daysLeftInSubscription !== 1 ? 's' : ''} left)` : '(Subscription expired)'}
                </Button>
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Box */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow relative">
            <CardContent className="p-6">
              <Lock className="absolute top-4 right-4 text-gray-400" size={20} />
              <h3 className={`${playfair.className} text-xl font-semibold mb-4`}>Take a Test</h3>
              <p className="mb-4">Ready to challenge yourself? Start a test based on the generated questions.</p>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full blur-sm pointer-events-none">Start Test</Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analysis Box */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow mb-8 relative">
          <CardContent className="p-6">
            <Lock className="absolute top-4 right-4 text-gray-400" size={20} />
            <h3 className={`${playfair.className} text-xl font-semibold mb-4`}>Performance Analysis</h3>
            <div className="w-full blur-sm grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">85%</p>
                <p className="text-xs text-gray-600">Avg. Score</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{userData?.questionsGenerated || 0}</p>
                <p className="text-xs text-gray-600">Questions Generated</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">{userData?.studyTimeHours || 0}h</p>
                <p className="text-xs text-gray-600">Study Time</p>
              </div>
            </div>
            <Button variant="outline" className="w-full blur-sm pointer-events-none">View Detailed Analysis</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    if (!isClient) return null
    switch (activeItem) {
      case 'Study Materials':
        return <StudyMaterialsComponent />
      case 'Subscription':
        return <SubscriptionComponent />
      default:
        return renderDashboardContent()
    }
  }

  return (
    <div className={`${inter.className} flex h-screen bg-gray-50 text-gray-800 relative overflow-hidden`}>
      {/* Sidebar */}
      <aside className={cn(
        "bg-white text-gray-800 transition-all duration-300 ease-in-out z-20 border-r border-gray-200 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex items-center justify-between p-6">
          <div className={cn("flex items-center", isSidebarOpen ? "" : "justify-center w-full")}>
            <Avatar className="w-10 h-10 cursor-pointer" onClick={toggleSidebar}>
              <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
              <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && <h1 className={`${playfair.className} text-xl font-bold ml-3`}>ExamVault</h1>}
          </div>
        </div>

        <TrialStatus />

        <nav className="mt-6 flex-grow">
          {sidebarItems.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center mb-4 p-2 rounded transition-colors cursor-pointer",
                isSidebarOpen ? "mx-4" : "mx-2 justify-center",
                activeItem === item.label ? "bg-blue-600 text-white" : "hover:bg-gray-100",
                item.locked && "pointer-events-none"
              )}
              onClick={() => handleSidebarItemClick(item.label, item.path)}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-2">{item.label}</span>}
              {item.locked && <Lock className="ml-2 text-gray-400" size={16} />}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div 
          className={cn(
            "p-4 cursor-pointer hover:bg-gray-100 transition-colors mt-auto border-t border-gray-200",
            isSidebarOpen ? "mx-4 mb-4 rounded flex items-center" : "mx-2 mb-4 flex justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut size={24} className="text-gray-600" />
          {isSidebarOpen && <span className="ml-2">Logout</span>}
        </div>
      </aside>


      {/* Main content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Greeting section */}
        <div className="bg-gray-100 py-12 mb-8">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className={`${playfair.className} text-3xl font-bold mb-1`}>
              {activeItem === 'Study Materials' ? 'Your Study Materials' : 
               activeItem === 'Subscription' ? 'Plan & Billing' :
               `Welcome, ${user?.displayName || 'User'}`}
            </h2>
            {activeItem === 'Dashboard' && (
              <p className="text-gray-600">
                {!isSubscriptionActive 
                  ? 'Your trial has expired. Please upgrade to continue.'
                  : `You have ${!isNaN(daysLeftInSubscription) ? daysLeftInSubscription : 'an active'} trial. Let's enhance your learning experience today!`}
              </p>
            )}
          </div>
        </div>

        {/* Trial expiration warning */}
        {isSubscriptionActive && !isNaN(daysLeftInSubscription) && daysLeftInSubscription === 1 && (
          <div className="max-w-7xl mx-auto px-8 mb-4">
            <Alert variant="destructive">
              <AlertDescription>
                Your trial expires tomorrow! Don not forget to upgrade your subscription to maintain access.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(DashboardComponent), { ssr: false })