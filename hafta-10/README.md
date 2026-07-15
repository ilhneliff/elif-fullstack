# Hafta 10 — Fullstack Birleşme (Faz 3)

> **Hedef:** React frontend'ini kendi API'ne bağlamak, giriş sistemi eklemek, uçtan uca çalışan ilk gerçek fullstack uygulamanı canlıya almak.
> **Çıktı:** ✔ ilk canlı fullstack app · başvurular başlar
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Bu, Faz 3'ün son haftası — **Görev Defteri**'ni bitiriyorsun. Hafta 8'de API'yi kurdun, Hafta 9'da veritabanına bağladın. Bu hafta: (1) gerçek giriş/kayıt sistemi, (2) React'ini bu API'ye bağlamak, (3) her ikisini de canlıya almak. Hafta sonunda elinde **başvurularda gösterebileceğin ilk tam fullstack proje** olacak — Gün 6'da CV taslağına da başlıyoruz, çünkü başvuru süreci burada paralel başlar.

---

## Gün 1 — Auth kavramı: bcrypt, JWT, korunan route

### 0:00–1:00 · Şifreyi neden düz metin saklamıyoruz

Hafta 9'daki `Kullanici` modelinde henüz şifre yok. Şimdi ekleyeceğiz — ama **asla düz metin olarak değil**. Veritabanın bir gün sızarsa (hacklenirse), düz metin şifreler tüm kullanıcıları tehlikeye atar. Bunun yerine şifreyi **hash**leriz — geri döndürülemeyen bir "karışım"a çeviririz.

```bash
npm install bcrypt
```

```js
const bcrypt = require("bcrypt");

async function ornek() {
  const sifre = "elif1234";

  // hash: şifreyi geri döndürülemez bir metne çevir (10 = "tur sayısı", ne kadar yüksekse o kadar yavaş/güvenli)
  const hash = await bcrypt.hash(sifre, 10);
  console.log(hash); // $2b$10$N9qo8uLOickgx2ZMRZoMy... gibi anlamsız bir metin

  // compare: kullanıcı giriş yaparken girdiği şifreyi hash ile karşılaştır
  const dogruMu = await bcrypt.compare("elif1234", hash);
  console.log(dogruMu); // true

  const dogruMu2 = await bcrypt.compare("yanlisSifre", hash);
  console.log(dogruMu2); // false
}
ornek();
```

`hash`'ten şifreyi **geri çeviremezsin** — tek yönlü bir işlem. Sadece "bu girdiğin şifre, bu hash'i mi üretiyor" diye karşılaştırabilirsin (`compare`).

### 1:00–2:00 · JWT nedir

Kullanıcı giriş yaptığında, sunucu ona bir kimlik kartı gibi bir **token** verir. Sonraki her istekte kullanıcı bu token'ı gösterir, sunucu da "evet, bu gerçekten sen" der — her seferinde şifre sormaz.

```bash
npm install jsonwebtoken
```

```js
const jwt = require("jsonwebtoken");

const GIZLI_ANAHTAR = "cok-gizli-bir-metin"; // gerçekte .env'de tutulur, Gün 3'te göreceğiz

// bir kullanıcı için token üret
const token = jwt.sign({ kullaniciId: 1, email: "elif@example.com" }, GIZLI_ANAHTAR, {
  expiresIn: "7d", // 7 gün sonra geçersiz olsun
});
console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... gibi uzun bir metin

// token'ı doğrula ve içindeki bilgiyi geri al
const cozulen = jwt.verify(token, GIZLI_ANAHTAR);
console.log(cozulen); // { kullaniciId: 1, email: "elif@example.com", iat: ..., exp: ... }
```

Token'ın içinde kullanıcının kim olduğu bilgisi **şifrelenmiş** (imzalı) şekilde durur. `GIZLI_ANAHTAR`'ı sadece sunucu bilir — biri sahte bir token uydurmaya çalışsa, imza tutmaz, `jwt.verify` hata fırlatır.

### 2:00–3:00 · Korunan route middleware'i

