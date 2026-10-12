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
const source={pisk:'Piskunov, N. (1977). Cálculo diferencial e integral, tomo II. Mir. § 15, pp. 48–53.',esc:'Escobar A., J. (s. f.). Ecuaciones diferenciales con aplicaciones en Maple. Universidad de Antioquia. § 3.1.1, pp. 49–51.',clase:'Trujillo Salazar, C. A. (2026). ED 1.8. Apuntes del curso, Universidad del Quindío.',raup:'Raup, D. M. (1966). Geometric analysis of shell coiling: General problems. Journal of Paleontology, 40(5), 1178–1190.'};
const slides=[
  {
    "title": "Trayectorias isogonales",
    "kind": "cover",
    "duration": 15,
    "body": [],
    "notes": "Presentar la pregunta: ¿cómo construir una familia que corte a otra con un ángulo constante? Exposición de Ecuaciones Diferenciales. Docente: Carlos Andrés Trujillo Salazar. Duración sugerida: 20 minutos, incluida la animación de 95 segundos."
  },
  {
    "title": "Dos familias monoparamétricas",
    "kind": "theory",
    "duration": 45,
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
    "notes": "F representa la familia conocida, morada; H representa la buscada, verde. C y lambda son parámetros diferentes. La primera gráfica aislada del manuscrito conserva un color anterior: aquí se unifican las etiquetas con la gráfica conjunta.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15.",
    "action": 0
  },
  {
    "title": "Una curva de cada familia",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Elegimos una curva de cada familia, fijando sus parámetros."
      },
      {
        "type": "eq",
        "tex": "F(x,f(x),C_0)=0",
        "color": "purple",
        "emphasis": false,
        "alt": "F(x,f(x),C_0)=0"
      },
      {
        "type": "eq",
        "tex": "H(x,h(x),\\lambda_0)=0",
        "color": "green",
        "emphasis": false,
        "alt": "H(x,h(x),\\lambda_0)=0"
      },
      {
        "type": "text",
        "value": "Nos concentramos en una intersección regular \\(P\\)."
      }
    ],
    "notes": "F y H nombran ecuaciones de familias; f y h representan dos curvas concretas como funciones locales. No introducir nuevas letras para las curvas.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "La curva conocida",
    "kind": "theory",
    "duration": 45,
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
    "notes": "En el gráfico conocido se usa una espiral; la familia buscada son círculos concéntricos. Esta elección reproduce la orientación creciente de f y decreciente de h del manuscrito.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15.",
    "action": 1
  },
  {
    "title": "La curva buscada",
    "kind": "theory",
    "duration": 45,
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
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15.",
    "action": 2
  },
  {
    "title": "Las rectas tangentes",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Trazamos las tangentes en el punto de intersección."
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x_0)=\\tan\\beta",
        "color": "purple",
        "emphasis": false,
        "alt": "f^{\\prime}(x_0)=\\tan\\beta"
      },
      {
        "type": "eq",
        "tex": "h^{\\prime}(x_0)=\\tan\\alpha",
        "color": "green",
        "emphasis": false,
        "alt": "h^{\\prime}(x_0)=\\tan\\alpha"
      },
      {
        "type": "text",
        "value": "Las inclinaciones se miden desde el eje horizontal positivo."
      }
    ],
    "notes": "Respetar la asignación final: beta pertenece a f y alpha a h. En el esquema beta=55 grados y alpha=135 grados. No intercambiarlas.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15.",
    "action": 3
  },
  {
    "title": "Teorema del ángulo exterior",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "\\(\\alpha\\) es el ángulo exterior del triángulo; \\(\\beta\\) y \\(\\gamma\\), los interiores no adyacentes."
      },
      {
        "type": "eq",
        "tex": "\\alpha=\\beta+\\gamma",
        "color": "orange",
        "emphasis": true,
        "alt": "\\alpha=\\beta+\\gamma"
      },
      {
        "type": "eq",
        "tex": "\\gamma=\\alpha-\\beta",
        "color": "orange",
        "emphasis": false,
        "alt": "\\gamma=\\alpha-\\beta"
      },
      {
        "type": "eq",
        "tex": "135^\\circ=55^\\circ+80^\\circ",
        "color": "",
        "emphasis": false,
        "alt": "135^\\circ=55^\\circ+80^\\circ"
      }
    ],
    "notes": "Señalar A, B y P antes de usar la igualdad. Es la justificación geométrica que aparece en la segunda página del manuscrito.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15.",
    "action": 4
  },
  {
    "title": "Tangente de una diferencia",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\tan(\\alpha-\\beta)",
        "color": "",
        "emphasis": false,
        "alt": "\\tan\\gamma=\\tan(\\alpha-\\beta)"
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}",
        "color": "",
        "emphasis": false,
        "alt": "\\tan\\gamma=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}"
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\frac{h^{\\prime}(x)-f^{\\prime}(x)}{1+h^{\\prime}(x)f^{\\prime}(x)}",
        "color": "orange",
        "emphasis": true,
        "alt": "\\tan\\gamma=\\frac{h^{\\prime}(x)-f^{\\prime}(x)}{1+h^{\\prime}(x)f^{\\prime}(x)}"
      }
    ],
    "notes": "Aplicar la identidad de diferencia, no de suma. Las derivadas se evalúan en la intersección; se omite el subíndice para seguir la escritura del manuscrito.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
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
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
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
    "notes": "Sumamos f prima y restamos k en ambos lados; luego sacamos factor común f prima y dividimos por 1+k y prima cuando es no nulo. Este es el despeje marcado con una estrella en el manuscrito.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "De la familia a su EDO",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "eq",
        "tex": "F(x,y,C)=0",
        "color": "purple",
        "emphasis": false,
        "alt": "F(x,y,C)=0"
      },
      {
        "type": "text",
        "value": "Derivamos y eliminamos el parámetro de la familia conocida."
      },
      {
        "type": "eq",
        "tex": "G(x,y,p)=0,\\qquad p=f^{\\prime}(x)",
        "color": "purple",
        "emphasis": true,
        "alt": "G(x,y,p)=0,\\qquad p=f^{\\prime}(x)"
      },
      {
        "type": "text",
        "value": "\\(F\\) representa la familia; \\(G\\), su ecuación diferencial."
      }
    ],
    "notes": "Distinguir F de G corrige la última expresión de la página 3: la ecuación que recibe una pendiente es G. p es un argumento auxiliar de esa ecuación, no una curva nueva.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "EDO de las trayectorias isogonales",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Sustituimos en la EDO conocida el despeje obtenido:"
      },
      {
        "type": "eq",
        "tex": "p=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}",
        "color": "purple",
        "emphasis": false,
        "alt": "p=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}"
      },
      {
        "type": "eq",
        "tex": "G\\left(x,y,\\frac{y^{\\prime}-k}{1+ky^{\\prime}}\\right)=0",
        "color": "green",
        "emphasis": true,
        "alt": "G\\left(x,y,\\frac{y^{\\prime}-k}{1+ky^{\\prime}}\\right)=0"
      },
      {
        "type": "eq",
        "tex": "k=\\tan\\gamma",
        "color": "",
        "emphasis": false,
        "alt": "k=\\tan\\gamma"
      }
    ],
    "notes": "La ecuación G espera la pendiente de f. La sustituimos por su expresión en términos de y prima, pendiente de h. Al integrar aparece la constante lambda de la familia buscada.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "Pendiente de la trayectoria",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Cuando conocemos explícitamente la pendiente de la familia:"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}",
        "color": "",
        "emphasis": false,
        "alt": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}"
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}\\left(1-kf^{\\prime}(x)\\right)=f^{\\prime}(x)+k",
        "color": "",
        "emphasis": false,
        "alt": "y^{\\prime}\\left(1-kf^{\\prime}(x)\\right)=f^{\\prime}(x)+k"
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}",
        "color": "green",
        "emphasis": true,
        "alt": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}"
      }
    ],
    "notes": "Es la misma relación, ahora despejada para resolver ejemplos. No se cambia de orientación: gamma=alpha-beta durante toda la presentación.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "Caso ortogonal y alcance local",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "eq",
        "tex": "\\gamma=90^\\circ",
        "color": "",
        "emphasis": false,
        "alt": "\\gamma=90^\\circ"
      },
      {
        "type": "text",
        "value": "La tangente del ángulo recto no está definida. Usamos perpendicularidad:"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)h^{\\prime}(x)=-1",
        "color": "orange",
        "emphasis": true,
        "alt": "f^{\\prime}(x)h^{\\prime}(x)=-1"
      },
      {
        "type": "text",
        "value": "Las tangentes horizontales y verticales se tratan geométricamente."
      }
    ],
    "notes": "El producto vale menos uno cuando las dos pendientes son finitas. Un denominador cero en las fórmulas anteriores puede indicar tangente vertical; no elimina la curva.",
    "source": "Manuscrito final del expositor, pp. 1–3. Piskunov, § 15."
  },
  {
    "title": "Ejemplo 1: una familia hiperbólica",
    "kind": "example",
    "graph": "hyperbola",
    "duration": 60,
    "body": [
      {
        "type": "text",
        "value": "Este ejemplo usa el ángulo orientado opuesto al del esquema."
      },
      {
        "type": "eq",
        "alt": "y(x + C) = 1",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y(x + C) = 1",
              "plain": false
            }
          ]
        },
        "color": "green",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "m_f = −y²",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "m",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "f",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = −",
              "plain": false
            },
            {
              "t": "sup",
              "base": {
                "t": "r",
                "text": "y",
                "plain": false
              },
              "pow": {
                "t": "r",
                "text": "2",
                "plain": false
              }
            }
          ]
        },
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Buscamos trayectorias con γ = 45°."
      },
      {
        "type": "eq",
        "alt": "y′ = (y² + 1)/(y² − 1)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y′ = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "y",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " + 1",
                    "plain": false
                  }
                ]
              },
              "den": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "y",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " − 1",
                    "plain": false
                  }
                ]
              }
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      }
    ],
    "notes": "Fuente: ejemplo de Escobar, sección 3.1.1. Derivar y(x+C)=1: y′(x+C)+y=0. Como x+C=1/y y y≠0, m_f=−y². Aplicar la fórmula con tan45°=1. El ejemplo usa la orientación del esquema.",
    "source": "Escobar, § 3.1.1, pp. 49–51"
  },
  {
    "title": "Integración de la trayectoria",
    "kind": "example",
    "graph": "hyperbola",
    "duration": 60,
    "body": [
      {
        "type": "eq",
        "alt": "dx/dy = (y² − 1)/(y² + 1)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "dx",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "dy",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "y",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " − 1",
                    "plain": false
                  }
                ]
              },
              "den": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "y",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " + 1",
                    "plain": false
                  }
                ]
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "dx/dy = 1 − 2/(1 + y²)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "dx",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "dy",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = 1 − ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "2",
                "plain": false
              },
              "den": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "1 + ",
                    "plain": false
                  },
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "y",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  }
                ]
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "y − 2 arctan y = x + K",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y − 2 ",
              "plain": false
            },
            {
              "t": "r",
              "text": "arctan",
              "plain": true
            },
            {
              "t": "r",
              "text": " y = x + K",
              "plain": false
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "La representación x = x(y) incluye los puntos donde la tangente es vertical."
      }
    ],
    "notes": "Invertir la derivada en los intervalos donde sea válido y luego prolongar la solución implícita. En y=±1, dx/dy=0 y la tangente es vertical. La curva original tiene y≠0. Distinguir las restricciones de la forma explícita y de la curva implícita.",
    "source": "Escobar, § 3.1.1, pp. 49–51"
  },
  {
    "title": "Verificación en P = (0, 2)",
    "kind": "example",
    "graph": "hyperbola-check",
    "duration": 45,
    "body": [
      {
        "type": "eq",
        "alt": "C = 1/2, K = 2 − 2 arctan 2",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "C = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "1",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "2",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": ",   K = 2 − 2 ",
              "plain": false
            },
            {
              "t": "r",
              "text": "arctan",
              "plain": true
            },
            {
              "t": "r",
              "text": " 2",
              "plain": false
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "m_f = −4, m_h = 5/3",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "m",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "f",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = −4,   ",
              "plain": false
            },
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "m",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "h",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "5",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "3",
                "plain": false
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "|(m_f − m_h)/(1 + m_f m_h)| = 1",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "|",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "sub",
                    "base": {
                      "t": "r",
                      "text": "m",
                      "plain": false
                    },
                    "sub": {
                      "t": "r",
                      "text": "f",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " − ",
                    "plain": false
                  },
                  {
                    "t": "sub",
                    "base": {
                      "t": "r",
                      "text": "m",
                      "plain": false
                    },
                    "sub": {
                      "t": "r",
                      "text": "h",
                      "plain": false
                    }
                  }
                ]
              },
              "den": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "1 + ",
                    "plain": false
                  },
                  {
                    "t": "sub",
                    "base": {
                      "t": "r",
                      "text": "m",
                      "plain": false
                    },
                    "sub": {
                      "t": "r",
                      "text": "f",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": " ",
                    "plain": false
                  },
                  {
                    "t": "sub",
                    "base": {
                      "t": "r",
                      "text": "m",
                      "plain": false
                    },
                    "sub": {
                      "t": "r",
                      "text": "h",
                      "plain": false
                    }
                  }
                ]
              }
            },
            {
              "t": "r",
              "text": "| = 1",
              "plain": false
            }
          ]
        },
        "color": "orange",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Las curvas pasan por P y el ángulo agudo entre tangentes es 45°."
      }
    ],
    "notes": "El cociente orientado también vale +1. α≈104.04° y β≈59.04°, diferencia45°. La gráfica verde usa C=1/2 y la morada K=2−2arctan2. En el dibujo las tangentes confirman el cálculo.",
    "source": "Cálculo y gráfica propios. Familia de Escobar"
  },
  {
    "title": "Ejemplo 2: rectas radiales",
    "kind": "example",
    "graph": "rays",
    "duration": 60,
    "body": [
      {
        "type": "eq",
        "alt": "y = Cx, m_f = y/x",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y = Cx,   ",
              "plain": false
            },
            {
              "t": "sub",
              "base": {
                "t": "r",
                "text": "m",
                "plain": false
              },
              "sub": {
                "t": "r",
                "text": "f",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "y",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "x",
                "plain": false
              }
            }
          ]
        },
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Aquí elegimos la orientación de Piskunov: β = α + γ. Tomamos k = tan γ > 0."
      },
      {
        "type": "eq",
        "alt": "y′ = (y + kx)/(x − ky)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y′ = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "y + kx",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "x − ky",
                "plain": false
              }
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "La orientación opuesta se obtiene cambiando γ por −γ."
      }
    ],
    "notes": "Explicitar el cambio de orientación evita confundir signos. La fórmula anterior tenía γ=α−β. Aquí la tangente de la trayectoria gira en sentido positivo respecto de la recta radial. El ejemplo de Piskunov produce espirales logarítmicas.",
    "source": "Piskunov, tomo II, § 15, pp. 51–53"
  },
  {
    "title": "La ecuación homogénea",
    "kind": "example",
    "duration": 75,
    "body": [
      {
        "type": "eq",
        "alt": "y = ux, y′ = u + x du/dx",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "y = ux,   y′ = u + x ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "du",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "dx",
                "plain": false
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "x du/dx = k(1 + u²)/(1 − ku)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "x ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "du",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "dx",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "k(1 + ",
                    "plain": false
                  },
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "u",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  },
                  {
                    "t": "r",
                    "text": ")",
                    "plain": false
                  }
                ]
              },
              "den": {
                "t": "r",
                "text": "1 − ku",
                "plain": false
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "(1 − ku)/(1 + u²) du = k dx/x",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "1 − ku",
                "plain": false
              },
              "den": {
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "1 + ",
                    "plain": false
                  },
                  {
                    "t": "sup",
                    "base": {
                      "t": "r",
                      "text": "u",
                      "plain": false
                    },
                    "pow": {
                      "t": "r",
                      "text": "2",
                      "plain": false
                    }
                  }
                ]
              }
            },
            {
              "t": "r",
              "text": " du = k ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "dx",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "x",
                "plain": false
              }
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "arctan u − (k/2) ln(1 + u²) = k ln|x| + K",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "arctan",
              "plain": true
            },
            {
              "t": "r",
              "text": " u − ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "k",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "2",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " ",
              "plain": false
            },
            {
              "t": "r",
              "text": "ln",
              "plain": true
            },
            {
              "t": "r",
              "text": "(1 + ",
              "plain": false
            },
            {
              "t": "sup",
              "base": {
                "t": "r",
                "text": "u",
                "plain": false
              },
              "pow": {
                "t": "r",
                "text": "2",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": ") = k ",
              "plain": false
            },
            {
              "t": "r",
              "text": "ln",
              "plain": true
            },
            {
              "t": "r",
              "text": "|x| + K",
              "plain": false
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      }
    ],
    "notes": "Trabajar en x≠0 y en intervalos donde la separación está definida. Integrar du/(1+u²) y udu/(1+u²). La constante absorbe términos de la transformación posterior. arctan fija una rama local del ángulo.",
    "source": "Piskunov, tomo II, § 15, pp. 51–53"
  },
  {
    "title": "La espiral logarítmica",
    "kind": "example",
    "graph": "spiral",
    "duration": 60,
    "body": [
      {
        "type": "eq",
        "alt": "x = r cos θ, y = r sin θ",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "x = r ",
              "plain": false
            },
            {
              "t": "r",
              "text": "cos",
              "plain": true
            },
            {
              "t": "r",
              "text": " θ,   y = r ",
              "plain": false
            },
            {
              "t": "r",
              "text": "sin",
              "plain": true
            },
            {
              "t": "r",
              "text": " θ",
              "plain": false
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "ln r = θ/k + K",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "ln",
              "plain": true
            },
            {
              "t": "r",
              "text": " r = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "θ",
                "plain": false
              },
              "den": {
                "t": "r",
                "text": "k",
                "plain": false
              }
            },
            {
              "t": "r",
              "text": " + K",
              "plain": false
            }
          ]
        },
        "color": "",
        "emphasis": false
      },
      {
        "type": "eq",
        "alt": "r = A e^(θ cot γ), A > 0",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "r = A ",
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
                "t": "seq",
                "nodes": [
                  {
                    "t": "r",
                    "text": "θ ",
                    "plain": false
                  },
                  {
                    "t": "r",
                    "text": "cot",
                    "plain": true
                  },
                  {
                    "t": "r",
                    "text": " γ",
                    "plain": false
                  }
                ]
              }
            },
            {
              "t": "r",
              "text": ",   A > 0",
              "plain": false
            }
          ]
        },
        "color": "purple",
        "emphasis": true
      },
      {
        "type": "eq",
        "alt": "tan γ = r/(dr/dθ)",
        "ast": {
          "t": "seq",
          "nodes": [
            {
              "t": "r",
              "text": "tan",
              "plain": true
            },
            {
              "t": "r",
              "text": " γ = ",
              "plain": false
            },
            {
              "t": "frac",
              "num": {
                "t": "r",
                "text": "r",
                "plain": false
              },
              "den": {
                "t": "frac",
                "num": {
                  "t": "r",
                  "text": "dr",
                  "plain": false
                },
                "den": {
                  "t": "r",
                  "text": "dθ",
                  "plain": false
                }
              }
            }
          ]
        },
        "color": "orange",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "θ se mide en radianes. El radio y la tangente conservan el ángulo γ."
      }
    ],
    "notes": "Usar 1+u²=r²/x² y θ=arctan u en una rama local. La expresión polar prolonga la espiral más allá de esa rama. La verificación tanγ=r/(dr/dθ) usa las componentes radial y angular del vector tangente.",
    "source": "Piskunov, § 15. Deducción propia"
  },
  {
    "title": "El ángulo constante en movimiento",
    "kind": "video",
    "duration": 95,
    "body": [
      {
        "type": "text",
        "value": "Rectas radiales y espirales logarítmicas con γ = 80°."
      }
    ],
    "notes": "Reproducir la animación propia completa de95 segundos. Señalar el radio, la tangente y la conservación del ángulo mientras se mueve el punto. El video no tiene audio, lo que permite explicarlo durante la reproducción.",
    "source": "Animación original del expositor, 95 segundos"
  },
  {
    "title": "Un modelo radial de crecimiento",
    "kind": "example",
    "graph": "biology",
    "duration": 75,
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
        "value": "Ilustración: r₀ = 10 mm y W = 2. Tras 0, 1 y 2 vueltas: 10, 20 y 40 mm."
      }
    ],
    "notes": "Raup1966 desarrolla un modelo geométrico de enrollamiento de conchas con varios parámetros. Aquí mostramos únicamente su componente de expansión radial. W=2 es una ilustración matemática, no mediciones de un organismo. b=ln2/(2π)≈0.1103 y el ángulo radio-tangente≈83.7°. No afirmar que toda concha sigue este modelo ni que se trata de la espiral áurea.",
    "source": "Raup (1966), pp. 1179–1181. Valores ilustrativos"
  },
  {
    "title": "La construcción y la ecuación",
    "kind": "recap",
    "duration": 20,
    "body": [
      {
        "type": "text",
        "value": "La geometría relaciona las pendientes de ambas familias."
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}",
        "color": "purple",
        "emphasis": false,
        "alt": "f^{\\prime}(x)=\\frac{y^{\\prime}-k}{1+ky^{\\prime}}"
      },
      {
        "type": "eq",
        "tex": "G\\left(x,y,\\frac{y^{\\prime}-k}{1+ky^{\\prime}}\\right)=0",
        "color": "green",
        "emphasis": true,
        "alt": "G\\left(x,y,\\frac{y^{\\prime}-k}{1+ky^{\\prime}}\\right)=0"
      }
    ],
    "notes": "Recuperar la idea central y permitir volver al diagrama con el índice si hay preguntas. No añadir nuevos resultados.",
    "source": "Piskunov, § 15. Escobar, § 3.1.1"
  },
  {
    "title": "Referencias",
    "kind": "references",
    "duration": 20,
    "body": [],
    "notes": "Referencias principales: Piskunov para el desarrollo de trayectorias isogonales y el ejemplo radial. Escobar para el ejemplo hiperbólico. Los apuntes ED1.8 conectan con trayectorias ortogonales. Raup sustenta el ejemplo biomatemático. Las gráficas y animación son del expositor."
  },
  {
    "title": "Gracias",
    "kind": "closing",
    "duration": 0,
    "body": [],
    "notes": "Espacio para preguntas después de los20 minutos de exposición."
  }
];
const clamp=(value,max)=>Math.max(0,Math.min(max,Number.isFinite(Number(value))?Math.round(Number(value)):0));
function initial(saved){return {slide:clamp(saved?.slide,slides.length-1),phase:clamp(saved?.phase,4)};}
function transition(state,action){
 const next={...state};
 if(action.type==='navigate')next.slide=clamp(state.slide+action.delta,slides.length-1);
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
const api={slides,source,initial,transition,geometry,knownPoints,soughtPoints,degrees};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PresentationModel=api;
})(typeof globalThis==='undefined'?this:globalThis);
