# Hafta 3 — Modern JS + fetch (Faz 1)

> **Hedef:** ES6 sözdizimini, dizi metotlarını ve asenkron JavaScript'i öğrenip bir API'den gerçek veri çekmek
> **Çıktı:** ✔ 🌐 API tüketen canlı mini app
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Hafta 2'de sayfa çizmeyi öğrendin: HTML, CSS, temel DOM. Bu hafta JavaScript'i "olgun" hale getiriyoruz — modern sözdizimi (ES6), diziyle çalışmanın döngüsüz yolu, ve en kritik kavram: **asenkron kod**. Hafta sonunda bir internet API'sinden gerçek veri çekip ekrana basan, canlı bir mini uygulaman olacak. Bu, backend'den veri almanın "ilk provası" — Hafta 8-10'da kendi backend'ini yazınca aynı deseni kullanacaksın.

**Çalışma klasörün:** `hafta-03/` altında her gün için küçük deneme dosyaları (`gun1.js`, `gun2.js`...) kullanacağız — bunları Node ile çalıştıracaksın (Hafta 1'de kurmuştun). Gün 6'daki mini proje ayrı bir klasörde (`hafta-03/mini-app/`) olacak.

```bash
cd ~/elif-fullstack/hafta-03
node gun1.js
# Node: JavaScript'i tarayıcı dışında, terminalde çalıştırmanı sağlayan araç
```

---

## Gün 1 — ES6: const/let, Arrow Function, Template Literal, Destructuring

### 0:00–1:00 · const ve let (var'ı unut)

Eski JavaScript'te değişken tanımlamak için `var` kullanılırdı — artık kullanmıyoruz, çünkü `var` beklenmedik yerlerde "sızabiliyor" (scope kuralları gevşek). Modern JS'te sadece iki kelime yeter:

```js
// gun1.js

const isim = "Elif";
// const: değeri BİR KERE atanır, bir daha DEĞİŞTİRİLEMEZ
// isim = "Ayşe"; // ❌ HATA VERİR: "Assignment to constant variable"

let yas = 25;
// let: değeri sonradan değiştirilebilir
yas = 26; // ✅ sorun yok

console.log(isim, yas);
```

💡 **Kural:** Varsayılan olarak hep `const` kullan. Değeri gerçekten değişecekse (sayaç, biriktirme, döngü) `let`'e geç. Bu alışkanlık, kodunda "bu değer sabit mi değişken mi" sorusunu okuyana anında söyler — hataları da erkenden yakalatır (yanlışlıkla değiştirmeye çalışırsan JS seni uyarır).

`const` ile tanımlanan bir **dizi ya da nesnenin içeriği** yine de değişebilir — değişmeyen şey, değişkenin hangi diziye/nesneye "işaret ettiği":

```js
const meyveler = ["elma", "armut"];
meyveler.push("muz"); // ✅ çalışır — diziNİN İÇERİĞİ değişti, diziNİN KENDİSİ değişmedi
console.log(meyveler); // ["elma", "armut", "muz"]

// meyveler = ["baska", "dizi"]; // ❌ HATA — meyveler'i BAŞKA bir diziye atayamazsın
```

### 1:00–2:00 · Arrow function (() =>)

Fonksiyon yazmanın kısa, modern yolu. Hafta 1'de `function isimHesapla() {}` şeklini gördün — arrow function aynı işi daha az yazarak yapar:

```js
// ESKİ YOL (Hafta 1'de gördüğün):
function topla(a, b) {
  return a + b;
}

// YENİ YOL — arrow function:
const topla2 = (a, b) => {
  return a + b;
};

// TEK SATIRLIK gövdelerde daha da kısalır — {} ve return kalkar, otomatik döner:
const topla3 = (a, b) => a + b;

console.log(topla(2, 3));   // 5
console.log(topla2(2, 3));  // 5
console.log(topla3(2, 3));  // 5 — üçü de aynı işi yapıyor
```

Tek parametreli fonksiyonlarda parantez de opsiyonel (ama okunabilirlik için genelde bırakılır):

```js
const kareAl = (x) => x * x;
// const kareAl = x => x * x;  // bu da geçerli, parantezsiz

console.log(kareAl(5)); // 25
```

💡 Arrow function'ı en çok nerede göreceksin? Dizi metotlarının içinde (bugünkü son bölüme, yarın da tamamına bakacağız) ve event listener'larda:

```js
// Hafta 2'de böyle yazmıştık:
buton.addEventListener("click", function () {
  console.log("tıklandı");
});

// Arrow function ile:
buton.addEventListener("click", () => {
  console.log("tıklandı");
});
// İşlev aynı, sözdizimi daha modern. İkisini de göreceksin ama arrow'u tercih et.
```

### 2:00–3:00 · Template literal ve destructuring

**Template literal:** String'lerin içine değişken gömmenin temiz yolu — artık `+` ile birleştirmiyoruz.

```js
const isim = "Elif";
const yas = 25;

// ESKİ YOL:
const mesajEski = "Merhaba, ben " + isim + " ve " + yas + " yaşındayım.";

// YENİ YOL — template literal (backtick ` kullanılır, tırnak değil!):
const mesajYeni = `Merhaba, ben ${isim} ve ${yas} yaşındayım.`;
// ${...} içine HERHANGİ bir JS ifadesi yazabilirsin, sadece değişken değil:
const mesaj2 = `Yıl sonunda ${yas + 1} yaşında olacağım.`;

