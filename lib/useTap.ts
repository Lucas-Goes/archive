import { useRef } from "react";

export function useTap(onTap: () => void) {
  const startPos = useRef({ x: 0, y: 0 });
  const isMoved = useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    isMoved.current = false;
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function onTouchMove(e: React.TouchEvent) {
    const deltaX = Math.abs(e.touches[0].clientX - startPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - startPos.current.y);

    // Se mover mais de 10 pixels em qualquer direção, cancelamos o clique
    if (deltaX > 10 || deltaY > 10) {
      isMoved.current = true;
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!isMoved.current) {
      // Opcional: e.preventDefault() aqui pode causar problemas se houver inputs dentro, 
      // use com cautela. Removido para priorizar compatibilidade.
      onTap();
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    // No Desktop usamos onClick normal
    onClick: (e: React.MouseEvent) => {
      if (e.button === 0) onTap();
    }
  };
}
