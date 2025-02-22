/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Section } from "@/components/section";
import { easeInOutCubic } from "@/lib/animation";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <Section id="hero" className="min-h-[100vh] w-full overflow-hidden">
      <main className="lg:pt-15 relative mx-auto px-4 pt-16 text-center sm:pt-24 md:pt-32">
        <div className="relative">
          <motion.div
            initial={{ scale: 4.5, height: "80vh" }}
            animate={{ scale: 1, height: "10vh" }}
            transition={{
              scale: { delay: 0, duration: 1.8, ease: easeInOutCubic },
              height: { delay: 0, duration: 1.8, ease: easeInOutCubic },
            }}
            className="relative z-20 mb-8"
            style={{ transformOrigin: "top" }}
          >
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-black p-4 dark:bg-white">
              <div className="relative h-full w-full">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto my-4 max-w-7xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
            className="mb-8 text-6xl font-bold tracking-tighter sm:text-7xl lg:text-8xl"
          >
            Your Calendar,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Supercharged with AI
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
            className="mx-auto mb-12 max-w-3xl text-balance text-2xl font-medium text-muted-foreground sm:text-3xl"
          >
            Stop managing your calendar. Let AI optimize your day, automate your
            scheduling, and help you get more done.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <a
              href="/dash"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Get Started Free
              <svg
                className="h-6 w-6 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-xl font-semibold transition-colors hover:bg-muted"
            >
              Watch Demo
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-6xl rounded-2xl bg-muted p-2 shadow-2xl"
          >
            <Image
              src="/dash.png"
              alt="AI Calendar Interface"
              width={1200}
              height={675}
              className="rounded-xl"
              priority
            />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
              AI-Powered Calendar Interface
            </div>
          </motion.div>
        </div>
      </main>
    </Section>
  );
}
