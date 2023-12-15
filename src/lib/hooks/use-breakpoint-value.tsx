"use client";

import { useContext } from "react";
import resolveConfig from "tailwindcss/resolveConfig";

import { WindowSizeContext } from "~/lib/context";
import tailwindConfig from "~/tailwind.config";

type BreakpointMap<T> = {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
  [key: string]: T | undefined;
} & {
  default: T;
};

/* eslint-disable */
export const useBreakpointValue = <T,>(breakpointMap: BreakpointMap<T>): T => {
  const twConfig = resolveConfig(tailwindConfig);
  const windowSize = useContext(WindowSizeContext);
  const { screens } = twConfig.theme;

  // Convert screens to an array of [breakpointName, pixelValue], then sort in descending order
  const sortedBreakpoints = Object.entries(screens)
    .map(([key, value]) => [key, parseFloat(value)])
    // @ts-ignore
    .sort((a, b) => b[1] - a[1]);

  // Find the value from the breakpointMap for the current active breakpoint or the closest smaller one
  for (const [breakpoint, value] of sortedBreakpoints) {
    if (
      // @ts-ignore
      windowSize?.[0] >= value &&
      // @ts-ignore
      breakpointMap[breakpoint] !== undefined
    ) {
      // @ts-ignore
      return breakpointMap[breakpoint] as T;
    }

    // @ts-ignore
    if (windowSize?.[0] >= value) {
      // If current breakpoint doesn't exist in the map, check the ones smaller than the current
      for (
        let i =
          sortedBreakpoints.findIndex(([current]) => breakpoint === current) +
          1;
        i < sortedBreakpoints.length;
        i++
      ) {
        const nextBreakpoint = sortedBreakpoints[i]?.[0];
        if (!nextBreakpoint) {
          break;
        }
        if (breakpointMap[nextBreakpoint] !== undefined) {
          return breakpointMap[nextBreakpoint] as T;
        }
      }
    }
  }

  return breakpointMap.default;
};

export const useMobile = (breakpoint: "sm" | "md" | "lg" | "xl" = "md") => {
  const isMobile = useBreakpointValue({ default: true, [breakpoint]: false });

  return isMobile;
};
