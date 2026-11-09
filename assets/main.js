'use strict';const $=id=>document.getElementById(id);const menu=$('menu-button');menu?.addEventListener('click',()=>{const n=$('mobile-menu');n.hidden=!n.hidden;menu.setAttribute('aria-expanded',String(!n.hidden));});$('mobile-menu')?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{$('mobile-menu').hidden=true;menu.setAttribute('aria-expanded','false');}));$('copy-link')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('copy-feedback').textContent='Enlace copiado';}catch(e){$('copy-feedback').textContent='Copia la dirección del navegador';}});function neuron(){let x=+$('x1').value,y=+$('x2').value,w=+$('w1').value,v=+$('w2').value,b=+$('bias').value,z=x*w+y*v+b,p=1/(1+Math.exp(-z));for(const [id,n,dp] of [['val-x1',x,2],['val-x2',y,2],['val-w1',w,1],['val-w2',v,1],['val-bias',b,1]])$(id).textContent=n.toFixed(dp);$('neuron-result').textContent=p.toFixed(3);$('neuron-equation').textContent=`σ(${w.toFixed(1)} × ${x.toFixed(2)} + (${v.toFixed(1)}) × ${y.toFixed(2)} + (${b.toFixed(1)})) = σ(${z.toFixed(2)})`;for(const [id,n] of [['weight-line-1',w],['weight-line-2',v]]){const l=$(id);l?.setAttribute('stroke',n<0?'#edab90':'#7be4d5');l?.setAttribute('stroke-width',String(1+Math.abs(n)*3));}}['x1','x2','w1','w2','bias'].forEach(id=>$(id)?.addEventListener('input',neuron));neuron();const desc=[
'Entrada: los puntos de la izquierda representan los números que recibe la red. Se iluminan primero.',
'Capas ocultas: los puntos centrales reciben información de la capa anterior; las conexiones destacadas muestran su recorrido.',
'Salida: los puntos de la derecha reúnen la información procesada para producir la respuesta.'
];
const ns='http://www.w3.org/2000/svg';
const make=(tag,a)=>{const el=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el.setAttribute(k,String(v)));return el};
const networkGroup=$('network-dynamic');
const networkLayers=[[65,[50,100,150]],[215,[30,76,124,170]],[365,[50,100,150]],[505,[76,124]]];
let selectedStage=0;
function renderNetwork(stage){
 if(!networkGroup)return;
 networkGroup.replaceChildren();
 const activeNodes=stage===0?[0]:stage===1?[1,2]:[3];
 const activeEdges=stage===0?[0]:stage===1?[0,1]:[2];
 const fragments=document.createDocumentFragment();
 const edges=make('g',{'aria-hidden':'true'});
 for(let k=0;k<networkLayers.length-1;k++){
  for(const sourceY of networkLayers[k][1]){
   for(const targetY of networkLayers[k+1][1]){
    const highlighted=activeEdges.includes(k);
    const line=make('line',{x1:networkLayers[k][0],y1:sourceY,x2:networkLayers[k+1][0],y2:targetY,stroke:highlighted?'#eeb08f':'#6c9292','stroke-width':highlighted?3.8:1.1,'stroke-opacity':highlighted?0.85:0.22,'stroke-linecap':'round'});
    if(highlighted){line.style.filter='drop-shadow(0 0 4px rgba(255,193,141,.75))';}
    edges.append(line);
   }
  }
 }
 fragments.append(edges);
 const dots=make('g',{'aria-hidden':'true'});
 networkLayers.forEach(([x,ys],k)=>ys.forEach(y=>{
   const active=activeNodes.includes(k);
   if(active)dots.append(make('circle',{cx:x,cy:y,r:19,fill:'#79e0d3','fill-opacity':'.15'}));
   const dot=make('circle',{cx:x,cy:y,r:active?14:10,fill:active?'#f7c09b':'#487779',stroke:active?'#fff2dc':'#7cb7b1','stroke-width':active?3:1,'opacity':active?1:.64});
   if(active)dot.style.filter='drop-shadow(0 0 7px rgba(255,193,141,.9))';
   dots.append(dot);
 }));
 fragments.append(dots);
 networkGroup.append(fragments);
 const graph=$('stage-network');
 if(graph)graph.setAttribute('aria-label',stage===0?'Etapa de entrada resaltada: primera columna de neuronas encendida.':stage===1?'Capas ocultas resaltadas: columnas centrales y conexiones iluminadas.':'Capa de salida resaltada: última columna de neuronas y sus conexiones iluminadas.');
}
function chooseStage(stage){
 selectedStage=stage;
 document.querySelectorAll('.stage').forEach(btn=>{
  const active=Number(btn.dataset.stage)===stage;
  btn.classList.toggle('active',active);
  btn.setAttribute('aria-pressed',String(active));
 });
 const description=$('stage-description');
 if(description)description.textContent=desc[stage];
 renderNetwork(stage);
}
document.querySelectorAll('.stage').forEach(btn=>btn.addEventListener('click',()=>chooseStage(Number(btn.dataset.stage))));
chooseStage(0);
const f={relu:x=>Math.max(0,x),sigmoid:x=>1/(1+Math.exp(-x)),tanh:x=>Math.tanh(x),linear:x=>x},form={relu:'f(x) = max(0, x)',sigmoid:'σ(x) = 1 / (1 + e⁻ˣ)',tanh:'tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)',linear:'f(x) = x'};function activation(){let k=$('activation-select').value,lim=k==='sigmoid'?[-.2,1.2]:k==='tanh'?[-1.3,1.3]:k==='linear'?[-4.5,4.5]:[-.5,4.5],d='';for(let i=0;i<=250;i++){let x=-4+8*i/250,y=f[k](x);d+=(i?'L':'M')+(40+i*520/250).toFixed(1)+','+(260-230*(y-lim[0])/(lim[1]-lim[0])).toFixed(1)+' ';}$('activation-path').setAttribute('d',d);$('activation-formula').textContent=form[k];$('activation-explanation').textContent='Función '+k+'. Eje x: −4 a 4. Eje y: '+lim[0]+' a '+lim[1]+'.';}$('activation-select')?.addEventListener('change',activation);activation();const train=[[0,0,0],[0,.3,0],[.3,0,0],[.2,.1,0],[1,1,1],[.8,.9,1],[.9,.8,1],[.7,.75,1],[.05,.85,0],[.85,.05,0],[.9,.25,0],[.2,.9,0]],valid=[[.12,.18,0],[.25,.82,0],[.85,.22,0],[.88,.93,1],[.77,.88,1],[.04,.05,0]],sig=x=>1/(1+Math.exp(-x));let m,e,h;function init(){m={w:[[1.2,-.7],[.4,1.1],[-.6,.8]],b:[-.3,.2,.4],v:[.7,-.2,.6],c:-.4};e=0;h=[];}function fw(a,b){let z=m.w.map((w,i)=>sig(w[0]*a+w[1]*b+m.b[i]));return{z,p:sig(z.reduce((s,x,i)=>s+x*m.v[i],m.c))};}function loss(data){return data.reduce((sum,[a,b,y])=>{let p=Math.min(1-1e-8,Math.max(1e-8,fw(a,b).p));return sum-y*Math.log(p)-(1-y)*Math.log(1-p)},0)/data.length;}function step(){let gw=m.w.map(()=>[0,0]),gb=[0,0,0],gv=[0,0,0],gc=0;for(let[a,b,y]of train){let{z,p}=fw(a,b),d=p-y;gc+=d;for(let i=0;i<3;i++){gv[i]+=d*z[i];let dh=d*m.v[i]*z[i]*(1-z[i]);gw[i][0]+=dh*a;gw[i][1]+=dh*b;gb[i]+=dh;}}let lr=1.3/train.length;for(let i=0;i<3;i++){m.v[i]-=lr*gv[i];m.b[i]-=lr*gb[i];for(let j=0;j<2;j++)m.w[i][j]-=lr*gw[i][j];}m.c-=lr*gc;e++;h.push([loss(train),loss(valid)]);}function draw(){let axes=$('train-axis');if(axes){axes.replaceChildren();for(let i=0;i<=4;i++)axes.append(make('line',{x1:48,y1:22+i*50,x2:558,y2:22+i*50,stroke:'#91aaa6','stroke-opacity':'.4'}));}for(let j=0;j<2;j++)$(j?'validation-path':'training-path').setAttribute('d',h.map((v,i)=>(i?'L':'M')+(48+Math.min(i,199)*505/199)+','+(222-Math.min(1.6,v[j])*125)).join(' '));$('train-epoch').textContent=e;$('train-loss').textContent=loss(train).toFixed(4);$('validation-loss').textContent=loss(valid).toFixed(4);$('train-status').textContent='Época '+e+'; pérdidas calculadas con el modelo real.';}init();train.slice(0,8).forEach(([a,b,y])=>{let s=document.createElement('span');s.textContent=`(${a},${b}) → ${y}  `;$('dataset-preview')?.append(s);});draw();let busy=false;function run(n){if(busy)return;busy=true;for(let i=0;i<n;i++)step();draw();busy=false;}$('train-step')?.addEventListener('click',()=>run(1));$('train-button')?.addEventListener('click',()=>run(80));$('train-reset')?.addEventListener('click',()=>{init();draw();});$('load-video')?.addEventListener('click',()=>{let frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/aircAruvnKk';frame.title='Redes neuronales — 3Blue1Brown';frame.allowFullscreen=true;frame.loading='lazy';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';$('video-mount').append(frame);$('load-video').hidden=true;},{once:true});function progress(){let d=document.documentElement.scrollHeight-innerHeight;$('reading-progress').style.width=(d>0?scrollY/d*100:0)+'%';}addEventListener('scroll',progress,{passive:true});progress();