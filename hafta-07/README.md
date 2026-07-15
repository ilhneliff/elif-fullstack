# Hafta 7 — TypeScript ve Cila (Faz 2)

> **Hedef:** TypeScript'in temellerini React'e uygulamak; kod kalitesini, erişilebilirliği ve responsive tasarımı portföy seviyesine çıkarmak.
> **Çıktı:** ✔ 🌐 TypeScript'e geçirilmiş, a11y + responsive cilası yapılmış, README ve ekran görüntüsüyle tamamlanmış bir React uygulaması.
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Faz 2'nin son haftasındasın. Hafta 6'da bitirdiğin kitap arama uygulaman **çalışıyor** — ama "çalışıyor" ile "portföye koyulacak kalitede" arasında bir fark var. Bu hafta o farkı kapatıyorsun: TypeScript ile hataları yazarken yakalamayı, erişilebilir ve her ekranda düzgün görünen bir arayüz kurmayı, ve projeyi bir README + ekran görüntüsüyle "bitmiş" hale getirmeyi öğreneceksin.

**Çalışma klasörün:** Bu hafta, Hafta 6'da yazdığın `kitap-arama` projesini **TypeScript'e taşıyacaksın** — yeni bir proje `kitap-arama-ts` olarak `hafta-07/` altında kurulacak, kodun büyük kısmı geçen haftadan taşınacak.

---

## Gün 1 — TypeScript Neden Var, Temel Tipler

### 0:00–1:00 · TS'in çözdüğü problem

Vanilla JS'te bir hatayı ancak **çalıştırınca** görürsün:

```js
function topla(a, b) {
  return a + b
}

topla(5, '3') // "53" döner — hata FIRLATMAZ, ama muhtemelen istediğin bu değil
```

TypeScript'te aynı hatayı **yazarken**, editör anında kırmızı çizgiyle gösterir:

```ts
function topla(a: number, b: number): number {
  return a + b
}

topla(5, '3')
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
```

Buna **derleme zamanı hatası** (compile-time error) denir — kodu hiç çalıştırmadan, sadece yazarken yakalanan hata. Vanilla JS'teki hatalar ise genelde **çalışma zamanı hatası** (runtime error) — kullanıcı o satıra denk gelen bir şey yapana kadar fark etmezsin, bazen hiç fark etmezsin (yukarıdaki `"53"` örneğinde olduğu gibi, sessizce yanlış davranır).

💡 TypeScript, JavaScript'in **üstüne** kurulu bir dil — her geçerli JS kodu, aynı zamanda geçerli TS kodudur. TS'i "JS + tip kontrolü" olarak düşün. Tarayıcı TS'i anlamaz; derlenirken (build sırasında) düz JS'e çevrilir.

### 1:00–2:00 · Temel tipler

```ts
// Temel tipler — değişkenin YANINA : tip yazılır
let isim: string = 'Elif'
let yas: number = 24
let aktif: boolean = true
let hobiler: string[] = ['kod', 'kitap', 'kahve']
let koordinat: [number, number] = [41.0, 29.0] // tuple: sabit uzunluklu, tipleri belli dizi

// object tipi (inline)
let kullanici: { isim: string; yas: number } = { isim: 'Elif', yas: 24 }
```

Bir `.ts` dosyası oluşturup (örn. `deneme.ts`) bu satırları tek tek yaz, VS Code'da kırmızı çizgi görmeden çalıştığını doğrula. Sonra bilerek `yas: number = 'yirmi dört'` gibi bir hata yap, editörün seni nasıl uyardığını gör.

### 2:00–3:00 · type vs interface, union type

İki farklı şekilde "isimli tip" tanımlayabilirsin:

```ts
// type: herhangi bir tipe isim verebilirsin (union, primitive, obje...)
type Kullanici = {
  isim: string
  yas: number
}

// interface: SADECE obje şekli tanımlar, ama "extends" ile genişletilebilir
interface KullaniciInterface {
  isim: string
  yas: number
}

interface AdminKullanici extends KullaniciInterface {
  yetkiSeviyesi: number
}
```

