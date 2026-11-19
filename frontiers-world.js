
// Frontiers: bounded active simulation, unbounded world-coordinate generation.
const IW={enabled:false,ox:0,oz:0,cache:new Map(),edits:{},meta:{},pending:{},animals:{},drops:{},explosives:{},seen:{},spawn:null,bed:null,shifts:0,busy:false,ruins:[]};
const IW_META=['chests','furnaces','crops','blockShapes','blockDirections','waterLevels'];
function iwReset(on){IW.enabled=on;IW.ox=IW.oz=0;IW.cache.clear();IW.edits={};IW.meta=Object.fromEntries(IW_META.map(k=>[k,{}]));IW.pending={};IW.animals={};IW.drops={};IW.explosives={};IW.seen={};IW.spawn=null;IW.bed=null;IW.shifts=0;IW.busy=false;H=on?128:64;SEA=on?40:17;}
function iwGlobal(x,z){return[x+IW.ox,z+IW.oz];}
function iwKey(x,y,z){return(x+IW.ox)+','+y+','+(z+IW.oz);}
function iwInside(x,z,ox=IW.ox,oz=IW.oz){return x>=ox&&z>=oz&&x<ox+W&&z<oz+W;}
function iwHash(x,y,z,s=0){let hx=Math.floor(x/4294967296),hz=Math.floor(z/4294967296),n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(z|0,1442695041)^Math.imul(hx,1597334677)^Math.imul(hz,3812015801)^Math.imul(s,1274126177)^seed;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
function iwNoise(x,z,s,salt){x/=s;z/=s;let a=Math.floor(x),b=Math.floor(z),u=x-a,v=z-b;u=u*u*(3-2*u);v=v*v*(3-2*v);let n=(x,z)=>iwHash(x,0,z,salt);return(n(a,b)*(1-u)+n(a+1,b)*u)*(1-v)+(n(a,b+1)*(1-u)+n(a+1,b+1)*u)*v;}
function iwFbm(x,z,s,salt){return iwNoise(x,z,s,salt)*.57+iwNoise(x,z,s/2,salt+1)*.28+iwNoise(x,z,s/4,salt+2)*.15;}
function iwClimate(x,z){
 let c=iwFbm(x,z,1500,410),e=iwFbm(x,z,700,420),t=iwFbm(x,z,1100,430),m=iwFbm(x,z,860,440),ridge=1-Math.abs(iwNoise(x,z,230,450)*2-1);
 let land=(c-.45)*112,peaks=Math.max(0,(c-.52)*4)*Math.max(0,(.60-e)*3),detail=(iwFbm(x,z,96,460)-.5)*(7+e*9);
 let height=SEA+land+peaks*(24+ridge*62)+detail;
 let rd=Math.abs(iwNoise(x,z,370,470)*2-1),river=rd<.022&&height>SEA-3&&height<SEA+30;
 if(height>SEA-3&&height<SEA+30){let blend=Math.max(0,1-rd/.065);height=height*(1-blend)+(SEA-3)*blend;}
 let hh=Math.max(8,Math.min(H-12,Math.floor(height))),b=hh<SEA-2?(river?1:0):river?1:hh<=SEA+1?2:hh>85?8:t<.30?6:t>.64&&m<.42?7:t>.63&&m<.56?9:t>.61&&m>.64?10:m>.70&&hh<SEA+9?11:m>.56?4:m>.46?5:3;
 return{h:hh,biome:b,temp:t,moist:m};
}
function iwCaveNode(x,y,z,s){return iwHash(x,y,z,s);}
function iwChunk(cx,cz){
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
  let sand=[0,1,2,7].includes(biome),snow=biome===6||biome===8;
  for(let y=0;y<=Math.max(hh,SEA);y++){
   let b=y===0||y<4&&iwHash(gx,y,gz,530)<(4-y)*.22?15:y>hh?14:y===hh?(sand?7:snow?42:1):y>hh-4?(sand?7:2):y<30?deep:3;
   if((b===3||b===deep)&&y>4&&y<hh-2){let a=interp(n1,x,y,z),d=interp(n2,x,y,z);if(a>.73||Math.abs(a-.5)<.07&&Math.abs(d-.5)<.18)b=y<7?lava:0;}
   if(b===3||b===deep){let o=ores[(((y>>2)*4+(z>>2))*4+(x>>2))];if(o?.b&&((x&3)-o.x)**2+((y&3)-o.y)**2+((z&3)-o.z)**2<3.1)b=o.b;}
   B[at(x,y,z)]=b;
  }
  if(hh>SEA+1&&biome!==7){let r=iwHash(gx,0,gz,540);if(r<.001)put(x,hh+1,z,id('pumpkin'));else if(r<.028&&!snow)put(x,hh+1,z,r<.014?18:19);else if(r<.18&&!snow)put(x,hh+1,z,17);}
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
 for(let tz=Math.floor((gz0-3)/7);tz<=Math.floor((gz0+18)/7);tz++)for(let tx=Math.floor((gx0-3)/7);tx<=Math.floor((gx0+18)/7);tx++){
  let gx=tx*7+1+Math.floor(iwHash(tx,0,tz,570)*5),gz=tz*7+1+Math.floor(iwHash(tx,0,tz,571)*5),cl=iwClimate(gx,gz),b=cl.biome,chance=({4:.82,5:.68,6:.6,9:.22,10:.95,11:.55})[b]||.025;
  if(cl.h<=SEA+1||b===7||b===8||iwHash(tx,0,tz,572)>chance)continue;
  if(Math.abs(iwClimate(gx+2,gz).h-cl.h)>2||Math.abs(iwClimate(gx,gz+2).h-cl.h)>2)continue;
  let ht=(b===10?7:4)+Math.floor(iwHash(tx,0,tz,573)*3),log=({5:34,6:36,9:id('acaciaLog'),10:id('jungleLog'),11:id('mangroveLog')})[b]||4,leaf=({5:45,6:46,9:id('java_acacia_leaves',5),10:id('java_jungle_leaves',5),11:id('java_mangrove_leaves',5)})[b]||5;
  for(let dy=ht-2;dy<=ht+1;dy++){let r=b===6?Math.max(0,Math.floor((ht+2-dy)*.7)):dy===ht+1?1:2;for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(!(Math.abs(dx)===r&&Math.abs(dz)===r&&iwHash(gx+dx,dy,gz+dz,574)<.4)){let x=gx+dx-gx0,z=gz+dz-gz0,y=cl.h+dy;if(x>=0&&x<16&&z>=0&&z<16&&(B[at(x,y,z)]===0||D[B[at(x,y,z)]]?.plant))put(x,y,z,leaf);}}
  for(let dy=1;dy<=ht;dy++)put(gx-gx0,cl.h+dy,gz-gz0,log);
 }
 let ruins=[];
 for(let rz=Math.floor((gz0-3)/128);rz<=Math.floor((gz0+18)/128);rz++)for(let rx=Math.floor((gx0-3)/128);rx<=Math.floor((gx0+18)/128);rx++){
  let gx=rx*128+24+Math.floor(iwHash(rx,0,rz,580)*80),gz=rz*128+24+Math.floor(iwHash(rx,0,rz,581)*80),cl=iwClimate(gx,gz);if(cl.h<=SEA+2||iwHash(rx,0,rz,582)>.38)continue;
  let safe=true;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(Math.abs(iwClimate(gx+dx,gz+dz).h-cl.h)>1)safe=false;if(!safe)continue;
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){put(gx+dx-gx0,cl.h,gz+dz-gz0,iwHash(gx+dx,0,gz+dz,583)<.4?39:38);if(Math.abs(dx)===2&&Math.abs(dz)===2)for(let dy=1;dy<=2;dy++)put(gx+dx-gx0,cl.h+dy,gz+dz-gz0,44);}
  put(gx-gx0,cl.h+1,gz-gz0,31);if(gx>=gx0&&gx<gx0+16&&gz>=gz0&&gz<gz0+16)ruins.push({x:gx,y:cl.h+1,z:gz});
 }
 let result={blocks:B,surf,bio,ruins};IW.cache.set(key,result);while(IW.cache.size>384)IW.cache.delete(IW.cache.keys().next().value);return result;
}
function iwPrepareNew(){let on=$('worldSize').value==='infinite';if(on&&COOP.role!=='solo')throw Error('Leave co-op before creating a streamed solo world.');iwReset(on);if(on)options.renderDistance=Math.min(options.renderDistance,80);}
function iwPrepareRestore(s){
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
function iwSerialize(){if(!IW.enabled)return undefined;iwCapture();return{format:1,generator:'frontiers-1',ox:IW.ox,oz:IW.oz,height:H,edits:IW.edits,meta:IW.meta,pending:IW.pending,animals:IW.animals,drops:IW.drops,explosives:IW.explosives,seen:IW.seen,spawn:IW.spawn,bed:IW.bed,shifts:IW.shifts};}
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
 seed=seedHash(seedText);
 if(!IW.spawn){let chosen=null;for(let r=0;r<=2048&&!chosen;r+=32)for(let i=0;i<(r?24:1);i++){let a=i*Math.PI*2/24,x=Math.round(Math.cos(a)*r),z=Math.round(Math.sin(a)*r),cl=iwClimate(x,z);if(cl.h>SEA+3&&cl.h<90&&![7,8].includes(cl.biome)){chosen={x:x+.5,y:cl.h+1.02,z:z+.5};break;}}if(!chosen)chosen={x:.5,y:iwClimate(0,0).h+1.02,z:.5};IW.spawn=chosen;IW.ox=Math.floor((chosen.x-W/2)/16)*16;IW.oz=Math.floor((chosen.z-W/2)/16)*16;}
 for(let c of chunks)if(c)ssReleaseChunk(c);chunks=[];residentChunks.clear();streamKey='';SS.waterKey='';LOCAL_LIGHT.key='';SS.occlusionRevision++;resetWater();blocks.fill(0);skyLevels.fill(0);lampLevels.fill(0);edits={};torches=[];IW.ruins=[];
 for(let cz=0;cz<N;cz++)for(let cx=0;cx<N;cx++){let q=iwChunk(IW.ox/16+cx,IW.oz/16+cz);IW.ruins.push(...q.ruins);for(let z=0;z<16;z++){for(let y=0;y<H;y++){let start=(y*16+z)*16;blocks.set(q.blocks.subarray(start,start+16),index(cx*16,y,cz*16+z));}surface.set(q.surf.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);worldBiomes.set(q.bio.subarray(z*16,z*16+16),(cz*16+z)*W+cx*16);}}
 iwApplyLedger();for(let z=0;z<W;z++)for(let x=0;x<W;x++)column(x,z);
 for(let[k,b]of Object.entries(edits))if(b===16){let[x,y,z]=waterIndexXYZ(+k);torches.push({x:x+.5,y:y+.65,z:z+.5,k:key3(x,y,z)});}
 dirty.clear();for(let i=0;i<N*N;i++)dirty.add(i);lightBuilt=false;lightBounds=null;
}
function iwShift(dx,dz){if(!IW.enabled||IW.busy)return;iwCapture();IW.busy=true;try{IW.ox+=dx;IW.oz+=dz;p.x-=dx;p.z-=dz;iwGenerateWindow();iwRestoreEntities();iwSeedAnimals();particles=[];hit=null;mine=0;mineAt='';IW.shifts++;updateHUD();}finally{IW.busy=false;}}
function iwMaybeStream(){if(!IW.enabled||!started||paused||dead||IW.busy)return;options.renderDistance=Math.min(options.renderDistance,80);let margin=112;if(p.x<margin||p.x>W-margin||p.z<margin||p.z>W-margin){let dx=Math.floor((p.x-W/2)/16)*16,dz=Math.floor((p.z-W/2)/16)*16;if(dx||dz)iwShift(dx,dz);}}
function iwAfterRestore(){if(IW.enabled){iwRestoreEntities();iwSeedAnimals();}}
function iwPrepareRespawn(){if(!IW.enabled)return;iwCapture();let t=IW.bed&&IW.edits[IW.bed.x+','+IW.bed.y+','+IW.bed.z]===32?IW.bed:IW.spawn;let nx=Math.floor((t.x-W/2)/16)*16,nz=Math.floor((t.z-W/2)/16)*16;iwShift(nx-IW.ox,nz-IW.oz);}
function iwWorldDescription(){return IW.enabled?'Streamed world · origin '+IW.ox+', '+IW.oz+' · active cache '+IW.cache.size+' chunks · 128-block height':'Bounded chunk world: '+W+' × '+H+' × '+W;}
function iwGuardCoop(){if(IW.enabled){toast('Frontiers streaming is solo-only. Use a finite world for co-op.');return false;}return true;}
// New biomes use existing native wood/leaves; no new content identities are allocated.
BIOME_NAMES.push('Savanna','Jungle','Swamp');
for(const [name,drop,tier,count]of [['coal','coal',1,1],['iron','rawIron',2,1],['gold','rawGold',3,1],['copper','rawCopper',2,3],['diamond','diamond',3,1],['lapis','lapis',2,6],['redstone','redstone',3,4]])Object.assign(D[I['java_deepslate_'+name+'_ore'].block],{drop,tier,time:4,dropCount:count});

// Companion only: active runtime copy is embedded in index.html.
