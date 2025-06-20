import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Features - AI FAQ Assistant",
  description: "Explore the features of our AI FAQ Assistant",
}

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-starfield text-moonlight">
      {/* Header is shared with main page */}

      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-moonlight sm:text-4xl sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
            Features
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mb-4">
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
                  className="text-stellar"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-moonlight">Instant Answers</h2>
              <p className="text-nebula">
                Get immediate responses to your questions without having to search through multiple sources. Our AI
                provides concise, accurate information in seconds.
              </p>
            </div>

            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mb-4">
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
                  className="text-stellar"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-moonlight">Secure & Private</h2>
              <p className="text-nebula">
                Your conversations are private and secure. We don&apos;t store personal data or share your questions with
                third parties. Use our assistant with complete peace of mind.
              </p>
            </div>

            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mb-4">
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
                  className="text-stellar"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 18v-6"></path>
                  <path d="M8 18v-1"></path>
                  <path d="M16 18v-3"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-moonlight">Topic Flexibility</h2>
              <p className="text-nebula">
                Our AI assistant can answer questions on a wide range of topics, from science and technology to history,
                arts, and more. Simply change the topic to get specialized responses.
              </p>
            </div>

            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mb-4">
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
                  className="text-stellar"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  <path d="M19 3v4"></path>
                  <path d="M23 7h-4"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-moonlight">24/7 Availability</h2>
              <p className="text-nebula">
                Access our AI assistant anytime, day or night. Get answers to your questions whenever you need them,
                without waiting for business hours or customer service representatives.
              </p>
            </div>
          </div>

          <div className="border border-meteor/50 rounded-lg overflow-hidden bg-meteor/30 backdrop-blur-sm mb-12">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-moonlight sm:text-xl sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
                Advanced Capabilities
              </h2>
              <p className="text-nebula mb-6">
                Our AI FAQ Assistant goes beyond simple question-answering with these advanced features:
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mr-3 mt-1">
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
                      className="text-stellar"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-moonlight">Conversation Memory</h3>
                    <p className="text-nebula">
                      The assistant remembers your previous questions within a session, allowing for more natural,
                      contextual conversations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mr-3 mt-1">
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
                      className="text-stellar"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-moonlight">Topic Suggestions</h3>
                    <p className="text-nebula">
                      Get recommendations for popular topics to explore, helping you discover new areas of interest.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mr-3 mt-1">
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
                      className="text-stellar"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-moonlight">Response Feedback</h3>
                    <p className="text-nebula">
                      Provide feedback on answers to help improve the system and get better responses in the future.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mr-3 mt-1">
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
                      className="text-stellar"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-moonlight">Copy & Share</h3>
                    <p className="text-nebula">
                      Easily copy responses or share entire conversations with others with just a click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-cosmic hover:bg-cosmic/80 text-moonlight rounded-full border border-cosmic/50 hover:shadow-neon-sm transition-all duration-300"
            >
              Try the AI Assistant Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer is shared with main page */}
      <footer className="border-t border-meteor/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-nebula">
          <p>© {new Date().getFullYear()} AI FAQ Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
