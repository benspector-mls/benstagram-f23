import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import closeImg from '../assets/close.png'
import hamburgerImg from '../assets/hamburger.png'
import '../styles/headingAndNav.css'

export default function SiteHeadingAndNav() {
  const { currentUser } = useContext(CurrentUserContext);
  const [showNavLinks, setShowNavLinks] = useState(false)

  const toggleShowNavLinks = () => setShowNavLinks((showNavLinks) => !showNavLinks);

  return <header className="flex-container">
    <div className="logo-container flex-container space-between">
      <a id='logo' href='/'>Benstagram</a>
      <a href="#" className={`toggle-button ${showNavLinks ? "active" : ''}`} onClick={toggleShowNavLinks}>
        {showNavLinks
          ? <img src={closeImg} />
          : <img src={hamburgerImg} />
        }
      </a>
    </div>
    <nav className={`navbar-links ${showNavLinks ? "active" : ''}`}>
      <ul>
        {
          currentUser
            ? <>
              <li><NavLink to='/'>Feed</NavLink></li>
              <li><NavLink to='/new-post'>Create</NavLink></li>
              <li><NavLink to='/discover' end={true}>Discover</NavLink></li>
              <li><NavLink to={`/users/${currentUser.id}`}>Profile</NavLink></li>
            </>
            : <>
              <li><NavLink to='/login'>Login</NavLink></li>
              <li><NavLink to='/sign-up'>Sign Up</NavLink></li>
            </>
        }
      </ul>
    </nav>
  </header>;
}
