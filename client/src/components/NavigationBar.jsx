import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthProvider';
import { CircleUserRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const [profileToggle, setProfileToggle] = useState(false);
  const location = useLocation();

  const handleProfileToggle = () => {
    setProfileToggle(prev => !prev);
  }

  useEffect(() => {
    setProfileToggle(false);
  }, [location]);

  const handleLogout = (e) => {
    logout();
    setProfileToggle(false);
    toast.success("Logged out successfully");
  }

  return (
    <nav className="fixed z-10 flex items-center justify-between w-full px-(--x-padding) py-2 top-0 h-(--navbar-h)">
      <Link to="/" className='flex justify-center items-center gap-1'>
        <img src={logo} alt="Logo" className="h-10 cursor-pointer" />
        <span className='font-semibold text-xl'>PaperWise</span>
      </Link>
      <div className='flex items-center justify-center gap-8 '>
        <Link to={'/'} className={`${location.pathname === '/' ? 'underline underline-offset-4 ' : ''} cursor-pointer`}>Home</Link>
        {user ? (
          <div className='relative'>
            <CircleUserRound className='size-8 cursor-pointer' onClick={handleProfileToggle} />
            {profileToggle && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  onClick={() => setProfileToggle(false)}
                />
                <div className='z-10 absolute right-0 top-12 w-60 rounded-lg shadow-2xl pt-2 border border-white/10'
                  style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--primary-text)' }}>

                  <div className='px-4 py-4 border-b border-white/5'>
                    <p className='text-sm font-bold truncate'>{user.userName}</p>
                    <p className='text-xs opacity-60 truncate'>{user.email}</p>
                  </div>

                  <div className='flex flex-col'>
                    <Link to={'/me'} className='px-4 py-4 hover:bg-white/5 cursor-pointer transition-colors'>
                      Workspaces
                    </Link>
                    <div
                      className='px-4 py-4 hover:bg-red-500/10 text-red-500 cursor-pointer transition-colors'
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className='flex gap-8'>
            <Link to='/login' className={`${location.pathname === '/login' ? 'underline underline-offset-4 ' : ''} cursor-pointer transition`}>
              Login
            </Link>
            <Link to='/signup' className={`${location.pathname === '/signup' ? 'underline underline-offset-4 ' : ''} cursor-pointer transition`}>
              Sign Up
            </Link>
          </div>
        )}

      </div>
    </nav>
  )
}

export default NavigationBar;