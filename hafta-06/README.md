# Hafta 6 — React Derinleşme (Faz 2)

> **Hedef:** Bir React uygulamasının gerçek bir API'den veri çekmesini, kullanıcı girdisi almasını, farklı durumları (yükleniyor/boş/hata) ayrı göstermesini ve birden çok sayfaya sahip olmasını sağlamak.
> **Çıktı:** ✔ 🌐 Aranabilir bir kitap listesi + detay sayfası, canlı.
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Hafta 5'te bileşen, props ve state'i öğrendin — ama şimdiye kadar tüm verin **statik**, kod içine yazılmış haldeydi. Gerçek uygulamalar veriyi bir sunucudan çeker, kullanıcıdan girdi alır, ve birden fazla sayfa arasında gezinir. Bu hafta üçünü de kuruyorsun:

- **useEffect** → bileşen ekrana gelince (ya da bir şey değişince) bir "yan etki" çalıştırmak — en tipik örnek: veri çekmek
- **Controlled form** → kullanıcının yazdığını state'te tutmak
- **react-router-dom** → tek bir sayfa yerine, URL'e göre değişen birden fazla "sayfa"

Bu üçünü birleştirdiğinde ortaya gerçek bir web uygulaması çıkıyor: kitap ara, sonuçlara tıkla, detay sayfasına git.

