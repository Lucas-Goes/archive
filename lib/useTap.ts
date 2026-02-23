import { useRef } from "react";

export function useTap(onTap: () => void) {
  const startPos = useRef({ x: 0, y: 0 });
  const isMoved = useRef(false);
  const isTouch = useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    isTouch.current = true;
    isMoved.current = false;

    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function onTouchMove(e: React.TouchEvent) {
    const deltaX = Math.abs(e.touches[0].clientX - startPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - startPos.current.y);

    if (deltaX > 10 || deltaY > 10) {
      isMoved.current = true;
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (isMoved.current) return;

    // 👉 evita que o click seja disparado depois
    e.preventDefault();

    onTap();
  }

  function onClick(e: React.MouseEvent) {
    // 👉 Se veio de um touch, ignora o click fantasma
    if (isTouch.current) {
      isTouch.current = false;
      return;
    }

    if (e.button !== 0) return;

    onTap();
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick,
  };
}