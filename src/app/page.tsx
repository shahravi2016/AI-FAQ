import type { Metadata } from "next"
import Link from "next/link"
import ChatInterface from "@/components/chat-interface"

export const metadata: Metadata = {
  title: "AI FAQ Assistant",
  description: "Get instant answers to your questions about any topic",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-starfield text-moonlight">
      {/* Enhanced Header/Menu Bar */}
      <header className="border-b border-meteor/50 backdrop-blur-sm bg-starfield/80 sticky top-0 z-10">
        <div className="container mx-auto py-3 px-2 sm:py-4 sm:px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora to-stellar flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-moonlight"
                >
                  <path d="M21 12.7a9 9 0 1 1-2.1-5.8"></path>
                  <path d="M9 17l6-6"></path>
                  <path d="M9 11l6 6"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold mb-4 text-moonlight sm:text-2xl sm:bg-gradient-to-r sm:from-aurora sm:to-stellar sm:bg-clip-text sm:text-transparent animate-text-shimmer">
                AI FAQ Assistant
              </h1>
            </div>

            <nav className="hidden md:block">
              <ul className="flex gap-4 md:gap-6">
                <li>
                  <Link href="/" className="text-nebula hover:text-aurora transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-nebula hover:text-aurora transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                    </svg>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-nebula hover:text-aurora transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-nebula hover:text-aurora transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <circle cx="12" cy="10" r="2"></circle>
                      <line x1="8" x2="8" y1="2" y2="4"></line>
                      <line x1="16" x2="16" y1="2" y2="4"></line>
                    </svg>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="md:hidden text-nebula hover:text-aurora">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-4 px-2 sm:py-8 sm:px-4">
        <div className="max-w-full sm:max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold mb-2 text-moonlight sm:text-3xl sm:mb-4 sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
              Your AI Knowledge Assistant
            </h2>
            <p className="text-nebula mb-4 sm:mb-6 text-sm sm:text-base">
              Get instant, accurate answers to all your questions about any topic. Powered by advanced AI to help you
              find the information you need.
            </p>
          </div>

          <ChatInterface defaultTopic="artificial intelligence" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-meteor/50 py-4 sm:py-6">
        <div className="container mx-auto px-2 sm:px-4 text-center text-xs sm:text-sm text-nebula">
          <p>© {new Date().getFullYear()} AI FAQ Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
