import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - AI FAQ Assistant",
  description: "Get in touch with the AI FAQ Assistant team",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-starfield text-moonlight">
      {/* Header is shared with main page */}

      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-moonlight sm:text-4xl sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-moonlight sm:text-2xl sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
                Get In Touch
              </h2>
              <p className="text-nebula mb-6">
                Have questions, feedback, or suggestions? We&apos;d love to hear from you! Fill out the form and our team
                will get back to you as soon as possible.
              </p>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-nebula mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-md border border-meteor/70 bg-meteor/50 text-moonlight placeholder-nebula/70 focus:outline-none focus:ring-1 focus:ring-stellar/50 focus:border-stellar"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-nebula mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-meteor/70 bg-meteor/50 text-moonlight placeholder-nebula/70 focus:outline-none focus:ring-1 focus:ring-stellar/50 focus:border-stellar"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-nebula mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 rounded-md border border-meteor/70 bg-meteor/50 text-moonlight placeholder-nebula/70 focus:outline-none focus:ring-1 focus:ring-stellar/50 focus:border-stellar"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-nebula mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 rounded-md border border-meteor/70 bg-meteor/50 text-moonlight placeholder-nebula/70 focus:outline-none focus:ring-1 focus:ring-stellar/50 focus:border-stellar"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-cosmic hover:bg-cosmic/80 text-moonlight rounded-md border border-cosmic/50 hover:shadow-neon-sm transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="border border-meteor/50 rounded-lg p-6 bg-meteor/30 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-moonlight sm:text-2xl sm:bg-gradient-to-r sm:from-aurora sm:via-stellar sm:to-cosmic sm:bg-clip-text sm:text-transparent">
                Connect With Us
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-moonlight">Email</h3>
                  <p className="text-nebula flex items-center">
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
                      className="mr-2 text-stellar"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    ravirshah0612@gmail.com
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-moonlight">Social Media</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-nebula hover:text-stellar transition-colors">
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
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-nebula hover:text-stellar transition-colors">
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
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href="#" className="text-nebula hover:text-stellar transition-colors">
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
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-nebula hover:text-stellar transition-colors">
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
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-moonlight">FAQ</h3>
                  <p className="text-nebula mb-4">
                    Check out our frequently asked questions for quick answers to common inquiries.
                  </p>
                  <a href="#" className="inline-flex items-center text-aurora hover:text-stellar transition-colors">
                    View FAQ
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
                      className="ml-1"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </a>
                </div>
              </div>
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
