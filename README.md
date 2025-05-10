# App gestión de tareas

Prototipo: https://v0-to-do-list-pwa-esteban0305s-projects.vercel.app/

Aplicación PWA para la organización de tareas. La aplicación permite crear, editar, eliminar y marcar tareas como completadas. Cada tarea almacena el título, descripción, fecha límite y si son recurrentes o no. Además las tareas se listan en pendientes y completadas ordenadas por fecha límite.

Otra características principal es que permite ver un resumen o reporte de tus tareas por semana o mes, se ve el progreso y se descarga el reporte en JSON.

## Integrantes

- Esteban Antonio Muñoz de la Cruz.
- Moises Alejandro Grimaldo Garcia.
- Tomas David Ortiz Sánchez.
- Alejandro Zahid Rodriguez Calvario.
- Ramón de Jesús Peregrino Larios.
- Javier Alejandro Gonzalez Peredia.
- Daniel Ramirez Chavez.
- Luis Enrique Hernandez Valdivia.
- César Julian Vergara Calvario

## Tecnologías

La aplicación está construida con Next.js, utiliza Zustand para la gestión del estado, y emplea componentes de shadcn/ui para una interfaz moderna y accesible.

## Instrucciones para compilar, desplegar y ejecutar la aplicación

### Requisitos previos

- Node.js (versión 18.0.0 o superior)
- npm (incluido con Node.js) o yarn
- Un editor de código como Visual Studio Code


### Ejecutar la aplicación en local

1. **Clonar o descargar el código fuente**

Si tienes el código en un repositorio Git:

```shellscript
git clone <url-del-repositorio>
cd task-management-pwa
```


2. **Instalar dependencias**

```shellscript
npm install
# o si usas yarn
yarn install
```


3. **Ejecutar en modo desarrollo**

```shellscript
npm run dev
# o si usas yarn
yarn dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:3000`


4. **Compilar para producción**

```shellscript
npm run build
# o si usas yarn
yarn build
```


5. **Iniciar la versión compilada**

```shellscript
npm run start
# o si usas yarn
yarn start
```

## Instrucciones para "Agregar a pantalla de inicio"

### En dispositivos Android (Chrome)

1. Abre la aplicación en Chrome
2. Toca el menú de tres puntos (⋮) en la esquina superior derecha
3. Selecciona "Añadir a pantalla de inicio" o "Instalar aplicación"
4. Sigue las instrucciones en pantalla para completar la instalación


### En dispositivos iOS (Safari)

1. Abre la aplicación en Safari
2. Toca el botón de compartir (cuadrado con flecha hacia arriba)
3. Desplázate hacia abajo y selecciona "Añadir a la pantalla de inicio"
4. Toca "Añadir" en la esquina superior derecha


### En ordenadores de escritorio (Chrome, Edge, etc.)

1. Abre la aplicación en el navegador
2. Busca el icono de instalación en la barra de direcciones (generalmente un signo "+" o un icono de descarga)
3. Haz clic en él y selecciona "Instalar"
4. También puedes hacer clic en el menú de tres puntos (⋮) y seleccionar "Instalar [nombre de la aplicación]"
