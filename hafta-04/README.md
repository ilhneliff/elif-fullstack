# Hafta 4 — To-Do App + Faz 1 Kapanışı (Faz 1)

> **Hedef:** Tek bir gerçek uygulamayı sıfırdan bitirmek — plandan deploy'a, localStorage'a kadar
> **Çıktı:** ✔ 🌐 2. canlı app (To-Do) + temiz, düzenli repo
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Hafta 2'de sayfa yapmayı, Hafta 3'te internetten veri çekmeyi öğrendin. Bu hafta ikisini birleştirip, kendi verisini **yöneten** ilk gerçek uygulamanı yazıyorsun: bir **To-Do (yapılacaklar) app**. Ekle, tamamla, sil, sayfa yenilenince kaybolmasın. Bu, "CRUD" dediğimiz deseni (Create/Read/Update/Delete — oluştur/oku/güncelle/sil) ilk kez uçtan uca yaşayacağın proje. Hafta 8-10'da backend'e geçince aynı deseni bir veritabanıyla tekrar göreceksin — bugün öğrendiğin mantık orada da geçerli olacak.

Bu, **Faz 1'in kapanış haftası.** Hafta sonunda geriye dönüp bakacaksın: sıfırdan başladın, şimdi iki canlı sitene sahipsin.

**Çalışma klasörün:**

```bash
mkdir -p ~/elif-fullstack/hafta-04/todo-app
cd ~/elif-fullstack/hafta-04/todo-app
```

---

## Gün 1 — To-Do App Planı + HTML/CSS İskelet

### 0:00–1:00 · Projeyi kağıt üzerinde planla

Kod yazmadan önce 15 dakika planlama — bu alışkanlık seni "nereden başlayacağım" panik anından kurtarır. Kendine şu soruları sor ve yanıtları yaz (bir not defterine ya da bu dosyanın altına):

```
1. Kullanıcı ne yapabilmeli?
   - Yeni görev ekleyebilmeli
   - Görevi "tamamlandı" işaretleyebilmeli
   - Görevi silebilmeli
   - Sayfayı yenileyince görevler KAYBOLMAMALI

2. Veriyi nasıl tutacağım?
   - Bir DİZİ içinde nesneler: [{ id: 1, metin: "Süt al", tamamlandi: false }, ...]
   - Her görevin: benzersiz bir id'si, metni, tamamlanma durumu olacak

3. Hangi fonksiyonlara ihtiyacım var?
   - gorevEkle(metin)
   - gorevSil(id)
   - gorevTamamlandiYapVeyaGeriAl(id)
   - listeyiEkranaCiz()  → diziyi alıp DOM'a basan fonksiyon
```

Bu dört fonksiyon, bugünden itibaren projenin **iskeleti** olacak — Gün 2 ve 3'te tek tek dolduracağız.

### 1:00–2:00 · HTML iskeleti

`index.html`:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yapılacaklar Listem</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="kutu">
    <h1>📝 Yapılacaklar Listem</h1>

    <form id="gorev-form">
      <!-- form: yeni görev girmek için -->
      <input
        type="text"
        id="gorev-input"
        placeholder="Yeni görev yaz..."
        autocomplete="off"
      >
      <!-- autocomplete="off": tarayıcının eski girdileri önermesini kapat -->
      <button type="submit">Ekle</button>
    </form>

    <ul id="gorev-listesi">
      <!-- gorev-listesi: JS burayı DOLDURACAK, şimdilik boş -->
    </ul>

    <p id="bos-mesaj">Henüz görev yok. Bir tane ekle!</p>
    <!-- bos-mesaj: liste boşken görünecek, JS ile açıp kapatacağız -->
  </main>

  <script src="script.js"></script>
</body>
</html>
```

💡 `<form id="gorev-form">` kullandık, tek başına `<button>` değil — çünkü form kullanınca kullanıcı **Enter tuşuna basarak da** görev ekleyebilir, sadece butona tıklamak zorunda kalmaz. Bu küçük bir kullanılabilirlik kazancı.

### 2:00–3:00 · CSS ile giydir

`style.css`:

```css
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f5f6fa;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  margin: 0;
  min-height: 100vh;
}

.kutu {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  height: fit-content;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

#gorev-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

#gorev-input {
  flex: 1;
  /* flex: 1 → kalan tüm genişliği bu input alsın, buton kendi doğal genişliğinde kalsın */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

#gorev-form button {
  padding: 10px 16px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

#gorev-form button:hover {
  background: #5849c2;
}

#gorev-listesi {
  list-style: none;
  padding: 0;
  margin: 0;
}