💡 İkisi de React'te çok kullanılır, çoğu ekip birini seçip tutarlı kullanır. Bu roadmap'te **props için `interface`, diğer her şey için `type`** kuralını kullanacağız — sektörde en yaygın konvansiyonlardan biri bu, Gün 2'de göreceksin.

`type`'ın `interface`'in yapamadığı bir şeyi de göster: **union type** — "ya bu, ya şu":

```ts
// union type: React'te durum yönetiminde çok işine yarayacak
type Durum = 'yukleniyor' | 'basarili' | 'hata'

let mevcutDurum: Durum = 'yukleniyor'
mevcutDurum = 'bilinmeyen' // ❌ hata: 'bilinmeyen' bu union'da yok
```

Bunu Hafta 6'daki `yukleniyor`/`hata`/`sonuclar` state üçlüsüyle karşılaştır — orada üç ayrı `boolean`/`string` state'in vardı, burada tek bir `Durum` değişkeniyle de aynı fikri ifade edebilirdin. Şimdilik sadece tanı, projede kullanmak zorunda değilsin.

**Küçük zafer:** Editöründe ilk kez kırmızı bir TS hatası gördün ve NEDEN olduğunu anladın — bu, bug'ı çalıştırmadan önce yakalamak demek.
**Terim defteri:** `type annotation`, `derleme zamanı hatası`, `tuple`, `type vs interface`, `union type`
**Çıktı:** `.ts` uzantılı, temel tiplerle çalışan küçük bir deneme dosyası.
**Commit:** `git add -A && git commit -m "hafta-07 g1: typescript temelleri denemesi"`

---

## Gün 2 — React'te TypeScript

### 0:00–1:00 · Projeyi TS şablonuyla yeniden kur

En temiz yol: yeni bir TS şablonuyla proje aç, Hafta 6'daki kodu içine taşı — mevcut bir JS Vite projesini yarı yolda TS'e çevirmek (config dosyalarını elle değiştirmek) gereksiz karmaşıklık, sıfırdan doğru şablonla başlamak çok daha az sürtünmeli.

```bash
cd ~/elif-fullstack/hafta-07

# react-ts şablonu: TypeScript desteği (tsconfig.json, .tsx uzantıları) hazır gelir
npm create vite@latest kitap-arama-ts -- --template react-ts
cd kitap-arama-ts
npm install
npm install react-router-dom
```

Şimdi `hafta-06/kitap-arama/src/` içindeki `pages/`, `components/` klasörlerini `hafta-07/kitap-arama-ts/src/` içine kopyala. Dosya uzantılarını değiştir: JSX içeren her şey `.jsx` → `.tsx`, JSX içermeyen düz mantık dosyaları `.js` → `.ts`. `main.tsx`'e Hafta 6'daki `BrowserRouter` sarmalamasını ekle.

