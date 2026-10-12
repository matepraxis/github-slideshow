# Trayectorias isogonales

Presentación web de Diego Alejandro Marulanda, Maestría en Biomatemáticas, Universidad del Quindío.

## Recorrido

Presentación de 32 diapositivas principales, 5 complementarias opcionales y un tiempo sugerido de 20 minutos (incluye el video original de 95 segundos). El deslizador de geometría es persistente. El ejemplo `y=Cx` mantiene un segundo plano y un deslizador independiente desde las rectas hasta las espirales polares.

Las ecuaciones se revelan progresivamente. La integración se desarrolla en etapas: separación de variables → ecuación integral completa → descomposición → primitivas. El gráfico de la espiral se prolonga hacia el origen, al cual **se aproxima sin alcanzarlo**.

## Fuentes utilizadas

- Piskunov, N. (1977). *Cálculo diferencial e integral*, tomo II. Mir, § 15. Fundamentación teórica de la demostración.
- Trujillo Salazar, C. A. (2026). *ED 1.7. EDO homogéneas*. Apuntes de clase, Universidad del Quindío. Sustitución homogénea e integración.
- Galanin, M. P., y Feodorova, N. A. (2017). *Reinforcement of Planar Constructions along Isogonal Trajectories*. Keldysh Institute Preprint 33. https://doi.org/10.20948/prepr-2017-33
- Feodorova, N. (2019). *Determination of Fiber-Structure for the Effective Reinforcement of Planar Composite-Material Constructions*. *Materials Science Forum*, 945, 338–343. https://doi.org/10.4028/www.scientific.net/MSF.945.338
- Raup, D. M. (1966). Modelo de expansión radial. Complemento opcional, no presentado como evidencia del estudio de materiales.

La construcción y adaptación de la demostración es trabajo del expositor a partir de Piskunov; no se cita el documento manuscrito propio como una fuente independiente. No se incluye la referencia a Escobar.

## Aplicación científica

Se presentan el problema de refuerzo de materiales compuestos, tres reconstrucciones matemáticas de las distribuciones radiales e isogonales para `k=1`, `k=2` y `k=3`, el tipo de resultado matemático en el preprint de 2017 y la continuidad del trabajo en 2019. Cada caso incluye un enlace al texto original.

Las diapositivas de k=1, k=2 y k=3 presentan recortes de las **figuras originales 10, 11 y 12** del preprint de Galanin y Feodorova (2017), p. 10 del PDF, con atribución visible. Los demás gráficos de la aplicación son reconstrucciones matemáticas propias, distinguidas expresamente. Fuente: https://www.keldysh.ru/papers/2017/prep2017_33.pdf.

## Uso

Abrir `isogonales/dist/index.html` (sitio estático). KaTeX y fuentes se incluyen localmente. Los enlaces bibliográficos requieren internet.

- Flechas: revelar/retroceder pasos; al terminar pasa a la diapositiva siguiente.
- RePág/AvPág: salto por diapositivas.
- Mayús + flechas: etapa de geometría de la demostración.
- Deslizadores: construcción de la demostración y del ejemplo.
- N: notas; I: índice; F: pantalla completa.

## Pruebas

```sh
node isogonales/test.cjs
node isogonales/test-ui.cjs
node isogonales/test-latex.cjs
node isogonales/test-examples.cjs
node isogonales/test-radial.cjs
node isogonales/test-application.cjs
node --check isogonales/dist/app.js
```

GitHub Actions ejecuta las pruebas tras las actualizaciones. Las pruebas automáticas no sustituyen la revisión visual real en escritorio y tablet. Los PR deben revisarse antes de fusionarse o desplegarse.