**API notu:** Bu hafta boyunca [Open Library'nin arama API'sini](https://openlibrary.org/search.json?q=harry+potter) kullanacaksın — ücretsiz, kayıt/API key gerektirmiyor, doğrudan `fetch` ile çalışıyor.

**Çalışma klasörün:** `hafta-06/kitap-arama/` — Gün 1'de `npm create vite@latest kitap-arama -- --template react` ile oluştur.

---

## Gün 1 — useEffect: Bileşen Yüklenince Veri Çek

### 0:00–1:00 · useEffect nedir, ne zaman kullanılır

Bir bileşenin render'ı (JSX döndürmesi) ile bir bileşenin "yan etkileri" (side effects) React'te bilinçli olarak ayrılır. Yan etki = render'ın dışında olan, dünyayla etkileşen her şey: bir API'ye istek atmak, `setTimeout` kurmak, tarayıcı başlığını değiştirmek...

```jsx
import { useEffect, useState } from 'react'

function KitapListesi() {
  const [kitaplar, setKitaplar] = useState([])

  useEffect(() => {
    // Bileşen İLK KEZ ekrana geldiğinde (mount olduğunda) çalışır
    fetch('https://openlibrary.org/search.json?q=harry+potter&limit=5')
      .then((res) => res.json())
      .then((veri) => setKitaplar(veri.docs))
  }, []) // <- boş dizi: "sadece bir kere çalış" demek

  return (
    <ul>
      {kitaplar.map((k) => (
        <li key={k.key}>{k.title}</li>
      ))}
    </ul>
  )
}

export default KitapListesi
```

`useEffect(fonksiyon, bağımlılıklar)` şeklinde çağrılır. İkinci parametre (`[]`) React'e "bu efekti ne zaman tekrar çalıştır" sorusunun cevabını verir.

### 1:00–2:00 · fetch ile veri çekme — async/await versiyonu

Hafta 3-4'te `async/await`'i öğrenmiştin. `useEffect`'in verdiği fonksiyon **doğrudan** `async` olamaz (React bunu desteklemez), ama içine `async` bir fonksiyon tanımlayıp hemen çağırabilirsin:

```jsx
useEffect(() => {
  // ❌ useEffect'in callback'i DİREKT async olamaz:
  // useEffect(async () => { ... }, [])   <- bunu yazma

  // ✅ İçeride async bir fonksiyon tanımla, sonra hemen çağır:
  async function kitaplariGetir() {
    const res = await fetch('https://openlibrary.org/search.json?q=harry+potter&limit=5')
    const veri = await res.json()
    setKitaplar(veri.docs)
  }
  kitaplariGetir()
}, [])
```

`kitap-arama` projeni kur (Hafta 5'teki gibi `npm create vite`, `npm install`, `npm run dev`), `KitapListesi.jsx`'i bu haliyle `src/components/` altına yaz, `App.jsx`'e ekle. Tarayıcıda sayfa açılır açılmaz 5 kitap adının listelendiğini gör.

### 2:00–3:00 · Bağımlılık dizisini derinlemesine anla

Bağımlılık dizisinin üç hali var, farkını iyi otur:

```jsx
useEffect(() => {
  console.log('HER render sonrası çalışır')
}) // dizi YOK -> her render'da tekrar çalışır (genelde İSTEMEDİĞİN durum, sonsuz döngüye bile girebilir)

useEffect(() => {
  console.log('SADECE ilk render sonrası çalışır')
}, []) // boş dizi -> sadece mount'ta (ilk ekrana gelişte) bir kere

useEffect(() => {
  console.log('sorgu her değiştiğinde çalışır')
}, [sorgu]) // sorgu değişkeni her değiştiğinde tekrar çalışır
```

Bir de **cleanup** (temizlik) fonksiyonu var — `useEffect`'in döndürdüğü fonksiyon, bileşen ekrandan kalkarken (unmount) çalışır:

```jsx
useEffect(() => {
  const zamanlayici = setInterval(() => console.log('tık'), 1000)

  // cleanup: bileşen ekrandan kaldırılırken çalışır.
  // Yoksa zamanlayıcı arka planda çalışmaya devam eder — buna "memory leak" denir.
  return () => clearInterval(zamanlayici)
}, [])
```

Bu haftaki projede cleanup'a çok ihtiyacın olmayacak ama var olduğunu bilmen önemli — Gün 4'te yazacağın custom hook'ta tekrar karşına çıkacak.

💡 React DevTools (tarayıcı eklentisi, opsiyonel) ile bir bileşenin kaç kere render olduğunu görebilirsin. `console.log` ile de aynı fikri test edebilirsin: `useEffect`'in içine ve bileşen fonksiyonunun en üstüne birer `console.log` koy, konsolda hangisinin ne zaman çalıştığını izle.

**Küçük zafer:** React uygulaman ilk kez gerçek bir API'den, internetten veri çekti.
**Terim defteri:** `useEffect`, `yan etki (side effect)`, `bağımlılık dizisi`, `mount/unmount`, `cleanup fonksiyonu`
**Çıktı:** Sayfa açılınca otomatik 5 kitap adı listeleyen bir bileşen.
**Commit:**
```bash
cd ~/elif-fullstack/hafta-06/kitap-arama
git init
git add .
git commit -m "hafta-06 g1: useeffect ile ilk api cagrisi"
```

---

## Gün 2 — Form ve Controlled Input

### 0:00–1:00 · Controlled component kavramı

Vanilla HTML'de bir `<input>` kendi değerini kendi tutar — tarayıcı DOM'unun bir parçasıdır. React'te bunun yerine **state'i** tek doğruluk kaynağı yaparız, buna **controlled component** (kontrollü bileşen) denir:

```jsx
import { useState } from 'react'

function AramaKutusu() {
  const [sorgu, setSorgu] = useState('')

  return (
    <input
      type="text"
      value={sorgu}                              // input'un değeri React state'inden gelir
      onChange={(e) => setSorgu(e.target.value)}  // her tuş vuruşunda state güncellenir
      placeholder="Kitap ara..."
    />
  )
}
```

`value={sorgu}` ile input'un ne göstereceğini React belirliyor; `onChange` ile de her karakter girişinde state'i güncelliyorsun. İkisi birlikte bir döngü kurar: sen yaz → `onChange` tetiklenir → state değişir → React input'u yeni state'le yeniden çizer.

```jsx
// "Controlled" olmanın faydası: input'un değerini PROGRAMATİK olarak da değiştirebilirsin
<button onClick={() => setSorgu('')}>Temizle</button>
```

### 1:00–2:00 · Form submit yakalama

Bir `<form>` içinde submit butonuna basıldığında (ya da input'ta Enter'a basıldığında) tarayıcının **varsayılan davranışı** sayfayı yenilemektir — SPA'da bunu istemezsin:

```jsx
function AramaFormu() {
  const [sorgu, setSorgu] = useState('')

  const gonderildi = (e) => {
    e.preventDefault() // tarayıcının "sayfayı yenile" davranışını ENGELLE
    console.log('Aranan:', sorgu)
  }

  return (
    <form onSubmit={gonderildi}>
      <input value={sorgu} onChange={(e) => setSorgu(e.target.value)} />
      <button type="submit">Ara</button>
    </form>
  )
}
```

Bunu `App.jsx`'e ekle, arama kutusuna bir şey yaz, Enter'a bas ya da "Ara" butonuna tıkla, konsolda yazdığını gör. `e.preventDefault()` satırını bilerek sil, sayfanın yenilendiğini (ve konsol çıktısının kaybolduğunu) gözlemle, sonra geri ekle.

### 2:00–3:00 · Birden fazla input, form state objesi

Tek input'ta her şey basit; birden fazla input olunca hepsine ayrı `useState` açmak yerine **tek bir obje** kullanmak daha temiz:

```jsx
function ProfilFormu() {
  const [form, setForm] = useState({ ad: '', email: '' })

  const guncelle = (e) => {
    const { name, value } = e.target
    setForm((onceki) => ({ ...onceki, [name]: value })) // sadece değişen alanı güncelle
  }

  return (
    <form>
      <input name="ad" value={form.ad} onChange={guncelle} placeholder="Adın" />
      <input name="email" value={form.email} onChange={guncelle} placeholder="E-posta" />
    </form>
  )
}
```

💡 `name` attribute'unu `e.target.name` ile okuyup `[name]: value` (computed property name — Hafta 3-4'te obje köşesinde görmüş olabilirsin) ile TEK bir `guncelle` fonksiyonuyla tüm input'ları yönetiyoruz. `{ ...onceki, [name]: value }` — önce eski objenin tüm alanlarını kopyala, sonra sadece değişeni üzerine yaz. Gün 1'deki "state'i doğrudan değiştirme" kuralı burada da geçerli: `form.ad = value` YAZMA, her zaman yeni bir obje üret.

**Küçük zafer:** Kullanıcı yazdıkça state'in anlık güncellendiğini konsolda gördün — controlled input mantığı artık elinde.
**Terim defteri:** `controlled component`, `onChange`, `e.target.value`, `e.preventDefault()`, `computed property name`
**Çıktı:** Submit edilince konsola yazdığın değeri basan bir arama formu.
**Commit:** `git add -A && git commit -m "hafta-06 g2: controlled form ile arama kutusu"`

---

## Gün 3 — Durum Render: Loading / Boş / Hata

### 0:00–1:00 · Neden bu üç durumu ayrı göstermelisin

Şu ana kadarki `fetch` çağrıların hep "başarılı ve hızlı" senaryoyu varsaydı. Gerçek dünyada üç şey olabilir: **veri henüz gelmedi** (loading), **veri geldi ama boş** (empty), **istek başarısız oldu** (error). Bu üçünü ayrı göstermezsen kullanıcı "uygulama donmuş mu" diye düşünür — kötü bir deneyim.

### 1:00–2:00 · loading/error state'leri + try/catch/finally

```jsx
import { useState } from 'react'

function KitapArama() {
  const [sonuclar, setSonuclar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState(null)

  const ara = async (sorgu) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${sorgu}&limit=10`)
      if (!res.ok) throw new Error('Sunucu hatası: ' + res.status)
      const veri = await res.json()
      setSonuclar(veri.docs)
    } catch (err) {
      setHata(err.message)
    } finally {
      setYukleniyor(false) // başarılı da olsa, hata da olsa yükleme biter
    }
  }

  // ... arama tetikleyici form Gün 5-6'da tam projede birleşecek

  if (yukleniyor) return <p>Yükleniyor...</p>
  if (hata) return <p className="hata">Hata: {hata}</p>
  if (sonuclar.length === 0) return <p>Henüz sonuç yok, bir arama yap.</p>

  return (
    <ul>
      {sonuclar.map((k) => (
        <li key={k.key}>{k.title}</li>
      ))}
    </ul>
  )
}

