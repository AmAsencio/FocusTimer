# Focus Coffee Timer

Una aplicación web mínima desarrollada en React que funciona como temporizador para mantener el foco, con una animación de una taza de café cuyo nivel baja conforme pasa el tiempo.

## Características

- Temporizador configurable (por defecto 25 minutos)
- Animación SVG simple y elegante del café reduciéndose
- Controles para iniciar, pausar y resetear el temporizador
- Código limpio y fácil de entender para aprendizaje o ampliación

## Tecnologías utilizadas

- React 18
- HTML5 y CSS3
- SVG para la animación dinámica del café
- JavaScript (Hooks: useState, useEffect)

## Instalación rápida

1. Clona el repositorio:
   cd focus-coffee-timer
   npm instal

2. Instala dependencias:
   cd focus-coffee-timer
   npm install
   
3. Ejecuta la app en modo desarrollo:
   npm start
   
4. Abre en tu navegador
   [http://localhost:3000](http://localhost:3000)

## Uso

- Haz clic en "Iniciar" para comenzar el temporizador.
- "Pausar" detiene el conteo.
- "Resetear" vuelve al tiempo inicial.
- Observa cómo el nivel del café baja durante la cuenta regresiva, proporcionando una referencia visual de tu progreso.

## Estructura de archivos
  focus-coffee-timer/
  ├─ public/
  ├─ src/
  │ ├─ CoffeeTimer.jsx # Componente principal del timer y animación
  │ ├─ App.js # Componente raíz que renderiza CoffeeTimer
  │ ├─ index.js # Main entry point
  ├─ package.json
  ├─ README.md


## Roadmap

- Añadir configurador de tiempos personalizables
- Mejorar animación con transiciones más suaves y efectos
- Deploy en GitHub Pages o Netlify para acceso online gratuito
- Agregar sonidos y notificaciones de fin de sesión

## Autor

Alejandro Asencio Montes - [aasenciomontesgmail.com](mailto:aasenciomntes@gmail.com)

## Licencia

Este proyecto está bajo la licencia MIT - consulta el archivo LICENSE para más detalles.

---

¡Gracias por probar Focus Coffee Timer! Si tienes sugerencias o quieres colaborar, abre un issue o pull request.