console.log(mesajYeni);
console.log(mesaj2);

// Çok satırlı string de artık kolay:
const cokSatirli = `
  Satır 1
  Satır 2
`;
console.log(cokSatirli);
```

**Destructuring (yapısını bozma):** Bir nesnenin ya da dizinin içindeki değerleri tek tek değişkenlere "çekmenin" kısa yolu.

```js
// NESNE destructuring:
const kullanici = { ad: "Elif", sehir: "İstanbul", meslek: "Geliştirici" };

// ESKİ YOL:
const adEski = kullanici.ad;
const sehirEski = kullanici.sehir;

// YENİ YOL — tek satırda, nesnenin ANAHTAR isimleriyle eşleşen değişkenler oluşur:
const { ad, sehir } = kullanici;
console.log(ad, sehir); // "Elif" "İstanbul"

// DİZİ destructuring:
const renkler = ["kırmızı", "mavi", "yeşil"];

// ESKİ YOL:
const ilkEski = renkler[0];
const ikinciEski = renkler[1];

// YENİ YOL — sıraya göre eşleşir:
const [ilk, ikinci] = renkler;
console.log(ilk, ikinci); // "kırmızı" "mavi"
```

💡 Destructuring'i en çok fonksiyon parametrelerinde göreceksin — bir nesne parametre olarak gelir, direkt destructure edilir:

```js
const kullaniciBilgisiYaz = ({ ad, sehir }) => {
  // fonksiyona bir nesne gelir, hemen içinden ad ve sehir'i çekeriz
  console.log(`${ad}, ${sehir} şehrinde yaşıyor.`);
};

kullaniciBilgisiYaz(kullanici); // "Elif, İstanbul şehrinde yaşıyor."
```

**Küçük zafer:** Hafta 1'in "eski" JS'ini artık modern, kısa, endüstri standardı sözdizimine çevirebiliyorsun.
**Terim defteri:** `const/let`, `arrow function`, `template literal`, `destructuring`
**Çıktı:** `gun1.js` — çalışan, yorumlu örnekler.
**Commit:** `git commit -m "hafta-03 g1: es6 - const/let, arrow fn, template literal, destructuring"`

---

## Gün 2 — Dizi Metotları: map, filter, find, reduce

### 0:00–1:00 · Neden döngü yerine dizi metotları?

Hafta 1'de `for` döngüsüyle dizi gezmeyi gördün. Modern JS'te bir diziyi "dönüştürmek", "elemek", "aramak" ya da "toplamak" istediğinde artık `for` yerine **hazır dizi metotları** kullanılır — daha kısa, daha az hata yapılır, niyetin daha net okunur.

Fark şu: `for` döngüsü "nasıl yapacağını" adım adım anlatır. Dizi metotları "ne istediğini" söyler.

```js
// gun2.js

const sayilar = [4, 8, 15, 16, 23, 42];

// ESKİ YOL — for döngüsüyle her sayıyı ikiyle çarpıp yeni diziye ekleme:
const ikiKatiEski = [];
for (let i = 0; i < sayilar.length; i++) {
  ikiKatiEski.push(sayilar[i] * 2);
}
console.log(ikiKatiEski); // [8, 16, 30, 32, 46, 84]
```

Bu, `.map()` metoduyla tek satırda yapılabilir — bugün onu göreceğiz.

### 1:00–2:00 · .map() ve .filter()

**`.map()`** — diziyi **dönüştürür**: her elemanı bir kurala göre değiştirip AYNI UZUNLUKTA yeni bir dizi döner.

```js
const sayilar = [4, 8, 15, 16, 23, 42];

const ikiKati = sayilar.map((sayi) => sayi * 2);
// map, dizideki HER elemanı sırayla arrow function'a verir,
// fonksiyonun döndürdüğü değerlerden YENİ bir dizi oluşturur
console.log(ikiKati); // [8, 16, 30, 32, 46, 84]