Projeyi çalıştır (`npm run dev`) — bu noktada muhtemelen birkaç TS hatası göreceksin (props tipsiz, event'ler tipsiz). Bugün ve yarın onları tek tek kapatacaksın.

### 1:00–2:00 · Props tipleme, useState<T>

```tsx
// Props'u interface ile tanımla
interface KartProps {
  baslik: string
  aciklama: string
  resimUrl: string
  etiket?: string // ? = opsiyonel prop, verilmeyebilir
}

function Kart({ baslik, aciklama, resimUrl, etiket }: KartProps) {
  return (
    <div className="kart">
      <img src={resimUrl} alt={baslik} />
      {etiket && <span className="etiket">{etiket}</span>}
      <h3>{baslik}</h3>
      <p>{aciklama}</p>
    </div>
  )
}

export default Kart
```

`useState` çoğu zaman tipi kendisi çıkarır (**infer** eder) — ama başlangıç değeri belirsizse (örn. `null`, boş dizi) tipi sen belirtmelisin:

```tsx
import { useState } from 'react'

// TS başlangıç değerinden tipi kendi anlar:
const [sayi, setSayi] = useState(0) // otomatik: number

// Ama başlangıç değeri null/boş ise, TS ne olacağını bilemez — SEN söyle:
const [kullanici, setKullanici] = useState<{ isim: string } | null>(null)
const [kitaplar, setKitaplar] = useState<string[]>([])
```

`Kart.tsx`'ini bu haliyle güncelle. Projendeki her bileşene aynı mantıkla bir `interface XProps` yaz (`AnaSayfa`'nın props'u yoksa gerek yok, ama `KitapDetay`, `Kart` gibi prop alan bileşenlere gerekli).

### 2:00–3:00 · Event tipleri

```tsx
// Input değişikliği:
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value)
}

// Form submit:
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
}

// Buton tıklama:
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('tıklandı')
}

// Kullanımı JSX içinde AYNI kalıyor, sadece fonksiyon imzası tipli:
// <input onChange={handleChange} />
// <form onSubmit={handleSubmit}>
// <button onClick={handleClick}>Tıkla</button>
```

`AnaSayfa.tsx`'teki `aramaYap` ve `onChange` fonksiyonlarına bu tipleri ekle.

💡 `HTMLInputElement` gibi isimler tarayıcının kendi tip tanımlarından gelir (`@types/react` paketi içinde hazır). Ezberlemene gerek yok — VS Code'da `e.target.` yazınca öneri (autocomplete) listesi çıkar, doğru tipi oradan görürsün.

**Küçük zafer:** Geçen haftanın `Kart` bileşenini TS'e çevirdin ve editör artık "bu prop'u unuttun" diye seni anında uyarıyor.
**Terim defteri:** `interface Props`, opsiyonel prop (`?`), `useState<T>`, `React.ChangeEvent`, `React.FormEvent`
**Çıktı:** TS'e geçirilmiş, en az iki bileşeni (prop'ları ve event'leri tipli) çalışan proje.
**Commit:** `git add -A && git commit -m "hafta-07 g2: proje typescript'e gecirildi"`

---

## Gün 3 — API Cevabını Tipleme, Hata Yakalama

### 0:00–1:00 · Response şeklini interface olarak tanımla

Open Library'nin arama API'sinin döndürdüğü şeklin **kullandığın kısmını** tiple — tüm alanları yazmana gerek yok:

```tsx
// src/types/kitap.ts
export interface KitapSonucu {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
}

export interface AramaSonucu {
  docs: KitapSonucu[]
  numFound: number
}
```

### 1:00–2:00 · fetch fonksiyonunu tipli yazma

```tsx
import type { KitapSonucu, AramaSonucu } from '../types/kitap'

async function kitapAra(sorgu: string): Promise<KitapSonucu[]> {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(sorgu)}`)
  if (!res.ok) throw new Error('Arama başarısız oldu')

  const veri: AramaSonucu = await res.json() // fetch'in dönüşünü kendi tipimize "iddia" ediyoruz
  return veri.docs
}
```

💡 `res.json()` TypeScript'e göre `Promise<any>` döner — TS, API'nin **gerçekte** ne döndüğünü bilemez, sana güvenir. `: AramaSonucu` yazarak "buna güven, veri bu şekilde" diyorsun. Bu yüzden interface'i API'nin **gerçek** cevabına göre doğru yazmak önemli — yanlış yazarsan, TS sana sahte bir güven duygusu verir (editör hata göstermez ama runtime'da alan bulunamaz).

`AnaSayfa.tsx`'teki `sonuclar` state'ini `useState<KitapSonucu[]>([])` şeklinde tiple.

### 2:00–3:00 · Hata tiplerini yönetme

```tsx
const [hata, setHata] = useState<string | null>(null)

