export async function requestJson(url){
    const res = await fetch(url);
    if(!res.ok)
      return null;
  
    return await res.json();
  }
  