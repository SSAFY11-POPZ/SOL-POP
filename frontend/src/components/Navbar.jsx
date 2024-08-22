import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';


import homeIcon from '@/assets/NavImg/Home.png';
import homeIconWhite from '@/assets/NavImg/Home_white.png';
import searchIcon from '@/assets/NavImg/Search_black.png';
import searchIconWhite from '@/assets/NavImg/Search_white.png';
import favIcon from '@/assets/NavImg/Fav.png';
import favIconWhite from '@/assets/NavImg/Fav_white.png';
import profileIcon from '@/assets/NavImg/Person.png';
import profileIconWhite from '@/assets/NavImg/Person_white.png';

const Navbar = () => {
  return (
    <nav className="bottom-navbar">
      <NavLink
        to="/"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? homeIconWhite : homeIcon} alt="Home" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? searchIconWhite : searchIcon} alt="Search" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/raffle"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? favIconWhite : favIcon} alt="Raffle" className="nav-icon" />
        )}
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
      >
        {({ isActive }) => (
          <img src={isActive ? profileIconWhite : profileIcon} alt="Profile" className="nav-icon" />
        )}
      </NavLink>
    </nav>
  );
};

export default Navbar;
