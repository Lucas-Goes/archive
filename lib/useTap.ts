import { useRef } from "react";

export function useTap(onTap: () => void) {
  const startY = useRef(0);
  const isScrolling = useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
    isScrolling.current = false;
  }

  function onTouchMove(e: React.TouchEvent) {
    const delta = Math.abs(e.touches[0].clientY - startY.current);
    // Se mover mais de 10px, consideramos scroll e cancelamos o tap
    if (delta > 10) {
      isScrolling.current = true;
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!isScrolling.current) {
      // Impede que o evento de clique fantasma do navegador dispare após o touch
      if (e.cancelable) e.preventDefault();
      onTap();
    }
  }

  // Fallback para Desktop
  function onClick(e: React.MouseEvent) {
    // Se não for touch (mouse comum), dispara o callback
    onTap();
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick,
  };
}
