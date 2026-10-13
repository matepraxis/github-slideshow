"""Video de trayectorias isogonales, v7, con notacion de la demostracion.

  python render_trayectorias_isogonales_v7.py --preview
  python render_trayectorias_isogonales_v7.py

4K UHD nativo: 3840x2160, 30 fps, 95 s, H.264.
La familia de referencia es y=Cx. Sea gamma=80 grados y k=tan(gamma).
Las trayectorias r=A exp(theta/k) cortan las rectas radiales bajo gamma.
"""
import argparse, math, os, subprocess, tempfile, time
from pathlib import Path
from functools import lru_cache
import cv2
import numpy as np
from PIL import Image, ImageFont, ImageDraw

parser=argparse.ArgumentParser()
parser.add_argument('--preview',action='store_true')
parser.add_argument('--seconds',type=float,default=95.0)
args=parser.parse_args()

W,H,FPS=3840,2160,30
S=3  # coordinates are defined in a 1280 x 720 logical canvas
DURATION=float(args.seconds)
OUT=str(Path(__file__).resolve().parent / 'trayectorias_isogonales_v7_4K_UHD.mp4')
BG_COLOR='#07172A'; BG_PANEL='#0E283D'; HEADER='#091B31'
AXIS_COLOR='#9DAFCA'; LABEL_COLOR='#F1F6FC'
BGR=lambda c:tuple(bytes.fromhex(c.lstrip('#'))[::-1])
SPIRAL_COLORS=['#E76F51','#F4A340','#13B7A6','#6484E8','#D24F66','#91BE45','#A06AD8','#24A4D1','#E38A30','#58C29C','#D66BA7']
LINE_COLORS=['#4087CD','#4893DA','#559EE6','#60A9EE','#5BB6E8','#7AA3E5','#429FC8','#78B5EA','#6694D8','#58B3DA','#5D88CA','#71ADE1','#417CB9','#66C1DD','#7E96DC','#5B9AC9','#4BAED1','#6E8CC8']
YELLOW='#FFE05E'; CYAN='#69D8FF'; AMBER='#FFB65D'

def coords(p):return tuple(np.rint(np.asarray(p)*S).astype(np.int32))
def line(img,a,b,color,width=2):cv2.line(img,coords(a),coords(b),BGR(color),width*S,cv2.LINE_AA)
def poly(img,points,color,width=2):
    pts=(np.asarray(points,dtype=np.float64)*S).astype(np.int32)
    if len(pts)>=2:cv2.polylines(img,[pts],False,BGR(color),width*S,cv2.LINE_AA)
def circle(img,p,r,color,width=-1):cv2.circle(img,coords(p),round(r*S),BGR(color),width*S if width>0 else width,cv2.LINE_AA)
def rect(img,a,b,c,width=-1):cv2.rectangle(img,coords(a),coords(b),BGR(c),width*S if width>0 else width,cv2.LINE_AA)
def ease(x):
    x=float(np.clip(x,0,1));return x*x*(3-2*x)
def progress(t,a,b):return ease((t-a)/(b-a))

