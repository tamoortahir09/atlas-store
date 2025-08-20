import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        glass: {
          bg: 'var(--color-glass-bg)',
          border: 'var(--color-glass-border)',
          hover: 'var(--color-glass-hover)',
        },
        // Atlas Brand Colors
        atlas: {
          red: 'var(--atlas-red)',
          'red-hover': 'var(--atlas-red-hover)',
          white: 'var(--atlas-white)',
          'light-gray': 'var(--atlas-light-gray)',
          black: 'var(--atlas-black)',
        },
        // Store Theme Colors
        store: {
          'card-bg': 'var(--store-card-bg)',
          'card-border': 'var(--store-card-border)',
          'card-hover': 'var(--store-card-hover)',
          'text-primary': 'var(--store-text-primary)',
          'text-secondary': 'var(--store-text-secondary)',
          'text-muted': 'var(--store-text-muted)',
        },
        // Rank Colors
        rank: {
          default: {
            400: 'var(--rank-default-400)',
            500: 'var(--rank-default-500)',
            700: 'var(--rank-default-700)',
            800: 'var(--rank-default-800)',
            900: 'var(--rank-default-900)',
          },
          vip: {
            bg: 'var(--rank-vip-bg)',
            border: 'var(--rank-vip-border)',
            text: 'var(--rank-vip-text)',
            accent: 'var(--rank-vip-accent)',
            300: 'var(--rank-vip-300)',
            400: 'var(--rank-vip-400)',
            500: 'var(--rank-vip-500)',
          },
          prime: {
            bg: 'var(--rank-prime-bg)',
            border: 'var(--rank-prime-border)',
            text: 'var(--rank-prime-text)',
            accent: 'var(--rank-prime-accent)',
            400: 'var(--rank-prime-400)',
            500: 'var(--rank-prime-500)',
          },
          mythic: {
            bg: 'var(--rank-mythic-bg)',
            border: 'var(--rank-mythic-border)',
            text: 'var(--rank-mythic-text)',
            accent: 'var(--rank-mythic-accent)',
            400: 'var(--rank-mythic-400)',
            500: 'var(--rank-mythic-500)',
          },
          vanguard: {
            bg: 'var(--rank-vanguard-bg)',
            border: 'var(--rank-vanguard-border)',
            text: 'var(--rank-vanguard-text)',
            accent: 'var(--rank-vanguard-accent)',
            400: 'var(--rank-vanguard-400)',
            500: 'var(--rank-vanguard-500)',
          },
          champion: {
            bg: 'var(--rank-champion-bg)',
            border: 'var(--rank-champion-border)',
            text: 'var(--rank-champion-text)',
            accent: 'var(--rank-champion-accent)',
            400: 'var(--rank-champion-400)',
            500: 'var(--rank-champion-500)',
          },
        },
        // Gem Colors
        gem: {
          default: {
            bg: 'var(--gem-default-bg)',
            border: 'var(--gem-default-border)',
            primary: 'var(--gem-default-primary)',
            secondary: 'var(--gem-default-secondary)',
            text: 'var(--gem-default-text)',
          },
          popular: {
            bg: 'var(--gem-popular-bg)',
            text: 'var(--gem-popular-text)',
          },
          best: {
            bg: 'var(--gem-best-bg)',
            text: 'var(--gem-best-text)',
          },
          max: {
            bg: 'var(--gem-max-bg)',
            text: 'var(--gem-max-text)',
          },
          sale: {
            bg: 'var(--gem-sale-bg)',
            text: 'var(--gem-sale-text)',
            border: 'var(--gem-sale-border)',
          },
        },
        // Bundle Colors
        bundle: {
          primary: 'var(--bundle-primary)',
          secondary: 'var(--bundle-secondary)',
          'gradient-from': 'var(--bundle-gradient-from)',
          'gradient-to': 'var(--bundle-gradient-to)',
          'bg-secondary': 'var(--bundle-bg-secondary)',
          'border-primary': 'var(--bundle-border-primary)',
          'border-hover': 'var(--bundle-border-hover)',
          'gift-from': 'var(--bundle-gift-from)',
          'gift-to': 'var(--bundle-gift-to)',
        },
        // Home Page Colors
        home: {
          bg: {
            primary: 'var(--home-bg-primary)',
            secondary: 'var(--home-bg-secondary)',
            tertiary: 'var(--home-bg-tertiary)',
          },
          overlay: {
            primary: 'var(--home-overlay-primary)',
            secondary: 'var(--home-overlay-secondary)',
          },
          text: {
            'gradient-from': 'var(--home-text-gradient-from)',
            'gradient-to': 'var(--home-text-gradient-to)',
          },
        },
        // Support Colors
        support: {
          primary: 'var(--support-primary)',
          'bg-light': 'var(--support-bg-light)',
        },
      },
      boxShadow: {
        // Rank glow shadows
        'rank-vip-accent': '0 0 20px var(--rank-vip-accent)',
        'rank-prime-accent': '0 0 20px var(--rank-prime-accent)',
        'rank-mythic-accent': '0 0 20px var(--rank-mythic-accent)',
        'rank-vanguard-accent': '0 0 20px var(--rank-vanguard-accent)',
        'rank-champion-accent': '0 0 20px var(--rank-champion-accent)',
        'atlas-red': '0 0 20px var(--atlas-red)',
        // Gem glow shadows
        'gem-default-bg': '0 0 20px var(--gem-default-bg)',
        'gem-popular-bg': '0 0 20px var(--gem-popular-bg)',
        'gem-best-bg': '0 0 20px var(--gem-best-bg)',
        'gem-max-bg': '0 0 20px var(--gem-max-bg)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;