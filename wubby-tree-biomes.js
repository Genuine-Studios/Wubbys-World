/* Wubby's World: eight tree species, three painted variants each.
   This module provides only art, species metadata and progressive offer weights.
   It does not award, replace or recalculate forest points. */
(function(global){
  'use strict';
  const atlas=new Image();
  atlas.src='assets/wubby-trees-8x3.webp';
  const CELL=140;
  const SPECIES=[
    {type:'forest',id:'cypress',row:2,unlock:0,en:'Cypress forest',nl:'Cipressenbos',emoji:'🌲'},
    {type:'orchard',id:'citrus',row:3,unlock:0,en:'Citrus grove',nl:'Citrusbos',emoji:'🍊'},
    {type:'forest_summer',id:'summer',row:0,unlock:12,en:'Summer forest',nl:'Zomerbos',emoji:'🌳'},
    {type:'forest_blossom',id:'blossom',row:1,unlock:26,en:'Blossom forest',nl:'Bloesembos',emoji:'🌸'},
    {type:'birch',id:'birch',row:7,unlock:40,en:'Birch forest',nl:'Berkenbos',emoji:'🌿'},
    {type:'forest_willow',id:'willow',row:4,unlock:56,en:'Willow forest',nl:'Wilgenbos',emoji:'🌿'},
    {type:'forest_autumn',id:'autumn',row:5,unlock:76,en:'Autumn forest',nl:'Herfstbos',emoji:'🍁'},
    {type:'forest_enchanted',id:'enchanted',row:6,unlock:100,en:'Enchanted forest',nl:'Betoverd bos',emoji:'✨'}
  ];
  const byType=Object.fromEntries(SPECIES.map(t=>[t.type,t]));
  const rnd=v=>{const n=Math.sin(v*12.9898+78.233)*43758.5453;return n-Math.floor(n);};
  function available(placed){return SPECIES.filter(t=>placed>=t.unlock);}
  function weight(type,placed){
    const t=byType[type];if(!t||placed<t.unlock)return 0;
    // Fixed overall forest share; within it a wave of new species gradually
    // replaces older ones. Each earlier species remains a rare possibility.
    const options=available(placed);
    const wave=t=>Math.max(.08,Math.exp(-Math.max(0,placed-t.unlock)/32));
    const sum=options.reduce((a,s)=>a+wave(s),0);
    return 16*wave(t)/sum;
  }
  function draw(ctx,type,x,y,z=1,seed=1){
    const sp=byType[type];
    if(!sp||!atlas.complete||!atlas.naturalWidth)return false;
    // Three trees on most tiles, two on a sparse minority. Same species per tile.
    // Variant and planting positions are stable for existing saved worlds.
    const density=rnd(seed*13)>.24?3:2;
    const slots=[[-23,2,43],[3,-6,51],[27,8,39]];
    ctx.save();
    for(let i=0;i<density;i++){
      const [dx,dy,baseH]=slots[i];
      const variant=Math.floor(rnd(seed*11+i*53+sp.row*19)*3);
      const h=(baseH+(rnd(seed*17+i*71)-.5)*7)*z;
      const w=h;
      const px=x+(dx+(rnd(seed*7+i*43)-.5)*5)*z;
      const py=y+(dy+(rnd(seed*29+i*37)-.5)*3)*z;
      ctx.drawImage(atlas,variant*CELL,sp.row*CELL,CELL,CELL,px-w/2,py-h,w,h);
    }
    ctx.restore();
    return true;
  }
  function sameSpecies(typeA,typeB){return !!byType[typeA]&&!!byType[typeB]&&byType[typeA].id===byType[typeB].id;}
  global.WUBBY_TREE_BIOMES={atlas,species:SPECIES,byType,available,weight,draw,sameSpecies,version:'8-species-3-variants-preview'};
})(window);
