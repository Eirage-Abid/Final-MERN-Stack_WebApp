# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Directory structure:
└── final-mern-app/
    ├── api/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js
    │   └── src/
    │       ├── app.js
    │       ├── config/
    │       │   ├── connectDB.js
    │       │   └── env.js
    │       ├── middleware/
    │       │   ├── auth.js
    │       │   └── errorHandler.js
    │       └── modules/
    │           ├── auth/
    │           │   ├── auth.controller.js
    │           │   ├── auth.model.js
    │           │   ├── auth.routes.js
    │           │   └── auth.zod.js
    │           └── tasks/
    │               ├── task.controller.js
    │               ├── task.model.js
    │               └── task.routes.js
    └── web/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── public/
        │   └── vite.svg
        ├── src/
        │   ├── App.css
        │   ├── App.jsx.jsx
        │   ├── api/
        │   │   ├── auth.js
        │   │   ├── client.js
        │   │   └── tasks.js
        │   ├── assets/
        │   │   └── react.svg
        │   ├── components/
        │   │   └── ProtectedRoute.jsx
        │   ├── hooks/
        │   │   └── useAuth.jsx
        │   ├── index.css
        │   ├── main.jsx
        │   ├── pages/
        │   │   ├── Dashboard.jsx
        │   │   ├── Login.jsx
        │   │   ├── Signup.jsx
        │   │   ├── TaskDetail.jsx
        │   │   └── TaskForm.jsx
        │   ├── router/
        │   │   └── AppRouter.jsx
        │   └── schemas/
        │       ├── auth.schema.js
        │       └── task.schema.js
        └── vite.config.js