async function ara(sorgu: string) {
  try {
    const sonuclar = await kitapAra(sorgu)
    setKitaplar(sonuclar)
  } catch (err) {
    // TS'te catch bloğundaki hata tipi 'unknown'dır (any DEĞİL) — güvenlik için böyle
    if (err instanceof Error) {
      setHata(err.message)
    } else {
      setHata('Bilinmeyen bir hata oluştu')
    }
  }
}
```

💡 Neden `err.message`'ı direkt yazamıyorsun? Çünkü JS'te `throw` ile **herhangi bir şey** fırlatılabilir (string, obje, sayı...). TS bunu bilir ve seni `instanceof Error` ile kontrol etmeye zorlar. Bu, **tip daraltma** (type narrowing) denen şey: `if` bloğunun içinde TS artık `err`'ün kesin `Error` tipinde olduğunu bilir, `.message`'a erişmene izin verir.

Bu tipleri projendeki `AnaSayfa.tsx` ve `KitapDetay.tsx`'e uygula.

**Küçük zafer:** API'den gelen veriye artık editör "bu alan yok" diye uyarı verebiliyor — bir yazım hatasını yazarken yakaladın, runtime'da değil.
**Terim defteri:** response tipleme, `Promise<T>`, tip daraltma (narrowing), `unknown` vs `any`, `instanceof`
**Çıktı:** Tipli bir `kitapAra` fonksiyonu + tipli hata yönetimi.
**Commit:** `git add -A && git commit -m "hafta-07 g3: api cevaplarini ve hatalari tiple"`

---

## Gün 4 — Kod Kalitesi: Klasör Yapısı, Custom Hook

### 0:00–1:00 · İyi bir klasör yapısı

```
src/
├── components/       <- tekrar kullanılabilir küçük parçalar (Kart, Buton...)
├── pages/            <- route'lara karşılık gelen sayfalar (AnaSayfa, KitapDetay...)
├── hooks/            <- kendi yazdığın useX fonksiyonları
├── types/            <- paylaşılan interface/type tanımları (Gün 3'te başladın)
├── App.tsx
└── main.tsx
```

Projeni bu yapıya göre düzenle — `types/kitap.ts` zaten Gün 3'ten var, `hooks/` klasörünü şimdi açacaksın.

### 1:00–2:00 · Custom hook: useFetch

Hafta 6'da her sayfada aynı `useState` + `useEffect` + `try/catch` bloğunu tekrar tekrar yazmıştın. Bunu tek bir **custom hook**'a topla:

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react'

// <T> generic: bu hook'u HANGİ veri tipi için kullanırsan, T o tip olur
function useFetch<T>(url: string) {
  const [veri, setVeri] = useState<T | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState<string | null>(null)

  useEffect(() => {
    let iptalEdildi = false // race condition'a karşı basit koruma

    async function getir() {
      setYukleniyor(true)
      setHata(null)
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('İstek başarısız: ' + res.status)
        const json: T = await res.json()
        if (!iptalEdildi) setVeri(json)
      } catch (err) {
        if (!iptalEdildi) setHata(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        if (!iptalEdildi) setYukleniyor(false)
      }
    }

    getir()
    return () => {
      iptalEdildi = true // bileşen kaldırılırsa (unmount) sonucu görmezden gel
    }
  }, [url])

  return { veri, yukleniyor, hata }
}

export default useFetch
```

💡 `iptalEdildi` neyi çözüyor? Diyelim `id=1` için istek gönderdin ama cevap gelmeden kullanıcı `id=2`'ye geçti — `useEffect` tekrar çalışır ve cleanup fonksiyonu (`return () => { iptalEdildi = true }`) devreye girer. `id=1`'in isteği gecikmeli de olsa dönerse, `iptalEdildi` `true` olduğu için state'i **güncellemez** — yoksa ekranda yanlış kitabın verisi görünebilirdi. Buna **race condition** (yarış durumu) denir.

### 2:00–3:00 · Hook'u projede kullan

```tsx
// src/pages/KitapDetay.tsx
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

interface KitapDetayVerisi {
  title: string
  description?: string | { value: string }
}

function KitapDetay() {
  const { id } = useParams()
  const { veri: kitap, yukleniyor, hata } = useFetch<KitapDetayVerisi>(
    `https://openlibrary.org/works/${id}.json`
  )

  if (yukleniyor) return <p>Yükleniyor...</p>
  if (hata) return <p className="hata">{hata}</p>
  if (!kitap) return <p>Kitap bulunamadı.</p>

  return <h2>{kitap.title}</h2>
}

