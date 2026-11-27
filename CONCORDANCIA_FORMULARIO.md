# Joel Alexis Ramírez Ramírez · Sprint Claro

**Contexto del formulario:** México; nivel principiante; situación web declarada: `no_tengo`.

Concordante en enfoque y preparación de la Sprint Planning; cobertura parcial de la asistencia automatizada. No hay recomendaciones de IA ejecutadas dentro del lienzo.

| Solicitud del formulario | Correspondencia comprobada | Estado | Qué falta o debe validarse |
| --- | --- | --- | --- |
| **Preparar una Sprint Planning con asistencia conservando las decisiones del equipo.** — «Lograr una Sprint Planning con Asistentes , sin reemplazar al equipo» | Permite preparar la meta, el equipo, las historias y los acuerdos del Sprint. Reúne el contexto en un plan y un prompt para continuar la conversación con un asistente externo. | Cubierto parcialmente | La preparación y las comprobaciones locales funcionan. El análisis de un asistente requiere usar el prompt fuera de la web o conectar un modelo; no se ejecuta al descargarlo. |
| **Revisar claridad, criterios y contexto de historias de usuario.** — «Análisis de HU» | Revisa si las historias seleccionadas tienen rol, necesidad, beneficio y criterios, y señala información ausente. El prompt prepara preguntas y posibles mejoras de redacción para revisión externa. | Cubierto parcialmente | El código no interpreta el significado ni determina la calidad de una historia. El análisis semántico y las propuestas de redacción se solicitan a un asistente externo y luego se revisan. |
| **Asistir al equipo para discutir estimaciones.** — «Estimaciones» | Guarda las estimaciones que aporta el equipo, suma las de las historias seleccionadas y las compara con una capacidad de referencia. El prompt pide discutir rangos orientativos solo cuando existen referencias y contexto suficientes. | Cubierto parcialmente | Se registran cifras humanas y se comparan con capacidad. Para un rango orientativo asistido hacen falta unidad, referencias históricas comparables y contexto suficiente; la aplicación no produce una estimación de IA. |
| **Proponer opciones de participación sin decidir por el equipo.** — «recomendaciones de asignaciones» | Guarda habilidades, disponibilidad, la persona propuesta y el motivo indicado por el equipo. El prompt pide alternativas justificadas para que después se conversen y acuerden. | Cubierto parcialmente | La aplicación conserva la propuesta humana. El prompt solicita alternativas justificadas según los datos del equipo; esas recomendaciones aún deben producirse en un asistente externo y acordarse con las personas. |
| **Revisar riesgos conocidos y posibles incertidumbres.** — «revisión de riesgos» | Muestra los riesgos e incertidumbres escritos en cada historia y los incluye en el plan. El prompt pide separar esos hechos de otros riesgos propuestos como hipótesis. | Cubierto parcialmente | Las reglas muestran riesgos escritos; no descubren riesgos semánticos. El prompt separa hechos de hipótesis que requieren validación. |
| **Relacionar HU y hacer visibles dependencias fuera de la selección o circulares.** — «dependencias» | Permite relacionar historias entre sí y detecta referencias inválidas, dependencias fuera de la selección y ciclos. Estas comprobaciones funcionan dentro de la herramienta. | Disponible localmente | Las relaciones se introducen manualmente. La detección de referencias inválidas, ciclos y dependencias no seleccionadas funciona localmente; inferir nuevas relaciones desde el texto requiere revisión asistida externa. |
| **Revisar cómo contribuye la selección de HU a la meta.** — «claridad de Sprint Goal VS HU comprometidas» | Guarda el Sprint Goal y la explicación de cómo contribuye cada historia seleccionada. Señala las explicaciones ausentes y prepara una revisión de esa relación con el equipo o un asistente externo. | Cubierto parcialmente | Existe trazabilidad escrita y verificación de ausencia. La coherencia semántica de meta e historias debe evaluarla el equipo o un asistente externo; el campo lleno no la acredita. |
| **Organizar apoyos necesarios y preguntas para resolverlos.** — «Ayudas que se requerirán en el Sprint» | Reúne las ayudas solicitadas y el contexto de habilidades y disponibilidad. El plan y el prompt permiten revisar los apoyos y las decisiones que falta acordar. | Cubierto parcialmente | Se reúnen ayudas registradas. Las ayudas adicionales propuestas por un asistente son hipótesis y requieren contexto, responsable y acuerdo humano. |
| **Disponer de una web y herramienta inicial utilizable por un principiante.** — «no_tengo» | Incluye una web propia con presentación, explicación del método, lienzo, contacto e instrucciones. El primer ejercicio guía al alumno para crear y respaldar un Sprint pequeño. | Disponible localmente | La carpeta estática está creada y documentada. Su publicación requiere elegir destino; no se publicó en esta revisión. |

### Ajustes realizados en esta revisión

- Prompt con seis apartados alineados a las necesidades; alcance de asistencia externa explícito; citas y resultado vigente de verificación corregidos.

### Evidencia y verificación dirigida

- 16/16 grupos aprobados tras modificar prompt().
- PASS.

**Documentación del proyecto:** [Ficha de necesidades y alcance](NECESIDADES_Y_ALCANCE.md) · [Instrucciones](LEEME.txt).
