import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-100 py-12">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Privacy Policy</h1>

          <div className="prose prose-amber max-w-none">
            <p>Last Updated: May 5, 2025</p>

            <h2>Introduction</h2>
            <p>
              At TastyBites, we respect your privacy and are committed to protecting your personal data. This privacy
              policy will inform you about how we look after your personal data when you visit our website and tell you
              about your privacy rights and how the law protects you.
            </p>

            <h2>The Data We Collect About You</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped
              together as follows:
            </p>
            <ul>
              <li>Identity Data includes first name, last name, username or similar identifier.</li>
              <li>Contact Data includes email address and telephone numbers.</li>
              <li>
                Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and
                location, browser plug-in types and versions, operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
              <li>Usage Data includes information about how you use our website, products and services.</li>
              <li>
                Marketing and Communications Data includes your preferences in receiving marketing from us and our third
                parties and your communication preferences.
              </li>
            </ul>

            <h2>How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>
                Where it is necessary for our legitimate interests (or those of a third party) and your interests and
                fundamental rights do not override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
              personal data to those employees, agents, contractors and other third parties who have a business need to
              know.
            </p>

            <h2>Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including:
            </p>
            <ul>
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>

            <h2>Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
            <p>
              Email: privacy@tastybites.com
              <br />
              Phone: (555) 123-4567
              <br />
              Address: 123 Culinary Avenue, Foodie District, New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
