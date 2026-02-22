"use client";
import { useEffect, useState } from "react";

// Retorna o valor de texto com atraso (debounce). Útil para evitar chamadas em excesso na API enquanto o usuário digita.
export function useDebounce(value: string, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
