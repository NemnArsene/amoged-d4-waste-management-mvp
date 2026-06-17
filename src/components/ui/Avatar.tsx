import { cn } from '../../utils/cn';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ src, alt, name = '', size = 'md', className, status }: AvatarProps) {
  const sizes = {
    xs:  'w-6 h-6 text-xs',
    sm:  'w-8 h-8 text-xs',
    md:  'w-10 h-10 text-sm',
    lg:  'w-12 h-12 text-base',
    xl:  'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const statusColors = {
    online:  'bg-emerald-400',
    offline: 'bg-gray-400',
    busy:    'bg-red-400',
    away:    'bg-amber-400',
  };

  const statusSizes = {
    xs:  'w-1.5 h-1.5',
    sm:  'w-2 h-2',
    md:  'w-2.5 h-2.5',
    lg:  'w-3 h-3',
    xl:  'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={cn('rounded-full object-cover ring-2 ring-white dark:ring-gray-900', sizes[size])}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <div className={cn(
          'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-900',
          getColorFromName(name),
          sizes[size]
        )}>
          {getInitials(name) || '?'}
        </div>
      )}
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900',
          statusColors[status],
          statusSizes[size]
        )} />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; avatar?: string }>;
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} src={user.avatar} name={user.name} size={size} />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center',
          'text-xs font-semibold text-gray-600 dark:text-gray-300',
          'ring-2 ring-white dark:ring-gray-900',
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
