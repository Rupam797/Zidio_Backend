import React, { useState, useEffect } from 'react';
import { Search, Home, Users, Briefcase, Bell, User, LogOut, ChevronDown, Moon, Sun, FileText } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] sticky top-0 z-50 border-b border-gray-200 dark:border-[#334155] transition-colors duration-300">
      <div className="max-w-[1128px] mx-auto min-h-[52px] flex justify-between items-center px-4">
        
        {/* Left: Logo and Search */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-white bg-zidio-green font-bold text-xl px-2 py-0.5 rounded">Zidio</Link>
          <div className="bg-[#eef3f8] dark:bg-[#0f172a] flex items-center p-2 rounded ml-2 transition-colors duration-300">
            <Search className="text-gray-500 dark:text-gray-400 w-4 h-4 ml-1" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none ml-2 text-sm w-48 hidden md:block dark:text-gray-200"
            />
          </div>
        </div>

        {/* Right: Navigation Icons */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-500 relative">
          <HeaderOption Icon={Home} title="Home" to="/" active={location.pathname === '/'} />
          <HeaderOption Icon={Users} title="My Network" to="/network" active={location.pathname === '/network'} />
          <HeaderOption Icon={Briefcase} title="Jobs" to="/jobs" active={location.pathname === '/jobs'} />
          {role === 'STUDENT' && (
            <HeaderOption Icon={FileText} title="Applications" to="/applications" active={location.pathname === '/applications'} />
          )}
          <HeaderOption Icon={Bell} title="Notifications" to="/notifications" active={location.pathname === '/notifications'} />
          
          <button onClick={toggleTheme} className="flex flex-col items-center justify-center cursor-pointer hover:text-black dark:hover:text-white transition-colors p-2">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400 hover:text-white" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative" onMouseLeave={() => setShowDropdown(false)}>
            <div onClick={() => setShowDropdown(!showDropdown)}>
               <HeaderOption Icon={User} title="Me" avatar />
            </div>
            
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-md shadow-lg w-48 py-2 z-50 flex flex-col items-start px-2">
                 <Link to="/profile" className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#334155] rounded font-semibold transition-colors duration-200">View Profile</Link>
                 {role === 'STUDENT' && (
                   <Link to="/applications" className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#334155] rounded font-semibold transition-colors duration-200">My Applications</Link>
                 )}
                 {role === 'ADMIN' && (
                    <Link to="/admin" className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#334155] rounded font-semibold transition-colors duration-200">Admin Panel</Link>
                 )}
                 <hr className="w-full border-gray-200 dark:border-[#334155] my-1" />
                 <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#334155] rounded flex items-center gap-2 font-semibold transition-colors duration-200">
                    <LogOut className="w-4 h-4" /> Sign Out
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderOption = ({ Icon, title, active, avatar, to }: any) => {
  return (
    <Link to={to || '#'} className={`flex flex-col items-center cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors ${active ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-[2px]' : ''}`}>
      <Icon className="w-6 h-6 border-0" />
      <span className="text-xs mt-1 flex items-center gap-0.5 hidden md:flex">
         {title} {avatar && <ChevronDown className="w-3 h-3 ml-0.5" />}
      </span>
    </Link>
  );
};

export default Header;
