"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme: handle system theme and SSR
  const currentTheme = mounted 
    ? (theme === "system" ? systemTheme : theme) 
    : "dark";

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = useMemo(() => {
    // In light mode, use subtle primary color gradients
    // In dark mode, use white gradients for the animation effect
    if (currentTheme === "dark") {
      return {
        TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
        LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
        BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
        RIGHT: "radial-gradient(16.2% 41.199999999999996% at 100% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
      };
    } else {
      // Light mode: use darker orange/primary color gradients for better visibility
      return {
        TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(249, 115, 22, 0.85) 0%, rgba(249, 115, 22, 0) 100%)",
        LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(249, 115, 22, 0.85) 0%, rgba(249, 115, 22, 0) 100%)",
        BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, rgba(249, 115, 22, 0.85) 0%, rgba(249, 115, 22, 0) 100%)",
        RIGHT: "radial-gradient(16.2% 41.199999999999996% at 100% 50%, rgba(249, 115, 22, 0.85) 0%, rgba(249, 115, 22, 0) 100%)",
      };
    }
  }, [currentTheme]);

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #f97316 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);
  
  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-background/50 hover:bg-background/30 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto z-10 px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-background absolute z-[1] flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}