// gerçekçi örnek — nesne dizisinden sadece isimleri çekmek:
const kullanicilar = [
  { ad: "Elif", yas: 25 },
  { ad: "Can", yas: 30 },
  { ad: "Ayşe", yas: 22 },
];

const isimler = kullanicilar.map((kullanici) => kullanici.ad);
console.log(isimler); // ["Elif", "Can", "Ayşe"]
```

**`.filter()`** — diziyi **eler**: bir kurala UYAN elemanları tutar, geri kalanı atar. Sonuç orijinalden KISA (ya da eşit) uzunlukta bir dizidir.

```js
const sayilar = [4, 8, 15, 16, 23, 42];

const ciftler = sayilar.filter((sayi) => sayi % 2 === 0);
// filter, fonksiyon TRUE dönerse elemanı TUTAR, FALSE dönerse ATAR
// sayi % 2 === 0  →  "sayı 2'ye tam bölünüyor mu" (çift mi)
console.log(ciftler); // [4, 8, 16, 42]

const yirmiUstu = kullanicilar.filter((kullanici) => kullanici.yas > 25);
console.log(yirmiUstu); // [{ ad: "Can", yas: 30 }]
```

💡 `.map()` ve `.filter()` **orijinal diziyi değiştirmez**, hep YENİ bir dizi döner. Bu önemli — `sayilar` değişkeni hâlâ `[4, 8, 15, 16, 23, 42]`, değişmedi.

### 2:00–3:00 · .find() ve .reduce()

**`.find()`** — kurala uyan **İLK TEK elemanı** bulur (dizi değil, tek eleman döner). Bulamazsa `undefined` döner.

```js
const kullanicilar = [
  { ad: "Elif", yas: 25 },
  { ad: "Can", yas: 30 },
  { ad: "Ayşe", yas: 22 },
];

const can = kullanicilar.find((kullanici) => kullanici.ad === "Can");
console.log(can); // { ad: "Can", yas: 30 }

const yokAdli = kullanicilar.find((kullanici) => kullanici.ad === "Mehmet");
console.log(yokAdli); // undefined — böyle biri yok
```

**`.reduce()`** — en güçlü ama ilk anda en kafa karıştıran metot. Diziyi **tek bir değere** "indirger" (topla, çarp, birleştir, say...).

```js
const sayilar = [4, 8, 15, 16, 23, 42];

const toplam = sayilar.reduce((birikenDeger, guncelDeger) => {
  // her adımda: birikenDeger = şu ana kadarki sonuç, guncelDeger = dizinin şu anki elemanı
  return birikenDeger + guncelDeger;
}, 0);
// son parametre olan 0 → başlangıç değeri (biriken değerin ilk hali)

console.log(toplam); // 108

// adım adım ne oluyor:
// birikenDeger=0, guncelDeger=4   → döner 4
// birikenDeger=4, guncelDeger=8   → döner 12
// birikenDeger=12, guncelDeger=15 → döner 27
// ... ve böyle devam eder, sonunda 108
```

Gerçekçi örnek — sepetteki ürünlerin toplam fiyatı:

```js
const sepet = [
  { urun: "kalem", fiyat: 10 },
  { urun: "defter", fiyat: 25 },
  { urun: "silgi", fiyat: 5 },
];

const toplamFiyat = sepet.reduce((toplam, oge) => toplam + oge.fiyat, 0);
console.log(toplamFiyat); // 40
```

Hepsini zincirlemek de mümkün — bu, modern JS'in en güçlü yanlarından biri:

```js
// önce çiftleri filtrele, sonra ikiyle çarp, sonra topla — hepsi tek satırda
const sonuc = [4, 8, 15, 16, 23, 42]
  .filter((sayi) => sayi % 2 === 0)  // [4, 8, 16, 42]
  .map((sayi) => sayi * 2)            // [8, 16, 32, 84]
  .reduce((toplam, sayi) => toplam + sayi, 0); // 140

console.log(sonuc); // 140
```

💡 Hangisini kullanacağını unutursan şu soruyu sor: "Aynı sayıda ama dönüştürülmüş dizi mi istiyorum? → `map`. Daha az elemanlı dizi mi istiyorum? → `filter`. Tek bir eleman mı istiyorum? → `find`. Tek bir sayı/değer mi istiyorum? → `reduce`."

**Küçük zafer:** Artık bir diziyle "ne yapmak istediğini" tek satırda, döngü yazmadan ifade edebiliyorsun.
**Terim defteri:** `.map()`, `.filter()`, `.find()`, `.reduce()`, `method chaining (zincirleme)`
**Çıktı:** `gun2.js` — dört metodun da çalışan örnekleri.
**Commit:** `git commit -m "hafta-03 g2: dizi metotlari - map filter find reduce"`

---

## Gün 3 — Asenkron Kavramı

### 0:00–1:00 · Senkron vs asenkron

Şu ana kadar yazdığın her kod **senkron** çalıştı — yani JS, bir satırı bitirmeden bir sonrakine geçmedi. Sıra ile, bekleyerek.

```js
// gun3.js

