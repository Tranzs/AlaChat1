import './Avatar.css';

export default function Avatar({ 
  src, 
  name, 
  size = 'medium', 
  showOnline = false, 
  isOnline = false 
}) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const className = `avatar avatar--${size}`;

  return (
    <div className={className}>
      {src ? (
        <img src={src} alt={name} className="avatar__image" />
      ) : (
        <div className="avatar__initials">
          {getInitials(name)}
        </div>
      )}
      {showOnline && (
        <span className={`avatar__status avatar__status--${isOnline ? 'online' : 'offline'}`} />
      )}
    </div>
  );
}
