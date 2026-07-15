# Hafta 2 — HTML/CSS/DOM (Faz 1)

> **Hedef:** Saf HTML, CSS ve DOM ile ilk gerçek web sayfanı yazıp canlıya almak
> **Çıktı:** ✔ 🌐 ilk canlı site (kendi `.vercel.app` linkin)
> ~3 sa/gün · Takılınca 20 dk kuralı · Her gün commit + push.

Hafta 1'de terminal, git ve JavaScript'in temelini (değişken, döngü, fonksiyon, dizi, nesne) gördün. Bu hafta tarayıcıya giriyoruz.

Üç dil, üç görev:
- **HTML** → sayfanın **iskeleti** (ne var: başlık, paragraf, buton...)
- **CSS** → sayfanın **kıyafeti** (nasıl görünüyor: renk, boşluk, hizalama...)
- **JavaScript** → sayfanın **hareketi** (tıklayınca ne oluyor...)

Hafta sonunda elinde kendi adına bir sayfa olacak ve internette **canlı** olacak. Bu, "ben bunu yaptım" diyebileceğin ilk şey.

**Çalışma klasörün:** Bu hafta boyunca `hafta-02/hakkimda/` klasörü içinde çalış. Her gün aynı dosyaları geliştireceksin (`index.html`, `style.css`, `script.js`) — proje gün geçtikçe büyüyecek.

```bash
# Gün 1'e başlamadan önce klasörünü oluştur
cd ~/elif-fullstack/hafta-02
mkdir hakkimda
cd hakkimda
```

---

## Gün 1 — HTML: İskelet ve Semantik Etiketler

### 0:00–1:00 · HTML nedir, ilk dosyan

HTML (HyperText Markup Language) bir **programlama dili değil**, bir **işaretleme dili**. Yani "eğer şu olursa şunu yap" demiyorsun; "burası başlık, burası paragraf, burası link" diyorsun. Tarayıcı bu işaretleri okuyup ekrana çiziyor.

`hakkimda` klasöründe `index.html` dosyası oluştur. (`index.html` ismi özel — tarayıcı bir klasörü açtığında otomatik olarak bu dosyayı arar.)

```html
<!DOCTYPE html>
<!-- DOCTYPE: tarayıcıya "bu modern HTML5" diye söyler. Her HTML dosyasının ilk satırı budur. -->
<html lang="tr">
<!-- html: tüm sayfayı saran ana etiket. lang="tr": sayfa Türkçe (ekran okuyucular, çeviri araçları bunu kullanır) -->

<head>
  <!-- head: sayfanın "görünmeyen" kısmı — tarayıcıya ve arama motorlarına bilgi verir, ekranda görünmez -->
  <meta charset="UTF-8">
  <!-- charset: Türkçe karakterler (ş, ğ, ı, ö, ü, ç) doğru görünsün diye -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- viewport: mobilde sayfa küçülmesin, ekrana doğru sığsın -->
  <title>Elif — Hakkımda</title>
  <!-- title: tarayıcı sekmesinde görünen yazı -->
</head>

<body>
  <!-- body: sayfanın "görünen" kısmı — buraya yazdığın her şey ekranda çıkar -->
  <h1>Merhaba, ben Elif</h1>
  <p>Bu benim ilk HTML sayfam.</p>
</body>

</html>
```

Dosyayı kaydet, sonra Finder'dan çift tıkla ya da terminalden aç:

```bash
open index.html
# Bu komut dosyayı varsayılan tarayıcında açar
```

💡 Kod editöründe (VS Code) `!` yazıp Tab'a basarsan bu iskelet otomatik gelir (Emmet kısayolu). Ama ilk seferde elle yaz — parmaklarına otursun.

### 1:00–2:00 · Semantik etiketler

"Semantik" = anlamlı. `<div>` de bir kutu, `<header>` da bir kutu — ama `<header>` yazınca hem sen hem tarayıcı hem ekran okuyucu "burası başlık bölgesi" diye anlar. Elden geldiğince semantik etiket kullan.

En sık kullanacakların:

