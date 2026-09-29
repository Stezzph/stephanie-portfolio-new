const enc=new TextEncoder();
function bytesToHex(bytes){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return bytesToHex(await crypto.subtle.sign('HMAC',key,enc.encode(value)))}
export async function onRequestPost({request,env}){
  const form=await request.formData(); const password=String(form.get('password')||'');
  if(!env.SWISSCOM_PASSWORD||!env.SWISSCOM_SESSION_SECRET)return new Response('Server configuration missing',{status:500});
  if(password!==env.SWISSCOM_PASSWORD)return Response.redirect(new URL('/swisscom-login.html?error=1',request.url).toString(),303);
  const ts=String(Date.now()); const sig=await sign(ts,env.SWISSCOM_SESSION_SECRET);
  return new Response(null,{status:303,headers:{'Location':'/swisscom/','Set-Cookie':`sr_session=${ts}.${sig}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`}});
}
