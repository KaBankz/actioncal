"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import Image from "next/image";

export function Vision() {
  return (
    <Section id="vision" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Day, <span className="text-primary">Optimized</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-xl">
            Watch your calendar transform throughout the day with contextual
            views and AI-powered insights that help you stay focused on what
            matters most.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold">Morning Focus</h3>
            <p className="text-muted-foreground mt-4">
              Start your day with a clear view of your most important tasks. AI
              analyzes your calendar patterns to protect your peak productivity
              hours and automatically blocks focus time.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Intelligent meeting scheduling around your focus periods",
                "Context-aware task prioritization",
                "Automated buffer time for deep work",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="flex items-center gap-3"
                >
                  <svg
                    className="text-primary h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="from-primary/10 absolute inset-0 rounded-2xl bg-gradient-to-r to-purple-400/10" />
            <Image
              src="/morning-focus.png"
              alt="Morning Focus Interface"
              width={600}
              height={400}
              className="relative rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 rounded-2xl bg-black p-8 text-center text-white dark:bg-white dark:text-black"
        >
          <h3 className="text-3xl font-bold">Ready to transform your day?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Join thousands of professionals who are already using AI to optimize
            their calendar and boost their productivity.
          </p>
          <a
            href="#"
            className="bg-primary hover:bg-primary/90 mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xl font-semibold text-white transition-all"
          >
            Get Started Free
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