```html
<body>
  <header>
    <!-- header: sayfanın en üstü — genelde logo/isim + menü -->
    <h1>Elif Yılmaz</h1>
    <nav>
      <!-- nav: navigasyon — sayfa içi/dışı linklerin olduğu menü -->
      <ul>
        <li><a href="#hakkimda">Hakkımda</a></li>
        <li><a href="#yetenekler">Yetenekler</a></li>
        <li><a href="#iletisim">İletişim</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <!-- main: sayfanın asıl içeriği — bir sayfada SADECE BİR TANE main olur -->
    <section id="hakkimda">
      <!-- section: konuya göre ayrılmış bir bölüm -->
      <h2>Hakkımda</h2>
      <p>Bilgisayar mühendisiyim, fullstack geliştirici olmaya çalışıyorum.</p>
      <img src="foto.jpg" alt="Elif'in profil fotoğrafı">
      <!-- img: resim. src = dosya yolu, alt = resim yüklenmezse veya görme engelli biri için açıklama -->
      <!-- alt YAZMAYI UNUTMA — hem erişilebilirlik hem SEO için önemli -->
    </section>

    <section id="yetenekler">
      <h2>Yetenekler</h2>
      <ul>
        <!-- ul: sırasız liste (unordered list), li: liste elemanı (list item) -->
        <li>HTML & CSS</li>
        <li>JavaScript (öğreniyorum)</li>
        <li>Git & GitHub</li>
      </ul>
    </section>
  </main>

  <footer>
    <!-- footer: sayfanın en altı — genelde telif, sosyal linkler -->
    <p>&copy; 2026 Elif Yılmaz</p>
  </footer>
</body>
```

Başlık hiyerarşisi önemli: `<h1>` sayfada tek olmalı (sayfanın ana başlığı), sonra `<h2>`, `<h3>`... sırayla küçülür. `h1`'den sonra direkt `h4`'e atlama — bu, "bölüm başlığı" atlamak gibi, hem düzensiz görünür hem ekran okuyucuları şaşırtır.

💡 `<div>` kötü değil — ama "bu bölümün özel bir anlamı yok, sadece gruplamak için kullanıyorum" dediğin yerlerde kullan. Anlamlı bir bölümse (menü, başlık, ana içerik) semantik etiketi tercih et.

### 2:00–3:00 · Form iskeleti + "hakkımda" sayfasını tamamla

Formlar, kullanıcıdan veri almanın yolu (isim, mail, mesaj...). İleride backend'e veri göndereceğin yer burası olacak — bugün sadece iskeleti kuruyoruz.

```html
<section id="iletisim">
  <h2>İletişim</h2>
  <form>
    <!-- form: kullanıcıdan veri toplayan alan -->
    <label for="isim">İsim:</label>
    <!-- label: input'un ne olduğunu söyler. "for" değeri, eşleştiği input'un "id"siyle AYNI olmalı -->
    <input type="text" id="isim" name="isim" placeholder="Adın">
    <!-- input: tek satırlık giriş alanı. type="text" → düz yazı -->

    <label for="mail">E-posta:</label>
    <input type="email" id="mail" name="mail" placeholder="ornek@mail.com">
    <!-- type="email" → tarayıcı basit bir mail formatı kontrolü yapar -->

    <label for="mesaj">Mesaj:</label>
    <textarea id="mesaj" name="mesaj" rows="4" placeholder="Mesajın..."></textarea>
    <!-- textarea: çok satırlı yazı alanı -->

    <button type="submit">Gönder</button>
    <!-- button type="submit": formu gönderir. Şimdilik bir yere gitmeyecek, sadece görünecek -->
  </form>
</section>
```

`label` ve `input`'u `for`/`id` ile eşleştirmek şunu sağlıyor: kullanıcı "İsim" yazısına tıklarsa da imleç input'a düşüyor. Küçük ama gerçek bir kullanılabilirlik detayı.

