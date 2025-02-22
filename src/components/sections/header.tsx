/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { MobileDrawer } from "@/components/mobile-drawer";
import { buttonVariants } from "@/components/ui/button";
import { easeInOutCubic } from "@/lib/animation";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [addBorder, setAddBorder] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY);
      setAddBorder(currentScrollY > 20);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Set isInitialLoad to false after the component has mounted
    setIsInitialLoad(false);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    controls.start(isVisible ? "visible" : "hidden");
  }, [isVisible, controls]);

  const headerVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={headerVariants}
          transition={{
            duration: isInitialLoad ? 1 : 0.3,
            delay: isInitialLoad ? 0.5 : 0,
            ease: easeInOutCubic,
          }}
          className={cn("sticky top-0 z-50 bg-background/60 p-0 backdrop-blur")}
        >
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              title="brand-logo"
              className="relative mr-8 flex items-center space-x-4"
            >
              <span className="text-2xl font-bold">{siteConfig.name}</span>
            </Link>
            <div className="hidden lg:block">
              <Link
                href="/dash"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "group h-12 rounded-full px-8 text-lg text-primary-foreground",
                )}
              >
                {siteConfig.ctaSeller}
              </Link>
            </div>
            <div className="mt-2 block cursor-pointer lg:hidden">
              <MobileDrawer />
            </div>
          </div>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: addBorder ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bottom-0 w-full"
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
