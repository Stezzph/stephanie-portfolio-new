const enc=new TextEncoder();
function bytesToHex(bytes){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return bytesToHex(await crypto.subtle.sign('HMAC',key,enc.encode(value)))}
export async function onRequest(context){
  const cookie=context.request.headers.get('Cookie')||'';
  const token=(cookie.match(/(?:^|; )sr_session=([^;]+)/)||[])[1];
  let ok=false;
  if(token&&context.env.SWISSCOM_SESSION_SECRET){
    const [ts,sig]=token.split('.'); const age=Date.now()-Number(ts);
    if(ts&&sig&&age>=0&&age<1000*60*60*12){ok=(await sign(ts,context.env.SWISSCOM_SESSION_SECRET))===sig}
  }
  if(ok)return context.next();
  const u=new URL(context.request.url);u.pathname='/swisscom-login.html';u.search='';return Response.redirect(u.toString(),302);
}
