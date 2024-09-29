<h1>Descripcion del proyecto</h1>
<p>
**QuickDineHub** es una plataforma de delivery de comida diseñada para facilitar la interacción entre comensales y restaurantes. Su objetivo es ofrecer una experiencia intuitiva y eficiente para que los usuarios puedan explorar un variado catálogo de productos, realizar pedidos de manera rápida y gestionar su experiencia de compra desde un solo lugar.

QuickDineHub Web también está enfocada en la mejora continua, incorporando funcionalidades como la recopilación de retroalimentación de usuarios y la implementación de una Progressive Web App (PWA) para optimizar la experiencia en dispositivos móviles. Con un diseño responsivo y amigable, QuickDineHub busca convertirse en la opción preferida para el servicio de comida a domicilio.
</p>


<h3>Objetivos:</h3>

- Generar la PWA (Progressive Web App) de la página web de QuickDineHub, permitiendo que los usuarios accedan a la plataforma desde dispositivos móviles como si fuera una aplicación nativa, con soporte offline y notificaciones push para mejorar la interacción y retención de usuarios.

- Desarrollar el MVP (Minimum Viable Product) de la página web, asegurando que todas las funcionalidades principales estén disponibles para los comensales y restaurantes, con una interfaz intuitiva y un flujo de trabajo eficiente que permita realizar pedidos, gestionar menús y administrar órdenes.

- Implementar una función de retroalimentación para recibir comentarios de los usuarios después del lanzamiento del MVP. Esta funcionalidad permitirá recolectar insights valiosos directamente de los comensales y restaurantes, ayudando a identificar posibles mejoras en la experiencia de usuario y en la plataforma en general.

<h3>Metodología de trabajo:</h3>
<p>
Para continuar con el desarrollo de estre proyecto se ha decidido continuar utilizando la metodología **Scrumban**, la cual es una combinación de Scrum y Kanban, diseñada para aprovechar lo mejor de ambas metodologías ágiles. A diferencia de Scrum, donde el trabajo se organiza en sprints (ciclos de tiempo predefinidos), en Scrumban no hay sprints fijos. En su lugar, el flujo de trabajo se gestiona a través de un tablero Kanban, que permite visualizar las tareas en progreso y ajustar las prioridades en tiempo real. Esto otorga más flexibilidad al equipo, ya que las tareas se extraen del backlog según su prioridad y la capacidad del equipo en ese momento.
</p>

<h1>Herramienta de control de versiones</h1>
<p>
Para el control de versiones del proyecto se seleccionaron las herramientas **Git y GitHub**, ya que ofrecen una gestión eficiente y robusta del código fuente, facilitando la colaboración entre los miembros del equipo. Git permite un seguimiento preciso de los cambios realizados en el código, lo que hace sencillo revertir a versiones anteriores si es necesario, y manejar ramas para el desarrollo de nuevas funcionalidades sin afectar la versión estable del proyecto. Por otro lado, GitHub proporciona un entorno colaborativo en línea, donde se pueden alojar repositorios, revisar y fusionar cambios mediante pull requests, y mantener una documentación clara del historial del proyecto. Además, ambas herramientas son ampliamente utilizadas en la comunidad de desarrollo, lo que garantiza una curva de aprendizaje accesible y un amplio soporte de la comunidad. En conjunto, Git y GitHub son fundamentales para mantener la integridad del código, fomentar la colaboración y asegurar un flujo de trabajo ágil y organizado en el desarrollo de QuickDineHub-Movil.
</p>

