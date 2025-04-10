import { animations, Animation } from "@/data/animations"
import { motion } from "framer-motion" // Assuming you have framer-motion installed

interface AnimationGridProps {
  selectedAnimation: string | null
  onSelectAnimation: (animationId: string) => void
}

export default function AnimationGrid({
  selectedAnimation,
  onSelectAnimation,
}: AnimationGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
      {animations.map((animation) => (
        <AnimationCard
          key={animation.id}
          animation={animation}
          isSelected={selectedAnimation === animation.id}
          onSelect={() => onSelectAnimation(animation.id)}
        />
      ))}
    </div>
  )
}

interface AnimationCardProps {
  animation: Animation
  isSelected: boolean
  onSelect: () => void
}

function AnimationCard({ animation, isSelected, onSelect }: AnimationCardProps) {

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`
        rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent hover:border-gray-300'}
      `}
      onClick={onSelect}
    >
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
        {/* You can replace with actual thumbnails */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-bold">{animation.title}</div>
        </div>
        
        {/* Uncomment when you have actual thumbnails */}
        {/* <Image
          src={animation.thumbnail}
          alt={animation.title}
          fill
          className="object-cover"
        /> */}
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-900">
        <h3 className="font-medium text-lg mb-1">{animation.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {animation.description}
        </p>
        
        {isSelected && (
          <div className="mt-3 text-sm font-medium text-blue-600">
            ✓ Selected
          </div>
        )}
      </div>
    </motion.div>
  )
}