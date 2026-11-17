# Tuca Idiomas

App personal para aprender idiomas desde cero (portugués, italiano, francés y alemán), como web app para iPhone. Mascota: Tuca.

- `cursos/<idioma>.json`: las unidades de cada idioma (52 por idioma según `cursos/temario.json`).
- `plantilla.html`: el código de la app. `index.html` se genera con `node tareas/unidad.js construir`.
- `tareas/`: herramienta para validar y agregar unidades, y la guía para escribirlas.
- `sw.js`: funciona sin conexión.
