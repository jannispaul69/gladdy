"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface BookingModalCtx {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Ctx = createContext<BookingModalCtx>({
  open: false,
  openModal: () => {},
  closeModal: () => {},
});

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }, []);
  const closeModal = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);
  return <Ctx.Provider value={{ open, openModal, closeModal }}>{children}</Ctx.Provider>;
}

export const useBookingModal = () => useContext(Ctx);
