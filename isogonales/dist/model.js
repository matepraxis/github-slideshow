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
const source={pisk:'Piskunov, N. (1977). Cálculo diferencial e integral, tomo II. Mir, § 15.',clase:'Trujillo Salazar, C. A. (2026). ED 1.7. Apuntes del curso, Universidad del Quindío.',raup:'Raup, D. M. (1966). Geometric analysis of shell coiling: General problems. Journal of Paleontology, 40(5), 1178–1190.'};
const slides=[
  {
    "title": "Trayectorias isogonales",
    "kind": "cover",
    "duration": 15,
    "body": [],
    "notes": "Exposición de 20 minutos sin los complementos. El índice permite acceder a estos para preguntas. La animación original dura 95 segundos."
  },
  {
    "title": "Dos familias monoparamétricas",
    "kind": "theory",
    "duration": 40,
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
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "action": 0
  },
  {
    "title": "Elegimos una curva de cada familia",
    "kind": "theory",
    "duration": 40,
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
  },
  {
    "title": "La curva conocida",
    "kind": "theory",
    "duration": 40,
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
    "source": "Piskunov, N. (1977), tomo II, § 15.",
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
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "action": 2
  },
  {
    "title": "¿Por qué trazamos las tangentes?",
    "kind": "theory",
    "duration": 45,
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
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "action": 3
  },
  {
    "title": "El ángulo constante",
    "kind": "theory",
    "duration": 45,
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
    "source": "Piskunov, N. (1977), tomo II, § 15.",
    "action": 4
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
  },
  {
    "title": "La relación que utilizaremos",
    "kind": "theory",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "De la demostración conservamos una sola regla para resolver el ejemplo."
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}",
        "alt": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Primero obtenemos \\(f^{\\prime}\\) de la familia dada; después sustituimos y resolvemos la EDO de la familia buscada."
      }
    ],
    "notes": "Transición breve al ejemplo de rectas, sin caso ortogonal ni ecuaciones tangenciales nuevas.",
    "source": "Piskunov, N. (1977), tomo II, § 15."
  },
  {
    "title": "Ejemplo: familia de rectas",
    "kind": "example",
    "duration": 65,
    "body": [
      {
        "type": "text",
        "value": "Partimos de todas las rectas que pasan por el origen."
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
        "tex": "f^{\\prime}(x)=C",
        "alt": "f^{\\prime}(x)=C",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Dividiendo ambos miembros de \\(y=Cx\\) entre \\(x\\) (\\(x\\ne0\\)) y eliminando el parámetro:"
      },
      {
        "type": "eq",
        "tex": "f^{\\prime}(x)=\\frac yx",
        "alt": "f^{\\prime}(x)=\\frac yx",
        "color": "purple",
        "emphasis": true
      }
    ],
    "notes": "Derivamos con C constante. x no debe ser cero al dividir. La recta C0=1 pasa por P=(2,2).",
    "source": "Piskunov, N. (1977), tomo II, § 15."
  },
  {
    "title": "Sustituimos la pendiente conocida",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Usamos la relación entre las pendientes demostrada antes, con \\(k=\\tan\\gamma\\)."
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}",
        "alt": "y^{\\prime}=\\frac{f^{\\prime}(x)+k}{1-kf^{\\prime}(x)}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Sustituyendo \\(f^{\\prime}=y/x\\) y multiplicando numerador y denominador por \\(x\\):"
      },
      {
        "type": "eq",
        "tex": "y^{\\prime}=\\frac{y+kx}{x-ky}",
        "alt": "y^{\\prime}=\\frac{y+kx}{x-ky}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Usamos la orientación de la demostración y multiplicamos arriba y abajo por x.",
    "source": "Piskunov, N. (1977), tomo II, § 15."
  },
  {
    "title": "Sustitución homogénea",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "La EDO es homogénea. Aplicamos la sustitución \\(z=\\frac yx\\)."
      },
      {
        "type": "eq",
        "tex": "y=xz,\\qquad y^{\\prime}=z+x\\frac{dz}{dx}",
        "alt": "y=xz,\\qquad y^{\\prime}=z+x\\frac{dz}{dx}",
        "color": "purple",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Sustituyendo \\(y=xz\\) y \\(y^{\\prime}\\) en la ecuación diferencial:"
      },
      {
        "type": "eq",
        "tex": "z+x\\frac{dz}{dx}=\\frac{z+k}{1-kz}",
        "alt": "z+x\\frac{dz}{dx}=\\frac{z+k}{1-kz}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Aplicamos y=xz y la regla del producto, pues z depende de x.",
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.7."
  },
  {
    "title": "Reducimos a una sola fracción",
    "kind": "example",
    "duration": 45,
    "body": [
      {
        "type": "text",
        "value": "Restando \\(z\\) a ambos lados y usando el mismo denominador:"
      },
      {
        "type": "eq",
        "tex": "x\\frac{dz}{dx}=\\frac{z+k-z(1-kz)}{1-kz}",
        "alt": "x\\frac{dz}{dx}=\\frac{z+k-z(1-kz)}{1-kz}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Distribuyendo el signo menos y reduciendo términos semejantes:"
      },
      {
        "type": "eq",
        "tex": "x\\frac{dz}{dx}=\\frac{k(1+z^2)}{1-kz}",
        "alt": "x\\frac{dz}{dx}=\\frac{k(1+z^2)}{1-kz}",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Justificar el signo menos y la cancelación de z. Dominios locales.",
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.7."
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
        "tex": "\\frac{1-kz}{k(1+z^2)}\\,dz=\\frac{dx}{x}",
        "alt": "\\frac{1-kz}{k(1+z^2)}\\,dz=\\frac{dx}{x}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Integramos a ambos lados de la igualdad:"
      },
      {
        "type": "eq",
        "tex": "\\int\\frac{1-kz}{k(1+z^2)}\\,dz=\\int\\frac{dx}{x}",
        "alt": "\\int\\frac{1-kz}{k(1+z^2)}\\,dz=\\int\\frac{dx}{x}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Descomponemos el primer miembro en dos integrales:"
      },
      {
        "type": "eq",
        "tex": "\\frac1k\\int\\frac{dz}{1+z^2}-\\int\\frac{z\\,dz}{1+z^2}=\\int\\frac{dx}{x}",
        "alt": "\\frac1k\\int\\frac{dz}{1+z^2}-\\int\\frac{z\\,dz}{1+z^2}=\\int\\frac{dx}{x}",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Aplicando las primitivas \\(\\arctan z\\), \\(\\frac12\\ln(1+z^2)\\) y \\(\\ln|x|\\):"
      },
      {
        "type": "eq",
        "tex": "\\ln|x|=\\frac1k\\arctan z-\\frac12\\ln(1+z^2)+C_1",
        "alt": "\\ln|x|=\\frac1k\\arctan z-\\frac12\\ln(1+z^2)+C_1",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Mostrar gradualmente la igualdad integral completa antes de cualquier primitiva. Descomponer: 1/k·1/(1+z²) - z/(1+z²). Para la segunda integral usar u=1+z², du=2z dz. Integrar en un intervalo con x distinto de cero y k distinto de cero.",
    "source": "Trujillo Salazar, C. A. (2026), ED 1.7, EDO homogéneas."
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
        "tex": "\\ln|x|=\\frac1k\\arctan\\left(\\frac yx\\right)-\\frac12\\ln\\left(1+\\frac{y^2}{x^2}\\right)+C_1",
        "alt": "\\ln|x|=\\frac1k\\arctan\\left(\\frac yx\\right)-\\frac12\\ln\\left(1+\\frac{y^2}{x^2}\\right)+C_1",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Aplicando las propiedades de los logaritmos y cancelando \\(\\ln|x|\\) a ambos lados:"
      },
      {
        "type": "eq",
        "tex": "\\frac12\\ln(x^2+y^2)=\\frac1k\\arctan\\left(\\frac yx\\right)+C_1",
        "alt": "\\frac12\\ln(x^2+y^2)=\\frac1k\\arctan\\left(\\frac yx\\right)+C_1",
        "color": "green",
        "emphasis": true
      }
    ],
    "notes": "Recordar propiedad del logaritmo de un cociente y cancelación.",
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.7."
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
        "tex": "\\ln r=\\frac{\\theta}{k}+C_1",
        "alt": "\\ln r=\\frac{\\theta}{k}+C_1",
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
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
        "tex": "r=Ae^{\\theta/k}\\quad\\Longrightarrow\\quad \\frac{dr}{d\\theta}=\\frac r k",
        "alt": "r=Ae^{\\theta/k}\\quad\\Longrightarrow\\quad \\frac{dr}{d\\theta}=\\frac r k",
        "color": "green",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Dividiendo la componente transversal \\(r\\) entre la radial \\(dr/d\\theta\\):"
      },
      {
        "type": "eq",
        "tex": "\\tan\\gamma=\\frac{r}{dr/d\\theta}=k",
        "alt": "\\tan\\gamma=\\frac{r}{dr/d\\theta}=k",
        "color": "orange",
        "emphasis": true
      }
    ],
    "notes": "La tangente polar tiene componente radial dr/dθ y transversal r.",
    "source": "Piskunov, N. (1977), tomo II, § 15."
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
    "notes": "Reproducir la animación propia completa de95 segundos. Señalar el radio, la tangente y la conservación del ángulo mientras se mueve el punto. El video no tiene audio, lo que permite explicarlo durante la reproducción. El video original se conserva; sus colores son los del material original, independientes de la leyenda de las gráficas interactivas.",
    "source": "Animación original del expositor, 95 segundos"
  },
  {
    "title": "Aplicación: controlar el ángulo de impacto",
    "kind": "example",
    "graph": "application-rays",
    "duration": 35,
    "body": [
      {
        "type": "text",
        "value": "Un chorro al chocar contra una superficie puede producir salpicaduras."
      },
      {
        "type": "text",
        "value": "El estudio considera el ángulo entre el chorro y la tangente de la superficie."
      },
      {
        "type": "eq",
        "tex": "\\gamma\\lesssim 30^\\circ",
        "alt": "\\gamma\\lesssim 30^\\circ",
        "color": "orange",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "Este es un umbral aproximado del estudio, no una regla universal para todos los fluidos."
      }
    ],
    "notes": "La aplicación propuesta es el trabajo de Thurairajah y colaboradores (2025), PNAS Nexus. El ángulo crítico aproximado se obtuvo bajo condiciones de micción humana. Se requiere una geometría que mantenga un ángulo suficientemente pequeño.",
    "source": "Thurairajah, K., et al. (2025). Splash-free urinals for global sustainability and accessibility: Design through physics and differential equations. PNAS Nexus, 4(4), pgaf087. https://doi.org/10.1093/pnasnexus/pgaf087"
  },
  {
    "title": "La geometría del diseño es isogonal",
    "kind": "example",
    "graph": "application-spiral",
    "duration": 35,
    "body": [
      {
        "type": "text",
        "value": "En vista superior, los chorros se proyectan como una familia de rayos."
      },
      {
        "type": "text",
        "value": "Buscamos curvas que corten esos rayos bajo un ángulo prescrito."
      },
      {
        "type": "eq",
        "tex": "y=Cx\\quad\\longrightarrow\\quad r=Ae^{\\theta/k}",
        "alt": "y=Cx\\quad\\longrightarrow\\quad r=Ae^{\\theta/k}",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "eq",
        "tex": "k=\\tan\\gamma",
        "alt": "k=\\tan\\gamma",
        "color": "orange",
        "emphasis": false
      },
      {
        "type": "text",
        "value": "Esta espiral aparece en el diseño llamado «Nautilus». La vista lateral se modela por separado con parábolas."
      }
    ],
    "notes": "El artículo modela las trayectorias proyectadas en dos planos. Vista superior: rayos e isogonales espirales. Vista lateral: familia de parábolas y su correspondiente problema isogonal. No confundir la espiral del ejemplo expositivo a 80 grados con el objetivo de 30 grados aplicado.",
    "source": "Thurairajah, K., et al. (2025). Splash-free urinals for global sustainability and accessibility: Design through physics and differential equations. PNAS Nexus, 4(4), pgaf087. https://doi.org/10.1093/pnasnexus/pgaf087"
  },
  {
    "title": "Validación experimental de la aplicación",
    "kind": "example",
    "graph": "application-result",
    "duration": 30,
    "body": [
      {
        "type": "text",
        "value": "Los investigadores construyeron diseños y midieron salpicaduras con chorros controlados."
      },
      {
        "type": "eq",
        "tex": "\\frac{Q_{\\mathrm{nuevo}}}{Q_{\\mathrm{comercial}}}\\approx 0.014",
        "alt": "\\frac{Q_{\\mathrm{diseño}}}{Q_{\\mathrm{comercial}}}\\approx 0.014",
        "color": "green",
        "emphasis": true
      },
      {
        "type": "text",
        "value": "En el ensayo reportado, los diseños redujeron las salpicaduras hasta aproximadamente el 1,4 % de las del modelo comercial de referencia."
      },
      {
        "type": "text",
        "value": "La EDO orienta el diseño; el ensayo contrasta su funcionamiento."
      }
    ],
    "notes": "El artículo reporta salpicaduras de hasta solo 1,4% del urinario comercial común. Es una comparación experimental específica y no una garantía de rendimiento en cualquier situación. Fuente PNAS Nexus 4(4), pgaf087.",
    "source": "Thurairajah, K., et al. (2025). Splash-free urinals for global sustainability and accessibility: Design through physics and differential equations. PNAS Nexus, 4(4), pgaf087. https://doi.org/10.1093/pnasnexus/pgaf087"
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
    "optional": true
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
    "optional": true
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
    "optional": true
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
    "optional": true
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
    "optional": true
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
    "source": "Piskunov (1977), § 15; Trujillo Salazar (2026), ED 1.7."
  },
  {
    "title": "Referencias",
    "kind": "references",
    "duration": 20,
    "body": [],
    "notes": "Piskunov sustenta el ejemplo radial; Escobar aporta la familia hiperbólica. Las páginas 1–6 del desarrollo de la exposición guían la notación y el desarrollo. Raup corresponde solo al complemento de expansión radial."
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
const api={slides,source,initial,transition,geometry,knownPoints,soughtPoints,degrees};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PresentationModel=api;
})(typeof globalThis==='undefined'?this:globalThis);
