
function build_button(remote="",button_name="",button="")
{
 function decodeHtmlEntities(str)
 {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = str;
  return tempElement.textContent || tempElement.innerText;
 }
 if(button_name==="")
 {
  const dom=document.createElement('div')
  dom.className="empty";
  return dom;
 }
 const common="('"+remote+"','"+button+"',this,event)"
 const presshold="presshold"+common;
 const release="release"+common;
 const dom=document.createElement('button')
 dom.className="button";
 dom.onpointerdown=presshold;
 dom.onpointerup=release;
 dom.onpointerleave=release;
 dom.innerHTML=decodeHtmlEntities(button)
 return dom;
}
