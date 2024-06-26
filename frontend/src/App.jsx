import { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/Login';
import SiteHeadingAndNav from './components/SiteHeadingAndNav';
import NotFoundPage from './pages/NotFound';
import UserContext from './contexts/CurrentUserContext';
import { checkForLoggedInUser } from './adapters/auth-adapter';
import DiscoverPage from './pages/DiscoverPage';
import UserPage from './pages/User';
import FeedPage from './pages/Feed';
import SettingsPage from './pages/SettingsPage'
import NewPostPage from './pages/NewPostPage';

export default function App() {
  const { setCurrentUser } = useContext(UserContext);
  useEffect(() => {
    checkForLoggedInUser().then(setCurrentUser);
  }, [setCurrentUser]);

  return <>
    <SiteHeadingAndNav />
    <main className='flex-container column'>
      <Routes>
        <Route path='/' element={<FeedPage />} />
        <Route path='/new-post' element={<NewPostPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/discover' element={<DiscoverPage />} />
        <Route path='/users/:id' element={<UserPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </main>
  </>;
}
