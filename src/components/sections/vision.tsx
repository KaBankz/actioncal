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
            Your Day,{" "}
            <span className="text-primary">Intelligently Organized</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Experience a calendar that learns from your habits, anticipates your
            needs, and provides smart recommendations to make every day more
            productive.
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
            <h3 className="text-3xl font-bold">AI-Powered Insights</h3>
            <p className="mt-4 text-muted-foreground">
              Our AI analyzes your calendar patterns to optimize your schedule,
              protect your focus time, and provide contextual recommendations
              for every event - from meeting preparations to workout routines.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Smart scheduling that respects your focus time",
                "Contextual video suggestions for better preparation",
                "Real-time weather updates and travel recommendations",
                "Intelligent event cards with relevant information",
                "Automated meeting scheduling and coordination",
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
                    className="h-5 w-5 text-primary"
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
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-400/10" />
            <Image
              src="/morning-focus.png"
              alt="AI Calendar Interface"
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
          <h3 className="text-3xl font-bold">
            Ready to transform your calendar?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Join thousands of professionals who are using AI to optimize their
            schedule, boost productivity, and make better use of their time.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground transition-all hover:bg-primary/90"
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
