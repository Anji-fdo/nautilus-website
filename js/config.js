tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1426',
          50: '#f0f3fa',
          100: '#d8e0f0',
          200: '#b0c1e1',
          300: '#7a9acc',
          400: '#3d6bb0',
          500: '#1a4a8f',
          600: '#0f3270',
          700: '#0B1E4F',
          800: '#0B1426',
          900: '#060d1a'
        },
        electric: {
          DEFAULT: '#2563EB',
          light: '#3b82f6',
          pale: '#eff6ff'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.5s ease forwards'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  }
};