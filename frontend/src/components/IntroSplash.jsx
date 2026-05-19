import { useEffect } from 'react'
import { motion } from 'framer-motion'

import introLogo from '../assets/logo.webp'

const MotionDiv = motion.div

function IntroSplash() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <MotionDiv
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-white px-6"
    >
      <div className="flex flex-col items-center text-center">
        <MotionDiv
          initial={{ scale: 0.08, opacity: 0, filter: 'blur(10px)' }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 1.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          <img
            src={introLogo}
            alt="Logo Soccer Dream Fermana"
            className="relative h-[min(72vw,44vh,22rem)] w-[min(72vw,44vh,22rem)] rounded-full object-cover shadow-[0_28px_70px_rgba(31,41,51,0.22)] ring-4 ring-white sm:h-[min(48vw,42vh,24rem)] sm:w-[min(48vw,42vh,24rem)] lg:h-[min(34vw,44vh,28rem)] lg:w-[min(34vw,44vh,28rem)]"
          />
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.55, ease: 'easeOut' }}
          className="mt-6 space-y-2"
        >
          <p className="text-[0.7rem] font-black uppercase tracking-[0.38em] text-primary/80 sm:text-xs">
            ASD
          </p>
          <h1 className="text-xl font-black uppercase tracking-[0.14em] text-text sm:text-3xl">
            Soccer Dream Fermana
          </h1>
          <p className="mx-auto max-w-md text-sm font-medium text-text/65 sm:text-base">
            NON SARA' MAI SOLO UN GIOCO!
          </p>
        </MotionDiv>
      </div>
    </MotionDiv>
  )
}

export default IntroSplash
