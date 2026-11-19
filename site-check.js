window.hostingCheckResults=null;
async function runHostingChecks(){
 const results=[];function result(name,ok,detail=''){results.push({name,pass:!!ok,detail});}async function test(name,fn){try{let detail=await fn();result(name,true,detail||'');}catch(e){result(name,false,e.message);}}
 result('Secure context / account cryptography',isSecureContext&&!!crypto.subtle,'HTTPS or localhost is required');
 result('WebRTC available',typeof RTCPeerConnection==='function','Capability only; internet peer connectivity not tested');
 result('Web Locks available',!!navigator.locks,'Required for the isolated preview coordinator, not the native game');
 result('BroadcastChannel available',typeof BroadcastChannel==='function','Same-browser-profile preview signaling only');
 await test('Temporary localStorage write/read/remove',async()=>{let k='wb-pages-probe:'+crypto.randomUUID();try{localStorage.setItem(k,'ok');if(localStorage.getItem(k)!=='ok')throw Error('Storage readback failed');}finally{localStorage.removeItem(k);}return 'No existing keys touched';});
 await test('Temporary IndexedDB write/read/delete',()=>new Promise((ok,no)=>{
  let name='wb-pages-probe:'+crypto.randomUUID(),db=null,done=false,t=setTimeout(()=>finish(Error('IndexedDB probe timeout')),6000);
  function finish(e){if(done)return;done=true;clearTimeout(t);db?.close();e?no(e):ok('Temporary probe database removed');}
  let open=indexedDB.open(name,1);open.onupgradeneeded=()=>open.result.createObjectStore('probe');open.onerror=()=>finish(open.error);
  open.onsuccess=()=>{db=open.result;db.onversionchange=()=>db.close();let write=db.transaction('probe','readwrite');write.objectStore('probe').put('ok','value');write.onerror=()=>finish(write.error);write.oncomplete=()=>{
   let read=db.transaction('probe','readonly'),matched=false,get=read.objectStore('probe').get('value');get.onsuccess=()=>{matched=get.result==='ok';};read.onerror=()=>finish(read.error);read.oncomplete=()=>{
    db.close();let del=indexedDB.deleteDatabase(name);del.onerror=()=>finish(del.error);del.onsuccess=()=>finish(matched?null:Error('Storage readback failed'));
   };
  };};
 }));
 await test('Embedded Blob Web Worker',()=>new Promise((ok,no)=>{let url=URL.createObjectURL(new Blob(['onmessage=e=>postMessage(e.data+1)'],{type:'text/javascript'})),w=null;let t=setTimeout(()=>done(Error('Worker timed out')),4000);function done(error){clearTimeout(t);w?.terminate();URL.revokeObjectURL(url);error?no(error):ok('Worker message round-trip passed');}try{w=new Worker(url);w.onmessage=e=>done(e.data===42?null:Error('Unexpected worker response'));w.onerror=e=>done(Error(e.message||'Worker failed'));w.postMessage(41);}catch(e){done(e);}}));
 await test('WebGL context',async()=>{let cv=document.createElement('canvas'),gl=cv.getContext('webgl');if(!gl)throw Error('WebGL unavailable');gl.getExtension('WEBGL_lose_context')?.loseContext();return 'Capability only; no FPS/hardware benchmark';});
 for(let path of ['index.html','manifest.json','.nojekyll','sector-authority/multi-window.html','sector-authority/sector-room.js','sector-authority/sector-authority-core.js','sector-authority/game-content-config.json','sector-authority/PAGES-PREVIEW-TESTS.json'])await test('Static file: '+path,async()=>{let r=await fetch(new URL(path,location.href),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);if(path.endsWith('.json'))await r.json();else{let s=await r.text();if(path!=='.nojekyll'&&!s.length)throw Error('Empty response');}return 'HTTP '+r.status;});
 const out={release:'wildblock-pages-preview-1',basePath:location.pathname.replace(/site-check\.html$/,''),checkedAt:new Date().toISOString(),scope:'Local capabilities and same-site static paths only',results,allPassed:results.every(r=>r.pass),notTested:['Public PeerJS signaling/STUN/TURN','Real remote devices/NAT/firewalls','Native independent sector multiplayer','Production hardware performance']};window.hostingCheckResults=out;document.getElementById('results').textContent=JSON.stringify(out,null,2);return out;
}
document.getElementById('run').onclick=async()=>{let b=document.getElementById('run');b.disabled=true;try{await runHostingChecks();}finally{b.disabled=false;}};
document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('results').textContent);}catch(e){document.getElementById('results').focus();alert('Clipboard unavailable. Select and copy the visible results.');}};
