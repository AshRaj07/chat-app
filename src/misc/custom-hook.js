import { useCallback, useState, useEffect, useRef } from "react";
import { database } from "./firebase";

export function useModalState(defaultValue = false) {
  const [isOpen, setisOpen] = useState(defaultValue);

  const open = useCallback(() => setisOpen(true), []);
  const close = useCallback(() => setisOpen(false), []);

  return { isOpen, open, close };
}

export const useMediaQuery = (query) => {
  const [matches, setmatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setmatches(queryList.matches);

    const listener = (evt) => setmatches(evt.matches);

    queryList.addListener(listener);
    return () => queryList.removeListener(listener);
  }, [query]);
  return matches;
};

export function usePresence(uid){
  const [presence, setpresence] = useState(null)

  useEffect(()=>{
    const userStatusRef = database.ref(`/status/${uid}`);

    userStatusRef.on('value',snap=>{
      if(snap.exists()){
        const data = snap.val();
        setpresence(data);
      }
    })
    return () => {
      userStatusRef.off()
    }
  },[uid])
  return presence;
}

export function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
      }
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}