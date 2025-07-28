'use client';

import React from 'react';

/**
 * Cosmic Theme Configuration and Components
 * Beautiful, intuitive, and cosmic aesthetic design system
 */

export const cosmicTheme = {
  colors: {
    cosmic: {
      deepSpace: '#0B0D17',
      nebula: '#1A1B3A',
      starField: '#2D1B69',
      aurora: '#4C1D95',
      moonGlow: '#7C3AED',
      celestial: '#A855F7',
      stardust: '#C084FC',
      ethereal: '#DDD6FE',
      crystal: '#F3F4F6',
      gold: '#F59E0B',
      silver: '#6B7280',
      cosmic_red: '#DC2626',
      cosmic_blue: '#2563EB',
      cosmic_green: '#059669',
      cosmic_yellow: '#D97706'
    },
    elements: {
      fire: '#FF6B6B',
      earth: '#4ECDC4',
      air: '#45B7D1',
      water: '#96CEB4'
    },
    planets: {
      sun: '#FFC107',
      moon: '#E8EAF6',
      mercury: '#FF9800',
      venus: '#E91E63',
      mars: '#F44336',
      jupiter: '#FF5722',
      saturn: '#795548',
      rahu: '#424242',
      ketu: '#616161'
    }
  },
  gradients: {
    cosmic: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    nebula: 'bg-gradient-to-r from-purple-800 via-pink-700 to-red-600',
    starfield: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900',
    aurora: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
    moonbeam: 'bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100',
    sunset: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500'
  },
  animations: {
    float: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    twinkle: 'animate-ping'
  },
  shadows: {
    cosmic: 'shadow-2xl shadow-purple-500/20',
    glow: 'shadow-lg shadow-blue-500/30',
    ethereal: 'shadow-xl shadow-pink-500/25'
  }
};

interface CosmicContainerProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ethereal';
  className?: string;
}

export const CosmicContainer: React.FC<CosmicContainerProps> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const baseClasses = 'rounded-2xl backdrop-blur-sm border transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30 border-purple-500/30 shadow-2xl shadow-purple-500/20',
    secondary: 'bg-gradient-to-br from-indigo-900/20 via-purple-800/15 to-pink-900/20 border-indigo-400/20 shadow-xl shadow-indigo-400/15',
    ethereal: 'bg-gradient-to-br from-white/10 via-purple-100/5 to-blue-100/10 border-white/20 shadow-lg shadow-white/10'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface CosmicCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  glowing?: boolean;
  className?: string;
}

export const CosmicCard: React.FC<CosmicCardProps> = ({ 
  children, 
  title, 
  icon, 
  glowing = false,
  className = '' 
}) => {
  return (
    <div className={`
      relative overflow-hidden rounded-xl
      bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-indigo-900/40
      border border-purple-400/30 backdrop-blur-sm
      transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30
      ${glowing ? 'animate-pulse shadow-lg shadow-purple-400/50' : ''}
      ${className}
    `}>
      {/* Cosmic background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-blue-500/5 pointer-events-none" />
      
      {title && (
        <div className="flex items-center space-x-3 p-4 border-b border-purple-400/20">
          {icon && <div className="text-purple-300">{icon}</div>}
          <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}
      
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
};

interface CosmicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ethereal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const CosmicButton: React.FC<CosmicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const baseClasses = `
    relative overflow-hidden rounded-xl font-semibold transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105 active:scale-95
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-600 to-blue-600 text-white
      hover:from-purple-500 hover:to-blue-500
      shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
    `,
    secondary: `
      bg-gradient-to-r from-indigo-600 to-purple-600 text-white
      hover:from-indigo-500 hover:to-purple-500
      shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
    `,
    ethereal: `
      bg-gradient-to-r from-white/20 to-purple-100/20 text-white border border-white/30
      hover:from-white/30 hover:to-purple-100/30
      shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {/* Cosmic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};

interface StarFieldProps {
  density?: number;
  animated?: boolean;
  className?: string;
}

export const StarField: React.FC<StarFieldProps> = ({ 
  density = 50, 
  animated = true,
  className = '' 
}) => {
  const stars = Array.from({ length: density }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 3
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map(star => (
        <div
          key={star.id}
          className={`absolute bg-white rounded-full ${animated ? 'animate-pulse' : ''}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

interface GlowingOrbProps {
  size?: number;
  color?: string;
  intensity?: number;
  className?: string;
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({
  size = 100,
  color = 'purple',
  intensity = 0.5,
  className = ''
}) => {
  return (
    <div
      className={`absolute rounded-full animate-pulse pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color}${Math.floor(intensity * 255).toString(16)} 0%, transparent 70%)`,
        filter: 'blur(2px)'
      }}
    />
  );
};

interface CosmicTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ethereal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const CosmicText: React.FC<CosmicTextProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent',
    accent: 'bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent',
    ethereal: 'text-white drop-shadow-lg'
  };

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  direction = 'up',
  duration = 3,
  className = ''
}) => {
  const directionClasses = {
    up: 'hover:-translate-y-2',
    down: 'hover:translate-y-2',
    left: 'hover:-translate-x-2',
    right: 'hover:translate-x-2'
  };

  return (
    <div
      className={`
        transition-transform duration-300 hover:scale-105
        ${directionClasses[direction]} ${className}
      `}
      style={{
        animation: `float ${duration}s ease-in-out infinite`
      }}
    >
      {children}
    </div>
  );
};

// Add cosmic animations to global CSS
export const cosmicAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  @keyframes cosmic-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes nebula-drift {
    0% { transform: translateX(-100%) rotate(0deg); }
    100% { transform: translateX(100%) rotate(360deg); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }
  
  .animate-cosmic-spin {
    animation: cosmic-spin 20s linear infinite;
  }
  
  .animate-nebula-drift {
    animation: nebula-drift 30s linear infinite;
  }
`;