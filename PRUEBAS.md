# Verificación · Sprint Claro

Actualización: 26/11/2026. **16 de 16 grupos de pruebas aprobados.** Los doce casos iniciales y las cuatro regresiones posteriores se describen abajo.

## Repetir

Desde la carpeta de este alumno:

```sh
node pruebas/ejecutar.cjs
```

Si editas HTML, regenera antes las representaciones del DOM:

```sh
python pruebas/generar_dom.py
node pruebas/ejecutar.cjs
```

El arnés comprueba el hash del HTML para evitar probar una representación desactualizada. Solo necesita Node para repetir las pruebas entregadas; Python se usa para regenerar el DOM tras cambios. No utiliza navegador, npm, servidores ni red.

## Flujos probados

1. Estado inicial vacío y rechazo de aplicación/versión equivocada.
2. Fechas reales, fechas invertidas, decimales con coma y rechazo de NaN/Infinity/negativos.
3. Referencia de capacidad superada y suma parcial de historias.
4. Dependencia fuera del Sprint y resolución cuando el equipo la declara hecha.
5. Ciclo, dependencia inexistente, autorreferencia e identificadores duplicados.
6. Prompt completo: incluye equipo y HU no seleccionadas, conserva la decisión humana.
7. CSV con fórmulas, comillas y saltos de línea tratados de forma segura.
8. UI: guardar contexto, integrante y HU, seleccionar trabajo, generar/copiar prompt y descargar un JSON válido.
9. UI: editar HU, seleccionar y eliminar con confirmación, impedir eliminación de una dependencia.
10. UI: fechas inválidas y archivos inválidos no cambian datos; restauración válida necesita confirmación y permite cancelar.
11. UI: almacenamiento bloqueado y datos locales dañados; funcionamiento en memoria sin sobrescribir el contenido inválido.
12. UI: menú con aria-expanded y preparación de correo mediante enlace mailto codificado.

## Auditoría estática

Cinco páginas, un H1 por página, identificadores únicos, etiquetas de controles asociadas, referencias locales y fragmentos válidos, recursos CSS/fuentes existentes y estructura HTML sin cruces de etiquetas detectados. Se comprobó sintaxis de core.js y app.js con Node. No hay dependencias de otros alumnos ni CDN.

## Alcance de la evidencia

Los casos usan datos sintéticos solo en memoria del proceso de prueba. La aplicación distribuida comienza vacía. El DOM instrumentado ejecuta el JavaScript real y prohíbe escrituras innerHTML. No sustituye una prueba visual en un navegador. No se ejecutó esa prueba visual por la restricción de la sesión.


## Revisión del 26 de noviembre de 2026

Resultado vigente: **16 grupos aprobados** en las pruebas incluidas del sitio. Se añadieron regresiones para los fallos observados en esta revisión.

La suma de estimaciones y su comparación con capacidad usan los decimales de los valores guardados, evitando avisos falsos por redondeo binario. El esquema del respaldo sigue siendo versión 1. Los formularios con cambios pendientes deben guardarse o descartarse antes de generar/exportar/restaurar. Las selecciones del tablero se mantienen coherentes con una HU en edición. Si cambias un borrador de contacto, debes prepararlo otra vez.

Se regeneró la fixture DOM desde herramientas.html después de añadir los controles. Se verificaron rutas, anclas, IDs, navegación activa, fuentes locales y sintaxis de estilos por código. Sin navegador, renderizador, servidor, despliegue ni envío de mensajes.


### Respaldo recuperable — revisión del 26 de noviembre

Antes de guardar se mide el JSON completo en UTF-8 con el mismo formato de descarga. Si excede 3 MB, se rechaza el cambio antes de reemplazar los datos y se muestra una explicación. El esquema de respaldo se conserva; la lectura y exportación de datos anteriores siguen disponibles. Verificación adicional de este caso en el informe general.
