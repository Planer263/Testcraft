// Chat & Responsive Edits. Installed once before bootMods().
const GF={urgent:new Set(),versions:[],serial:0,netRevision:0,applied:0,pending:new Map(),full:false,stats:{urgentBuilds:0,staleRejected:0,patchesSent:0,patchesApplied:0}};
function gfWorldReset(){GF.urgent.clear();GF.versions=[];GF.serial++;GF.pending.clear();GF.netRevision=GF.applied=0;GF.full=false;}
function gfChanged(x,y,z,old,b,fluid){
 if(old===b)return;
 const xs=[x>>4],zs=[z>>4];if(x%16===0)xs.push((x>>4)-1);if(x%16===15)xs.push((x>>4)+1);if(z%16===0)zs.push((z>>4)-1);if(z%16===15)zs.push((z>>4)+1);
 for(let cz of zs)for(let cx of xs)if(cx>=0&&cz>=0&&cx<N&&cz<N){let i=cz*N+cx;GF.versions[i]=(GF.versions[i]||0)+1;dirty.add(i);if(!fluid||COOP.applying)GF.urgent.add(i);if(SF.meshJob?.i===i){SF.meshJob=null;}}
 if(COOP.role==='host'&&started&&!COOP.applying){GF.netRevision++;GF.pending.set(index(x,y,z),{x,y,z,b,r:GF.netRevision});if(GF.pending.size>4096){GF.pending.clear();GF.full=true;}}
}
function gfShiftGeometry(dx,dz){let next=new Set();for(let i of GF.urgent){let x=i%N-dx/16,z=Math.floor(i/N)-dz/16;if(x>=0&&z>=0&&x<N&&z<N)next.add(z*N+x);}GF.urgent=next;GF.versions=[];}
function gfBuildUrgent(){let begin=performance.now(),n=0;for(let i of GF.urgent){GF.urgent.delete(i);if(!residentChunks.has(i)&&!chunks[i])continue;if(SF.meshJob?.i===i)SF.meshJob=null;mesh(i,true);dirty.delete(i);GF.stats.urgentBuilds++;if(++n>=4||performance.now()-begin>=8)break;}}
function gfActiveConnection(c){return !!c&&COOP.connections.get(c.token)===c&&c.channel?.readyState==='open';}
function gfTrustedHost(c){return COOP.role==='client'&&COOP.ready&&!!c.hostIdentity&&gfActiveConnection(c);}
function gfFlushPatches(){
 if(COOP.role!=='host')return;
 if(GF.full){GF.full=false;GF.pending.clear();coopHostPush();return;}
 if(!GF.pending.size)return;
 let all=[...GF.pending.values()].sort((a,b)=>a.r-b.r);GF.pending.clear();
 for(let k=0;k<all.length;k+=128){let batch=all.slice(k,k+128),packet={t:'blockPatch',worldId:COOP.worldId,blockRevision:batch[batch.length-1].r,changes:batch.map(v=>({...v,s:blockShapes[key3(v.x,v.y,v.z)]??null,d:blockDirections[key3(v.x,v.y,v.z)]??null}))};for(let c of COOP.connections.values())if(c.verified&&gfActiveConnection(c))coopSend(c,packet).catch(e=>coopStatus(e.message));GF.stats.patchesSent++;}
}
function gfReceivePatch(c,m){
 if(!gfTrustedHost(c)||m.worldId!==COOP.worldId||!Number.isSafeInteger(m.blockRevision)||m.blockRevision<=GF.applied||!Array.isArray(m.changes)||m.changes.length>128)return;
 if(!m.changes.every(v=>v&&[v.x,v.y,v.z,v.b].every(Number.isInteger)&&v.x>=0&&v.x<W&&v.z>=0&&v.z<W&&v.y>=1&&v.y<H&&(v.b===0||!!D[v.b])))return;
 let applying=COOP.applying;COOP.applying=true;try{for(let v of m.changes){let old=get(v.x,v.y,v.z);if(old!==v.b)set(v.x,v.y,v.z,v.b,true,true);let k=key3(v.x,v.y,v.z);if(D[v.b]?.shape==='slab'&&(v.s===0||v.s===1))blockShapes[k]=v.s;if((D[v.b]?.javaShape||D[v.b]?.farmKind==='gate')&&Number.isInteger(v.d)&&v.d>=0&&v.d<4)blockDirections[k]=v.d;mark(v.x,v.z);}GF.applied=m.blockRevision;GF.stats.patchesApplied++;}finally{COOP.applying=applying;}
}
const ROOM_CHAT={open:false,log:[],seen:new Set(),rates:new Map(),scope:'',lastSend:0,pointerGrace:0};
function roomChatAvailable(){return started&&!!UB_ACCOUNT.current&&COOP.ready&&COOP.role!=='solo'&&!IW.enabled&&!ND.used;}
function roomChatText(value){if(typeof value!=='string'||value.length>256)return null;let text=value.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim();return text&&text.length<=256?text:null;}
function roomChatRate(id){let now=performance.now(),r=ROOM_CHAT.rates.get(id)||[];r=r.filter(t=>now-t<10000);if(r.length>=5)return false;r.push(now);ROOM_CHAT.rates.set(id,r);return true;}
function roomChatReset(){ROOM_CHAT.open=false;ROOM_CHAT.log=[];ROOM_CHAT.seen.clear();ROOM_CHAT.rates.clear();ROOM_CHAT.scope='';$('roomChatInput').blur();$('roomChatInput').value='';$('roomChatPanel').classList.add('hidden');$('roomChatHud').replaceChildren();$('roomChatLog').replaceChildren();}
function roomChatLine(q){let row=document.createElement('div'),name=document.createElement('span'),text=document.createElement('span');row.className='roomChatLine';row.dataset.chatId=q.id;name.className='roomChatName';name.textContent=q.name+': ';text.textContent=q.text;row.append(name,text);return row;}
function roomChatRender(){let log=$('roomChatLog'),bottom=log.scrollHeight-log.scrollTop-log.clientHeight<40;log.replaceChildren(...ROOM_CHAT.log.map(roomChatLine));if(bottom||ROOM_CHAT.open)log.scrollTop=log.scrollHeight;let hud=$('roomChatHud');hud.replaceChildren(...ROOM_CHAT.log.slice(-6).filter(q=>performance.now()-q.arrived<12000).map(roomChatLine));}
function roomChatAppend(q){if(ROOM_CHAT.seen.has(q.id))return;ROOM_CHAT.seen.add(q.id);if(ROOM_CHAT.seen.size>256)ROOM_CHAT.seen.delete(ROOM_CHAT.seen.values().next().value);ROOM_CHAT.log.push({...q,arrived:performance.now()});ROOM_CHAT.log=ROOM_CHAT.log.slice(-100);roomChatRender();}
function roomChatPublish(id,name,text){let q={t:'chatMessage',worldId:COOP.worldId,id:crypto.randomUUID(),sender:id,name,text,time:Date.now()};roomChatAppend(q);for(let c of COOP.connections.values())if(c.verified&&gfActiveConnection(c))coopSend(c,q).catch(e=>coopStatus(e.message));}
function roomChatHost(c,m){
 if(!c.verified||!gfActiveConnection(c)||!roomChatAvailable()||m.worldId!==COOP.worldId)return;
 let text=roomChatText(m.text);if(!text||typeof m.id!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(m.id))return;
 c.chatSeen||=new Set();if(c.chatSeen.has(m.id))return;c.chatSeen.add(m.id);if(c.chatSeen.size>64)c.chatSeen.delete(c.chatSeen.values().next().value);
 if(!roomChatRate(c.id)){coopSend(c,{t:'chatNotice',worldId:COOP.worldId,message:'Slow down: at most five messages per ten seconds.'}).catch(()=>{});return;}
 roomChatPublish(c.id,c.name,text);
}
function roomChatReceive(c,m){
 if(!gfTrustedHost(c)||m.worldId!==COOP.worldId)return;
 if(m.t==='chatNotice'){if(typeof m.message==='string'&&m.message.length<=160)$('roomChatStatus').textContent=m.message;return;}
 let text=roomChatText(m.text);if(!text||typeof m.id!=='string'||m.id.length>100||typeof m.name!=='string'||!/^[A-Za-z0-9 _-]{1,24}$/.test(m.name)||typeof m.sender!=='string'||m.sender.length>100)return;
 roomChatAppend({...m,text});$('roomChatStatus').textContent='T / Enter: open · Enter: send · Esc: close · room-only, not saved';
}
function roomChatOpen(){
 if(!roomChatAvailable()||dead||SF.loading){toast('Room chat is available after joining or hosting a finite co-op world.');return false;}
 closeCarried();returnGrid();hidePauseScreens();for(let id of ['menu','inventory','guide','optionsPanel','coopPanel'])$(id).classList.add('hidden');ROOM_CHAT.scope=COOP.worldId+':'+SHORT_ROOM.code;ROOM_CHAT.open=true;ROOM_CHAT.pointerGrace=performance.now()+250;keys={};left=false;rightHeld=false;drag=false;attackQueued=false;paused=false;activeUI='game';document.exitPointerLock?.();$('roomChatPanel').classList.remove('hidden');$('roomChatHud').classList.add('hidden');roomChatRender();$('roomChatInput').focus();return true;
}
function roomChatClose(resume=true){ROOM_CHAT.open=false;ROOM_CHAT.pointerGrace=performance.now()+250;$('roomChatInput').blur();$('roomChatPanel').classList.add('hidden');keys={};left=false;rightHeld=false;attackQueued=false;if(resume&&started&&!dead)lock();}
function roomChatSend(){
 if(!roomChatAvailable()){roomChatClose(false);return;}
 let input=$('roomChatInput'),text=roomChatText(input.value);if(!text)return;
 if(COOP.role==='host'){if(!roomChatRate(UB_ACCOUNT.current.id)){$('roomChatStatus').textContent='Slow down: at most five messages per ten seconds.';return;}roomChatPublish(UB_ACCOUNT.current.id,UB_ACCOUNT.current.name,text);input.value='';}
 else{let c=[...COOP.connections.values()][0];if(!gfTrustedHost(c))return;coopSend(c,{t:'chat',worldId:COOP.worldId,id:crypto.randomUUID(),text}).then(ok=>{if(!ok)$('roomChatStatus').textContent='Not sent: disconnected.';}).catch(()=>{$('roomChatStatus').textContent='Message could not be sent.';});input.value='';}
 input.focus();
}
function roomChatTick(){
 let scope=COOP.worldId+':'+SHORT_ROOM.code;if(COOP.role==='solo'||ROOM_CHAT.scope&&ROOM_CHAT.scope!==scope){roomChatReset();return;}ROOM_CHAT.scope=scope;
 if(ROOM_CHAT.open&&(!roomChatAvailable()||dead||paused||activeUI!=='game'))roomChatClose(false);
 $('roomChatHud').classList.toggle('hidden',ROOM_CHAT.open||!roomChatAvailable()||activeUI!=='game'||!hudVisible);
 if(!ROOM_CHAT.open){for(let el of [...$('roomChatHud').children]){let q=ROOM_CHAT.log.find(q=>q.id===el.dataset.chatId);if(q&&performance.now()-q.arrived>=12000)el.remove();}}
}
$('roomChatForm').addEventListener('submit',e=>{e.preventDefault();roomChatSend();});$('roomChatClose').onclick=()=>roomChatClose();$('roomChatButton').onclick=roomChatOpen;
window.addEventListener('keydown',e=>{if(ROOM_CHAT.open){e.stopImmediatePropagation();if(e.isComposing||e.keyCode===229)return;if(e.code==='Escape'){e.preventDefault();roomChatClose();}else if(e.code==='Enter'&&!e.repeat){e.preventDefault();roomChatSend();}return;}if(e.repeat||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||e.target.isContentEditable)return;if((e.code==='KeyT'||e.code==='Enter')&&roomChatAvailable()&&!paused&&activeUI==='game'){e.preventDefault();e.stopImmediatePropagation();roomChatOpen();}},true);
window.addEventListener('keyup',e=>{if(ROOM_CHAT.open){e.stopImmediatePropagation();keys={};}},true);
window.addEventListener('wheel',e=>{if(ROOM_CHAT.open)e.stopImmediatePropagation();},{capture:true,passive:true});
setInterval(roomChatTick,250);

// Reference companion only; active runtime is embedded.