export default KitapDetay
```

`KitapDetay.tsx`'i bu şekilde sadeleştir — kendi `useEffect`/`useState` bloğunu sil, `useFetch` hook'unu kullan. İstersen `AnaSayfa.tsx`'teki arama mantığını da (submit tetiklemesi gerektiği için biraz farklı ama benzer bir mantıkla) sadeleştirmeyi dene.

**Küçük zafer:** Kendi yazdığın bir hook'u en az iki farklı yerde kullandın — kopyala-yapıştır tekrarı bitti.
**Terim defteri:** `custom hook`, `generic (<T>)`, klasör mimarisi, `DRY prensibi`, `race condition`
**Çıktı:** `useFetch` hook'u + projede en az bir kullanımı.
**Commit:** `git add -A && git commit -m "hafta-07 g4: usefetch custom hook + klasor yapisi"`

---

## Gün 5 — Erişilebilirlik (a11y) + Responsive Cila

### 0:00–1:00 · a11y temelleri: label, alt, semantic HTML

```jsx
// ❌ Kötü: ekran okuyucu bu input'un ne olduğunu bilemez
<input type="text" onChange={handleChange} />

// ✅ İyi: label ile eşleştir (htmlFor <-> id)
<label htmlFor="arama">Kitap ara</label>
<input id="arama" type="text" onChange={handleChange} />
```

```jsx
// ❌ Kötü: img'de alt yok, ekran okuyucu resmi atlıyor ya da dosya adını okuyor
<img src={kitap.resimUrl} />

// ✅ İyi: anlamlı alt metni
<img src={kitap.resimUrl} alt={`${kitap.baslik} kitap kapağı`} />

// Dekoratif bir resimse (bilgi taşımıyorsa), boş alt YETERLİ:
<img src="/susleme.svg" alt="" />
```

```jsx
// Semantic HTML: <div onClick> yerine gerçek buton kullan
// ❌ Klavye ile odaklanamaz, ekran okuyucu "buton" demez
<div onClick={handleClick}>Tıkla</div>

// ✅ button doğal olarak klavye + ekran okuyucu desteği getirir
<button onClick={handleClick}>Tıkla</button>
```

Projendeki her `<input>`'a bir `<label>` ekle, her `<img>`'e anlamlı bir `alt` yaz, tıklanabilir her `<div>`'i (varsa) gerçek bir `<button>` ya da `<Link>`'e çevir.

### 1:00–2:00 · Klavye erişilebilirliği, focus stilleri

```css
/* ❌ ASLA yapma: focus outline'ı tamamen kaldırmak
   klavye kullanan biri artık nerede olduğunu GÖREMEZ */
button:focus {
  outline: none;
}

/* ✅ Kaldırmak yerine, tasarımına uyacak şekilde YENİDEN tasarla */
button:focus-visible {
  outline: 2px solid #4338ca;
  outline-offset: 2px;
}

a:focus-visible,
input:focus-visible {
  outline: 2px solid #4338ca;
  outline-offset: 2px;
}
```

💡 `:focus-visible`, `:focus`'tan farklı olarak **sadece** klavye ile (Tab tuşuyla) gelindiğinde tetiklenir, mouse tıklamasında tetiklenmez — bu yüzden mouse kullanıcısını rahatsız etmeden klavye kullanıcısına yardım eder.

Test et: mouse'una hiç dokunmadan, sadece `Tab` tuşuyla sayfanı baştan sona gez — arama kutusuna, "Ara" butonuna, her kitap linkine sırayla ulaşabiliyor musun? Ulaşamıyorsan (örn. bir link yerine tıklanabilir bir `<span>` kullanmışsan) düzelt.

💡 **Opsiyonel:** Renk kontrastını (yazı/arkaplan) [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) ile test edebilirsin — normal metin için WCAG AA standardı en az 4.5:1 kontrast oranı ister.

### 2:00–3:00 · Responsive: mobile-first media query

```css
/* Mobile-first: ÖNCE mobil için tasarla (media query'siz stiller mobil baz alınır) */
.galeri {
  display: grid;
  grid-template-columns: 1fr; /* mobilde tek sütun */
  gap: 1rem;
  padding: 1rem;
}

