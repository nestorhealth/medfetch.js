import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Calls the passed in function without awaiting it, so a wrapper over a plain IIFE. Meant to be for effects 
 * @param someEffect Callback with 0 args with the effect to run
 * @returns Whatever {@link someEffect} returns
 */
export function call<T>(someEffect: () => T): T {
  return someEffect();
}
