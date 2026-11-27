const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');

function matches(e,selector){
  if(!e||e.nodeType!==1)return false;
  let s=selector.trim();
  const nots=[...s.matchAll(/:not\(([^)]+)\)/g)].map(m=>m[1]);s=s.replace(/:not\([^)]+\)/g,'');
  if(nots.some(n=>matches(e,n)))return false;
  const attrs=[...s.matchAll(/\[([^=\]]+)(?:=['"]?([^\]'"]+)['"]?)?\]/g)];s=s.replace(/\[[^\]]+\]/g,'');
  if(attrs.some(m=>!e.hasAttribute(m[1])||(m[2]!==undefined&&e.getAttribute(m[1])!==m[2])))return false;
  if(s.startsWith('#'))return e.id===s.slice(1);
  if(s.startsWith('.'))return e.classList.contains(s.slice(1));
  return !s||e.tagName.toLowerCase()===s.toLowerCase();
}
class Element{
  constructor(tag,attrs={},doc){this.tagName=tag.toUpperCase();this.nodeType=tag==='document'?9:1;this.attributes={...attrs};this.doc=doc;this.children=[];this.parentElement=null;this.events={};this._text='';this._value=undefined;this.style={};this.files=[];this.customValidity='';}
  get classList(){const e=this;return{contains(c){return e.className.split(/\s+/).includes(c);},add(c){e.className=[...new Set([...e.className.split(/\s+/).filter(Boolean),c])].join(' ');},remove(c){e.className=e.className.split(/\s+/).filter(x=>x!==c).join(' ');},toggle(c,force){const on=force===undefined?!this.contains(c):force;on?this.add(c):this.remove(c);return on;}};}
  get dataset(){return Object.fromEntries(Object.entries(this.attributes).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
  get value(){if(this._value!==undefined)return this._value;if(this.tagName==='SELECT'){const opts=this.querySelectorAll('option');return opts.find(o=>o.hasAttribute('selected'))?.value??opts[0]?.value??'';}if(this.tagName==='OPTION')return this.attributes.value??this.textContent;return this.attributes.value??'';}
  set value(v){this._value=String(v);}
  get textContent(){return this._text+this.children.map(c=>typeof c==='string'?c:c.textContent).join('');}
  set textContent(v){this._text=String(v);this.children.forEach(c=>{if(c instanceof Element)c.parentElement=null;});this.children=[];}
  get firstElementChild(){return this.children.find(c=>c instanceof Element)||null;}
  get isConnected(){let e=this;while(e.parentElement)e=e.parentElement;return e===this.doc;}
  set innerHTML(_){throw new Error('Unexpected innerHTML write: XSS-sensitive path');}
  get innerHTML(){throw new Error('Unexpected innerHTML read');}
  get selectedOptions(){return this.querySelectorAll('option').filter(o=>o.value===this.value);}
  hasAttribute(k){return Object.hasOwn(this.attributes,k);}
  getAttribute(k){return this.attributes[k]??null;}
  setAttribute(k,v){this.attributes[k]=String(v);}
  removeAttribute(k){delete this.attributes[k];}
  append(...nodes){nodes.forEach(n=>{if(n instanceof Element){if(n.parentElement)n.remove();n.parentElement=this;}this.children.push(n);});}
  prepend(...nodes){nodes.reverse().forEach(n=>{if(n instanceof Element){if(n.parentElement)n.remove();n.parentElement=this;}this.children.unshift(n);});}
  replaceChildren(...nodes){this._text='';this.children.forEach(c=>{if(c instanceof Element)c.parentElement=null;});this.children=[];this.append(...nodes);}
  remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(c=>c!==this);this.parentElement=null;}
  querySelectorAll(selector){const result=[];const selectors=selector.split(',').map(x=>x.trim());function walk(n){for(const c of n.children){if(!(c instanceof Element))continue;if(selectors.some(s=>matches(c,s)))result.push(c);walk(c);}}walk(this);return result;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){let e=this;while(e){if(matches(e,selector))return e;e=e.parentElement;}return null;}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  async dispatch(type,extra={}){const event={type,target:this,currentTarget:this,preventDefault(){this.defaultPrevented=true;},...extra};await Promise.all((this.events[type]||[]).map(fn=>fn(event)));return event;}
  async click(){if(this.disabled)return;if(this.download)this.doc.downloads.push({name:this.download,blob:this.doc.blobs.get(this.href)});await this.dispatch('click');}
  focus(){this.doc.activeElement=this;}
  select(){this.doc.selectedText=this.value;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  setCustomValidity(message){this.customValidity=message;}
  checkValidity(){
    if(this.disabled)return true;
    if(this.customValidity)return false;
    const v=this.value;if(this.required&&!v)return false;
    if(this.type==='email'&&v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))return false;
    if(this.type==='number'&&v){const n=Number(v);if(!Number.isFinite(n)||this.min!==''&&n<Number(this.min)||this.max!==''&&n>Number(this.max))return false;}
    return true;
  }
  reportValidity(){return ['INPUT','SELECT','TEXTAREA'].includes(this.tagName)?this.checkValidity():this.querySelectorAll('input,textarea,select').every(f=>f.checkValidity());}
}
for(const [key,attr]of Object.entries({id:'id',className:'class',name:'name',type:'type',href:'href',download:'download',rel:'rel',target:'target',placeholder:'placeholder',maxLength:'maxlength',min:'min',max:'max',step:'step',accept:'accept',tabIndex:'tabindex'}))Object.defineProperty(Element.prototype,key,{get(){return this.attributes[attr]??'';},set(v){this.attributes[attr]=String(v);}});
for(const key of ['hidden','disabled','required','checked','open'])Object.defineProperty(Element.prototype,key,{get(){return Object.hasOwn(this.attributes,key);},set(v){if(v)this.attributes[key]='';else delete this.attributes[key];}});

function boot(options={}){
  const doc=new Element('document');doc.doc=doc;doc.downloads=[];doc.blobs=new Map();doc.activeElement=null;doc.selectedText='';
  const page=options.page||'herramientas';const raw=JSON.parse(fs.readFileSync(path.join(__dirname,page+'-dom.json'),'utf8'));const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,page+'.html'))).digest('hex');assert.equal(raw.sourceSHA,hash,'Regenera el DOM: python pruebas/generar_dom.py');
  function build(data){if(typeof data==='string')return data;const node=new Element(data.tag,data.attrs,doc);node.append(...data.children.map(build));return node;}
  doc.append(...raw.children.map(build));doc.body=doc.querySelector('body');doc.documentElement=doc.querySelector('html');doc.getElementById=id=>doc.querySelector('#'+id);doc.createElement=tag=>new Element(tag,{},doc);doc.createElementNS=(_,tag)=>doc.createElement(tag);
  const storage=options.storage||new Map();const localStorage={getItem(k){if(options.storageThrows)throw new Error('Storage blocked');return storage.get(k)||null;},setItem(k,v){if(options.storageThrows)throw new Error('Storage blocked');storage.set(k,String(v));},removeItem(k){storage.delete(k);}};
  const location=new URL(options.url||'https://local.example/herramientas.html');const events={};let timer=0;const clipboard=[];
  const win={location,localStorage,crypto,events,history:{replaceState(_,__,value){const url=new URL(value,location.href);location.href=url.href;}},setTimeout(){return ++timer;},clearTimeout(){},addEventListener(type,fn){(events[type]??=[]).push(fn);}};
  class TestURL extends URL{static createObjectURL(blob){const u='blob:qa-'+doc.blobs.size;doc.blobs.set(u,blob);return u;}static revokeObjectURL(){}}
  const navigator={clipboard:options.clipboardThrows?{async writeText(){throw Error('Blocked');}}:{async writeText(text){clipboard.push(text);}}};
  const sandbox={document:doc,window:win,location,localStorage,URL:TestURL,URLSearchParams,Blob,TextEncoder,TextDecoder,btoa:text=>Buffer.from(text,'binary').toString('base64'),atob:text=>Buffer.from(text,'base64').toString('binary'),navigator,setTimeout:win.setTimeout,clearTimeout:win.clearTimeout,console,Intl,Date,Math,Object,String,Number,Array,Set,Map,JSON,encodeURIComponent,decodeURIComponent};
  const context=vm.createContext(sandbox);
  for(const file of ['core.js','app.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,'assets',file),'utf8'),context,{filename:file,timeout:4000});
  const app={doc,win,context,store:win.SprintClaro||win.SeguimientoAmbiental,storage,clipboard,get:id=>doc.getElementById(id),query:selector=>doc.querySelector(selector),all:selector=>doc.querySelectorAll(selector),record:id=>doc.querySelector('[data-record-id="'+id+'"]'),file(id,text,name='input.json'){app.get(id).files=[{name,size:Buffer.byteLength(text),text:async()=>text}];}};
  return app;
}
module.exports={boot,Element,ROOT};