/* Sonra büyük ekranlar için EKLE (min-width ile büyüt) */
@media (min-width: 640px) {
  .galeri {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .galeri {
    grid-template-columns: repeat(3, 1fr);
    padding: 2rem;
  }
}
```

```css
/* Dokunma hedefleri: mobilde butonlar en az 44x44px olmalı (Apple/Google önerisi) */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 1rem;
}
```

💡 Hafta 2'de "desktop-first" (`max-width` ile küçültme) görmüştün, burada **mobile-first** (`min-width` ile büyütme) kullandık — ikisi de doğru yaklaşım, endüstride mobile-first biraz daha yaygın çünkü çoğu trafik mobilden geliyor. DevTools'ta (`Cmd+Opt+I` → responsive/device toolbar ikonu) birkaç farklı telefon/tablet genişliğinde projeni test et.

**Küçük zafer:** Sayfanı sadece `Tab` tuşuyla (mouse kullanmadan) baştan sona gezip her yere ulaşabildiğini gördün.
**Terim defteri:** `a11y`, `label/htmlFor`, `alt`, `:focus-visible`, `mobile-first`, `dokunma hedefi (touch target)`
**Çıktı:** Label'lı formlar, anlamlı `alt`'lı görseller, focus stilleri, üç breakpoint'te düzgün görünen bir galeri.
**Commit:** `git add -A && git commit -m "hafta-07 g5: erisilebilirlik ve responsive cila"`

---

## Gün 6 — Bitir, Deploy, README, Ekran Görüntüsü

### 0:00–1:00 · Son kontrol ve temizlik

Projeni baştan sona gez: kullanılmayan `import`'ları sil, `console.log` kalıntılarını temizle, tutarsız isimlendirmeleri (bazı yerlerde İngilizce, bazı yerlerde Türkçe değişken adı gibi) düzelt. Sonra derleme kontrolü yap:

```bash
npm run build   # TS hataları varsa BURADA patlar, deploy ETMEDEN önce yakala
```

💡 `npm run build`, TypeScript projelerinde hem Vite build'ini hem `tsc` tip kontrolünü çalıştırır — kodunda unuttuğun bir tip hatası varsa build **burada** başarısız olur. Bu iyi bir şey: production'a kırık kod gitmeden önce yakalıyorsun. Hata çıkarsa, editördeki kırmızı çizgilere dönüp tek tek düzelt.

### 1:00–2:00 · README yazma

Proje köküne `README.md` oluştur:

```markdown
# Kitap Arama Uygulaması

Open Library API'sini kullanarak kitap arayabildiğin, sonuçlara tıklayınca
detay sayfasına gidebildiğin bir React + TypeScript uygulaması.

## Canlı demo
🔗 https://kitap-arama-ts.vercel.app

## Ekran görüntüsü
![Uygulama ekran görüntüsü](./screenshot.png)

## Kullanılan teknolojiler
- React + Vite
- TypeScript
- react-router-dom
- Open Library API

## Neler öğrendim
- Bileşen mimarisi: props, state, lifting state up
- useEffect ile veri çekme, loading/error/empty durumları
- react-router-dom ile çok sayfalı yapı
- TypeScript: props/state/event tipleme, custom generic hook
- Temel a11y ve responsive tasarım

## Lokal çalıştırma
\`\`\`bash
git clone <repo-url>
cd kitap-arama-ts
npm install
npm run dev
\`\`\`
```

Linki, teknoloji listesini ve "neler öğrendim" kısmını kendi projene göre güncelle — kopyala-yapıştır değil, gerçekten SEN yaz.

