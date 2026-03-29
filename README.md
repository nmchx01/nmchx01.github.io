# Nicolás Monroy Chaparro — Portafolio Personal

> Portafolio web personal construido con HTML5, CSS3 y JavaScript vanilla. Desplegado en GitHub Pages.

🌐 **[Ver sitio en vivo →](https://nmchx01.github.io)**

---

## Sobre el proyecto

Portafolio de presentación profesional para Nicolás Monroy Chaparro, estudiante de Ingeniería de Sistemas (8.º semestre) en la Universidad Santo Tomás y practicante universitario en Seguros del Estado. El sitio refleja su stack tecnológico, proyectos académicos y experiencia en analítica de datos y automatización con IA.

## Características

- **Diseño glassmorphism** con paleta oscura y acentos cyan
- **Teclado 3D isométrico interactivo** que expone el stack tecnológico
- **Efecto vidrio roto** generado con Canvas API al hacer scroll en el hero
- **Animaciones suaves** con IntersectionObserver y CSS transitions
- **Partículas conectadas** renderizadas en canvas
- **Totalmente responsivo** — adaptado para móvil, tablet y escritorio
- **Sin dependencias externas** — HTML, CSS y JS vanilla puro

## Estructura del proyecto

```
nmchx01.github.io/
├── index.html          # Entrada principal del sitio
├── js/
│   └── main.js         # Lógica JavaScript modular (7 módulos)
├── images/             # Imágenes del portafolio y proyectos
├── files/
│   └── CV_Nicolas_Monroy.pdf   # Hoja de vida descargable
├── .gitignore
└── README.md
```

## Stack tecnológico

| Área | Tecnologías |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ |
| Animaciones | Canvas API, CSS Transforms, IntersectionObserver |
| Despliegue | GitHub Pages |
| Control de versiones | Git |

## Módulos JavaScript (`js/main.js`)

| Módulo | Descripción |
|---|---|
| `initMobileNav` | Menú hamburguesa para móvil |
| `initScrollReveal` | Animaciones de aparición al hacer scroll |
| `initNavbar` | Navbar con fondo al bajar y link activo |
| `initParallax` | Efecto parallax en el hero |
| `initParticles` | Canvas de partículas con conexiones dinámicas |
| `initShatterEffect` | Efecto de vidrio roto basado en scroll progress |
| `initTechKeyboard` | Teclado 3D interactivo con info de cada tecnología |

## Despliegue local

No requiere servidor ni dependencias. Basta con abrir `index.html` en cualquier navegador moderno, o usar Live Server en VS Code:

```bash
# Con VS Code + extensión Live Server
# Clic derecho en index.html → "Open with Live Server"
```

## Convención de commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     nueva funcionalidad
fix:      corrección de bug
style:    cambios visuales / CSS
refactor: reestructuración sin cambio de comportamiento
docs:     cambios en documentación
chore:    tareas de mantenimiento (gitignore, configs)
```

## Contacto

- **Email:** monroynico31@gmail.com
- **LinkedIn:** [nicolas-monroy-chaparro](https://www.linkedin.com/in/nicolas-monroy-chaparro-08107a375)
- **GitHub:** [@nmchx01](https://github.com/nmchx01)

---

<p align="center">© 2025 Nicolás Monroy Chaparro</p>
