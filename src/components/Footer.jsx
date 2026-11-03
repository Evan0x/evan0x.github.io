import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-bar">
        <a className="wordmark" href="#index">
          Evan <span>/ Systems</span>
        </a>
        <p>Designed and built by Evan Yibole</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
