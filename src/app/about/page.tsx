import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - AI FAQ Assistant",
  description: "Learn more about our AI FAQ Assistant and how it works",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-starfield text-moonlight">
      {/* Header is shared with main page */}

      {/* Main content */}
      <main className="flex-1 container mx-auto py-6 px-2 sm:py-12 sm:px-4">
        <div className="max-w-full sm:max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-aurora via-stellar to-cosmic bg-clip-text text-transparent">
            About AI FAQ Assistant
          </h1>
          <div className="space-y-4 sm:space-y-8">
            <section className="border border-meteor/50 rounded-lg p-3 sm:p-6 bg-meteor/30 backdrop-blur-sm">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-moonlight">Our Mission</h2>
              <p className="text-nebula mb-2 sm:mb-4 text-sm sm:text-base">
                AI FAQ Assistant was created to democratize access to information through the power of artificial
                intelligence. We believe that everyone should have instant access to accurate, helpful answers to their
                questions, regardless of their technical expertise.
              </p>
              <p className="text-nebula text-sm sm:text-base">
                Our platform leverages cutting-edge AI technology to provide instant, relevant responses to your
                questions across a wide range of topics, from science and technology to arts and humanities.
              </p>
            </section>
            <section className="border border-meteor/50 rounded-lg p-3 sm:p-6 bg-meteor/30 backdrop-blur-sm">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-moonlight">How It Works</h2>
              <p className="text-nebula mb-2 sm:mb-4 text-sm sm:text-base">
                Our AI FAQ Assistant uses advanced natural language processing to understand your questions and generate
                helpful, accurate responses in real-time. The system is constantly learning and improving based on user
                interactions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-6">
                <div className="border border-meteor/70 rounded-lg p-3 sm:p-4 bg-meteor/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cosmic/30 flex items-center justify-center mb-2 sm:mb-3">
                    <span className="text-moonlight font-bold">1</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-moonlight">Ask a Question</h3>
                  <p className="text-xs sm:text-sm text-nebula">
                    Type your question in natural language, just as you would ask a human expert.
                  </p>
                </div>
                <div className="border border-meteor/70 rounded-lg p-3 sm:p-4 bg-meteor/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cosmic/30 flex items-center justify-center mb-2 sm:mb-3">
                    <span className="text-moonlight font-bold">2</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-moonlight">AI Processing</h3>
                  <p className="text-xs sm:text-sm text-nebula">
                    Our AI analyzes your question, searches its knowledge base, and formulates a response.
                  </p>
                </div>
                <div className="border border-meteor/70 rounded-lg p-3 sm:p-4 bg-meteor/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cosmic/30 flex items-center justify-center mb-2 sm:mb-3">
                    <span className="text-moonlight font-bold">3</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-moonlight">Instant Answer</h3>
                  <p className="text-xs sm:text-sm text-nebula">
                    Receive a clear, concise answer tailored to your specific question within seconds.
                  </p>
                </div>
              </div>
            </section>
            <section className="border border-meteor/50 rounded-lg p-3 sm:p-6 bg-meteor/30 backdrop-blur-sm">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-moonlight">Our Technology</h2>
              <p className="text-nebula mb-2 sm:mb-4 text-sm sm:text-base">
                The AI FAQ Assistant is powered by state-of-the-art large language models that have been trained on
                diverse datasets to ensure broad knowledge coverage and accurate responses.
              </p>
              <p className="text-nebula text-sm sm:text-base">
                We continuously update our models and fine-tune them based on user feedback to improve accuracy,
                relevance, and helpfulness of responses across all topics.
              </p>
            </section>
            <div className="flex justify-center mt-4 sm:mt-8">
              <Link
                href="/"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-cosmic hover:bg-cosmic/80 text-moonlight rounded-full border border-cosmic/50 hover:shadow-neon-sm transition-all duration-300 text-sm sm:text-base"
              >
                Try the AI Assistant Now
              </Link>
            </div>
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
