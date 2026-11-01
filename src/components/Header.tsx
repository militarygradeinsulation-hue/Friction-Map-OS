import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="nav scrolled fixed w-full top-0 left-0 z-50 border-b border-white/10">
      <div className="nav-in">
        <a href="/" className="logo">
          <div className="logo-mark">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          FrictionMap <sup>OS</sup>
        </a>
      </div>
    </header>
  );
}