export default KitapArama
```

Bu bileşeni projene ekle, önceki günkü form ile birleştirip `ara(sorgu)`'yu submit'te çağır (tam entegrasyonu Gün 6'da yapacaksın, şimdilik `ara('harry potter')`'ı bir butona bağlayıp dene).

### 2:00–3:00 · Durumları gerçekten gözlemle

Chrome DevTools'u aç (`Cmd+Opt+I`), **Network** sekmesine git, üstteki hız seçiciden **Slow 3G**'yi seç. Sayfayı yenile, arama yap — "Yükleniyor..." yazısının artık gözle görülür şekilde ekranda kaldığını fark edeceksin. Sonra hızı normale döndür.

Hata durumunu test etmek için: `fetch` URL'ini bilerek bozuk yaz (`openlibrary.org` yerine `openlibrary.orgg` gibi), aramayı dene, "Hata: ..." mesajının göründüğünü gör. Sonra URL'i düzelt.

💡 Bu dört `if` bir **durum makinesi** (state machine) gibi düşünülebilir: her an uygulaman ya yükleniyor, ya hata verdi, ya boş, ya da sonuç gösteriyor — asla ikisi birden değil. Kontrol sırası önemli: `yukleniyor`'u en başta kontrol etmezsen, yükleme sırasında hem "yükleniyor" hem "henüz sonuç yok" mesajları çakışabilir.

**Küçük zafer:** Ağı yavaş simüle edip "Yükleniyor..." yazısını gerçekten, gözle gördün — artık soyut bir kavram değil.
**Terim defteri:** `loading state`, `error state`, `empty state`, `try/catch/finally`, `erken return (early return)`
**Çıktı:** Yükleniyor/hata/boş/sonuç durumlarının hepsini ayrı ayrı gösteren bir arama bileşeni.
**Commit:** `git add -A && git commit -m "hafta-06 g3: loading/error/empty durum renderlari"`

---

## Gün 4 — Bileşen Mimarisi: Lifting State Up

### 0:00–1:00 · State nerede yaşamalı — "en yakın ortak ata" kuralı

Şu ana kadar her bileşen kendi state'ini tuttu. Ama iki **kardeş** bileşen (aynı parent'ın çocukları) aynı veriye ihtiyaç duyarsa ne olur?

```jsx
// ❌ YANLIŞ: sorgu state'i AramaKutusu içinde hapsolmuş,
// SonucListesi bu veriye hiç ulaşamıyor
function AramaKutusu() {
  const [sorgu, setSorgu] = useState('')
  return <input value={sorgu} onChange={(e) => setSorgu(e.target.value)} />
}

