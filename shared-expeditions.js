// Shared-expedition multiplayer: a synchronized host simulation window and party dimensions.
const SM={epoch:1,applying:false,switching:false,loading:false,scope:null,travelAt:0,rejected:0,loads:0};
function smScope(){return {v:1,epoch:SM.epoch,dim:ND.active,terrain:terrainVersion,ox:IW.enabled?IW.ox:0,oz:IW.enabled?IW.oz:0};}
function smMatches(q){let s=smScope();return !!q&&q.v===1&&['epoch','dim','terrain','ox','oz'].every(k=>q[k]===s[k]);}
function smCanSwitch(){return ![...COOP.connections.values()].some(c=>c.processing||c.stateSending||c.smSending||c.smWait);}
function smNearHost(){return {x:p.x,y:p.y,z:p.z,yaw:0,pitch:0};}
function smProfile(s){let q=coopClone(s),loc=q.roomLocation,pose=q.player||smNearHost();
 if(loc&&loc.dim===ND.active){pose={...pose,x:loc.x-(IW.enabled?IW.ox:0),z:loc.z-(IW.enabled?IW.oz:0)};}
 if(loc&&loc.dim!==ND.active||!['x','y','z'].every(k=>Number.isFinite(pose[k]))||pose.x<16||pose.z<16||pose.x>W-16||pose.z>W-16||pose.y<1||pose.y>H+10){pose=smNearHost();}
 q.player=pose;q.roomLocation={dim:ND.active,x:pose.x+(IW.enabled?IW.ox:0),z:pose.z+(IW.enabled?IW.oz:0)};return q;
}
const smCaptureBase=survivorCapture;survivorCapture=function(){return {...smCaptureBase(),roomLocation:{dim:ND.active,x:ndGX(p.x),z:ndGZ(p.z)}};};
const smCurrentBase=ubCurrentProfile;ubCurrentProfile=function(id){let q=smCurrentBase(id);if(COOP.role==='host'&&q?.player){q=smProfile(q);survivorProfiles[id]=q;}return q;};
function smSanitize(s,profile){let q=coopClone(s);delete q.survivalPlayers;delete q.unbound;delete q.dimensions;return {...q,mode:'survival',inventorySlots:profile.inventorySlots,equipment:profile.equipment,pendingInventory:[],inv:{},wear:{},hotbar:Array(9).fill('log'),selected:profile.selected,player:profile.player,health:profile.health,hunger:profile.hunger,air:profile.air,xp:profile.xp,achievement:profile.achievement,bedRespawn:profile.bedRespawn};}
coopServerWorld=function(profile){let s=smSanitize(survivalBase.saveState(),profile);if(ND.used||ND.active==='nether')s.dimensions={format:1,active:ND.active,worlds:Object.fromEntries(Object.entries(ND.worlds).map(([k,w])=>[k,k===ND.active||!w?null:smSanitize(w,profile)])),portals:coopClone(ND.portals),fires:coopClone(ND.fires)};s.roomSession=smScope();return s;};
const smSendBase=coopSend;coopSend=function(c,m){if(['state','blockPatch','pose','action','ack'].includes(m?.t)&&!m.roomScope)m={...m,roomScope:smScope()};return smSendBase(c,m);};
const smRestoreRaw=survivalBase.restore;
survivalBase.restore=function(s){if(COOP.role!=='client'||!s.roomSession)return smRestoreRaw(s);if(!COOP.applying)throw Error('Untrusted room restore');
 SM.applying=true;try{ndValidateEnvelope(s.dimensions,s);let e=s.dimensions;ndReset();if(e){ND.active=e.active;ND.worlds=coopClone(e.worlds);ND.portals=coopClone(e.portals);ND.fires=coopClone(e.fires);ND.used=true;ND.cooldown=10;ND.exitRequired=true;}SM.epoch=s.roomSession.epoch;SM.scope=coopClone(s.roomSession);sfWorkerStop();sfCancelJobs();SF.warm=null;smRestoreRaw(s);SM.loads++;}finally{SM.applying=false;}};
