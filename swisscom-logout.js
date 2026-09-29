export async function onRequestPost({request}){return new Response(null,{status:303,headers:{'Location':'/','Set-Cookie':'sr_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'}})}
