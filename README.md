# BurgerFlow

Aplicación de gestión de restaurante construida con React 19 y Vite 8. La interfaz es una SPA: las vistas se renderizan en el cliente y la navegación usa la History API, de modo que las transiciones internas no recargan el documento y Atrás/Adelante restauran la ruta.

## Requisitos

- Node.js 24 (el mismo runtime configurado para el despliegue de GitHub Pages)
- npm

## Desarrollo y compilación

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` genera los archivos estáticos en `dist/`. No hay comandos configurados de lint ni pruebas automatizadas actualmente.

## Rutas y despliegue

Las rutas principales son `/dashboard`, `/pos`, `/cart`, `/inventory`, `/menu`, `/kitchen`, `/delivery`, `/reports` y `/settings`. La ruta raíz abre el panel principal y cualquier ruta no reconocida muestra una pantalla 404 dentro de la aplicación.

El carrito se mantiene en el estado compartido de la aplicación al cambiar de vista y se guarda en el almacenamiento local del navegador para conservar los productos y sus cantidades después de recargar. El control `QuantityStepper` se reutiliza en la personalización de productos y en el checkout.

La compilación genera también `dist/404.html` como fallback para que GitHub Pages pueda servir la aplicación al abrir o recargar una ruta interna. El workflow de `.github/workflows/deploy-pages.yml` publica `dist/` en GitHub Pages; Vite configura automáticamente `/React-BurgerFlow/` como base durante ese workflow. En otros hosts estáticos hay que configurar su fallback equivalente para que las rutas de la aplicación sirvan `index.html` (o `404.html`).

La aplicación actual usa datos locales de demostración y no configura APIs ni autenticación.