### 2:00–3:00 · Ekran görüntüsü, final deploy

```bash
# macOS: Cmd + Shift + 4 ile alan seç, ekran görüntüsü Masaüstü'ne kaydedilir
# Sonra projenin köküne taşı:
mv ~/Desktop/ekran-goruntusu.png ./screenshot.png

git add screenshot.png README.md
git commit -m "hafta-07 g6: readme ve ekran goruntusu ekle"
```

Son deploy:

```bash
npm run build
npm run preview
npx vercel --prod
```

README'deki "Canlı demo" linkini gerçek Vercel URL'inle güncelle, tekrar commit'le.

**Küçük zafer:** README'si, ekran görüntüsü ve canlı linki olan, gerçekten portföyüne koyabileceğin bir proje bitirdin.
**Terim defteri:** `README`, `build-time type check`, `production build`, `portföy projesi`
**Çıktı:** 🌐 canlı link + tam README + `screenshot.png` içeren repo.
**Commit:** `git add -A && git commit -m "hafta-07 g6: proje tamamlandi - readme ve son cila" && git push`

---

## Gün 7 — Pazar Review (Faz 2 Bitti)

Bugün kod yazmıyorsun. Roy ile 45 dk — bu sefer biraz daha uzun, çünkü bir faz kapanıyor:

1. **Teach-back:** Projenin `useFetch` hook'unu aç, satır satır kendi cümlelerinle anlat — generic (`<T>`) ne işe yarıyor, `iptalEdildi` neyi çözüyor, neden `try/catch/finally` var.
2. **Portföy testi:** README'ni, hiç kod bilmeyen biri okusa anlar mı diye baştan oku. Ekran görüntüsü gerçekten projeyi temsil ediyor mu?
3. **a11y testi:** Canlı linki aç, mouse'a hiç dokunmadan sadece `Tab` ve `Enter` ile bir kitap ara, sonuca git, detayı oku, geri dön.
4. **Faz 2 özeti — geriye bak:**

   | Hafta | Ne öğrendin |
   |---|---|
   | 5 | Bileşen, JSX, props, state, liste + key |
   | 6 | useEffect, form, loading/error/empty, lifting state up, router |
   | 7 | TypeScript, tipli props/state/event, custom hook, a11y, responsive |

5. **Faz 3 önizlemesi — backend:** Şu ana kadar hep **hazır** bir API'ye (Open Library) `fetch` attın. Faz 3'te bu API'yi **sen yazacaksın** — Node.js ile bir sunucu, Express ile route'lar, PostgreSQL ile gerçek bir veritabanı. Yani React'in `fetch` ile konuştuğu o URL'in **arkasındaki** kodu artık sen yazıyor olacaksın. Küçük bir önizleme, sadece şekli görmen için:

   ```js
   // Faz 3'te yazacağın şeye bir önizleme — bir Express sunucusu
   import express from 'express'
   const app = express()

   app.get('/api/kitaplar', (req, res) => {
     // Burada veritabanından kitapları çekip JSON olarak döneceksin —
     // React'teki fetch('/api/kitaplar') çağrısı işte bu route'a gelecek
     res.json([{ id: 1, baslik: 'Harry Potter' }])
   })

   app.listen(3000)
   ```

   Bu kod şu an çalışmaz (proje kurulu değil), sadece "birazdan neye benzeyecek" fikrini versin.

**Faz 2 özet:** Sıfırdan bir React projesi kurmayı, bileşen/props/state üçlüsünü, gerçek bir API'den veri çekmeyi, form yönetmeyi, çok sayfalı bir uygulama kurmayı, ve TypeScript ile bunların hepsini tipli, sağlam, erişilebilir hale getirmeyi öğrendin. Hafta 1'de terminalde `ls` yazmayı öğrenen sen ile bugünkü sen arasında koca bir mesafe var — bunu unutma. Faz 3'te, elindeki bu React bilgisinin **arkasına** bir backend inşa edeceksin.
