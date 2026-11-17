# Guía para escribir unidades de Tuca Idiomas

Tuca Idiomas es la app de Cesar (venezolano, de Barquisimeto, habla español y ya sabe inglés) para aprender **portugués de Brasil, italiano, francés y alemán** desde cero. Cada idioma sigue el mismo temario de 52 unidades (`cursos/temario.json`): una unidad por semana durante un año, hasta el nivel básico para viajar. Cada unidad se convierte en 5 sesiones cortas (Palabras I, Palabras II, Gramática, Historia y Reto).

## Flujo de trabajo

1. `node tareas/unidad.js estado` dice, para cada idioma, cuántas unidades hay y cuál sigue (título, gramática y vocabulario del temario).
2. Escribe la unidad siguiente como JSON en `/tmp/<idioma>.json`. Puede ser un objeto (una unidad) o un arreglo (varias unidades seguidas, en orden).
3. `node tareas/unidad.js agregar <pt|it|fr|de> /tmp/<idioma>.json` valida y guarda. Si responde **NO VÁLIDO**, no se guardó nada: corrige lo que diga y repite.
4. Cuando termines con todos los idiomas: `node tareas/unidad.js construir` (regenera `index.html`) y `node tareas/unidad.js revisar` (debe decir TODO BIEN).
5. Nunca edites `index.html` a mano: se genera desde `plantilla.html` y `cursos/*.json`.

## Forma exacta de una unidad

```json
{"t":"Título exacto del temario",
 "w":[["palabra","significado en español","pro-NUN-cia-CIÓN","🙂"], … 12 en total],
 "g":{"h":"Título de la idea gramatical",
      "b":["3 a 6 explicaciones cortas, en español"],
      "e":[["frase de ejemplo","traducción"], … 3 a 6],
      "q":[["pregunta en español",["opción A","opción B","opción C"],1], … exactamente 3]},
 "s":[["frase útil","traducción"], … exactamente 6],
 "d":[["Personaje","línea del diálogo","traducción"], … 4 a 6],
 "city":["Ciudad","🏛️",longitud,latitud,"Dato real y verificado en 1 o 2 frases",["frase en el idioma","traducción"]]}
```

## Reglas de calidad (importantes)

- **Exactitud ante todo.** Gramática, ortografía y acentos perfectos. Frases naturales, como las diría un nativo. Si dudas de algo, búscalo en la web (diccionarios como Priberam, Treccani, Larousse o Duden) antes de escribirlo.
- **Portugués = portugués de Brasil** (você, ônibus, celular, trem).
- **12 palabras nuevas** por unidad, que no existan ya en unidades anteriores de ese idioma (el validador lo revisa). Escribe la palabra como se usa (sustantivos alemanes con mayúscula). Puede ser una expresión corta («Quanto custa?»).
- **Pronunciación** escrita para un hispanohablante, con la sílaba tónica en MAYÚSCULAS y guiones (`o-bri-GA-du`, `bon-ZHUR`, `GU-ten TAK`). Usa «zh» para el sonido de la j francesa/portuguesa, «sh» para sch/ch francesa, «ü» y «ö» para esas vocales, «j» para la j española.
- **Emoji**: uno que represente bien la palabra. Evita repetir el mismo emoji dentro de la unidad.
- **Gramática**: explicada para alguien que habla español; compara con el español cuando ayude. Frases cortas.
- **Preguntas (g.q)**: una sola opción correcta, sin ambigüedad; las incorrectas, plausibles pero claramente erróneas en el registro estándar.
- **Frases (s)** y **diálogo (d)**: usa sobre todo el vocabulario de la unidad y de unidades anteriores. Al menos 4 frases y 3 líneas del diálogo de 3 palabras o más.
- **Personajes del diálogo** (para que tengan su avatar): portugués Ana, Pedro, Garçom · italiano Giulia, Marco, Cameriere · francés Claire, Lucas, Serveur · alemán Anna, Lukas, Kellner. Puedes usar otro personaje solo si la situación lo exige (por ejemplo, un médico).
- **Cuando hable de Cesar** o en primera persona del aprendiz, usa masculino (obrigado, venezuelano, Venezolaner).
- **Ciudad (city)**: una ciudad o lugar real del país (Brasil, Italia, Francia, Alemania) que todavía no se haya usado en ese idioma, con coordenadas reales (longitud, latitud con 2 decimales) y un dato **verificado en la web**. La frase de la postal debe usar algo de la unidad. Busca variedad: capitales regionales, pueblos con encanto, lugares naturales, santuarios.
- **Unidad 47 «La fe y la Misa»**: Cesar es católico. Usa los textos litúrgicos oficiales de ese idioma (Padre Nuestro, «La paz esté contigo», respuestas de la Misa), copiados exactamente de una fuente católica oficial.
- **Unidades 51 y 52**: repaso de lo más útil para el viaje; pueden reutilizar temas, pero las 12 palabras siguen siendo nuevas (expresiones útiles que falten).
- Sin HTML ni los caracteres `<` `>`.
