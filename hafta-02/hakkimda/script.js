
const baslik = document.querySelector("h1");
console.log(baslik);

console.log(baslik.textContent); 

baslik.textContent = "Merhaba, ben Elif 👋";

// script.js — sayfa tamamen yüklendikten sonra çalışır (script en altta olduğu için zaten güvenli)

const temaButon = document.querySelector("#tema-buton");
const govde = document.querySelector("body");

temaButon.addEventListener("click", function () {
  govde.classList.toggle("koyu-tema");

  // butonun kendi yazısını da duruma göre değiştirelim
  if (govde.classList.contains("koyu-tema")) {
    // classList.contains: o class ŞU AN var mı, true/false döner
    temaButon.textContent = "☀️ Aydınlık mod";
  } else {
    temaButon.textContent = "🌙 Karanlık mod";
  }
});


buton.addEventListener("click", function () {
  
  console.log("Butona tıklandı!");
});

const body = document.querySelector("body");

buton.addEventListener("click", function () {
  body.classList.toggle("koyu-tema");
  
});