#bos-mesaj {
  color: #999;
  text-align: center;
  font-size: 14px;
}
```

Sayfayı tarayıcıda aç — form ve boş liste görünmeli, henüz hiçbir şey ekleyemiyorsun (yarın JS ile hayat vereceğiz). Şimdiden düzenli ve temiz görünmeli.

**Küçük zafer:** Kod yazmadan önce planlamayı denedin — bu, "nereden başlasam" panik anını ortadan kaldıran gerçek bir mühendislik alışkanlığı.
**Terim defteri:** `plan/pseudocode`, `form + autocomplete`, `flex: 1`
**Çıktı:** Statik ama düzenli to-do arayüzü (henüz etkileşimsiz).
**Commit:** `git commit -m "hafta-04 g1: todo app plani + html css iskelet"`

---

## Gün 2 — Ekle ve Listele

### 0:00–1:00 · Veriyi tutacak diziyi kur, ilk render fonksiyonu

`script.js`:

```js
// Görevleri tutacağımız dizi — uygulamanın "hafızası" şimdilik burası
// (Gün 4'te bunu localStorage'a bağlayacağız, kalıcı olacak)
let gorevler = [];

let sonrakiId = 1;
// her yeni göreve benzersiz bir id vermek için basit bir sayaç

const listeElement = document.querySelector("#gorev-listesi");
const bosMesajElement = document.querySelector("#bos-mesaj");

const listeyiEkranaCiz = () => {
  // Bu fonksiyon, gorevler dizisinin GÜNCEL halini alıp DOM'a yeniden basar.
  // "Yeniden çizme" deseni: her değişiklikte listeyi SIFIRLAYIP baştan yazıyoruz —
  // küçük listeler için en basit ve en az hataya açık yöntem budur.

  listeElement.innerHTML = "";
  // innerHTML = "": elementin İÇİNDEKİ her şeyi temizle (eski liste elemanlarını sil)

  if (gorevler.length === 0) {
    bosMesajElement.style.display = "block";
    // style.display: elementin CSS display özelliğini JS'ten değiştirmek
    return;
    // dizi boşsa liste elemanı oluşturmaya gerek yok, fonksiyondan çık
  }

  bosMesajElement.style.display = "none";

  gorevler.forEach((gorev) => {
    // forEach: map/filter gibi bir dizi metodu ama YENİ dizi DÖNDÜRMEZ,
    // sadece her eleman için "bir şey yap" der — burada DOM'a eleman eklemek için ideal

    const li = document.createElement("li");
    // document.createElement: yeni, boş bir HTML elemanı oluşturur (henüz sayfada değil)
    li.textContent = gorev.metin;

    listeElement.appendChild(li);
    // appendChild: oluşturduğumuz li'yi, gorev-listesi ul'sinin İÇİNE, EN SONA ekler
  });
};

listeyiEkranaCiz();
// sayfa ilk açıldığında da bir kere çağır (şu an boş liste mesajı görünecek)
```

Sayfayı yenile — "Henüz görev yok" mesajı görünmeli (çünkü `gorevler` hâlâ boş dizi). Bu, render fonksiyonunun **çalıştığının** kanıtı.

### 1:00–2:00 · gorevEkle fonksiyonu + formu dinleme

```js
const gorevEkle = (metin) => {
  const yeniGorev = {
    id: sonrakiId,
    metin: metin,
    tamamlandi: false,
  };

  gorevler.push(yeniGorev);
  // push: diziye SONA yeni eleman ekler

  sonrakiId = sonrakiId + 1;
  // bir sonraki görev için id'yi bir artır — id'ler asla tekrar etmesin

  listeyiEkranaCiz();
  // veri değişti, EKRANI GÜNCELLEMEYİ UNUTMA — bu adımı atlarsan dizi değişir ama ekran değişmez
};
```

💡 **Kritik alışkanlık:** Diziyi (`gorevler`) her değiştirdiğinde hemen ardından `listeyiEkranaCiz()` çağır. Veriyi güncelleyip ekranı güncellemeyi unutmak, başlangıç seviyesinde en sık yapılan hata — "neden buton çalışmıyor" sorununun çoğu zaman cevabı budur.

Şimdi formu dinle:

```js
const formElement = document.querySelector("#gorev-form");
const inputElement = document.querySelector("#gorev-input");

