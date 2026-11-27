# Sprint Claro · análisis individual

**Alumno:** Joel Alexis Ramírez Ramírez. México. Nivel declarado: principiante. Respuesta del 25/11/2026, 11:08:45 a. m.

## Lo que pidió

- Proyecto: «En implementaciones de Scrum».
- Objetivo: «Lograr una Sprint Planning con Asistentes , sin reemplazar al equipo».
- Automatización deseada: análisis de HU, estimaciones, recomendaciones de asignación, riesgos, dependencias, claridad del Sprint Goal frente a las HU, y ayudas necesarias.
- No tiene una web y no indicó un diseño previo.
- Contacto facilitado: alexis.ramirez.ramirez@gmail.com.

## Necesidad interpretada

Joel necesita una estructura práctica para aprender a preparar una Sprint Planning con contexto suficiente. Un asistente útil debe poder formular preguntas sin sustituir las decisiones del equipo. Para un principiante, la primera entrega debe hacer visibles los datos que faltan y permitir revisar la selección.

Se diseñó un lienzo lila y azul eléctrico con la meta por encima del trabajo. Las historias se presentan en dos zonas de selección. El centro visual es la conversación sobre el Sprint, sin indicadores financieros ni velocidad presentada como promesa.

## Función entregada

| Necesidad | Implementación |
|---|---|
| Claridad de la meta | Sprint Goal, contexto del Product Goal y contribución de cada HU |
| Contexto para analizar HU | Título, rol, necesidad, beneficio, criterios, habilidades y notas |
| Estimación responsable | Campo opcional introducido por el equipo, unidad común y aviso de suma parcial |
| Referencia de capacidad | Cifra y supuestos humanos; comparación aritmética sin compromisos automáticos |
| Colaboración | Integrantes, habilidades, disponibilidad, participante propuesto y motivo humano |
| Dependencias | Referencias entre HU, aviso de dependencia fuera del Sprint y detección de ciclos |
| Riesgos y ayudas | Campos por HU y listado de conversación de las HU seleccionadas |
| Preparación de asistencia | Prompt TXT con seis apartados: HU, estimación, colaboración, riesgos/dependencias, relación con Sprint Goal y ayudas; incluye Sprint, equipo y backlog completo |
| Acuerdos de equipo | Plan de trabajo, Definition of Done y revisión humana |
| Continuidad | Persistencia local, respaldo JSON, restauración con vista previa, plan TXT y backlog CSV |

Se permiten HU incompletas para registrar el trabajo de refinamiento. El sistema marca ausencias; no pretende comprender semánticamente los textos. La comprobación de ciclos incluye el backlog completo para hacer visibles dependencias que todavía no están seleccionadas.

## Concordancia con la automatización solicitada

**Cobertura parcial del objetivo con asistentes.** El lienzo sí comprueba campos, sumas, dependencias y ciclos; permite registrar estimaciones y propuestas humanas. El análisis semántico de HU, las hipótesis de riesgo, las recomendaciones de participación y la discusión asistida de estimaciones se preparan en el prompt, pero no se ejecutan dentro de la web. Un prompt exportado no equivale a una recomendación ya producida.

El prompt pide opciones de estimación solo si se aportan unidad, referencias históricas comparables y contexto suficiente; de lo contrario pide aclaraciones. También solicita alternativas de colaboración justificadas, separadas de las propuestas del equipo. Ambas se someten a decisión humana, conforme al objetivo de no reemplazar al equipo.

## Reglas y decisiones de producto

La versión consultada de la Scrum Guide establece un equipo que se autogestiona y atribuye el sizing a quienes realizan el trabajo. El Sprint Backlog combina propósito, trabajo seleccionado y plan. Por eso las propuestas de participación y las estimaciones son campos humanos; la interfaz usa «selección» en lugar de presentar cada HU como compromiso irrevocable. La capacidad es una referencia local opcional.

Las casillas de rol/necesidad/beneficio, riesgos y ayudas son decisiones de facilitación de este producto, no requisitos adicionales atribuidos a Scrum.

Fuentes consultadas el 25/11/2026:
- Scrum Guide: https://scrumguides.org/scrum-guide.html
- Edición oficial vigente y traducciones: https://scrumguides.org/download.html

## Alcance actual y fase conectada

Este sitio es una herramienta local funcional. No llama a un modelo, no sincroniza equipos, no asigna personas, no crea estimaciones, no ejecuta planes y no envía correos. El correo de contacto se prepara con mailto para revisión y envío del usuario.

Para una siguiente fase se necesitan:
1. Seleccionar un equipo y producto reales, su backlog y su Definition of Done vigente.
2. Acordar qué datos pueden enviarse a qué proveedor de asistencia y con qué permisos.
3. Definir un backend con autenticación, control de acceso, historial compartido y gestión segura de credenciales fuera del navegador.
4. Elegir, si aplica, la integración autorizada con el sistema de gestión del backlog.
5. Construir respuestas propuestas que requieran revisión humana antes de modificar los registros.

No se necesita ninguna credencial para utilizar la entrega actual. No se introducen claves o tokens en el producto.

## Primer ejercicio práctico

Usar un Sprint real pequeño: registrar una meta, las fechas, una persona del equipo y una HU con criterios. Dejar su estimación vacía hasta conversar. Seleccionarla, leer la lista de temas pendientes y documentar lo acordado. Si hay una dependencia real, añadirla y comprobar cómo cambia el aviso cuando se incluye o se marca como hecha por el equipo. Exportar plan y JSON.

## Criterios de aceptación

- Las cinco páginas se abren con recursos propios y enlaces locales; las cuatro páginas principales tienen navegación activa.
- Se crea, edita, selecciona, retira y elimina una HU sin recargar ni perder el contexto guardado.
- No se permite eliminar una dependencia todavía referenciada.
- Las estimaciones quedan vacías cuando el equipo no las aporta; una suma incompleta se identifica.
- Un ciclo entre dos historias genera un tema de conversación con sus títulos.
- El prompt incluye HU fuera del Sprint y datos de integrantes sin proponer decisiones como hechos.
- Un JSON inválido no cambia el estado. Uno válido ofrece una vista previa y necesita confirmación explícita.
- Los nombres y textos se muestran como texto seguro y el CSV neutraliza fórmulas.
- La falta de localStorage deja el trabajo en memoria y permite respaldarlo.

## Límites de verificación

Se revisó la estructura HTML y los recursos; se ejecutaron pruebas de lógica y flujos sobre el JS real en Node con DOM instrumentado. Por la restricción de la sesión no se abrió navegador, servidor, capturador ni renderizador alternativo. La adaptación a móvil, el foco, los tamaños tipográficos y el movimiento reducido se implementaron y revisaron por código, sin afirmar una inspección visual realizada.
