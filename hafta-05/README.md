# Hafta 5 — React'e Giriş (Faz 2)

> **Hedef:** React'in üç temel fikrini — **bileşen**, **props**, **state** — gerçekten anlamak; ezber değil, "neden böyle" seviyesinde.
> **Çıktı:** ✔ 🌐 Statik veriyle çalışan bir kart galerisi, canlı.
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Hafta 1-4'te saf JavaScript ile DOM'u **elle** yönettin: `querySelector` ile elemanı bul, `addEventListener` ile olayı yakala, `textContent`/`classList` ile ekranı **sen** güncelle. localStorage projende muhtemelen fark ettin — uygulama büyüdükçe "hangi elemanı ne zaman güncelleyeceğim" takibi zorlaşıyor, bir yeri unutursan ekran state'le senkron kalmıyor.

İşte tam burada **React** devreye giriyor. Faz 2 boyunca öğreneceğin her şey üç kelimeye dayanıyor:

- **Bileşen (component)** → arayüzü küçük, tekrar kullanılabilir Lego parçalarına bölmek
- **Props** → bir bileşene dışarıdan veri geçmek (yukarıdan aşağı)
- **State** → bir bileşenin kendi hafızası, değişince ekran **kendiliğinden** güncellenir

Bu hafta sonunda React'i "hissetmiş" olacaksın. Faz 2'nin geri kalanı (Hafta 6-7) bu üçünün üstüne inşa edilecek.

**Çalışma klasörün:** Bu hafta boyunca `hafta-05/kart-galerisi/` klasöründe çalışacaksın — Gün 1'de `npm create vite` ile bu klasörü sen oluşturacaksın, hazır beklemiyor.

---

## Gün 1 — Neden React + Vite Kurulumu

### 0:00–1:00 · Neden React var?

Önce eski yöntemin acısını hatırla. Vanilla JS'te bir sayaç yapmak istersen böyle yazardın:

```js
// Vanilla JS'te sayaç: HER DOM değişikliğini SEN takip ediyorsun
let sayac = 0;
const sayacEl = document.querySelector("#sayac");
const artirBtn = document.querySelector("#artir");

artirBtn.addEventListener("click", function () {
  sayac++;
  sayacEl.textContent = sayac; // ekranı SEN güncelliyorsun — unutursan bug, sessizce
});
```

Küçük bir örnekte sorun yok. Ama 10 farklı yerde veri değişiyorsa, her birinde "ekranı da güncellemeyi unutma" demek zorunda kalırsın. Bu, projeler büyüdükçe en çok bug'ın çıktığı yer.

React'in fikri şu: **sen sadece "veri şu olursa ekran böyle görünsün" dersin, DOM'u kim güncelleyecek diye SEN uğraşmazsın — React uğraşır.** Buna **declarative** (bildirimsel) yaklaşım denir; vanilla JS'teki yönteme ise **imperative** (buyurgan) denir — "şunu yap, sonra bunu yap" diye adım adım komut veriyordun.

Bunun üstüne kurulan ikinci fikir: **bileşen**. Bir web sayfasını tek bir dev HTML dosyası olarak değil, küçük, bağımsız, tekrar kullanılabilir parçalar (buton, kart, header, form...) olarak düşünürsün. Her parça kendi görünümünü ve kendi mantığını taşır.

```jsx
// Bu, Hafta 5'in özeti — birazdan gerçekten yazacağın şeye bir önizleme:
function Sayac() {
  // React'e "count değişince ekranı böyle göster" diyorsun.
  // DOM güncellemesini SEN yapmıyorsun, React yapıyor.
  return <button>Say: {count}</button>;
}
```

Şu an bu kod çalışmaz (henüz `count` tanımlı değil, henüz React kurulu değil) — sadece şeklini gör. Gün 4'te tam bunu yazacaksın.

💡 React bir "dil" değil, bir **kütüphane**. JavaScript'in üstüne inşa edilmiş, arayüz kurmayı kolaylaştıran bir araç seti. Yazdığın her şey hâlâ JavaScript.

### 1:00–2:00 · Vite ile proje kurulumu

**Vite** (Fransızca "hızlı" demek, "vit" diye okunur), React projeni sıfırdan kurup geliştirme sırasında anında yenileyen bir araç. Terminalde:

```bash
# hafta-05 klasörüne git
cd ~/elif-fullstack/hafta-05

# React + Vite projesi oluştur (JavaScript şablonuyla başlıyoruz, TypeScript Hafta 7'de)
npm create vite@latest kart-galerisi -- --template react

# Oluşan klasöre gir
cd kart-galerisi

# Bağımlılıkları indir (node_modules klasörünü oluşturur)
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Terminalde `Local: http://localhost:5173/` gibi bir satır göreceksin. O linke tarayıcıdan git — kırmızı arka planlı bir React logosu ve bir sayaç göreceksin. Bu, Vite'ın hazır demo sayfası.

