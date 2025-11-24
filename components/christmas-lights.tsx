"use client"

import { motion } from "framer-motion"

export default function ChristmasLights() {
  const lights = [
    { color: "#ff0000", delay: 0 },
    { color: "#00ff00", delay: 0.2 },
    { color: "#ffff00", delay: 0.4 },
    { color: "#0000ff", delay: 0.6 },
    { color: "#ff00ff", delay: 0.8 },
    { color: "#ff0000", delay: 1.0 },
    { color: "#00ff00", delay: 1.2 },
    { color: "#ffff00", delay: 1.4 },
  ]

  return (
    <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-start z-10 pointer-events-none">
      {/* Wire */}
      <div className="absolute top-2 left-0 right-0 h-0.5 bg-[#0f3d2e]/30" />

      {/* Lights */}
      {lights.map((light, index) => (
        <div key={index} className="relative">
          {/* Wire connection */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-[#0f3d2e]/30" />

          {/* Light bulb */}
          <motion.div
            className="w-4 h-6 rounded-full relative top-5"
            style={{
              backgroundColor: light.color,
              boxShadow: `0 0 10px ${light.color}`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [`0 0 5px ${light.color}`, `0 0 20px ${light.color}`, `0 0 5px ${light.color}`],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: light.delay,
            }}
          />
        </div>
      ))}
    </div>
  )
}