formElement.addEventListener("submit", (event) => {
  // "submit" olayı: form gönderildiğinde tetiklenir (butona tıklayınca YA DA Enter'a basınca)

  event.preventDefault();
  // preventDefault(): formun VARSAYILAN davranışını engeller —
  // varsayılanda form gönderilince SAYFA YENİLENİR, biz bunu istemiyoruz (SPA mantığı)

  const girilenMetin = inputElement.value.trim();
  // input.value: kullanıcının kutuya yazdığı metin
  // .trim(): baştaki/sondaki boşlukları temizler ("  süt al  " → "süt al")

  if (girilenMetin === "") {
    return;
    // boş görev eklemeyi engelle
  }

  gorevEkle(girilenMetin);
  inputElement.value = "";
  // input'u temizle — kullanıcı bir sonraki görevi yazmak için tekrar silmesin
});
```

Tarayıcıda dene: input'a bir şey yaz, Enter'a bas ya da "Ekle"ye tıkla — görev listeye eklenmeli, "boş" mesajı kaybolmalı.

### 2:00–3:00 · Tamamlanma durumunu görsel olarak yansıt (henüz tıklanamaz, sadece görünüm)

Görevlerin tamamlanma durumunu (`tamamlandi: true/false`) render sırasında görsel olarak farklılaştıralım — yarın buna tıklama ekleyeceğiz, bugün sadece görünümü hazırlıyoruz:

```js
// listeyiEkranaCiz fonksiyonundaki forEach bloğunu güncelle:
gorevler.forEach((gorev) => {
  const li = document.createElement("li");
  li.textContent = gorev.metin;

  if (gorev.tamamlandi) {
    li.classList.add("tamamlandi");
    // classList.add: koşula bağlı olarak bir class ekle (Hafta 2'de toggle görmüştük, add sadece EKLER)
  }

  listeElement.appendChild(li);
});
```

CSS'e tamamlanmış görev stilini ekle (`style.css`):

```css
#gorev-listesi li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#gorev-listesi li.tamamlandi {
  text-decoration: line-through;
  /* line-through: üstü çizili yazı — "bu iş bitti" hissi */
  color: #aaa;
}
```

Test etmek için geçici olarak `gorevEkle` çağrısından hemen sonra elle bir görevi tamamlanmış işaretleyip render'ı tekrar çağırabilirsin (bu sadece test amaçlı, yarın gerçek tıklama ile değiştireceğiz):

```js
// GEÇİCİ TEST — yarın silinecek:
// gorevler[0].tamamlandi = true;
// listeyiEkranaCiz();
```

**Küçük zafer:** Kullanıcıdan input alıp, bir diziye ekleyip, o diziyi ekrana **fonksiyonla** basan ilk gerçek "veri akışını" kurdun — bu desen React'te de birebir aynı mantıkla çalışacak (Hafta 5-7).
**Terim defteri:** `createElement/appendChild`, `event.preventDefault()`, `.trim()`, `forEach`, `innerHTML = ""`
**Çıktı:** Görev eklenebilen, listelenen çalışan bir to-do app.
**Commit:** `git commit -m "hafta-04 g2: gorev ekleme ve listeleme"`

---

## Gün 3 — Tamamla ve Sil

### 0:00–1:00 · Her görev satırına buton ekle

Her `<li>`'nin içine iki küçük buton koyacağız: tamamla (✓) ve sil (✕). `listeyiEkranaCiz` fonksiyonunu genişlet:

```js
gorevler.forEach((gorev) => {
  const li = document.createElement("li");

  const metinSpan = document.createElement("span");
  // ayrı bir span kullanıyoruz ki butonlar metnin İÇİNE değil YANINA gelsin
  metinSpan.textContent = gorev.metin;
  if (gorev.tamamlandi) {
    metinSpan.classList.add("tamamlandi");
  }

  const tamamlaButon = document.createElement("button");
  tamamlaButon.textContent = "✓";
  tamamlaButon.classList.add("mini-buton", "tamamla-buton");
  tamamlaButon.dataset.id = gorev.id;
  // dataset.id: HTML'e data-id="..." özel özelliği ekler
  // Bu, "bu buton HANGİ göreve ait" bilgisini butonun ÜZERİNDE taşımanın standart yolu

  const silButon = document.createElement("button");
  silButon.textContent = "✕";
  silButon.classList.add("mini-buton", "sil-buton");
  silButon.dataset.id = gorev.id;

  li.appendChild(metinSpan);
  li.appendChild(tamamlaButon);
  li.appendChild(silButon);
  listeElement.appendChild(li);
});
```

CSS'e mini buton stillerini ekle:

```css
.mini-buton {
  border: none;
  background: #eee;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  margin-left: 6px;
  font-size: 13px;
}

.tamamla-buton:hover {
  background: #55efc4;
}

.sil-buton:hover {
  background: #ff7675;
  color: white;
}
```

### 1:00–2:00 · Event delegation ile tıklamaları yakala

Her butona ayrı ayrı `addEventListener` eklemek YANLIŞ bir yaklaşım olurdu — çünkü `listeyiEkranaCiz` her seferinde `innerHTML = ""` ile listeyi SİLİP baştan yazıyor, o an eski butonlara bağladığın event'ler de siliniyor. Doğru çözüm: **event delegation** — tek bir dinleyiciyi listenin KENDİSİNE koy, hangi butona tıklandığını `event.target`'tan anla.

```js
listeElement.addEventListener("click", (event) => {
  // Bu dinleyici SADECE BİR KEZ eklenir (listeyi her yeniden çizdiğimizde SİLİNMEZ,
  // çünkü <ul> elementinin kendisi hiç yok edilmiyor, sadece İÇİNDEKİLER değişiyor)

  const tiklananId = Number(event.target.dataset.id);
  // event.target: gerçekte TIKLANAN eleman (buton)
  // dataset.id: string olarak gelir, Number() ile sayıya çeviriyoruz (id'ler sayı çünkü)

  if (event.target.classList.contains("tamamla-buton")) {
    gorevTamamlaToggle(tiklananId);
  }

  if (event.target.classList.contains("sil-buton")) {
    gorevSil(tiklananId);
  }
});
```

💡 **Event delegation neden işe yarıyor?** Tarayıcıda olaylar (event) "kabarcıklanır" (bubble) — bir butona tıklarsan, o olay önce butonda, sonra `li`'de, sonra `ul`'de, sonra `body`'de... yukarı doğru sırayla tetiklenir. Bu yüzden `ul`'e koyduğun tek bir dinleyici, İÇİNDEKİ her butonun tıklamasını da yakalayabiliyor — kaç eleman olursa olsun.

### 2:00–3:00 · gorevTamamlaToggle ve gorevSil fonksiyonları

```js
const gorevTamamlaToggle = (id) => {
  gorevler = gorevler.map((gorev) => {
    // map ile YENİ bir dizi oluşturuyoruz — id eşleşen görevin tamamlandi'sini ÇEVİR, diğerlerine dokunma
    if (gorev.id === id) {
      return { ...gorev, tamamlandi: !gorev.tamamlandi };
      // { ...gorev, tamamlandi: !gorev.tamamlandi }:
      //   ...gorev → gorev nesnesinin TÜM alanlarını kopyala ("spread" sözdizimi)
      //   tamamlandi: !gorev.tamamlandi → SADECE bu alanı tersine çevirerek EZ
      // Sonuç: id, metin aynı kalır, sadece tamamlandi değişir
    }
    return gorev;
    // eşleşmeyen görevleri OLDUĞU GİBİ geri döndür
  });

  listeyiEkranaCiz();
};

