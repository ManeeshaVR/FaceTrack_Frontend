interface CartoonAvatarProps {
  gender: string;
  size?: "sm" | "md" | "lg";
  seed?: string;
}

export function CartoonAvatar({ gender, size = "md", seed = "default" }: CartoonAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const type = gender?.toLowerCase() === 'female' ? 'girl' : 'boy';
  const avatarUrl = seed !== 'default' ? `https://avatar.iran.liara.run/public/${type}?username=${seed}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