function smChanged(party=false){if(COOP.role!=='host')return;SM.epoch++;GF.pending.clear();GF.full=false;GF.netRevision=GF.applied=0;COOP.remote.clear();for(let c of COOP.connections.values())if(c.verified){let q=survivorProfiles[c.id];if(q){if(party){q.player=smNearHost();q.roomLocation={dim:ND.active,x:ndGX(p.x),z:ndGZ(p.z)};}survivorProfiles[c.id]=smProfile(q);COOP.remote.set(c.id,{id:c.id,name:c.name,...survivorProfiles[c.id].player});}c.smEpoch=0;c.smWait=false;}coopHostPush();}
function smWrapShift(fn){return function(...a){if(COOP.role==='client'&&!SM.applying)return;if(COOP.role==='host'&&!smCanSwitch())return;let ox=IW.ox,oz=IW.oz;let out=fn(...a);if(COOP.role==='host'&&(ox!==IW.ox||oz!==IW.oz))smChanged();return out;};}
iwShift=smWrapShift(iwShift);sfShift=smWrapShift(sfShift);
const smMaybeBase=iwMaybeStream;iwMaybeStream=function(){if(COOP.role==='client'){if(IW.enabled){p.x=Math.max(16,Math.min(W-16,p.x));p.z=Math.max(16,Math.min(W-16,p.z));}return;}if(COOP.role==='host'&&!smCanSwitch())return;return smMaybeBase();};
iwGuardCoop=function(){return !ND.busy&&!SF.loading;};
roomChatAvailable=function(){return started&&!!UB_ACCOUNT.current&&COOP.ready&&COOP.role!=='solo';};
const smSharedBase=coopSharedState;coopSharedState=function(){return {...smSharedBase(),roomScope:smScope(),dimensionPortals:coopClone(ND.portals),dimensionFires:coopClone(ND.fires),dimensionUsed:ND.used};};
const smStateBase=coopClientState;coopClientState=function(m){if(SM.loading||!smMatches(m.roomScope)){SM.rejected++;return;}smStateBase(m);if(m.dimensionPortals){ND.portals=coopClone(m.dimensionPortals);ND.fires=coopClone(m.dimensionFires||{});ND.used=!!m.dimensionUsed;}};
const smPatchBase=gfReceivePatch;gfReceivePatch=function(c,m){if(SM.loading||!smMatches(m.roomScope)){SM.rejected++;return;}return smPatchBase(c,m);};
coopHostPush=function(){if(COOP.role!=='host'||ND.busy||SM.switching)return;let state=null;for(let c of COOP.connections.values()){
 if(!c.verified||c.channel?.readyState!=='open'||c.stateSending||c.smSending||c.channel.bufferedAmount>128000)continue;
 if(c.smEpoch!==SM.epoch){if(c.smWait&&Date.now()-c.smSentAt<15000)continue;let profile=ubCurrentProfile(c.id);c.smSending=true;c.smWait=true;c.smSentAt=Date.now();coopSend(c,{t:'expeditionWorld',worldId:COOP.worldId,epoch:SM.epoch,world:coopServerWorld(profile),profile}).catch(e=>coopStatus(e.message)).finally(()=>c.smSending=false);continue;}
 state||=coopSharedState();c.stateSending=true;coopSend(c,state).catch(e=>coopStatus(e.message)).finally(()=>c.stateSending=false);
 }};
function smTrusted(c){return COOP.role==='client'&&!!c.hostIdentity&&gfActiveConnection(c);}
async function smLoad(c,m){if(!smTrusted(c)||m.worldId!==COOP.worldId||!Number.isSafeInteger(m.epoch)||m.epoch<SM.epoch||m.world?.roomSession?.epoch!==m.epoch||m.profile?.id!==survivorId)return;
 if(SM.loading)return;SM.loading=true;let wasPaused=paused;try{sfLoading('Synchronizing the shared expedition…');await new Promise(requestAnimationFrame);COOP.applying=true;survivalBase.restore(m.world);survivorApplyRecord(m.profile);survivorProfiles={[survivorId]:survivorCapture()};GF.applied=0;COOP.receivedState=0;COOP.remote.clear();COOP.ready=true;keys={};left=false;rightHeld=false;SM.scope=smScope();await coopSend(c,{t:'expeditionReady',epoch:SM.epoch});toast('Shared expedition synchronized · '+ND.active);}catch(e){COOP.ready=false;paused=true;coopStatus('World synchronization failed: '+e.message);}finally{COOP.applying=false;SM.loading=false;sfLoadingDone();activeUI='game';paused=wasPaused;}}
