(function(root){
'use strict';
const R=(text,plain=false)=>({t:'r',text,plain});
const N=x=>typeof x==='string'?R(x):x;
const S=(...nodes)=>({t:'seq',nodes:nodes.flat().map(N)});
const F=(num,den)=>({t:'frac',num:N(num),den:N(den)});
const SUB=(base,sub)=>({t:'sub',base:N(base),sub:N(sub)});
const SUP=(base,pow)=>({t:'sup',base:N(base),pow:N(pow)});
const mf=SUB('m','f'), mh=SUB('m','h'), C0=SUB('C','0'), K0=SUB('K','0');
const f0=SUB('f',C0),h0=SUB('h',K0),T=R('tan',true),L=R('ln',true),At=R('arctan',true);
const eq=(alt,ast,color='',emphasis=false)=>({type:'eq',alt,ast,color,emphasis});
const text=value=>({type:'text',value});
const source={pisk:'Piskunov, N. (1977). Cálculo diferencial e integral, tomo II. Mir, § 15.',clase:'Trujillo Salazar, C. A. (2026). ED 1.7. Apuntes del curso, Universidad del Quindío.',trayectorias:'Trujillo Salazar, C. A. (2026). ED 1.8. Apuntes de clase: trayectorias ortogonales e isogonales, Universidad del Quindío.',raup:'Raup, D. M. (1966). Geometric analysis of shell coiling: General problems. Journal of Paleontology, 40(5), 1178–1190.'};
const slides=[
  {
    "title": "Trayectorias isogonales",
    "kind": "cover",
    "duration": 15,
    "body": [],
    "notes": "Exposición de 20 minutos sin los complementos. El índice permite acceder a estos para preguntas. La animación original dura 95 segundos.",
    "section": "Introducción"
  },
  {
    "title": "Contenido de la exposición",
    "kind": "agenda",
    "duration": 20,
    "body": [],
    "notes": "Presentar la ruta: fundamentos geométricos, demostración, ejemplo, aplicación científica y conclusiones con referencias. Cada apartado es un botón que lleva a su primera diapositiva. Destinar aproximadamente treinta segundos.",
    "section": "Introducción"
  },
  {
    "title": "Un reto antes de las ecuaciones",
    "kind": "example",
    "graph": "engineering-question",
    "duration": 35,
    "section": "Introducción",
    "body": [
      {
        "type": "text",
        "value": "Imagina que debemos diseñar una pieza ligera de avión con una abertura para una unión."
      },
      {
        "type": "text",
        "value": "Su forma altera la manera en que las cargas actúan sobre ella. Necesitamos estudiar diferentes recorridos de refuerzo."
      },
      {
        "type": "text",
        "value": "¿Trazarías líneas rectas o explorarías caminos curvos? ¿Cómo construirías estos últimos sin dibujarlos al azar?"
      },
      {
        "type": "text",
        "value": "Una regla geométrica de ángulo constante puede generar esos caminos. Veamos de dónde sale esa regla."
      }
    ],
    "notes": "SITUACIÓN DIDÁCTICA, NO RESULTADO EXPERIMENTAL. Mostrar el esquema A/B sin decir cuál es mejor. Preguntar al grupo cuál investigaría y cómo encontraría caminos curvos sin dibujar a mano. La aeronáutica es un contexto plausible de diseño, no una pieza de avión ensayada en el trabajo de 2017. Proponer que la condición isogonal resuelve la construcción de geometrías; determinar rendimiento mecánico exige un modelo físico.",
    "source": "Situación didáctica propuesta para la exposición; ilustración conceptual propia."
  },
  {
    "title": "Dos familias monoparamétricas",
    "kind": "theory",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "Sea una familia conocida de curvas:"
      },
      {
        "type": "eq",
        "tex": "F(x,y,C)=0",
        "color": "purple",
        "emphasis": false,
        "alt": "F(x,y,C)=0"
      },
      {
        "type": "text",
        "value": "Buscamos otra familia que la corte con un ángulo constante:"
      },
      {
        "type": "eq",
        "tex": "H(x,y,\\lambda)=0",
        "color": "green",
        "emphasis": false,
        "alt": "H(x,y,\\lambda)=0"
      }
    ],
    "notes": "F representa la familia conocida, morada; H representa la buscada, verde. C y lambda son parámetros diferentes. La primera gráfica aislada del desarrollo matemático conserva un color anterior: aquí se unifican las etiquetas con la gráfica conjunta.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "action": 0,
    "section": "Fundamentos geométricos"
  },
  {
    "title": "Elegimos una curva de cada familia",
    "kind": "theory",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "De la familia conocida elegimos una curva \\(f\\). De la familia buscada, una curva \\(h\\)."
      },
      {
        "type": "eq",
        "tex": "f(x)\\quad\\text{y}\\quad h(x)",
        "alt": "f(x)\\quad\\text{y}\\quad h(x)",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Ambas se encuentran en un punto regular \\(P=(x_0,y_0)\\)."
      }
    ],
    "notes": "Se distinguen familia y curva particular sin escribir F(x,f(x),C0)=0 ni H(x,h(x),lambda0)=0. f conocida en morado y h buscada en verde.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Fundamentos geométricos"
  },
  {
    "title": "La curva conocida",
    "kind": "theory",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "Fijamos una curva \\(f\\) de la familia conocida."
      },
      {
        "type": "eq",
        "tex": "P=(x_0,y_0),\\qquad f(x_0)=y_0",
        "color": "purple",
        "emphasis": false,
        "alt": "P=(x_0,y_0),\\qquad f(x_0)=y_0"
      },
      {
        "type": "text",
        "value": "La curva morada será la referencia de la construcción."
      }
    ],
    "notes": "En el gráfico conocido se usa una espiral; la familia buscada son círculos concéntricos. Esta elección reproduce la orientación creciente de f y decreciente de h del desarrollo matemático.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "action": 1,
    "section": "Fundamentos geométricos"
  },
  {
    "title": "La curva buscada",
    "kind": "theory",
    "duration": 30,
    "body": [
      {
        "type": "text",
        "value": "La curva \\(h\\) también pasa por \\(P\\)."
      },
      {
        "type": "eq",
        "tex": "h(x_0)=f(x_0)=y_0",
        "color": "green",
        "emphasis": false,
        "alt": "h(x_0)=f(x_0)=y_0"
      },
      {
        "type": "text",
        "value": "La condición isogonal exige el mismo ángulo entre tangentes en cada intersección regular."
      }
    ],
    "notes": "Compartir un punto no basta: debe mantenerse el ángulo al cortar todas las curvas de la familia conocida.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "action": 2,
    "section": "Fundamentos geométricos"
  },
  {
    "title": "¿Por qué trazamos las tangentes?",
    "kind": "theory",
    "duration": 30,
    "body": [
      {
        "type": "text",
        "value": "En la intersección regular \\(P\\), cada curva derivable tiene una recta tangente."
      },
      {
        "type": "text",
        "value": "La derivada en \\(x_0\\) es la pendiente de esa tangente."
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x_0)=\\tan\\beta",
        "alt": "m_f=f^{\\prime}(x_0)=\\tan\\beta",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "eq",
        "tex": "h^{\\prime}(x_0)=\\tan\\alpha",
        "alt": "m_h=h^{\\prime}(x_0)=\\tan\\alpha",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Por la condición isogonal, el ángulo entre las tangentes se mantiene constante."
      }
    ],
    "notes": "Justificar las rectas tangentes a partir de la interpretación geométrica de la derivada. Beta corresponde a la conocida, alpha a la buscada; gamma es su diferencia.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "action": 3,
    "section": "Fundamentos geométricos"
  },
  {
    "title": "El ángulo constante",
    "kind": "theory",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "Medimos las inclinaciones de las tangentes desde el eje horizontal positivo."
      },
      {
        "type": "eq",
        "tex": "\\gamma=\\alpha-\\beta",
        "alt": "\\gamma=\\alpha-\\beta",
        "color": "orange",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "La diferencia angular es constante en cada intersección regular: esa es la condición isogonal."
      }
    ],
    "notes": "No incluir la comprobación numérica 135=55+80; explicar únicamente la relación geométrica y orientar al punto P en la figura.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "action": 4,
    "section": "Fundamentos geométricos"
  },
  {
    "title": "Tangente de una diferencia",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Como \\(\\gamma=\\alpha-\\beta\\), aplicamos la identidad trigonométrica de diferencia."
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\tan(\\alpha-\\beta)",
        "alt": "\\tan\\gamma=\\tan(\\alpha-\\beta)",
        "color": "orange",
        "emphasis": false
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}",
        "alt": "\\tan\\gamma=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}",
        "color": "",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Sustituyendo las pendientes de las dos tangentes:"
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\frac{h^{\\prime}(x)-f^{\\prime}(x)}{1+h^{\\prime}(x)f^{\\prime}(x)}",
        "alt": "\\tan\\gamma=\\frac{h^{\\prime}(x)-f^{\\prime}(x)}{1+h^{\\prime}(x)f^{\\prime}(x)}",
        "color": "orange",
        "emphasis": true
      }
    ],
    "notes": "Aplicar la identidad de diferencia, no de suma. Las derivadas se evalúan en la intersección; se omite el subíndice para seguir la escritura del desarrollo matemático.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "La derivada de la curva buscada",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Escribimos \\(h^{\\prime}(x)=y^{\\prime}\\) y \\(k=\\tan\\gamma\\)."
      },
      {
        "type": "eq",
        "tex": "k=\\frac{y^{\\prime}-f^{\\prime}(x)}{1+y^{\\prime}f^{\\prime}(x)}",
        "color": "",
        "emphasis": false,
        "alt": "k=\\frac{y^{\\prime}-f^{\\prime}(x)}{1+y^{\\prime}f^{\\prime}(x)}"
      },
      {
        "type": "eq",
        "tex": "k\\left(1+y^{\\prime}f^{\\prime}(x)\\right)=y^{\\prime}-f^{\\prime}(x)",
        "color": "",
        "emphasis": false,
        "alt": "k\\left(1+y^{\\prime}f^{\\prime}(x)\\right)=y^{\\prime}-f^{\\prime}(x)"
      },
      {
        "type": "eq",
        "tex": "k+ky^{\\prime}f^{\\prime}(x)=y^{\\prime}-f^{\\prime}(x)",
        "color": "",
        "emphasis": false,
        "alt": "k+ky^{\\prime}f^{\\prime}(x)=y^{\\prime}-f^{\\prime}(x)"
      }
    ],
    "notes": "y prima corresponde ahora a la curva desconocida h. k es la tangente del ángulo entre las curvas, no la pendiente de una de ellas. Multiplicamos y distribuimos.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "Agrupamos y despejamos",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "eq",
        "tex": "ky^{\\prime}f^{\\prime}(x)+f^{\\prime}(x)=y^{\\prime}-k",
        "color": "",
        "emphasis": false,
        "alt": "ky^{\\prime}f^{\\prime}(x)+f^{\\prime}(x)=y^{\\prime}-k"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)\\left(1+ky^{\\prime}\\right)=y^{\\prime}-k",
        "color": "",
        "emphasis": false,
        "alt": "f^{\\prime}(x)\\left(1+ky^{\\prime}\\right)=y^{\\prime}-k"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}",
        "color": "purple",
        "emphasis": true,
        "alt": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}"
      }
    ],
    "notes": "Sumamos f prima y restamos k en ambos lados; luego sacamos factor común f prima y dividimos por 1+k y prima cuando es no nulo. Este es el despeje marcado con una estrella en el desarrollo matemático.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "De la familia a su EDO",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "De la familia conocida \\(F(x,y,C)=0\\), derivamos respecto a \\(x\\) y eliminamos \\(C\\)."
      },
      {
        "type": "eq",
        "tex": "F(x,y,C)=0",
        "alt": "F(x,y,C)=0",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "La ecuación diferencial resultante se escribe con la derivada de Leibniz:"
      },
      {
        "type": "eq",
        "tex": "G\\left(x,y,\\dfrac{dy}{dx}\\right)=0",
        "alt": "G\\left(x,y,\\dfrac{dy}{dx}\\right)=0",
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Aquí \\(\\dfrac{dy}{dx}\\) representa la pendiente de la familia conocida; todavía no hemos sustituido la buscada."
      }
    ],
    "notes": "Derivar respecto a x con C fijo y eliminar C. No crear p como notación adicional. El tercer argumento de G expresa la derivada conocida en notación de Leibniz.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "EDO de las trayectorias isogonales",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "En la ecuación de la familia conocida sustituimos su pendiente por la expresión isogonal:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac{dy}{dx}\\quad\\longrightarrow\\quad\\dfrac{y'-k}{1+ky'}",
        "alt": "\\dfrac{dy}{dx}\\quad\\longrightarrow\\quad\\dfrac{y'-k}{1+ky'}",
        "color": "orange",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Conservamos \\(y'\\) dentro de la sustitución para identificar la pendiente de la familia buscada."
      },
      {
        "type": "eq",
        "tex": "G\\left(x,y,\\dfrac{y'-k}{1+ky'}\\right)=0",
        "alt": "G\\left(x,y,\\dfrac{y'-k}{1+ky'}\\right)=0",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "eq",
        "tex": "k=\\tan\\gamma",
        "alt": "k=\\tan\\gamma",
        "color": "orange",
        "emphasis": false
      }
    ],
    "notes": "La flecha indica reemplazo de argumento, no igualdad de dos derivadas. En G se sustituye dy/dx de la conocida por (y'-k)/(1+ky') de la buscada.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "Pendiente de la trayectoria",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Cuando podemos expresar explícitamente la pendiente de la familia conocida:"
      },
      {
        "type": "eq",
        "tex": "f'(x)=\\dfrac{y'-k}{1+ky'}",
        "alt": "f'(x)=\\dfrac{y'-k}{1+ky'}",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Multiplicando ambos miembros por el denominador y agrupando términos en \\(y'\\):"
      },
      {
        "type": "eq",
        "tex": "y'\\left(1-kf'(x)\\right)=f'(x)+k",
        "alt": "y'\\left(1-kf'(x)\\right)=f'(x)+k",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "eq",
        "tex": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "alt": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Es la misma relación, ahora despejada para resolver ejemplos. No se cambia de orientación: gamma=alpha-beta durante toda la presentación.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "La relación que utilizaremos",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Para el ejemplo basta con utilizar la pendiente de la familia conocida en esta relación:"
      },
      {
        "type": "eq",
        "tex": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "alt": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Después de sustituir pasaremos a \\(\\dfrac{dy}{dx}\\) para resolver e integrar la EDO de la familia buscada."
      }
    ],
    "notes": "Transición breve al ejemplo de rectas, y evitar introducciones ajenas al ejemplo.",
    "source": "Piskunov (1977), tomo II, § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Demostración matemática"
  },
  {
    "title": "Ejemplo: familia de rectas",
    "kind": "example",
    "duration": 65,
    "body": [
      {
        "type": "text",
        "value": "Partimos de las rectas que pasan por el origen."
      },
      {
        "type": "eq",
        "tex": "y=Cx",
        "alt": "y=Cx",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Elegimos \\(C_0=1\\): la recta \\(y=x\\) pasa por \\(P=(2,2)\\). Derivando respecto a \\(x\\), con \\(C\\) constante:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac{dy}{dx}=C",
        "alt": "\\dfrac{dy}{dx}=C",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Dividiendo \\(y=Cx\\) entre \\(x\\) (con \\(x\\ne0\\)) y eliminando \\(C\\):"
      },
      {
        "type": "eq",
        "tex": "\\dfrac{dy}{dx}=\\dfrac{y}{x}",
        "alt": "\\dfrac{dy}{dx}=\\dfrac{y}{x}",
        "color": "purple",
        "emphasis": true
      }
    ],
    "notes": "Con C constante, la derivada de la recta conocida es dy/dx=C. Para x no nulo, despejamos C=y/x; eliminando el parámetro queda la EDO dy/dx=y/x. El punto P y la curva seleccionada se mantienen visibles.",
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Sustituimos la pendiente conocida",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Aplicamos la relación isogonal, con \\(k=\\tan\\gamma\\). La prima corresponde a la familia buscada."
      },
      {
        "type": "eq",
        "tex": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "alt": "y'=\\dfrac{f'(x)+k}{1-kf'(x)}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Sustituimos la pendiente de las rectas conocidas \\(f'(x)=\\dfrac{y}{x}\\)."
      },
      {
        "type": "eq",
        "tex": "y'=\\dfrac{\\dfrac{y}{x}+k}{1-k\\dfrac{y}{x}}",
        "alt": "y'=\\dfrac{\\dfrac{y}{x}+k}{1-k\\dfrac{y}{x}}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Multiplicando numerador y denominador por \\(x\\):"
      },
      {
        "type": "eq",
        "tex": "y'=\\dfrac{y+kx}{x-ky}",
        "alt": "y'=\\dfrac{y+kx}{x-ky}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Durante la relación isogonal, y' nombra la pendiente desconocida. Solo tras sustituir f'(x)=y/x se cambia a notación dy/dx al resolver la EDO.",
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.8.",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Sustitución homogénea",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Para resolver esta EDO, escribimos la derivada de la curva buscada como fracción vertical:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac{dy}{dx}=\\dfrac{y+kx}{x-ky}",
        "alt": "\\dfrac{dy}{dx}=\\dfrac{y+kx}{x-ky}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Es homogénea. Hacemos la sustitución \\(z=\\dfrac{y}{x}\\), de modo que \\(y=xz\\)."
      },
      {
        "type": "eq",
        "tex": "y=xz,\\qquad \\dfrac{dy}{dx}=z+x\\dfrac{dz}{dx}",
        "alt": "y=xz,\\qquad \\dfrac{dy}{dx}=z+x\\dfrac{dz}{dx}",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Sustituyendo en la ecuación diferencial:"
      },
      {
        "type": "eq",
        "tex": "z+x\\dfrac{dz}{dx}=\\dfrac{z+k}{1-kz}",
        "alt": "z+x\\dfrac{dz}{dx}=\\dfrac{z+k}{1-kz}",
        "color": "green",
        "emphasis": false
      }
    ],
    "notes": "Aquí y' se representa por dy/dx para resolver. EDO homogénea: z=y/x, y=xz, regla del producto. ED 1.7 desarrolla este método.",
    "source": "Trujillo Salazar (2026), ED 1.7 (método de EDO homogéneas).",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Reducimos a una sola fracción",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Restando \\(z\\) a ambos lados y reduciendo al mismo denominador:"
      },
      {
        "type": "eq",
        "tex": "x\\dfrac{dz}{dx}=\\dfrac{z+k-z(1-kz)}{1-kz}",
        "alt": "x\\dfrac{dz}{dx}=\\dfrac{z+k-z(1-kz)}{1-kz}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Distribuyendo el signo menos y simplificando el numerador:"
      },
      {
        "type": "eq",
        "tex": "x\\dfrac{dz}{dx}=\\dfrac{k(1+z^2)}{1-kz}",
        "alt": "x\\dfrac{dz}{dx}=\\dfrac{k(1+z^2)}{1-kz}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Justificar el signo menos y la cancelación de z. Dominios locales.",
    "source": "Trujillo Salazar (2026), ED 1.7 (método de EDO homogéneas).",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Integración a ambos lados",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Dividiendo entre los factores correspondientes y separando variables:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac{1-kz}{k(1+z^2)}\\,dz=\\dfrac{dx}{x}",
        "alt": "\\dfrac{1-kz}{k(1+z^2)}\\,dz=\\dfrac{dx}{x}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Integramos a ambos lados de la igualdad:"
      },
      {
        "type": "eq",
        "tex": "\\int\\dfrac{1-kz}{k(1+z^2)}\\,dz=\\int\\dfrac{dx}{x}",
        "alt": "\\int\\dfrac{1-kz}{k(1+z^2)}\\,dz=\\int\\dfrac{dx}{x}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Descomponemos el primer miembro en dos integrales:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac1k\\int\\dfrac{dz}{1+z^2}-\\int\\dfrac{z\\,dz}{1+z^2}=\\int\\dfrac{dx}{x}",
        "alt": "\\dfrac1k\\int\\dfrac{dz}{1+z^2}-\\int\\dfrac{z\\,dz}{1+z^2}=\\int\\dfrac{dx}{x}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Aplicando las primitivas \\(\\arctan z\\), \\(\\frac12\\ln(1+z^2)\\) y \\(\\ln|x|\\):"
      },
      {
        "type": "eq",
        "tex": "\\ln|x|=\\dfrac1k\\arctan z-\\dfrac12\\ln(1+z^2)+C_1",
        "alt": "\\ln|x|=\\dfrac1k\\arctan z-\\dfrac12\\ln(1+z^2)+C_1",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Revelar separacion, ecuación integral completa, descomposición y primitivas, manteniendo fracciones verticales \\dfrac en modo de exhibición.",
    "source": "Trujillo Salazar (2026), ED 1.7 (método de EDO homogéneas).",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Regresamos a las variables originales",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Volviendo a las variables originales mediante \\(z=\\frac yx\\):"
      },
      {
        "type": "eq",
        "tex": "\\ln|x|=\\dfrac1k\\arctan\\left(\\dfrac yx\\right)-\\dfrac12\\ln\\left(1+\\dfrac{y^2}{x^2}\\right)+C_1",
        "alt": "\\ln|x|=\\dfrac1k\\arctan\\left(\\dfrac yx\\right)-\\dfrac12\\ln\\left(1+\\dfrac{y^2}{x^2}\\right)+C_1",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Aplicando las propiedades de los logaritmos y cancelando \\(\\ln|x|\\) a ambos lados:"
      },
      {
        "type": "eq",
        "tex": "\\dfrac12\\ln(x^2+y^2)=\\dfrac1k\\arctan\\left(\\dfrac yx\\right)+C_1",
        "alt": "\\dfrac12\\ln(x^2+y^2)=\\dfrac1k\\arctan\\left(\\dfrac yx\\right)+C_1",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Recordar propiedad del logaritmo de un cociente y cancelación.",
    "source": "Trujillo Salazar (2026), ED 1.7 (método de EDO homogéneas).",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Pasamos a coordenadas polares",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "En una rama angular continua, sustituimos \\(r=\\sqrt{x^2+y^2}\\) y \\(\\theta=\\arctan(y/x)\\)."
      },
      {
        "type": "eq",
        "tex": "\\ln r=\\dfrac{\\theta}{k}+C_1",
        "alt": "\\ln r=\\dfrac{\\theta}{k}+C_1",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Exponenciando ambos lados y escribiendo \\(A=e^{C_1}>0\\):"
      },
      {
        "type": "eq",
        "tex": "r=Ae^{\\theta/k},\\qquad A>0",
        "alt": "r=Ae^{\\theta/k},\\qquad A>0",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Ahora la gráfica abandona la retícula cartesiana y utiliza coordenadas polares."
      }
    ],
    "notes": "El ángulo polar es local y se prolonga por continuidad; A=e^C1 es positivo.",
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "Verificamos el ángulo constante",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Comprobamos que la curva verde corta cada recta radial con el mismo ángulo."
      },
      {
        "type": "eq",
        "tex": "r=Ae^{\\theta/k}\\quad\\Longrightarrow\\quad \\dfrac{dr}{d\\theta}=\\dfrac r k",
        "alt": "r=Ae^{\\theta/k}\\quad\\Longrightarrow\\quad \\dfrac{dr}{d\\theta}=\\dfrac r k",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Dividiendo la componente transversal \\(r\\) entre la radial \\(dr/d\\theta\\):"
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\dfrac{r}{dr/d\\theta}=k",
        "alt": "\\tan\\gamma=\\dfrac{r}{dr/d\\theta}=k",
        "color": "orange",
        "emphasis": true
      }
    ],
    "notes": "La tangente polar tiene componente radial dr/dθ y transversal r.",
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "El ángulo constante en movimiento",
    "kind": "video",
    "duration": 95,
    "body": [
      {
        "type": "text",
        "value": "Rectas radiales y espirales logarítmicas con \\(\\gamma=80^\\circ\\)."
      }
    ],
    "notes": "Reproducir la animación propia completa de95 segundos. Señalar el radio, la tangente y la conservación del ángulo mientras se mueve el punto. El video no tiene audio, lo que permite explicarlo durante la reproducción. Se utiliza el video v7 en 4K UHD, con notación coherente con la demostración: y=Cx, k=tan(gamma), r=A exp(theta/k). Sus colores son independientes de la leyenda de las gráficas interactivas.",
    "source": "Animación del expositor, versión 7 (4K UHD), 95 segundos",
    "section": "Ejemplo desarrollado"
  },
  {
    "title": "¿Qué hicieron los investigadores con esta idea?",
    "kind": "example",
    "graph": "materials-intro",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "Volvamos a la pieza con abertura. El primer paso no es prometer que un recorrido será mejor, sino describir distintas formas de organizar sus refuerzos."
      },
      {
        "type": "text",
        "value": "Galanin y Feodorova (2017) construyeron configuraciones curvas mediante trayectorias isogonales sobre líneas de referencia."
      },
      {
        "type": "text",
        "value": "Después formularon sistemas de ecuaciones diferenciales para analizar las deformaciones de esas estructuras."
      },
      {
        "type": "text",
        "value": "La aportación es doble: generar configuraciones geométricas y disponer de un modelo matemático para estudiarlas."
      }
    ],
    "notes": "El problema didáctico de avión motiva la pregunta; el artículo original estudia construcciones planas en elasticidad lineal anisótropa y no homogénea, no un ensayo aeronáutico concreto. Diferenciar etapa geométrica de análisis mecánico. Comenzar recordando: ¿cómo decidir dónde van las líneas? Del reto a la familia isogonal y a la formulación de ecuaciones.",
    "source": "Galanin y Feodorova (2017), Preprint 33.",
    "referenceUrl": "https://www.keldysh.ru/papers/2017/prep2017_33.pdf",
    "section": "Aplicación científica"
  },
  {
    "title": "De la geometría al diseño: figura 10",
    "kind": "example",
    "graph": "materials-k1",
    "duration": 15,
    "body": [
      {
        "type": "text",
        "value": "En la investigación se parte de líneas coordenadas de referencia y se construyen familias de refuerzo con direcciones isogonales."
      },
      {
        "type": "text",
        "value": "La figura 10 muestra una configuración publicada para el valor \\(k=1\\)."
      },
      {
        "type": "eq",
        "tex": "k=1",
        "alt": "k=1",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "El parámetro de la figura pertenece al modelo científico del artículo; no debemos identificarlo automáticamente con nuestra constante \\(k=\\tan\\gamma\\)."
      }
    ],
    "notes": "Es una figura de la publicación de 2017, no una reconstrucción. Subrayar que la convención de parámetros del artículo debe interpretarse en su modelo; nuestra k=tan gamma fue definida en el ejemplo de la exposición y no implica que la k del artículo tenga el mismo significado. Referencia PDF página 10, figura 10.",
    "source": "Galanin y Feodorova (2017), Preprint 33, figura 10.",
    "referenceUrl": "https://www.keldysh.ru/papers/2017/prep2017_33.pdf#page=10",
    "section": "Aplicación científica"
  },
  {
    "title": "Diseño isogonal: figura 11 (k=2)",
    "kind": "example",
    "graph": "materials-k2",
    "duration": 15,
    "body": [
      {
        "type": "text",
        "value": "Mantenemos el mismo problema de diseño, pero observamos el caso identificado como \\(k=2\\)."
      },
      {
        "type": "eq",
        "tex": "k=2",
        "alt": "k=2",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "La figura 11 muestra otra disposición de fibras: comparar visualmente sus trayectorias con la figura anterior."
      }
    ],
    "notes": "Figura 11 original del preprint de 2017. Comparación geométrica cualitativa. No convertir el valor k del artículo en el ángulo de nuestras espirales ni afirmar mejor rendimiento mecánico.",
    "source": "Galanin y Feodorova (2017), Preprint 33, figura 11.",
    "referenceUrl": "https://www.keldysh.ru/papers/2017/prep2017_33.pdf#page=10",
    "section": "Aplicación científica"
  },
  {
    "title": "Diseño isogonal: figura 12 (k=3)",
    "kind": "example",
    "graph": "materials-k3",
    "duration": 15,
    "body": [
      {
        "type": "text",
        "value": "La figura 12 presenta otra configuración de refuerzo, identificada por los autores con \\(k=3\\)."
      },
      {
        "type": "eq",
        "tex": "k=3",
        "alt": "k=3",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Las tres ilustraciones muestran cómo el método genera distintas geometrías de refuerzo, que después se incorporan al modelo mecánico."
      }
    ],
    "notes": "Figura 12 original del preprint de 2017. Hacer explícito el hilo: trayectorias geométricas → direcciones de fibras → sistema diferencial que modela deformaciones.",
    "source": "Galanin y Feodorova (2017), Preprint 33, figura 12.",
    "referenceUrl": "https://www.keldysh.ru/papers/2017/prep2017_33.pdf#page=10",
    "section": "Aplicación científica"
  },
  {
    "title": "¿Qué obtuvieron matemáticamente?",
    "kind": "example",
    "graph": "materials-results",
    "duration": 35,
    "body": [
      {
        "type": "text",
        "value": "El estudio no se limita a dibujar fibras: formula sistemas diferenciales para estudiar deformaciones en placas reforzadas."
      },
      {
        "type": "text",
        "value": "Ejemplo de la tabla 1: matriz de cobre y refuerzo de wolframio."
      },
      {
        "type": "eq",
        "tex": "\\omega_1=\\omega_2=0.2",
        "alt": "\\omega_1=\\omega_2=0.2",
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Con \\(k=1\\), la ecuación característica tiene dos raíces reales y un par complejo conjugado."
      },
      {
        "type": "text",
        "value": "Con \\(k=3\\), tiene cuatro raíces reales. La comparación informa sobre el tipo del sistema, no prueba por sí misma una mejora de resistencia."
      }
    ],
    "notes": "Tabla 1, página 16 del PDF original. Explicar que el estudio obtiene ODE para deformaciones; sus raíces características cambian con materiales/estructura y el parámetro del modelo. No inferir un resultado experimental sobre capacidad de carga.",
    "source": "Galanin y Feodorova (2017), tabla 1.",
    "referenceUrl": "https://www.keldysh.ru/papers/2017/prep2017_33.pdf#page=16",
    "section": "Aplicación científica"
  },
  {
    "title": "Investigación posterior: Feodorova (2019)",
    "kind": "example",
    "graph": "materials-2019",
    "duration": 25,
    "body": [
      {
        "type": "text",
        "value": "Feodorova (2019) amplió el análisis mediante un modelo bidimensional de elasticidad lineal para materiales reforzados con recorridos curvos."
      },
      {
        "type": "text",
        "value": "Comparó tres formas de organizar esos recorridos, entre ellas las trayectorias isogonales."
      },
      {
        "type": "text",
        "value": "Obtuvo soluciones particulares de problemas de contorno y presentó recomendaciones para estudiar el refuerzo de estructuras planas."
      },
      {
        "type": "text",
        "value": "Así, la geometría permite proponer recorridos; el modelo físico ayuda a examinar cómo se deformaría la pieza."
      }
    ],
    "notes": "Basado en el resumen editorial del artículo 2019 (Materials Science Forum 945, 338–343). Es continuación temática de 2017, no sostener comparaciones cuantitativas que no constan en el resumen.",
    "source": "Feodorova (2019), Materials Science Forum, 945, 338–343.",
    "referenceUrl": "https://doi.org/10.4028/www.scientific.net/MSF.945.338",
    "section": "Aplicación científica"
  },
  {
    "title": "Complemento: familia hiperbólica",
    "kind": "example",
    "duration": 0,
    "body": [
      {
        "type": "eq",
        "tex": "y(x+C)=1,\\qquad y\\ne0",
        "color": "purple",
        "emphasis": false,
        "alt": "y(x+C)=1,\\qquad y\\ne0"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)(x+C)+y=0",
        "color": "",
        "emphasis": false,
        "alt": "f^{\\prime}(x)(x+C)+y=0"
      },
      {
        "type": "eq",
        "tex": "x+C=\\frac1y\\quad\\Longrightarrow\\quad f^{\\prime}(x)=-y^2",
        "color": "",
        "emphasis": false,
        "alt": "x+C=\\frac1y\\quad\\Longrightarrow\\quad f^{\\prime}(x)=-y^2"
      },
      {
        "type": "eq",
        "tex": "\\gamma=45^\\circ,\\quad k=1",
        "color": "",
        "emphasis": false,
        "alt": "\\gamma=45^\\circ,\\quad k=1"
      }
    ],
    "notes": "Derivar el producto manteniendo C fijo. Eliminar C mediante x+C=1/y. Se mantiene la misma orientación gamma=alpha-beta de la demostración.",
    "source": "Ejemplo complementario: verificación algebraica propia.",
    "graph": "hyperbola",
    "optional": true,
    "section": "Complementos"
  },
  {
    "title": "Complemento: EDO e integración",
    "kind": "example",
    "duration": 0,
    "body": [
      {
        "type": "eq",
        "tex": "y^{\\prime}=\\frac{f^{\\prime}(x)+1}{1-f^{\\prime}(x)}=\\frac{1-y^2}{1+y^2}",
        "color": "green",
        "emphasis": false,
        "alt": "y^{\\prime}=\\frac{f^{\\prime}(x)+1}{1-f^{\\prime}(x)}=\\frac{1-y^2}{1+y^2}"
      },
      {
        "type": "eq",
        "tex": "\\frac{dx}{dy}=\\frac{1+y^2}{1-y^2}=-1+\\frac{2}{1-y^2}",
        "color": "",
        "emphasis": false,
        "alt": "\\frac{dx}{dy}=\\frac{1+y^2}{1-y^2}=-1+\\frac{2}{1-y^2}"
      },
      {
        "type": "eq",
        "tex": "\\frac{2}{1-y^2}=\\frac1{1+y}+\\frac1{1-y}",
        "color": "",
        "emphasis": false,
        "alt": "\\frac{2}{1-y^2}=\\frac1{1+y}+\\frac1{1-y}"
      },
      {
        "type": "eq",
        "tex": "x+\\lambda=-y+\\ln\\left|\\frac{1+y}{1-y}\\right|",
        "color": "green",
        "emphasis": true,
        "alt": "x+\\lambda=-y+\\ln\\left|\\frac{1+y}{1-y}\\right|"
      }
    ],
    "notes": "La integración vale en intervalos que no contienen y=±1. El logaritmo de 1-y aporta un signo menos. Al dividir por 1-y² se pierden dos soluciones constantes, que se recuperan enseguida.",
    "source": "Ejemplo complementario: verificación algebraica propia.",
    "optional": true,
    "section": "Complementos"
  },
  {
    "title": "Complemento: soluciones constantes",
    "kind": "example",
    "duration": 0,
    "body": [
      {
        "type": "eq",
        "tex": "y=1\\qquad\\text{o}\\qquad y=-1",
        "color": "green",
        "emphasis": true,
        "alt": "y=1\\qquad\\text{o}\\qquad y=-1"
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}=0=\\frac{1-y^2}{1+y^2}",
        "color": "",
        "emphasis": false,
        "alt": "y^{\\prime}=0=\\frac{1-y^2}{1+y^2}"
      },
      {
        "type": "text",
        "value": "También son trayectorias de la EDO y deben conservarse."
      },
      {
        "type": "text",
        "value": "La familia original requiere \\(y\\ne0\\); trabajamos en esos dominios."
      }
    ],
    "notes": "Estas soluciones se perderían al separar variables. En la curva original la pendiente es -1 cuando y=±1, así que la trayectoria horizontal forma 45 grados con ella.",
    "source": "Ejemplo complementario: verificación algebraica propia.",
    "optional": true,
    "section": "Complementos"
  },
  {
    "title": "Complemento: verificación en un punto",
    "kind": "example",
    "duration": 0,
    "body": [
      {
        "type": "eq",
        "tex": "P=(0,2),\\quad C=\\frac12,\\quad\\lambda=-2+\\ln3",
        "color": "",
        "emphasis": false,
        "alt": "P=(0,2),\\quad C=\\frac12,\\quad\\lambda=-2+\\ln3"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(0)=-4,\\qquad h^{\\prime}(0)=-\\frac35",
        "color": "",
        "emphasis": false,
        "alt": "f^{\\prime}(0)=-4,\\qquad h^{\\prime}(0)=-\\frac35"
      },
      {
        "type": "eq",
        "tex": "\\frac{h^{\\prime}(0)-f^{\\prime}(0)}{1+h^{\\prime}(0)f^{\\prime}(0)}=1",
        "color": "orange",
        "emphasis": true,
        "alt": "\\frac{h^{\\prime}(0)-f^{\\prime}(0)}{1+h^{\\prime}(0)f^{\\prime}(0)}=1"
      },
      {
        "type": "text",
        "value": "El ángulo agudo entre tangentes es \\(45^\\circ\\)."
      }
    ],
    "notes": "Ambas curvas pasan por P. Las inclinaciones son aproximadamente beta=104,04 grados y alpha=149,04 grados. Su diferencia es 45 grados. La rama dibujada tiene y>1.",
    "source": "Ejemplo complementario: verificación algebraica propia.",
    "graph": "hyperbola-check",
    "optional": true,
    "section": "Complementos"
  },
  {
    "title": "Complemento: expansión radial",
    "kind": "example",
    "graph": "biology",
    "duration": 0,
    "body": [
      {
        "type": "eq",
        "alt": "r(θ) = r₀ W^(θ/(2π))",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "r(θ) = ",
              "plain": false
            },
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "r",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "0",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " ",
              "plain": false
            },
            {
              "t": "sup",
              "base": {
                "t": "r",
                "text": "W",
                "plain": false
              },
              "pow": {
                "t": "frac",
                "num": {
                  "t": "r",
                  "text": "θ",
                  "plain": false
                },
                "den": {
                  "t": "r",
                  "text": "2π",
                  "plain": false
                }
              }
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "eq",
        "alt": "b = ln W/(2π), r = r₀ e^(bθ)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "b = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "ln",
                    "plain": true
                  },
                  {
                    "t": "r",
                    "text": " W",
                    "plain": false
                  }
                ]
              },
              "den": {
                "t": "r",
                "text": "2π",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": ",   r = ",
              "plain": false
            },
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "r",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "0",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " ",
              "plain": false
            },
            {
              "t": "sup",
              "base": {
                "t": "r",
                "text": "e",
                "plain": false
              },
              "pow": {
                "t": "r",
                "text": "bθ",
                "plain": false
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "W es el factor de expansión por vuelta. Si W es constante, el perfil radial es una espiral logarítmica."
      },
      {
        "type": "text",
        "value": "Ilustración: \\(r_0=10\\,\\mathrm{mm}\\), \\(W=2\\); radios de \\(10\\), \\(20\\) y \\(40\\,\\mathrm{mm}\\)."
      }
    ],
    "notes": "Modelo geométrico complementario; no sustituye la aplicación indexada de trayectorias isogonales que aún debe elegirse. Raup1966 desarrolla un modelo geométrico de enrollamiento de conchas con varios parámetros. Aquí mostramos únicamente su componente de expansión radial. W=2 es una ilustración matemática, no mediciones de un organismo. b=ln2/(2π)≈0.1103 y el ángulo radio-tangente≈83.7°. No afirmar que toda concha sigue este modelo ni que se trata de la espiral áurea.",
    "source": "Raup (1966), pp. 1179–1181. Valores ilustrativos",
    "optional": true,
    "section": "Complementos"
  },
  {
    "title": "Del ángulo al problema real",
    "kind": "recap",
    "duration": 30,
    "body": [
      {
        "type": "text",
        "value": "¿Qué aprendimos del reto inicial? No necesitamos inventar curvas: podemos imponer una regla geométrica precisa."
      },
      {
        "type": "eq",
        "tex": "G\\left(x,y,\\dfrac{y'-k}{1+ky'}\\right)=0",
        "alt": "G\\left(x,y,\\dfrac{y'-k}{1+ky'}\\right)=0",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "La EDO construye la familia buscada. En investigación, esas geometrías pueden describir posibles recorridos de refuerzo."
      },
      {
        "type": "text",
        "value": "Los estudios de 2017 y 2019 dan el siguiente paso: formulan modelos mecánicos y analizan sus ecuaciones."
      },
      {
        "type": "text",
        "value": "Conclusión: una condición geométrica se convierte en una herramienta para formular y estudiar problemas de ingeniería."
      }
    ],
    "notes": "VOLVER AL RETO INICIAL. 1) La forma no se elige al azar: ángulo constante y EDO. 2) Ecuación diferencial resuelve el problema geométrico. 3) Artículos Galanin y Feodorova 2017; Feodorova 2019 relacionan esas familias con modelos de deformación en estructuras planas. No decir que se probó una pieza aeronáutica, ni que un patrón necesariamente optimiza la resistencia. El caso aeronáutico fue un ejemplo didáctico. Cierre oral sugerido: «No hemos diseñado un avión; hemos visto cómo una pregunta de diseño puede convertirse en una condición geométrica, una ecuación diferencial y un problema de modelación».",
    "source": "Piskunov (1977), § 15; Galanin y Feodorova (2017); Feodorova (2019).",
    "section": "Conclusiones y referencias"
  },
  {
    "title": "Referencias",
    "kind": "references",
    "duration": 20,
    "body": [],
    "notes": "La demostración fue elaborada para la exposición a partir de Piskunov. ED 1.8 aporta el marco de trayectorias isogonales y el procedimiento de derivación y eliminación del parámetro. ED 1.7 sustenta el método de EDO homogéneas y su integración. Galanin y Feodorova (2017) y Feodorova (2019) aportan el contexto científico de materiales.",
    "section": "Conclusiones y referencias"
  },
  {
    "title": "Gracias",
    "kind": "closing",
    "duration": 0,
    "body": [],
    "notes": "Espacio para preguntas después de los20 minutos de exposición.",
    "section": "Conclusiones y referencias"
  }
];
const sections=[{"title":"Fundamentos geométricos","slide":3},{"title":"Demostración matemática","slide":9},{"title":"Ejemplo desarrollado","slide":16},{"title":"Aplicación científica","slide":25},{"title":"Conclusiones y referencias","slide":36}];
const clamp=(value,max)=>Math.max(0,Math.min(max,Number.isFinite(Number(value))?Math.round(Number(value)):0));
function initial(saved){return {slide:clamp(saved?.slide,slides.length-1),phase:clamp(saved?.phase,4)};}
function transition(state,action){
 const next={...state};
 if(action.type==='navigate'){
  next.slide=clamp(state.slide+action.delta,slides.length-1);
  if(!slides[state.slide]?.optional)while(slides[next.slide]?.optional&&next.slide>0&&next.slide<slides.length-1)next.slide=clamp(next.slide+Math.sign(action.delta),slides.length-1);
 }
 if(action.type==='go')next.slide=clamp(action.slide,slides.length-1);
 if(action.type==='phase')next.phase=clamp(action.phase,4);
 return next;
}
const degrees=x=>x*180/Math.PI;
const beta=55*Math.PI/180, alpha=135*Math.PI/180, gamma=80*Math.PI/180;
const geometry={P:[3,3],A:[6,0],B:[3-3/Math.tan(beta),0],mf:Math.tan(beta),mh:-1,alpha,beta,gamma,b:1/Math.tan(10*Math.PI/180)};
const circlePoints=Array.from({length:160},(_,i)=>{const x=.15+4.075*i/159;return [x,Math.sqrt(18-x*x)];});
const spiralPoints=Array.from({length:180},(_,i)=>{const t=Math.PI/4-.30+.4*i/179,r=Math.sqrt(18)*Math.exp(geometry.b*(t-Math.PI/4));return [r*Math.cos(t),r*Math.sin(t)];});
const knownPoints=spiralPoints,soughtPoints=circlePoints;
const api={slides,sections,source,initial,transition,geometry,knownPoints,soughtPoints,degrees};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PresentationModel=api;
})(typeof globalThis==='undefined'?this:globalThis);
