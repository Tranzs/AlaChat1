import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../Avatar/Avatar';
import './Header.css';

export default function Header({ 
  title, 
  showBack = false, 
  showThemeToggle = true,
  showProfile = true,
  showAdmin = true,
  rightComponent = null,
  user 
}) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__left">
        {showBack ? (
          <button 
            className="header__back" 
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            ←
          </button>
        ) : null}
        {title && <h1 className="header__title">{title}</h1>}
      </div>
      
      <div className="header__right">
        {rightComponent}
        {showAdmin && user?.role === 'admin' && (
          <Link to="/admin" className="header__admin" aria-label="Quản lý">
            ⚙️
          </Link>
        )}
        {showThemeToggle && (
          <button 
            className="header__theme-toggle" 
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        )}
        {showProfile && user && (
          <Link to="/profile" className="header__profile">
            <Avatar name={user.name} src={user.avatar} size="small" />
          </Link>
        )}
      </div>
    </header>
  );
}