# LaTeX real: compilacion vectorial seguida de rasterizacion a tamano UHD.
@lru_cache(None)
def latex(formula,logical_h,color='F1F6FC'):
    with tempfile.TemporaryDirectory(prefix='isogonales_v7_') as d:
        work=Path(d)
        tex=r'''\documentclass[border=3pt]{standalone}
\usepackage{amsmath,amssymb,xcolor}
\begin{document}
\color[HTML]{%s}\fontsize{48}{57}\selectfont $\displaystyle %s$
\end{document}'''%(color.lstrip('#'),formula)
        (work/'formula.tex').write_text(tex,encoding='utf-8')
        a=subprocess.run(['pdflatex','-interaction=nonstopmode','-halt-on-error','-output-directory',d,str(work/'formula.tex')],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        if a.returncode:raise RuntimeError(f'LaTeX {formula}: '+a.stdout.decode(errors='replace')[-900:])
        b=subprocess.run(['pdftocairo','-png','-transp','-singlefile','-r','220',str(work/'formula.pdf'),str(work/'formula')],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        if b.returncode:raise RuntimeError(f'PDF rasterizing {formula}: '+b.stderr.decode(errors='replace'))
        pix=np.array(Image.open(work/'formula.png').convert('RGBA'))
        h,w=pix.shape[:2]; nh=round(logical_h*S)
        return cv2.resize(pix,(round(w*nh/h),nh),interpolation=cv2.INTER_AREA)

REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
@lru_cache(None)
def label(txt,size=19,color=LABEL_COLOR,bold=False):
    font=ImageFont.truetype(BOLD if bold else REG,size*S)
    image=Image.new('RGBA',(4,4)); bb=ImageDraw.Draw(image).textbbox((0,0),txt,font=font)
    out=Image.new('RGBA',(bb[2]-bb[0]+4*S,bb[3]-bb[1]+4*S))
    ImageDraw.Draw(out).text((2*S-bb[0],2*S-bb[1]),txt,font=font,fill=color)
    return np.array(out)

def paste(img,asset,x,y,alpha=1.0,align='left'):
    if alpha<.005:return
    h,w=asset.shape[:2];x=round(x*S);y=round(y*S)
    if align=='center':x-=w//2
    elif align=='right':x-=w
    l=max(0,x);u=max(0,y);r=min(W,x+w);b=min(H,y+h)
    if r<=l or b<=u:return
    src=asset[u-y:b-y,l-x:r-x]
    mask=(src[:,:,3:4].astype('float32')*(alpha/255))
    base=img[u:b,l:r].astype('float32')
    img[u:b,l:r]=(base*(1-mask)+src[:,:,:3][:,:,::-1]*mask).astype('uint8')

# ----- Geometria identica al modelo de la version anterior -----
CX,CY,SCALE=480,351,83
R_MIN,R_MAX=.034,2.80
GAMMA=80.0
K=1/math.tan(math.radians(GAMMA))  # = 1/k, con k = tan gamma
A=.18
N_LINE,N_SPIRAL=18,11
ANGLES=np.arange(N_LINE)*math.pi/N_LINE
LINES=[]
for i,theta in enumerate(ANGLES):
    direction=np.array([math.cos(theta),-math.sin(theta)])
    origin=np.array([CX,CY])
    LINES.append((origin-R_MAX*SCALE*direction,origin+R_MAX*SCALE*direction,LINE_COLORS[i]))
SPIRALS=[]
for j in range(N_SPIRAL):
    aj=A*math.exp(2*math.pi*K*j/N_SPIRAL)
    ts=np.linspace(math.log(R_MIN/aj)/K,math.log(R_MAX/aj)/K,1350)
    radius=aj*np.exp(K*ts)
    points=np.column_stack([CX+SCALE*radius*np.cos(ts),CY-SCALE*radius*np.sin(ts)])
    SPIRALS.append((points,SPIRAL_COLORS[j]))

TANGENCIES=[]
for target in (0.95,1.6,2.36):
    theta_guess=math.log(target/A)/K
    theta=round(theta_guess/(math.pi/N_LINE))*(math.pi/N_LINE)
    r=A*math.exp(K*theta)
    point_xy=np.array([CX+SCALE*r*math.cos(theta),CY-SCALE*r*math.sin(theta)])
    radial=np.array([math.cos(theta),math.sin(theta)])
    tangent=np.array([K*math.cos(theta)-math.sin(theta),K*math.sin(theta)+math.cos(theta)])
    angle=math.degrees(math.acos(np.clip(abs(np.dot(radial,tangent))/(np.linalg.norm(radial)*np.linalg.norm(tangent)),-1,1)))
    assert abs(angle-GAMMA)<1e-7,(angle,GAMMA)
    TANGENCIES.append((theta,point_xy))

TEX={
 'line':latex(r'y=Cx',57),
 'line_blue':latex(r'y=Cx',55,'BCE8FF'),
 'spiral':latex(r'r=Ae^{\theta/k}',52),
 'spiral_orange':latex(r'r=Ae^{\theta/k}',50,'FFA7A0'),
 'angle':latex(r'\gamma=80^\circ',56,'FFE05E'),
 'k':latex(r'k=\tan\gamma',43,'BCE8FF'),
 'f':latex(r'F(x,y,C)=0',38,'BCE8FF'),
 'h':latex(r'H(x,y,\lambda)=0',36,'BCE8FF'),
 'gamma':latex(r'\gamma',27,'FFE05E'),
 'point':latex(r'P',29,'FFFFFF'),
 'x':latex(r'x',27),
 'y':latex(r'y',27),
}
WORDS={
 'header':label('TRAYECTORIAS ISOGONALES',26,bold=True),
 'subtitle':label('Interpretación geométrica de la demostración',15,color='#B8CAE0'),
 'author':label('Diego Alejandro Marulanda',18,bold=True),
 'course':label('Maestría en Biomatemáticas · Universidad del Quindío',12,color='#A5B9D3'),
 'credit':label('Referencia matemática: Piskunov, Cálculo diferencial e integral II, § 15.',12,color='#AFC4DC'),
 'eyebrow':label('NOTACIÓN DE LA DEMOSTRACIÓN',13,color='#8FD3F5',bold=True),
 's1':label('01   FAMILIA CONOCIDA',21,bold=True),
 's2':label('02   TRAYECTORIA ISOGONAL',20,bold=True),
 's3':label('03   ÁNGULO ENTRE TANGENTES',19,bold=True),
 's4':label('04   FAMILIA DE RECTAS',21,bold=True),
 's5':label('05   FAMILIA ISOGONAL',21,bold=True),
 's6':label('06   DOS FAMILIAS',21,bold=True),
 'd1':label('Una recta de la familia por el origen',15,color='#CBD9E7'),
 'd2':label('Una curva de la familia buscada',15,color='#CBD9E7'),
 'd3':label('Mismo ángulo en cada intersección',15,color='#CBD9E7'),
 'd4':label('Distintos valores de C',15,color='#CBD9E7'),
 'd5':label('Distintos valores de A',15,color='#CBD9E7'),
 'd6':label('Las tangentes conservan el ángulo',15,color='#CBD9E7'),
 'known':label('Familia conocida',14,color='#A9CDF7',bold=True),
 'sought':label('Familia isogonal',14,color='#FFA7A0',bold=True),
}

STAGES=[(0,5,'intro'),(5,15,'s1'),(15,28,'s2'),(28,54,'s3'),(54,67,'s4'),(67,86,'s5'),(86,95,'s6')]

def make_base():
    im=np.full((H,W,3),BGR(BG_COLOR),dtype=np.uint8)
    rect(im,(0,0),(1280,104),HEADER)
    line(im,(30,105),(1250,105),'#29445F',1)
    paste(im,WORDS['header'],35,15)
    paste(im,WORDS['subtitle'],37,67)
    paste(im,WORDS['author'],1244,18,align='right')
    paste(im,WORDS['course'],1244,63,align='right')
    # Los ejes quedan en la region grafica, sin atravesar el panel de formulas.
    cv2.arrowedLine(im,coords((80,CY)),coords((805,CY)),BGR(AXIS_COLOR),S*2,cv2.LINE_AA,tipLength=.016)
    cv2.arrowedLine(im,coords((CX,603)),coords((CX,113)),BGR(AXIS_COLOR),S*2,cv2.LINE_AA,tipLength=.018)
    paste(im,TEX['x'],800,CY-38)
    paste(im,TEX['y'],CX+18,113)
    line(im,(37,668),(1243,668),'#29445F',1)
    paste(im,WORDS['credit'],42,680)
    return im
BASE=make_base()
FIRST_LINE=round((TANGENCIES[0][0]%math.pi)/(math.pi/N_LINE))%N_LINE

def stage(t):
    for a,b,key in STAGES:
        if a<=t<b:return a,b,key
    return STAGES[-1]

def right_panel(im,t):
    a,b,key=stage(t)
    if key=='intro':return
    alpha=min(progress(t,a,a+.7),progress(b-t,0,.7))
    if alpha<=0:return
    # Panel lateral ALTO, separado de cualquier control de reproduccion inferior.
    rect(im,(843,163),(1245,586),BG_PANEL)
    rect(im,(843,163),(849,586),'#53ADE3')
    line(im,(867,215),(1218,215),'#33536A',1)
    paste(im,WORDS['eyebrow'],868,179,alpha)
    paste(im,WORDS[key],868,240,alpha)
    detail={'s1':'f','s2':'h','s3':'k','s4':'f','s5':'k','s6':'k'}[key]
    main={'s1':'line','s2':'spiral','s3':'angle','s4':'line','s5':'spiral','s6':'angle'}[key]
    paste(im,TEX[detail],868,300,alpha)
    desc={'s1':'d1','s2':'d2','s3':'d3','s4':'d4','s5':'d5','s6':'d6'}[key]
    if key=='s6':
        # Mostrar las DOS ecuaciones, no solo el angulo del ejemplo.
        paste(im,TEX['line_blue'],1044,369,alpha,align='center')
        paste(im,TEX['spiral_orange'],1044,436,alpha,align='center')
        line(im,(873,510),(1215,510),'#33536A',1)
        paste(im,WORDS[desc],872,529,alpha)
    else:
        paste(im,TEX[main],1044,380,alpha,align='center')
        line(im,(873,479),(1215,479),'#33536A',1)
        paste(im,WORDS[desc],872,500,alpha)

def angle_mark(img,t):
    if not 30<=t<53:return
    j=min(2,int((t-30)//7.65))
    local_t=t-30-j*7.65
    alpha=min(progress(local_t,0,.7),1-progress(local_t,5.9,7.3))
    if alpha<=0:return
    theta,xy=TANGENCIES[j]
    radial=np.array([math.cos(theta),-math.sin(theta)])
    tangent=np.array([K*math.cos(theta)-math.sin(theta),-(K*math.sin(theta)+math.cos(theta))]);tangent/=np.linalg.norm(tangent)
    tmp=img.copy()
    line(tmp,np.array([CX,CY])-R_MAX*SCALE*radial,np.array([CX,CY])+R_MAX*SCALE*radial,CYAN,3)
    line(tmp,xy-58*radial,xy+58*radial,BG_COLOR,9)
    line(tmp,xy-58*tangent,xy+58*tangent,BG_COLOR,9)
    line(tmp,xy-58*radial,xy+58*radial,CYAN,4)
    line(tmp,xy-58*tangent,xy+58*tangent,AMBER,4)
    ts=np.linspace(theta,theta+math.radians(GAMMA),70)
    arc=np.column_stack((xy[0]+39*np.cos(ts),xy[1]-39*np.sin(ts)))
    poly(tmp,arc,BG_COLOR,9)
    poly(tmp,arc,YELLOW,4)
    circle(tmp,xy,5,'#FFFFFF')
    cv2.addWeighted(tmp,alpha,img,1-alpha,0,dst=img)
    bis=theta+math.radians(GAMMA/2)
    q=xy+np.array([80*math.cos(bis),-80*math.sin(bis)])
    paste(img,TEX['gamma'],q[0],q[1]-15,alpha,align='center')
    paste(img,TEX['point'],xy[0]+12,xy[1]+3,alpha)

def frame(t):
    im=BASE.copy()
    if t>=5:
        p1,p2,color=LINES[FIRST_LINE]
        f=progress(t,5.3,12.5)
        origin=np.array([CX,CY]);line(im,origin+(p1-origin)*f,origin+(p2-origin)*f,color,3)
    if t>=15:
        points,color=SPIRALS[0]
        n=max(2,int((len(points)-1)*progress(t,15.2,25)))
        poly(im,points[:n],color,4)
    angle_mark(im,t)
    if t>=54:
        for j,(p1,p2,color) in enumerate(LINES):
            if j==FIRST_LINE:continue
            f=progress(t,54+j*.38,58.7+j*.38)
            if f<=0:continue
            origin=np.array([CX,CY]);line(im,origin+(p1-origin)*f,origin+(p2-origin)*f,color,2)
    if t>=67:
        for j,(pts,color) in enumerate(SPIRALS[1:],start=1):
            f=progress(t,67+(j-1)*.9,74.1+(j-1)*.65)
            if f<=0:continue
            n=max(2,int((len(pts)-1)*f));poly(im,pts[:n],color,3)
    right_panel(im,t)
    return im

if args.preview:
    for t,name in [(9,'recta'),(20,'espiral'),(38,'angulo'),(57,'familia_rectas'),(78,'familia_isogonal'),(91,'final')]:
        path=f'/mnt/data/trayectorias_isogonales_v7_vista_{name}.png'
        cv2.imwrite(path,frame(t));print('PREVIEW',path,flush=True)
else:
    total=round(DURATION*FPS)
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}',
         '-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','17',
         '-pix_fmt','yuv420p','-movflags','+faststart','-threads','6',OUT]
    enc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.PIPE)
    started=time.time()
    for index in range(total):
        im=frame(index/FPS)
        try:enc.stdin.write(im.tobytes())
        except BrokenPipeError:raise RuntimeError(enc.stderr.read().decode(errors='replace')[-2000:])
        if index%150==0:print(f'PROGRESS {index/FPS:.1f}s/{DURATION:.1f}s, elapsed={time.time()-started:.1f}s',flush=True)
    enc.stdin.close();code=enc.wait()
    if code:raise RuntimeError(enc.stderr.read().decode(errors='replace')[-2000:])
    print('DELIVERED',OUT,'bytes=',os.path.getsize(OUT),'elapsed=',time.time()-started,flush=True)