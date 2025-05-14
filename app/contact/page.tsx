"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function ContactPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Message sent successfully!")
        // Reset form
        setFormData({
          name: "",
          email: user?.email || "",
          subject: "",
          message: "",
        })
      } else {
        toast.error(data.message || "Failed to send message")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4 text-amber-900 text-sm font-medium uppercase tracking-wider">Contact Us</div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Get in Touch</h1>
          <p className="text-amber-900 text-lg mb-8 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="bg-amber-200 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Our Location</h3>
                    <p className="text-amber-800">123 Culinary Avenue</p>
                    <p className="text-amber-800">Foodie District</p>
                    <p className="text-amber-800">New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Phone Numbers</h3>
                    <p className="text-amber-800">General Inquiries: (555) 123-4567</p>
                    <p className="text-amber-800">Recipe Support: (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Email Addresses</h3>
                    <p className="text-amber-800">General Inquiries: hello@tastybites.com</p>
                    <p className="text-amber-800">Recipe Support: recipes@tastybites.com</p>
                    <p className="text-amber-800">Press & Media: press@tastybites.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Office Hours</h3>
                    <p className="text-amber-800">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-amber-800">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-amber-800">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-amber-900 font-medium">
                      How do I submit a recipe?
                    </AccordionTrigger>
                    <AccordionContent className="text-amber-800">
                      We welcome recipe submissions from our community! Please use the contact form and select "Recipe
                      Submission" as the subject. Our team will review your recipe and get back to you within 5-7
                      business days.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-amber-900 font-medium">
                      Can I request a specific recipe?
                    </AccordionTrigger>
                    <AccordionContent className="text-amber-800">
                      We love hearing what our community wants to cook. Send us your recipe request through the contact
                      form, and our culinary team will consider it for future development.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-amber-900 font-medium">
                      How can I report an issue with a recipe?
                    </AccordionTrigger>
                    <AccordionContent className="text-amber-800">
                      If you encounter any issues with our recipes, please let us know through the contact form. Select
                      "Recipe Support" as the subject and provide as much detail as possible so we can address the
                      problem.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-amber-900 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-amber-900 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      required
                      disabled={!!user}
                    />
                    {user && (
                      <p className="text-sm text-amber-600 mt-1">Using your account email</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-amber-900 mb-2">
                      Subject
                    </label>
                    <Select
                      name="subject"
                      value={formData.subject}
                      onValueChange={(value) => handleChange({ target: { name: "subject", value } })}
                    >
                      <SelectTrigger className="w-full border-amber-300">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="recipe">Recipe Support</SelectItem>
                        <SelectItem value="submission">Recipe Submission</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="press">Press & Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-amber-900 mb-2">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className="w-full min-h-[150px] border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Connect With Us</h3>
                <p className="text-amber-800 mb-4">
                  Follow us on social media for daily recipe inspiration, cooking tips, and behind-the-scenes content.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="bg-amber-100 p-3 rounded-full text-amber-600 hover:bg-amber-300 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link
                    href="#"
                    className="bg-amber-100 p-3 rounded-full text-amber-600 hover:bg-amber-300 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link
                    href="#"
                    className="bg-amber-100 p-3 rounded-full text-amber-600 hover:bg-amber-300 transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link
                    href="#"
                    className="bg-amber-100 p-3 rounded-full text-amber-600 hover:bg-amber-300 transition-colors"
                  >
                    <Youtube className="h-6 w-6" />
                    <span className="sr-only">YouTube</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-4">Find Us</h2>
          <p className="text-center text-amber-900 mb-8">
            Visit our test kitchen and editorial office in the heart of New York City.
          </p>

          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md max-w-4xl mx-auto">
            <div className="h-[300px] relative flex items-center justify-center bg-gray-300">
              {/* This would be replaced with an actual map component in production */}
              <div className="text-center">
                <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-900">TastyBites HQ</h3>
                <p className="text-amber-800">123 Culinary Avenue, Foodie District</p>
                <p className="text-amber-800">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