console.log("1. adım");
console.log("2. adım");
console.log("3. adım");
// Çıktı KESİNLİKLE bu sırayla gelir: 1, 2, 3 — JS başka türlü çalışamaz (senkron)
```

Ama bazı işlemler **zaman alır** — internetten veri çekmek, bir dosyayı okumak, bir zamanlayıcı beklemek. JS bu işlemleri **beklemeden** bir sonraki satıra geçer — bu davranışa **asenkron** denir. "Sonuç, ŞİMDİ değil, SONRA gelecek."

```js
console.log("Önce bu");

setTimeout(() => {
  // setTimeout(fonksiyon, milisaniye): belirtilen süre sonra fonksiyonu çalıştırır
  console.log("2 saniye sonra bu");
}, 2000); // 2000ms = 2 saniye

console.log("Ama bu, setTimeout'tan ÖNCE yazdırılır!");

// Çıktı sırası:
// "Önce bu"
// "Ama bu, setTimeout'tan ÖNCE yazdırılır!"
// (2 saniye bekleme)
// "2 saniye sonra bu"
```

Bunu ilk gördüğünde kafa karıştırıcı gelir — "neden sıra bozuldu?" JS, `setTimeout`'u görünce "bunu arka planda bekleteyim, sen devam et" der, kodun geri kalanını çalıştırır, süre dolunca geri döner. Tarayıcıyı **donmaktan** kurtaran mekanizma bu — internetten veri beklerken sayfa kilitlenmesin diye.

### 1:00–2:00 · Promise ve .then()

`setTimeout` basit ama gerçek dünyada (özellikle internetten veri çekerken) **Promise** denen bir yapı kullanılır. Promise, "şu an elimde değil ama gelecek (ya da başarısız olacak) bir sonucun sözü" gibi düşünülebilir.

```js
// Bir Promise örneği (fetch'in nasıl çalıştığını anlamak için basitleştirilmiş):
const sozVer = new Promise((resolve, reject) => {
  // resolve: iş BAŞARILI olursa çağrılır
  // reject: iş BAŞARISIZ olursa çağrılır
  setTimeout(() => {
    const basariliMi = true;
    if (basariliMi) {
      resolve("Veri geldi!");
    } else {
      reject("Bir hata oldu.");
    }
  }, 1000);
});

// Promise'in sonucunu YAKALAMANIN yolu .then() ve .catch():
sozVer
  .then((sonuc) => {
    // resolve olursa buraya düşer, sonuc = resolve'a verilen değer
    console.log("Başarılı:", sonuc);
  })
  .catch((hata) => {
    // reject olursa buraya düşer
    console.log("Hata:", hata);
  });

console.log("Bu satır, Promise sonuçlanmadan hemen çalışır — asenkron çünkü!");
```

Gerçekte Promise'i sen genelde **kendin oluşturmayacaksın** — `fetch` gibi hazır fonksiyonlar zaten bir Promise **döner**, sen sadece `.then()` ile sonucunu yakalarsın:

```js
// Şimdilik hayali bir örnek (Gün 5'te gerçeğini yapacağız):
fetch("https://ornek-api.com/veri")
  .then((cevap) => cevap.json())
  // cevap.json() de kendisi bir Promise döner — bu yüzden zincirlenebiliyor
  .then((veri) => {
    console.log(veri);
  })
  .catch((hata) => {
    console.log("İstek başarısız:", hata);
  });
```

### 2:00–3:00 · .then() zincirleme ve neden async/await'e ihtiyaç var

`.then()` zincirleme çalışır ama birden fazla adım olunca okunması zorlaşır — buna "callback/then piramidi" denir:

```js
sozVer
  .then((sonuc1) => {
    console.log(sonuc1);
    return "ikinci adım";
  })
  .then((sonuc2) => {
    console.log(sonuc2);
    return "üçüncü adım";
  })
  .then((sonuc3) => {
    console.log(sonuc3);
  })
  .catch((hata) => {
    console.log("Zincirin herhangi bir yerinde hata olursa buraya düşer:", hata);
  });
