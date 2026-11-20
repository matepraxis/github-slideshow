(()=>{
"use strict";
const $=(id)=>document.getElementById(id);
const state={lessons:[],lesson:null,index:0,mode:"native",playing:false,paused:false,speechToken:0,utterance:null,timer:null,voices:[],audioFallback:0,ready:false};
const audio=$("audio"),synth=("speechSynthesis" in window?window.speechSynthesis:null);
const formatTime=t=>Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
const escapeHtml=t=>String(t).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function math(el,tex,display=true){
  el.hidden=!tex;el.textContent=tex||"";
  if(tex&&window.katex){try{window.katex.render(tex,el,{displayMode:display,throwOnError:false,strict:"ignore",trust:false});}catch(e){el.textContent=tex;}}
}
function selectedVoice(){
  const uri=$("voiceChoice").value;
  return state.voices.find(v=>v.voiceURI===uri)||state.voices[0]||null;
}
function rankVoice(v){
 const name=(v.name||"").toLowerCase(), lang=(v.lang||"").toLowerCase();
 let score=lang.startsWith("es-co")?75:lang.startsWith("es-mx")?65:lang.startsWith("es")?50:0;
 if(/neural|natural|online|premium|enhanced/.test(name))score+=180;
 if(/google/.test(name))score+=75;
 if(/microsoft/.test(name))score+=65;
 if(/dalia|isabela|sabina|elena|helena|jorge|pablo/.test(name))score+=15;
 return score;
}
function refreshVoices(){
 if(!synth)return;
 const old=$("voiceChoice").value;
 let saved="";try{saved=localStorage.getItem("algebra_voice_uri")||"";}catch(e){}
 state.voices=synth.getVoices().filter(v=>(v.lang||"").toLowerCase().startsWith("es")).sort((a,b)=>rankVoice(b)-rankVoice(a));
 const box=$("voiceChoice");box.textContent="";
 const automatic=new Option("Español automático (dispositivo)","");box.append(automatic);
 state.voices.forEach(v=>box.append(new Option(v.name+" · "+v.lang,v.voiceURI)));
 const chosen=old||saved;box.value=state.voices.some(v=>v.voiceURI===chosen)?chosen:(state.voices[0]?.voiceURI||"");
 $("voiceHelp").textContent=state.voices.length?
   "Selecciona una voz que suene natural y pulsa «Probar voz». Se utiliza la voz instalada en tu dispositivo.":
   "No aparece ninguna voz española instalada. Chrome o Edge pueden ofrecer voces adicionales al configurar el idioma del sistema.";
}
function setStatus(message){$("status").textContent=message;}
function switchButtons(){
 const running=state.playing&&!state.paused;
 $("play").textContent=running?"Ⅱ":"▶";
 $("bigPlay").textContent=running?"Ⅱ":"▶";
 $("play").setAttribute("aria-label",running?"Pausar narración":"Reproducir narración");
}
function stopSpeech(){
 state.speechToken++;
 if(state.timer){clearTimeout(state.timer);state.timer=null;}
 state.utterance=null;state.playing=false;state.paused=false;
 if(synth){try{synth.cancel();}catch(e){}}
 switchButtons();
}
function stopAll(){audio.pause();stopSpeech();}
function speakStep(index){
 if(!state.lesson)return;
 stopSpeech();setStep(index);
 if(!synth||!window.SpeechSynthesisUtterance){
   setStatus("Tu navegador no dispone de narración en voz. Abre la clase en Chrome o Edge con una voz española habilitada.");
   return;
 }
 const token=state.speechToken,id=state.lesson.id,step=state.lesson.steps[index];
 const utter=new SpeechSynthesisUtterance(step.say);
 const voice=selectedVoice();
 utter.lang=voice?.lang||"es-CO";if(voice)utter.voice=voice;
 utter.rate=Number($("speed").value)||1;utter.pitch=1;utter.volume=1;
 state.utterance=utter;state.playing=true;state.paused=false;switchButtons();
 utter.onstart=()=>{
   if(token!==state.speechToken)return;
   setStatus("Explicación en voz: paso "+(index+1)+" de "+state.lesson.steps.length+".");
 };
 utter.onend=()=>{
   if(token!==state.speechToken||!state.lesson||state.lesson.id!==id)return;
   state.playing=false;state.utterance=null;switchButtons();
   if(index+1<state.lesson.steps.length){
     state.timer=setTimeout(()=>{
       state.timer=null;
       if(token===state.speechToken&&state.lesson&&state.lesson.id===id&&!state.paused)speakStep(index+1);
     },700);
     setStatus("Paso "+(index+1)+" completado. Continúa la explicación.");
   }else{
     setStatus("Clase terminada. Comprueba tus respuestas en la pregunta de repaso.");
     $("quiz").scrollIntoView({behavior:"smooth",block:"nearest"});
   }
 };
 utter.onerror=(e)=>{
   if(token!==state.speechToken||["canceled","interrupted"].includes(e.error))return;
   state.playing=false;switchButtons();
   setStatus("No se pudo reproducir esta voz ("+(e.error||"error")+"). Prueba otra voz del dispositivo.");
 };
 try{synth.speak(utter);}catch(e){state.playing=false;switchButtons();setStatus("La voz elegida no pudo iniciarse. Prueba otra en el selector.");}
}
function playNative(){
 if(!state.lesson)return;
 if(!synth){setStatus("Tu navegador no permite lectura en voz. Usa Chrome o Edge con una voz de español instalada.");return;}
 if(state.paused){
   state.paused=false;
   try{synth.resume();}catch(e){speakStep(state.index);}
   state.playing=true;switchButtons();setStatus("Narración reanudada.");
   return;
 }
 if(state.playing){
   if(state.timer){clearTimeout(state.timer);state.timer=null;state.playing=false;state.paused=false;setStatus("Pausa entre explicaciones. Pulsa ▶ para continuar.");switchButtons();return;}
   try{synth.pause();state.paused=true;switchButtons();setStatus("Narración en pausa.");}
   catch(e){stopSpeech();setStatus("Narración detenida.");}
   return;
 }
 speakStep(state.index);
}
function playRecorded(){
 if(!audio.paused){audio.pause();return;}
 audio.play().catch(()=>setStatus("No se pudo iniciar el audio grabado; pulsa de nuevo o utiliza la voz alternativa."));
}
function togglePlay(){if(!state.lesson)return;state.mode==="recorded"?playRecorded():playNative();}
function setStep(index){
 if(!state.lesson)return;
 index=Math.min(state.lesson.steps.length-1,Math.max(0,index));
 if(state.index===index&&$("stageTitle").textContent)return;
 state.index=index;
 const step=state.lesson.steps[index];
 $("stepLabel").textContent="PASO "+String(index+1).padStart(2,"0")+" / "+state.lesson.steps.length;
 $("stageTitle").textContent=step.title;
 math($("mathMain"),step.math);math($("mathSecondary"),step.sub);
 $("stageNote").textContent=step.note||"";
 $("lawTitle").textContent=step.law||"Justificación matemática";
 $("transcript").textContent=step.say;
 Array.from($("steps").children).forEach((li,i)=>li.firstElementChild.classList.toggle("active",i===index));
 $("stage").classList.remove("step-enter");void $("stage").offsetWidth;$("stage").classList.add("step-enter");
 if(state.mode!=="recorded"){
   $("seek").value=index;$("clock").textContent=(index+1)+" / "+state.lesson.steps.length+" pasos";
 }
}
function recordTimeToStep(t){
 const steps=state.lesson.steps;
 let n=0;for(let i=1;i<steps.length;i++)if(t>=steps[i].at)n=i;
 return n;
}
function updateRecorded(){
 if(!state.lesson||state.mode!=="recorded")return;
 const t=audio.currentTime||0;
 setStep(recordTimeToStep(t));
 $("seek").value=t;
 $("clock").textContent=formatTime(t)+" / "+formatTime(state.lesson.audioDuration);
}
function jump(index,fromUser=true){
 if(!state.lesson)return;
 if(state.mode==="recorded"){
   const target=state.lesson.steps[index].at||0;
   setStep(index);audio.currentTime=target;updateRecorded();
   if(fromUser&&audio.paused)playRecorded();
 }else{
   if(fromUser)speakStep(index);
   else{stopSpeech();setStep(index);}
 }
}
function buildCatalog(){
 $("cards").textContent="";
 state.lessons.forEach((lesson,k)=>{
   const card=document.createElement("button");card.type="button";card.className="card";
   const top=document.createElement("div");top.className="cardhead";
   const number=document.createElement("span");number.textContent="EJERCICIO "+(k+1);
   const label=document.createElement("span");label.textContent=lesson.audio?"● Narración grabada":"● Narración en español";
   top.append(number,label);
   const h=document.createElement("h3");h.textContent=lesson.title;
   const kind=document.createElement("div");kind.className="kind";kind.textContent=lesson.topic;
   const eq=document.createElement("div");eq.className="eq";math(eq,lesson.equation);
   const footer=document.createElement("div");footer.className="foot";footer.textContent=lesson.steps.length+" pasos detallados · Escuchar clase →";
   card.append(top,h,kind,eq,footer);
   card.addEventListener("click",()=>openLesson(lesson.id));
   $("cards").append(card);
 });
}
function initQuiz(lesson){
 $("quizTitle").textContent="Comprueba tu comprensión · Ejercicio "+lesson.id;
 $("quizQuestion").textContent=lesson.quiz.q;
 $("quizAnswers").textContent="";
 $("quizFeedback").hidden=true;
 lesson.quiz.answers.forEach((answer,index)=>{
   const b=document.createElement("button");b.type="button";b.className="quiz-option";b.textContent=(index+1)+". "+answer;
   b.addEventListener("click",()=>{
     Array.from($("quizAnswers").children).forEach(a=>a.classList.remove("selected"));
     b.classList.add("selected");
     $("quizFeedback").hidden=false;
     $("quizFeedback").textContent=(index===lesson.quiz.correct?"Correcto. ":"Revisa este paso. ")+lesson.quiz.why;
   });$("quizAnswers").append(b);
 });
}
function openLesson(id){
 const lesson=state.lessons.find(x=>x.id===String(id));if(!lesson)return;
 stopAll();state.lesson=lesson;state.audioFallback=0;state.index=0;state.mode=lesson.audio?"recorded":"native";
 $("home").hidden=true;$("view").hidden=false;
 $("lessonTitle").textContent="Ejercicio "+id+" · "+lesson.title;
 $("lessonSubtitle").textContent=lesson.subtitle;
 $("audioBadge").textContent=lesson.audio?"Voz aprobada, grabación de alta claridad":"Locución mediante el navegador";
 $("steps").textContent="";
 lesson.steps.forEach((s,i)=>{
   const li=document.createElement("li"),btn=document.createElement("button");btn.type="button";
   const num=document.createElement("span");num.className="stepnum";num.textContent=String(i+1).padStart(2,"0");
   const lab=document.createElement("span");lab.className="steplabel";lab.textContent=s.title;
   btn.append(num,lab);
   if(lesson.audio){const time=document.createElement("span");time.className="steptime";time.textContent=formatTime(s.at);btn.append(time);}
   btn.addEventListener("click",()=>jump(i));
   li.append(btn);$("steps").append(li);
 });
 $("voiceTools").hidden=!!lesson.audio;
 $("speed").hidden=false;
 $("replay10").hidden=!lesson.audio;
 $("seek").min=0;$("seek").max=lesson.audio?lesson.audioDuration:lesson.steps.length-1;
 $("seek").step=lesson.audio?0.05:1;$("seek").value=0;
 $("clock").textContent=lesson.audio?"0:00 / "+formatTime(lesson.audioDuration):"1 / "+lesson.steps.length+" pasos";
 $("stageTitle").textContent="";
 setStep(0);initQuiz(lesson);
 if(lesson.audio){audio.src="/audio";audio.playbackRate=Number($("speed").value);audio.load();
   setStatus("Pulsa ▶ para escuchar la narración grabada con la voz aprobada.");
 }else{
   setStatus("Pulsa ▶ para iniciar la clase narrada. Selecciona y prueba una voz española del navegador si lo deseas.");
 }
 state.playing=false;state.paused=false;switchButtons();
 window.location.hash="ejercicio-"+id;
 window.scrollTo(0,0);
}
function closeLesson(){
 stopAll();state.lesson=null;
 $("home").hidden=false;$("view").hidden=true;window.location.hash="inicio";window.scrollTo(0,0);
}
function fallbackFromRecording(){
 if(!state.lesson||state.mode!=="recorded")return;
 if(state.audioFallback===0){
   state.audioFallback++;
   const oldTime=audio.currentTime||0;
   audio.src=state.lesson.audio;audio.load();
   audio.addEventListener("loadedmetadata",function ret(){audio.removeEventListener("loadedmetadata",ret);audio.currentTime=oldTime;},{once:true});
   setStatus("Probando el audio grabado desde la fuente alternativa...");
 }else{
   state.mode="native";audio.pause();state.playing=false;
   $("voiceTools").hidden=false;$("replay10").hidden=true;
   $("seek").max=state.lesson.steps.length-1;$("seek").step=1;$("seek").value=state.index;
   setStatus("La grabación no se pudo cargar. Usa ▶ para escuchar la clase mediante una voz española del navegador.");
   switchButtons();
 }
}
$("back").addEventListener("click",closeLesson);
$("play").addEventListener("click",togglePlay);
$("bigPlay").addEventListener("click",togglePlay);
$("prev").addEventListener("click",()=>state.lesson&&jump(Math.max(0,state.index-1)));
$("next").addEventListener("click",()=>state.lesson&&jump(Math.min(state.lesson.steps.length-1,state.index+1)));
$("replay10").addEventListener("click",()=>{if(state.lesson&&state.mode==="recorded"){audio.currentTime=Math.max(0,audio.currentTime-10);updateRecorded();}});
$("seek").addEventListener("input",e=>{
 if(!state.lesson)return;
 if(state.mode==="recorded"){audio.currentTime=Number(e.target.value);updateRecorded();}
 else{stopSpeech();setStep(Number(e.target.value));}
});
$("speed").addEventListener("change",e=>{
 audio.playbackRate=Number(e.target.value);
 if(state.lesson&&state.mode==="native"&&state.playing)speakStep(state.index);
});
$("full").addEventListener("click",()=>{
 if(document.fullscreenElement){document.exitFullscreen?.();}
 else{$("player").requestFullscreen?.();}
});
$("voiceChoice").addEventListener("change",e=>{
 try{localStorage.setItem("algebra_voice_uri",e.target.value);}catch(err){}
 if(state.lesson&&state.mode==="native"){stopSpeech();setStatus("Voz seleccionada. Pulsa ▶ para escuchar desde este paso.");}
});
$("testVoice").addEventListener("click",()=>{
 if(!synth||!window.SpeechSynthesisUtterance){setStatus("No hay lectura en voz disponible en este navegador.");return;}
 stopSpeech();
 const utter=new SpeechSynthesisUtterance("Hola. Vamos a resolver el ejercicio paso a paso, justificando cada transformación mediante las propiedades de la igualdad.");
 const v=selectedVoice();utter.lang=v?.lang||"es-CO";if(v)utter.voice=v;utter.rate=Number($("speed").value)||1;
 setStatus("Escuchando una muestra de la voz seleccionada. Pulsa ▶ para iniciar la clase después.");
 synth.speak(utter);
});
$("restart").addEventListener("click",()=>{
 if(!state.lesson)return;
 if(state.mode==="recorded"){audio.pause();audio.currentTime=0;updateRecorded();}
 else{stopSpeech();setStep(0);}
 switchButtons();setStatus("Listo para escuchar desde el principio.");
});
audio.addEventListener("timeupdate",updateRecorded);
audio.addEventListener("seeked",updateRecorded);
audio.addEventListener("play",()=>{if(!state.lesson||state.mode!=="recorded")return;state.playing=true;state.paused=false;switchButtons();setStatus("Reproduciendo la explicación grabada.");});
audio.addEventListener("pause",()=>{if(state.mode==="recorded"){state.playing=false;switchButtons();}});
audio.addEventListener("waiting",()=>{if(state.mode==="recorded")setStatus("Cargando la grabación...");});
audio.addEventListener("ended",()=>{if(state.mode==="recorded"){state.playing=false;switchButtons();setStatus("Explicación terminada. Resuelve la pregunta de repaso.");}});
audio.addEventListener("error",fallbackFromRecording);
document.addEventListener("keydown",e=>{
 if($("view").hidden||e.target.closest("button,input,select"))return;
 if(e.code==="Space"){e.preventDefault();togglePlay();}
 if(e.key==="ArrowRight"){e.preventDefault();$("next").click();}
 if(e.key==="ArrowLeft"){e.preventDefault();$("prev").click();}
});
if(synth){
 refreshVoices();
 if(typeof synth.addEventListener==="function")synth.addEventListener("voiceschanged",refreshVoices);
 else synth.onvoiceschanged=refreshVoices;
}
fetch("/lessons.json").then(r=>{if(!r.ok)throw Error("No se cargaron las lecciones");return r.json();})
.then(data=>{
 if(!Array.isArray(data.lessons)||data.lessons.length!==4)throw Error("Número inesperado de ejercicios");
 state.lessons=data.lessons;state.ready=true;buildCatalog();
 const hash=decodeURIComponent(location.hash||"");
 if(/^#ejercicio-[1-4]$/.test(hash))openLesson(hash.slice(-1));
}).catch(e=>{$("cards").textContent="No se pudieron cargar las clases. Actualiza la página. Error: "+e.message;});
})();