💡 `npm run dev` çalışırken terminal "kilitli" gibi durur (yeni komut yazamazsın) — bu normal, sunucu orada çalışıyor demek. Durdurmak için `Control + C`. Yeni bir komut çalıştırman gerekirse yeni bir terminal sekmesi aç.

Şimdi klasör yapısına bak:

```
kart-galerisi/
├── index.html          <- tarayıcının açtığı TEK html dosyası
├── package.json        <- proje bağımlılıkları + komutlar (npm run dev, build...)
├── src/
│   ├── main.jsx         <- React'in "giriş kapısı" — App'i sayfaya bağlar
│   ├── App.jsx          <- ana bileşen, bu hafta çoğunlukla burada çalışacaksın
│   ├── App.css
│   └── index.css
└── public/              <- hiç değişmeyen statik dosyalar (favicon vb.)
```

`src/index.html` dosyasını aç (VS Code'da) — `<body>` içinde neredeyse sadece `<div id="root"></div>` göreceksin. Sayfa neredeyse boş! Çünkü bütün arayüz React tarafından JavaScript ile, çalışma anında oluşturuluyor.

Şimdi `src/main.jsx`'e bak:

```jsx
// main.jsx — React uygulamasının başlangıç noktası
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// index.html içindeki <div id="root">'u bul, App bileşenini içine "monte et"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Bu dosyaya bu hafta neredeyse hiç dokunmayacaksın — o "React'i sayfaya bağlayan fiş" gibi düşün, bir kere takılır, unutulur. Asıl işin `App.jsx` ve ondan doğacak diğer bileşen dosyalarında.

### 2:00–3:00 · İlk dokunuş — App.jsx'i değiştir, canlı yenilemeyi gör

`src/App.jsx` dosyasını aç, içindeki her şeyi sil, kendi halini yaz:

```jsx
// src/App.jsx
function App() {
  return (
    <div>
      <h1>Merhaba, ben Elif'in ilk React uygulaması</h1>
      <p>Bugün: {new Date().toLocaleDateString('tr-TR')}</p>
    </div>
  )
}

export default App
```

Kaydet (`Cmd+S`), tarayıcıya bak — sayfayı YENİLEMEDEN, otomatik olarak yeni içerik göründü. Buna **HMR** (Hot Module Replacement — sıcak modül değişimi) denir: Vite, değiştirdiğin dosyayı anında tarayıcıya gönderir, sayfa baştan yüklenmez.

Bir deney yap: `<h1>` içindeki yazıyı değiştir, kaydet, ne kadar hızlı değiştiğini izle. Sonra bilerek bir hata yap — mesela `</div>` etiketini sil, kaydet. Tarayıcıda kırmızı bir hata ekranı (overlay) göreceksin, dosyayı geri yapıştırınca kaybolacak. Bu overlay'e Faz 2 boyunca sık sık bakacaksın — React hatanın TAM olarak nerede olduğunu söylemeye çalışır, korkma, oku.

💡 `npm run dev` terminali açık kalmalı ki HMR çalışsın. Terminali kapatırsan (ya da Control+C basarsan) sayfa "bu site'e ulaşılamıyor" hatası verir — sadece `npm run dev`'i tekrar çalıştır.

**Küçük zafer:** Kendi React projeni sıfırdan kurdun ve tarayıcıda kendi yazdığın metni gördün — ilk "gerçek" React satırların ekranda.
**Terim defteri:** `bileşen (component)`, `declarative vs imperative`, `Vite`, `dev server`, `HMR (Hot Module Replacement)`
**Çıktı:** `localhost:5173`'te "Merhaba, ben Elif'in ilk React uygulaması" yazan bir sayfa.
**Commit:**
```bash
cd ~/elif-fullstack/hafta-05/kart-galerisi
git init
git add .
git commit -m "hafta-05 g1: vite + react proje kurulumu"
```

---

## Gün 2 — JSX ve Bileşenler

### 0:00–1:00 · JSX nedir, kuralları neler

Dün yazdığın `<div><h1>...</h1></div>` HTML gibi görünüyor ama aslında `.jsx` dosyası içinde, bir JavaScript fonksiyonunun içinde. Buna **JSX** denir (JavaScript XML). Tarayıcı JSX'i doğrudan anlamaz — Vite, arka planda onu düz JavaScript'e çevirir:

```jsx
// Bu JSX satırı:
const el = <h1 className="baslik">Merhaba</h1>

// Aslında derlenince (arka planda, sen görmesen de) buna dönüşür:
const el = React.createElement('h1', { className: 'baslik' }, 'Merhaba')
```

JSX'i "HTML yazıyormuş gibi JavaScript üretmenin kısayolu" olarak düşün. Dört önemli kural:

```jsx
function Ornek() {
  const isim = 'Elif'
  const sayi = 5

  return (
    <> {/* Fragment: gereksiz bir <div> ile sarmalamak istemediğinde kullanılır */}
      <h2 className="baslik">Merhaba, {isim}</h2>
      {/* Kural 1: class YAZILMAZ, className yazılır — "class" JS'te ayrılmış bir kelime */}

      <p>2 kere {sayi} eder: {sayi * 2}</p>
      {/* Kural 2: {} içine JS İFADESİ (expression) yazabilirsin — değişken, hesap, fonksiyon çağrısı */}

      {sayi > 3 && <p>Üçten büyük bir sayı!</p>}
      {/* Kural 3: if/else YAZAMAZSIN içeride, bunun yerine && veya ? : kullanılır */}
    </>
    // Kural 4: return içinde TEK bir "kök" (root) eleman olmalı — burada o kök <> Fragment
  )
}
```

💡 En sık yapılan hata: `{}` içine `if (sayi > 3) { ... }` yazmaya çalışmak. `{}` içine sadece bir **değer üreten** ifade koyabilirsin (`5 + 3`, `isim`, `sayi > 3 && <p>...</p>`), "adım adım yap" diyen bir **statement** (if, for, while) koyamazsın.

### 1:00–2:00 · İlk gerçek bileşenlerin

Bir React bileşeni, aslında JSX döndüren sıradan bir JavaScript fonksiyonu. Tek kural: **isim büyük harfle başlamalı.**

```jsx
// src/App.jsx
function Baslik() {
  return <h1>Elif'in Kart Galerisi</h1>
}

function Aciklama() {
  return <p>Bu proje, React öğrenirken yaptığım ilk galeri.</p>
}

function App() {
  return (
    <div>
      <Baslik />
      <Aciklama />
    </div>
  )
}

export default App
```

Kaydet, tarayıcıya bak — `Baslik` ve `Aciklama` bileşenleri, kendi HTML etiketlerinmiş gibi `<Baslik />` ve `<Aciklama />` olarak kullanılıyor.

💡 Bileşen isimleri **mutlaka** büyük harfle başlar (PascalCase: `Baslik`, `KartListesi`). Küçük harfle başlarsa (`baslik`) React onu senin bileşenin değil, normal bir HTML etiketi (`<baslik>` gibi, tarayıcının tanımadığı) sanır ve JSX derleyicisi seni uyarır.

### 2:00–3:00 · Bileşenleri ayrı dosyalara böl

Tek dosyada 3-5 bileşen sorun değil, ama proje büyüdükçe her bileşeni kendi dosyasına taşımak okunabilirliği katlar. Bir `components` klasörü aç:

```jsx
// src/components/Baslik.jsx
function Baslik() {
  return <h1>Elif'in Kart Galerisi</h1>
}

export default Baslik
```

```jsx
// src/components/Aciklama.jsx
function Aciklama() {
  return <p>Bu proje, React öğrenirken yaptığım ilk galeri.</p>
}

export default Aciklama
```

```jsx
// src/App.jsx
import Baslik from './components/Baslik.jsx'
import Aciklama from './components/Aciklama.jsx'

function App() {
  return (
    <div>
      <Baslik />
      <Aciklama />
    </div>
  )
}

export default App
```

Kaydet, tarayıcıya bak — hiçbir şey görsel olarak değişmedi, ama artık kod 3 ayrı dosyaya yayılmış durumda. Bu Hafta 2'deki HTML/CSS/JS ayrımına çok benziyor: sayfayı parçalara böl, her parça kendi işine baksın. Fark: artık her parça bir JS fonksiyonu.

💡 `export default X` = "bu dosyanın dışarıya verdiği ANA şey X" demek. `import X from './yol'` = "o dosyadan X'i buraya getir" demek. Dosya adıyla import ettiğin isim birebir aynı olmak zorunda değil ama okunabilirlik için aynı tutmak iyi bir alışkanlık.

**Küçük zafer:** Aynı sayfayı 3 ayrı dosyaya böldün ve hâlâ sorunsuz çalıştığını gördün — "kod büyürse ne olacak" korkusu bitti.
**Terim defteri:** `JSX`, `Fragment (<>...</>)`, `fonksiyon bileşeni`, `export default / import`, `PascalCase`
**Çıktı:** `App.jsx` artık sadece diğer bileşenleri birleştiren bir "iskelet", gerçek içerik `components/` altında.
**Commit:** `git add -A && git commit -m "hafta-05 g2: jsx temelleri + bilesenleri ayri dosyalara bolme"`

---

## Gün 3 — Props: Veriyi Aşağı Geçirmek

### 0:00–1:00 · Props nedir

Bir JS fonksiyonuna parametre geçtiğin gibi, bir bileşene de **props** geçebilirsin. Fark: fonksiyon çağrısı yerine JSX attribute'u kullanırsın.

```jsx
// Normal bir JS fonksiyonu parametre alır:
function selamla(isim) {
  return `Merhaba, ${isim}`
}
selamla('Elif')
selamla('Ahmet')

// Bileşen de aynı mantıkla "props" alır — sadece syntax farklı:
function Selamla({ isim }) {
  return <p>Merhaba, {isim}</p>
}

// Kullanımı:
// <Selamla isim="Elif" />
// <Selamla isim="Ahmet" />
```

Props aslında **tek bir obje** olarak gelir. `{ isim }` yazman aslında bir **destructuring** (obje parçalama) — Hafta 3-4'te dizi/obje üzerinde gördüğün aynı JS özelliği:

```jsx
// props'u destructure ETMEDEN de yazabilirsin (ama daha az temiz görünür):
function Selamla(props) {
  return <p>Merhaba, {props.isim}</p>
}

// Genelde direkt parçalarız — hangi prop'ları beklediğin de baştan görünür:
function Selamla({ isim }) {
  return <p>Merhaba, {isim}</p>
}
```

### 1:00–2:00 · Tek Kart bileşeni, farklı props

Şimdi bu hafta sonunda kullanacağın `Kart` bileşenini yaz:

```jsx
// src/components/Kart.jsx
function Kart({ baslik, aciklama, resimUrl }) {
  return (
    <div className="kart">
      <img src={resimUrl} alt={baslik} />
      <h3>{baslik}</h3>
      <p>{aciklama}</p>
    </div>
  )
}

export default Kart
```

```jsx
// src/App.jsx
import Kart from './components/Kart.jsx'

function App() {
  return (
    <div className="galeri">
      <Kart
        baslik="React"
        aciklama="Bileşen tabanlı bir arayüz kütüphanesi"
        resimUrl="https://placehold.co/300x200?text=React"
      />
      <Kart
        baslik="Vite"
        aciklama="Hızlı geliştirme sunucusu ve build aracı"
        resimUrl="https://placehold.co/300x200?text=Vite"
      />
      <Kart
        baslik="JSX"
        aciklama="HTML gibi görünen ama JavaScript olan syntax"
        resimUrl="https://placehold.co/300x200?text=JSX"
      />
    </div>
  )
}

export default App
```

Kaydet, tarayıcıya bak — **tek** bir `Kart` bileşeni yazdın ama 3 farklı görünüm elde ettin. Sadece props değişti. Bu, React'in en temel gücü: **"yaz bir kere, kullan çok kere."**

`https://placehold.co/300x200?text=React` gerçek bir resim servisi — internet varsa çalışır, üzerinde "React" yazan gri bir kutu döner. İleride kendi görsellerinle değiştireceksin.

### 2:00–3:00 · children prop ve default değerler

`children`, bir bileşenin açılış ve kapanış etiketleri **arasına** yazdığın her şeyi temsil eden özel bir prop:

```jsx
// children: bir bileşenin AÇILIŞ ve KAPANIŞ etiketi arasına yazılan her şey
function Kutu({ children }) {
  return <div className="kutu">{children}</div>
}

// Kullanımı:
// <Kutu>
//   <h2>Başlık</h2>
//   <p>Bu içerik Kutu'nun children'ı olarak geliyor.</p>
// </Kutu>
```

Bir prop verilmezse ne olacağını da belirtebilirsin — **default değer**:

```jsx
// aciklama prop'una varsayılan bir değer ver:
function Kart({ baslik, aciklama = 'Açıklama eklenmedi', resimUrl }) {
  return (
    <div className="kart">
      <img src={resimUrl} alt={baslik} />
      <h3>{baslik}</h3>
      <p>{aciklama}</p>
    </div>
  )
}

// aciklama VERMESEN de bileşen kırılmaz, varsayılan metni gösterir:
// <Kart baslik="Node.js" resimUrl="https://placehold.co/300x200?text=Node" />
```

`Kart.jsx`'ini bu şekilde güncelle, `App.jsx`'te bir kartın `aciklama` prop'unu sil, tarayıcıda "Açıklama eklenmedi" yazısını gör.

💡 Props **sadece yukarıdan aşağı** akar (parent → child). Bir `Kart`, kendi aldığı props'u değiştiremez — bunu değiştirmeye çalışırsan React sessizce görmezden gelir ya da konsola uyarı basar. Buna **tek yönlü veri akışı** (one-way data flow) denir. Hafta 6'da "lifting state up" konusunda bu kuralla tekrar karşılaşacaksın.

**Küçük zafer:** Tek bir `Kart` bileşeniyle 3'ten fazla farklı içerikli kart ürettin — kopyala-yapıştır yapmadan.
**Terim defteri:** `props`, `destructuring`, `children`, `default prop değeri`, `tek yönlü veri akışı`
**Çıktı:** 3 farklı içerikli kart, tek `Kart` bileşeninden üretiliyor.
**Commit:** `git add -A && git commit -m "hafta-05 g3: props ile tekrar kullanilabilir kart bileseni"`

---

## Gün 4 — State: Ekranı Süren Veri

### 0:00–1:00 · State nedir, useState nasıl çalışır

Props dışarıdan gelir ve **değiştirilemez**. Peki bir bileşenin **kendi** değişebilen verisi olması gerekiyorsa (bir sayaç, açık/kapalı bir menü, yazılan bir yazı)? İşte bu **state**.

```jsx
import { useState } from 'react'

function Sayac() {
  // useState(baslangicDegeri) -> [mevcutDeger, degistirenFonksiyon]
  const [sayi, setSayi] = useState(0)

  return (
    <div>
      <p>Sayı: {sayi}</p>
      <button onClick={() => setSayi(sayi + 1)}>+1</button>
    </div>
  )
}
```

`useState` bir **hook** — React'in sana bileşen içinde "hafıza" ve başka yetenekler kazandıran özel fonksiyonlarına bu ad veriliyor (Hafta 6'da bir hook daha, `useEffect`, göreceksin). `useState(0)` çağrısı sana iki şey verir: **mevcut değer** (`sayi`) ve o değeri **değiştiren fonksiyon** (`setSayi`).

