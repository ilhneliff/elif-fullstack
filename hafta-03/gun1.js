const isim="Elif";
let yas = 22;

console.log(isim, yas);

function topla(a, b) {
  return a + b;
}


const topla2 = (a, b) => {
  return a + b;
};


const topla3 = (a, b) => a + b;

console.log(topla(2, 3));   
console.log(topla2(2, 3));  
console.log(topla3(2, 3));  

const kareAl = (x) => x * x;
console.log(kareAl(5));

const mesaj = `Merhaba ben ${isim} ve ${yas} yaşındayım.`;
console.log(mesaj);

const kullanici = { ad: "Elif", sehir: "İstanbul", meslek: "Mühendis" };

const adEski = kullanici.ad;
const sehirEski = kullanici.sehir;

const { ad, sehir } = kullanici;
console.log(ad, sehir); 

const renkler = ["kırmızı", "yeşil", "mavi"];
const [ilkRenk, ikinciRenk] = renkler;
console.log(ilkRenk, ikinciRenk); 
const kullaniciBilgisiYaz = ({ ad, sehir }) => {
  
  console.log(`${ad}, ${sehir} şehrinde yaşıyor.`);
};

kullaniciBilgisiYaz(kullanici); 