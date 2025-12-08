'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/types'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface LevelUpModalProps {
    isOpen: boolean
    onClose: () => void
    badge: Badge
}

export default function LevelUpModal({ isOpen, onClose, badge }: LevelUpModalProps) {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            }

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                        className="relative w-full max-w-md bg-card border rounded-xl shadow-2xl p-8 text-center overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/20">
                                <badge.icon className="w-24 h-24 text-primary" />
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold font-headline mb-2"
                        >
                            Level Up!
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-muted-foreground mb-6"
                        >
                            You've reached <span className="text-primary font-bold">{badge.name}</span> rank!
                        </motion.p>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm text-muted-foreground mb-8"
                        >
                            {badge.description}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button size="lg" onClick={onClose} className="w-full font-bold text-lg">
                                Continue Learning
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
