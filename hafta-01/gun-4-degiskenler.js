console.log("merhaba ben kod yazıyorum");

let isim = "Elif";

const dogumYili = 2003;

console.log(isim);
console.log(dogumYili);

isim = "Elif İ.";
console.log(isim);

let sehir = "İstanbul";
let yas = 22;
let ogrenciMi = true;

console.log(typeof sehir);
console.log(typeof yas);
console.log(typeof ogrenciMi);

let ad = "Elif";
let soyad = "İlhanoğulları";

let tamAd1 = ad + " " + soyad;
console.log(tamAd1);

let tamAd2 = `${ad} ${soyad}`;
console.log(tamAd2);


console.log(`Benim adım ${ad} ${soyad} ve ben ${yas} yaşındayım.`);

sehir = "Ankara";
console.log(sehir);
sehir = "İzmir";
console.log(sehir);

const ulke = "Türkiye";
console.log(ulke);

const a = 12;
const b = 30;
const toplam = a + b;
console.log(toplam);

const kIsim = "Elif";
const kYas = 26;
const kMeslek = "Bilgisayar Mühendisi";
const kSehir = "İstanbul";

console.log(`
Kimlik Kartı
------------
İsim: ${kIsim}
Yaş: ${kYas}
Meslek: ${kMeslek}
Şehir: ${kSehir}
`);