const gorevSil = (id) => {
  gorevler = gorevler.filter((gorev) => gorev.id !== id);
  // filter: id'si SİLİNMEK İSTENEN id'YE EŞİT OLMAYAN tüm görevleri tut
  // yani sadece o TEK görev dizi dışında kalır, geri kalan her şey aynı

  listeyiEkranaCiz();
};
```

Gün 2'deki geçici test satırlarını sil (artık gerçek butonlarla test edeceğiz). Tarayıcıda dene: birkaç görev ekle, tamamla butonuna bas (üstü çizilmeli), sil butonuna bas (listeden kalkmalı).

💡 `gorevler = gorevler.map(...)` ve `gorevler = gorevler.filter(...)` yazımına dikkat et — **eski diziyi elle değiştirmiyoruz** (`.push`, elemanı direkt değiştirme gibi), her seferinde `map`/`filter` ile YENİ bir dizi oluşturup `gorevler`'e yeniden atıyoruz. Bu, "immutable" (değişmez) veri yaklaşımı — React'e geçtiğinde (Hafta 5) bu **zorunlu** olacak, şimdiden bu alışkanlığı kurman büyük avantaj.

**Küçük zafer:** Tıklanan elemanın HANGİSİ olduğunu anlayıp, doğru görevi güncelleyen ya da silen tam işlevsel bir uygulaman var.
**Terim defteri:** `event delegation`, `event.target`, `dataset`, `spread (...)`, `immutable güncelleme`
**Çıktı:** Ekle + tamamla + sil, üçü de çalışan to-do app.
**Commit:** `git commit -m "hafta-04 g3: gorev tamamlama ve silme - event delegation"`

---

## Gün 4 — Kalıcılık: localStorage

### 0:00–1:00 · Problem: sayfa yenilenince her şey kayboluyor

Şu an `gorevler` sadece JS'in hafızasında (RAM) yaşıyor — sayfayı yenilediğinde (F5) tarayıcı script'i baştan çalıştırır, `gorevler = []` satırına geri döner, her şey silinir. Bunu test et: birkaç görev ekle, sayfayı yenile — hepsi gitti, değil mi?

Çözüm: **localStorage** — tarayıcının, senin sitene ait küçük verileri **diskte** (yenilense de, tarayıcı kapansa da kaybolmayacak şekilde) sakladığı basit bir depo.

```js
// localStorage sadece STRING saklayabilir — sayı, dizi, nesne SAKLAYAMAZ direkt
localStorage.setItem("test-anahtar", "merhaba");
// setItem(anahtar, değer): bir veriyi kaydet

const okunanDeger = localStorage.getItem("test-anahtar");
console.log(okunanDeger); // "merhaba"

localStorage.removeItem("test-anahtar");
// removeItem: o anahtarı sil
```

Bunu tarayıcı konsolunda dene, sonra sayfayı yenile, tekrar `localStorage.getItem("test-anahtar")` yaz — veri hâlâ orada olmalı (yenileme onu silmez, `removeItem` ya da elle silme siler).

### 1:00–2:00 · JSON.stringify / JSON.parse ile dizi saklama

Bizim `gorevler` bir DİZİ, ama localStorage sadece STRING alır. Çözüm: diziyi bir string'e "paketleyip" (`JSON.stringify`) kaydet, okurken tekrar diziye "aç" (`JSON.parse`).

```js
const ornekDizi = [{ id: 1, metin: "test" }];

const stringHali = JSON.stringify(ornekDizi);
// JSON.stringify: JS nesnesini/dizisini bir STRING'e çevirir
console.log(stringHali);
console.log(typeof stringHali); // "string"

localStorage.setItem("ornek", stringHali);

