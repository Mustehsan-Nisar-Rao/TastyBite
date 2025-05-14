import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-amber-100 py-12">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Terms of Service</h1>

          <div className="prose prose-amber max-w-none">
            <p>Last Updated: May 5, 2025</p>

            <h2>Introduction</h2>
            <p>
              Welcome to TastyBites. These terms and conditions outline the rules and regulations for the use of our
              website.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use
              TastyBites if you do not accept all of the terms and conditions stated on this page.
            </p>

            <h2>License</h2>
            <p>
              Unless otherwise stated, TastyBites and/or its licensors own the intellectual property rights for all
              material on TastyBites. All intellectual property rights are reserved. You may view and/or print pages
              from TastyBites for your own personal use subject to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul>
              <li>Republish material from TastyBites</li>
              <li>Sell, rent or sub-license material from TastyBites</li>
              <li>Reproduce, duplicate or copy material from TastyBites</li>
              <li>Redistribute content from TastyBites (unless content is specifically made for redistribution)</li>
            </ul>

            <h2>User Comments</h2>
            <p>
              Certain parts of this website offer the opportunity for users to post and exchange opinions, information,
              material and data. TastyBites does not screen, edit, publish or review Comments prior to their appearance
              on the website and Comments do not reflect the views or opinions of TastyBites, its agents or affiliates.
              Comments reflect the view and opinion of the person who posts such view or opinion.
            </p>
            <p>You warrant and represent that:</p>
            <ul>
              <li>
                You are entitled to post the Comments on our website and have all necessary licenses and consents to do
                so;
              </li>
              <li>
                The Comments do not infringe any intellectual property right, including without limitation copyright,
                patent or trademark, or other proprietary right of any third party;
              </li>
              <li>
                The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material
                or material which is an invasion of privacy;
              </li>
              <li>
                The Comments will not be used to solicit or promote business or custom or present commercial activities
                or unlawful activity.
              </li>
            </ul>

            <h2>Hyperlinking to our Content</h2>
            <p>The following organizations may link to our website without prior written approval:</p>
            <ul>
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>
                Online directory distributors when they list us in the directory may link to our website in the same
                manner as they hyperlink to the websites of other listed businesses;
              </li>
              <li>
                Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and
                charity fundraising groups which may not hyperlink to our website.
              </li>
            </ul>

            <h2>Reservation of Rights</h2>
            <p>
              We reserve the right at any time and in its sole discretion to request that you remove all links or any
              particular link to our website. You agree to immediately remove all links to our website upon such
              request. We also reserve the right to amend these terms and conditions and its linking policy at any time.
              By continuing to link to our website, you agree to be bound to and abide by these linking terms and
              conditions.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Email: terms@tastybites.com
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
