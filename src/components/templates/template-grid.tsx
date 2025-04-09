import type { Template } from "@/types"
import TemplateCard from "./template-card"

interface TemplateGridProps {
  templates: Template[]
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}