const geriOkunan = localStorage.getItem("ornek");
console.log(typeof geriOkunan); // "string" — henüz dizi DEĞİL

const tekrarDizi = JSON.parse(geriOkunan);
// JSON.parse: string'i tekrar JS nesnesine/dizisine çevirir
console.log(typeof tekrarDizi); // "object"
console.log(tekrarDizi[0].metin); // "test"
```

💡 **Ezberlenecek çift:** `JSON.stringify` = kaydetmeden ÖNCE (diziyi/nesneyi string yap). `JSON.parse` = okuduktan SONRA (string'i tekrar diziye/nesneye çevir). Bu ikisi hep birlikte, ters yönlerde kullanılır.

### 2:00–3:00 · to-do app'e kalıcılığı bağla

İki fonksiyon ekle ve mevcut kodun stratejik noktalarına yerleştir:

```js
const KAYIT_ANAHTARI = "elif-todo-gorevler";
// localStorage anahtarını sabit bir isimle tanımlamak, kodun her yerinde
// "gorevler" string'ini tekrar tekrar yazmaktan (ve yazım hatası riskinden) kurtarır

const gorevleriKaydet = () => {
  localStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(gorevler));
};

const gorevleriYukle = () => {
  const kayitliVeri = localStorage.getItem(KAYIT_ANAHTARI);

  if (kayitliVeri === null) {
    // localStorage'da hiç kayıt yoksa (ilk ziyaret) boş diziyle başla
    return [];
  }

  return JSON.parse(kayitliVeri);
};
```

Şimdi `gorevler`'in başlangıç değerini değiştir — sabit boş dizi yerine, kayıtlı veriyi yükle:

```js
// ESKİ:
// let gorevler = [];

// YENİ:
let gorevler = gorevleriYukle();

// sonrakiId'yi de kayıtlı veriye göre AYARLA, aksi halde yeniden başlarsa
// eski id'lerle çakışabilir:
let sonrakiId =
  gorevler.length > 0
    ? Math.max(...gorevler.map((g) => g.id)) + 1
    : 1;
// Math.max(...diziler): dizideki EN BÜYÜK sayıyı bulur
// ...gorevler.map(g => g.id): tüm görevlerin id'lerini bir diziye çevirir,
//   ... (spread) ile Math.max'a TEK TEK parametre olarak "açar"
// varsa en büyük id + 1, yoksa (ilk ziyaret) 1'den başla
```

Son olarak, `gorevEkle`, `gorevTamamlaToggle`, `gorevSil` fonksiyonlarının HER birinde, `listeyiEkranaCiz()` çağrısından hemen önce `gorevleriKaydet()` ekle:

```js
const gorevEkle = (metin) => {
  const yeniGorev = { id: sonrakiId, metin: metin, tamamlandi: false };
  gorevler.push(yeniGorev);
  sonrakiId = sonrakiId + 1;

  gorevleriKaydet();
  // ← EKLENDİ: her veri değişikliğinde hemen kaydet
  listeyiEkranaCiz();
};

const gorevTamamlaToggle = (id) => {
  gorevler = gorevler.map((gorev) =>
    gorev.id === id ? { ...gorev, tamamlandi: !gorev.tamamlandi } : gorev
  );

  gorevleriKaydet();
  // ← EKLENDİ
  listeyiEkranaCiz();
};

const gorevSil = (id) => {
  gorevler = gorevler.filter((gorev) => gorev.id !== id);

  gorevleriKaydet();
  // ← EKLENDİ
  listeyiEkranaCiz();
};
```

Test et: birkaç görev ekle, bazılarını tamamla, sayfayı yenile (F5). **Her şey aynen orada durmalı.** Tarayıcı sekmesini tamamen kapatıp tekrar açsan bile veriler kalıcı — bu localStorage'ın gücü.

💡 Tarayıcı DevTools'ta (F12) "Application" sekmesi → "Local Storage" → sitenin adresine tıklayarak kayıtlı veriyi ham JSON string olarak görebilirsin. Debug ederken çok işine yarayacak.

**Küçük zafer:** Uygulaman artık "gerçek" — kullanıcı verisi kaybolmuyor. Bu, oyuncak projeyle gerçek ürün arasındaki farkın önemli bir parçası.
**Terim defteri:** `localStorage`, `setItem/getItem/removeItem`, `JSON.stringify/parse`, `Math.max(...dizi)`
**Çıktı:** Sayfa yenilenince veri kaybolmayan, kalıcı to-do app.
**Commit:** `git commit -m "hafta-04 g4: localstorage ile kalicilik"`

---

## Gün 5 — Refactor: Temiz Kod İlk Tadımı

### 0:00–1:00 · Refactor nedir, neden yapılır

**Refactor** = kodun DAVRANIŞINI değiştirmeden, İÇ YAPISINI daha okunabilir/düzenli hale getirmek. Dört gündür hızlı ilerledin, kod muhtemelen tek dosyada, biraz dağınık. Bugün DURUP, çalışan kodu **bozmadan** temizleyeceğiz.

Refactor'a başlamadan önce altın kural:

```
1. Önce çalıştığından emin ol (tarayıcıda test et, hepsi çalışıyor mu?)
2. Küçük adımlarla değiştir
3. Her adımdan sonra TEKRAR test et
4. Bir şey bozulursa hemen geri al (git sana burada yardım eder — bu yüzden sık commit önemli)
```

`script.js` dosyanı en üstten en alta oku. Kendine sor:
- İsimler anlamlı mı? (`li`, `x`, `temp` gibi belirsiz isimler var mı?)
- Aynı kod parçası birden fazla yerde tekrar mı ediyor?
- Bir fonksiyon çok fazla iş mi yapıyor (hem veri değiştirip hem DOM'a dokunuyor mu)?

### 1:00–2:00 · Fonksiyonları mantıksal bölümlere ayır

Dosyanın en üstüne, hangi bölümün ne işe yaradığını gösteren yorum başlıkları ekle — küçük ama okunurluğu ciddi artıran bir alışkanlık:

```js
// ============================================
// VERİ (state) VE SABİTLER
// ============================================

