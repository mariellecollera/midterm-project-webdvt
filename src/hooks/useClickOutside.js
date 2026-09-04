import { useEffect } from "react";

/**
 * Tracks whether the user clicks outside of a referenced element
 * (e.g. the floating transaction card) and invokes `onOutsideClick`.
 * Used by Add Transaction / Transaction Detail to surface a confirmation
 * modal before the user accidentally abandons an unsaved form.
 *
 * @param {React.RefObject} ref - ref attached to the element to watch.
 * @param {() => void} onOutsideClick - called when a click lands outside.
 * @param {boolean} enabled - pass false to pause tracking (e.g. while a
 *   confirmation modal is already open) without unmounting the hook.
 */
export function useClickOutside(ref, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onOutsideClick, enabled]);
}
