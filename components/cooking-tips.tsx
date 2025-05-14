import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const tips = [
  {
    id: 1,
    title: "Perfect Rice",
    content: "Use a 1:2 ratio of rice to water for perfect fluffy rice every time.",
    link: "/blog/perfect-rice-cooking-guide",
  },
  {
    id: 2,
    title: "Cooking Pasta",
    content: "Salt your pasta water until it tastes like the sea for the best flavor.",
    link: "/blog/pasta-cooking-techniques",
  },
  {
    id: 3,
    title: "Knife Skills",
    content: "Keep your knives sharp - dull knives are more dangerous than sharp ones.",
    link: "/blog/essential-knife-skills",
  },
]

export default function CookingTips() {
  return (
    <div className="bg-amber-200 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Cooking Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Link key={tip.id} href={tip.link}>
              <Card className="border-amber-300 h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{tip.title}</h3>
                  <p className="text-amber-800">{tip.content}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
