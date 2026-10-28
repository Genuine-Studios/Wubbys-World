/* Forest art study v2.
   Individual reusable transparent canvas objects. The game controls its
   standard 112x57 diamond: no soil, platform, tile edge or sprite-sheet here.
   Stable recipe/seed positions give different forest silhouettes by location. */
(function(){
'use strict';
const PI=Math.PI,TAU=2*PI,models=new Map();
const hash=(a,b=0)=>{let q=Math.sin(a*129.38+b*78.17)*43758.5453;return q-Math.floor(q);};
const lerp=(a,b,v)=>a+(b-a)*v;
function ellipse(c,x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=col;c.fill();}
function poly(c,pts,fill,stroke=null,w=1){
 c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);
 c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=w;c.strokeStyle=stroke;c.stroke();}
}
function line(c,pts,col,w=1){
 c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);
 c.lineWidth=w;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';c.stroke();
}
function grad(c,x,y,r,bright,dark){
 const g=c.createRadialGradient(x-r*.25,y-r*.35,r*.12,x,y,r);
 g.addColorStop(0,bright);g.addColorStop(.66,dark);g.addColorStop(1,dark);
 return g;
}
function trunk(c,x,y,top,width){
 poly(c,[[x-width/2,y],[x-width/2-1,top],[x+width*.45,top-1],[x+width/2,y]],'#876347','#634a37',.8);
 poly(c,[[x-width/2,y],[x-width/2-1,top],[x-width*.08,top],[x+width*.1,y]],'#bf9869');
 line(c,[[x+1,y-12],[x+2,y-27]],'#67503d',1.1);
}
function fir(c,v){
 const tonal=[
 ['#2d6d5c','#5aaf85','#153e40','#a7d4a4'],
 ['#34635f','#699b99','#204c50','#c0d6bc'],
 ['#35684e','#81b776','#254b41','#c6d29a'],
 ['#3b7256','#80a474','#254b4a','#d8d4a0'],
 ['#2a6962','#539890','#184c50','#9ccdc0'],
 ['#386950','#65a07c','#204936','#bad3a2']
 ][v%6];
 const h=99+(v%3)*9,rootY=131,base=42,stemX=61+(v%2)*3;
 ellipse(c,stemX,rootY-2,38,10,'#2c564a41');trunk(c,stemX,rootY-1,rootY-h+45,12);
 for(let layer=5;layer>=0;layer--){
  let cy=rootY-h+19+layer*14,w=11+layer*5.3;
  if(v%3===1)w*=.82;if(v%3===2)w*=1.13;
  const rag=hash(v,layer+81);
  poly(c,[[stemX,cy-14],[stemX-w*.55,cy+3],[stemX-w,cy+17],[stemX-3,cy+11],[stemX+w,cy+17],[stemX+w*.55,cy+3]],
    tonal[2],tonal[2],.7);
  poly(c,[[stemX,cy-14],[stemX-w*.55,cy+3],[stemX-w,cy+17],[stemX-3,cy+11]],
    tonal[0]);
  poly(c,[[stemX,cy-14],[stemX-w*.38,cy+1],[stemX-4,cy+6],[stemX+w*.15,cy+6]],
    grad(c,stemX-6,cy-6,w*.8,tonal[1],tonal[0]));
  poly(c,[[stemX+1,cy+3],[stemX+w*.78,cy+14],[stemX+w,cy+17],[stemX-3,cy+11]],tonal[2]);
  // Tiered needle strokes and little sun-catching tips.
  for(let j=0;j<13;j++){
   let a=(j/12-.5)*w*1.7,x=stemX+a,y=cy+6+Math.abs(a/w)*7+(j%2)*2;
   if(Math.abs(a)>w*.95)continue;
   line(c,[[x-2,y+1],[x+1+rag*3,y-3]],j%3===0?tonal[3]:tonal[1],.75);
  }
 }
 poly(c,[[stemX-2,rootY-h+14],[stemX,rootY-h-7],[stemX+2,rootY-h+15]],tonal[1]);
}
function pine(c,v){
 const h=102+(v%3)*7,root=130,x=62;ellipse(c,x,root-3,37,9,'#38695643');
 trunk(c,x,root,root-h+18,13);
 const crown=v%2===0?['#345f4e','#6f9e6d','#2b5446']:['#3c6b5e','#8caf79','#2a594e'];
 // Old, broad uneven pine with exposed branches and irregular foliage masses.
 const branches=[[-32,53,1.0],[30,50,.87],[-30,38,.75],[24,30,.7],[-17,16,.65],[17,10,.55]];
 for(let i=0;i<branches.length;i++){
  let [dx,yy,scale]=branches[i],y=root-h+yy+16;
  line(c,[[x,y+18],[x+dx,y-3],[x+dx+dx*.18,y-5]],'#694f36',4.2*scale);
  ellipse(c,x+dx*.87,y-6,19*scale,12*scale,crown[2]);
  ellipse(c,x+dx*.86-4,y-10,20*scale,11*scale,crown[0]);
  ellipse(c,x+dx*.80-9,y-13,10*scale,4*scale,'#a4c88c73');
  for(let j=0;j<9;j++){
   let px=x+dx*.85+(hash(v+i,j)-.5)*28*scale,py=y-11+(hash(v+i+2,j)-.5)*12*scale;
   line(c,[[px,py],[px+2,py-3]],crown[1],.75);
  }
 }
 ellipse(c,x,root-h+18,16,17,grad(c,x,root-h+14,19,'#95b986',crown[0]));
 ellipse(c,x-3,root-h+5,11,5,'#c4d49b62');
}
function larch(c,v){
 const root=130,x=61,h=100+(v%4)*5;
 ellipse(c,x,root,32,8,'#536d4140');
 trunk(c,x,root,root-h+14,10);
 const col=v%2===0?['#a9b967','#d6cb78','#749258']:['#7caa71','#b9c98b','#5f9167'];
 for(let j=6;j>=0;j--){
  const y=root-h+17+j*12,width=9+j*4.2;
  line(c,[[x-1,y],[x-width*.9,y+12]],'#8d6e47',2.2);
  line(c,[[x+1,y],[x+width*.87,y+12]],'#8d6e47',2.2);
  for(let k=-8;k<=8;k++){
   const a=k/8*width,edge=Math.abs(a)/width;
   if(edge>1)continue;
   const yy=y+11+edge*3;
   line(c,[[x+a,yy],[x+a+(a>0?3:-3),yy-8+hash(v+j,k+20)*5]],col[(k+j+18)%3],1.45);
  }
  ellipse(c,x,y,7,8,col[0]);ellipse(c,x-3,y-3,3,4,col[1]);
 }
}
function fern(c,v){
 ellipse(c,49,45,31,5,'#356a4a33');
 for(let j=0;j<7;j++){
  let a=(j-3)*.38,dx=Math.sin(a)*30,top=13+(j%3)*5;
  line(c,[[50,44],[50+dx,top]],'#538765',1.5);
  for(let k=1;k<=5;k++){
   const f=k/6,px=50+dx*f,py=44+(top-44)*f,dd=(1-f)*8;
   line(c,[[px,py],[px-dd,py-4]],j%2?'#8dba80':'#4e9c6d',1.4);
   line(c,[[px,py],[px+dd,py-5]],j%2?'#76ab79':'#a8c890',1.4);
  }
 }
}
function fallen(c,v){
 ellipse(c,65,50,60,10,'#395c433b');
 // Tapered fallen trunk diagonally; visible rings on broken end.
 poly(c,[[11,40],[91,26],[118,35],[40,56]],'#9c754a','#614a36',1.6);
 poly(c,[[11,40],[91,26],[99,29],[16,44]],'#ceb083');
 poly(c,[[40,56],[118,35],[115,43],[42,61]],'#74583f');
 ellipse(c,115,38,11,8,'#ad8555');ellipse(c,115,38,7,5,'#d9b78b');
 ellipse(c,115,38,4,3,'#9b754b');
 for(let j=0;j<7;j++){
  line(c,[[21+j*11,44-j*1.7],[35+j*11,43-j*1.9]],j%2?'#745a3b':'#e1c08b',1.1);
 }
 for(let j=0;j<6;j++)ellipse(c,30+j*13,38-j*1.4,3,1.6,j%2?'#789b64':'#9bbb73');
}
function stump(c,v){
 ellipse(c,56,68,31,8,'#5264483d');
 poly(c,[[34,51],[39,26],[76,25],[79,53],[73,64],[39,64]],'#8e6b48','#654e3c',1);
 poly(c,[[34,51],[39,26],[48,29],[48,61],[39,64]],'#b18a60');
 ellipse(c,58,27,21,10,'#aa875f');
 ellipse(c,58,26,16,7,'#d6b58c');
 ellipse(c,58,26,10,4,'#b5956b');
 ellipse(c,58,26,4,1.7,'#dec7a2');
 for(let j=0;j<4;j++)ellipse(c,40+j*10,57-(j%3)*2,3,2,'#90a36a');
}
function mushroom(c,v){
 ellipse(c,46,65,36,7,'#43724b35');
 for(let j=0;j<4;j++){
  let x=23+j*14,s=j%2?.7:1,hh=16+j%3*4;
  poly(c,[[x-3*s,62],[x-3*s,62-hh],[x+3*s,62-hh],[x+3*s,62]],'#e8dab3');
  ellipse(c,x,61-hh,10*s,6*s,j%3?'#b16e46':'#d5734c');
  ellipse(c,x-3*s,59-hh,4*s,1.8*s,'#f6bd84');
  ellipse(c,x+3*s,60-hh,1.5*s,1*s,'#ffefce');
 }
}
function mossrock(c,v){
 ellipse(c,57,71,49,10,'#375d4b42');
 poly(c,[[14,66],[20,40],[39,24],[66,30],[91,43],[101,69],[55,72]],'#84968c','#63796b',1.2);
 poly(c,[[20,40],[39,24],[52,41],[42,62],[14,66]],'#c1c8b6');
 poly(c,[[52,41],[66,30],[91,43],[101,69],[42,62]],'#718c83');
 poly(c,[[18,58],[34,41],[48,46],[59,56],[51,62],[32,63]],'#7aa166');
 for(let j=0;j<12;j++){
  let xx=25+hash(v,j)*64,yy=48+hash(v,j+21)*17;
  ellipse(c,xx,yy,2.8,1.5,j%2?'#99b979':'#729a6a');
 }
}
function blueSpruce(c,v){
 // Blue spruce has a sharply triangular outline, not a recolored pine.
 ellipse(c,59,126,33,7,'#3e635147');trunk(c,59,126,37,9);
 const pal=['#568b8c','#77a7a8','#386e78','#b6cbba'];
 for(let j=6;j>=0;j--){
  const y=25+j*13,w=7+j*4.5;
  poly(c,[[59,y-17],[59-w,y+17],[59,y+10],[59+w,y+17]],pal[j%3],pal[2],.7);
  poly(c,[[59,y-17],[59-w,y+17],[59,y+10]],pal[1]);
  for(let k=-4;k<=4;k++)line(c,[[59+k*w/5,y+10],[59+k*w/5-2,y+3]],pal[3],.9);
 }
}
const shapes={fir:[128,138,fir],oldpine:[130,138,pine],larch:[128,138,larch],
 fern:[100,50,fern],fallen:[136,70,fallen],stump:[114,74,stump],
 mushroom:[96,70,mushroom],mossrock:[114,78,mossrock],
 bluespruce:[120,134,blueSpruce]};