function SonucListesi() {
  // sorgu'ya buradan erişimin YOK — bu iki bileşen birbirinden habersiz
  return <p>???</p>
}
```

Çözüm, state'i **en yakın ortak ataya** (iki bileşenin de üstünde olan ilk parent'a) taşımak — buna **lifting state up** denir:

```jsx
// ✅ DOĞRU: state'i EN YAKIN ORTAK ATA'ya taşı (App),
// aşağıya props ile geçir
function App() {
  const [sorgu, setSorgu] = useState('')

  return (
    <div>
      <AramaKutusu sorgu={sorgu} setSorgu={setSorgu} />
      <SonucListesi sorgu={sorgu} />
    </div>
  )
}

function AramaKutusu({ sorgu, setSorgu }) {
  return <input value={sorgu} onChange={(e) => setSorgu(e.target.value)} />
}

function SonucListesi({ sorgu }) {
  return <p>Aranan: {sorgu}</p>
}
```

💡 Kural basit: **iki bileşen aynı veriye ihtiyaç duyuyorsa, o veriyi ikisinin de ortak ebeveyninde tut.** Bu örnekte `App`, `AramaKutusu` ve `SonucListesi`'nin ortak atası. `AramaKutusu` state'i değiştirir (`setSorgu` ile), `SonucListesi` sadece okur — ikisi de aynı tek doğruluk kaynağına bağlı.

Kendi projende bunu dene: dün yazdığın `KitapArama` bileşenindeki `sorgu` ve arama mantığını `App.jsx`'e taşı, `AramaKutusu` ve `SonucListesi` diye iki ayrı bileşene böl.

### 1:00–2:00 · Props drilling'i gör

State'i yukarı taşımanın bir maliyeti var: veri artık **her seviyeden geçmek zorunda**, aradaki bileşenler o veriyi kullanmasa bile:

```jsx
// props drilling: veri App -> Sayfa -> Panel -> Widget'a kadar
// HER seviyeden geçmek zorunda, ama Sayfa ve Panel bu veriyi HİÇ kullanmıyor,
// sadece bir alttakine "aktarıyor" (drilling = delme)
function App() {
  const [kullanici, setKullanici] = useState({ ad: 'Elif' })
  return <Sayfa kullanici={kullanici} />
}
function Sayfa({ kullanici }) {
  return <Panel kullanici={kullanici} /> // sadece aktarıyor
}
function Panel({ kullanici }) {
  return <Widget kullanici={kullanici} /> // sadece aktarıyor
}
function Widget({ kullanici }) {
  return <p>Merhaba, {kullanici.ad}</p> // burada gerçekten kullanılıyor
}
```

💡 2-3 seviye props drilling normaldir, dert etme. 5-6 seviyeyi geçerse (ya da çok fazla bileşen aynı veriye ihtiyaç duyarsa) `useContext` gibi araçlar devreye girer — bunu şimdilik sadece bilmen yeterli, ileri fazlarda tekrar göreceksin.

### 2:00–3:00 · Kendi projende uygula

`App.jsx`'te state'i tut, `AramaKutusu`, `SonucListesi`, ve varsa loading/error göstergelerini ayrı bileşenlere böl, hepsine gereken props'u props drilling ile geçir. Bu, Gün 6'daki mini projenin iskeleti olacak.

**Küçük zafer:** "State nerede yaşamalı" sorusuna kod yazmadan ÖNCE, kafanda cevap verebilir hale geldin.
**Terim defteri:** `lifting state up`, `ortak ata (common ancestor)`, `props drilling`, `tek doğruluk kaynağı`
**Çıktı:** Arama kutusu ve sonuç listesi `App`'te ortak state paylaşan, ayrı bileşenlere bölünmüş bir yapı.
**Commit:** `git add -A && git commit -m "hafta-06 g4: state'i ortak ataya tasi (lifting state up)"`

---

## Gün 5 — Router: Çok Sayfalı Yapı

### 0:00–1:00 · SPA'da routing nedir, kurulum

Şu ana kadarki uygulaman **tek sayfa** (Single Page Application — SPA): tarayıcı hiç yenilenmiyor, her şey aynı `index.html` içinde JS ile değişiyor. Ama kullanıcı bir kitaba tıklayınca "detay sayfasına gitmiş" hissi vermek istersen, URL'in de değişmesi lazım (`/kitap/123` gibi) — işte bunu `react-router-dom` sağlıyor.

```bash
npm install react-router-dom
```

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>   {/* tüm uygulamayı routing ile sarmala */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### 1:00–2:00 · Routes, Route, Link

```jsx
// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom'
import AnaSayfa from './pages/AnaSayfa.jsx'
import KitapDetay from './pages/KitapDetay.jsx'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Ana Sayfa</Link>
      </nav>

      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/kitap/:id" element={<KitapDetay />} />
      </Routes>
    </div>
  )
}