```

Bu çalışıyor ama 4-5 adım olunca kod sağa doğru kayar, okunması zorlaşır. Yarın (Gün 4) bunun **çok daha okunabilir** bir yazımını göreceğiz: `async/await`. Bugünkü amaç, `.then()`'in NE yaptığını anlamak — yarın aynı işi daha temiz yazacağız.

💡 **Zihinde tutman gereken tek cümle:** "Asenkron kod, 'şimdi değil ama gelecekte' çalışacak kodu ifade eder. `.then()`, o gelecekteki sonucu yakalamanın yoludur."

**Küçük zafer:** JS'in neden bazen "sırayı bozuyormuş gibi" davrandığını artık anlıyorsun — bu, ileri seviye geliştiricilerin bile ilk öğrendiğinde takıldığı bir konu.
**Terim defteri:** `senkron/asenkron`, `setTimeout`, `Promise`, `resolve/reject`, `.then()/.catch()`
**Çıktı:** `gun3.js` — Promise ve zincirleme örnekleri.
**Commit:** `git commit -m "hafta-03 g3: asenkron kavrami - promise ve then"`

---

## Gün 4 — async/await + try/catch

### 0:00–1:00 · async/await: Promise'i "senkron gibi" yazmak

`async/await`, dünkü `.then()` zincirlerini **senkron kod gibi görünen** ama arkada hâlâ asenkron çalışan bir yazıma çevirir. Endüstride artık `.then()` yerine hemen hemen her yerde `async/await` kullanılıyor — daha okunabilir.

İki kural:
1. `await` kullanacağın fonksiyonun başına `async` yazmalısın.
2. `await`, bir Promise'in **sonuçlanmasını bekler**, sonucu direkt değişkene atar.

```js
// gun4.js

const sozVer = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Veri geldi!"), 1000);
  });
};

// .then() yazımı (dünkü):
const eskiYol = () => {
  sozVer().then((sonuc) => {
    console.log("eski yol:", sonuc);
  });
};

// async/await yazımı (bugünkü, tercih edilen):
const yeniYol = async () => {
  // async: bu fonksiyonun İÇİNDE await kullanabileceğimizi belirtir
  const sonuc = await sozVer();
  // await: Promise sonuçlanana kadar BEKLE, sonra sonucu direkt değişkene ata
  // ".then()" yazmaya gerek yok — sanki senkron kodmuş gibi okunuyor
  console.log("yeni yol:", sonuc);
};

yeniYol();
```

Birden fazla adım olunca fark netleşiyor:

```js
// .then() ile (dünkü, sağa doğru kayan):
const adimlarEski = () => {
  sozVer()
    .then((s1) => {
      console.log(s1);
      return sozVer();
    })
    .then((s2) => {
      console.log(s2);
    });
};

// async/await ile (bugünkü, düz, yukarıdan aşağı okunan):
const adimlarYeni = async () => {
  const s1 = await sozVer();
  console.log(s1);
  const s2 = await sozVer();
  console.log(s2);
};

adimlarYeni();
```

### 1:00–2:00 · try/catch ile hata yönetimi

`.then()` zincirinde hataları `.catch()` yakalıyordu. `async/await`'te hataları yakalamanın yolu **try/catch** — Hafta 1'de görmüş olabileceğin ama şimdi asıl kullanım yerini bulan bir yapı:

```js
const veriGetir = async () => {
  try {
    // try bloğu: "bunu dene" — içinde hata OLABİLECEK kod
    const sonuc = await sozVer();
    console.log("başarılı:", sonuc);
  } catch (hata) {
    // catch bloğu: try içinde HERHANGİ bir hata olursa buraya düşer
    console.log("hata yakalandı:", hata);
  }
};

veriGetir();
```

Neden `try/catch` şart? Çünkü internet isteği (yarın `fetch` ile göreceğiz) her zaman başarılı olmaz — internet kesilebilir, sunucu cevap vermeyebilir, adres yanlış olabilir. `try/catch` olmadan bu hatalar programını **çökertir**; `try/catch` ile programın hatayı yakalayıp kullanıcıya düzgün bir mesaj gösterebilirsin.

```js
// Hata OLUŞAN bir senaryo örneği:
const basarisizIstek = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Sunucuya ulaşılamadı!"), 1000);
  });
};

const veriGetir2 = async () => {
  try {
    const sonuc = await basarisizIstek();
    console.log(sonuc); // buraya HİÇ ulaşılmaz
  } catch (hata) {
    console.log("Beklenen hata yakalandı:", hata);
    // program çökmedi, hatayı düzgün şekilde ele aldık
  }
};

veriGetir2();
```

### 2:00–3:00 · Pratik: sahte bir "API" fonksiyonuyla dene

Gerçek `fetch`'e yarın geçeceğiz — bugün, gerçek API'nin davranışını taklit eden bir fonksiyonla `async/await` + `try/catch`'i iyice pekiştir:

```js
// sahte bir kullanıcı API'si — bazen başarılı, bazen başarısız olsun
const sahteKullaniciGetir = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, ad: "Elif", meslek: "Geliştirici" });
      } else {
        reject(`ID ${id} ile kullanıcı bulunamadı`);
      }
    }, 800);
  });
};

