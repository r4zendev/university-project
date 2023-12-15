import { WindowSizeContextProvider } from "./window-size";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return <WindowSizeContextProvider>{children}</WindowSizeContextProvider>;
}
