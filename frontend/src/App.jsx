import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/Login';
import SiteHeadingAndNav from './components/SiteHeadingAndNav';
import NotFoundPage from './pages/NotFound';
import UserContext from './contexts/current-user-context';
import { checkForLoggedInUser } from './adapters/auth-adapter';
import DiscoverPage from './pages/DiscoverPage';
import UserPage from './pages/User';
import FeedPage from './pages/Feed';
import SettingsPage from './pages/SettingsPage'
import NewPostPage from './pages/NewPostPage';
import VideoChat from './pages/VideoChat';

export default function App() {
  const { setCurrentUser } = useContext(UserContext);
  useEffect(() => {
    checkForLoggedInUser().then(setCurrentUser);
  }, [setCurrentUser]);

  return <>
    <SiteHeadingAndNav />
    <main>
      <Routes>
        <Route path='/' element={<FeedPage />} />
        <Route path='/new-post' element={<NewPostPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/discover' element={<DiscoverPage />} />
        <Route path='/users/:id' element={<UserPage />} />
        <Route path='/video/:recipient_id' element={<VideoChat />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </main>
  </>;
}