const kullaniciGoster = async (id) => {
  console.log(`ID ${id} için kullanıcı aranıyor...`);
  try {
    const kullanici = await sahteKullaniciGetir(id);
    console.log("Bulundu:", kullanici);
  } catch (hata) {
    console.log("Hata:", hata);
  } finally {
    // finally: try başarılı da olsa, catch'e de düşse HER ZAMAN çalışır
    console.log("İstek tamamlandı.\n");
  }
};

// İkisini de dene:
kullaniciGoster(1); // başarılı olacak
kullaniciGoster(99); // hataya düşecek
```

Çalıştır ve iki çağrının da (biri başarılı, biri hatalı) düzgün ele alındığını, programın çökmediğini gör.

💡 Bundan sonra göreceğin **her** `fetch` çağrısını bu kalıpla yazacaksın: `async fonksiyon` + `try { await fetch(...) } catch (hata) { ... }`. Bu kalıbı ezberle, yarın gerçek bir API'ye uygulayacağız.

**Küçük zafer:** Asenkron kodu artık `.then()` zincirleri yerine düz, okunabilir, senkron GÖRÜNÜMLÜ kodla yazabiliyorsun — ve hataları düzgünce yakalıyorsun.
**Terim defteri:** `async`, `await`, `try/catch/finally`, `hata yönetimi`
**Çıktı:** `gun4.js` — async/await + try/catch örnekleri, hem başarılı hem hatalı senaryo.
**Commit:** `git commit -m "hafta-03 g4: async await + try catch"`

---

## Gün 5 — fetch(): Gerçek Bir API'den Veri Çekmek

### 0:00–1:00 · fetch() nedir

`fetch`, tarayıcının (ve Node'un yeni sürümlerinin) internetten veri çekmek için sunduğu **yerleşik** fonksiyon — hiçbir şey kurmana gerek yok. Bir adrese (URL) istek atar, cevabı bir Promise olarak döner.

Bugün kullanacağımız API: [JSONPlaceholder](https://jsonplaceholder.typicode.com) — geliştiricilerin pratik yapması için hazırlanmış, ücretsiz, sahte ama gerçekçi bir test API'si. Kayıt gerektirmiyor.

```js
// gun5.js

const veriCek = async () => {
  try {
    const cevap = await fetch("https://jsonplaceholder.typicode.com/users/1");
    // fetch, adrese bir HTTP isteği atar, cevap Promise'i döner
    // await ile cevabın gelmesini bekliyoruz

    const veri = await cevap.json();
    // cevap.json(): HTTP cevabının GÖVDESİNİ (body) JavaScript nesnesine çevirir
    // Bu da kendi başına bir Promise döndüğü için yine await gerekir

    console.log(veri);
  } catch (hata) {
    console.log("İstek başarısız:", hata);
  }
};

veriCek();
```

Çalıştır: `node gun5.js`. Konsolda bir kullanıcı nesnesi görmelisin (`id`, `name`, `email`, `address`...). **Bu, internetten çektiğin ilk gerçek veri.**

### 1:00–2:00 · Veriyi işleme: destructuring + dizi metotlarıyla birleştir

Tek bir kullanıcı yerine, tüm kullanıcı listesini çekip Hafta 3'te öğrendiğin dizi metotlarıyla işleyelim:

```js
const tumKullanicilariGetir = async () => {
  try {
    const cevap = await fetch("https://jsonplaceholder.typicode.com/users");
    const kullanicilar = await cevap.json();
    // kullanicilar artık 10 kullanıcılık bir DİZİ

    console.log(`Toplam ${kullanicilar.length} kullanıcı bulundu.`);

    // sadece isim ve şehirleri çıkar (map + destructuring):
    const ozet = kullanicilar.map(({ name, address }) => {
      return `${name} — ${address.city}`;
    });
    console.log(ozet);

    // sadece "Lake" geçen şehirde yaşayanlar (filter):
    const gollüSehirdekiler = kullanicilar.filter((k) =>
      k.address.city.includes("Lake")
    );
    // .includes(): bir string'in içinde başka bir string GEÇİYOR mu, true/false döner
    console.log("Gölü olan şehirdekiler:", gollüSehirdekiler.map((k) => k.name));
  } catch (hata) {
    console.log("Hata:", hata);
  }
};