export default App
```

`src/pages/` klasörü aç, iki basit sayfa yaz:

```jsx
// src/pages/AnaSayfa.jsx
import { Link } from 'react-router-dom'

function AnaSayfa() {
  const kitaplar = [
    { id: 'OL1', baslik: 'Harry Potter' },
    { id: 'OL2', baslik: 'Yüzüklerin Efendisi' },
  ]

  return (
    <ul>
      {kitaplar.map((k) => (
        <li key={k.id}>
          <Link to={`/kitap/${k.id}`}>{k.baslik}</Link>
        </li>
      ))}
    </ul>
  )
}

export default AnaSayfa
```

```jsx
// src/pages/KitapDetay.jsx
import { Link } from 'react-router-dom'

function KitapDetay() {
  return (
    <div>
      <Link to="/">&larr; Geri</Link>
      <h2>Kitap detayı</h2>
    </div>
  )
}

export default KitapDetay
```

💡 `<Link to="/">` kullan, `<a href="/">` **DEĞİL**. `<a>` tüm sayfayı tarayıcıdan yeniden ister (SPA mantığını bozar, yavaşlatır), `<Link>` sadece React içinde JS ile geçiş yapar — tarayıcı hiç yenilenmez.

### 2:00–3:00 · useParams ile URL'den veri okuma

`KitapDetay.jsx`'i güncelle, `useParams` ile URL'deki `:id` kısmını yakala:

```jsx
// src/pages/KitapDetay.jsx
import { useParams, Link } from 'react-router-dom'

