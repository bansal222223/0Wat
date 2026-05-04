import { NavLink } from 'react-router-dom';
import { Shield, Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar animate-fade-in">
      <div className="container">
        <NavLink to="/" className="nav-brand">
          <Shield size={28} style={{ color: 'var(--accent-primary)' }} />
          <span>0Wat<span className="text-gradient">System</span></span>
        </NavLink>
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Registration
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Verification
          </NavLink>
          <NavLink
            to="/analyze"
            className={({ isActive }) => isActive ? 'nav-link active nav-link-analyze' : 'nav-link nav-link-analyze'}
          >
            <Activity size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Analyze
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