Hafta 8'de kendi middleware'ini yazmıştın (logger). Şimdi bir tane daha: gelen isteğin geçerli bir token taşıyıp taşımadığını kontrol eden middleware.

```js
// authMiddleware.js
const jwt = require("jsonwebtoken");
const GIZLI_ANAHTAR = "cok-gizli-bir-metin";

function tokenDogrula(req, res, next) {
  const authHeader = req.headers["authorization"]; // "Bearer eyJhbGc..."
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer" kelimesini at, token'ı al

  if (!token) {
    return res.status(401).json({ hata: "Giriş yapmalısın" });
  }

  try {
    const kullanici = jwt.verify(token, GIZLI_ANAHTAR);
    req.kullanici = kullanici; // sonraki route'lar req.kullanici'ye erişebilsin
    next(); // her şey yolunda, route'a devam et
  } catch (hata) {
    res.status(403).json({ hata: "Geçersiz veya süresi dolmuş token" });
  }
}

module.exports = tokenDogrula;
```

`401 Unauthorized` (giriş yapmamışsın) ile `403 Forbidden` (giriş yaptın ama token bozuk/süresi dolmuş) arasındaki farka dikkat et — ikisi de "izin yok" ama nedeni farklı.

💡 Bu bir küçük test scripti — gerçek route'lara Gün 2'de bağlayacağız. Bugün amacın bcrypt ve JWT'nin **ayrı ayrı** nasıl çalıştığını görmek.

**Küçük zafer:** Şifre hash'leyip karşılaştırabiliyorsun, token üretip doğrulayabiliyorsun — auth'un iki temel taşı elinde.
**Terim defteri:** `hash`, `bcrypt`, `JWT (JSON Web Token)`, `Authorization header`, `401 / 403`
**Çıktı:** Hash üreten/karşılaştıran + token üreten/doğrulayan çalışan bir test scripti
**Commit:** `hafta-10 g1: auth kavramları - bcrypt + jwt`

---

## Gün 2 — Kayıt/giriş uçları

### 0:00–1:00 · Kullanici modeline şifre ekle, /register

```prisma
// prisma/schema.prisma — Kullanici modeline sifre ekle
model Kullanici {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  sifre    String                   // hash'lenmiş hâliyle saklanacak
  gorevler Gorev[]
}
```

```bash
npx prisma migrate dev --name kullanici-sifre
```

```js
// server.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GIZLI_ANAHTAR = "cok-gizli-bir-metin"; // Gün 3'te .env'e taşıyacağız

app.post("/register", async (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ hata: "email ve sifre zorunlu" });
  }

  const mevcut = await prisma.kullanici.findUnique({ where: { email } });
  if (mevcut) {
    return res.status(400).json({ hata: "Bu email zaten kayıtlı" });
  }

  const hashliSifre = await bcrypt.hash(sifre, 10); // ASLA düz metin kaydetme
  const yeniKullanici = await prisma.kullanici.create({
    data: { email, sifre: hashliSifre },
  });

  // şifreyi cevapta ASLA geri döndürme, hash'i bile olsa
  res.status(201).json({ id: yeniKullanici.id, email: yeniKullanici.email });
});
```

### 1:00–2:00 · /login

```js
app.post("/login", async (req, res) => {
  const { email, sifre } = req.body;

  const kullanici = await prisma.kullanici.findUnique({ where: { email } });
  if (!kullanici) {
    return res.status(400).json({ hata: "Email veya şifre hatalı" });
  }

  const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
  if (!sifreDogruMu) {
    return res.status(400).json({ hata: "Email veya şifre hatalı" });
  }

  const token = jwt.sign(
    { kullaniciId: kullanici.id, email: kullanici.email },
    GIZLI_ANAHTAR,
    { expiresIn: "7d" }
  );

  res.json({ token });
});
```

💡 "Email veya şifre hatalı" mesajını **her iki durumda da** (email yok / şifre yanlış) aynı yazdık — bilerek. "Bu email kayıtlı değil" desen, kötü niyetli biri hangi email'lerin sistemde kayıtlı olduğunu tek tek deneyerek öğrenebilir. Belirsiz mesaj, güvenlik için tercih edilir.

