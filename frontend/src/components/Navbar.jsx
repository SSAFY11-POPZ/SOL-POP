import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  // List of paths where the Navbar should be visible
  const visiblePaths = ['/', '/search', '/wishlist', '/profile'];

  // Check if the current path matches any of the visible paths
  const shouldShowNavbar = visiblePaths.includes(location.pathname);

  // If the current path is not in the list, return null to hide the Navbar
  if (!shouldShowNavbar) {
    return null;
  }

  const handleNavLinkClick = (event, to) => {
    if (location.pathname === to) {
      window.location.reload();
    }
  };

  return (
    <nav className="bottom-navbar">
      <NavLink
        to="/"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        onClick={(event) => handleNavLinkClick(event, '/')}
      >
        {({ isActive }) => (
          <img
            src={isActive ? '/NavImg/Home_white.svg' : '/NavImg/Home.svg'}
            alt="Home"
            className="nav-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        onClick={(event) => handleNavLinkClick(event, '/search')}
      >
        {({ isActive }) => (
          <img
            src={
              isActive ? '/NavImg/Search_white.svg' : '/NavImg/Search_black.svg'
            }
            alt="Search"
            className="nav-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/wishlist"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        onClick={(event) => handleNavLinkClick(event, '/wishlist')}
      >
        {({ isActive }) => (
          <img
            src={isActive ? '/NavImg/Fav_white.svg' : '/NavImg/Fav.svg'}
            alt="Wishlist"
            className="nav-icon"
          />
        )}
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        onClick={(event) => handleNavLinkClick(event, '/profile')}
      >
        {({ isActive }) => (
          <img
            src={isActive ? '/NavImg/Person_white.svg' : '/NavImg/Person.svg'}
            alt="Profile"
            className="nav-icon"
          />
        )}
      </NavLink>
    </nav>
  );
};

export default Navbar;
