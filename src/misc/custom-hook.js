import { useCallback, useState } from "react";

export function useModalState(defaultValue = false) {
  const [isOpen, setisOpen] = useState(defaultValue);

  const open = useCallback(() => setisOpen(true),[]);
  const close = useCallback(() => setisOpen(false),[]);

  return { isOpen, open, close };
}
