import { useRef, useEffect } from "react";

export function useClickOutSide(handler) {
  const domNode = useRef();
  useEffect(() => {
    const handlerEvent = (event) => {
      if (!domNode.current.contains(event.target)) handler();
    };

    document.addEventListener("mousedown", handlerEvent);

    return () => {
      document.removeEventListener("mousedown", handlerEvent);
    };
  });
  return domNode;
}