Neden normal bir değişken (`let sayi = 0`) yeterli değil? Çünkü değiştirsen bile React'in bundan haberi olmaz, ekran **güncellenmez**:

```jsx
// BU ÇALIŞMAZ — normal değişken değişse de ekran güncellenmez:
function KirikSayac() {
  let sayi = 0
  return (
    <button onClick={() => { sayi++; console.log(sayi) }}>
      Sayı: {sayi}
    </button>
  )
  // konsolda sayı gerçekten artar, ama ekrandaki "Sayı: 0" yazısı HİÇ değişmez —
  // çünkü React'e "yeniden çiz" diyen hiçbir şey yok
}
```

`setSayi` çağrıldığında React'e "bu bileşeni yeniden render et" der — ve React yeni `sayi` değeriyle ekranı otomatik günceller. İşte bu, Gün 1'de bahsettiğimiz "declarative" yaklaşımın kalbi.

### 1:00–2:00 · Sayaç: artır, azalt, sıfırla

`src/components/Sayac.jsx` oluştur:

```jsx
// src/components/Sayac.jsx
import { useState } from 'react'

function Sayac() {
  const [sayi, setSayi] = useState(0)

  const artir = () => setSayi(sayi + 1)
  const azalt = () => setSayi(sayi - 1)
  const sifirla = () => setSayi(0)

  return (
    <div className="sayac">
      <h2>{sayi}</h2>
      <button onClick={azalt}>-1</button>
      <button onClick={sifirla}>Sıfırla</button>
      <button onClick={artir}>+1</button>
    </div>
  )
}

export default Sayac
```

