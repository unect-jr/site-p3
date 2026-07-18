"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const WHATSAPP_PHONE = "5543996481850";
const DEFAULT_MESSAGE = "Olá, tenho interesse em conhecer os produtos e serviços da P3 Agro";
const BUTTON_SIZE = 56;
const DRAG_THRESHOLD = 6;

interface DragState {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragState = useRef<DragState | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  if (pathname?.startsWith("/admin")) return null;

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragState.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
      return;
    }
    drag.moved = true;

    const maxX = window.innerWidth - BUTTON_SIZE;
    const maxY = window.innerHeight - BUTTON_SIZE;

    setPosition({
      x: Math.min(Math.max(drag.originX + dx, 0), maxX),
      y: Math.min(Math.max(drag.originY + dy, 0), maxY),
    });
  }

  function handlePointerUp() {
    const drag = dragState.current;
    dragState.current = null;

    if (!drag?.moved) {
      const text = encodeURIComponent(DEFAULT_MESSAGE);
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, "_blank", "noopener,noreferrer");
    }
  }

  const style: React.CSSProperties = position
    ? { left: position.x, top: position.y, right: "auto", bottom: "auto" }
    : { right: 20, bottom: 20 };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Falar no WhatsApp"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={style}
      className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-p3green shadow-lg touch-none cursor-grab select-none active:cursor-grabbing hover:opacity-90 transition-opacity"
    >
      <Image
        src="/whatsapp-botao-icone.png"
        alt="WhatsApp"
        width={30}
        height={30}
        className="pointer-events-none"
      />
    </button>
  );
}
