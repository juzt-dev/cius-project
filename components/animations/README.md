# Animation Components

Thư mục này chứa tất cả các components có hiệu ứng animation và visual effects.

## 📁 Cấu trúc

```
animations/
├── ShimmerButton.tsx    # Button với shimmer effect (conic-gradient xoay)
├── ShinyText.tsx        # Text với shine effect (gradient chạy qua)
├── index.ts             # Central export file
└── README.md            # Documentation này
```

## 🎨 Components

### ShimmerButton

Button với hiệu ứng shimmer xoay tròn (21st.dev style).

**Props:**

- `shimmerColor` - Màu shimmer (default: `#ffffff`)
- `shimmerSize` - Kích thước shimmer (default: `0.05em`)
- `borderRadius` - Border radius (default: `100px`)
- `shimmerDuration` - Thời gian animation (default: `3s`)
- `background` - Background color (default: `rgba(0, 0, 0, 1)`)
- `className` - Custom classes
- `children` - Nội dung button

**CSS Dependencies:**

- `@keyframes shimmer-slide` (trong globals.css)
- `@keyframes spin-around` (trong globals.css)

**Usage:**

```tsx
import { ShimmerButton } from '@/components/animations';

<ShimmerButton
  shimmerColor="#ffffff"
  shimmerSize="0.1em"
  borderRadius="100px"
  shimmerDuration="2s"
  background="hsl(var(--primary))"
  className="px-4 py-2"
>
  Click Me
</ShimmerButton>;
```

---

### ShinyText

Text với hiệu ứng shine (gradient chạy qua text).

**Props:**

- `text` - Text cần hiển thị
- `disabled` - Tắt animation (default: `false`)
- `speed` - Tốc độ animation (default: `5` giây)
- `className` - Custom classes

**Tailwind Dependencies:**

- `animate-shine` class (cấu hình trong tailwind.config.ts)
- Keyframe `shine` (trong tailwind.config.ts)

**Usage:**

```tsx
import { ShinyText } from '@/components/animations';

<ShinyText text="Get Report" speed={3} />;
```

---

## 🔧 Setup Requirements

### 1. Tailwind Config (tailwind.config.ts)

Đảm bảo có keyframe `shine`:

```typescript
keyframes: {
  shine: {
    '0%': { 'background-position': '100%' },
    '100%': { 'background-position': '-100%' },
  },
},
animation: {
  shine: 'shine 5s linear infinite',
}
```

### 2. Global CSS (styles/globals.css)

Đảm bảo có animations cho ShimmerButton:

```css
@keyframes shimmer-slide {
  to {
    translate: calc(100cqw - 100%) 0;
  }
}

@keyframes spin-around {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-shimmer-slide {
  animation: shimmer-slide var(--speed) ease-in-out infinite alternate;
}

.animate-spin-around {
  animation: spin-around calc(var(--speed) * 2) linear infinite;
}
```

---

## 📝 Conventions

1. **Naming**: Tên component phải rõ ràng về chức năng animation
   - ✅ `ShimmerButton`, `ShinyText`, `FadeInContainer`
   - ❌ `Button1`, `TextComponent`, `Effect`

2. **Props**:
   - Luôn có `className` prop để customize
   - Có default values hợp lý
   - Document rõ các props

3. **Performance**:
   - Sử dụng `transform-gpu` khi có animation transform
   - Tránh animate các properties gây reflow (width, height, top, left)
   - Ưu tiên animate: transform, opacity

4. **Export**:
   - Export component qua `index.ts`
   - Export types nếu cần
   - Không export trực tiếp từ file component

---

## 🎯 Khi nào sử dụng thư mục này?

**✅ Nên đưa vào `animations/`:**

- Components có animation phức tạp
- Effects cần CSS keyframes riêng
- Components tái sử dụng với visual effects đặc biệt

**❌ Không nên đưa vào `animations/`:**

- UI components cơ bản (Button, Input, Card)
- Components chỉ có transition đơn giản
- Layout components

---

## 🚀 Adding New Animation Component

1. Tạo file component trong `animations/`
2. Thêm CSS keyframes vào `globals.css` hoặc `tailwind.config.ts`
3. Export component trong `index.ts`
4. Update README này với documentation
5. Test performance trên mobile

---

## 📚 Resources

- [21st.dev Components](https://21st.dev/) - Inspiration cho ShimmerButton
- [CSS Triggers](https://csstriggers.com/) - Check performance của CSS properties
- [Tailwind Animation](https://tailwindcss.com/docs/animation) - Official docs
