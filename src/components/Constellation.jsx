import { useEffect, useMemo, useRef, useState } from 'react';
import { constellation } from '../data/site.js';
import { m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { onHashClick } from '../motion/scroll.js';
import './Constellation.css';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const NARROW = '(max-width: 760px)';

function useNarrow() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(NARROW);
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return narrow;
}

export function Constellation() {
  const field = useRef(null);
  const prefs = useMotionPrefs();
  const narrow = useNarrow();
  const [active, setActive] = useState(null);
  const [cursor, setCursor] = useState(false);
  const layout = narrow ? constellation.narrow : constellation.wide;
  const byId = useMemo(
    () => Object.fromEntries(constellation.nodes.map((node) => [node.id, node])),
    []
  );
  const neighbors = useMemo(() => {
    const map = Object.fromEntries(constellation.nodes.map((node) => [node.id, new Set()]));
    for (const [from, to] of constellation.links) {
      map[from].add(to);
      map[to].add(from);
    }
    return map;
  }, []);

  function point(node) {
    return {
      x: narrow ? node.xm : node.x,
      y: narrow ? node.ym : node.y,
      place: narrow ? node.placeNarrow : node.place,
    };
  }

  function onPointerMove(event) {
    if (!window.matchMedia(FINE_POINTER).matches || !field.current) return;
    const box = field.current.getBoundingClientRect();
    field.current.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
    field.current.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
    setCursor((on) => (on ? on : true));
  }

  function onPointerLeave() {
    setCursor(false);
    setActive(null);
  }

  return (
    <m.div
      ref={field}
      className={cursor ? 'constellation has-cursor' : 'constellation'}
      style={{ '--map-w': layout.width, '--map-h': layout.height }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={prefs.reveal ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: prefs.mobile ? 0.3 : 0.55, delay: prefs.mobile ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        className="constellation-map"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="presentation"
      >
        {constellation.links.map(([from, to]) => {
          const a = point(byId[from]);
          const b = point(byId[to]);
          const lit = active && (from === active || to === active);
          return (
            <line
              key={`${from}-${to}`}
              className={lit ? 'constellation-link is-lit' : 'constellation-link'}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          );
        })}
      </svg>
      <nav className="constellation-nodes" aria-label="Systems map">
        {constellation.nodes.map((node, index) => {
          const { x, y, place } = point(node);
          const hot = active === node.id;
          const near = active && neighbors[node.id].has(active);
          return (
            <m.a
              key={node.id}
              className={`star star--${node.tone} star--${place}${hot ? ' is-active' : ''}${near ? ' is-near' : ''}`}
              href={node.href}
              style={{ '--x': `${(x / layout.width) * 100}%`, '--y': `${(y / layout.height) * 100}%` }}
              initial={prefs.reveal ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: prefs.mobile || !prefs.reveal ? 0 : 0.18 + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              onPointerEnter={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              onClick={(event) => onHashClick(event, node.href, prefs.reduced)}
            >
              <span className="star-core" aria-hidden="true" />
              <span className="star-copy">
                <span className="star-label">{node.label}</span>
                <span className="star-subject">{node.subject}</span>
              </span>
            </m.a>
          );
        })}
      </nav>
    </m.div>
  );
}
