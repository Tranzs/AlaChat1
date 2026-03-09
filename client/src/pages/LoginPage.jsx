import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginByName } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      // Login mode
      if (!username.trim() || !password) {
        setError('Vui lòng nhập tên đăng nhập và mật khẩu');
        return;
      }

      setLoading(true);
      const result = await login(username.trim(), password);
      setLoading(false);

      if (!result.success) {
        setError(result.error?.message || 'Đăng nhập thất bại');
      }
    } else {
      // Register mode
      if (!username.trim() || !password || !name.trim()) {
        setError('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      if (username.trim().length < 3) {
        setError('Tên đăng nhập phải có ít nhất 3 ký tự');
        return;
      }

      if (password.length < 4) {
        setError('Mật khẩu phải có ít nhất 4 ký tự');
        return;
      }

      if (name.trim().length < 2) {
        setError('Tên hiển thị phải có ít nhất 2 ký tự');
        return;
      }

      setLoading(true);
      const result = await register(username.trim(), password, name.trim());
      setLoading(false);

      if (!result.success) {
        setError(result.error?.message || 'Đăng ký thất bại');
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <span className="login-logo__icon">💬</span>
          <h1 className="login-logo__title">AlaChat</h1>
          <p className="login-logo__subtitle">Chat nội bộ</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="username" className="login-form__label">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              className="login-form__input"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="login-form__field">
            <label htmlFor="password" className="login-form__label">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              className="login-form__input"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={50}
              disabled={loading}
            />
          </div>

          {mode === 'register' && (
            <div className="login-form__field">
              <label htmlFor="name" className="login-form__label">
                Tên hiển thị
              </label>
              <input
                id="name"
                type="text"
                className="login-form__input"
                placeholder="Nhập tên hiển thị..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <p className="login-form__error">{error}</p>
          )}

          <button 
            type="submit" 
            className="login-form__button"
            disabled={loading}
          >
            {loading 
              ? 'Đang xử lý...' 
              : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>

          <button 
            type="button"
            className="login-form__toggle"
            onClick={toggleMode}
            disabled={loading}
          >
            {mode === 'login' 
              ? 'Chưa có tài khoản? Đăng ký' 
              : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </form>

        <p className="login-note">
          {mode === 'login'
            ? 'Đăng nhập để trò chuyện với đồng nghiệp'
            : 'Tạo tài khoản để bắt đầu trò chuyện'}
        </p>
      </div>
    </div>
  );
}