Şimdi tüm parçaları birleştirip `hakkimda/index.html` dosyasını tamamla: header + nav + main (hakkımda + yetenekler + iletişim formu) + footer. Tarayıcıda aç, kontrol et: linkler tıklanınca sayfa içinde aşağı kayıyor mu? (Bunun için `<a href="#hakkimda">` ile `<section id="hakkimda">` id'lerinin **birebir aynı** olması lazım.)

**Küçük zafer:** Sıfırdan, tamamen elle yazdığın ilk HTML sayfan tarayıcıda açılıyor — header, menü, bölümler, form, footer hepsi yerinde.
**Terim defteri:** `semantik etiket`, `head/body`, `alt metni`, `label/input eşleşmesi`, `id`
**Çıktı:** `hakkimda/index.html` — çıplak ama tam iskeletli bir sayfa.
**Commit:** `git add . && git commit -m "hafta-02 g1: html iskelet + semantik etiketler"`

---

## Gün 2 — CSS: Seçiciler ve Box Model

### 0:00–1:00 · CSS nedir, sayfaya nasıl bağlanır, seçiciler

CSS (Cascading Style Sheets), HTML'in **nasıl göründüğünü** belirler. Dün yazdığın sayfa şu an çıplak — bugün giydiriyoruz.

`hakkimda` klasöründe `style.css` dosyası oluştur ve `index.html`'in `<head>` kısmına bağla:

```html
<head>
  ...
  <link rel="stylesheet" href="style.css">
  <!-- link: HTML'i CSS dosyasına bağlar. rel="stylesheet" → "bu bir stil dosyası" -->
</head>
```

CSS kuralının anatomisi:

```css
seçici {
  özellik: değer;
}
```

Üç temel seçici tipi:

```css
/* 1) ETİKET seçici — o etiketten kaç tane varsa hepsini seçer */
h1 {
  color: darkslateblue;
  /* color: yazı rengi. İsim (darkslateblue) ya da hex (#483d8b) yazabilirsin */
}

/* 2) CLASS seçici — HTML'de class="..." yazdığın her yeri seçer, tekrar kullanılabilir */
.kart {
  background-color: #f4f4f4;
}
/* HTML tarafında: <div class="kart">...</div> */

/* 3) ID seçici — SADECE o id'ye sahip TEK elemanı seçer, sayfada bir kez kullanılır */
#hakkimda {
  padding: 20px;
}
/* HTML tarafında: <section id="hakkimda">...</section> */
```

💡 Kural: birden fazla elemanda tekrar kullanacaksan `class`, sayfada tek olan özel bir eleman için `id` kullan. Çoğu zaman `class` yeterli.

Fontu ve genel renk paletini ayarla:

```css
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  /* font-family: birden fazla yazabilirsin, ilk bulunan kullanılır (fallback) */
  color: #222;
  /* varsayılan yazı rengi */
  line-height: 1.6;
  /* satır yüksekliği — okunabilirliği ciddi artırır, 1.4-1.8 arası iyi bir aralık */
  margin: 0;
  /* tarayıcıların body'ye koyduğu varsayılan boşluğu sıfırla */
}
```

### 1:00–2:00 · Box model — en önemli CSS kavramı

Tarayıcıda her eleman görünmez bir **kutu**dur. Bu kutu 4 katmandan oluşur, içten dışa:

```
┌─────────────────────────────────────┐
│              margin                  │  ← kutunun DIŞINDAKİ boşluk (komşu elemanlarla arayı açar)
│  ┌─────────────────────────────────┐ │
│  │            border               │ │  ← kutunun kenar çizgisi
│  │  ┌──────────────────────────┐   │ │
│  │  │         padding          │   │ │  ← kutunun İÇİNDEKİ boşluk (içerikle kenar arasını açar)
│  │  │  ┌────────────────────┐  │   │ │
│  │  │  │      content       │  │   │ │  ← asıl yazı/resim burada
│  │  │  └────────────────────┘  │   │ │
│  │  └──────────────────────────┘   │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

Kod üzerinde:

```css
.kart {
  padding: 20px;
  /* içerik ile kenar arasında 20px boşluk */
  border: 1px solid #ddd;
  /* 1px kalınlığında, düz çizgi, açık gri renk */
  margin: 16px 0;
  /* üst-alt 16px, sağ-sol 0. (kısayol: üst/alt sağ/sol) */
  border-radius: 8px;
  /* köşeleri yuvarla — 8px yarıçap */
}
```

`margin` kısayolu sık kafa karıştırır — 4 farklı yazım şekli:

```css
margin: 10px;              /* dört tarafa da 10px */
margin: 10px 20px;         /* üst-alt: 10px, sağ-sol: 20px */
margin: 10px 20px 30px;    /* üst: 10px, sağ-sol: 20px, alt: 30px */
margin: 10px 20px 30px 40px; /* üst sağ alt sol — saat yönünde */
```

💡 **En yaygın hata:** `padding` ekleyince kutunun toplam genişliği `width + padding + border` olur, beklediğinden büyür. Bunu önlemek için hemen hemen her projede şu satırı en başa koyulur:

```css
* {
  box-sizing: border-box;
  /* box-sizing: border-box → padding ve border artık width'in İÇİNDEN sayılır, dışına taşmaz.
     Bu satırı olmadan CSS yazmayı düşünme bile — endüstri standardı. */
}
```

### 2:00–3:00 · Sayfayı giydir

`style.css` dosyasını doldur — dün yazdığın HTML'i güzelleştir:

```css
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #222;
  line-height: 1.6;
  margin: 0;
  background-color: #fafafa;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 24px;
}

header h1 {
  margin: 0 0 8px 0;
}

nav ul {
  list-style: none;
  /* list-style: none → li'lerin başındaki noktaları kaldırır */
  padding: 0;
  margin: 0;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
  /* text-decoration: none → linkin altındaki çizgiyi kaldırır */
  margin-right: 16px;
}

