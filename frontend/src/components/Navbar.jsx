import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';


import homeIcon from '@/assets/NavImg/Home.svg';
import homeIconWhite from '@/assets/NavImg/Home_white.svg';
import searchIcon from '@/assets/NavImg/Search_black.svg';
import searchIconWhite from '@/assets/NavImg/Search_white.svg';
import favIcon from '@/assets/NavImg/Fav.svg';
import favIconWhite from '@/assets/NavImg/Fav_white.svg';
import profileIcon from '@/assets/NavImg/Person.svg';
import profileIconWhite from '@/assets/NavImg/Person_white.svg';

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
