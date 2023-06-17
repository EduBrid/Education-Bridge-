// =======================================================
// hada bax dir show ldok div ila dghdti 3la profile ico OR translate icon|==> with Jquery

// $(document).ready(function(){
//     $("#translate").click(function(){
//     $(".toggle-traslate").toggle();
//       });
//     });
// $(document).ready(function(){
//     $("#profile").click(function(){
//     $(".toggle-profile").toggle();
//       });
//     });


// =======================================================
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

// ===========> when you click on edit btn to change password:

const btn_passChang = document.getElementById('btn_passEdit');
const div_passChang = document.getElementById('div_passChang');

const btn_passCancel = document.getElementById('btn_passCancel');
const div_passCancel = document.getElementById('password-edit-fields');



btn_passChang.addEventListener("click", () => {
  div_passChang.style.display ="none"
  div_passCancel.style.display ="block"
  console.log('01')
})


btn_passCancel.addEventListener("click", () => {
  div_passCancel.style.display ="none"
  div_passChang.style.display ="flex"
  console.log('02')
})