nav a:hover {
  /* :hover — fareyle üzerine gelince tetiklenen "pseudo-class" (sanal durum seçici) */
  text-decoration: underline;
}

section {
  max-width: 700px;
  margin: 32px auto;
  /* margin: 32px auto → üst-alt 32px, sağ-sol "auto" = ortala */
  padding: 0 20px;
}

img {
  max-width: 200px;
  border-radius: 50%;
  /* %50 border-radius + eşit width/height = tam daire */
}

footer {
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 14px;
}
```

Sayfayı tarayıcıda tazele (F5 / Cmd+R). Header artık koyu renk, resim yuvarlak, bölümler ortalanmış olmalı. Renkleri ve boşlukları kendi zevkine göre oyna — CSS'te "doğru" cevap tek değil, deneyerek gözünle karar ver.

**Küçük zafer:** Çıplak HTML artık gerçek bir siteye benziyor — renk, boşluk, hizalama senin elinden çıktı.
**Terim defteri:** `box model`, `padding/margin/border`, `class vs id`, `box-sizing: border-box`, `:hover`
**Çıktı:** `hakkimda/style.css` bağlı ve çalışıyor.
**Commit:** `git commit -m "hafta-02 g2: css box model + sayfayi giydirme"`

---

## Gün 3 — Flexbox: Elemanları Hizalama

### 0:00–1:00 · Flexbox kavramı

Şu ana kadar elemanlar hep alt alta dizildi (block davranışı). Flexbox, elemanları **yan yana veya alt alta, kolayca hizalamak** için var — özellikle menüler, buton grupları, kart sıraları için standart çözüm.

Flexbox mantığı: bir "kap" (container) elemana `display: flex` verirsin, içindeki tüm çocuklar otomatik olarak yan yana dizilir.

```css
.container {
  display: flex;
  /* display: flex → bu elemanın DOĞRUDAN çocukları artık flex kuralına göre dizilir */
}
```

İki eksen kavramı önemli:
- **main axis (ana eksen):** varsayılan olarak yatay (soldan sağa)
- **cross axis (çapraz eksen):** varsayılan olarak dikey (yukarıdan aşağı)

```
main axis  →→→→→→→→→→→→→→→→
┌────┐ ┌────┐ ┌────┐
│ 1  │ │ 2  │ │ 3  │  ↑ cross axis
└────┘ └────┘ └────┘  ↓
```

Denemek için `nav ul`'u flex yap (şu an zaten liste elemanları yan yana görünüyordu çünkü `list-style: none` sonrası inline değildi — flex ile daha kontrollü hale getirelim):

```css
nav ul {
  display: flex;
  /* artık li'ler yan yana, satır satır değil */
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 20px;
  /* gap: elemanlar arasına boşluk — margin'e göre çok daha temiz bir yöntem */
}
```

### 1:00–2:00 · justify-content, align-items, gap

Bu üç özellik flexbox'ın kalbi:

```css
.container {
  display: flex;
  justify-content: space-between;
  /* justify-content: ANA eksende (genelde yatay) hizalama
     - flex-start: sola yasla (varsayılan)
     - center: ortala
     - space-between: ilk eleman en solda, son en sağda, aradakiler eşit boşlukla
     - space-around: her elemanın etrafında eşit boşluk
  */
  align-items: center;
  /* align-items: ÇAPRAZ eksende (genelde dikey) hizalama
     - flex-start: yukarı yasla
     - center: dikeyde ortala
     - stretch: kabın tüm yüksekliğini kapla (varsayılan)
  */
  gap: 16px;
  /* elemanlar arası boşluk, hem yatay hem dikey */
}
```

Küçük bir deney sayfası aç (`gun3-deneme.html` gibi, hızlı test için) ve şunu dene:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Flexbox deneme</title>
  <style>
    .kutu {
      display: flex;
      justify-content: center;   /* bunu değiştir: flex-start, space-between, space-around dene */
      align-items: center;       /* bunu değiştir: flex-start, flex-end dene */
      gap: 12px;
      height: 200px;
      background: #eee;
      border: 2px dashed #999;
    }
    .kutu div {
      background: dodgerblue;
      color: white;
      padding: 16px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="kutu">
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>
</body>
</html>
```

Değerleri tek tek değiştirip sayfayı yenile, ne değiştiğini gözünle gör. Bu, flexbox'ı öğrenmenin en hızlı yolu — okumaktan değil, oynamaktan öğrenilir.

