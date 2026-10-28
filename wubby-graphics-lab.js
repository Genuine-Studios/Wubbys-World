/* Wubby's World graphics lab: reusable, cached canvas objects.
   Each object is transparent, has no ground diamond, and anchors at its foot.
   The game renderer owns ALL tile geometry and joins. */
(function(){
 'use strict';
 const cache=new Map();
 const PI=Math.PI;
 function hash(seed,n){const v=Math.sin(seed*127.17+n*78.233)*43758.5453;return v-Math.floor(v);}
 function ellipse(c,x,y,rx,ry,fill){
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,PI*2);c.fillStyle=fill;c.fill();
 }
 function shape(c,pts,fill,stroke,width){
  c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);
  c.closePath();c.fillStyle=fill;c.fill();
  if(stroke){c.lineWidth=width||1;c.strokeStyle=stroke;c.stroke();}
 }
 function line(c,pts,color,width){
  c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);
  c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();
 }
 const defs={
  tuft:{w:24,h:22,draw(c,v){
   ellipse(c,12,19,10,2.3,'#467b5840');
   for(let i=0;i<7;i++){
    const x=5+i*2.5,top=4+(i%3)*2+(v%2)*2;
    line(c,[[12,18],[x,top]],i%2?'#639c60':'#8cbe71',1.5+i%2*.4);
   }
   for(let i=0;i<3;i++)ellipse(c,6+i*6,16-i%2*2,2.4,1.1,'#b6d880');
  }},
  flower:{w:36,h:30,draw(c,v){
   const palette=['#fff7de','#ffe4ea','#eedcf8','#fbd59a'];
   ellipse(c,18,27,13,2.4,'#417b4840');
   for(let j=0;j<4;j++){
    const x=9+j*6,y=17+(j%2)*5,size=j%2?3.7:4.7;
    line(c,[[x,y+6],[x,y-5]],'#598e55',1.3);
    ellipse(c,x-4,y+4,4,1.8,'#6daf65');
    for(let i=0;i<5;i++){let a=i*PI*2/5;ellipse(c,x+Math.cos(a)*size*.75,y-5+Math.sin(a)*size*.75,size*.7,size*.64,palette[(v+j+i)%4]);}
    ellipse(c,x,y-5,1.8,1.8,'#e6a94e');
   }
  }},
  stone:{w:52,h:38,draw(c,v){
   ellipse(c,26,33,23,5,'#4a695a48');
   const d=v%3;
   shape(c,[[6,30],[9,16-d],[20,8-d*2],[34,11],[44,21],[45,31],[29,34]],
      '#84968e','#6a827c',.8);
   shape(c,[[9,16-d],[20,8-d*2],[27,18],[20,30],[6,30]],'#c3c8b6');
   shape(c,[[27,18],[34,11],[44,21],[45,31],[20,30]],'#768e88');
   line(c,[[13,17],[18,13],[24,16]],'#e6e5d1',1.3);
   ellipse(c,35,26,4,2,'#9fb39b');
  }},
  bush:{w:60,h:42,draw(c,v){
   ellipse(c,30,37,27,6,'#52775045');
   const colors=[['#5e985e','#83ba6c','#4b8858'],['#739c62','#a8c878','#5f8a55'],['#568c65','#7bb08b','#47735f'],['#658a57','#9cbf69','#4a7b53']][v%4];
   for(let j=0;j<5;j++){
    const x=[14,28,42,22,36][j],y=[23,16,24,28,29][j],rr=[14,16,13,10,12][j];
    ellipse(c,x,y,rr,rr*.77,colors[j%3]);
    ellipse(c,x-3,y-5,rr*.58,rr*.3,'#d6e8a348');
   }
   for(let j=0;j<6;j++){let x=9+j*8,y=23+(j%3)*3;ellipse(c,x,y,1.9,2.1,(v%2)?'#edc888':'#c9d1a1');}
  }},
  pine:{w:82,h:114,draw(c,v){
   ellipse(c,41,109,27,6,'#3f76564a');
   shape(c,[[37,105],[37,53],[45,52],[46,106]],'#8b684e','#6d5949',.8);
   shape(c,[[37,53],[41,50],[42,101],[37,105]],'#ae8861');
   const p=[['#336b59','#5b9d78','#254f4a'],['#32685d','#71a583','#315e52'],['#44745e','#91ac74','#2b594e'],['#3a765f','#6b9d77','#29564a']][v%4];
   for(let layer=4;layer>=0;layer--){
    const cy=25+layer*14,width=11+layer*5;
    shape(c,[[41,cy-17],[41-width,cy+21],[41,cy+15],[41+width,cy+21]],p[layer%2?0:2],p[2],.7);
    shape(c,[[41,cy-17],[41-width,cy+21],[41,cy+15]],p[1]);
    line(c,[[41-width*.85,cy+16],[41-width*.5,cy+11]],'#c5d49a50',1.7);
   }
   ellipse(c,38,12,3,2,'#cad6ac');
  }},
  apple:{w:104,h:111,draw(c,v){
   ellipse(c,52,104,33,8,'#52784f46');
   shape(c,[[47,103],[44,49],[49,38],[55,47],[58,103]],'#886248','#67543f',1);
   shape(c,[[47,101],[44,49],[49,38],[51,48],[51,101]],'#b38c60');
   line(c,[[49,64],[32,43]],'#8c694a',5);
   line(c,[[52,61],[70,39]],'#8c694a',5);
   const greens=[['#659b62','#8db56d','#a3ca7a'],['#5d965e','#86b870','#b0cc85'],['#5c9a73','#77b282','#a7ce89'],['#729f64','#9cbe78','#bdd48c']][v%4];
   const crown=[[32,57,24,21],[72,52,25,22],[49,31,25,23],[30,34,18,17],[67,27,20,18],[53,67,25,17]];
   for(let j=0;j<crown.length;j++){
    const q=crown[j];
    ellipse(c,q[0],q[1],q[2],q[3],greens[j%3]);
    ellipse(c,q[0]-6,q[1]-8,q[2]*.58,q[3]*.35,'#e5edab55');
   }
   for(let j=0;j<14;j++){
    let px=25+hash(v+31,j)*55,py=25+hash(v+47,j)*42;
    ellipse(c,px,py,2.9,3.2,j%3?'#c94b40':'#e27945');
    ellipse(c,px-1,py-1.2,.7,.9,'#ffbb78');
    line(c,[[px,py-3],[px+1,py-5]],'#527b4c',.9);
   }
  }},
  lily:{w:45,h:21,draw(c,v){
   ellipse(c,22,15,20,5,'#3a7c7190');
   ellipse(c,20,12,17,6,'#5d9d73');
   shape(c,[[21,12],[34,8],[34,13],[24,14]],'#78bc84');
   ellipse(c,19,11,5,2.4,'#9fd5a1');
   for(let j=0;j<6;j++){const a=j*PI/3;ellipse(c,21+Math.cos(a)*5,7+Math.sin(a)*2,5,2.7,j%2?'#faf3e1':'#f9d8dc');}
   ellipse(c,21,7,2.3,1.7,'#e9b96e');
  }},
  reeds:{w:40,h:49,draw(c,v){
   ellipse(c,20,45,17,4,'#547c6445');
   for(let j=0;j<9;j++){
    let xx=7+j*3.1,yt=7+(j%3)*6;
    line(c,[[xx,44],[xx+((j%3)-1)*4,yt]],j%2?'#689a5b':'#8eb66c',1.9);
    if(j%3===0){
     line(c,[[xx,25],[xx-1,8]],'#6f8254',1.6);
     ellipse(c,xx-1,8,2.2,6.2,'#a77c48');
    }
   }
  }}
 };
 function sprite(kind,v){
  const def=defs[kind];if(!def)return null;
  const variant=v%4,key=kind+':'+variant;
  if(cache.has(key))return cache.get(key);
  const el=document.createElement('canvas');
  el.width=def.w*2;el.height=def.h*2;
  const g=el.getContext('2d');g.scale(2,2);def.draw(g,variant);
  cache.set(key,{image:el,w:def.w,h:def.h});
  return cache.get(key);
 }
 function object(c,kind,x,y,scale,variant){
  const item=sprite(kind,variant||0);if(!item)return;
  c.drawImage(item.image,x-item.w*scale*.5,y-item.h*scale,item.w*scale,item.h*scale);
 }
 function dotGrass(c,seed,amount){
  for(let i=0;i<amount;i++){
   const x=(hash(seed,i*2)-.5)*94,y=(hash(seed,i*2+1)-.5)*39;
   if(Math.abs(x)/52+Math.abs(y)/24>.88)continue;
   object(c,'tuft',x,y,.22+hash(seed,i+100)*.25,i);
  }
 }
 function paintTile(c,type,seed,time){
  if(!['grass','meadow','forest','orchard','pond'].includes(type))return false;
  if(type==='grass'||type==='meadow'){
   dotGrass(c,seed,17);
   for(let j=0;j<3;j++){
    const x=(hash(seed,j*3+231)-.5)*70,y=(hash(seed,j*3+232)-.5)*24;
    if(Math.abs(x)/52+Math.abs(y)/24>.84)continue;
    object(c,j===2&&seed%4===0?'stone':'flower',x,y,j===2?.48:.52,seed+j);
   }
   if(type==='meadow')for(let j=0;j<4;j++)
    object(c,'flower',-23+j*14,-6+(j%2)*10,.32,seed+j+5);
  }else if(type==='forest'){
   dotGrass(c,seed,9);
   const v=hash(seed,8),backX=-8+v*21;
   object(c,'bush',backX,-13,.48,seed);
   object(c,'pine',-19,-4,.57+hash(seed,12)*.13,seed);
   if(seed%3!==0)object(c,'stone',20,-10,.45,seed+1);
   object(c,'pine',18,10,.70+hash(seed,13)*.10,seed+1);
   object(c,'flower',-33,14,.34,seed+2);
  }else if(type==='orchard'){
   dotGrass(c,seed,11);
   object(c,'flower',-29,11,.4,seed);
   object(c,'apple',-21,-4,.56+hash(seed,16)*.08,seed);
   object(c,'bush',24,-8,.39,seed+1);
   object(c,'apple',20,12,.62+hash(seed,17)*.1,seed+1);
   for(let j=0;j<4;j++)ellipse(c,-12+j*9,13+j%2*2,1.8,1.7,j%2?'#cb4e39':'#e17c49');
  }else if(type==='pond'){
   // Water stays INSIDE the existing diamond; the caller still draws its rigid ground.
   ellipse(c,0,3,46,19,'#618f8190');
   const water=c.createLinearGradient(-30,-16,30,19);
   water.addColorStop(0,'#9bded8');water.addColorStop(.55,'#70bcc3');water.addColorStop(1,'#478fa8');
   ellipse(c,0,1,43,16.5,water);
   ellipse(c,-13,-4,24,4,'#c7f3e65c');
   for(let i=0;i<5;i++)line(c,[[-30+i*13,6+(i%2)*4],[-20+i*13,5+(i%2)*4]],'#d7f5e38f',.8);
   object(c,'reeds',-34,6,.47,seed);
   object(c,'lily',9,11,.51,seed+1);
   if(seed%3!==0)object(c,'stone',30,-2,.45,seed+2);
  }
  return true;
 }
 function pondOverlay(c,x,y,z,seed){
  c.save();c.translate(x,y);c.scale(z,z);
  if(seed%3!==1)object(c,'lily',-11+hash(seed,5)*23,5,.40,seed);
  if(seed%4===0)object(c,'reeds',28,-1,.35,seed);
  c.restore();
 }
 function pathOverlay(c,x,y,z,seed,arms){
  c.save();c.translate(x,y);c.scale(z,z);
  // Tiny plants and stones are decorative only: road geometry remains controlled by the game.
  // Keep objects inside the diamond and away from the center of a junction.
  const placements=[[-33,1],[30,-2],[-1,17],[1,-17]];
  for(let i=0;i<placements.length;i++){
   if(hash(seed,i+9)>.64)continue;
   const d=placements[i],j=(seed+i)%3;
   object(c,j===0?'stone':j===1?'tuft':'flower',d[0],d[1],j===0?.19:.28,seed+i);
  }
  c.restore();
 }
 window.WUBBY_GRAPHICS_LAB={
  version:'1.0',
  paintTile:paintTile,
  pondOverlay:pondOverlay,
  pathOverlay:pathOverlay,
  object:object
 };
})();