function art(kind,variant){
 const def=shapes[kind],v=((variant%6)+6)%6,cacheKey=kind+'/'+v;
 if(!def)return null;
 if(models.has(cacheKey))return models.get(cacheKey);
 const [w,h,draw]=def;
 const img=document.createElement('canvas');img.width=w*3;img.height=h*3;
 const g=img.getContext('2d');g.scale(3,3);draw(g,v);
 const data={img,w,h};models.set(cacheKey,data);return data;
}
function place(c,kind,x,y,scale,seed){
 const a=art(kind,seed);if(!a)return;
 c.drawImage(a.img,x-a.w*scale/2,y-a.h*scale,a.w*scale,a.h*scale);
}
const recipes=[
 // A tall old pine surrounded by ferns.
 [['fern',-24,-3,.42],['mossrock',20,-8,.33],['oldpine',0,11,.74],['mushroom',34,14,.25]],
 // Close group of slender young firs.
 [['fir',-25,-7,.53],['bluespruce',8,-9,.56],['fern',-2,7,.45],['fir',27,11,.53]],
 // Fallen trunk in a clearing with fresh shoots.
 [['fir',-31,-8,.47],['fern',23,-6,.45],['fallen',-3,12,.57],['mushroom',-30,14,.29]],
 // Broad standing ancient fir, with small subordinate saplings.
 [['fern',-31,-2,.42],['fir',-3,8,.90],['bluespruce',32,8,.35],['mossrock',-30,15,.29]],
 // Sunny larch clearing, mostly golden-green needles.
 [['mushroom',-30,-8,.28],['larch',-20,4,.58],['fern',4,-2,.54],['larch',22,11,.66]],
 // Boulder and two windswept evergreens.
 [['oldpine',-31,-7,.52],['mossrock',3,4,.49],['bluespruce',29,11,.61],['fern',-20,13,.3]],
 // Stump, mushrooms and tall fir behind it.
 [['fir',-22,-8,.62],['fern',28,-5,.41],['stump',5,11,.46],['mushroom',-27,13,.32]],
 // Blue spruce grouping with undergrowth and old pine.
 [['bluespruce',-25,-7,.59],['oldpine',19,6,.56],['fern',-3,9,.57],['mushroom',35,13,.22]],
 // A massive high conifer alone, sparse floor vegetation.
 [['fern',-32,-1,.35],['mossrock',30,-2,.28],['fir',3,11,.97],['mushroom',-29,13,.22]],
 // Broken log and crooked pine, young golden larch.
 [['larch',-29,-8,.47],['fern',10,-8,.39],['oldpine',25,6,.55],['fallen',-6,14,.39]],
 // Very dense thicket with staggered canopy heights.
 [['fir',-30,-5,.49],['bluespruce',-1,-13,.69],['larch',26,-7,.49],['fern',-24,13,.4],['fir',18,13,.5]],
 // Fern and rock clearing surrounded by conifers.
 [['oldpine',-27,-8,.5],['fir',28,-9,.54],['mossrock',-4,9,.44],['fern',-28,12,.42],['fern',26,13,.43]]
];
function forest(c,seed,time){
 const recipeIndex=Math.floor(hash(seed,29)*recipes.length),layout=recipes[recipeIndex];
 // Small layered floor details live on top of the game's untouched base.
 for(let j=0;j<12;j++){
  const x=(hash(seed,j*2+41)-.5)*91,y=(hash(seed,j*2+42)-.5)*29;
  if(Math.abs(x)/51+Math.abs(y)/23>.8)continue;
  ellipse(c,x,y,1+hash(seed,j+81)*2,.55,'#578a634a');
  if(j%5===0)ellipse(c,x+2,y+1,1.7,.8,'#e1cd8996');
 }
 for(let i=0;i<layout.length;i++){
  const [name,bx,by,size]=layout[i];
  const jx=(hash(seed,i+121)-.5)*7,jy=(hash(seed,i+201)-.5)*4;
  const scale=size*(.94+hash(seed,i+311)*.11);
  const variant=Math.floor(hash(seed,i+51)*6);
  place(c,name,bx+jx,by+jy,scale,variant);
 }
 // Floor blooms and little sunlight flecks, not repeated in identical places.
 for(let j=0;j<5;j++){
  const x=(hash(seed,j+401)-.5)*85,y=(hash(seed,j+511)-.5)*29;
  if(Math.abs(x)/53+Math.abs(y)/24>.81)continue;
  ellipse(c,x,y,1.4,1.15,j%2?'#f3d9ad':'#e9e8b6');
 }
 return true;
}
function details(seed){
 const recipe=Math.floor(hash(seed,29)*recipes.length);
 return {recipe:recipe+1,objects:recipes[recipe].map(x=>x[0])};
}
const lab=window.WUBBY_GRAPHICS_LAB;
if(!lab)return;
const previous=lab.paintTile;
lab.paintTile=function(c,type,seed,time){
 if(type==='forest')return forest(c,seed,time);
 // Grass, meadows and all other terrains keep their original art in this study.
 return false;
};
lab.forestV2=forest;
lab.forestRecipe=details;
lab.version='forest-study-v2';
})();