# Trayectorias isogonales

Presentación de Diego Alejandro Marulanda, Maestría en Biomatemáticas, Universidad del Quindío.

## Revisión de octubre

El manuscrito `Versión final.pdf` (páginas 1–6) guía la demostración y el ejemplo radial. Familia conocida F morada, familia buscada H verde; f'=tan(beta), h'=tan(alpha), gamma=alpha-beta. G nombra la EDO asociada para distinguirla de F.

La ruta principal tiene 29 diapositivas y 20 minutos sugeridos, incluido el video original de 95 segundos. El índice ofrece 5 diapositivas complementarias; las flechas las omiten durante el recorrido principal. Se ha incorporado como aplicación científica propuesta el estudio experimental de Thurairajah et al. (2025), PNAS Nexus, DOI 10.1093/pnasnexus/pgaf087, que usa explícitamente curvas isogonales. El modelo de Raup continúa como complemento geométrico distinto.

## Uso

Sitio estático: abrir `dist/index.html`. KaTeX 0.19.0 y sus fuentes están incluidos; no depende de un CDN para las ecuaciones. Los enlaces bibliográficos sí requieren conexión. El video original conserva sus colores.

Flechas izquierda/derecha: revelar o retroceder un paso matemático; al agotar pasos cambian de diapositiva. RePág/AvPág: saltar de diapositiva. Mayús + flechas: construcción geométrica. N: notas. I: índice. F: pantalla completa. El deslizador conserva su etapa al navegar, volver desde ejemplos o recargar.

## Verificación

```sh
node isogonales/test.cjs
node isogonales/test-ui.cjs
node isogonales/test-latex.cjs
node isogonales/test-examples.cjs
node --check isogonales/dist/app.js
```

Las pruebas cubren identidad angular, pendientes, integración de ejemplos, soluciones constantes, persistencia, duración y compilación LaTeX. No sustituyen la revisión visual pendiente en escritorio y tablet.

## Revisión y fusión

PR #2: LaTeX y transiciones, sobre `edo-trayectorias-isogonales-2026`.
PR #3: manuscrito y geometría, sobre la rama del PR #2.
La rama `edo/ejemplos-paso-a-paso` continúa sobre el PR #3.

Son PR apilados: revisar en orden y ajustar las bases al integrarlos. No fusionar automáticamente. Render publica automáticamente los commits de `edo-trayectorias-isogonales-2026`; ninguna de las ramas de revisión debe sustituirla antes de la aprobación del expositor.

## Revelado progresivo

Cada bloque del argumento se revela de uno en uno con navegación bidireccional. La presentación conserva la etapa geométrica y el paso visible al recargar. Se respeta `prefers-reduced-motion`. La revisión visual de escala tipográfica en tablet sigue pendiente.

## Ejemplo geométrico sincronizado

El ejemplo `y=Cx` tiene un plano SVG y un deslizador propio de etapas 0–8 en las ocho láminas de resolución. Se muestran la familia de rectas, la elección `C₀=1`, la pendiente y la EDO isogonal, la sustitución homogénea, la transición de retícula cartesiana a polar, la espiral logarítmica y la verificación geométrica de 80°. Los pasos algebraicos activan la etapa visual correspondiente; se permite explorar manualmente el deslizador. No confundir una espiral matemática con mediciones biológicas.

## Aplicación científica (propuesta sujeta a revisión del expositor)

Thurairajah, K., et al. (2025). *Splash-free urinals for global sustainability and accessibility: Design through physics and differential equations*. *PNAS Nexus, 4*(4), pgaf087. https://doi.org/10.1093/pnasnexus/pgaf087

En la vista superior, el trabajo trata las proyecciones de chorros como rayos y diseña curvas isogonales que conducen a espirales logarítmicas; en el plano vertical trata trayectorias parabólicas. El ángulo crítico de incidencia cercano a 30° se refiere a las condiciones del estudio. La comparación experimental reportada llega a un 1,4 % de salpicaduras respecto del urinario comercial de referencia. La figura comparativa es un esquema construido a partir de los valores publicados, no una reproducción de mediciones crudas. Las diapositivas distinguen la espiral ilustrativa del ejemplo (80°) del diseño aplicado (cerca de 30°).

La ruta principal contiene 29 láminas, además de 5 complementos opcionales, y conserva un total sugerido de 20 minutos.

## Lista de aceptación antes de publicar

1. En escritorio y tablet, comprobar que cada flecha revela solo un paso y que RePág/AvPág cambia de diapositiva.
2. En la familia de rectas, avanzar: familia completa → selección C₀=1 y P=(2,2) → pendiente.
3. Seguir el paso algebraico y comprobar que el plano no se reconstruye ni pierde el punto P.
4. Verificar el cambio de retícula cartesiana a polar, el trazado de la espiral y la marca γ=80°.
5. Retroceder, mover el deslizador manualmente y recargar: no debe perderse la etapa guardada.
6. Comprobar la aplicación en tres láminas: aproximación 30°, rayos/isogonales, comparación experimental 1,4%; distinguir esquema de datos medidos.
7. Confirmar 20 minutos más las pausas reales del expositor y revisar el video original de 95 segundos.

El workflow de GitHub Actions es una condición automática de regresión, pero no reemplaza esta inspección visual con un navegador real.