💡 **Opsiyonel pratik:** [Flexbox Froggy](https://flexboxfroggy.com/?lang=tr) — CSS yazarak kurbağayı nilüfere taşıdığın oyunlaştırılmış bir alıştırma. 15-20 dakika ayırıp oynarsan flex kalıcı olarak oturur.

### 2:00–3:00 · Menü çubuğunu flexbox ile hizala

`hakkimda/style.css`'e dön ve header'ı flex ile düzenle — logo/isim solda, menü sağda olsun:

```css
header {
  background-color: #2c3e50;
  color: white;
  padding: 24px;
  display: flex;
  /* header'ın çocukları (h1 ve nav) artık yan yana */
  justify-content: space-between;
  /* h1 sola, nav sağa yaslanır */
  align-items: center;
  /* dikeyde ortalanır, h1 ile nav aynı hizada durur */
  flex-wrap: wrap;
  /* ekran daralınca elemanlar alt satıra taşabilsin, taşmasınlar */
}

header h1 {
  margin: 0;
  font-size: 22px;
}
```

Formun butonunu da flex ile düzenle — form elemanlarını dikey sırala ama etiket-input arasını sıkılaştır:

```css
form {
  display: flex;
  flex-direction: column;
  /* flex-direction: column → ana eksen dikey olur, elemanlar alt alta dizilir */
  gap: 12px;
  max-width: 400px;
}

form input,
form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  /* inherit: body'deki fontu miras al, tarayıcı varsayılanını kullanma */
}

form button {
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  /* cursor: pointer → üzerine gelince el işareti, "buna tıklanır" sinyali verir */
  align-self: flex-start;
  /* align-self: bu TEK elemanı, kabın align-items kuralından bağımsız hizalar */
}

form button:hover {
  background-color: #1a252f;
}
```

Sayfayı tazele: header artık isim solda menü sağda; form dikey ve düzenli görünmeli.

**Küçük zafer:** Elemanları elle margin hesaplayarak değil, flexbox ile "niyetini söyleyerek" hizaladın.
**Terim defteri:** `display: flex`, `main/cross axis`, `justify-content`, `align-items`, `gap`
**Çıktı:** Header ve form artık flexbox ile hizalı.
**Commit:** `git commit -m "hafta-02 g3: flexbox ile menu ve form hizalama"`

---

## Gün 4 — Grid ve Responsive Tasarım

### 0:00–1:00 · CSS Grid kavramı

Flexbox tek boyutlu (ya satır ya sütun) düşünür. Grid ise **iki boyutlu** — satır VE sütunları aynı anda kontrol eder. Kart ızgaraları, galeri görünümleri için grid daha rahat.

```css
.container {
  display: grid;
  /* display: grid → çocuklar artık ızgara hücrelerine yerleşir */
  grid-template-columns: 1fr 1fr 1fr;
  /* grid-template-columns: kaç sütun olacağını ve genişliklerini tanımlar
     fr = "fraction", kalan alanın payı. "1fr 1fr 1fr" → 3 eşit sütun */
  gap: 16px;
  /* hücreler arası boşluk */
}
```

`repeat()` ile tekrar yazmayı kısaltabilirsin:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* repeat(3, 1fr) === "1fr 1fr 1fr" — üç eşit sütun, daha okunaklı yazım */
  gap: 16px;
}
```

💡 En kullanışlı grid satırı, otomatik responsive kart ızgarası için:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* auto-fit: sığdığı kadar sütun aç
     minmax(200px, 1fr): her sütun en az 200px, mümkünse eşit paylaş
     Sonuç: pencere daralınca sütun sayısı OTOMATİK azalır — media query bile gerekmez! */
  gap: 16px;
}
```

### 1:00–2:00 · Kart ızgarası yap

"Yetenekler" bölümünü listeden karta çevirelim. Önce HTML'i düzenle (`index.html`):

```html
<section id="yetenekler">
  <h2>Yetenekler</h2>
  <div class="kart-izgara">
    <!-- ul/li yerine artık kart yapısı kullanıyoruz -->
    <div class="kart">
      <h3>HTML & CSS</h3>
      <p>Sayfa iskeleti ve stil.</p>
    </div>
    <div class="kart">
      <h3>JavaScript</h3>
      <p>Sıfırdan öğreniyorum, ilerliyorum.</p>
    </div>
    <div class="kart">
      <h3>Git & GitHub</h3>
      <p>Versiyon kontrolü, her gün commit.</p>
    </div>
    <div class="kart">
      <h3>Terminal</h3>
      <p>Komut satırında rahatım.</p>
    </div>
  </div>
</section>
```

CSS tarafında ızgarayı ve kart görünümünü tanımla:

```css
.kart-izgara {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.kart {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  /* box-shadow: x-offset y-offset blur renk — hafif bir "yükselti" hissi verir */
}

.kart h3 {
  margin-top: 0;
  color: #2c3e50;
}
```