tumKullanicilariGetir();
```

💡 Gerçek dünyada API'den gelen veri neredeyse hiç senin istediğin şekilde gelmez — bu yüzden `fetch` sonrası `.map()`/`.filter()` ile "şekillendirmek" çok sık yapacağın bir iş.

### 2:00–3:00 · Hata durumunu da simüle et, status kontrolü öğren

`fetch`, garip bir şekilde, sunucu 404/500 gibi bir HATA kodu döndürse bile Promise'i **reddetmiyor** (reject etmiyor) — bunu senin kontrol etmen gerekiyor:

```js
const hataliIstekDene = async () => {
  try {
    const cevap = await fetch("https://jsonplaceholder.typicode.com/users/9999");
    // 9999 id'li kullanıcı YOK, ama fetch yine de "başarılı" bir cevap döner (404 ile)

    if (!cevap.ok) {
      // cevap.ok: HTTP durumu 200-299 arasındaysa true, değilse false
      throw new Error(`İstek başarısız: ${cevap.status}`);
      // throw: bilinçli olarak bir hata FIRLATIYORUZ — bu, catch bloğuna düşmesini sağlar
    }

    const veri = await cevap.json();
    console.log(veri);
  } catch (hata) {
    console.log("Yakalanan hata:", hata.message);
  }
};

