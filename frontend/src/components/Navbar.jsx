import React from 'react';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isDetailOrRafflePage = 
    location.pathname.includes('/detail') 
    // ||
    // matchPath('/raffle/:raffleId', location.pathname);

  if (isDetailOrRafflePage) {
    return null;
  }

  return (
    <nav className="bottom-navbar">
      <NavLink
        to="/"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? '/NavImg/Home_white.svg' : '/NavImg/Home.svg'} alt="Home" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? '/NavImg/Search_white.svg' : '/NavImg/Search_black.svg'} alt="Search" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/raffle"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? '/NavImg/Fav_white.svg' : '/NavImg/Fav.svg'} alt="Raffle" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? '/NavImg/Person_white.svg' : '/NavImg/Person.svg'} alt="Profile" className="nav-icon" />
        )}
      </NavLink>
    </nav>
  );
};

export default Navbar;
