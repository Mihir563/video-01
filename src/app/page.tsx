import TemplateGrid from "@/components/templates/template-grid"
import { templates } from "@/data/templates"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 ">
      <section className="mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Select Your Video Template
        </h1>
        <p className="text-lg md:text-xl text-gray-900 dark:text-gray-300 max-w-3xl">
          Choose from our premium collection of video templates to create stunning videos with your images.
        </p>
      </section>

      <TemplateGrid templates={templates} />
    </div>
  )
}

