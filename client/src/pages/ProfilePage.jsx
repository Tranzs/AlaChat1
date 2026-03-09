import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Avatar from '../components/Avatar/Avatar';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Chỉ chấp nhận file ảnh JPG, PNG, GIF');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatarPreview(base64);
      await updateAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const updateAvatar = async (base64) => {
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: base64 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Cập nhật ảnh đại diện thành công');
      } else {
        setError(result.error?.message || 'Lỗi cập nhật ảnh');
        setAvatarPreview(user?.avatar || null);
      }
    } catch (err) {
      setError('Lỗi kết nối');
      setAvatarPreview(user?.avatar || null);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError('Tên không được để trống');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    
    const result = await updateUser({ name: name.trim() });
    
    setSaving(false);
    
    if (result.success) {
      setSuccess('Cập nhật tên thành công');
    } else {
      setError(result.error?.message || 'Đã xảy ra lỗi');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }

    if (newPassword.length < 4) {
      setError('Mật khẩu mới phải có ít nhất 4 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Verify current password first
      const response = await fetch('/api/users/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          password: currentPassword 
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setError('Mật khẩu hiện tại không đúng');
        setSaving(false);
        return;
      }

      // Update password
      const updateResponse = await fetch(`/api/users/${user.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      
      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        setSuccess('Đổi mật khẩu thành công');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(updateResult.error?.message || 'Lỗi đổi mật khẩu');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Header title="Hồ sơ" showBack user={user} />
      
      <div className="profile-content">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar" onClick={handleAvatarClick}>
            <Avatar name={user.name} src={avatarPreview} size="large" />
            <div className="profile-avatar__overlay">
              <span>📷</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <p className="profile-avatar__hint">Nhấn để đổi ảnh đại diện</p>
        </div>

        {/* Messages */}
        {error && <p className="profile-message profile-message--error">{error}</p>}
        {success && <p className="profile-message profile-message--success">{success}</p>}

        {/* Profile Info */}
        <div className="profile-section">
          <h3 className="profile-section__title">Thông tin cá nhân</h3>
          
          <div className="profile-field">
            <label className="profile-label">Tên đăng nhập</label>
            <input
              type="text"
              className="profile-input"
              value={username}
              disabled
              title="Tên đăng nhập không thể thay đổi"
            />
          </div>

          <div className="profile-field">
            <label className="profile-label">Tên hiển thị</label>
            <input
              type="text"
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Nhập tên..."
            />
          </div>

          <button 
            className="profile-save-btn"
            onClick={handleSaveName}
            disabled={saving || name === user.name}
          >
            {saving ? 'Đang lưu...' : 'Lưu tên'}
          </button>
        </div>

        {/* Password Change */}
        <div className="profile-section">
          <h3 className="profile-section__title">Đổi mật khẩu</h3>
          
          <div className="profile-field">
            <label className="profile-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="profile-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại..."
            />
          </div>

          <div className="profile-field">
            <label className="profile-label">Mật khẩu mới</label>
            <input
              type="password"
              className="profile-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
            />
          </div>

          <div className="profile-field">
            <label className="profile-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="profile-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
            />
          </div>

          <button 
            className="profile-save-btn profile-save-btn--secondary"
            onClick={handleChangePassword}
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          >
            {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </div>

        {/* Account Info */}
        <div className="profile-section profile-info">
          <div className="profile-info__item">
            <span className="profile-info__label">Vai trò</span>
            <span className="profile-info__value">
              {user.role === 'admin' ? '👑 Quản lý' : '👤 Người dùng'}
            </span>
          </div>
          <div className="profile-info__item">
            <span className="profile-info__label">Ngày tham gia</span>
            <span className="profile-info__value">
              {new Date(user.created_at).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        <button 
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}
