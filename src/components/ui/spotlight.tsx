'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import type { MouseEvent, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export function Spotlight({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        'group relative w-full h-full',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              hsla(var(--primary), 0.2),
              transparent 60%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              hsla(var(--primary), 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}
