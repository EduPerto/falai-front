# 🎨 Design System - Inspirado em Astro.build

## Paleta de Cores

### Cores Principais
```css
--background: #ffffff (branco)
--background-dark: #0d0f14 (navy escuro)
--background-hover: #f2f6fa (azul claro)

--text-primary: #ffffff (branco em dark mode)
--text-secondary: #bfc1c9 (cinza claro)
--text-dark: #0d0f14 (escuro)

--border: #858b9833 (cinza transparente)
--border-dark: #2c2c2c (cinza escuro)
```

### Cores de Acento
```css
--accent-purple: #bc52ee
--accent-blue: #3245ff
--accent-teal: #40debf
--accent-gray: #858b98
```

### Gradientes
```css
--gradient-primary: linear-gradient(270deg, #bc52ee1a 100%, #3245ff4d)
--gradient-radial: radial-gradient(3337.59% 50% at 50% 50%, #3245ff, #bc52ee00)
--gradient-teal: linear-gradient(270deg, #40debf4d, #334ba94d)
```

## Tipografia

### Pesos de Fonte
- Extra Light: 200
- Light: 290-300
- Regular: 400
- Medium: 475
- Semibold: 600
- Bold: 700

### Tamanhos
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

## Componentes

### Botões

**Primary:**
```
- Background: white
- Border: 1px transparent
- Hover: #f2f6fa
- Padding: 0.5rem 1rem
- Border radius: 0.5rem
```

**Secondary:**
```
- Background: #2c2c2c4d (transparente)
- Border: 1px #858b98
- Hover: lighter overlay
- Padding: 0.5rem 1rem
- Border radius: 0.5rem
```

**Ghost:**
```
- Background: transparent
- Border: none
- Text: white
- Hover: white overlay 10%
- Padding: 0.5rem 1rem
```

### Cards
```
- Background: white / #0d0f14 (dark)
- Border: 1px #858b9833
- Border radius: 1rem
- Padding: 1.5rem
- Shadow: subtle
```

### Inputs
```
- Background: transparent
- Border: 1px #858b98
- Border radius: 0.5rem
- Padding: 0.5rem 1rem
- Focus: blue glow
```

## Espaçamento

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

## Border Radius

- sm: 0.25rem
- base: 0.5rem
- md: 0.75rem
- lg: 1rem
- xl: 1.5rem
- full: 9999px

## Sombras

- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- base: 0 1px 3px 0 rgb(0 0 0 / 0.1)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
- xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
- glow: 0 0 20px rgb(50 69 255 / 0.3)

## Ícones

- Estilo: Outline/Linear
- Peso: 1.5-2px
- Tamanho padrão: 20px
- Cor: Herda do texto
- Sugestão: Lucide React (já em uso)

## Animações

### Hover
```css
transition: all 0.2s ease
```

### Gradientes
```css
background-size: 200% 200%
animation: gradient 3s ease infinite
```

### Fade In
```css
opacity: 0 → 1
duration: 0.3s
```

## Tema Escuro/Claro

### Modo Claro
- Background: #ffffff
- Text: #0d0f14
- Cards: white
- Borders: #858b9833

### Modo Escuro
- Background: #0d0f14
- Text: #ffffff
- Cards: #1a1d24
- Borders: #2c2c2c

## Aplicação no Sistema

### Navbar/Sidebar
- Background: Dark (#0d0f14)
- Text: White
- Hover: Gradient overlay
- Active: Blue accent

### Cards de Agente/Projeto
- Background: White
- Border: Subtle gray
- Hover: Lift effect + shadow
- Gradient accent no topo

### Botões de Ação
- Primary: Gradient blue-purple
- Secondary: Ghost style
- Danger: Red accent

### Formulários
- Inputs: Minimal border
- Focus: Blue glow
- Labels: Light gray
- Errors: Red accent

### Workflow Editor
- Canvas: Light gray (#f2f6fa)
- Nodes: White cards
- Connections: Gradient lines
- Selected: Blue glow

## Implementação Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        astro: {
          purple: '#bc52ee',
          blue: '#3245ff',
          teal: '#40debf',
          dark: '#0d0f14',
          gray: '#858b98',
          'gray-light': '#bfc1c9',
          'hover': '#f2f6fa'
        }
      },
      backgroundImage: {
        'gradient-astro': 'linear-gradient(270deg, #bc52ee1a 100%, #3245ff4d)',
        'gradient-radial': 'radial-gradient(3337.59% 50% at 50% 50%, #3245ff, #bc52ee00)',
        'gradient-teal': 'linear-gradient(270deg, #40debf4d, #334ba94d)'
      }
    }
  }
}
```
