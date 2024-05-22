import { useState } from 'react';
import CurrentUserContext from './CurrentUserContext';

export default function CurrentUserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLikes, setUserLikes] = useState([]);
  const context = { currentUser, setCurrentUser, userLikes, setUserLikes };

  return (
    <CurrentUserContext.Provider value={context}>
      {children}
    </CurrentUserContext.Provider>
  );
}