function KitapDetay() {
  const { id } = useParams() // URL'deki :id kısmını yakalar, örn /kitap/OL1 -> id = "OL1"

  return (
    <div>
      <Link to="/">&larr; Geri</Link>
      <h2>Kitap detayı: {id}</h2>
      {/* Gün 6'da burada gerçek API verisi çekeceğiz */}
    </div>
  )
}

export default KitapDetay
```

Tarayıcıda test et: ana sayfadan bir kitaba tıkla, URL çubuğunun `/kitap/OL1` gibi değiştiğini gör, tarayıcının **geri** butonuna bas, ana sayfaya döndüğünü gör.

**Küçük zafer:** Sayfa hiç yenilenmeden URL'i değişen, geri/ileri tuşları çalışan bir uygulaman oldu.
**Terim defteri:** `SPA (Single Page Application)`, `react-router-dom`, `<Route>`, `<Link>`, `useParams`
**Çıktı:** Ana sayfa + kitap detay sayfası arasında gezinen, URL'i değişen bir uygulama.
**Commit:** `git add -A && git commit -m "hafta-06 g5: react-router ile cok sayfali yapi"`

---

## Gün 6 — Mini Proje: Aranabilir Kitap Listesi + Deploy

### 0:00–1:00 · Ana sayfa: arama + sonuç listesi

Bugün Gün 1-5'te öğrendiğin her şeyi birleştiriyorsun. `src/pages/AnaSayfa.jsx`'i tamamen yeniden yaz:

```jsx
// src/pages/AnaSayfa.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

function AnaSayfa() {
  const [sorgu, setSorgu] = useState('')
  const [sonuclar, setSonuclar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState(null)

  const aramaYap = async (e) => {
    e.preventDefault()
    if (sorgu.trim() === '') return

    setYukleniyor(true)
    setHata(null)
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(sorgu)}&limit=12`
      )
      if (!res.ok) throw new Error('Arama başarısız oldu')
      const veri = await res.json()
      setSonuclar(veri.docs)
    } catch (err) {
      setHata(err.message)
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div>
      <form onSubmit={aramaYap}>
        <input
          value={sorgu}
          onChange={(e) => setSorgu(e.target.value)}
          placeholder="Kitap adı yaz..."
        />
        <button type="submit">Ara</button>
      </form>

      {yukleniyor && <p>Aranıyor...</p>}
      {hata && <p className="hata">{hata}</p>}
      {!yukleniyor && !hata && sonuclar.length === 0 && <p>Bir kitap ara.</p>}

      <ul className="sonuc-listesi">
        {sonuclar.map((kitap) => (
          <li key={kitap.key}>
            <Link to={`/kitap/${kitap.key.replace('/works/', '')}`}>
              {kitap.title} {kitap.author_name ? `— ${kitap.author_name[0]}` : ''}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AnaSayfa
```

💡 `kitap.key` Open Library'den `"/works/OL82586W"` gibi gelir. Route'umuz `/kitap/:id` şeklinde tanımlı olduğu için `key`'in başındaki `/works/` kısmını temizleyip sadece `OL82586W`'i URL'e koyuyoruz — detay sayfasında geri ekleyeceğiz.

### 1:00–2:00 · Detay sayfası: kendi API çağrısı

```jsx
// src/pages/KitapDetay.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function KitapDetay() {
  const { id } = useParams() // örn: "OL82586W"
  const [kitap, setKitap] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function detayGetir() {
      setYukleniyor(true)
      const res = await fetch(`https://openlibrary.org/works/${id}.json`)
      const veri = await res.json()
      setKitap(veri)
      setYukleniyor(false)
    }
    detayGetir()
  }, [id]) // id değişirse (başka bir kitaba geçilirse) tekrar çalış

  if (yukleniyor) return <p>Yükleniyor...</p>
  if (!kitap) return <p>Kitap bulunamadı.</p>

  return (
    <div>
      <Link to="/">&larr; Geri</Link>
      <h2>{kitap.title}</h2>
      <p>
        {typeof kitap.description === 'string'
          ? kitap.description
          : kitap.description?.value ?? 'Açıklama bulunamadı.'}
      </p>
    </div>
  )
}

