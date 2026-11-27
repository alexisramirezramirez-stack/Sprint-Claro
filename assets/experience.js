/* Presentation and workspace navigation only. No change to data, storage or business rules. */
(function(){
  'use strict';
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal=Array.from(document.querySelectorAll('[data-reveal]'));
  if(!reduced&&'IntersectionObserver' in window){
    const observer=new window.IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.08});
    reveal.forEach(element=>{element.classList.add('reveal-ready');observer.observe(element);});
  }
  const nav=document.querySelector('[data-section-nav]');
  const links=nav?Array.from(nav.querySelectorAll('a')).filter(a=>(a.getAttribute('href')||'').startsWith('#')):[];
  const sections=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  function show(id){
    const selected=sections.find(section=>section.id===id);
    if(!selected)return false;
    sections.forEach(section=>{section.hidden=section!==selected;});
    links.forEach(a=>{if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    return true;
  }
  function openDestination(hash){
    if(!hash||hash==='#')return false;
    let id;try{id=decodeURIComponent(hash.slice(1));}catch{return false;}
    const element=document.getElementById(id);if(!element)return false;
    const section=element.closest('.workspace-section');
    if(section)show(section.id);
    if(element.tagName==='DETAILS')element.open=true;
    let parent=element.parentElement;
    while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
    return !!section||element.tagName==='DETAILS';
  }
  const initial=sections.length?(nav.getAttribute('data-default-section')||sections[0].id):'';
  if(initial){
    document.body.classList.add('workspace-views');
    show(initial);
  }
  openDestination(window.location.hash);
  document.addEventListener('click',event=>{
    const link=event.target.closest&&event.target.closest('a');
    const href=link&&link.getAttribute('href');
    if(href&&href.startsWith('#'))openDestination(href);
  });
  window.addEventListener('hashchange',()=>{
    if(!window.location.hash&&initial)show(initial);
    else openDestination(window.location.hash);
  });
  // Feedback remains visible next to the current task, with an explicit close control.
  const notice=document.getElementById('app-message')||document.getElementById('message');
  if(notice&&'MutationObserver' in window){
    const dismissible=()=>{
      if(!notice.textContent.trim()||notice.querySelector('.notice-close'))return;
      const close=document.createElement('button');
      close.type='button';close.className='notice-close';close.textContent='×';
      close.setAttribute('aria-label','Cerrar aviso');
      close.addEventListener('click',()=>{notice.hidden=true;});
      notice.classList.add('notice-toast');notice.append(close);
    };
    new window.MutationObserver(dismissible).observe(notice,{childList:true});
    dismissible();
  }
  // Useful to integrations of the UI only: it never mutates application data.
  window.WorkspaceExperience=Object.freeze({show,openDestination});
})();
