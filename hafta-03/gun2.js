const sayilar = [1, 2, 3, 4, 5];
const yeni = sayilar.map((sayi) => sayi * 2);
console.log(yeni);

const kullanicilar = [
    {ad: "Elif",yas:22},
    {ad:"Ertan",yas:29},
    {ad:"Zeynep",yas:28}
]
const adlar = kullanicilar.map((kullanici) => kullanici.ad);
console.log(adlar);

const sayilar2 = [3,8,12,56,43,89];
const ciftsayilar = sayilar2.filter((sayi) => sayi % 2 === 0);
console.log(ciftsayilar);

const Elif = kullanicilar.find((kullanici) => kullanici.ad === "Elif");
console.log(Elif);

const sayilar3 = [4, 8, 15, 16, 23, 42];

const toplam = sayilar3.reduce((birikenDeger, guncelDeger) => {
  
  return birikenDeger + guncelDeger;
}, 0);

console.log(toplam);

const sepet = [
  { urun: "kalem", fiyat: 10 },
  { urun: "defter", fiyat: 25 },
  { urun: "silgi", fiyat: 5 },
];
const toplamdeger = sepet.reduce((toplam, oge) => toplam + oge.fiyat,0);
console.log(toplamdeger);

// önce çiftleri filtrele, sonra ikiyle çarp, sonra topla — hepsi tek satırda
const sonuc = [4, 8, 15, 16, 23, 42]
  .filter((sayi) => sayi % 2 === 0)  
  .map((sayi) => sayi * 2)           
  .reduce((toplam, sayi) => toplam + sayi, 0); 

console.log(sonuc); // 140
