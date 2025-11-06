'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MeteorsProps {
  number?: number;
}

export const Meteors = ({ number = 20 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Đợi component mount xong
    setMounted(true);

    const styles = [...new Array(number)].map(() => ({
      // Chỉ ở phần trên (0-40% màn hình từ trên xuống)
      top: Math.floor(Math.random() * (window.innerHeight * 0.4)) + 'px',
      // Trải random từ trái sang phải (0-100% chiều ngang)
      left: Math.floor(Math.random() * window.innerWidth) + 'px',
      // Khoảng cách delay thưa thớt (3-12 giây)
      animationDelay: Math.random() * 9 + 3 + 's',
      // Tốc độ chậm hơn (5-15 giây)
      animationDuration: Math.floor(Math.random() * 10 + 5) + 's',
    }));
    setMeteorStyles(styles);
  }, [number]);

  // Không render gì cho đến khi mounted
  if (!mounted) return null;

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            'pointer-events-none absolute h-0.5 w-0.5 rotate-[135deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] opacity-0'
          )}
          style={style}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};
