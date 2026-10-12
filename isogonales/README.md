# Trayectorias isogonales

Presentación de Diego Alejandro Marulanda, Maestría en Biomatemáticas, Universidad del Quindío.

## Revisión de octubre

El manuscrito `Versión final.pdf` (páginas 1–6) guía la demostración y el ejemplo radial. Familia conocida F morada, familia buscada H verde; f'=tan(beta), h'=tan(alpha), gamma=alpha-beta. G nombra la EDO asociada para distinguirla de F.

La ruta principal tiene 26 diapositivas y 20 minutos sugeridos, incluido el video original de 95 segundos. El índice ofrece 5 diapositivas complementarias; las flechas las omiten durante el recorrido principal. La aplicación experimental indexada sigue pendiente de selección y no se presenta el modelo radial de Raup como sustituto de ella.

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