const KAYIT_ANAHTARI = "elif-todo-gorevler";

const gorevleriYukle = () => {
  const kayitliVeri = localStorage.getItem(KAYIT_ANAHTARI);
  return kayitliVeri === null ? [] : JSON.parse(kayitliVeri);
};

let gorevler = gorevleriYukle();
let sonrakiId =
  gorevler.length > 0 ? Math.max(...gorevler.map((g) => g.id)) + 1 : 1;

// ============================================
// DOM REFERANSLARI
// ============================================

const formElement = document.querySelector("#gorev-form");
const inputElement = document.querySelector("#gorev-input");
const listeElement = document.querySelector("#gorev-listesi");
const bosMesajElement = document.querySelector("#bos-mesaj");

// ============================================
// VERİ İŞLEMLERİ (gorevler dizisini değiştiren fonksiyonlar)
// ============================================

const gorevleriKaydet = () => {
  localStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(gorevler));
};

const gorevEkle = (metin) => {
  gorevler.push({ id: sonrakiId, metin: metin, tamamlandi: false });
  sonrakiId = sonrakiId + 1;
  gorevleriKaydet();
  listeyiEkranaCiz();
};

const gorevTamamlaToggle = (id) => {
  gorevler = gorevler.map((gorev) =>
    gorev.id === id ? { ...gorev, tamamlandi: !gorev.tamamlandi } : gorev
  );
  gorevleriKaydet();
  listeyiEkranaCiz();
};

const gorevSil = (id) => {
  gorevler = gorevler.filter((gorev) => gorev.id !== id);
  gorevleriKaydet();
  listeyiEkranaCiz();
};

// ============================================
// EKRANA ÇİZME (render)
// ============================================

const gorevSatiriOlustur = (gorev) => {
  // BÜYÜK forEach bloğunu KENDİ fonksiyonuna çıkardık — "tek bir görev için
  // bir <li> oluştur" işi artık ayrı, test edilebilir, okunabilir bir birim
  const li = document.createElement("li");

  const metinSpan = document.createElement("span");
  metinSpan.textContent = gorev.metin;
  if (gorev.tamamlandi) {
    metinSpan.classList.add("tamamlandi");
  }

  const tamamlaButon = document.createElement("button");
  tamamlaButon.textContent = "✓";
  tamamlaButon.classList.add("mini-buton", "tamamla-buton");
  tamamlaButon.dataset.id = gorev.id;

  const silButon = document.createElement("button");
  silButon.textContent = "✕";
  silButon.classList.add("mini-buton", "sil-buton");
  silButon.dataset.id = gorev.id;

  li.appendChild(metinSpan);
  li.appendChild(tamamlaButon);
  li.appendChild(silButon);

  return li;
};

const listeyiEkranaCiz = () => {
  listeElement.innerHTML = "";

  bosMesajElement.style.display = gorevler.length === 0 ? "block" : "none";
  // uzun if/else yerine ternary (? :) kullanarak tek satıra indirdik —
  // ternary: kosul ? kosulDogruysaBu : kosulYanlisEğerBu

  gorevler.forEach((gorev) => {
    const li = gorevSatiriOlustur(gorev);
    listeElement.appendChild(li);
  });
};

// ============================================
// OLAY DİNLEYİCİLERİ (event listeners)
// ============================================

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const girilenMetin = inputElement.value.trim();
  if (girilenMetin === "") return;

  gorevEkle(girilenMetin);
  inputElement.value = "";
});

listeElement.addEventListener("click", (event) => {
  const tiklananId = Number(event.target.dataset.id);

  if (event.target.classList.contains("tamamla-buton")) {
    gorevTamamlaToggle(tiklananId);
  }
  if (event.target.classList.contains("sil-buton")) {
    gorevSil(tiklananId);
  }
});

// ============================================
// BAŞLANGIÇ
// ============================================

