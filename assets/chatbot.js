(function(){
'use strict';
const page=document.body.dataset.page||'sitio';
const pageNames={index:'Inicio',enfoque:'El enfoque',herramientas:'Lienzo de equipo',contacto:'Contacto'};
const KB_URL='assets/knowledge/sprint-claro-kb.json';
const quick=['¿Cómo definir un buen Sprint Goal?','¿Cómo estimamos historias?','¿Qué diferencia hay entre DoD y criterios?','¿Cómo uso las revisiones del lienzo?'];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const launcher=el('button','sc-chat-launcher');launcher.type='button';launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-label','Abrir biblioteca de conocimiento Sprint Claro');launcher.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-9.5a8.5 8.5 0 0 1 17 0Z"/><path d="M8 10h8M8 14h5"/></svg><span>¿Hablamos?</span>';
const panel=el('section','sc-chat');panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Biblioteca de conocimiento Sprint Claro');panel.setAttribute('aria-modal','false');
const header=el('header','sc-chat-header'),mark=el('div','sc-chat-mark','SC'),heading=el('div','sc-chat-heading'),close=el('button','sc-chat-close','×');close.type='button';close.setAttribute('aria-label','Cerrar asistente');heading.append(el('strong','', 'Sprint Claro · Conocimiento'),el('small','', 'Especialista en Sprint Planning'));header.append(mark,heading,close);
const messages=el('div','sc-chat-messages');messages.setAttribute('aria-live','polite');messages.setAttribute('aria-relevant','additions');
const quickbar=el('div','sc-chat-quick');quick.forEach(q=>{const b=el('button','',q);b.type='button';b.addEventListener('click',()=>send(q));quickbar.append(b);});
const form=el('form','sc-chat-form'),compose=el('div','sc-chat-compose'),input=el('textarea');input.rows=1;input.maxLength=1200;input.placeholder='Pregunta sobre Sprint Planning…';input.setAttribute('aria-label','Tu pregunta');const submit=el('button','','Consultar');submit.type='submit';compose.append(input,submit);const privacy=el('p','sc-chat-privacy','Consulta local basada en la biblioteca Sprint Claro. No usa una API de IA ni lee los datos privados de tu lienzo.');form.append(compose,privacy);panel.append(header,messages,quickbar,form);document.body.append(launcher,panel);
let knowledge=null,busy=false;
function addMessage(role,text,sources){const node=el('div','sc-chat-message '+(role==='assistant'?'bot':'user'));node.textContent=text;if(sources&&sources.length){const list=el('div','sc-chat-sources');const label=el('strong','','Fuentes para profundizar');list.append(label);sources.forEach(s=>{const a=el('a','',s.name);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';list.append(a);});node.append(list);}messages.append(node);messages.scrollTop=messages.scrollHeight;}
function toggle(open){panel.classList.toggle('is-open',open);launcher.setAttribute('aria-expanded',String(open));if(open){input.focus();if(!messages.children.length){addMessage('assistant','¡Hola! Soy la biblioteca de conocimiento de Sprint Claro. Puedo ayudarte con Sprint Goal, historias de usuario, refinamiento, estimación, capacidad, dependencias y el uso del lienzo. Mis respuestas se basan en conocimiento estructurado y muestran sus fuentes. ¿Qué quieres resolver?');if(!knowledge)loadKnowledge();}}}
launcher.addEventListener('click',()=>toggle(!panel.classList.contains('is-open')));close.addEventListener('click',()=>toggle(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-open'))toggle(false);});
function normalize(s){return String(s||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ\s-]/g,' ').replace(/\s+/g,' ').trim();}
const stop=new Set(['como','que','para','por','una','uno','las','los','del','con','sin','cuando','donde','cual','cuales','quiero','saber','puedo','debo','sobre','esta','este','hay','son','ser','es','the','and']);
const synonyms={
'meta':['sprint goal','objetivo','proposito','valor','resultado'],
'capacidad':['disponibilidad','vacaciones','ausencias','interrupciones','velocidad','velocity'],
'estimar':['estimacion','puntos','story points','planning poker','tamaño'],
'historia':['hu','user story','historias de usuario','criterios','aceptacion'],
'refinar':['refinamiento','backlog','detalle','preparacion'],
'dependencia':['bloqueo','riesgo','impedimento','ciclo'],
'terminado':['definition of done','dod','hecho','calidad','incremento'],
'lienzo':['sprint claro','herramienta','avisos','revision','respaldo','exportar']
};
function expand(q){const n=normalize(q),tokens=n.split(' ').filter(t=>t.length>2&&!stop.has(t));const extra=[];for(const [key,vals] of Object.entries(synonyms)){if(n.includes(key)||vals.some(v=>n.includes(normalize(v))))extra.push(key,...vals.map(normalize));}return [...new Set([...tokens,...extra])];}
function scoreEntry(entry,tokens,q){const title=normalize(entry.title),tags=(entry.tags||[]).map(normalize),summary=normalize(entry.summary),detail=normalize(entry.detail),category=normalize(entry.category);let score=0;for(const t of tokens){if(title.includes(t))score+=7;if(tags.some(x=>x===t||x.includes(t)||t.includes(x)))score+=5;if(summary.includes(t))score+=2.5;if(category.includes(t))score+=2;if(detail.includes(t))score+=.65;}const nq=normalize(q);if(nq.length>5&&title.includes(nq))score+=8;return score;}
function sourceList(entries){const ids=[...new Set(entries.flatMap(e=>e.sources||[]))];return ids.map(id=>knowledge.sources.find(s=>s.id===id)).filter(Boolean);}
function formatAnswer(q){const tokens=expand(q);const ranked=knowledge.entries.map(e=>({entry:e,score:scoreEntry(e,tokens,q)})).sort((a,b)=>b.score-a.score);const best=ranked.filter(x=>x.score>1.5).slice(0,3);if(!best.length)return {text:'No encontré una ficha suficientemente relacionada en la biblioteca actual. Puedo responder sobre Sprint Planning, Sprint Goal, historias de usuario, criterios de aceptación, refinamiento, estimación, Planning Poker, capacidad, Definition of Done, dependencias y el Lienzo Sprint Claro. Prueba reformular la pregunta con uno de esos conceptos.\n\nLa biblioteca es especializada y no improvisa respuestas cuando no encuentra fundamento.',sources:[]};
const primary=best[0].entry;let text=primary.title+'\n\n'+primary.summary+'\n\n'+primary.detail;
if(primary.steps?.length)text+='\n\nCómo abordarlo:\n'+primary.steps.map((s,i)=>(i+1)+'. '+s).join('\n');
if(primary.example)text+='\n\nEjemplo:\n'+primary.example;
if(primary.pitfalls?.length)text+='\n\nCuida estos errores:\n'+primary.pitfalls.map(s=>'• '+s).join('\n');
if(primary.lens)text+='\n\nEn Sprint Claro:\n'+primary.lens;
const secondary=best.slice(1).filter(x=>x.score>=Math.max(3,best[0].score*.48));if(secondary.length)text+='\n\nTemas relacionados:\n'+secondary.map(x=>'• '+x.entry.title+': '+x.entry.summary).join('\n');
return {text,sources:sourceList(best.map(x=>x.entry))};}
async function loadKnowledge(){try{const r=await fetch(KB_URL,{cache:'no-cache'});if(!r.ok)throw new Error('No se pudo cargar la biblioteca ('+r.status+').');knowledge=await r.json();}catch(e){addMessage('assistant','No pude cargar la biblioteca local. Recarga la página o intenta más tarde. '+e.message);}}
async function send(value){const text=value.trim();if(!text||busy)return;busy=true;submit.disabled=true;input.disabled=true;quickbar.hidden=true;addMessage('user',text);const typing=el('div','sc-chat-typing','Consultando la biblioteca local…');panel.insertBefore(typing,form);try{if(!knowledge){const r=await fetch(KB_URL,{cache:'no-cache'});if(!r.ok)throw new Error('No se pudo cargar la biblioteca.');knowledge=await r.json();}const answer=formatAnswer(text);addMessage('assistant',answer.text,answer.sources);}catch(error){addMessage('assistant','No pude consultar la biblioteca local: '+error.message);}finally{typing.remove();busy=false;submit.disabled=false;input.disabled=false;input.value='';input.focus();messages.scrollTop=messages.scrollHeight;}}
form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
})();