export default KitapDetay
```

💡 `kitap.description` Open Library'de bazen düz bir `string`, bazen `{ value: "..." }` şeklinde bir obje olarak geliyor — API'ler her zaman tutarlı olmayabilir, `typeof` ile kontrol edip ikisini de karşılıyoruz. `?.` (optional chaining) ve `??` (nullish coalescing) Hafta 3-4'ten hatırlayacağın operatörler.

Tarayıcıda dene: bir kitap ara, sonuca tıkla, detay sayfasında başlık ve açıklamanın geldiğini gör, "Geri"ye tıkla, farklı bir kitap dene — `id` değiştiği için `useEffect`'in tekrar çalıştığını (yeni veri geldiğini) doğrula.

### 2:00–3:00 · Deploy

```bash
npm run build
npm run preview
npx vercel --prod
```

💡 **Routing + Vercel özel durumu:** react-router kullanan projelerde, kullanıcı `/kitap/OL82586W` sayfasını **direkt yenilerse** (F5) ya da linki paylaşırsa, Vercel varsayılan olarak "sayfa bulunamadı" (404) verebilir — çünkü sunucuda gerçekten `/kitap/OL82586W` diye bir dosya yok, o sayfayı React tarayıcıda JS ile üretiyor. Çözüm: proje köküne `vercel.json` ekle.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Bu, gelen **her** isteği `index.html`'e yönlendirir; `index.html` yüklenince react-router tarayıcıdaki URL'i okuyup doğru sayfayı gösterir. Bu dosyayı ekledikten sonra tekrar `npx vercel --prod` çalıştır, deploy edilen linkte bir detay sayfasını **direkt** açıp (adres çubuğuna URL'i yapıştırıp) F5'e basarak test et — artık 404 vermemeli.

**Küçük zafer:** Gerçek bir API'yi arayan, sonuçlara tıklayınca detay sayfasına giden, canlı bir uygulama yaptın.
**Terim defteri:** `query string`, `encodeURIComponent`, `optional chaining (?.)`, `vercel.json rewrite`
**Çıktı:** 🌐 canlı link — kitap arama + detay sayfası olan, iki sayfalı bir uygulama.
**Commit:** `git add -A && git commit -m "hafta-06 g6: kitap arama mini projesi + deploy" && git push`

---

## Gün 7 — Pazar Review

Bugün kod yazmıyorsun (istersen küçük bir dokunuş yaparsın ama şart değil). Roy ile 30 dk:

1. **Teach-back:** `useEffect`'in bağımlılık dizisinin üç halini (`[]`, `[deger]`, dizi yok) kendi cümlelerinle anlat — hangisi ne zaman kullanılır, neden.
2. **Kod okuma testi:** Aşağıdaki `useEffect` neden yanlış çalışır?

   ```jsx
   useEffect(() => {
     fetch(`https://openlibrary.org/search.json?q=${sorgu}`)
       .then((res) => res.json())
       .then((veri) => setSonuclar(veri.docs))
   }) // dikkat: ikinci parametre YOK
   ```

   *(Cevap: bağımlılık dizisi hiç verilmemiş — bu efekt HER render'da tekrar çalışır. `setSonuclar` çağrısı yeni bir render tetikler, o render bu efekti tekrar çalıştırır, bu da yeni bir `setSonuclar` tetikler... sonsuz döngü/gereksiz API isteği. Çözüm: `[sorgu]` bağımlılığı eklemek, ya da efekti sadece submit anında elle tetiklemek.)*
3. **Canlı linkini göster.** Bir kitap ara, detay sayfasına git, tarayıcıyı yenile (F5) — `vercel.json` sayesinde 404 vermediğini göster.
4. **Hafta 7'nin önizlemesi:** Gelecek hafta bu projeyi TypeScript'e çevirip, erişilebilirlik ve responsive cila ekleyip, portföyüne koyabileceğin bir hale getireceksin — Faz 2'nin son haftası.

**Bu hafta özet:** Bileşenlerin gerçek bir API'den veri çekmesini (`useEffect`), kullanıcı girdisini yönetmeyi (controlled form), yükleniyor/hata/boş durumlarını ayrı göstermeyi, state'i doğru yerde tutmayı (lifting state up) ve `react-router-dom` ile çok sayfalı bir uygulama kurmayı öğrendin. Artık statik değil, **canlı veriyle konuşan** bir React uygulaması yazabiliyorsun.