listeyiEkranaCiz();
```

### 2:00–3:00 · Test et, karşılaştır, küçük iyileştirmeler

Sayfayı baştan aç, TÜM özellikleri tekrar test et: ekleme, tamamlama, silme, sayfa yenileme. Hiçbiri bozulmamalı — refactor'ın tanımı gereği **davranış aynı kalır**, sadece kod daha okunaklı hale gelir.

Küçük bir iyileştirme daha ekle — aynı görev metnini iki kere eklemeyi engelle (opsiyonel ama iyi bir pratik):

```js
const gorevEkle = (metin) => {
  const zatenVarMi = gorevler.some((gorev) => gorev.metin === metin);
  // .some(): dizide KOŞULU sağlayan EN AZ BİR eleman var mı, true/false döner
  // (find'a benzer ama eleman değil, sadece true/false döner)

  if (zatenVarMi) {
    alert("Bu görev zaten listede!");
    // alert: basit bir tarayıcı uyarı kutusu — hızlı geri bildirim için kullanışlı
    return;
  }

  gorevler.push({ id: sonrakiId, metin: metin, tamamlandi: false });
  sonrakiId = sonrakiId + 1;
  gorevleriKaydet();
  listeyiEkranaCiz();
};
```

💡 **Bugünün asıl dersi kod değil, alışkanlık:** Bir özelliği "çalışıyor" diye bırakmak yerine, ara sıra durup "bunu daha temiz yazabilir miyim" diye sormak. Bu alışkanlık, deneyimli geliştiriciyi acemiden ayıran en büyük farklardan biri.

**Küçük zafer:** Aynı davranışa sahip ama çok daha okunabilir, bölümlere ayrılmış, isimlendirmesi net bir kod tabanın var — "çalışıyor" ile "iyi yazılmış" arasındaki farkı ilk kez yaşadın.
**Terim defteri:** `refactor`, `ternary (? :)`, `.some()`, `kod bölümleme/yorum başlıkları`
**Çıktı:** Refactor edilmiş, aynı davranışlı, daha temiz `script.js`.
**Commit:** `git commit -m "hafta-04 g5: refactor - fonksiyonlara bolme ve temizlik"`

---

## Gün 6 — Git Akışı + Deploy + Stack Kararı Review

### 0:00–1:00 · Gerçek bir git akışı: branch kullan

Şimdiye kadar hep direkt `main` üzerinde çalıştın — küçük projeler için sorun değil, ama artık gerçek bir alışkanlık kazanma vakti: **branch (dal)** açıp orada çalışmak, bitince `main`'e birleştirmek.

```bash
cd ~/elif-fullstack/hafta-04/todo-app

git checkout -b ozellik/readme-ve-son-dokunuslar
# checkout -b: yeni bir branch oluştur VE ona geç
# İsimlendirme: ozellik/... , duzeltme/... gibi ön ekler kullanmak yaygın bir kural
```

Bu branch'te küçük bir iyileştirme daha yap — bir README ekle (projeyi başka biri görse ne olduğunu anlasın):

`README.md`:

```markdown
# Yapılacaklar Listesi (To-Do App)

Sıfırdan HTML, CSS ve JavaScript ile yazılmış, localStorage ile kalıcı veri saklayan bir to-do uygulaması.

## Özellikler
- Görev ekleme
- Görev tamamlama / geri alma
- Görev silme
- Sayfa yenilense de veriler kaybolmuyor (localStorage)

## Kullanılan teknolojiler
- Saf HTML/CSS/JavaScript (framework yok)
- localStorage (tarayıcı depolama)

## Nasıl çalıştırılır
`index.html` dosyasını tarayıcıda aç — kurulum gerekmiyor.

## Canlı link
(deploy sonrası buraya link gelecek)
```

Değişiklikleri commit'le, sonra `main`'e birleştir:

```bash
git add .
git commit -m "docs: readme eklendi"

git checkout main
# main branch'ine geri dön

git merge ozellik/readme-ve-son-dokunuslar
# merge: branch'teki değişiklikleri main'e BİRLEŞTİR

git branch -d ozellik/readme-ve-son-dokunuslar
# -d: işi biten branch'i sil (main'e birleştiği için artık gereksiz)
```

💡 Küçük, tek kişilik projelerde her özellik için branch açmak gereksiz görünebilir ama **alışkanlık** olarak şimdi kurman lazım — Hafta 5'ten sonra (özellikle takım projelerinde) bu, standart iş akışı olacak.

### 1:00–2:00 · Anlamlı commit mesajları + deploy

Commit geçmişini gözden geçir:

```bash
git log --oneline
# --oneline: her commit'i tek satırda, kısa özet olarak göster
```

İyi bir commit mesajı formülü: `<ne yapıldı>: <kısaca neden/ne>` — "fix", "feat", "docs", "refactor" gibi ön ekler endüstride yaygın (buna "conventional commits" denir, opsiyonel ama iyi bir alışkanlık):

```bash
git commit -m "feat: gorev ekleme ozelligi"      # yeni özellik
git commit -m "fix: bos gorev eklenebilme hatasi" # hata düzeltme
git commit -m "refactor: fonksiyonlari ayirma"    # davranış değişmeden temizlik
git commit -m "docs: readme guncellendi"          # sadece dokümantasyon
```

Şimdi GitHub'a push et ve Vercel'e deploy et (Hafta 2 ve 3'te yaptığın akışın aynısı):

```bash
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/elif-todo-app.git
git push -u origin main
```

Vercel → "Add New" → "Project" → reponu import et → Framework: "Other" → Deploy.

Canlı link geldiğinde, `README.md`'deki "canlı link" satırını güncelle, tekrar commit + push et — Vercel otomatik yeni deploy başlatacak (Hafta 2'de gördüğün CI/CD akışı).

### 2:00–3:00 · Stack kararını gözden geçir

Faz 1 bitiyor, Faz 2'de React'e geçeceksin. Bu iyi bir an, geri dönüp şu soruyu netleştirelim: **neden JavaScript/TypeScript, neden Python değil?**

```
JavaScript/TypeScript'in avantajı:
- TEK dille hem frontend (tarayıcı) hem backend (Node.js) yazabiliyorsun
  → Python seçseydin, frontend için YİNE JS öğrenmen gerekecekti (tarayıcı sadece JS anlar)