Tarayıcıyı tazele, pencereyi daraltıp genişlet — kart sayısı satır başına otomatik ayarlanmalı (`auto-fit` sayesinde).

### 2:00–3:00 · @media ile mobil uyum

Şu ana kadar `auto-fit` çoğu şeyi otomatik hallediyor, ama bazı durumlarda "ekran şu genişlikten küçükse şunu yap" demen gerekir. Bunun için **media query** kullanılır.

```css
/* Varsayılan (masaüstü) stiller yukarıda zaten yazıldı.
   @media bloğu, SADECE koşul sağlandığında devreye girer ve önceki kuralları EZER. */

@media (max-width: 600px) {
  /* ekran genişliği 600px veya daha az olduğunda bu blok aktif olur */

  header {
    flex-direction: column;
    /* mobilde isim ve menü yan yana değil, alt alta */
    align-items: flex-start;
    gap: 12px;
  }

  section {
    padding: 0 12px;
    /* mobilde kenar boşluğunu azalt, içerik kenara yapışmasın ama fazla yer kaplamasın */
  }

  .kart-izgara {
    grid-template-columns: 1fr;
    /* mobilde tek sütun — kartlar alt alta */
  }
}
```

💡 **Mobile-first vs desktop-first:** Biz burada "desktop-first" yazdık (önce geniş ekran, sonra `max-width` ile küçültüyoruz). Endüstride "mobile-first" (önce mobil, `min-width` ile büyütme) daha yaygındır ama başlangıç için desktop-first daha sezgisel — ikisi de doğru yaklaşım, ileride ikisini de göreceksin.

Chrome/Safari'de pencereyi elle daraltarak test et, ya da tarayıcı DevTools'ta (F12 / Cmd+Opt+I) "responsive mode" / "device toolbar" ikonuna tıklayıp telefon ekran boyutunu simüle et.

**Küçük zafer:** Sayfan artık hem masaüstünde hem telefonda düzgün görünüyor — responsive tasarımın ilk adımı tamam.
**Terim defteri:** `display: grid`, `grid-template-columns`, `repeat()/auto-fit/minmax`, `@media (max-width)`, `responsive`
**Çıktı:** Kart ızgarası + mobil uyumlu sayfa.
**Commit:** `git commit -m "hafta-02 g4: css grid kart izgarasi + responsive media query"`

---

## Gün 5 — DOM ve Olaylar (Event'ler)

### 0:00–1:00 · DOM nedir, querySelector, textContent

Şimdiye kadar sayfa **statik** — hiçbir şey tıklayınca değişmiyor. DOM (Document Object Model), tarayıcının HTML'i JavaScript'in erişebileceği bir "ağaç" haline getirmiş hali. JavaScript ile bu ağaca dokunup içeriği, stili, yapıyı **çalışırken** değiştirebilirsin.

`hakkimda` klasöründe `script.js` dosyası oluştur ve `index.html`'in **body'nin en altına** (kapanış `</body>` etiketinden hemen önce) bağla:

```html
  ...
  <script src="script.js"></script>
</body>
</html>
```

💡 `<script>` etiketini `body`'nin sonuna koymanın sebebi: tarayıcı önce tüm HTML'i okusun, sonra JS çalışsın. Aksi halde JS, henüz sayfada olmayan bir elemanı bulmaya çalışıp hata verebilir.

Bir elemanı JS'ten yakalamanın yolu `querySelector`:

```js
// querySelector: CSS seçici yazımıyla (nokta=class, #=id) sayfadan TEK bir eleman bulur
const baslik = document.querySelector("h1");
console.log(baslik);
// tarayıcı konsolunda (F12 > Console) o elemanın kendisini gösterir

// textContent: elemanın İÇİNDEKİ YAZIYI okur ya da değiştirir
console.log(baslik.textContent); // "Merhaba, ben Elif" yazdırır

baslik.textContent = "Merhaba, ben Elif 👋";
// artık sayfadaki h1 yazısı DEĞİŞTİ — HTML dosyasını hiç açmadan!
```