`App.jsx`'e ekle, tarayıcıda üç butona da tıkla, sayının gerçekten değiştiğini gör.

```jsx
import Sayac from './components/Sayac.jsx'
// App'in return'üne <Sayac /> ekle
```

💡 **En yaygın React başlangıç hatası:** `onClick={artir}` yaz, `onClick={artir()}` YAZMA. Parantez koyarsan fonksiyonu **hemen, render sırasında** çalıştırırsın — butona tıklamayı beklemez. Fonksiyonun kendisini (referansını) React'e veriyorsun, çalıştırmayı React tıklama anında yapacak.

### 2:00–3:00 · Fonksiyonel güncelleme, birden fazla state

Eğer yeni state değeri **eski değere bağlıysa**, `setSayi(sayi + 1)` yerine fonksiyon formu daha güvenlidir:

```jsx
// Fonksiyon formu: React'e "her ne ise, ondan bir fazlasını yap" de
const artir = () => setSayi(oncekiSayi => oncekiSayi + 1)

// Neden önemli? Art arda hızlı çağrılarda "oncekiSayi" HER ZAMAN güncel değeri alır.
// setSayi(sayi + 1) yazıp aynı anda iki kere çağırsaydın, ikisi de aynı "eski"
// sayi değerini görebilir, beklediğin gibi +2 değil +1 olabilirdi.
```