- React, Vue, Next.js gibi en büyük frontend ekosistemi JS/TS üzerine kurulu
- İş ilanlarında "fullstack JS/TS" en yaygın taleplerden biri
- TypeScript (Hafta 5'te göreceğin), JS'e "tip güvenliği" ekleyip büyük projelerde hataları
  yazım anında yakalamanı sağlıyor — Python'da bu opsiyonel ve daha az yaygın

Python nerede güçlü:
- Veri bilimi, makine öğrenmesi, otomasyon script'leri
- Backend-only projelerde (Django, FastAPI) çok rahat
- Ama SENİN hedefin fullstack + embedded (IoT, Hafta 11-13) — JS/TS + Node bu ikisini
  daha az sürtünmeyle birbirine bağlıyor
```

Bu kararı bir cümleyle kendi sözlerinle yaz (bu dosyanın altına ya da bir not defterine): neden JS/TS stack'inde devam ettiğini açıklayabiliyor musun? Açıklayamıyorsan Roy ile konuş — bu, sadece "böyle söylendi" diye değil, **anlayarak** ilerlemen için önemli.

**Küçük zafer:** İlk kez branch açtın, birleştirdin, anlamlı commit mesajları yazdın — ve stack tercihinin ARKASINDAKİ mantığı artık kendi cümlelerinle savunabiliyorsun.
**Terim defteri:** `branch`, `checkout -b`, `merge`, `conventional commits`, `stack tercihi`
**Çıktı:** 🌐 `https://elif-todo-app.vercel.app` (kendi linkin) + düzenli commit geçmişi + README'li repo.
**Commit:** `git commit -m "hafta-04 g6: git akisi, deploy, readme"`

---

## Gün 7 — Review + Faz 2 (React) Önizleme

Kod yazma zorunluluğu yok. Roy ile 30-45 dk (bu hafta Faz 1 kapanışı olduğu için biraz daha uzun sürebilir):

1. **Teach-back:** localStorage'ın ne işe yaradığını, JSON.stringify/parse çiftini, event delegation'ın neden gerekli olduğunu, immutable güncelleme (`map`/`filter` ile yeni dizi oluşturma) mantığını kendi cümlelerinle anlat.
2. **İki canlı linkini yan yana göster** (Hafta 2'deki landing page + bu haftaki to-do app) — dört haftada ne kadar yol katettiğini gör.
3. **Faz 1 retrospektifi:** Hangi gün en çok zorlandın? Hangi kavram hâlâ tam oturmadı? (Bu, Faz 2'ye geçmeden düzeltilecek boşlukları bulmak için önemli — utanılacak bir şey değil, normal süreç.)
4. **Faz 2 (React) önizlemesi açılır:** Hafta 5'ten itibaren, bugün elle yazdığın `listeyiEkranaCiz`, `gorevEkle`, state yönetimi gibi kavramları **React'in kendi sözdizimiyle** (component, useState, JSX) tekrar göreceksin — iyi haber: mantığı zaten öğrendin, sadece yazım şekli değişecek. React, senin bugün elle kurduğun "veri değişince ekranı yeniden çiz" desenini SENİN YERİNE otomatik yapan bir kütüphane.

**Faz 1 özet (Hafta 1-4):** Terminalden başladın, git öğrendin, JavaScript'in temellerini gördün. HTML ile iskelet kurdun, CSS ile (box model, flexbox, grid, responsive) giydirdin, DOM ve event'lerle etkileşim kattın. Modern JS'e (ES6, dizi metotları, async/await) geçtin, gerçek bir API'den veri çektin. Son olarak sıfırdan, planlı, refactor edilmiş, kalıcı veri saklayan, git akışı düzgün, canlıya alınmış bir uygulama yazdın.

Dört hafta önce terminal bile yeniydi. Şimdi elinde iki canlı site, düzenli bir GitHub geçmişi ve bir sonraki fazda işine yarayacak sağlam bir temel var. Faz 2'de React ile bu temel çok daha hızlı büyüyecek.
