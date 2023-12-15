"use client";

import {
  createContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

export const WindowSizeContext = createContext<[number, number] | null>(null);

export const WindowSizeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <WindowSizeContext.Provider value={size as [number, number]}>
      {children}
    </WindowSizeContext.Provider>
  );
};