<h1>Estrategia de versionamiento y gestión de ramas:</h1>
<p>
La estrategia de versionamiento **GitHub Flow** es adecuada para el proyecto QuickDineHub-Movil, ya que se adapta perfectamente a un equipo pequeño y permite un flujo de trabajo ágil y sencillo. Con solo dos miembros en el equipo, GitHub Flow facilita la colaboración y la gestión de cambios, minimizando la complejidad del control de versiones. Esta estrategia se centra en la creación de ramas cortas y temporales para desarrollar nuevas características o correcciones de errores, lo que permite implementar cambios de manera rápida y continua. Además, la integración de Jira para el control de ramas y commits asegura que el progreso y las tareas estén bien documentados y alineados con los objetivos del proyecto.
</p>

- Creación de una rama: Al iniciar una nueva tarea o característica, el desarrollador crea una nueva rama desde la rama principal (main). Se debe nombrar la rama de manera descriptiva, reflejando la tarea o historia de usuario correspondiente en Jira:
```
git checkout -b nombre-de-la-rama
```
- Desarrollo y commits: Realiza los cambios necesarios en el código y utiliza commits regulares para guardar el progreso. Es importante incluir mensajes de commit claros que hagan referencia a las tareas en Jira:
```
git add .
git commit -m "Descripción de los cambios realizados [JIRA-123]"
```
- Revisión de la rama: Una vez completados los cambios, el desarrollador sube la rama a GitHub. Se crea un pull request en GitHub para solicitar la revisión de la rama por parte del otro miembro del equipo. El uso de Jira permite asociar el pull request con la tarea correspondiente, facilitando la revisión:
```
git push origin nombre-de-la-rama
```
-Fusión de la rama: Después de la revisión y la aprobación de los cambios, se procede a fusionar la rama en la rama principal (main) a través de GitHub, utilizando la opción de merge en el pull request. Una vez fusionados los cambios, se puede eliminar la rama de características:
```
git branch -d nombre-de-la-rama
```
- Actualización de la rama principal: Finalmente, el desarrollador se asegura de que la rama principal esté actualizada localmente:
```
git checkout main
git pull origin main
```
<h1>Estrategia de despliegue, entornos y proceso de CI/CD:</h1>

<p>
Despliegue Continuo: En el despliegue continuo, cada cambio que pasa la revisión y pruebas se implementa en producción. Esto permite a los equipos liberar nuevas funcionalidades y correcciones de errores rápidamente y de manera frecuente.

Ventajas:
</p>

- Feedback Rápido: Los usuarios pueden ver los cambios casi de inmediato, lo que facilita la obtención de comentarios y la adaptación a las necesidades del usuario.

- Menos Riesgo: Al desplegar cambios pequeños y manejables, se reduce el riesgo de que un despliegue grande falle, lo que facilita la identificación y corrección de errores.

- Iteración Ágil: Permite un ciclo de desarrollo más ágil, con nuevas características y mejoras que llegan a los usuarios de forma regular.

<h3>Entornos: </h3>

- Desarrollo → Los cambios se realizan y se realizan pruebas unitarias.
- Pruebas (QA) → Se hacen pruebas de integración y funcionalidad.
- Producción → Se despliegan los cambios aprobados y listos para el usuario final.


<h1>Pila tecnologica: </h1>
<p>
**MEAN**: se compone de MongoDB, Express.js, Angular y Node.js.
</p>

- Angular: Es el framework que estás utilizando para desarrollar la interfaz de usuario y manejar la lógica del frontend.
- Backend (Express y Node): Estos se encargan de manejar la lógica del servidor y la comunicación con la base de datos MongoDB.

<h1>Clonar el repositorio, instalar dependencias y ejecutar el proyecto:</h1>

- Clonar el Repositorio
```
git clone https://github.com/JJ1087/QuickDineHub-Web-F.git
cd https://github.com/JJ1087/QuickDineHub-Web-F.git
```

- Instalar Dependencias Asegúrate de tener Node.js y npm instalados. Luego, ejecuta:
```
npm install
```

- Ejecutar el Proyecto Inicia el servidor:
```
ng serve
```

- Acceder a la aplicación: Abre tu navegador y navega a http://localhost:4200 para ver la aplicación en funcionamiento.