Bir bileşende birden fazla `useState` çağrısı olabilir, her biri bağımsız çalışır:

```jsx
function ProfilKart() {
  const [isim, setIsim] = useState('Elif')
  const [begeniSayisi, setBegeniSayisi] = useState(0)

  return (
    <div>
      <h3>{isim}</h3>
      <p>❤️ {begeniSayisi}</p>
      <button onClick={() => setBegeniSayisi(onceki => onceki + 1)}>Beğen</button>
    </div>
  )
}
```

Bu `ProfilKart`'ı da dene, `App.jsx`'e ekle, "Beğen" butonuna birkaç kere hızlıca tıkla.

**Küçük zafer:** Tıkladığında GERÇEKTEN değişen, "canlı" bir arayüz yaptın — artık statik bir sayfa değil, etkileşimli bir uygulama.
**Terim defteri:** `state`, `useState`, `hook`, `render (yeniden çizim)`, `fonksiyonel güncelleme`
**Çıktı:** Artır/azalt/sıfırla çalışan bir sayaç bileşeni.
**Commit:** `git add -A && git commit -m "hafta-05 g4: usestate ile calisan sayac"`

---

## Gün 5 — Liste ve key

### 0:00–1:00 · Bir diziyi .map ile bileşenlere çevir

Hafta 3-4'te `.map()` ile bir diziyi başka bir diziye çevirmeyi öğrenmiştin (örn. sayıları ikiye katlamak). Burada da aynı `.map()` — ama bu sefer sayı yerine JSX üretiyor:

```jsx
const teknolojiler = [
  { id: 1, ad: 'React' },
  { id: 2, ad: 'Vite' },
  { id: 3, ad: 'JSX' },
]

function TeknolojiListesi() {
  return (
    <ul>
      {teknolojiler.map((t) => (
        <li key={t.id}>{t.ad}</li>
      ))}
    </ul>
  )
}
```

Mantık birebir aynı: `.map()` diziyi gezer, her eleman için bir şey üretir, hepsini yeni bir dizi olarak döner — burada üretilen şey sadece bir sayı değil, bir `<li>` elemanı.

### 1:00–2:00 · key neden gerekli

`key` olmadan React konsola sarı bir uyarı basar:

```jsx
// key OLMADAN — React uyarı verir, listeyi takip etmekte zorlanır:
{teknolojiler.map((t) => <li>{t.ad}</li>)}  // ❌

// key VARSA — React her elemanı kendi "kimliğiyle" takip eder:
{teknolojiler.map((t) => <li key={t.id}>{t.ad}</li>)}  // ✅
```

`key`'i **dizinin index'i** olarak kullanmak cazip gelir ama genelde kötü bir fikirdir — özellikle liste sıralanabiliyor, eleman eklenip siliniyorsa:

```jsx
// index'i key olarak kullanmak RİSKLİDİR:
{teknolojiler.map((t, index) => <li key={index}>{t.ad}</li>)}  // ⚠️

// Neden? Listenin ORTASINDAN bir eleman silinirse index'ler kayar.
// React "3. sıradaki eleman" diye takip ettiği için yanlış elemanı
// yanlış veriyle eşleştirebilir — input değerleri karışabilir,
// animasyonlar yanlış elemana uygulanabilir.
```

💡 `key`, ekranda görünmeyen ama React'in "bu eleman bu, o eleman o" diye ayırt etmesini sağlayan bir etiket — her kartın arkasına yapıştırdığın görünmez bir barkod gibi düşün. Elinde her zaman benzersiz bir `id` varsa (veritabanından geliyorsa, ya da sen üretiyorsan) onu kullan, index'i sadece gerçekten başka seçeneğin yoksa (liste hiç değişmiyorsa) düşün.

### 2:00–3:00 · Dinamik liste: ekle ve sil

Şimdi state + liste + kullanıcı girdisini birleştir:

```jsx
// src/components/GorevListesi.jsx
import { useState } from 'react'

function GorevListesi() {
  const [gorevler, setGorevler] = useState([
    { id: 1, metin: 'React öğren' },
    { id: 2, metin: 'Kart galerisi yap' },
  ])
  const [yeniGorev, setYeniGorev] = useState('')

  const gorevEkle = () => {
    if (yeniGorev.trim() === '') return
    const yeni = { id: Date.now(), metin: yeniGorev }
    setGorevler([...gorevler, yeni]) // ESKİ diziyi kopyala, sonuna yeni ekle
    setYeniGorev('')
  }

  const gorevSil = (id) => {
    setGorevler(gorevler.filter((g) => g.id !== id)) // id'si eşleşmeyenleri tut
  }

  return (
    <div>
      <input
        value={yeniGorev}
        onChange={(e) => setYeniGorev(e.target.value)}
        placeholder="Yeni görev..."
      />
      <button onClick={gorevEkle}>Ekle</button>

      <ul>
        {gorevler.map((g) => (
          <li key={g.id}>
            {g.metin}
            <button onClick={() => gorevSil(g.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GorevListesi
```

`App.jsx`'e ekle, tarayıcıda görev yaz, ekle, sil — hepsini dene.

💡 `[...gorevler, yeni]` — state'i **asla direkt değiştirme** (`gorevler.push(yeni)` YAZMA). Her zaman **yeni** bir dizi/obje oluştur. React bir şeyin değiştiğini anlamak için referansın (belleğe işaret eden "adresin") değiştiğine bakar; aynı diziyi olduğu yerde mutasyona uğratırsan React'in haberi bile olmaz, ekran güncellenmez. Bu, Gün 4'teki "state'i doğrudan değiştirme" kuralının dizi/obje versiyonu.

**Küçük zafer:** State, liste render'ı ve kullanıcı girdisini birleştirip gerçek bir "ekle/sil" arayüzü yaptın — bu artık küçük bir uygulama.
**Terim defteri:** `.map()` ile render, `key`, `immutability (değiştirilemezlik)`, `spread (...)`, `.filter()`
**Çıktı:** Görev ekleyip silebildiğin, çalışan bir liste.
**Commit:** `git add -A && git commit -m "hafta-05 g5: dinamik gorev listesi (ekle/sil) + key"`

---

## Gün 6 — Mini Proje: Kart Galerisi + Vercel Deploy

### 0:00–1:00 · Proje planı ve veri dosyası

Bugün her şeyi birleştiriyorsun: statik bir veri kaynağı (`data.js`), tek bir `Kart` bileşeni, `.map()` ile üretilen bir galeri, ve bir deploy. `src/data.js` oluştur:

```js
// src/data.js — statik veri, gerçek bir API yokmuş gibi düşün
export const projeler = [
  {
    id: 1,
    baslik: 'Terminal Notları',
    aciklama: 'Hafta 1: terminal komutlarını öğrenirken tuttuğum notlar.',
    resimUrl: 'https://placehold.co/400x250?text=Terminal',
    etiket: 'Hafta 1',
  },
  {
    id: 2,
    baslik: 'DOM Oyunu',
    aciklama: 'Hafta 2: saf JS ile DOM manipülasyonu üzerine küçük bir oyun.',
    resimUrl: 'https://placehold.co/400x250?text=DOM',
    etiket: 'Hafta 2',
  },
  {
    id: 3,
    baslik: 'Görev Takip Uygulaması',
    aciklama: 'Hafta 4: localStorage ile veri saklayan, fetch kullanan proje.',
    resimUrl: 'https://placehold.co/400x250?text=Todo',
    etiket: 'Hafta 4',
  },
  {
    id: 4,
    baslik: 'Kart Galerisi',
    aciklama: 'Hafta 5: ilk React projem — şu an baktığın bu sayfa!',
    resimUrl: 'https://placehold.co/400x250?text=React',
    etiket: 'Hafta 5',
  },
]
```

### 1:00–2:00 · Galeriyi kur

`Kart.jsx`'i son bir kez güncelle (`etiket` prop'unu ekle):

```jsx
// src/components/Kart.jsx
function Kart({ baslik, aciklama, resimUrl, etiket }) {
  return (
    <div className="kart">
      <img src={resimUrl} alt={baslik} />
      <span className="etiket">{etiket}</span>
      <h3>{baslik}</h3>
      <p>{aciklama}</p>
    </div>
  )
}

export default Kart
```

```jsx
// src/App.jsx
import Kart from './components/Kart.jsx'
import { projeler } from './data.js'
import './App.css'

function App() {
  return (
    <div className="sayfa">
      <h1>Elif'in Proje Galerisi</h1>
      <div className="galeri">
        {projeler.map((p) => (
          <Kart
            key={p.id}
            baslik={p.baslik}
            aciklama={p.aciklama}
            resimUrl={p.resimUrl}
            etiket={p.etiket}
          />
        ))}
      </div>
    </div>
  )
}

export default App
```

`src/App.css`'e grid düzenini ekle (Hafta 2'de gördüğün CSS Grid'in aynısı):

