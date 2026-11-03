import { m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import './Atmosphere.css';

export function Atmosphere() {
  const { drift } = useMotionPrefs();

  return (
    <div className="atmosphere" aria-hidden="true">
      <m.div
        className="atmosphere-light atmosphere-light--violet"
        animate={drift ? { x: [0, 28, 0], y: [0, 18, 0] } : undefined}
        transition={drift ? { duration: 22, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <m.div
        className="atmosphere-light atmosphere-light--cyan"
        animate={drift ? { x: [0, -22, 0], y: [0, -14, 0] } : undefined}
        transition={drift ? { duration: 26, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <div className="atmosphere-grid" />
    </div>
  );
}
