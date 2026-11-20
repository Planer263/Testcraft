
// Frontiers: bounded active simulation, unbounded world-coordinate generation.
const IW={enabled:false,ox:0,oz:0,cache:new Map(),edits:{},meta:{},pending:{},animals:{},drops:{},explosives:{},seen:{},spawn:null,bed:null,shifts:0,busy:false,ruins:[]};
const IW_META=['chests','furnaces','crops','blockShapes','blockDirections','waterLevels'];
function iwReset(on){sfWorkerStop();sfCancelJobs();IW.enabled=on;IW.ox=IW.oz=0;IW.cache.clear();IW.edits={};IW.meta=Object.fromEntries(IW_META.map(k=>[k,{}]));IW.pending={};IW.animals={};IW.drops={};IW.explosives={};IW.seen={};IW.spawn=null;IW.bed=null;IW.shifts=0;IW.busy=false;H=on?128:64;SEA=on?40:17;}
function iwGlobal(x,z){return[x+IW.ox,z+IW.oz];}
function iwKey(x,y,z){return(x+IW.ox)+','+y+','+(z+IW.oz);}
function iwInside(x,z,ox=IW.ox,oz=IW.oz){return x>=ox&&z>=oz&&x<ox+W&&z<oz+W;}
function iwHash(x,y,z,s=0){let hx=Math.floor(x/4294967296),hz=Math.floor(z/4294967296),n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(z|0,1442695041)^Math.imul(hx,1597334677)^Math.imul(hz,3812015801)^Math.imul(s,1274126177)^seed;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
function iwNoise(x,z,s,salt){x/=s;z/=s;let a=Math.floor(x),b=Math.floor(z),u=x-a,v=z-b;u=u*u*(3-2*u);v=v*v*(3-2*v);let n=(x,z)=>iwHash(x,0,z,salt);return(n(a,b)*(1-u)+n(a+1,b)*u)*(1-v)+(n(a,b+1)*(1-u)+n(a+1,b+1)*u)*v;}
function iwFbm(x,z,s,salt){return iwNoise(x,z,s,salt)*.57+iwNoise(x,z,s/2,salt+1)*.28+iwNoise(x,z,s/4,salt+2)*.15;}
function iwLegacyClimate(x,z){
 let c=iwFbm(x,z,1500,410),e=iwFbm(x,z,700,420),t=iwFbm(x,z,1100,430),m=iwFbm(x,z,860,440),ridge=1-Math.abs(iwNoise(x,z,230,450)*2-1);
 let land=(c-.45)*112,peaks=Math.max(0,(c-.52)*4)*Math.max(0,(.60-e)*3),detail=(iwFbm(x,z,96,460)-.5)*(7+e*9);
 let height=SEA+land+peaks*(24+ridge*62)+detail;
 let rd=Math.abs(iwNoise(x,z,370,470)*2-1),river=rd<.022&&height>SEA-3&&height<SEA+30;
 if(height>SEA-3&&height<SEA+30){let blend=Math.max(0,1-rd/.065);height=height*(1-blend)+(SEA-3)*blend;}
 let hh=Math.max(8,Math.min(H-12,Math.floor(height))),b=hh<SEA-2?(river?1:0):river?1:hh<=SEA+1?2:hh>85?8:t<.30?6:t>.64&&m<.42?7:t>.63&&m<.56?9:t>.61&&m>.64?10:m>.70&&hh<SEA+9?11:m>.56?4:m>.46?5:3;
 return{h:hh,biome:b,temp:t,moist:m};
}
function iwFirstClimate(x,z){
 if(!biomeGeneration)return iwLegacyClimate(x,z);
 let scale=H>64?1:0.23,xx=x/scale,zz=z/scale;
 let wx=xx+(iwNoise(xx,zz,280,804)-.5)*110,wz=zz+(iwNoise(xx,zz,280,805)-.5)*110;
 let c=iwFbm(wx,wz,780,810),e=iwFbm(wx,wz,330,820);
 let t=Math.max(0,Math.min(1,(iwFbm(wx,wz,420,830)-.5)*1.9+.5)),m=Math.max(0,Math.min(1,(iwFbm(wx,wz,360,840)-.5)*1.9+.5));
 let ridge=1-Math.abs(iwNoise(wx,wz,125,850)*2-1),detail=iwFbm(wx,wz,68,860)-.5;
 let peak=Math.max(0,(c-.57)*4)*Math.max(0,(.59-e)*3);
 let base=SEA+((c-.43)*100+peak*(22+ridge*48)+detail*9)*scale;
 let rd=Math.abs(iwNoise(wx,wz,205,870)*2-1),blend=Math.max(0,1-rd/.075),river=rd<.025&&base>SEA-3*scale&&peak<.4;
 if(base>SEA-3*scale&&peak<.4)base=base*(1-blend)+(SEA-3*scale)*blend;
 let landBiome=t<.25?12:t<.40?6:t>.62&&m<.39?7:t>.60&&m<.57?9:t>.60&&m>=.57?10:m>.72&&base<SEA+10*scale?11:m>.59?4:m>.48?5:3;
 // Continuous relief weights avoid cliffs at vegetation boundaries.
 let dry=Math.max(0,(t-.55)*3)*Math.max(0,(.48-m)*4);
 base+=dry*Math.sin(wx/24+iwNoise(wx,wz,90,880)*3)*2*scale;
 let hh=Math.max(5,Math.min(H-14,Math.floor(base))),b=hh<SEA-1?(river?1:0):river?1:hh<=SEA+1?2:peak>.20&&hh>SEA+16*scale?8:landBiome;
 return{h:hh,biome:b,temp:t,moist:m};
}
function iwCanopyClimate(x,z){
 if(biomeGeneration<2)return iwFirstClimate(x,z);
 let scale=H>64?1:0.23,xx=x/scale,zz=z/scale;
 let wx=xx+(iwNoise(xx,zz,280,804)-.5)*110,wz=zz+(iwNoise(xx,zz,280,805)-.5)*110;
 let c=iwFbm(wx,wz,780,810),e=iwFbm(wx,wz,330,820);
 let t=Math.max(0,Math.min(1,(iwFbm(wx,wz,420,830)-.5)*1.9+.5)),m=Math.max(0,Math.min(1,(iwFbm(wx,wz,360,840)-.5)*1.9+.5));
 let ridge=1-Math.abs(iwNoise(wx,wz,125,850)*2-1),detail=iwFbm(wx,wz,68,860)-.5;
 let peak=Math.max(0,(c-.57)*4)*Math.max(0,(.59-e)*3);
 let base=SEA+((c-.43)*100+peak*(22+ridge*48)+detail*9)*scale;
 let rd=Math.abs(iwNoise(wx,wz,205,870)*2-1),blend=Math.max(0,1-rd/.075),river=rd<.025&&base>SEA-3*scale&&peak<.4;
 if(base>SEA-3*scale&&peak<.4)base=base*(1-blend)+(SEA-3*scale)*blend;
 let landBiome=t<.25?12:t<.40?6:t>.62&&m<.39?7:t>.60&&m<.57?9:t>.60&&m>=.57?10:m>.72&&base<SEA+10*scale?11:m>.66?13:m>.55?4:m>.45?5:3;
 // Continuous relief weights avoid cliffs at vegetation boundaries.
 let dry=Math.max(0,(t-.55)*3)*Math.max(0,(.48-m)*4);
 base+=dry*Math.sin(wx/24+iwNoise(wx,wz,90,880)*3)*2*scale;
 let hh=Math.max(5,Math.min(H-14,Math.floor(base))),b=hh<SEA-1?(river?1:0):river?1:hh<=SEA+1?2:peak>.20&&hh>SEA+16*scale?8:landBiome;
 return{h:hh,biome:b,temp:t,moist:m};
}
function iwClimate(x,z){
 if(biomeGeneration<3)return iwCanopyClimate(x,z);
 if(wbForcedBiome===WB_BID.the_void)return{h:Math.abs(x-64)<=2&&Math.abs(z-64)<=2?20:0,biome:WB_BID.the_void,temp:.5,moist:.5};
 let q=iwCanopyClimate(x,z),scale=H>64?1:.23,xx=x/scale,zz=z/scale,t=q.temp,m=q.moist,B=WB_BID,v=iwHash(Math.floor(xx/160),0,Math.floor(zz/160),931),p=iwNoise(xx,zz,145,932),pick=a=>B[a[Math.min(a.length-1,Math.floor(v*a.length))]],b=q.biome;
 if(wbForcedBiome>=0){let f=WB_BIOMES[wbForcedBiome];if(f?.realm==='overworld')b=f.underground?B.forest:f.id;}
 else if(b===0){let deep=q.h<SEA-10*scale;b=t<.25?(deep?B.deep_frozen_ocean:B.frozen_ocean):t<.40?(deep?B.deep_cold_ocean:B.cold_ocean):t>.73?B.warm_ocean:t>.59?(deep?B.deep_lukewarm_ocean:B.lukewarm_ocean):deep?B.deep_ocean:B.ocean;if(p>.87){q.h=SEA+2+Math.floor((p-.87)*45*scale);b=B.mushroom_fields;}}
 else if(b===1)b=t<.29?B.frozen_river:B.river;
 else if(b===2)b=t<.29?B.snowy_beach:p>.64?B.stony_shore:B.beach;
 else if(b===8)b=t<.32?pick(['frozen_peaks','jagged_peaks']):t<.55?pick(['jagged_peaks','stony_peaks']):B.stony_peaks;
 else if(q.h>SEA+15*scale&&p>.47)b=t<.27?pick(['snowy_slopes','grove']):t<.47?pick(['meadow','cherry_grove','windswept_hills','windswept_gravelly_hills','windswept_forest']):t>.65&&m<.55?pick(['savanna_plateau','windswept_savanna']):pick(['meadow','cherry_grove','windswept_forest']);
 else if(b===12)b=pick(['snowy_plains','snowy_plains','ice_spikes','snowy_taiga']);
 else if(b===6)b=pick(['taiga','taiga','old_growth_pine_taiga','old_growth_spruce_taiga','dappled_forest']);
 else if(b===7)b=pick(['desert','desert','badlands','eroded_badlands','wooded_badlands']);
 else if(b===9)b=pick(['savanna','savanna','savanna_plateau','windswept_savanna']);
 else if(b===10)b=pick(['jungle','jungle','sparse_jungle','bamboo_jungle']);
 else if(b===11)b=t>.54?B.mangrove_swamp:B.swamp;
 else if(b===13)b=pick(['dark_forest','dark_forest','pale_garden']);
 else if(b===5)b=pick(['birch_forest','old_growth_birch_forest','flower_forest']);
 else if(b===4)b=pick(['forest','forest','flower_forest','dappled_forest']);
 else if(b===3)b=pick(['plains','plains','sunflower_plains','meadow']);
 if(wbForcedBiome>=0){let k=WB_BIOMES[wbForcedBiome].key;if(k.includes('ocean'))q.h=Math.max(5,SEA-4-Math.floor(iwNoise(x,z,30,960)*5)-(k.startsWith('deep_')?Math.round(10*scale):0));else if(k==='river'||k==='frozen_river')q.h=SEA-2;else if(k.includes('beach')||k==='stony_shore')q.h=SEA+1;else if(!WB_BIOMES[wbForcedBiome].underground)q.h=Math.max(SEA+3,q.h);}
 q.biome=b;return q;
}
function iwCaveNode(x,y,z,s){return iwHash(x,y,z,s);}
function iwLegacyChunk(cx,cz){
 let key=cx+','+cz,cached=IW.cache.get(key);if(cached){IW.cache.delete(key);IW.cache.set(key,cached);return cached;}
 const B=new Uint16Array(16*H*16),surf=new Int16Array(256),bio=new Uint8Array(256),id=(k,f=3)=>I[k]?.block||f,deep=id('deepslate'),lava=I.lavaBucket?.fluidBlock||0;
 const at=(x,y,z)=>(y*16+z)*16+x,put=(x,y,z,b)=>{if(x>=0&&z>=0&&x<16&&z<16&&y>0&&y<H)B[at(x,y,z)]=b;},gx0=cx*16,gz0=cz*16;
 // Coarse density lattice shared across chunk boundaries, interpolated per voxel.
 let ny=Math.ceil(H/8)+1,n1=new Float32Array(3*ny*3),n2=new Float32Array(n1.length),ni=(x,y,z)=>(y*3+z)*3+x;
 for(let y=0;y<ny;y++)for(let z=0;z<3;z++)for(let x=0;x<3;x++){n1[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,510);n2[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,511);}
 let ores=[];
 for(let y=0;y<H/4;y++)for(let z=0;z<4;z++)for(let x=0;x<4;x++){
  let wx=cx*4+x,wz=cz*4+z,yy=y*4,r=iwHash(wx,y,wz,520),k=null;
  if(yy<24&&r<.038)k='diamond';else if(yy<30&&r<.105)k='redstone';else if(yy>8&&yy<42&&r>.94)k='lapis';else if(yy<38&&r>.90&&r<.94)k='gold';else if(yy>12&&yy<88&&r>.68&&r<.83)k='iron';else if(yy>30&&yy<76&&r>.46&&r<.59)k='copper';else if(yy>40&&r>.20&&r<.36)k='coal';
  let normal={coal:9,iron:10,gold:22,diamond:21,copper:id('copperOre'),lapis:id('lapisOre'),redstone:id('redstoneOre')};
  ores[(y*4+z)*4+x]={b:k?(yy<30?id('java_deepslate_'+k+'_ore',normal[k]):normal[k]):0,x:1+iwHash(wx,y,wz,521)*2,y:1+iwHash(wx,y,wz,522)*2,z:1+iwHash(wx,y,wz,523)*2};
 }
 const interp=(arr,x,y,z)=>{let ix=x>>3,iy=y>>3,iz=z>>3,u=(x&7)/8,v=(y&7)/8,w=(z&7)/8;u=u*u*(3-2*u);v=v*v*(3-2*v);w=w*w*(3-2*w);let a=ni(ix,iy,iz),q=3,r=9;return((arr[a]*(1-u)+arr[a+1]*u)*(1-w)+(arr[a+q]*(1-u)+arr[a+q+1]*u)*w)*(1-v)+((arr[a+r]*(1-u)+arr[a+r+1]*u)*(1-w)+(arr[a+r+q]*(1-u)+arr[a+r+q+1]*u)*w)*v;};
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  let gx=gx0+x,gz=gz0+z,cl=iwLegacyClimate(gx,gz),hh=cl.h,biome=cl.biome;surf[z*16+x]=hh;bio[z*16+x]=biome;
  let sand=[0,1,2,7].includes(biome),snow=biome===6||biome===8;
  for(let y=0;y<=Math.max(hh,SEA);y++){
   let b=y===0||y<4&&iwHash(gx,y,gz,530)<(4-y)*.22?15:y>hh?14:y===hh?(sand?7:snow?42:1):y>hh-4?(sand?7:2):y<30?deep:3;
   if((b===3||b===deep)&&y>4&&y<hh-2){let a=interp(n1,x,y,z),d=interp(n2,x,y,z);if(a>.73||Math.abs(a-.5)<.07&&Math.abs(d-.5)<.18)b=y<7?lava:0;}
   if(b===3||b===deep){let o=ores[(((y>>2)*4+(z>>2))*4+(x>>2))];if(o?.b&&((x&3)-o.x)**2+((y&3)-o.y)**2+((z&3)-o.z)**2<3.1)b=o.b;}
   B[at(x,y,z)]=b;
  }
  if(hh>SEA+1&&biome!==7){let r=iwHash(gx,0,gz,540);if(r<.001)put(x,hh+1,z,id('pumpkin'));else if(r<.028&&!snow)put(x,hh+1,z,r<.014?18:19);else if(r<.18&&!snow)put(x,hh+1,z,17);}
  if(biome===7&&hh>SEA+1&&iwHash(gx,0,gz,541)<.007)for(let y=1;y<=2+Math.floor(iwHash(gx,0,gz,542)*2);y++)put(x,hh+y,z,id('cactus'));
  if(hh===SEA+1&&iwHash(gx,0,gz,543)<.12&&[iwLegacyClimate(gx-1,gz),iwLegacyClimate(gx+1,gz),iwLegacyClimate(gx,gz-1),iwLegacyClimate(gx,gz+1)].some(q=>q.h<SEA))for(let y=1;y<=3;y++)put(x,hh+y,z,I.sugarCane?.plantBlock||17);
 }
 // Spatial feature cells are evaluated with a halo: load order cannot cut trees/geodes at seams.
 for(let fz=Math.floor((gz0-5)/64);fz<=Math.floor((gz0+21)/64);fz++)for(let fx=Math.floor((gx0-5)/64);fx<=Math.floor((gx0+21)/64);fx++){
  let gx=fx*64+12+Math.floor(iwHash(fx,0,fz,550)*40),gz=fz*64+12+Math.floor(iwHash(fx,0,fz,551)*40),gy=13+Math.floor(iwHash(fx,0,fz,552)*15),h0=iwLegacyClimate(gx,gz).h;
  if(h0>gy+9&&iwHash(fx,0,fz,553)<.55)for(let dz=-4;dz<=4;dz++)for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){let d=dx*dx+dy*dy+dz*dz;if(d<=16)put(gx+dx-gx0,gy+dy,gz+dz-gz0,d>10?id('java_calcite'):d>3?id('java_amethyst_block'):0);}
  let tx=fx*64+Math.floor(iwHash(fx,0,fz,554)*64),tz=fz*64+Math.floor(iwHash(fx,0,fz,555)*64),ty=12+Math.floor(iwHash(fx,0,fz,556)*32);
  for(let z=Math.max(0,tz-gz0-5);z<Math.min(16,tz-gz0+6);z++)for(let x=Math.max(0,tx-gx0-5);x<Math.min(16,tx-gx0+6);x++)for(let y=Math.max(4,ty-5);y<=Math.min(H-4,ty+5);y++){let i=at(x,y,z),d=(gx0+x-tx)**2+(gz0+z-tz)**2+(y-ty)**2;if(d<=25&&(B[i]===3||B[i]===deep))B[i]=id('java_tuff');}
  if(h0>62&&iwHash(fx,0,fz,557)<.6)for(let q=0;q<3;q++){let x=gx-gx0+q,y=Math.min(h0-8,18+Math.floor(iwHash(fx,q,fz,558)*32)),z=gz-gz0;if(x>=0&&x<16&&z>=0&&z<16){let i=at(x,y,z);if(B[i]===3||B[i]===deep)B[i]=id(y<30?'java_deepslate_emerald_ore':'java_emerald_ore');}}
 }
 for(let tz=Math.floor((gz0-3)/7);tz<=Math.floor((gz0+18)/7);tz++)for(let tx=Math.floor((gx0-3)/7);tx<=Math.floor((gx0+18)/7);tx++){
  let gx=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),gz=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),cl=iwLegacyClimate(gx,gz),b=cl.biome,chance=({4:.82,5:.68,6:.6,9:.22,10:.95,11:.55})[b]||.025;
  if(cl.h<=SEA+1||b===7||b===8||iwHash(tx,0,tz,572)>chance)continue;
  if(Math.abs(iwLegacyClimate(gx+2,gz).h-cl.h)>2||Math.abs(iwLegacyClimate(gx,gz+2).h-cl.h)>2)continue;
  let ht=(b===10?7:4)+Math.floor(iwHash(tx,0,tz,573)*3),log=({5:34,6:36,9:id('acaciaLog'),10:id('jungleLog'),11:id('mangroveLog')})[b]||4,leaf=({5:45,6:46,9:id('java_acacia_leaves',5),10:id('java_jungle_leaves',5),11:id('java_mangrove_leaves',5)})[b]||5;
  for(let dy=ht-2;dy<=ht+1;dy++){let r=b===6?Math.max(0,Math.floor((ht+2-dy)*.7)):dy===ht+1?1:2;for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(!(Math.abs(dx)===r&&Math.abs(dz)===r&&iwHash(gx+dx,dy,gz+dz,574)<.4)){let x=gx+dx-gx0,z=gz+dz-gz0,y=cl.h+dy;if(x>=0&&x<16&&z>=0&&z<16&&(B[at(x,y,z)]===0||D[B[at(x,y,z)]]?.plant))put(x,y,z,leaf);}}
  for(let dy=1;dy<=ht;dy++)put(gx-gx0,cl.h+dy,gz-gz0,log);
 }
 let ruins=[];
 for(let rz=Math.floor((gz0-3)/128);rz<=Math.floor((gz0+18)/128);rz++)for(let rx=Math.floor((gx0-3)/128);rx<=Math.floor((gx0+18)/128);rx++){
  let gx=rx*128+24+Math.floor(iwHash(rx,0,rz,580)*80),gz=rz*128+24+Math.floor(iwHash(rx,0,rz,581)*80),cl=iwLegacyClimate(gx,gz);if(cl.h<=SEA+2||iwHash(rx,0,rz,582)>.38)continue;
  let safe=true;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(Math.abs(iwLegacyClimate(gx+dx,gz+dz).h-cl.h)>1)safe=false;if(!safe)continue;
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){put(gx+dx-gx0,cl.h,gz+dz-gz0,iwHash(gx+dx,0,gz+dz,583)<.4?39:38);if(Math.abs(dx)===2&&Math.abs(dz)===2)for(let dy=1;dy<=2;dy++)put(gx+dx-gx0,cl.h+dy,gz+dz-gz0,44);}
  put(gx-gx0,cl.h+1,gz-gz0,31);if(gx>=gx0&&gx<gx0+16&&gz>=gz0&&gz<gz0+16)ruins.push({x:gx,y:cl.h+1,z:gz});
 }
 let result={blocks:B,surf,bio,ruins};IW.cache.set(key,result);while(IW.cache.size>448)IW.cache.delete(IW.cache.keys().next().value);return result;
}
function iwFirstChunk(cx,cz){
 if(!biomeGeneration)return iwLegacyChunk(cx,cz);
 let key=cx+','+cz,cached=IW.cache.get(key);if(cached){IW.cache.delete(key);IW.cache.set(key,cached);return cached;}
 const B=new Uint16Array(16*H*16),surf=new Int16Array(256),bio=new Uint8Array(256),id=(k,f=3)=>I[k]?.block||f,deep=id('deepslate'),lava=I.lavaBucket?.fluidBlock||0;
 const at=(x,y,z)=>(y*16+z)*16+x,put=(x,y,z,b)=>{if(x>=0&&z>=0&&x<16&&z<16&&y>0&&y<H)B[at(x,y,z)]=b;},gx0=cx*16,gz0=cz*16;
 // Coarse density lattice shared across chunk boundaries, interpolated per voxel.
 let ny=Math.ceil(H/8)+1,n1=new Float32Array(3*ny*3),n2=new Float32Array(n1.length),ni=(x,y,z)=>(y*3+z)*3+x;
 for(let y=0;y<ny;y++)for(let z=0;z<3;z++)for(let x=0;x<3;x++){n1[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,510);n2[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,511);}
 let ores=[];
 for(let y=0;y<H/4;y++)for(let z=0;z<4;z++)for(let x=0;x<4;x++){
  let wx=cx*4+x,wz=cz*4+z,yy=y*4,r=iwHash(wx,y,wz,520),k=null;
  if(yy<24&&r<.038)k='diamond';else if(yy<30&&r<.105)k='redstone';else if(yy>8&&yy<42&&r>.94)k='lapis';else if(yy<38&&r>.90&&r<.94)k='gold';else if(yy>12&&yy<88&&r>.68&&r<.83)k='iron';else if(yy>30&&yy<76&&r>.46&&r<.59)k='copper';else if(yy>40&&r>.20&&r<.36)k='coal';
  let normal={coal:9,iron:10,gold:22,diamond:21,copper:id('copperOre'),lapis:id('lapisOre'),redstone:id('redstoneOre')};
  ores[(y*4+z)*4+x]={b:k?(yy<30?id('java_deepslate_'+k+'_ore',normal[k]):normal[k]):0,x:1+iwHash(wx,y,wz,521)*2,y:1+iwHash(wx,y,wz,522)*2,z:1+iwHash(wx,y,wz,523)*2};
 }
 const interp=(arr,x,y,z)=>{let ix=x>>3,iy=y>>3,iz=z>>3,u=(x&7)/8,v=(y&7)/8,w=(z&7)/8;u=u*u*(3-2*u);v=v*v*(3-2*v);w=w*w*(3-2*w);let a=ni(ix,iy,iz),q=3,r=9;return((arr[a]*(1-u)+arr[a+1]*u)*(1-w)+(arr[a+q]*(1-u)+arr[a+q+1]*u)*w)*(1-v)+((arr[a+r]*(1-u)+arr[a+r+1]*u)*(1-w)+(arr[a+r+q]*(1-u)+arr[a+r+q+1]*u)*w)*v;};
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  let gx=gx0+x,gz=gz0+z,cl=iwFirstClimate(gx,gz),hh=cl.h,biome=cl.biome;surf[z*16+x]=hh;bio[z*16+x]=biome;
  let sand=[0,1,2,7].includes(biome),snow=biome===12;
  for(let y=0;y<=Math.max(hh,SEA);y++){
   let b=y===0||y<4&&iwHash(gx,y,gz,530)<(4-y)*.22?15:y>hh?14:y===hh?(biome===8?3:sand?7:snow?42:1):y>hh-4?(biome===8?3:sand?(biome===7&&y<hh-1?43:7):2):y<30?deep:3;
   if((b===3||b===deep)&&y>4&&y<hh-2){let a=interp(n1,x,y,z),d=interp(n2,x,y,z);if(a>.73||Math.abs(a-.5)<.07&&Math.abs(d-.5)<.18)b=y<7?lava:0;}
   if(b===3||b===deep){let o=ores[(((y>>2)*4+(z>>2))*4+(x>>2))];if(o?.b&&((x&3)-o.x)**2+((y&3)-o.y)**2+((z&3)-o.z)**2<3.1)b=o.b;}
   B[at(x,y,z)]=b;
  }
  if(hh>SEA+1&&![7,8,12].includes(biome)){let r=iwHash(gx,0,gz,540);if(r<.001)put(x,hh+1,z,id('pumpkin'));else if(r<.028&&!snow)put(x,hh+1,z,r<.014?18:19);else if(r<.18&&!snow)put(x,hh+1,z,17);}
  if(biome===7&&hh>SEA+1&&iwHash(gx,0,gz,541)<.007)for(let y=1;y<=2+Math.floor(iwHash(gx,0,gz,542)*2);y++)put(x,hh+y,z,id('cactus'));
  if(hh===SEA+1&&iwHash(gx,0,gz,543)<.12&&[iwFirstClimate(gx-1,gz),iwFirstClimate(gx+1,gz),iwFirstClimate(gx,gz-1),iwFirstClimate(gx,gz+1)].some(q=>q.h<SEA))for(let y=1;y<=3;y++)put(x,hh+y,z,I.sugarCane?.plantBlock||17);
 }
 // Spatial feature cells are evaluated with a halo: load order cannot cut trees/geodes at seams.
 for(let fz=Math.floor((gz0-5)/64);fz<=Math.floor((gz0+21)/64);fz++)for(let fx=Math.floor((gx0-5)/64);fx<=Math.floor((gx0+21)/64);fx++){
  let gx=fx*64+12+Math.floor(iwHash(fx,0,fz,550)*40),gz=fz*64+12+Math.floor(iwHash(fx,0,fz,551)*40),gy=13+Math.floor(iwHash(fx,0,fz,552)*15),h0=iwFirstClimate(gx,gz).h;
  if(h0>gy+9&&iwHash(fx,0,fz,553)<.55)for(let dz=-4;dz<=4;dz++)for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){let d=dx*dx+dy*dy+dz*dz;if(d<=16)put(gx+dx-gx0,gy+dy,gz+dz-gz0,d>10?id('java_calcite'):d>3?id('java_amethyst_block'):0);}
  let tx=fx*64+Math.floor(iwHash(fx,0,fz,554)*64),tz=fz*64+Math.floor(iwHash(fx,0,fz,555)*64),ty=12+Math.floor(iwHash(fx,0,fz,556)*32);
  for(let z=Math.max(0,tz-gz0-5);z<Math.min(16,tz-gz0+6);z++)for(let x=Math.max(0,tx-gx0-5);x<Math.min(16,tx-gx0+6);x++)for(let y=Math.max(4,ty-5);y<=Math.min(H-4,ty+5);y++){let i=at(x,y,z),d=(gx0+x-tx)**2+(gz0+z-tz)**2+(y-ty)**2;if(d<=25&&(B[i]===3||B[i]===deep))B[i]=id('java_tuff');}
  if(h0>62&&iwHash(fx,0,fz,557)<.6)for(let q=0;q<3;q++){let x=gx-gx0+q,y=Math.min(h0-8,18+Math.floor(iwHash(fx,q,fz,558)*32)),z=gz-gz0;if(x>=0&&x<16&&z>=0&&z<16){let i=at(x,y,z);if(B[i]===3||B[i]===deep)B[i]=id(y<30?'java_deepslate_emerald_ore':'java_emerald_ore');}}
 }
 for(let tz=Math.floor((gz0-5)/7);tz<=Math.floor((gz0+20)/7);tz++)for(let tx=Math.floor((gx0-5)/7);tx<=Math.floor((gx0+20)/7);tx++){
  let gx=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),gz=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),cl=iwFirstClimate(gx,gz),b=cl.biome,chance=({3:.012,4:.82,5:.65,6:.78,9:.18,10:.97,11:.55,12:.015})[b]||0;
  if(cl.h<=SEA+1||b===7||b===8||iwHash(tx,0,tz,572)>chance)continue;
  if(Math.abs(iwFirstClimate(gx+2,gz).h-cl.h)>2||Math.abs(iwFirstClimate(gx,gz+2).h-cl.h)>2)continue;
  let ht=(b===10?10:b===6?7:4)+Math.floor(iwHash(tx,0,tz,573)*3),log=({5:34,6:36,9:id('acaciaLog'),10:id('jungleLog'),11:id('mangroveLog')})[b]||4,leaf=({5:45,6:46,9:id('java_acacia_leaves',5),10:id('java_jungle_leaves',5),11:id('java_mangrove_leaves',5)})[b]||5;
  for(let dy=b===6?2:ht-2;dy<=ht+1;dy++){let r=b===6?Math.min(3,Math.max(0,Math.floor((ht+2-dy)*.55))):b===9?(dy<ht?0:3):b===10?(dy===ht+1?2:3):dy===ht+1?1:2;for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(!(Math.abs(dx)===r&&Math.abs(dz)===r&&iwHash(gx+dx,dy,gz+dz,574)<.4)){let x=gx+dx-gx0,z=gz+dz-gz0,y=cl.h+dy;if(x>=0&&x<16&&z>=0&&z<16&&(B[at(x,y,z)]===0||D[B[at(x,y,z)]]?.plant))put(x,y,z,leaf);}}
  for(let dy=1;dy<=ht;dy++)put(gx-gx0,cl.h+dy,gz-gz0,log);
 }
 let ruins=[];
 for(let rz=Math.floor((gz0-3)/128);rz<=Math.floor((gz0+18)/128);rz++)for(let rx=Math.floor((gx0-3)/128);rx<=Math.floor((gx0+18)/128);rx++){
  let gx=rx*128+24+Math.floor(iwHash(rx,0,rz,580)*80),gz=rz*128+24+Math.floor(iwHash(rx,0,rz,581)*80),cl=iwFirstClimate(gx,gz);if(cl.h<=SEA+2||iwHash(rx,0,rz,582)>.38)continue;
  let safe=true;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(Math.abs(iwFirstClimate(gx+dx,gz+dz).h-cl.h)>1)safe=false;if(!safe)continue;
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){put(gx+dx-gx0,cl.h,gz+dz-gz0,iwHash(gx+dx,0,gz+dz,583)<.4?39:38);if(Math.abs(dx)===2&&Math.abs(dz)===2)for(let dy=1;dy<=2;dy++)put(gx+dx-gx0,cl.h+dy,gz+dz-gz0,44);}
  put(gx-gx0,cl.h+1,gz-gz0,31);if(gx>=gx0&&gx<gx0+16&&gz>=gz0&&gz<gz0+16)ruins.push({x:gx,y:cl.h+1,z:gz});
 }
 let result={blocks:B,surf,bio,ruins};IW.cache.set(key,result);while(IW.cache.size>448)IW.cache.delete(IW.cache.keys().next().value);return result;
}
function wbForestFeatures(x0,z0,x1,z1,climate,emit,onlySpecial=false){
 if(biomeGeneration<3)return wbCanopyFeatures(x0,z0,x1,z1,climate,emit,onlySpecial);
 const B=WB_BID;
 const adapted=(x,z)=>{let q=climate(x,z),native=q.biome,b=native;
  if(wbIs(b,'pale_garden','old_growth_pine_taiga','old_growth_spruce_taiga'))b=13;
  else if(wbIs(b,'dappled_forest','old_growth_birch_forest'))b=5;
  else if(wbIs(b,'snowy_taiga','grove','windswept_forest'))b=6;
  else if(wbIs(b,'flower_forest','cherry_grove','wooded_badlands'))b=4;
  else if(wbIs(b,'sparse_jungle','savanna_plateau','windswept_savanna'))b=9;
  else if(b===B.bamboo_jungle)b=10;
  else if(b===B.mangrove_swamp)b=11;
  else if(wbIs(b,'meadow','sunflower_plains','windswept_hills'))b=3;
  return {...q,biome:b,nativeBiome:native};};
 for(let tz=Math.floor((z0-8)/7);tz<=Math.floor((z1+8)/7);tz++)for(let tx=Math.floor((x0-8)/7);tx<=Math.floor((x1+8)/7);tx++){
  let ax=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),az=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),q=climate(ax,az),source=q.biome;
  wbOneTree(tx,tz,x0,z0,x1,z1,adapted,(x,y,z,v,wood)=>{const id=(k,f)=>I[k]?.block||f;
   if(wood&&v!==2){if(source===B.pale_garden)v=id('paleOakLog',51);else if(source===B.dappled_forest)v=id('poplarLog',34);else if(source===B.cherry_grove)v=id('cherryLog',4);else if(wbIs(source,'old_growth_pine_taiga','old_growth_spruce_taiga'))v=36;else if(source===B.sparse_jungle)v=id('jungleLog',4);else if(source===B.swamp)v=4;}
   else if(!wood){if(source===B.pale_garden)v=id('java_pale_oak_leaves',5);else if(source===B.dappled_forest)v=id(['java_red_poplar_leaves','java_orange_poplar_leaves','java_yellow_poplar_leaves'][Math.floor(iwHash(tx,0,tz,958)*3)],45);else if(source===B.cherry_grove)v=id('java_cherry_leaves',5);else if(wbIs(source,'old_growth_pine_taiga','old_growth_spruce_taiga')){v=46;if(source===B.old_growth_pine_taiga&&y<q.h+6)return;}else if(source===B.sparse_jungle)v=id('java_jungle_leaves',5);else if(source===B.swamp)v=5;}
   emit(x,y,z,v,wood);
  });
 }
}
function iwCanopyChunk(cx,cz){
 if(biomeGeneration<2)return iwFirstChunk(cx,cz);
 let key=cx+','+cz,cached=IW.cache.get(key);if(cached){IW.cache.delete(key);IW.cache.set(key,cached);return cached;}
 const B=new Uint16Array(16*H*16),surf=new Int16Array(256),bio=new Uint8Array(256),id=(k,f=3)=>I[k]?.block||f,deep=id('deepslate'),lava=I.lavaBucket?.fluidBlock||0;
 const at=(x,y,z)=>(y*16+z)*16+x,put=(x,y,z,b)=>{if(x>=0&&z>=0&&x<16&&z<16&&y>0&&y<H)B[at(x,y,z)]=b;},gx0=cx*16,gz0=cz*16;
 // Coarse density lattice shared across chunk boundaries, interpolated per voxel.
 let ny=Math.ceil(H/8)+1,n1=new Float32Array(3*ny*3),n2=new Float32Array(n1.length),ni=(x,y,z)=>(y*3+z)*3+x;
 for(let y=0;y<ny;y++)for(let z=0;z<3;z++)for(let x=0;x<3;x++){n1[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,510);n2[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,511);}
 let ores=[];
 for(let y=0;y<H/4;y++)for(let z=0;z<4;z++)for(let x=0;x<4;x++){
  let wx=cx*4+x,wz=cz*4+z,yy=y*4,r=iwHash(wx,y,wz,520),k=null;
  if(yy<24&&r<.038)k='diamond';else if(yy<30&&r<.105)k='redstone';else if(yy>8&&yy<42&&r>.94)k='lapis';else if(yy<38&&r>.90&&r<.94)k='gold';else if(yy>12&&yy<88&&r>.68&&r<.83)k='iron';else if(yy>30&&yy<76&&r>.46&&r<.59)k='copper';else if(yy>40&&r>.20&&r<.36)k='coal';
  let normal={coal:9,iron:10,gold:22,diamond:21,copper:id('copperOre'),lapis:id('lapisOre'),redstone:id('redstoneOre')};
  ores[(y*4+z)*4+x]={b:k?(yy<30?id('java_deepslate_'+k+'_ore',normal[k]):normal[k]):0,x:1+iwHash(wx,y,wz,521)*2,y:1+iwHash(wx,y,wz,522)*2,z:1+iwHash(wx,y,wz,523)*2};
 }
 const interp=(arr,x,y,z)=>{let ix=x>>3,iy=y>>3,iz=z>>3,u=(x&7)/8,v=(y&7)/8,w=(z&7)/8;u=u*u*(3-2*u);v=v*v*(3-2*v);w=w*w*(3-2*w);let a=ni(ix,iy,iz),q=3,r=9;return((arr[a]*(1-u)+arr[a+1]*u)*(1-w)+(arr[a+q]*(1-u)+arr[a+q+1]*u)*w)*(1-v)+((arr[a+r]*(1-u)+arr[a+r+1]*u)*(1-w)+(arr[a+r+q]*(1-u)+arr[a+r+q+1]*u)*w)*v;};
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  let gx=gx0+x,gz=gz0+z,cl=iwCanopyClimate(gx,gz),hh=cl.h,biome=cl.biome;surf[z*16+x]=hh;bio[z*16+x]=biome;
  let sand=[0,1,2,7].includes(biome),snow=biome===12;
  for(let y=0;y<=Math.max(hh,SEA);y++){
   let b=y===0||y<4&&iwHash(gx,y,gz,530)<(4-y)*.22?15:y>hh?14:y===hh?(biome===8?3:sand?7:snow?42:1):y>hh-4?(biome===8?3:sand?(biome===7&&y<hh-1?43:7):2):y<30?deep:3;
   if((b===3||b===deep)&&y>4&&y<hh-2){let a=interp(n1,x,y,z),d=interp(n2,x,y,z);if(a>.73||Math.abs(a-.5)<.07&&Math.abs(d-.5)<.18)b=y<7?lava:0;}
   if(b===3||b===deep){let o=ores[(((y>>2)*4+(z>>2))*4+(x>>2))];if(o?.b&&((x&3)-o.x)**2+((y&3)-o.y)**2+((z&3)-o.z)**2<3.1)b=o.b;}
   B[at(x,y,z)]=b;
  }
  if(hh>SEA+1&&![7,8,12].includes(biome)){let r=iwHash(gx,0,gz,540);if(r<.001)put(x,hh+1,z,id('pumpkin'));else if(r<.028&&!snow)put(x,hh+1,z,r<.014?18:19);else if(r<.18&&!snow)put(x,hh+1,z,17);}
  if(biome===7&&hh>SEA+1&&iwHash(gx,0,gz,541)<.007)for(let y=1;y<=2+Math.floor(iwHash(gx,0,gz,542)*2);y++)put(x,hh+y,z,id('cactus'));
  if(hh===SEA+1&&iwHash(gx,0,gz,543)<.12&&[iwCanopyClimate(gx-1,gz),iwCanopyClimate(gx+1,gz),iwCanopyClimate(gx,gz-1),iwCanopyClimate(gx,gz+1)].some(q=>q.h<SEA))for(let y=1;y<=3;y++)put(x,hh+y,z,I.sugarCane?.plantBlock||17);
 }
 // Spatial feature cells are evaluated with a halo: load order cannot cut trees/geodes at seams.
 for(let fz=Math.floor((gz0-5)/64);fz<=Math.floor((gz0+21)/64);fz++)for(let fx=Math.floor((gx0-5)/64);fx<=Math.floor((gx0+21)/64);fx++){
  let gx=fx*64+12+Math.floor(iwHash(fx,0,fz,550)*40),gz=fz*64+12+Math.floor(iwHash(fx,0,fz,551)*40),gy=13+Math.floor(iwHash(fx,0,fz,552)*15),h0=iwCanopyClimate(gx,gz).h;
  if(h0>gy+9&&iwHash(fx,0,fz,553)<.55)for(let dz=-4;dz<=4;dz++)for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){let d=dx*dx+dy*dy+dz*dz;if(d<=16)put(gx+dx-gx0,gy+dy,gz+dz-gz0,d>10?id('java_calcite'):d>3?id('java_amethyst_block'):0);}
  let tx=fx*64+Math.floor(iwHash(fx,0,fz,554)*64),tz=fz*64+Math.floor(iwHash(fx,0,fz,555)*64),ty=12+Math.floor(iwHash(fx,0,fz,556)*32);
  for(let z=Math.max(0,tz-gz0-5);z<Math.min(16,tz-gz0+6);z++)for(let x=Math.max(0,tx-gx0-5);x<Math.min(16,tx-gx0+6);x++)for(let y=Math.max(4,ty-5);y<=Math.min(H-4,ty+5);y++){let i=at(x,y,z),d=(gx0+x-tx)**2+(gz0+z-tz)**2+(y-ty)**2;if(d<=25&&(B[i]===3||B[i]===deep))B[i]=id('java_tuff');}
  if(h0>62&&iwHash(fx,0,fz,557)<.6)for(let q=0;q<3;q++){let x=gx-gx0+q,y=Math.min(h0-8,18+Math.floor(iwHash(fx,q,fz,558)*32)),z=gz-gz0;if(x>=0&&x<16&&z>=0&&z<16){let i=at(x,y,z);if(B[i]===3||B[i]===deep)B[i]=id(y<30?'java_deepslate_emerald_ore':'java_emerald_ore');}}
 }
 wbCanopyFeatures(gx0,gz0,gx0+16,gz0+16,iwClimate,(x,y,z,v,wood)=>{let ix=x-gx0,iz=z-gz0,i=at(ix,y,iz),old=B[i];if(wood||old===0||D[old]?.plant)put(ix,y,iz,v);});
 let ruins=[];
 for(let rz=Math.floor((gz0-3)/128);rz<=Math.floor((gz0+18)/128);rz++)for(let rx=Math.floor((gx0-3)/128);rx<=Math.floor((gx0+18)/128);rx++){
  let gx=rx*128+24+Math.floor(iwHash(rx,0,rz,580)*80),gz=rz*128+24+Math.floor(iwHash(rx,0,rz,581)*80),cl=iwCanopyClimate(gx,gz);if(cl.h<=SEA+2||iwHash(rx,0,rz,582)>.38)continue;
  let safe=true;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(Math.abs(iwCanopyClimate(gx+dx,gz+dz).h-cl.h)>1)safe=false;if(!safe)continue;
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){put(gx+dx-gx0,cl.h,gz+dz-gz0,iwHash(gx+dx,0,gz+dz,583)<.4?39:38);if(Math.abs(dx)===2&&Math.abs(dz)===2)for(let dy=1;dy<=2;dy++)put(gx+dx-gx0,cl.h+dy,gz+dz-gz0,44);}
  put(gx-gx0,cl.h+1,gz-gz0,31);if(gx>=gx0&&gx<gx0+16&&gz>=gz0&&gz<gz0+16)ruins.push({x:gx,y:cl.h+1,z:gz});
 }
 let result={blocks:B,surf,bio,ruins};IW.cache.set(key,result);while(IW.cache.size>448)IW.cache.delete(IW.cache.keys().next().value);return result;
}
const WB_BIOMES=[{"id":0,"key":"ocean","name":"Ocean","realm":"overworld","underground":false},{"id":1,"key":"river","name":"River","realm":"overworld","underground":false},{"id":2,"key":"beach","name":"Beach","realm":"overworld","underground":false},{"id":3,"key":"plains","name":"Plains","realm":"overworld","underground":false},{"id":4,"key":"forest","name":"Forest","realm":"overworld","underground":false},{"id":5,"key":"birch_forest","name":"Birch Forest","realm":"overworld","underground":false},{"id":6,"key":"taiga","name":"Taiga","realm":"overworld","underground":false},{"id":7,"key":"desert","name":"Desert","realm":"overworld","underground":false},{"id":8,"key":"stony_peaks","name":"Stony Peaks","realm":"overworld","underground":false},{"id":9,"key":"savanna","name":"Savanna","realm":"overworld","underground":false},{"id":10,"key":"jungle","name":"Jungle","realm":"overworld","underground":false},{"id":11,"key":"swamp","name":"Swamp","realm":"overworld","underground":false},{"id":12,"key":"snowy_plains","name":"Snowy Plains","realm":"overworld","underground":false},{"id":13,"key":"dark_forest","name":"Dark Forest","realm":"overworld","underground":false},{"id":14,"key":"the_void","name":"The Void","realm":"void","underground":false},{"id":15,"key":"sunflower_plains","name":"Sunflower Plains","realm":"overworld","underground":false},{"id":16,"key":"ice_spikes","name":"Ice Spikes","realm":"overworld","underground":false},{"id":17,"key":"mangrove_swamp","name":"Mangrove Swamp","realm":"overworld","underground":false},{"id":18,"key":"flower_forest","name":"Flower Forest","realm":"overworld","underground":false},{"id":19,"key":"pale_garden","name":"Pale Garden","realm":"overworld","underground":false},{"id":20,"key":"dappled_forest","name":"Dappled Forest","realm":"overworld","underground":false},{"id":21,"key":"old_growth_birch_forest","name":"Old Growth Birch Forest","realm":"overworld","underground":false},{"id":22,"key":"old_growth_pine_taiga","name":"Old Growth Pine Taiga","realm":"overworld","underground":false},{"id":23,"key":"old_growth_spruce_taiga","name":"Old Growth Spruce Taiga","realm":"overworld","underground":false},{"id":24,"key":"snowy_taiga","name":"Snowy Taiga","realm":"overworld","underground":false},{"id":25,"key":"savanna_plateau","name":"Savanna Plateau","realm":"overworld","underground":false},{"id":26,"key":"windswept_hills","name":"Windswept Hills","realm":"overworld","underground":false},{"id":27,"key":"windswept_gravelly_hills","name":"Windswept Gravelly Hills","realm":"overworld","underground":false},{"id":28,"key":"windswept_forest","name":"Windswept Forest","realm":"overworld","underground":false},{"id":29,"key":"windswept_savanna","name":"Windswept Savanna","realm":"overworld","underground":false},{"id":30,"key":"sparse_jungle","name":"Sparse Jungle","realm":"overworld","underground":false},{"id":31,"key":"bamboo_jungle","name":"Bamboo Jungle","realm":"overworld","underground":false},{"id":32,"key":"badlands","name":"Badlands","realm":"overworld","underground":false},{"id":33,"key":"eroded_badlands","name":"Eroded Badlands","realm":"overworld","underground":false},{"id":34,"key":"wooded_badlands","name":"Wooded Badlands","realm":"overworld","underground":false},{"id":35,"key":"meadow","name":"Meadow","realm":"overworld","underground":false},{"id":36,"key":"cherry_grove","name":"Cherry Grove","realm":"overworld","underground":false},{"id":37,"key":"grove","name":"Grove","realm":"overworld","underground":false},{"id":38,"key":"snowy_slopes","name":"Snowy Slopes","realm":"overworld","underground":false},{"id":39,"key":"frozen_peaks","name":"Frozen Peaks","realm":"overworld","underground":false},{"id":40,"key":"jagged_peaks","name":"Jagged Peaks","realm":"overworld","underground":false},{"id":41,"key":"frozen_river","name":"Frozen River","realm":"overworld","underground":false},{"id":42,"key":"snowy_beach","name":"Snowy Beach","realm":"overworld","underground":false},{"id":43,"key":"stony_shore","name":"Stony Shore","realm":"overworld","underground":false},{"id":44,"key":"warm_ocean","name":"Warm Ocean","realm":"overworld","underground":false},{"id":45,"key":"lukewarm_ocean","name":"Lukewarm Ocean","realm":"overworld","underground":false},{"id":46,"key":"deep_lukewarm_ocean","name":"Deep Lukewarm Ocean","realm":"overworld","underground":false},{"id":47,"key":"deep_ocean","name":"Deep Ocean","realm":"overworld","underground":false},{"id":48,"key":"cold_ocean","name":"Cold Ocean","realm":"overworld","underground":false},{"id":49,"key":"deep_cold_ocean","name":"Deep Cold Ocean","realm":"overworld","underground":false},{"id":50,"key":"frozen_ocean","name":"Frozen Ocean","realm":"overworld","underground":false},{"id":51,"key":"deep_frozen_ocean","name":"Deep Frozen Ocean","realm":"overworld","underground":false},{"id":52,"key":"mushroom_fields","name":"Mushroom Fields","realm":"overworld","underground":false},{"id":53,"key":"dripstone_caves","name":"Dripstone Caves","realm":"overworld","underground":true},{"id":54,"key":"lush_caves","name":"Lush Caves","realm":"overworld","underground":true},{"id":55,"key":"sulfur_caves","name":"Sulfur Caves","realm":"overworld","underground":true},{"id":56,"key":"deep_dark","name":"Deep Dark","realm":"overworld","underground":true},{"id":57,"key":"nether_wastes","name":"Nether Wastes","realm":"nether","underground":false},{"id":58,"key":"warped_forest","name":"Warped Forest","realm":"nether","underground":false},{"id":59,"key":"crimson_forest","name":"Crimson Forest","realm":"nether","underground":false},{"id":60,"key":"soul_sand_valley","name":"Soul Sand Valley","realm":"nether","underground":false},{"id":61,"key":"basalt_deltas","name":"Basalt Deltas","realm":"nether","underground":false},{"id":62,"key":"the_end","name":"The End","realm":"end","underground":false},{"id":63,"key":"end_highlands","name":"End Highlands","realm":"end","underground":false},{"id":64,"key":"end_midlands","name":"End Midlands","realm":"end","underground":false},{"id":65,"key":"small_end_islands","name":"Small End Islands","realm":"end","underground":false},{"id":66,"key":"end_barrens","name":"End Barrens","realm":"end","underground":false}];
const WB_BID={"ocean":0,"river":1,"beach":2,"plains":3,"forest":4,"birch_forest":5,"taiga":6,"desert":7,"stony_peaks":8,"savanna":9,"jungle":10,"swamp":11,"snowy_plains":12,"dark_forest":13,"the_void":14,"sunflower_plains":15,"ice_spikes":16,"mangrove_swamp":17,"flower_forest":18,"pale_garden":19,"dappled_forest":20,"old_growth_birch_forest":21,"old_growth_pine_taiga":22,"old_growth_spruce_taiga":23,"snowy_taiga":24,"savanna_plateau":25,"windswept_hills":26,"windswept_gravelly_hills":27,"windswept_forest":28,"windswept_savanna":29,"sparse_jungle":30,"bamboo_jungle":31,"badlands":32,"eroded_badlands":33,"wooded_badlands":34,"meadow":35,"cherry_grove":36,"grove":37,"snowy_slopes":38,"frozen_peaks":39,"jagged_peaks":40,"frozen_river":41,"snowy_beach":42,"stony_shore":43,"warm_ocean":44,"lukewarm_ocean":45,"deep_lukewarm_ocean":46,"deep_ocean":47,"cold_ocean":48,"deep_cold_ocean":49,"frozen_ocean":50,"deep_frozen_ocean":51,"mushroom_fields":52,"dripstone_caves":53,"lush_caves":54,"sulfur_caves":55,"deep_dark":56,"nether_wastes":57,"warped_forest":58,"crimson_forest":59,"soul_sand_valley":60,"basalt_deltas":61,"the_end":62,"end_highlands":63,"end_midlands":64,"small_end_islands":65,"end_barrens":66};
function wbIs(b,...names){return names.some(k=>WB_BID[k]===b);}
function wbCaveBiome(x,y,z,regionNoise){let r=regionNoise??iwNoise(x,z,190,946);if(wbForcedBiome>=0&&WB_BIOMES[wbForcedBiome]?.underground)return wbForcedBiome;return y<(H>64?23:10)&&r>.61?WB_BID.deep_dark:r<.31?WB_BID.lush_caves:r>.70?WB_BID.sulfur_caves:WB_BID.dripstone_caves;}
function wbGround(b,y,h,x,z){
 const id=(k,f=3)=>I[k]?.block||f;
 if(wbIs(b,'badlands','eroded_badlands','wooded_badlands'))return y===h?(b===WB_BID.wooded_badlands?id('java_coarse_dirt',2):id('java_red_sand',7)):id(['java_orange_terracotta','java_yellow_terracotta','java_red_terracotta','java_white_terracotta','java_brown_terracotta'][Math.floor(y/3)%5]);
 if(wbIs(b,'snowy_plains','snowy_taiga','snowy_slopes','grove','jagged_peaks','ice_spikes','snowy_beach'))return y===h?42:wbIs(b,'snowy_slopes','jagged_peaks')?3:2;
 if(b===WB_BID.frozen_peaks)return y>=h-1?id('java_packed_ice',42):3;
 if(wbIs(b,'stony_peaks','stony_shore','windswept_hills'))return iwHash(x,y,z,939)<.12?id('java_calcite',3):3;
 if(b===WB_BID.windswept_gravelly_hills)return 20;
 if(b===WB_BID.mangrove_swamp)return id('java_mud',2);
 if(b===WB_BID.mushroom_fields)return y===h?id('wb_mycelium',1):2;
 if(wbIs(b,'old_growth_pine_taiga','old_growth_spruce_taiga','bamboo_jungle'))return y===h?id('wb_podzol',2):2;
 if(b===WB_BID.pale_garden)return y===h?id('java_pale_moss_block',1):2;
 if(wbIs(b,'desert','beach','warm_ocean','lukewarm_ocean','deep_lukewarm_ocean'))return y<h-1&&b===WB_BID.desert?43:7;
 if(wbIs(b,'ocean','deep_ocean','cold_ocean','deep_cold_ocean','frozen_ocean','deep_frozen_ocean'))return 20;
 return y===h?1:2;
}
function wbDecorateChunk(B,surf,bio,cx,cz){
 const at=(x,y,z)=>(y*16+z)*16+x,id=(k,f=3)=>I[k]?.block||f;
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  let gx=cx*16+x,gz=cz*16+z,h=surf[z*16+x],b=bio[z*16+x],r=iwHash(gx,0,gz,940);
  for(let y=Math.max(1,h-3);y<=h;y++)B[at(x,y,z)]=wbGround(b,y,h,gx,gz);
  if(wbIs(b,'frozen_ocean','frozen_river')&&h<SEA)B[at(x,SEA,z)]=id('java_ice',42);
  if(h>SEA+1&&(!B[at(x,h+1,z)]||D[B[at(x,h+1,z)]]?.plant)){
   if(wbIs(b,'bamboo_jungle')&&r<.27)for(let dy=1;dy<=4+Math.floor(iwHash(gx,1,gz,940)*8)&&h+dy<H-2;dy++)if(!B[at(x,h+dy,z)]||D[B[at(x,h+dy,z)]]?.plant)B[at(x,h+dy,z)]=I.bamboo?.plantBlock||149;
   if(b===WB_BID.sunflower_plains&&r<.10)B[at(x,h+1,z)]=id('wb_sunflower',19);
   if(wbIs(b,'flower_forest','meadow')&&r<.34)B[at(x,h+1,z)]=r<.17?18:19;
   if(wbIs(b,'desert','badlands','eroded_badlands')&&r<.012)for(let dy=1;dy<=3&&h+dy<H;dy++)B[at(x,h+dy,z)]=id('cactus',3);
  }
  let region=iwNoise(gx,gz,190,946);
  for(let y=3;y<h-4;y++)if(!B[at(x,y,z)]){
   let cb=wbCaveBiome(gx,y,gz,region),below=at(x,y-1,z),above=at(x,y+1,z),floor=B[below]&&![14,15,I.lavaBucket?.fluidBlock].includes(B[below]),ceil=B[above]&&![14,15,I.lavaBucket?.fluidBlock].includes(B[above]),mat=cb===WB_BID.lush_caves?id('wb_moss',1):cb===WB_BID.deep_dark?id('java_sculk',3):cb===WB_BID.sulfur_caves?id(y%6<3?'java_sulfur':'java_cinnabar',3):id('java_dripstone_block',3);
   if(floor)B[below]=mat;if(ceil)B[above]=mat;
   if(cb===WB_BID.dripstone_caves&&iwHash(gx,y,gz,947)<.10&&(floor||ceil))B[at(x,y,z)]=id('wb_pointed_dripstone',3);
   if(cb===WB_BID.lush_caves&&ceil&&iwHash(gx,y,gz,948)<.08)B[at(x,y,z)]=id('wb_glow_berries',17);
  }
 }
}
function wbLandmarks(x0,z0,x1,z1,climate,emit){
 const id=(k,f=3)=>I[k]?.block||f;
 for(let tz=Math.floor((z0-5)/12);tz<=Math.floor((z1+5)/12);tz++)for(let tx=Math.floor((x0-5)/12);tx<=Math.floor((x1+5)/12);tx++){
  let x=tx*12+Math.floor(iwHash(tx,0,tz,950)*12),z=tz*12+Math.floor(iwHash(tx,0,tz,951)*12),q=climate(x,z),b=q.biome,h=q.h;
  if(wbIs(b,'frozen_ocean','deep_frozen_ocean'))h=Math.max(h,SEA);else if(h<=SEA+1)continue;let r=iwHash(tx,0,tz,952);
  const put=(dx,y,dz,v,wood=false)=>{if(x+dx>=x0&&x+dx<x1&&z+dz>=z0&&z+dz<z1&&y>0&&y<H-1)emit(x+dx,y,z+dz,v,wood);};
  if(wbIs(b,'ice_spikes','frozen_ocean','deep_frozen_ocean')&&r<.75){let ht=7+Math.floor(r*15);for(let dy=1;dy<=ht;dy++){let rad=dy<ht*.35?2:dy<ht*.8?1:0;for(let dz=-rad;dz<=rad;dz++)for(let dx=-rad;dx<=rad;dx++)if(dx*dx+dz*dz<=rad*rad+1)put(dx,h+dy,dz,id('java_packed_ice',42),true);}}
  if(b===WB_BID.eroded_badlands&&r<.7){let ht=5+Math.floor(r*18);for(let dy=1;dy<=ht;dy++)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)if(dy<ht-2||dx===0&&dz===0)put(dx,h+dy,dz,id(dy%6<3?'java_orange_terracotta':'java_white_terracotta',3),true);}
  if((b===WB_BID.mushroom_fields||b===WB_BID.dark_forest)&&r<(b===WB_BID.mushroom_fields?.8:.10)){let ht=4+Math.floor(r*5),red=iwHash(tx,0,tz,953)<.5;for(let dy=1;dy<=ht;dy++)put(0,h+dy,0,id('wb_mushroom_stem',34),true);for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(dx*dx+dz*dz<13)put(dx,h+ht,dz,id(red?'wb_red_mushroom_cap':'wb_brown_mushroom_cap',5));}
 }
}
function wbOneTree(tx,tz,x0,z0,x1,z1,climate,emit){
 const onlySpecial=false;
 const id=(k,f)=>I[k]?.block||f;
 for(let once=0;once<1;once++){
  let x=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),z=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),c=climate(x,z),b=c.biome;
  if(onlySpecial&&b!==10&&b!==13)continue;
  let chance=({3:.012,4:.82,5:.65,6:.78,9:.18,10:.98,11:.55,12:.015,13:.97})[b]||0;
  if(c.h<=SEA+1||iwHash(tx,0,tz,572)>chance)continue;
  let native=c.nativeBiome,giant=b===13||b===10&&iwHash(tx,0,tz,910)<.52,size=giant?2:1;
  let ht=b===13?6+Math.floor(iwHash(tx,0,tz,573)*3):b===10?(giant?18+Math.floor(iwHash(tx,0,tz,573)*12):5+Math.floor(iwHash(tx,0,tz,573)*5)):b===6?7+Math.floor(iwHash(tx,0,tz,573)*4):5+Math.floor(iwHash(tx,0,tz,573)*3);
  if(native===WB_BID.old_growth_birch_forest)ht=9+Math.floor(iwHash(tx,0,tz,959)*5);if(native===WB_BID.old_growth_pine_taiga||native===WB_BID.old_growth_spruce_taiga)ht=15+Math.floor(iwHash(tx,0,tz,959)*10);
  let base=c.h,grounds=[],ok=true;
  for(let dz=0;dz<size;dz++)for(let dx=0;dx<size;dx++){let q=climate(x+dx,z+dz);if(q.h<=SEA+1||Math.abs(q.h-c.h)>2||q.biome!==b)ok=false;base=Math.max(base,q.h);grounds.push([dx,dz,q.h]);}
  if(!ok||base+ht+3>=H)continue;
  let log=b===13?id('darkOakLog',51):b===10?id('jungleLog',4):b===9?id('acaciaLog',4):b===11?id('mangroveLog',4):b===5?34:b===6?36:4;
  let leaf=b===13?id('java_dark_oak_leaves',5):b===10?id('java_jungle_leaves',5):b===9?id('java_acacia_leaves',5):b===11?id('java_mangrove_leaves',5):b===5?45:b===6?46:5;
  const put=(dx,y,dz,v,wood=false)=>{let xx=x+dx,zz=z+dz;if(xx>=x0&&xx<x1&&zz>=z0&&zz<z1&&y>0&&y<H){if(!wood&&y<Math.max(base+4,climate(xx,zz).h+3))return;emit(xx,y,zz,v,wood);}};
  const crown=(cx,cy,cz,r)=>{for(let dy=-1;dy<=1;dy++){let rr=r-(dy===1?1:0);for(let dz=-rr;dz<=rr;dz++)for(let dx=-rr;dx<=rr;dx++)if(dx*dx+dz*dz<=(rr+.45)**2)put(cx+dx,cy+dy,cz+dz,leaf);}};
  if(b===6||native===WB_BID.old_growth_pine_taiga||native===WB_BID.old_growth_spruce_taiga){for(let y=Math.max(4,Math.ceil(ht*(native===WB_BID.old_growth_pine_taiga?.48:native===WB_BID.old_growth_spruce_taiga?.34:.30)));y<=ht+1;y++){let r=Math.min(3,Math.max(0,Math.floor((ht+2-y)*.5)));if(y%2===0||y>=ht-1)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(Math.abs(dx)+Math.abs(dz)<=r+1)put(dx,base+y,dz,leaf);}}
  else if(b===13){crown(0,base+ht,0,4);crown(1,base+ht,1,4);crown(0,base+ht+1,1,3);}
  else crown(giant?1:0,base+ht,giant?1:0,b===10&&giant?4:b===9?3:2);
  // Branches carry their own crowns; their logs are written after leaves.
  let branches=[];
  if(giant){for(let n=0;n<(b===13?3:4);n++){let angle=iwHash(tx,n,tz,911)*Math.PI*2,len=b===13?2+Math.floor(iwHash(tx,n,tz,912)*2):3+Math.floor(iwHash(tx,n,tz,912)*3),by=b===13?ht-2:ht-4-n*2;
   let ex=1+Math.round(Math.cos(angle)*len),ez=1+Math.round(Math.sin(angle)*len);crown(ex,base+by+1,ez,b===13?2:3);
   for(let k=0;k<=len;k++)branches.push([1+Math.round((ex-1)*k/len),base+by+Math.floor(k/len),1+Math.round((ez-1)*k/len)]);
  }}
  for(let [dx,dz,ground]of grounds){for(let y=ground+1;y<=base;y++)put(dx,y,dz,2,true);for(let y=1;y<=ht;y++)put(dx,base+y,dz,log,true);}
  for(let [dx,y,dz]of branches)put(dx,y,dz,log,true);
  // Low jungle bushes form a second vegetation layer between the trunks.
  if(b===10){let bx=x+3,bz=z-3,q=climate(bx,bz);if(q.biome===10&&q.h>SEA+1){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)if(bx+dx>=x0&&bx+dx<x1&&bz+dz>=z0&&bz+dz<z1)emit(bx+dx,q.h+1,bz+dz,leaf,false);if(bx>=x0&&bx<x1&&bz>=z0&&bz<z1){emit(bx,q.h+2,bz,leaf,false);emit(bx,q.h+1,bz,log,true);}}}
 }
}
function wbCanopyFeatures(x0,z0,x1,z1,climate,emit,onlySpecial=false){
 const id=(k,f)=>I[k]?.block||f;
 for(let tz=Math.floor((z0-8)/7);tz<=Math.floor((z1+8)/7);tz++)for(let tx=Math.floor((x0-8)/7);tx<=Math.floor((x1+8)/7);tx++){
  let x=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),z=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),c=climate(x,z),b=c.biome;
  if(onlySpecial&&b!==10&&b!==13)continue;
  let chance=({3:.012,4:.82,5:.65,6:.78,9:.18,10:.98,11:.55,12:.015,13:.97})[b]||0;
  if(c.h<=SEA+1||iwHash(tx,0,tz,572)>chance)continue;
  let giant=b===13||b===10&&iwHash(tx,0,tz,910)<.52,size=giant?2:1;
  let ht=b===13?6+Math.floor(iwHash(tx,0,tz,573)*3):b===10?(giant?18+Math.floor(iwHash(tx,0,tz,573)*12):5+Math.floor(iwHash(tx,0,tz,573)*5)):b===6?7+Math.floor(iwHash(tx,0,tz,573)*4):4+Math.floor(iwHash(tx,0,tz,573)*3);
  let base=c.h,grounds=[],ok=true;
  for(let dz=0;dz<size;dz++)for(let dx=0;dx<size;dx++){let q=climate(x+dx,z+dz);if(q.h<=SEA+1||Math.abs(q.h-c.h)>2||q.biome!==b)ok=false;base=Math.max(base,q.h);grounds.push([dx,dz,q.h]);}
  if(!ok||base+ht+3>=H)continue;
  let log=b===13?id('darkOakLog',51):b===10?id('jungleLog',4):b===9?id('acaciaLog',4):b===11?id('mangroveLog',4):b===5?34:b===6?36:4;
  let leaf=b===13?id('java_dark_oak_leaves',5):b===10?id('java_jungle_leaves',5):b===9?id('java_acacia_leaves',5):b===11?id('java_mangrove_leaves',5):b===5?45:b===6?46:5;
  const put=(dx,y,dz,v,wood=false)=>{let xx=x+dx,zz=z+dz;if(xx>=x0&&xx<x1&&zz>=z0&&zz<z1&&y>0&&y<H)emit(xx,y,zz,v,wood);};
  const crown=(cx,cy,cz,r)=>{for(let dy=-1;dy<=1;dy++){let rr=r-(dy===1?1:0);for(let dz=-rr;dz<=rr;dz++)for(let dx=-rr;dx<=rr;dx++)if(dx*dx+dz*dz<=(rr+.45)**2)put(cx+dx,cy+dy,cz+dz,leaf);}};
  if(b===6){for(let y=2;y<=ht+1;y++){let r=Math.min(3,Math.max(0,Math.floor((ht+2-y)*.5)));if(y%2===0||y>=ht-1)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(Math.abs(dx)+Math.abs(dz)<=r+1)put(dx,base+y,dz,leaf);}}
  else if(b===13){crown(0,base+ht,0,4);crown(1,base+ht,1,4);crown(0,base+ht+1,1,3);}
  else crown(giant?1:0,base+ht,giant?1:0,b===10&&giant?4:b===9?3:2);
  // Branches carry their own crowns; their logs are written after leaves.
  let branches=[];
  if(giant){for(let n=0;n<(b===13?3:4);n++){let angle=iwHash(tx,n,tz,911)*Math.PI*2,len=b===13?2+Math.floor(iwHash(tx,n,tz,912)*2):3+Math.floor(iwHash(tx,n,tz,912)*3),by=b===13?ht-2:ht-4-n*2;
   let ex=1+Math.round(Math.cos(angle)*len),ez=1+Math.round(Math.sin(angle)*len);crown(ex,base+by+1,ez,b===13?2:3);
   for(let k=0;k<=len;k++)branches.push([1+Math.round((ex-1)*k/len),base+by+Math.floor(k/len),1+Math.round((ez-1)*k/len)]);
  }}
  for(let [dx,dz,ground]of grounds){for(let y=ground+1;y<=base;y++)put(dx,y,dz,2,true);for(let y=1;y<=ht;y++)put(dx,base+y,dz,log,true);}
  for(let [dx,y,dz]of branches)put(dx,y,dz,log,true);
  // Low jungle bushes form a second vegetation layer between the trunks.
  if(b===10){let bx=x+3,bz=z-3,q=climate(bx,bz);if(q.biome===10&&q.h>SEA+1){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)if(bx+dx>=x0&&bx+dx<x1&&bz+dz>=z0&&bz+dz<z1)emit(bx+dx,q.h+1,bz+dz,leaf,false);if(bx>=x0&&bx<x1&&bz>=z0&&bz<z1){emit(bx,q.h+2,bz,leaf,false);emit(bx,q.h+1,bz,log,true);}}}
 }
}
function iwChunk(cx,cz){
 if(biomeGeneration<3)return iwCanopyChunk(cx,cz);
 if(wbForcedBiome===WB_BID.the_void){let blocks=new Uint16Array(16*H*16),surf=new Int16Array(256),bio=new Uint8Array(256);bio.fill(WB_BID.the_void);for(let z=0;z<16;z++)for(let x=0;x<16;x++)if(Math.abs(cx*16+x-64)<=2&&Math.abs(cz*16+z-64)<=2){surf[z*16+x]=20;blocks[(20*16+z)*16+x]=3;}return{blocks,surf,bio,ruins:[]};}
 let key=cx+','+cz,cached=IW.cache.get(key);if(cached){IW.cache.delete(key);IW.cache.set(key,cached);return cached;}
 const B=new Uint16Array(16*H*16),surf=new Int16Array(256),bio=new Uint8Array(256),id=(k,f=3)=>I[k]?.block||f,deep=id('deepslate'),lava=I.lavaBucket?.fluidBlock||0;
 const at=(x,y,z)=>(y*16+z)*16+x,put=(x,y,z,b)=>{if(x>=0&&z>=0&&x<16&&z<16&&y>0&&y<H)B[at(x,y,z)]=b;},gx0=cx*16,gz0=cz*16;
 // Coarse density lattice shared across chunk boundaries, interpolated per voxel.
 let ny=Math.ceil(H/8)+1,n1=new Float32Array(3*ny*3),n2=new Float32Array(n1.length),ni=(x,y,z)=>(y*3+z)*3+x;
 for(let y=0;y<ny;y++)for(let z=0;z<3;z++)for(let x=0;x<3;x++){n1[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,510);n2[ni(x,y,z)]=iwCaveNode(cx*2+x,y,cz*2+z,511);}
 let ores=[];
 for(let y=0;y<H/4;y++)for(let z=0;z<4;z++)for(let x=0;x<4;x++){
  let wx=cx*4+x,wz=cz*4+z,yy=y*4,r=iwHash(wx,y,wz,520),k=null;
  if(yy<24&&r<.038)k='diamond';else if(yy<30&&r<.105)k='redstone';else if(yy>8&&yy<42&&r>.94)k='lapis';else if(yy<38&&r>.90&&r<.94)k='gold';else if(yy>12&&yy<88&&r>.68&&r<.83)k='iron';else if(yy>30&&yy<76&&r>.46&&r<.59)k='copper';else if(yy>40&&r>.20&&r<.36)k='coal';
  let normal={coal:9,iron:10,gold:22,diamond:21,copper:id('copperOre'),lapis:id('lapisOre'),redstone:id('redstoneOre')};
  ores[(y*4+z)*4+x]={b:k?(yy<30?id('java_deepslate_'+k+'_ore',normal[k]):normal[k]):0,x:1+iwHash(wx,y,wz,521)*2,y:1+iwHash(wx,y,wz,522)*2,z:1+iwHash(wx,y,wz,523)*2};
 }
 const interp=(arr,x,y,z)=>{let ix=x>>3,iy=y>>3,iz=z>>3,u=(x&7)/8,v=(y&7)/8,w=(z&7)/8;u=u*u*(3-2*u);v=v*v*(3-2*v);w=w*w*(3-2*w);let a=ni(ix,iy,iz),q=3,r=9;return((arr[a]*(1-u)+arr[a+1]*u)*(1-w)+(arr[a+q]*(1-u)+arr[a+q+1]*u)*w)*(1-v)+((arr[a+r]*(1-u)+arr[a+r+1]*u)*(1-w)+(arr[a+r+q]*(1-u)+arr[a+r+q+1]*u)*w)*v;};
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  let gx=gx0+x,gz=gz0+z,cl=iwClimate(gx,gz),hh=cl.h,biome=cl.biome;surf[z*16+x]=hh;bio[z*16+x]=biome;
  let sand=[0,1,2,7].includes(biome),snow=biome===12;
  for(let y=0;y<=Math.max(hh,SEA);y++){
   let b=y===0||y<4&&iwHash(gx,y,gz,530)<(4-y)*.22?15:y>hh?14:y===hh?(biome===8?3:sand?7:snow?42:1):y>hh-4?(biome===8?3:sand?(biome===7&&y<hh-1?43:7):2):y<30?deep:3;
   if((b===3||b===deep)&&y>4&&y<hh-2){let a=interp(n1,x,y,z),d=interp(n2,x,y,z);if(a>.73||Math.abs(a-.5)<.07&&Math.abs(d-.5)<.18)b=y<7?lava:0;}
   if(b===3||b===deep){let o=ores[(((y>>2)*4+(z>>2))*4+(x>>2))];if(o?.b&&((x&3)-o.x)**2+((y&3)-o.y)**2+((z&3)-o.z)**2<3.1)b=o.b;}
   B[at(x,y,z)]=b;
  }
  if(hh>SEA+1&&![7,8,12].includes(biome)){let r=iwHash(gx,0,gz,540);if(r<.001)put(x,hh+1,z,id('pumpkin'));else if(r<.028&&!snow)put(x,hh+1,z,r<.014?18:19);else if(r<.18&&!snow)put(x,hh+1,z,17);}
  if(biome===7&&hh>SEA+1&&iwHash(gx,0,gz,541)<.007)for(let y=1;y<=2+Math.floor(iwHash(gx,0,gz,542)*2);y++)put(x,hh+y,z,id('cactus'));
  if(hh===SEA+1&&iwHash(gx,0,gz,543)<.12&&[iwClimate(gx-1,gz),iwClimate(gx+1,gz),iwClimate(gx,gz-1),iwClimate(gx,gz+1)].some(q=>q.h<SEA))for(let y=1;y<=3;y++)put(x,hh+y,z,I.sugarCane?.plantBlock||17);
 }
 // Spatial feature cells are evaluated with a halo: load order cannot cut trees/geodes at seams.
 for(let fz=Math.floor((gz0-5)/64);fz<=Math.floor((gz0+21)/64);fz++)for(let fx=Math.floor((gx0-5)/64);fx<=Math.floor((gx0+21)/64);fx++){
  let gx=fx*64+12+Math.floor(iwHash(fx,0,fz,550)*40),gz=fz*64+12+Math.floor(iwHash(fx,0,fz,551)*40),gy=13+Math.floor(iwHash(fx,0,fz,552)*15),h0=iwClimate(gx,gz).h;
  if(h0>gy+9&&iwHash(fx,0,fz,553)<.55)for(let dz=-4;dz<=4;dz++)for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){let d=dx*dx+dy*dy+dz*dz;if(d<=16)put(gx+dx-gx0,gy+dy,gz+dz-gz0,d>10?id('java_calcite'):d>3?id('java_amethyst_block'):0);}
  let tx=fx*64+Math.floor(iwHash(fx,0,fz,554)*64),tz=fz*64+Math.floor(iwHash(fx,0,fz,555)*64),ty=12+Math.floor(iwHash(fx,0,fz,556)*32);
  for(let z=Math.max(0,tz-gz0-5);z<Math.min(16,tz-gz0+6);z++)for(let x=Math.max(0,tx-gx0-5);x<Math.min(16,tx-gx0+6);x++)for(let y=Math.max(4,ty-5);y<=Math.min(H-4,ty+5);y++){let i=at(x,y,z),d=(gx0+x-tx)**2+(gz0+z-tz)**2+(y-ty)**2;if(d<=25&&(B[i]===3||B[i]===deep))B[i]=id('java_tuff');}
  if(h0>62&&iwHash(fx,0,fz,557)<.6)for(let q=0;q<3;q++){let x=gx-gx0+q,y=Math.min(h0-8,18+Math.floor(iwHash(fx,q,fz,558)*32)),z=gz-gz0;if(x>=0&&x<16&&z>=0&&z<16){let i=at(x,y,z);if(B[i]===3||B[i]===deep)B[i]=id(y<30?'java_deepslate_emerald_ore':'java_emerald_ore');}}
 }
 wbDecorateChunk(B,surf,bio,cx,cz);
 wbForestFeatures(gx0,gz0,gx0+16,gz0+16,iwClimate,(x,y,z,v,wood)=>{let ix=x-gx0,iz=z-gz0,i=at(ix,y,iz),old=B[i];if(wood||old===0||D[old]?.plant)put(ix,y,iz,v);});
 wbLandmarks(gx0,gz0,gx0+16,gz0+16,iwClimate,(x,y,z,v,wood)=>{let ix=x-gx0,iz=z-gz0,i=at(ix,y,iz);if(wood||!B[i]||D[B[i]]?.plant)put(ix,y,iz,v);});
 let ruins=[];
 for(let rz=Math.floor((gz0-3)/128);rz<=Math.floor((gz0+18)/128);rz++)for(let rx=Math.floor((gx0-3)/128);rx<=Math.floor((gx0+18)/128);rx++){
  let gx=rx*128+24+Math.floor(iwHash(rx,0,rz,580)*80),gz=rz*128+24+Math.floor(iwHash(rx,0,rz,581)*80),cl=iwClimate(gx,gz);if(cl.h<=SEA+2||iwHash(rx,0,rz,582)>.38)continue;
  let safe=true;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(Math.abs(iwClimate(gx+dx,gz+dz).h-cl.h)>1)safe=false;if(!safe)continue;
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){put(gx+dx-gx0,cl.h,gz+dz-gz0,iwHash(gx+dx,0,gz+dz,583)<.4?39:38);if(Math.abs(dx)===2&&Math.abs(dz)===2)for(let dy=1;dy<=2;dy++)put(gx+dx-gx0,cl.h+dy,gz+dz-gz0,44);}
  put(gx-gx0,cl.h+1,gz-gz0,31);if(gx>=gx0&&gx<gx0+16&&gz>=gz0&&gz<gz0+16)ruins.push({x:gx,y:cl.h+1,z:gz});
 }
 let result={blocks:B,surf,bio,ruins};IW.cache.set(key,result);while(IW.cache.size>448)IW.cache.delete(IW.cache.keys().next().value);return result;
}
function iwPrepareNew(){biomeGeneration=3;wbForcedBiome=Number($('wbBiomePreset')?.value??-1);wbRealm=wbForcedBiome===-2?'end':wbForcedBiome===-3?'nether':WB_BIOMES[wbForcedBiome]?.realm||'overworld';if(wbRealm!=='overworld')$('worldSize').value='256';let on=$('worldSize').value==='infinite';if(on&&COOP.role!=='solo')throw Error('Leave co-op before creating a streamed solo world.');iwReset(on);if(on)options.renderDistance=Math.min(options.renderDistance,80);}
function iwPrepareRestore(s){biomeGeneration=[1,2,3].includes(s.biomeGeneration)?s.biomeGeneration:0;wbForcedBiome=Number.isInteger(s.wbForcedBiome)&&s.wbForcedBiome>=0&&s.wbForcedBiome<67?s.wbForcedBiome:-1;wbRealm=['end','nether','void'].includes(s.wbRealm)?s.wbRealm:'overworld';
 let on=s?.terrainVersion===6;if(on){let q=s.streamWorld;if(q?.format!==1||q.generator!=='frontiers-1'||![q.ox,q.oz].every(v=>Number.isSafeInteger(v)&&v%16===0&&Math.abs(v)<1e12)||!q.spawn||!['x','y','z'].every(k=>Number.isFinite(q.spawn[k])))throw Error('Invalid or unsupported streamed-world metadata.');if(COOP.role!=='solo')throw Error('Streamed worlds are solo-only in this release.');}
 iwReset(on);if(!on)return;
 let q=s.streamWorld;IW.ox=q.ox;IW.oz=q.oz;IW.edits=q.edits||{};IW.meta=Object.fromEntries(IW_META.map(k=>[k,q.meta?.[k]||{}]));IW.pending=q.pending||{};IW.animals=q.animals||{};IW.drops=q.drops||{};IW.explosives=q.explosives||{};IW.seen=q.seen||{};IW.spawn=q.spawn;IW.bed=q.bed||null;IW.shifts=q.shifts||0;options.renderDistance=Math.min(options.renderDistance,80);
 // Native mod block remapping applies to all dormant edits too, not just the active buffer.
 let remap={};for(let dep of s.modDependencies||[]){let found=installedMods.find(m=>m.manifest.id===dep.id);if(!found)throw Error('Install required mod before loading this world: '+dep.id);for(let[k,v]of Object.entries(dep.blockMap||{})){let b=found.blockMap[k];if(!Number.isInteger(b))throw Error('Missing mod block '+k);remap[v]=b;}}
 for(let k of Object.keys(IW.edits))IW.edits[k]=remap[IW.edits[k]]??IW.edits[k];
}
function iwCapture(){if(!IW.enabled||IW.busy)return;
 for(let[k,b]of Object.entries(edits)){let[x,y,z]=waterIndexXYZ(+k);IW.edits[iwKey(x,y,z)]=b;}
 const capture=(store,local,numeric=false)=>{for(let k of Object.keys(store)){let[x,,z]=k.split(',').map(Number);if(iwInside(x,z))delete store[k];}for(let[k,v]of Object.entries(local)){let[x,y,z]=numeric?waterIndexXYZ(+k):k.split(',').map(Number);store[iwKey(x,y,z)]=JSON.parse(JSON.stringify(v));}};
 for(let name of IW_META)capture(IW.meta[name],({chests,furnaces,crops,blockShapes,blockDirections,waterLevels})[name],name==='waterLevels');
 for(let k of Object.keys(IW.pending)){let[x,,z]=k.split(',').map(Number);if(iwInside(x,z))delete IW.pending[k];}
 for(let i of [...waterQueue,...waterDeferred]){let[x,y,z]=waterIndexXYZ(i);IW.pending[iwKey(x,y,z)]=1;}
 const entities=(store,list)=>{for(let[k,q]of Object.entries(store))if(iwInside(q.x,q.z))delete store[k];for(let q of list){let id=q.iwId||(q.iwId=crypto.randomUUID());store[id]={...q,x:q.x+IW.ox,z:q.z+IW.oz};}};
 entities(IW.animals,mobs.filter(m=>m.hp>0));entities(IW.drops,droppedItems.filter(d=>d.age<300));entities(IW.explosives,primedTNT.filter(t=>t.fuse>0));
 IW.bed=bedRespawn?{...bedRespawn,x:bedRespawn.x+IW.ox,z:bedRespawn.z+IW.oz}:null;
}
function iwSerialize(){if(!IW.enabled)return undefined;iwCapture();return{format:1,generator:'frontiers-1',biomeGeneration,wbForcedBiome,ox:IW.ox,oz:IW.oz,height:H,edits:IW.edits,meta:IW.meta,pending:IW.pending,animals:IW.animals,drops:IW.drops,explosives:IW.explosives,seen:IW.seen,spawn:IW.spawn,bed:IW.bed,shifts:IW.shifts};}
function iwApplyLedger(){
 for(let[k,b]of Object.entries(IW.edits)){let[x,y,z]=k.split(',').map(Number);x-=IW.ox;z-=IW.oz;if(x>=0&&z>=0&&x<W&&z<W&&y>0&&y<H&&Number.isInteger(b)&&(b===0||D[b])){let i=index(x,y,z);blocks[i]=b;edits[i]=b;}}
 chests={};furnaces={};crops={};blockShapes={};blockDirections={};waterLevels={};let stores={chests,furnaces,crops,blockShapes,blockDirections,waterLevels};
 for(let name of IW_META)for(let[k,v]of Object.entries(IW.meta[name])){let[x,y,z]=k.split(',').map(Number);x-=IW.ox;z-=IW.oz;if(x>=0&&z>=0&&x<W&&z<W&&y>0&&y<H)stores[name][name==='waterLevels'?index(x,y,z):key3(x,y,z)]=JSON.parse(JSON.stringify(v));}
 for(let k of Object.keys(IW.pending)){let[x,y,z]=k.split(',').map(Number);queueWater(x-IW.ox,y,z-IW.oz);}
 for(let q of IW.ruins){let x=q.x-IW.ox,z=q.z-IW.oz,k=key3(x,q.y,z);if(get(x,q.y,z)===31&&!chests[k])chests[k]=[{k:'carrot',n:3},{k:'potato',n:3},{k:'iron',n:3},{k:'coal',n:6},{k:'bread',n:2},...Array(22).fill(null)];}
 bedRespawn=IW.bed?{...IW.bed,x:IW.bed.x-IW.ox,z:IW.bed.z-IW.oz}:null;
 spawn={...IW.spawn,x:IW.spawn.x-IW.ox,z:IW.spawn.z-IW.oz};
}
function iwRestoreEntities(){primedTNT=Object.values(IW.explosives).filter(q=>iwInside(q.x,q.z)&&q.fuse>0).map(q=>({...q,x:q.x-IW.ox,z:q.z-IW.oz}));
 mobs=Object.values(IW.animals).filter(q=>iwInside(q.x,q.z)&&q.hp>0&&MODELS[q.type]).map(q=>({...q,x:q.x-IW.ox,z:q.z-IW.oz}));
 droppedItems=Object.values(IW.drops).filter(q=>iwInside(q.x,q.z)&&I[q.k]&&q.n>0&&q.age<300).map(q=>({...q,id:++dropSerial,x:q.x-IW.ox,z:q.z-IW.oz}));
}
function iwSeedAnimals(){if(!IW.enabled)return;for(let cz=Math.ceil((IW.oz+12)/64);cz<Math.floor((IW.oz+W-12)/64);cz++)for(let cx=Math.ceil((IW.ox+12)/64);cx<Math.floor((IW.ox+W-12)/64);cx++){let k=cx+','+cz;if(IW.seen[k])continue;IW.seen[k]=1;let gx=cx*64,gz=cz*64,cl=iwClimate(gx,gz);if(cl.h<=SEA+2||[7,8].includes(cl.biome)||iwHash(cx,0,cz,590)>.7)continue;for(let i=0;i<3;i++)spawnMob(i===0?'sheep':'pig',gx-IW.ox+(i-1)*3,gz-IW.oz);}}
function iwGenerateWindow(){
 seed=seedHash(seedText);sfUseWarmCache();
 if(!IW.spawn){let chosen=null;for(let r=0;r<=2048&&!chosen;r+=32)for(let i=0;i<(r?24:1);i++){let a=i*Math.PI*2/24,x=Math.round(Math.cos(a)*r),z=Math.round(Math.sin(a)*r),cl=iwClimate(x,z);if(cl.h>SEA+3&&cl.h<90&&![7,8].includes(cl.biome)){chosen={x:x+.5,y:cl.h+1.02,z:z+.5};break;}}if(!chosen)chosen={x:.5,y:iwClimate(0,0).h+1.02,z:.5};IW.spawn=chosen;IW.ox=Math.floor((chosen.x-W/2)/16)*16;IW.oz=Math.floor((chosen.z-W/2)/16)*16;}
 for(let c of chunks)if(c)ssReleaseChunk(c);chunks=[];residentChunks.clear();streamKey='';SS.waterKey='';LOCAL_LIGHT.key='';SS.occlusionRevision++;resetWater();blocks.fill(0);skyLevels.fill(0);lampLevels.fill(0);edits={};torches=[];IW.ruins=[];
 for(let cz=0;cz<N;cz++)for(let cx=0;cx<N;cx++){let q=iwChunk(IW.ox/16+cx,IW.oz/16+cz);IW.ruins.push(...q.ruins);sfPrepareChunk(q);for(let z=0;z<16;z++){for(let y=0;y<H;y++){let start=(y*16+z)*16;blocks.set(q.blocks.subarray(start,start+16),index(cx*16,y,cz*16+z));skyLevels.set(q.sky.subarray(start,start+16),index(cx*16,y,cz*16+z));lampLevels.set(q.lamp.subarray(start,start+16),index(cx*16,y,cz*16+z));}surface.set(q.surf.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);worldBiomes.set(q.bio.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);tops.set(q.tops.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);meshTops.set(q.meshTops.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);}}
 iwApplyLedger();let changed=new Set();for(let k of Object.keys(edits)){let[x,y,z]=waterIndexXYZ(+k);changed.add(x+','+z);}for(let k of changed){let[x,z]=k.split(',').map(Number);column(x,z);sfSeedColumn(x,z);}
 for(let[k,b]of Object.entries(edits))if(b===16){let[x,y,z]=waterIndexXYZ(+k);torches.push({x:x+.5,y:y+.65,z:z+.5,k:key3(x,y,z)});}
 dirty.clear();for(let i=0;i<N*N;i++)dirty.add(i);lightBuilt=false;lightBounds=null;
}
function iwShift(dx,dz){if(IW.enabled&&!IW.busy&&Math.abs(dx)<W&&Math.abs(dz)<W&&sfReady(dx,dz)){sfShift(dx,dz);return;}sfCancelJobs();if(!IW.enabled||IW.busy)return;iwCapture();IW.busy=true;try{IW.ox+=dx;IW.oz+=dz;p.x-=dx;p.z-=dz;iwGenerateWindow();iwRestoreEntities();iwSeedAnimals();particles=[];hit=null;mine=0;mineAt='';IW.shifts++;updateHUD();}finally{IW.busy=false;}}
function iwMaybeStream(){if(!IW.enabled||!started||dead||IW.busy||SF.loading)return;sfPrefetch();if(paused)return;options.renderDistance=Math.min(options.renderDistance,80);let margin=96;if(p.x<margin||p.x>W-margin||p.z<margin||p.z>W-margin){let dx=Math.floor((p.x-W/2)/16)*16,dz=Math.floor((p.z-W/2)/16)*16;if(!dx&&!dz)return;if(sfReady(dx,dz)){SF.waiting=false;sfShift(dx,dz);}else{sfRequest(sfRegion(dx,dz));SF.waiting=true;p.x=Math.max(20,Math.min(W-20,p.x));p.z=Math.max(20,Math.min(W-20,p.z));}}}
function iwAfterRestore(){if(IW.enabled){iwRestoreEntities();iwSeedAnimals();}}
function iwPrepareRespawn(){if(!IW.enabled)return;iwCapture();let t=IW.bed&&IW.edits[IW.bed.x+','+IW.bed.y+','+IW.bed.z]===32?IW.bed:IW.spawn;let nx=Math.floor((t.x-W/2)/16)*16,nz=Math.floor((t.z-W/2)/16)*16;iwShift(nx-IW.ox,nz-IW.oz);}
function iwWorldDescription(){return IW.enabled?'Streamed world · origin '+IW.ox+', '+IW.oz+' · active cache '+IW.cache.size+' chunks · 128-block height':'Bounded chunk world: '+W+' × '+H+' × '+W;}
function iwGuardCoop(){if(IW.enabled){toast('Frontiers streaming is solo-only. Use a finite world for co-op.');return false;}return true;}
// New biomes use existing native wood/leaves; no new content identities are allocated.
BIOME_NAMES.push('Savanna','Jungle','Swamp');
for(const [name,drop,tier,count]of [['coal','coal',1,1],['iron','rawIron',2,1],['gold','rawGold',3,1],['copper','rawCopper',2,3],['diamond','diamond',3,1],['lapis','lapis',2,6],['redstone','redstone',3,4]])Object.assign(D[I['java_deepslate_'+name+'_ore'].block],{drop,tier,time:4,dropCount:count});

// Companion only: active runtime copy is embedded in index.html.
