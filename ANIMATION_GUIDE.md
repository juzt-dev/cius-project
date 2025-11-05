# 🎨 Animation & Effects Management Guide

Hướng dẫn quản lý animations và effects trong dự án một cách chuyên nghiệp và dễ maintain.

## 📁 Cấu trúc thư mục

```
project/
├── components/
│   ├── animations/              # ⭐ Animation components
│   │   ├── ShimmerButton.tsx   # Button với shimmer effect
│   │   ├── ShinyText.tsx       # Text với shine effect
│   │   ├── index.ts            # Central exports
│   │   └── README.md           # Component documentation
│   │
│   ├── ui/                     # UI components cơ bản
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   │
│   ├── common/                 # Common utilities
│   │   └── theme-toggle.tsx
│   │
│   └── layout/                 # Layout components
│       └── Header.tsx
│
├── styles/
│   ├── globals.css             # Global styles & theme variables
│   └── animations.css          # ⭐ Tất cả CSS animations/keyframes
│
└── tailwind.config.ts          # Tailwind animations config
```

---

## 🎯 Quy tắc phân loại

### ✅ Đưa vào `components/animations/`:

- Components có animation phức tạp (nhiều keyframes)
- Effects cần CSS animations riêng
- Reusable animation components
- **Ví dụ**: ShimmerButton, ShinyText, FadeInContainer, ParallaxSection

### ✅ Đưa vào `styles/animations.css`:

- Tất cả `@keyframes` definitions
- Animation utility classes
- Reusable animation mixins
- **Ví dụ**: shimmer-slide, spin-around, fade-in, magnetic-hover

### ✅ Đưa vào `tailwind.config.ts`:

- Simple animations có thể dùng với Tailwind classes
- Animations dùng nhiều nơi với Tailwind
- **Ví dụ**: shine, pulse, bounce

### ❌ KHÔNG đưa vào `animations/`:

- UI components cơ bản (Button, Input, Card)
- Components chỉ có `transition` đơn giản
- Layout components

---

## 📦 Import Pattern

### ❌ KHÔNG làm thế này:

```tsx
import { ShimmerButton } from '@/components/animations/ShimmerButton';
import ShinyText from '@/components/animations/ShinyText';
```

### ✅ LÀM thế này:

```tsx
import { ShimmerButton, ShinyText } from '@/components/animations';
```

**Lý do**:

- Dễ refactor
- Import ngắn gọn hơn
- Single source of truth
- Tree-shaking tốt hơn

---

## 🔧 Workflow thêm animation mới

### 1. Tạo Component (nếu cần)

```tsx
// components/animations/FadeInContainer.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface FadeInContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInContainer: React.FC<FadeInContainerProps> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <div className={cn('animate-fade-in', className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};
```

### 2. Thêm CSS Animation

```css
/* styles/animations.css */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
```

### 3. Hoặc thêm vào Tailwind (nếu simple)

```typescript
// tailwind.config.ts
keyframes: {
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
},
animation: {
  'fade-in': 'fade-in 0.5s ease-out',
}
```

### 4. Export trong index.ts

```typescript
// components/animations/index.ts
export { FadeInContainer } from './FadeInContainer';
```

### 5. Document trong README

Update `components/animations/README.md` với:

- Component props
- Usage example
- CSS dependencies
- Performance notes

---

## 📝 Naming Conventions

### Components:

- **Format**: `[Effect][Element]`
- **Examples**:
  - ✅ `ShimmerButton`, `ShinyText`, `FadeInContainer`
  - ❌ `Button1`, `TextComponent`, `AnimatedDiv`

### CSS Keyframes:

- **Format**: `kebab-case`
- **Examples**:
  - ✅ `shimmer-slide`, `spin-around`, `fade-in-up`
  - ❌ `shimmerSlide`, `SPIN_AROUND`, `fadein`

### Animation Classes:

- **Format**: `animate-[name]`
- **Examples**:
  - ✅ `.animate-shimmer-slide`, `.animate-fade-in`
  - ❌ `.shimmerSlide`, `.fadeIn`

---

## ⚡ Performance Best Practices

### 1. Sử dụng GPU-accelerated properties

```css
/* ✅ GOOD - GPU accelerated */
transform: translateX(100px);
opacity: 0.5;

/* ❌ BAD - Causes reflow */
left: 100px;
width: 200px;
```

### 2. Thêm transform-gpu

```tsx
<div className="transform-gpu animate-slide-in">Content</div>
```

### 3. Sử dụng will-change (cẩn thận)

```css
.heavy-animation {
  will-change: transform, opacity;
}
```

### 4. Reduce motion support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧪 Testing Checklist

Khi thêm animation mới, check:

- [ ] Hoạt động trên desktop
- [ ] Hoạt động trên mobile (60fps)
- [ ] Dark mode compatibility
- [ ] `prefers-reduced-motion` support
- [ ] No layout shift
- [ ] Animation cleanup on unmount
- [ ] TypeScript types đầy đủ
- [ ] Documentation đầy đủ

---

## 📚 Resources & References

### Internal:

- `/components/animations/README.md` - Component docs
- `/styles/animations.css` - CSS keyframes
- `/tailwind.config.ts` - Tailwind animations

### External:

- [21st.dev](https://21st.dev/) - Animation inspiration
- [CSS Triggers](https://csstriggers.com/) - Performance reference
- [Framer Motion](https://www.framer.com/motion/) - Advanced animations
- [GSAP](https://greensock.com/gsap/) - Professional animations

---

## 🤝 Contributing

Khi thêm animation mới:

1. Follow naming conventions
2. Add to proper location (component vs CSS)
3. Export through index.ts
4. Document thoroughly
5. Test performance
6. Update this guide if needed

---

## 📞 Questions?

Nếu không chắc nên đặt animation ở đâu:

1. **Simple + reusable** → `tailwind.config.ts`
2. **Complex CSS only** → `styles/animations.css`
3. **Complex component** → `components/animations/`

---

**Last Updated**: November 5, 2025
**Maintained by**: Development Team