hataliIstekDene();
```

Bu `if (!cevap.ok) throw ...` deseni, **her `fetch` çağrısında** kullanacağın standart bir güvenlik kontrolü — şimdiden alışkanlık haline getir.

Son olarak, tek bir dosyada iki farklı endpoint'i art arda çekmeyi dene (art arda `await` kullanımı):

```js
const ikiKaynaktanVeriCek = async () => {
  try {
    const kullaniciCevap = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const kullanici = await kullaniciCevap.json();

    const postlarCevap = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${kullanici.id}`
    );
    // template literal ile URL'in içine kullanicinin id'sini gömdük
    const postlar = await postlarCevap.json();

    console.log(`${kullanici.name} adlı kullanıcının ${postlar.length} gönderisi var.`);
  } catch (hata) {
    console.log("Hata:", hata);
  }
};

ikiKaynaktanVeriCek();
```

**Küçük zafer:** İlk kez kendi bilgisayarından, gerçek internetteki bir sunucuya istek atıp, cevabı işleyip anlamlı bir çıktı ürettin — bu, "frontend'in backend'le konuşması"nın ta kendisi.
**Terim defteri:** `fetch()`, `.json()`, `HTTP status`, `cevap.ok`, `throw new Error()`
**Çıktı:** `gun5.js` — JSONPlaceholder'dan veri çeken, işleyen, hata kontrolü yapan kod.
**Commit:** `git commit -m "hafta-03 g5: fetch ile gercek api'den veri cekme"`

---

## Gün 6 — Mini Proje: Alıntı Uygulaması + Deploy

### 0:00–1:00 · Planla ve iskeleti kur

Bugün bu haftanın tüm parçalarını birleştiriyoruz: HTML/CSS (Hafta 2) + fetch/async-await (bu hafta) → bir düğmeye her basışta rastgele bir İngilizce alıntı (quote) çeken, ekrana basan mini bir uygulama.

Kullanacağımız API: [quotable.io benzeri ücretsiz alıntı API'leri zaman zaman değişebiliyor — çalışmazsa aşağıdaki "yedek plan" kutusuna bak] `https://api.quotable.io/random`

```bash
mkdir -p ~/elif-fullstack/hafta-03/mini-app
cd ~/elif-fullstack/hafta-03/mini-app
```

`index.html`:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Günün Alıntısı</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="kutu">
    <h1>💬 Günün Alıntısı</h1>
    <blockquote id="alinti">Bir alıntı görmek için butona bas.</blockquote>
    <!-- blockquote: alıntı metinleri için semantik etiket -->
    <p id="yazar"></p>
    <button id="getir-buton">Yeni Alıntı Getir</button>
    <p id="durum"></p>
    <!-- durum: yükleniyor / hata mesajları için -->
  </main>
  <script src="script.js"></script>
</body>
</html>
```

`style.css`:

```css
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  /* linear-gradient: iki renk arası yumuşak geçiş, 135deg = geçiş açısı */
  min-height: 100vh;
  /* 100vh: ekran yüksekliğinin tamamı (viewport height) */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.kutu {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  text-align: center;
}

blockquote {
  font-size: 20px;
  font-style: italic;
  margin: 20px 0;
  color: #333;
}

#yazar {
  font-weight: bold;
  color: #666;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 12px;
}

button:hover {
  background: #5568d3;
}

button:disabled {
  /* :disabled — buton devre dışıyken (istek sürerken) farklı görünsün */
  background: #aaa;
  cursor: not-allowed;
}

#durum {
  color: #999;
  font-size: 14px;
  min-height: 20px;
}
```

### 1:00–2:00 · fetch mantığını kur

`script.js`:

```js
const alintiElement = document.querySelector("#alinti");
const yazarElement = document.querySelector("#yazar");
const buton = document.querySelector("#getir-buton");
const durumElement = document.querySelector("#durum");

const alintiGetir = async () => {
  buton.disabled = true;
  // istek sürerken butonu kilitle — kullanıcı üst üste tıklayıp karman çorman etmesin
  durumElement.textContent = "Yükleniyor...";

  try {
    const cevap = await fetch("https://api.quotable.io/random");

    if (!cevap.ok) {
      throw new Error(`İstek başarısız: ${cevap.status}`);
    }

    const veri = await cevap.json();
    // veri örnek yapısı: { content: "...", author: "..." }

    alintiElement.textContent = veri.content;
    yazarElement.textContent = `— ${veri.author}`;
    durumElement.textContent = "";
  } catch (hata) {
    // ağ hatası, API çökmüşse ya da adres değişmişse buraya düşer
    durumElement.textContent = "Alıntı getirilemedi, tekrar dene.";
    console.log("Hata detayı:", hata);
  } finally {
    buton.disabled = false;
    // ne olursa olsun butonu tekrar aktif et
  }
};

buton.addEventListener("click", alintiGetir);
```

`open index.html` ile tarayıcıda aç, butona bas — her tıklamada yeni bir alıntı gelmeli. Konsolu (F12) açık tutup ağ isteklerini de izleyebilirsin (Network sekmesi).

> **Yedek plan:** `api.quotable.io` çalışmazsa (bazı ücretsiz API'ler zamanla kapanabiliyor), aynı mantığı `https://dog.ceo/api/breeds/image/random` ile dene — bu sefer alıntı yerine rastgele bir köpek fotoğrafı (`veri.message` bir resim URL'i döner) `<img>` etiketine basılır. Kod yapısı birebir aynı, sadece `veri.content` yerine `veri.message` kullanırsın ve `img.src = veri.message` dersin.

### 2:00–3:00 · Son rötuş + Vercel deploy

Kullanıcı deneyimini biraz iyileştir — sayfa ilk açıldığında otomatik bir alıntı gelsin:

```js
// script.js dosyasının EN ALTINA ekle:
alintiGetir();
// sayfa yüklenir yüklenmez bir kere otomatik çalıştır — kullanıcı boş kutuyla karşılaşmasın
```

Şimdi Hafta 2'de öğrendiğin akışı tekrar et:

```bash
cd ~/elif-fullstack/hafta-03/mini-app
git init
git add .
git commit -m "ilk commit: gunun alintisi mini app"

# GitHub'da yeni repo aç (örn. "elif-alinti-app"), sonra:
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/elif-alinti-app.git
git push -u origin main
```

Vercel'e git → "Add New" → "Project" → reponu import et → Framework: "Other" → Deploy. Birkaç saniye sonra canlı linkin hazır.

💡 Bu API'nin **backend'i sen değilsin** — quotable.io'nun sunucusu. Ama sen frontend'den ona istek attın, cevabını aldın, ekrana bastın. Hafta 8-10'da kendi backend'ini yazınca, işte tam olarak bu deseni **kendi API'ne** karşı kullanacaksın — bugün öğrendiğin `fetch` + `async/await` + hata yönetimi %100 aynı kalacak.

**Küçük zafer:** Frontend + gerçek internet API'sini birleştiren, çalışan, canlıya alınmış ikinci sitene sahipsin.
**Terim defteri:** `public API`, `linear-gradient`, `:disabled`, `finally bloğu`, `yedek plan (fallback)`
**Çıktı:** 🌐 `https://elif-alinti-app.vercel.app` (kendi linkin) — canlı, API tüketen mini app.
**Commit:** `git commit -m "hafta-03 g6: mini proje deploy edildi"`

---

## Gün 7 — Pazar Review

Kod yazma zorunluluğu yok. Roy ile 30 dk:

1. **Teach-back:** `.map()` ile `.filter()` arasındaki farkı, `async/await`'in `.then()`'e göre neden daha okunabilir olduğunu, `try/catch`'in ne işe yaradığını kendi cümlelerinle anlat.
2. **Canlı linkini göster**, butona birkaç kere bas, farklı alıntılar geldiğini kanıtla.
3. **Hafta 4'ün saat-saat planı** açılır: bu hafta öğrendiğin her şeyi (DOM, event, fetch değil ama state yönetimi, localStorage) kullanarak bir To-Do (yapılacaklar) uygulaması yazacaksın — bu, Faz 1'i kapatan proje.

**Bu hafta özet:** ES6 sözdizimine (const/let, arrow function, template literal, destructuring) geçtin, döngü yerine dizi metotlarını (map/filter/find/reduce) kullanmayı öğrendin, asenkron kodun ne olduğunu ve `async/await` + `try/catch` ile nasıl yönetildiğini kavradın, gerçek bir API'den `fetch` ile veri çektin ve bunu canlı bir uygulamaya dönüştürdün.