const smReceiveBase=coopReceive;
coopReceive=function(c,m){if(!m||typeof m!=='object')return;
 if(COOP.role==='host'&&c.verified){
  if(m.t==='expeditionReady'){if(m.epoch===SM.epoch){c.smEpoch=SM.epoch;c.smWait=false;}return;}
  if(m.t==='pose'&&(!smMatches(m.roomScope)||c.smEpoch!==SM.epoch||SM.switching)){SM.rejected++;return;}
  if(m.t==='expeditionTravel'){if(!smMatches(m.roomScope)||SM.switching||!smCanSwitch()||Date.now()-(c.smTravelAt||0)<10000)return;let record=survivorProfiles[c.id];if(m.death){if(ND.active!=='nether'||!(record?.health<=0))return;c.smTravelAt=Date.now();let hp=record.health,food=record.hunger;record.health=20;record.hunger=20;ndTravel(null,true).then(ok=>{if(!ok){record.health=hp;record.hunger=food;}}).catch(e=>coopStatus(e.message));return;}let q=ND.portals[m.portal],a=q&&ndLocal(q),pos=record?.player;if(!q||q.dim!==ND.active||!pos||!ndPortalValid(a,true))return;let along=a.axis==='x'?pos.x-a.x:pos.z-a.z,perp=a.axis==='x'?Math.abs(pos.z-a.z-.5):Math.abs(pos.x-a.x-.5);if(along<-.4||along>a.w+.4||perp>1||pos.y>a.y+a.h||pos.y+1.8<a.y)return;c.smTravelAt=Date.now();ndTravel(q).catch(e=>coopStatus(e.message));return;}
 }
 if(COOP.role==='client'){
  if(m.t==='expeditionWorld'){smLoad(c,m).catch(e=>coopStatus(e.message));return;}
  if((m.t==='state'||m.t==='blockPatch')&&(!smMatches(m.roomScope)||SM.loading)){SM.rejected++;return;}
  if(m.t==='init'&&m.world?.roomSession){c.smInitialEpoch=m.world.roomSession.epoch;}
 }
 smReceiveBase(c,m);
};
// The signed account proof/init path remains unchanged. A ready notice follows its synchronous restore.
const smPumpBase=coopPump;coopPump=function(){if(SM.loading||SM.switching)return;
 if(COOP.role==='client'&&COOP.ready){let c=[...COOP.connections.values()][0];if(c&&c.smInitialEpoch===SM.epoch){c.smInitialEpoch=0;coopSend(c,{t:'expeditionReady',epoch:SM.epoch}).catch(()=>{});}}
 return smPumpBase();};
const smTravelBase=ndTravel;
ndTravel=async function(portal,death=false){
 if(COOP.role==='client'){if(Date.now()-SM.travelAt>10000){SM.travelAt=Date.now();let c=[...COOP.connections.values()][0];await coopSend(c,{t:'expeditionTravel',portal:portal?.id,death:!!death,roomScope:smScope()});}return false;}
 if(COOP.role!=='host')return smTravelBase(portal,death);
 if(!smCanSwitch()||SM.switching){toast('Finish the pending room transaction before portal travel.');return false;}
 SM.switching=true;try{let ok=await smTravelBase(portal,death);if(ok){SM.switching=false;smChanged(true);return true;}return false;}finally{SM.switching=false;}
};
const smNdTickBase=ndTick;
ndTick=function(dt){if(COOP.role!=='client')return smNdTickBase(dt);if(paused||dead||!started||SM.loading)return;ND.cooldown=Math.max(0,ND.cooldown-dt);let touched=null;for(let q of Object.values(ND.portals)){if(q.dim!==ND.active)continue;let a=ndLocal(q),along=a.axis==='x'?p.x-a.x:p.z-a.z,perp=a.axis==='x'?Math.abs(p.z-a.z-.5):Math.abs(p.x-a.x-.5);if(along>-.2&&along<a.w+.2&&perp<.65&&p.y<a.y+a.h&&p.y+1.6>a.y)touched=q;}
 if(!touched){ND.dwell=0;ND.exitRequired=false;}else if(!ND.exitRequired&&ND.cooldown<=0){ND.dwell+=dt;if(ND.dwell>=4){ND.dwell=0;ndTravel(touched);}}
 let b=get(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z));if(b===ND_FIRE)hurt(2,'You burned in fire.',true);
};
// Keyboard ownership: never stop game handlers, only cancel browser defaults in the owned surface.
window.wbOwnKeyboard=function(e){let editable=e.target?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName);if(editable||ROOM_CHAT.open||!started||!UB_ACCOUNT.current||document.hidden)return;if(!['game','inventory','furnace','chest','pause','pauseDetails','guide','options'].includes(activeUI))return;if(e.cancelable)e.preventDefault();};
async function smImmersive(){try{if(document.fullscreenElement){navigator.keyboard?.unlock?.();await document.exitFullscreen();return;}await document.documentElement.requestFullscreen({keyboardLock:'browser'});try{await navigator.keyboard?.lock?.();}catch(e){toast('Fullscreen enabled; extended keyboard lock is unavailable in this browser.');}}catch(e){toast('Fullscreen keyboard capture was not allowed. Normal gameplay key capture remains active.');}}
let smButton=document.createElement('button');smButton.textContent='Fullscreen / keyboard capture';smButton.onclick=smImmersive;document.querySelector('#menu .row')?.appendChild(smButton);
let smPauseButton=smButton.cloneNode(true);smPauseButton.onclick=smImmersive;$('pauseMenu')?.querySelector('.panel')?.appendChild(smPauseButton);
const smStyle=document.createElement('style');smStyle.textContent='body{overscroll-behavior:none}canvas,#hud,.overlay{user-select:none;-webkit-user-select:none}input,textarea,[contenteditable=true]{user-select:text;-webkit-user-select:text}';document.head.appendChild(smStyle);
window.addEventListener('blur',()=>{keys={};left=false;rightHeld=false;attackQueued=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys={};left=false;rightHeld=false;attackQueued=false;}});

// Reference companion; active copy is embedded.
