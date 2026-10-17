# ClassWatch (Teacher Portal)

React + Vite, CSS Modules. Walang API call pa — UI at validation lang.

## Run
```bash
npm install
npm run dev
```

## Structure
```
src/
  components/   reusable UI (Button, Input, Header, Footer, Toast, ThemeToggle)
  layouts/      AuthLayout (hero + form side)
  pages/        Login, Register
  context/      ToastContext
  hooks/        useTheme
  utils/        validators
  styles/       global tokens (light/dark) + shared auth form styles
```

## Next step (API)
Hanapin ang `// TODO: API` sa `pages/Login/Login.jsx` at `pages/Register/Register.jsx`.
