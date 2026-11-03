import './Atmosphere.css';

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-light atmosphere-light--violet" />
      <div className="atmosphere-light atmosphere-light--cyan" />
      <div className="atmosphere-grid" />
    </div>
  );
}