### 2:00–3:00 · Korunan route'u bağla ve test et

```js
// Dün yazdığın middleware'i içeri al
const tokenDogrula = require("./authMiddleware");

// GET /gorevlerim → SADECE giriş yapmış kullanıcının kendi görevleri
app.get("/gorevlerim", tokenDogrula, async (req, res) => {
  // tokenDogrula middleware'i req.kullanici'yi doldurdu
  const gorevler = await prisma.gorev.findMany({
    where: { kullaniciId: req.kullanici.kullaniciId },
  });
  res.json(gorevler);
});
```

`app.get("/gorevlerim", tokenDogrula, async (req, res) => {...})` — dikkat et, iki fonksiyon var: önce `tokenDogrula` çalışır (token'ı kontrol eder), o `next()` çağırırsa **sonra** asıl route fonksiyonu çalışır. Middleware'leri zincirlemek böyle olur.

Thunder Client'ta sırayla test et:
1. `POST /register` — yeni kullanıcı oluştur
2. `POST /login` — token al
3. `GET /gorevlerim` — Headers'a `Authorization: Bearer <token>` ekleyerek dene
4. Aynı isteği token'sız dene — `401` almalısın

**Küçük zafer:** Gerçek bir kayıt/giriş akışın var — kimse token'sız başkasının görevlerini göremiyor.
**Terim defteri:** `register`, `login`, `Authorization: Bearer <token>`, `401 Unauthorized`
**Çıktı:** Çalışan `/register`, `/login`, `/gorevlerim` (korunan) uçları
**Commit:** `hafta-10 g2: register + login uçları`

---

## Gün 3 — Frontend'i API'ye bağla: CORS, .env, token'lı fetch

### 0:00–1:00 · CORS nedir, neden engelleniyorsun

React uygulaman `localhost:5173`'te, API'n `localhost:3000`'de çalışıyor — **farklı adresler**. Tarayıcı, güvenlik gereği farklı adresler arası istekleri varsayılan olarak engeller. Buna **CORS (Cross-Origin Resource Sharing)** politikası denir.

```bash
npm install cors
```

```js
// server.js — en üste ekle
const cors = require("cors");
app.use(cors()); // şimdilik her adresten isteğe izin ver (geliştirme için yeterli)
```

```text
   React (localhost:5173)              Express API (localhost:3000)
       │                                        │
       │  fetch("http://localhost:3000/...")     │
       │ ─────────────────────────────────────►  │
       │                                        │
       │  ◄── tarayıcı: "bu farklı bir origin,   │
       │       API CORS izni verdi mi?" kontrol   │
       │       eder. app.use(cors()) → izin var,  │
       │       istek geçer.                        │
```

💡 CORS hatası konsolda kırmızı yazıyla çıkar (`blocked by CORS policy`) — bu **API'nin çalışmadığı** anlamına gelmez, sadece tarayıcının izin vermediği anlamına gelir. `app.use(cors())` eklediğinde çoğu zaman anında çözülür.

### 1:00–2:00 · React tarafında .env

React (Vite) projende, API adresini kod içine sabit yazmak yerine bir ortam değişkeninde tutarsın — böylece lokal/production arasında tek satır değiştirirsin.

```text
# .env (React projenin kök dizininde)
VITE_API_URL=http://localhost:3000
```

⚠️ **Bu `.env` dosyasını da asla Git'e ekleme** — React projenin `.gitignore`'una `.env` satırının olduğundan emin ol.

```js
// src/api.js — API adresini tek yerden yönet
const API_URL = import.meta.env.VITE_API_URL;

export async function girisYap(email, sifre) {
  const cevap = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, sifre }),
  });

  if (!cevap.ok) {
    throw new Error("Giriş başarısız");
  }
  return cevap.json(); // { token: "..." }
}
```

Vite'ta ortam değişkenlerine `import.meta.env.DEĞİŞKEN_ADI` ile erişilir — `VITE_` ön eki **zorunlu**, yoksa Vite değişkeni tarayıcıya taşımaz (güvenlik önlemi).

### 2:00–3:00 · Token'ı sakla, korunan isteği yap

```js
// src/App.jsx (özet)
import { useState } from "react";
import { girisYap } from "./api";

function App() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  async function handleGiris(e) {
    e.preventDefault();
    try {
      const { token } = await girisYap(email, sifre);
      localStorage.setItem("token", token); // tarayıcıda kalıcı sakla
      console.log("Giriş başarılı, token kaydedildi");
    } catch (hata) {
      console.error(hata.message);
    }
  }

  return (
    <form onSubmit={handleGiris}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={sifre} onChange={(e) => setSifre(e.target.value)} type="password" placeholder="şifre" />
      <button type="submit">Giriş yap</button>
    </form>
  );
}
```

```js
// src/api.js — korunan bir endpoint'e token'lı istek örneği
export async function gorevleriGetir() {
  const token = localStorage.getItem("token");

  const cevap = await fetch(`${API_URL}/gorevlerim`, {
    headers: {
      Authorization: `Bearer ${token}`, // Gün 2'deki middleware bunu bekliyor
    },
  });

  if (!cevap.ok) throw new Error("Görevler alınamadı");
  return cevap.json();
}
```

`localStorage`, tarayıcıda veriyi kalıcı tutan basit bir depo — sayfa yenilense bile token orada durur (sekmeyi kapatana kadar değil, tarayıcıyı silene kadar kalır).

💡 İlk kez React (frontend) ve Express (backend) **senin ellerinle** konuşuyor. Konsolu aç, Network sekmesinden isteğin gidip geldiğini izle — bu, iki tarafı da yazan biri olarak en tatmin edici anlardan biri.

**Küçük zafer:** React'ten login olup, aldığın token'ı saklayıp, onunla korunan bir isteği başarıyla attın.
**Terim defteri:** `CORS`, `.env` (frontend), `VITE_` öneki, `localStorage`, `Authorization header`
**Çıktı:** Login formu çalışan, token alıp saklayan ilk frontend-backend bağlantısı
**Commit:** `hafta-10 g3: frontend-backend ilk bağlantı (cors + token)`

---

## Gün 4 — Uçtan uca özellik: giriş → veri ekle → listede gör

### 0:00–1:00 · Giriş sonrası görevleri çek ve göster

```js
// src/App.jsx (devamı)
import { useState, useEffect } from "react";
import { girisYap, gorevleriGetir } from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [gorevler, setGorevler] = useState([]);

  // token varsa (giriş yapılmışsa) görevleri çek
  useEffect(() => {
    if (!token) return;
    gorevleriGetir()
      .then(setGorevler)
      .catch((hata) => console.error(hata.message));
  }, [token]); // token değiştiğinde (giriş yapıldığında) yeniden çalışır

  // ... handleGiris içinde setToken(token) de çağır, useEffect tetiklensin
}
```

`useEffect`'in ikinci parametresi (`[token]`) — "token değiştiğinde bu kodu tekrar çalıştır" demek. Giriş yapılıp token değiştiği an, görevler otomatik çekilir.

### 1:00–2:00 · Formdan yeni görev ekleme

```js
// src/api.js
export async function gorevEkle(baslik) {
  const token = localStorage.getItem("token");
  const cevap = await fetch(`${API_URL}/gorevler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ baslik }),
  });
  if (!cevap.ok) throw new Error("Görev eklenemedi");
  return cevap.json();
}
```

```js
// src/App.jsx (devamı)
function GorevEkleForm({ onEklendi }) {
  const [baslik, setBaslik] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const yeniGorev = await gorevEkle(baslik);
    onEklendi(yeniGorev); // ekleneni parent'a bildir
    setBaslik(""); // formu temizle
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="yeni görev..." />
      <button type="submit">Ekle</button>
    </form>
  );
}
```

### 2:00–3:00 · Eklenen veriyi anında listede göster

```js
// src/App.jsx — App component'inde
function App() {
  const [gorevler, setGorevler] = useState([]);

  function handleYeniGorev(yeniGorev) {
    // sunucudan tekrar çekmek yerine, listeye direkt ekle — anında görünür
    setGorevler((oncekiler) => [...oncekiler, yeniGorev]);
  }

  return (
    <div>
      <GorevEkleForm onEklendi={handleYeniGorev} />
      <ul>
        {gorevler.map((g) => (
          <li key={g.id}>
            {g.tamamlandi ? "✅" : "⬜"} {g.baslik}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Bu, tam döngü: **giriş yap → token al → görevleri çek → form ile yeni görev ekle → state güncellenince liste anında yenilenir.** Hafta 8'de yazdığın API, Hafta 9'da bağladığın veritabanı ve bugünkü React kodu artık **tek bir yaşayan uygulama**.

```text
   REACT (frontend)                    EXPRESS + PRISMA (backend)          POSTGRES
  ┌──────────────────┐               ┌──────────────────────┐          ┌──────────┐
  │ 1. Login formu       │  POST /login  │                          │          │          │
  │    girisYap()         │ ────────────► │ bcrypt.compare + jwt.sign │          │          │
  │    setToken(...)       │ ◄──────────── │ { token }                │          │          │
  │                       │               │                          │          │          │
  │ 2. useEffect            │  GET /gorevlerim (Authorization: Bearer)│          │          │
  │    gorevleriGetir()      │ ────────────► │ tokenDogrula → findMany   │ ───────► │  SELECT  │
  │    setGorevler(...)       │ ◄──────────── │ [ ...gorevler ]           │ ◄─────── │          │
  │                       │               │                          │          │          │
  │ 3. Form submit           │  POST /gorevler                          │          │          │
  │    gorevEkle(baslik)      │ ────────────► │ create                    │ ───────► │  INSERT  │
  │    liste güncellenir       │ ◄──────────── │ { yeni gorev }             │          │          │
  └──────────────────┘               └──────────────────────┘          └──────────┘
```

💡 `setGorevler((oncekiler) => [...oncekiler, yeniGorev])` — burada state'i **fonksiyon** ile güncelledik, doğrudan `gorevler` değişkenini kullanmadık. Bu, art arda hızlı güncellemelerde React'in her zaman en güncel listeyi kullanmasını garanti eder.

**Küçük zafer:** Giriş yapıp, veri ekleyip, anında listede gördüğün ilk tam uçtan uca özelliğin var.
**Terim defteri:** `useEffect` bağımlılığı, `controlled form`, `state güncelleme (functional update)`, `uçtan uca (end-to-end)`
**Çıktı:** Giriş → görev ekle → anında listede gör döngüsü tam çalışıyor
**Commit:** `hafta-10 g4: uçtan uca özellik tamam`

---

## Gün 5 — Deploy: FE Vercel + BE/DB Railway

### 0:00–1:00 · Frontend'i Vercel'e deploy et

React uygulamanı Hafta 5-7'de zaten Vercel'e deploy etmiştin — şimdi aynı süreç, ama artık bir backend'e bağlı.

```bash
# React projenin kök dizininde
git add .
git commit -m "backend baglantisi eklendi"
git push
```

Vercel dashboard'unda projeni bul (ya da yeni bağla) → **Settings → Environment Variables** → ekle:

```text
VITE_API_URL = https://senin-projen.up.railway.app
```

⚠️ Lokal `.env`'indeki `http://localhost:3000` **production'da işe yaramaz** — Vercel'in kendi ortam değişkeni panelinde production URL'ini ayrıca girmen gerekir. Ekledikten sonra **Redeploy** yap (Vercel değişkeni otomatik yakalamaz, yeniden deploy tetiklemen lazım).

### 1:00–2:00 · Backend'de CORS'u production'a aç

Gün 3'te `app.use(cors())` ile **her** origin'e izin vermiştik — geliştirme için sorun değil, ama production'da adresini belirtmek daha güvenli ve doğru pratik:

```js
// server.js
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",               // lokal geliştirme
      "https://senin-projen.vercel.app",       // production frontend
    ],
  })
);
```

```bash
git add .
git commit -m "cors production origin eklendi"
git push
railway up
```

### 2:00–3:00 · Uçtan uca canlı test

Şimdi gerçek URL'lerle tam döngüyü test et:

```text
1. https://senin-projen.vercel.app adresini aç (production frontend)
2. Kayıt ol / giriş yap (production backend'e istek gidiyor)
3. Yeni görev ekle
4. Sayfayı yenile — görev hâlâ orada mı? (Railway Postgres'ten geldiğini kanıtlar)
```

Bir şey çalışmazsa, sırayla kontrol et:
1. Tarayıcı konsolunda CORS hatası var mı? → `origin` listesini kontrol et
2. Network sekmesinde istek `404` mü dönüyor? → `VITE_API_URL` doğru mu, Redeploy yaptın mı?
3. Railway loglarında hata var mı? → `railway logs` ile bak

💡 Bu an — kendi domain'inde, kendi kodunla, kendi veritabanınla çalışan bir uygulamayı ilk kez tamamen canlı görmek — Faz 3'ün asıl ödülü. Ekran görüntüsü al, bir sonraki gün README'ye koyacaksın.

**Küçük zafer:** ✔ Tamamen canlı, gerçek domain'lerde çalışan ilk fullstack uygulaman var.
**Terim defteri:** `production environment variable`, `CORS origin (production)`, `redeploy`
**Çıktı:** Vercel'deki FE + Railway'deki BE+DB birlikte, canlıda, uçtan uca çalışıyor
**Commit:** `hafta-10 g5: fullstack app tamamen canlı`

---

## Gün 6 — Cila + README + demo, CV taslağı, başvuru rutini

### 0:00–1:00 · README yazımı

Bir projenin README'si, onu ilk gören biri (işveren dahil) için **kapı**. Ne yaptığını, nasıl çalıştığını, nasıl çalıştırılacağını net anlatmalı.

```markdown
# Görev Defteri

Basit bir yapılacaklar listesi uygulaması — kayıt ol, giriş yap, kendi görevlerini yönet.

## Demo
🔗 https://senin-projen.vercel.app

## Kullanılan teknolojiler
- Frontend: React, Vite
- Backend: Node.js, Express
- Veritabanı: PostgreSQL, Prisma (ORM)
- Auth: bcrypt (şifre hash) + JWT (token)
- Deploy: Vercel (frontend), Railway (backend + veritabanı)

## Özellikler
- Kayıt ol / giriş yap (şifre hash'lenmiş, token tabanlı auth)
- Görev ekle, listele
- Her kullanıcı sadece kendi görevlerini görür

## Lokalde çalıştırma
\`\`\`bash
# backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# frontend (ayrı terminalde)
cd frontend
npm install
npm run dev
\`\`\`

## Ekran görüntüsü
![görev defteri ekranı](./screenshot.png)
```

### 1:00–2:00 · Küçük cila

Bitmiş gibi görünen bir proje ile gerçekten bitmiş bir proje arasındaki fark, genelde şu küçük detaylarda:

```js
// yükleniyor durumu ekle — kullanıcı boş ekran yerine bir şey görsün
function App() {
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (!token) return;
    setYukleniyor(true);
    gorevleriGetir()
      .then(setGorevler)
      .catch((hata) => console.error(hata.message))
      .finally(() => setYukleniyor(false));
  }, [token]);

  if (yukleniyor) return <p>Yükleniyor...</p>;
  // ...
}
```

```js
// hata mesajını kullanıcıya da göster, sadece konsola değil
const [hataMesaji, setHataMesaji] = useState("");

async function handleGiris(e) {
  e.preventDefault();
  try {
    const { token } = await girisYap(email, sifre);
    localStorage.setItem("token", token);
    setToken(token);
    setHataMesaji("");
  } catch (hata) {
    setHataMesaji("Giriş başarısız — email veya şifreni kontrol et.");
  }
}
```

💡 20 dakikanı aşan bir cila detayına takılırsan bırak — bugünün asıl hedefi README ve CV, cila "varsa iyi" seviyesinde kalsın.

### 2:00–3:00 · CV taslağı ve başvuru rutini

Bu projeyi CV'ne ekleyecek ilk maddeyi yaz:

```text
Görev Defteri — Fullstack Web Uygulaması
React, Node.js/Express, PostgreSQL, Prisma, JWT tabanlı auth
kullanılarak geliştirilmiş, Vercel + Railway üzerinde canlı
bir yapılacaklar listesi uygulaması.
→ Kayıt/giriş, kullanıcıya özel veri, tam CRUD API.
Demo: senin-projen.vercel.app · Kod: github.com/kullanici-adin/repo
```

Başvuru rutini için basit bir plan çıkar (bunu bir not dosyasına yaz, bu hafta sadece **kurulum**, uygulama Hafta 14-16'da yoğunlaşacak):

```text
Başvuru rutini — taslak
- Hedef: haftada X başvuru (Hafta 14-16'da netleşecek)
- LinkedIn profilini bu projeyle güncelle
- GitHub profil README'sini bu projeyle güncelle
- Takip listesi tut: şirket, tarih, durum (bir Notion/Sheet tablosu)
```

💡 Şu an amaç başvurmaya **başlamak** değil, süreci **kurmak**. Portföyün henüz tek proje — Hafta 11-13'te IoT capstone, Hafta 14-16'da gerçek başvuru sprintine gireceksin. Bugün sadece rayları döşüyorsun.

**Küçük zafer:** ✔ Elinde README'li, demo linkli, gösterilebilir ilk fullstack projen var — ve CV'de ilk satırın yazıldı.
**Terim defteri:** `README`, `demo link`, `portföy projesi`, `başvuru rutini`
**Çıktı:** Tamamlanmış README + küçük cila (loading/hata durumları) + CV taslağının ilk maddesi
**Commit:** `hafta-10 g6: readme + cila + cv taslağı başlangıç`

---

## Gün 7 — Review (Pazar) — yarı yol

Bugün özel: Faz 3'ü bitiriyorsun ve **gerçek bir fullstack uygulaman var**. Roy'a/Ertan'a demo'yu göster, sonra teach-back:

- **Teach-back 1:** bcrypt ile JWT'nin işbölümü ne — biri neyi, diğeri neyi çözüyor?
- **Teach-back 2:** CORS hatası ne zaman çıkar, neden, nasıl çözülür?
- **Teach-back 3:** Frontend'deki `.env` ile backend'deki `.env` aynı şey mi, farkları ne?
- **Teach-back 4:** Bir kullanıcı token'sız `/gorevlerim`'e istek atarsa tam olarak ne olur — adım adım anlat.
- **Teach-back 5:** Hafta 8'den bugüne API'nin route isimleri hiç değişmedi ama içi 3 kere değişti (dizi → Prisma → auth eklendi). Bu neden iyi bir tasarım?

Kontrol listesi:
- [ ] `/register`, `/login`, `/gorevlerim`, `/gorevler` uçlarının hepsi production'da çalışıyor mu?
- [ ] Vercel'deki frontend, Railway'deki backend'e sorunsuz bağlanıyor mu (CORS dahil)?
- [ ] README'de demo linki, kurulum adımları, ekran görüntüsü var mı?
- [ ] `.env` dosyalarının (hem FE hem BE) hiçbiri Git geçmişinde yok mu?
- [ ] Her gün commit attın mı — 6 hafta boyunca kesintisiz yeşil kareler var mı?

**Faz 3 bitti.** Sıfırdan başladığın "görmediğim taraf" korkusu artık geride — kendi API'ni yazdın, kendi veritabanını kurdun, kendi auth sistemini inşa ettin ve hepsini kendi React'ine bağladın. **Sıradaki hafta (Hafta 11):** Faz 4 — IoT capstone başlıyor. Bu haftaki API bilgin, ESP32'den gelen gerçek dünya verisini bir pano'da göstereceğin projenin temeli olacak.
