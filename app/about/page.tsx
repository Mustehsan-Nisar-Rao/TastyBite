import Image from "next/image"
import { Heart, Users, Award, Clock, GraduationCap, Lightbulb } from "lucide-react"

// Team member data
const teamMembers = [
  {
    name: "Maria Chen",
    title: "Founder & Recipe Developer",
    image: "/placeholder.svg?height=200&width=200",
    bio: "A self-taught cook with a background in food science, Maria is passionate about demystifying cooking techniques and making delicious food accessible to everyone.",
  },
  {
    name: "Thomas Wright",
    title: "Head Chef",
    image: "/placeholder.svg?height=200&width=200",
    bio: "With 15 years of professional cooking experience in restaurants across Europe and Asia, Thomas brings technical expertise and global flavor knowledge to our recipe development.",
  },
  {
    name: "Elena Rodriguez",
    title: "Food Photographer & Stylist",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Elena has an eye for composition and lighting that makes our recipes look as good as they taste. She's also our resident baker, specializing in pastries and desserts.",
  },
]

// Core values data
const coreValues = [
  {
    title: "Passion for Food",
    description:
      "We believe cooking is an act of love and creativity that brings people together and nourishes both body and soul.",
    icon: <Heart className="h-8 w-8 text-amber-600" />,
  },
  {
    title: "Inclusivity",
    description:
      "Our recipes are designed for cooks of all skill levels, backgrounds, and dietary needs, with no assumptions about prior knowledge.",
    icon: <Users className="h-8 w-8 text-amber-600" />,
  },
  {
    title: "Quality",
    description:
      "Every recipe is meticulously tested multiple times in home kitchens to ensure consistent, excellent results.",
    icon: <Award className="h-8 w-8 text-amber-600" />,
  },
  {
    title: "Practicality",
    description:
      "We respect your time and resources with recipes that are realistic for everyday cooking and use accessible ingredients.",
    icon: <Clock className="h-8 w-8 text-amber-600" />,
  },
  {
    title: "Education",
    description:
      "We're committed to helping you develop your culinary skills and confidence through clear explanations and helpful tips.",
    icon: <GraduationCap className="h-8 w-8 text-amber-600" />,
  },
  {
    title: "Innovation",
    description:
      "We continuously explore new flavors, techniques, and cooking approaches while honoring culinary traditions.",
    icon: <Lightbulb className="h-8 w-8 text-amber-600" />,
  },
]

// Testimonials data
const testimonials = [
  {
    quote:
      "TastyBites has completely transformed how I cook. The detailed instructions and tips helped me go from burning pasta to confidently hosting dinner parties. I've never had a recipe fail from this site!",
    name: "Sarah J.",
    location: "Home Cook, NYC",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    quote:
      "As someone with celiac disease, finding trustworthy gluten-free recipes that actually taste good is a challenge. TastyBites' special diet section has been a game-changer for me and my family.",
    name: "Marcus T.",
    location: "Gluten-Free Cook, Portland",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    quote:
      "I'm teaching my teenage kids to cook using TastyBites recipes. The step-by-step photos and clear instructions are perfect for beginners, and everything we've made has been delicious!",
    name: "Lisa M.",
    location: "Parent & Home Cook, Chicago",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4 text-amber-900 text-sm font-medium uppercase tracking-wider">About Us</div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Our Story & Mission</h1>
          <p className="text-amber-900 text-lg mb-8 max-w-3xl mx-auto">
            Discover how TastyBites was born from a passion for making cooking accessible, enjoyable, and delicious for
            everyone, regardless of skill level.
          </p>
        </div>
      </section>

      {/* How It All Started */}
      <section className="bg-amber-200 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-amber-900 mb-6">How It All Started</h2>
              <div className="space-y-4 text-amber-800">
                <p>
                  TastyBites began in 2018 in a small apartment kitchen, where our founder Maria was struggling to find
                  approachable, reliable recipes that didn't require professional training or expensive ingredients.
                </p>
                <p>
                  After countless burnt dinners and recipe disasters, she realized the problem wasn't her cooking
                  skills—it was the recipes themselves. They were often written by professional chefs who took basic
                  skills for granted, or they skipped crucial details that make the difference between success and
                  failure.
                </p>
                <p>
                  Maria teamed up with chef Thomas and food photographer Elena to create TastyBites—a platform where
                  recipes are developed with home cooks in mind, tested multiple times in real home kitchens, and
                  explained in detail so that anyone, regardless of experience, can create delicious meals with
                  confidence.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="People cooking in a kitchen"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-4">Our Core Values</h2>
          <p className="text-center text-amber-900 mb-12 max-w-3xl mx-auto">
            These principles guide everything we do at TastyBites, from recipe development to community engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-amber-200 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">{value.title}</h3>
                <p className="text-amber-800">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="bg-amber-200 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-4">Meet Our Team</h2>
          <p className="text-center text-amber-900 mb-12 max-w-3xl mx-auto">
            The passionate food enthusiasts behind TastyBites who work tirelessly to bring you delicious, foolproof
            recipes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 mx-auto w-48 h-48 relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-4 border-amber-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-amber-900">{member.name}</h3>
                <p className="text-amber-600 mb-3">{member.title}</p>
                <p className="text-amber-800">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Community Says */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-4">What Our Community Says</h2>
          <p className="text-center text-amber-900 mb-12 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what home cooks have to say about their TastyBites experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-amber-200 rounded-lg p-6 shadow-md">
                <p className="text-amber-800 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 relative mr-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900">{testimonial.name}</p>
                    <p className="text-amber-700 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
