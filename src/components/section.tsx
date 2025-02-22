"use client";

import { easeInOutCubic } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { forwardRef, useRef } from "react";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export const Section = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    id: string;
    title?: string;
    subtitle?: string;
  }
>(({ className, children, id, title, subtitle, ...props }, ref) => {
  return (
    <section
      id={id}
      ref={ref}
      className={cn("py-[3.1rem] relative", className)}
      {...props}
    >
      <div className="max-w-[1790px] mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-24">
            {title && (
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
});

Section.displayName = "Section";
