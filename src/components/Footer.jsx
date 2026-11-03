import { useMotionPrefs } from '../motion/MotionProvider.jsx';
import { onHashClick } from '../motion/scroll.js';
import './Footer.css';

export function Footer() {
  const prefs = useMotionPrefs();

  return (
    <footer className="footer">
      <div className="wrap footer-bar">
        <a className="wordmark" href="#index" onClick={(event) => onHashClick(event, '#index', prefs.reduced)}>
          Evan <span>/ Systems</span>
        </a>
        <p>Designed and built by Evan Yibole</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
