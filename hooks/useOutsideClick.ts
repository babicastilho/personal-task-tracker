// 
/**
 * hooks/useOutsideClick.ts
 * Custom hook to detect clicks outside of a specified element and trigger a callback.
 * 
 * This hook listens for mouse events outside the referenced element (`ref`). 
 * When an outside click is detected, the provided callback function (`callback`) is executed.
 * The event listener is removed on component unmount to prevent memory leaks.
 * 
 * @param ref - A React ref object pointing to the element to observe.
 * @param callback - A function to execute when a click outside the element is detected.
 */

import { useEffect } from "react";

const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