`document.querySelector(".kart")` ilk kartı bulur; TÜM kartları istiyorsan `querySelectorAll` kullanılır (bir dizi benzeri liste döner — Hafta 3'te dizi metotlarıyla birlikte daha çok kullanacağız).

Kaydet, sayfayı yenile, tarayıcı konsolunu aç (sağ tık > İncele > Console, ya da Cmd+Opt+J) — hem `console.log` çıktısını hem de değişen başlığı gör.

### 1:00–2:00 · addEventListener ve classList.toggle

Statik değişiklik yeterli değil — kullanıcı bir şeye **tıklayınca** bir şey olsun istiyoruz. Bunun için `addEventListener`:

```js
const buton = document.querySelector("#tema-buton");
// #tema-buton id'li elemanı bul (bunu birazdan HTML'e ekleyeceğiz)

buton.addEventListener("click", function () {
  // addEventListener(olayAdı, fonksiyon): "click" olayı olduğunda bu fonksiyonu ÇALIŞTIR
  // Fonksiyonu hemen çalıştırmıyoruz — tarayıcıya "tıklanınca bunu çalıştır" diye KAYDEDİYORUZ
  console.log("Butona tıklandı!");
});
```

`classList.toggle`, bir elemana bir class'ı **varsa kaldırır, yoksa ekler** — açma/kapama (tema, menü, akordeon) için ideal:

```js
const body = document.querySelector("body");

buton.addEventListener("click", function () {
  body.classList.toggle("koyu-tema");
  // "koyu-tema" class'ı body'de yoksa EKLENİR, varsa KALDIRILIR
  // Her tıklamada açık/kapalı arası geçiş yapar
});
```

### 2:00–3:00 · "Tema değiştir" butonu

Önce HTML'e buton ekle (`header`'ın içine, `nav`'dan sonra):

```html
<header>
  <h1>Elif Yılmaz</h1>
  <nav>...</nav>
  <button id="tema-buton">🌙 Karanlık mod</button>
</header>
```

CSS'e koyu tema kurallarını ekle:

```css
body.koyu-tema {
  /* body.koyu-tema: body'de HEM "koyu-tema" class'ı VARSA bu kural uygulanır */
  background-color: #1a1a1a;
  color: #eee;
}

body.koyu-tema header {
  background-color: #000;
}

body.koyu-tema .kart {
  background-color: #2a2a2a;
  border-color: #444;
  color: #eee;
}

#tema-buton {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
```

`script.js`'i tamamla:

```js
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
```

Sayfayı yenile, butona tıkla — sayfa koyu/açık tema arasında geçiş yapmalı, buton yazısı da değişmeli. Bu senin **ilk gerçek interaktif özelliğin.**

**Küçük zafer:** JavaScript ile HTML dosyasını hiç açmadan, çalışırken sayfayı değiştirdin — bu, "statik sayfa"dan "web app"e giden yolun ilk adımı.
**Terim defteri:** `DOM`, `querySelector`, `textContent`, `addEventListener`, `classList.toggle/contains`
**Çıktı:** Çalışan karanlık/aydınlık mod butonu.
**Commit:** `git commit -m "hafta-02 g5: dom + event listener ile tema degistir butonu"`

---

## Gün 6 — Mini Proje + İlk Deploy 🌐

### 0:00–1:00 · Landing page'i planla ve son rötuşları yap

Bugün beş günlük çalışmayı bir "landing page" (tanıtım sayfası) haline getirip **internete** koyuyoruz. Elindeki `hakkimda` sayfası zaten çoğu parçayı içeriyor — bugün bunu gözden geçirip tamamlayacaksın.

Kontrol listesi (`index.html`'i baştan sona oku ve tikle):

```
[ ] <title> kişisel ve anlamlı mı? ("Elif Yılmaz — Fullstack Geliştirici Adayı" gibi)
[ ] h1 sayfada sadece bir tane mi?
[ ] Tüm <img>'lerde alt metni var mı?
[ ] Menü linkleri (#hakkimda, #yetenekler, #iletisim) doğru section'lara gidiyor mu?
[ ] Form alanlarında label/input eşleşiyor mu?
[ ] Mobilde (pencereyi daraltarak test et) sayfa bozulmuyor mu?
[ ] Tema butonu çalışıyor mu?
```

Eksik varsa şimdi tamamla. İstersen küçük bir "Projelerim" section'ı da ekle (şimdilik boş/placeholder olabilir — Hafta 3-4'te dolduracağın projeler için yer açmış olursun):

```html
<section id="projeler">
  <h2>Projeler</h2>
  <div class="kart-izgara">
    <div class="kart">
      <h3>🚧 Yakında</h3>
      <p>İlk projelerim bu hafta burada görünecek.</p>
    </div>
  </div>
</section>
```

### 1:00–2:00 · GitHub'a push

Eğer bu dosyalar hâlâ sadece `elif-fullstack` reposunun içindeyse (Hafta 1'de kurduğun repo), direkt push edebilirsin:

```bash
cd ~/elif-fullstack
git status
# değişen/yeni dosyaları gör (hafta-02/hakkimda/... altında olmalı)

git add hafta-02/
git commit -m "hafta-02 g6: landing page tamamlandi"
git push
```

Ama Vercel'e **tek bir statik siteyi** deploy etmek istiyorsan, bu sayfayı kendi başına bir repo yapmak daha temiz olur (ana `elif-fullstack` reposu senin "günlük çalışma defterin", ama bir siteyi canlıya almak için genelde **ayrı bir proje reposu** kullanılır — ileride her proje kendi repo'sunda yaşayacak, bu iyi bir alışkanlık).

```bash
# hakkimda klasörünü ayrı bir proje reposu yap
cd ~/elif-fullstack/hafta-02/hakkimda
git init
# git init: bu klasörü YENİ ve BAĞIMSIZ bir git deposu yapar

git add .
git commit -m "ilk commit: hakkimda landing page"

# GitHub'da yeni, boş bir repo oluştur (github.com > New repository > "elif-hakkimda")
# Sonra GitHub'ın sana verdiği komutları çalıştır, örnek:
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/elif-hakkimda.git
git push -u origin main
```

💡 `git remote add origin <link>` — "origin" senin GitHub'daki uzak deponun ismi (kısayolu). `-u` ise "bundan sonra sadece `git push` yazman yeterli, hangi uzak depoya gideceğini hatırla" demek.

### 2:00–3:00 · Vercel'e import et ve canlıya al

**Deploy** = kodunu senin bilgisayarından çıkarıp, herkesin internetten erişebileceği bir sunucuya koymak. Vercel bunu statik siteler için (ve ileride React/Next.js projeleri için) çok kolay hale getiren bir platform.

Adımlar:

```
1. vercel.com adresine git, GitHub hesabınla giriş yap
2. "Add New..." → "Project" tıkla
3. Az önce push ettiğin "elif-hakkimda" reposunu bul ve "Import" de
4. Framework Preset: "Other" seç (saf HTML/CSS/JS olduğu için build gerekmiyor)
5. Ayarlara dokunma, "Deploy" butonuna bas
6. ~30 saniye bekle → "Congratulations!" ekranı ve canlı linkin çıkar
   (örnek: elif-hakkimda.vercel.app)
```

**CI/CD nedir (kısaca):** CI/CD = "Continuous Integration / Continuous Deployment" (sürekli entegrasyon / sürekli dağıtım). Vercel, reponu bir kere bağladıktan sonra, sen her `git push` yaptığında **otomatik olarak** yeni versiyonu canlıya alır — sen tekrar "deploy et" demene gerek kalmaz. Bunu şimdi test et:

```bash
# style.css'te küçük bir değişiklik yap (örn. bir rengi değiştir)
git add .
git commit -m "test: renk degisikligi"
git push
```

Vercel dashboard'una git — birkaç saniye içinde yeni bir "Deployment" başladığını, bitince sitenin otomatik güncellendiğini göreceksin. **Bu, modern web geliştirmenin kalbi:** kod push edilir, otomatik test/build/deploy zinciri tetiklenir, insan araya girmez.

Linkini not al — bundan sonraki her projede bu akışı tekrar edeceksin.

**Küçük zafer:** Kendi yazdığın bir site artık internet'te, kendi linkiyle, herkesin erişebileceği şekilde canlı. Bu linki paylaşabilirsin.
**Terim defteri:** `deploy`, `repo (ayrı proje reposu)`, `git remote/origin`, `CI/CD`, `build`
**Çıktı:** 🌐 `https://elif-hakkimda.vercel.app` (kendi linkin) — canlı, gerçek, internetteki ilk siten.
**Commit:** `git commit -m "hafta-02 g6: ilk deploy - canli site"`

---

## Gün 7 — Pazar Review

Bugün kod yazmıyorsun (istersen küçük bir dokunuş yaparsın ama şart değil). Roy ile 30 dk:

1. **Teach-back:** Box model'i, flexbox'ın justify-content/align-items farkını ve DOM'un ne olduğunu kendi cümlelerinle anlat — anlatamıyorsan tam öğrenmemişsindir, o gün geri dön.
2. **Canlı linkini göster.** Her cihazdan (telefon dahil) açıp mobil görünümü kontrol et.
3. **Hafta 3'ün saat-saat planı** açılır: modern JavaScript (ES6, dizi metotları, fetch) ile bir API'den veri çekip ekrana basacaksın.

**Bu hafta özet:** HTML iskelet kurdun, CSS ile giydirdin, flexbox ve grid ile hizaladın, mobil uyumlu yaptın, DOM ile interaktif hale getirdin, GitHub'a push edip Vercel'e deploy ettin. Sıfırdan başlayıp internette canlı bir site — bir haftada.
