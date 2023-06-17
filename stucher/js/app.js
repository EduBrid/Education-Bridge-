// hada |==>vwith javascript
const btn1 = document.getElementById('translate');
const div1 = document.getElementById('toggle-traslate');

btn1.addEventListener("click", () => {
  if(div1.style.display ==="none"){
    div1.style.display ="block"
    div2.style.display ="none"
  }else{
    div1.style.display ="none"
  }
})

// =======================================================
//  had script fax katghd 3la EN or FR kadir hide l translate div
const en = document.getElementById('langEN');
const fr = document.getElementById('langFR');


en.addEventListener("click", () => {
  div1.style.display ="none"
})

fr.addEventListener("click", () => {
  div1.style.display ="none"
})