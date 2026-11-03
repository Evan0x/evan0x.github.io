import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SystemsContext = createContext(null);

export function SystemsProvider({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [shortcut, setShortcut] = useState('Ctrl+K');

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    setShortcut(mac ? '⌘K' : 'Ctrl+K');
  }, []);

  useEffect(() => {
    function onKey(event) {
      const key = event.key.toLowerCase();
      const commandKey = (event.metaKey || event.ctrlKey) && key === 'k' && !event.altKey && !event.shiftKey;

      if (commandKey) {
        if (event.repeat) return;
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      if (event.key !== 'Escape') return;

      if (paletteOpen) {
        event.preventDefault();
        event.stopPropagation();
        setPaletteOpen(false);
        return;
      }

      if (terminalOpen) {
        event.preventDefault();
        event.stopPropagation();
        setTerminalOpen(false);
      }
    }

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [paletteOpen, terminalOpen]);

  useEffect(() => {
    const locked = paletteOpen || terminalOpen;
    const previous = document.body.style.overflow;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [paletteOpen, terminalOpen]);

  const value = useMemo(
    () => ({
      paletteOpen,
      terminalOpen,
      shortcut,
      openPalette,
      closePalette,
      openTerminal,
      closeTerminal,
    }),
    [paletteOpen, terminalOpen, shortcut, openPalette, closePalette, openTerminal, closeTerminal]
  );

  return <SystemsContext.Provider value={value}>{children}</SystemsContext.Provider>;
}

export function useSystems() {
  const value = useContext(SystemsContext);
  if (!value) {
    throw new Error('useSystems must be used inside SystemsProvider');
  }
  return value;
}
