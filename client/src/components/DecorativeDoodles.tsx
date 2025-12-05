/**
 * Decorative Doodles Component
 * Adds animated SVG doodles to pages for visual interest
 */

interface DecorativeDoodlesProps {
  variant?: 'light' | 'dark' | 'primary';
  density?: 'low' | 'medium' | 'high';
}

export function DecorativeDoodles({ variant = 'primary', density = 'medium' }: DecorativeDoodlesProps) {
  const colorClass = {
    light: 'text-gray-300',
    dark: 'text-gray-700',
    primary: 'text-primary-300',
  }[variant];

  const showAll = density === 'high';
  const showMedium = density === 'medium' || density === 'high';

  return (
    <>
      {/* Doodle 1 - Top Right (Floating) */}
      <div className={`absolute top-20 right-10 lg:right-20 w-24 h-24 lg:w-32 lg:h-32 -z-10 animate-float ${colorClass}/40`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20,50 Q30,20 50,30 T80,50 Q70,80 50,70 T20,50" className="animate-pulse-slow" />
          <circle cx="35" cy="45" r="3" fill="currentColor" />
          <circle cx="65" cy="55" r="3" fill="currentColor" />
          <path d="M40,60 Q50,65 60,60" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Doodle 2 - Bottom Left (Sliding) */}
      {showMedium && (
        <div className={`absolute bottom-20 left-10 lg:left-20 w-20 h-20 lg:w-28 lg:h-28 -z-10 animate-slide ${colorClass}/30`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M30,30 Q50,10 70,30 Q50,50 30,70 Q10,50 30,30" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <path d="M20,50 L80,50" strokeWidth="1.5" />
            <path d="M50,20 L50,80" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* Doodle 3 - Top Left (Rotating) */}
      {showMedium && (
        <div className={`absolute top-40 left-10 lg:left-20 w-16 h-16 lg:w-24 lg:h-24 -z-10 animate-rotate ${colorClass}/25`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="30" />
            <path d="M50,20 L50,50 L70,70" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Doodle 4 - Center Right (Bouncing) */}
      {showAll && (
        <div className={`absolute top-1/2 right-32 lg:right-40 w-18 h-18 lg:w-24 lg:h-24 -z-10 animate-bounce-slow ${colorClass}/30`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M50,20 L30,60 L50,50 L70,60 Z" />
            <circle cx="50" cy="35" r="3" fill="currentColor" />
            <path d="M40,45 Q50,50 60,45" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* Doodle 5 - Bottom Right */}
      {showAll && (
        <div className={`absolute bottom-32 right-32 lg:right-48 w-32 h-32 lg:w-40 lg:h-40 -z-10 animate-move ${colorClass}/35`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20,20 Q30,10 40,20 T60,20 T80,20" className="animate-pulse-slow" />
            <path d="M20,40 Q30,30 40,40 T60,40 T80,40" className="animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
            <path d="M20,60 Q30,50 40,60 T60,60 T80,60" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
            <circle cx="40" cy="20" r="2" fill="currentColor" />
            <circle cx="60" cy="20" r="2" fill="currentColor" />
            <circle cx="80" cy="20" r="2" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Doodle 6 - Middle Left */}
      {showAll && (
        <div className={`absolute top-1/3 left-16 w-20 h-20 lg:w-28 lg:h-28 -z-10 animate-float ${colorClass}/20`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M50,10 Q70,30 50,50 Q30,70 50,90" className="animate-pulse-slow" />
            <circle cx="50" cy="30" r="4" fill="currentColor" />
            <circle cx="50" cy="70" r="4" fill="currentColor" />
          </svg>
        </div>
      )}
    </>
  );
}
