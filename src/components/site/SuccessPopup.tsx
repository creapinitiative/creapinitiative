import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SuccessPopupContextValue = {
  show: (message?: string) => void;
};

const SuccessPopupContext = createContext<SuccessPopupContextValue | null>(null);

const DEFAULT_MESSAGE = "Thank you — we've received it.";
const AUTO_DISMISS_MS = 2800;

export function SuccessPopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg?: string) => {
    setMessage(msg?.trim() || DEFAULT_MESSAGE);
    setOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), AUTO_DISMISS_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <SuccessPopupContext.Provider value={{ show }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] grid place-items-center bg-black/40 backdrop-blur-[2px] px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            role="status"
            aria-live="polite"
          >
            <motion.div
              className="bg-white rounded-sm px-10 py-10 flex flex-col items-center text-center max-w-xs shadow-[0_24px_60px_rgba(10,26,15,0.25)]"
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg viewBox="0 0 52 52" className="w-14 h-14 mb-5">
                <circle className="success-checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                <path className="success-checkmark-check" fill="none" d="M14 27l7 7 16-16" />
              </svg>
              <p className="text-ink text-[15px] leading-relaxed">{message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SuccessPopupContext.Provider>
  );
}

export function useSuccessPopup(): SuccessPopupContextValue {
  const ctx = useContext(SuccessPopupContext);
  if (!ctx) {
    // Safe no-op fallback for anywhere rendered outside the provider (e.g. dashboard).
    return { show: () => {} };
  }
  return ctx;
}