```css
/* src/App.css */
.galeri {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.kart {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kart img {
  width: 100%;
  display: block;
}

.kart .etiket {
  display: inline-block;
  margin: 0.75rem 0 0 0.75rem;
  padding: 0.2rem 0.6rem;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 999px;
  font-size: 0.75rem;
}

.kart h3,
.kart p {
  padding: 0 0.75rem;
}

.kart p {
  padding-bottom: 0.75rem;
  color: #555;
}
```

Tarayıcıya bak — 4 kartlık, ızgara düzeninde bir galeri görmelisin. Pencereyi daraltıp genişlet, `auto-fit` sayesinde kart sayısının satır başına otomatik ayarlandığını gör.

### 2:00–3:00 · Vercel'e deploy et

Önce build'in gerçekten çalıştığından emin ol:

```bash
# Production build oluştur (dist/ klasörüne)
npm run build

# Build çıktısını lokal olarak önizle
npm run preview
```

Sorun yoksa deploy et — Hafta 4'te Vercel ile bir kez deneyimin var, akış aynı:

```bash
# Vercel CLI ile deploy (ilk seferse npx sana kurulum/login isteyecek)
npx vercel

# Sorular gelecek: proje ismi, framework auto-detect (Vite) -> hepsine Enter'la geçebilirsin

# Sonucundan memnunsan, production'a al:
npx vercel --prod
```

💡 Vite projelerinde Vercel framework'ü otomatik tanır (`build command: vite build`, `output: dist`). Hafta 4'teki vanilla JS deploy'undan tek fark bu — orada framework yoktu, Vercel dosyaları olduğu gibi sunuyordu; burada `vite.config.js`'i görüp build ayarlarını kendisi dolduruyor.

Son olarak commit'le ve GitHub'a push'la (repo henüz GitHub'a bağlı değilse, `git remote add origin <repo-url>` ile bağla).

**Küçük zafer:** Sıfırdan kurduğun bir React projesini internete koydun — artık paylaşılabilir bir link'in var.
**Terim defteri:** statik veri, `grid-template-columns`, `npm run build`, `npm run preview`, `vercel --prod`
**Çıktı:** 🌐 canlı link — 4 kart gösteren bir proje galerisi sayfası.
**Commit:** `git add -A && git commit -m "hafta-05 g6: kart galerisi mini projesi + deploy" && git push`

---

## Gün 7 — Pazar Review

Bugün kod yazmıyorsun (istersen küçük bir dokunuş yaparsın ama şart değil). Roy ile 30 dk:

1. **Teach-back:** Props ile state arasındaki farkı kendi cümlelerinle anlat. Şu tabloyu ezbere değil, mantığıyla anlatabilmelisin:

   | | Props | State |
   |---|---|---|
   | Kim verir | Ebeveyn (parent) bileşen | Bileşenin kendisi |
   | Değiştirilebilir mi | Hayır (read-only) | Evet (`setX` ile) |
   | Değişince ne olur | Parent değiştirirse child yeniden render olur | `setX` çağrılınca bileşen yeniden render olur |
   | Analoji | Fonksiyon parametresi | Fonksiyonun kendi hafızası (ama React'in izlediği) |

2. **Kod okuma testi:** Aşağıdaki kodda bir bug var, bulabilir misin?

   ```jsx
   function Kart({ begeniSayisi }) {
     const begen = () => {
       begeniSayisi = begeniSayisi + 1 // ???
     }
     return <button onClick={begen}>❤️ {begeniSayisi}</button>
   }
   ```

   *(Cevap: `begeniSayisi` bir **prop**, doğrudan değiştirilemez — hem React kuralına aykırı hem de değişse bile ekran güncellenmez, çünkü state değil. Doğrusu: bu bileşende `useState(begeniSayisi)` ile kendi state'ini tutmak, ya da `begeniSayisi`'ni ve onu değiştiren fonksiyonu parent'tan prop olarak almak.)*

3. **Canlı linkini göster.** Galerinin farklı ekran genişliklerinde (pencereyi daraltıp genişleterek) düzgün davrandığını göster.

4. **Hafta 6'nın önizlemesi:** Gelecek hafta bileşenlerin gerçek bir API'den veri çekmesini (`useEffect`), form yazmayı, ve `react-router-dom` ile çok sayfalı bir uygulama kurmayı öğreneceksin.

**Bu hafta özet:** Vite ile bir React projesi kurdun, JSX'in kurallarını öğrendin, bileşenleri props ile parametrize ettin, `useState` ile "gerçekten canlı" bir arayüz yazdın, bir diziyi `.map()` + `key` ile listeye çevirdin ve her şeyi birleştirip canlıya aldın. Props vs state ayrımı — bu haftanın en kritik kavramı — artık senin.
