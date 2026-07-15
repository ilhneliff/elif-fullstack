# Hafta 8 — Backend'e Giriş (Faz 3)

> **Hedef:** İlk kez "hiç görmediğin taraf"a geçiyorsun — sunucu, API, REST. Tarayıcıda değil, arka planda çalışan kod yazacaksın.
> **Çıktı:** ✔ Railway'de canlı, kendi yazdığın bir API
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Bu hafta boyunca tek bir projeyi büyütüyoruz: **Görev Defteri API'si** (basit bir yapılacaklar listesi backend'i). Hafta 9'da bu projeye gerçek veritabanı, Hafta 10'da da giriş/kayıt sistemi ekleyeceğiz — yani bugün attığın temel, iki hafta sonra tam bir fullstack uygulama olacak. Şimdilik korkma: sadece "istek gelir, cevap dönersin" mantığını öğreneceksin.

---

## Gün 1 — Sunucu, API, REST nedir

### 0:00–1:00 · İstemci-sunucu modeli

Şu ana kadar yazdığın her şey **tarayıcıda** çalıştı — React uygulaman kullanıcının bilgisayarında çalışıyordu. Backend'de durum farklı: kod **başka bir yerde** (bir sunucuda) çalışır, senin uygulaman ona **istek** gönderir, o da **cevap** döner. Buna istemci-sunucu (client-server) modeli denir.

```text
   SENİN TARAYICIN (client)                 SENİN SUNUCUN (server)
  ┌───────────────────────┐                ┌───────────────────────┐
  │                        │  1. REQUEST    │                        │
  │  React uygulaman       │ ─────────────► │  Express sunucun       │
  │  fetch("/gorevler")     │  "bana görev-  │  app.get("/gorevler")  │
  │  çağırır                │   leri ver"    │  bu isteği yakalar     │
  │                        │                │  ve veriyi hazırlar    │
  │  gelen JSON'u           │ ◄───────────── │                        │
  │  ekrana basar            │  2. RESPONSE   │  res.json([...])      │
  │                        │  [{...}, {...}] │                        │
  └───────────────────────┘                └───────────────────────┘
```

Sen zaten bu akışın **yarısını** biliyorsun (`fetch` ile Hafta 3-4'te istek attın). Bu hafta öğrendiğin, o isteği **karşılayan** tarafı yazmak.

### 1:00–2:00 · HTTP metotları = ne yapmak istediğin

Her istek bir **metot** taşır — sunucuya "ne yapmak istiyorum" der. REST denen düzen, bu metotları basit bir mantığa oturtur:

| Metot | Anlamı | Örnek |
|---|---|---|
| `GET` | oku (veri değiştirmez) | `GET /gorevler` → tüm görevleri getir |
| `POST` | oluştur | `POST /gorevler` → yeni görev ekle |
| `PUT` | güncelle | `PUT /gorevler/3` → 3 numaralı görevi güncelle |
| `DELETE` | sil | `DELETE /gorevler/3` → 3 numaralı görevi sil |

`/gorevler` gibi bir yola **kaynak (resource)** denir — sunucunun elinde tuttuğu bir "şey"in adresi. Aynı adrese farklı metotla gitmek farklı iş yaptırır. Bu, telefon numarası gibi düşün: aynı numarayı arayabilir (GET), mesaj atabilir (POST) farklı şeyler olur — adres aynı, niyet farklı.

```json
// GET /gorevler isteğine sunucunun döneceği örnek cevap (JSON formatında)
[
  { "id": 1, "baslik": "Süt al", "tamamlandi": false },
  { "id": 2, "baslik": "Backend öğren", "tamamlandi": true }
]
```

💡 GET her zaman **güvenlidir** — sadece okur, hiçbir şeyi değiştirmez. Bir tarayıcı adres çubuğuna yazdığında hep GET isteği atarsın; bu yüzden adres çubuğundan bir şey "silemezsin", sadece görebilirsin.

### 2:00–3:00 · Kendi route tablonu tasarla

Kod yazmadan önce, elindeki kaynak için hangi route'ların olacağını **kâğıda/nota dök**. Bu hafta boyunca `gorevler` kaynağını kullanacağız:

```js
// Bu bir "route tasarım notu" — henüz çalışan kod değil, plan.
// Bugünkü ve yarınki işimiz bunu gerçek koda çevirmek.

// GET    /gorevler        → tüm görevleri listele
// GET    /gorevler/:id    → tek bir görevi getir
// POST   /gorevler        → yeni görev ekle
// PUT    /gorevler/:id    → var olan görevi güncelle (örn. tamamlandı yap)
// DELETE /gorevler/:id    → görevi sil
```

Bu tablo, hafta boyunca inşa edeceğin API'nin **iskeleti**. Her gün bir parçasını gerçek koda çevireceğiz.

💡 REST'te URL'de fiil olmaz — `/gorevler/sil/3` yanlış, `DELETE /gorevler/3` doğru. Fiili metot söyler, URL sadece kaynağı gösterir.

**Küçük zafer:** GET ile POST arasındaki farkı artık karışmadan söyleyebiliyorsun — biri okur, biri oluşturur.
**Terim defteri:** `client-server`, `HTTP metodu`, `endpoint`, `resource (kaynak)`, `REST`
**Çıktı:** Yukarıdaki gibi kendi 5 satırlık route tablon (bir not dosyasına yaz)
**Commit:** `hafta-08 g1: backend kavramları + route tasarımı`

---

## Gün 2 — Node + Express kurulum, ilk sunucu

### 0:00–1:00 · Node.js nedir, proje kurulumu

JavaScript'i şimdiye kadar hep tarayıcıda çalıştırdın. **Node.js**, JavaScript'i tarayıcı dışında — yani bir sunucuda — çalıştırmanı sağlayan bir programdır. Aynı dili biliyorsun, sadece artık bir sunucu içinde koşuyorsun.

```bash
# Proje klasörü oluştur ve içine gir
mkdir gorev-defteri-api
cd gorev-defteri-api

# npm projesini başlat (package.json oluşturur — projenin kimlik kartı)
npm init -y

# Express'i kur — sunucu yazmayı çok kolaylaştıran bir kütüphane
npm install express
```

`npm init -y` komutu bir `package.json` dosyası oluşturur. Bu dosya projenin adı, versiyonu ve **bağımlılıkları** (kullandığın kütüphaneler) hakkında bilgi tutar — React projelerinde gördüğün `package.json` ile tamamen aynı mantık.

```json
// npm init -y sonrası oluşan package.json (özet)
{
  "name": "gorev-defteri-api",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

💡 `node_modules/` klasörü oluşacak — bu, kurduğun kütüphanelerin kendisi. React'te de gördün, asla Git'e eklenmez (birazdan `.gitignore` ekleyeceğiz).

### 1:00–2:00 · İlk Express sunucusu

Şimdi `server.js` dosyasını oluştur:

```js
// server.js
const express = require("express"); // Express kütüphanesini içeri al
const app = express();               // Bir Express uygulaması oluştur
const PORT = 3000;                   // Sunucunun dinleyeceği kapı numarası

// GET / isteği geldiğinde çalışacak fonksiyon
app.get("/", (req, res) => {
  // req  = gelen istek (request) bilgisi
  // res  = cevap (response) gönderme aracı
  res.json({ mesaj: "Merhaba Elif, sunucu ayakta!" });
});

// Sunucuyu başlat ve belirtilen portu dinlemeye başla
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
```

`app.get("/", (req, res) => {...})` cümlesini şöyle oku: *"'/' adresine GET isteği gelirse, bu fonksiyonu çalıştır."* Fonksiyon, sana iki şey verir: **req** (istek — sana ne sorulduğu) ve **res** (cevap — sen ne döneceğin).

### 2:00–3:00 · Çalıştır ve test et

```bash
# Sunucuyu başlat
node server.js
```

Terminalde `Sunucu http://localhost:3000 adresinde çalışıyor` yazısını görmelisin. Şimdi tarayıcında `http://localhost:3000` adresine git — `{"mesaj": "Merhaba Elif, sunucu ayakta!"}` JSON'unu göreceksin. **Bu senin ilk API cevabın.**

Her değişiklikte sunucuyu elle durdurup (`Ctrl+C`) tekrar başlatmak yorucu — `nodemon` bunu otomatikleştirir:

```bash
# nodemon'u geliştirme bağımlılığı olarak kur
npm install --save-dev nodemon
```

```json
// package.json içine "scripts" kısmına ekle
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

```bash
# Artık her kayıtta sunucu otomatik yeniden başlar
npm run dev
```

💡 Terminal ekranı hep açık kalsın — sunucu, terminali kapattığın an durur. React'te `npm run dev` ile alıştığın şey aynı; orada Vite sunucusu vardı, burada senin kendi Express sunucun var.

**Küçük zafer:** `localhost:3000`'i açıp kendi yazdığın JSON'u tarayıcında gördün — sunucu senin kontrolünde.
**Terim defteri:** `Node.js`, `npm`, `package.json`, `Express`, `port`
**Çıktı:** `localhost:3000`'de "Merhaba Elif" JSON'u döndüren çalışan bir sunucu
**Commit:** `hafta-08 g2: ilk express sunucusu ayakta`

---

## Gün 3 — Route params ve query string

### 0:00–1:00 · Bellek içi veri + route params

Gerçek veritabanına Hafta 9'da geçeceğiz — bugünlük görevlerimizi basit bir **dizi**de tutacağız (sunucu kapanınca kaybolur, ama mantığı öğrenmek için yeterli).

```js
// server.js — en üste ekle
let gorevler = [
  { id: 1, baslik: "Süt al", tamamlandi: false },
  { id: 2, baslik: "Backend öğren", tamamlandi: true },
  { id: 3, baslik: "Elektrik faturasını öde", tamamlandi: false },
];
```

Şimdi tek bir görevi id'sine göre getiren bir route yazalım. URL'nin içindeki `:id` kısmına **route parametresi** denir — değişken bir değer taşır.

```js
// GET /gorevler/:id → id'si eşleşen tek görevi döndür
app.get("/gorevler/:id", (req, res) => {
  const id = Number(req.params.id); // URL'den gelen değer hep string'dir, Number'a çeviriyoruz
  const gorev = gorevler.find((g) => g.id === id);
  res.json(gorev);
});
```

`req.params.id` — URL'de `:id` neresine yazdıysan (`/gorevler/2` → `req.params.id === "2"`) oradaki değeri sana verir. Tarayıcıda `http://localhost:3000/gorevler/2` dene, sadece 2 numaralı görevi görmelisin.

### 1:00–2:00 · Query string ile filtreleme

Query string, URL'nin sonuna `?` ile eklenen ekstra bilgidir — genelde **filtreleme/arama** için kullanılır.

```js
// GET /gorevler?tamamlandi=false → sadece tamamlanmamış görevleri döndür
app.get("/gorevler", (req, res) => {
  const { tamamlandi } = req.query; // ?tamamlandi=false kısmını yakalar

  if (tamamlandi === undefined) {
    return res.json(gorevler); // filtre yoksa hepsini döndür
  }

  // query string hep metin (string) gelir — "true"/"false" karşılaştırması yapıyoruz
  const filtreli = gorevler.filter(
    (g) => String(g.tamamlandi) === tamamlandi
  );
  res.json(filtreli);
});
```

`http://localhost:3000/gorevler?tamamlandi=false` dene — sadece tamamlanmamış görevleri görmelisin. `req.params` ve `req.query` sık karıştırılır, aradaki fark net:

| | Örnek URL | Nereden okunur |
|---|---|---|
| `params` | `/gorevler/3` | `req.params.id` |
| `query` | `/gorevler?tamamlandi=false` | `req.query.tamamlandi` |

### 2:00–3:00 · İkisini birlikte pratik et

```js
// Kendi başına dene: isim/başlıkta arama yapan bir query ekle
// GET /gorevler?ara=süt → başlığında "süt" geçen görevleri getir
app.get("/gorevler", (req, res) => {
  const { tamamlandi, ara } = req.query;
  let sonuc = gorevler;

  if (tamamlandi !== undefined) {
    sonuc = sonuc.filter((g) => String(g.tamamlandi) === tamamlandi);
  }
  if (ara) {
    sonuc = sonuc.filter((g) =>
      g.baslik.toLowerCase().includes(ara.toLowerCase())
    );
  }
  res.json(sonuc);
});
```

💡 Dikkat: Express'te aynı route'u (`app.get("/gorevler", ...)`) iki kez tanımlarsan sadece **ilki** çalışır. Yukarıdaki kodları birleştir, tek bir `/gorevler` route'unda hem `tamamlandi` hem `ara` filtresini destekle.

**Küçük zafer:** Aynı URL yapısıyla hem tek kayıt (`params`) hem filtreli liste (`query`) çekebiliyorsun.
**Terim defteri:** `route params`, `query string`, `req.params`, `req.query`, `Array.filter`
**Çıktı:** id'ye göre görev bulan + tamamlanma durumuna/başlığa göre filtreleyen endpoint'ler
**Commit:** `hafta-08 g3: route params ve query string`

---

## Gün 4 — POST, body ve middleware

### 0:00–1:00 · Middleware kavramı

**Middleware**, bir isteğin route'una ulaşmadan önce (ya da cevap dönmeden önce) araya giren bir fonksiyondur — "kontrol noktası" gibi düşün. Express'in body okuyabilmesi için de bir middleware gerekir:

```js
// server.js — app tanımından hemen sonra ekle
app.use(express.json());
// Bu satır olmadan, POST isteğiyle gelen body her zaman "undefined" olur.
// express.json() gelen JSON metnini otomatik olarak JS objesine çevirir.
```

`app.use(...)` ile eklenen bir middleware, **her** route'tan önce çalışır. `express.json()` gelen isteğin gövdesini (body) okuyup `req.body` içine JS objesi olarak koyar.

```text
   İSTEK GELİR
       │
       ▼
  ┌─────────────────┐
  │  express.json()  │  ← middleware: body'yi JSON'dan objeye çevirir
  └─────────────────┘
       │
       ▼
  ┌─────────────────┐
  │  app.post(...)   │  ← senin route'un: artık req.body hazır kullanılabilir
  └─────────────────┘
       │
       ▼
   CEVAP DÖNER
```

### 1:00–2:00 · POST ile yeni görev ekleme

```js
// POST /gorevler → yeni görev ekle
app.post("/gorevler", (req, res) => {
  const { baslik } = req.body; // client'ın gönderdiği { "baslik": "..." } objesinden okuyoruz

  const yeniGorev = {
    id: gorevler.length + 1,       // basit id üretimi (Hafta 9'da veritabanı bunu otomatik yapacak)
    baslik: baslik,
    tamamlandi: false,
  };

  gorevler.push(yeniGorev);
  res.json(yeniGorev);
});
```

Bunu tarayıcıdan test edemezsin — tarayıcı adres çubuğu hep GET atar. Yarın Thunder Client'ı kuracağız ama şimdilik `curl` ile deneyebilirsin:

```bash
# Terminalden POST isteği at
curl -X POST http://localhost:3000/gorevler \
  -H "Content-Type: application/json" \
  -d '{"baslik": "Kitap oku"}'
```

`-H "Content-Type: application/json"` sunucuya "sana JSON gönderiyorum" der — `express.json()` middleware'i bu bilgiye bakarak body'yi ayrıştırır.

### 2:00–3:00 · Kendi middleware'ini yaz

Middleware'in gerçek gücünü görmek için kendi basit **logger**'ını yazalım — her isteği konsola yazdıran bir fonksiyon:

```js
// Kendi middleware'in — her istekte otomatik çalışır
function istekLogla(req, res, next) {
  const zaman = new Date().toLocaleTimeString();
  console.log(`[${zaman}] ${req.method} ${req.url}`);
  next(); // ÖNEMLİ: next() çağrılmazsa istek burada takılı kalır, route'a hiç ulaşmaz!
}

app.use(istekLogla); // her route'tan önce çalışsın
```

`next()` fonksiyonu, "ben işimi bitirdim, sıradaki adıma geç" demektir. Unutursan istek asla cevaplanmaz — tarayıcı sonsuza kadar bekler. Middleware'i her zaman şu üçlü ile tanı: `req`, `res`, `next`.

💡 `express.json()` de aslında senin yazdığın gibi bir middleware — Express seninle aynı kalıbı (req, res, next) kullanıyor, sadece hazır yazılmış.

**Küçük zafer:** İlk kez veri **oluşturuyorsun** (POST), sadece okumuyorsun — ve kendi middleware'ini yazdın.
**Terim defteri:** `middleware`, `app.use`, `next()`, `req.body`, `Content-Type`
**Çıktı:** POST ile yeni görev ekleyebilen API + kendi log middleware'in
**Commit:** `hafta-08 g4: post + body + middleware`

---

## Gün 5 — Hata yönetimi, status kodları, tam CRUD

### 0:00–1:00 · Status kodları neden önemli

Şu ana kadar hep varsayılan `200 OK` döndürdün (Express'in otomatik verdiği). Ama gerçek API'ler duruma göre farklı **status kod**ları döner — client, cevabın gövdesine bakmadan sadece koda bakarak ne olduğunu anlayabilir.

| Kod | Anlamı | Ne zaman |
|---|---|---|
| `200` | OK | Başarılı GET/PUT/DELETE |
| `201` | Created | Başarılı POST (yeni kayıt oluştu) |
| `400` | Bad Request | İstemci eksik/hatalı veri gönderdi |
| `404` | Not Found | İstenen kayıt yok |
| `500` | Server Error | Sunucu tarafında beklenmedik hata |

```js
// status kodu res.status(...) ile belirlenir, .json(...) ile zincirlenir
res.status(201).json(yeniGorev);
```

### 1:00–2:00 · PUT ve DELETE route'ları

```js
// PUT /gorevler/:id → var olan görevi güncelle
app.put("/gorevler/:id", (req, res) => {
  const id = Number(req.params.id);
  const gorev = gorevler.find((g) => g.id === id);

  if (!gorev) {
    return res.status(404).json({ hata: "Görev bulunamadı" });
  }

  // req.body'de gelen alanları var olan görevin üstüne yaz
  gorev.baslik = req.body.baslik ?? gorev.baslik;
  gorev.tamamlandi = req.body.tamamlandi ?? gorev.tamamlandi;

  res.status(200).json(gorev);
});

// DELETE /gorevler/:id → görevi sil
app.delete("/gorevler/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = gorevler.findIndex((g) => g.id === id);

  if (index === -1) {
    return res.status(404).json({ hata: "Görev bulunamadı" });
  }

  gorevler.splice(index, 1); // diziden çıkar
  res.status(200).json({ mesaj: "Görev silindi" });
});
```

`??` (nullish coalescing) operatörünü hatırla: sol taraf `undefined`/`null` ise sağ tarafı kullanır — yani body'de gönderilmeyen alan, eski değerinde kalır.

### 2:00–3:00 · Hata kontrolleriyle tam CRUD

Şimdi POST'a da doğrulama (validation) ekleyelim — `baslik` boş gelirse `400` dönmeli:

```js
app.post("/gorevler", (req, res) => {
  const { baslik } = req.body;

  if (!baslik || baslik.trim() === "") {
    return res.status(400).json({ hata: "baslik alanı zorunlu" });
  }

  const yeniGorev = {
    id: gorevler.length + 1,
    baslik,
    tamamlandi: false,
  };
  gorevler.push(yeniGorev);
  res.status(201).json(yeniGorev);
});
```

Artık istek→route→cevap akışının **tamamını** (Gün 1'deki şemayı hatırla) tam bir CRUD üzerinde kurdun:

```text
  client                    server (Express)
    │  GET /gorevler            │
    │ ─────────────────────────►│  gorevler dizisinden oku    → 200
    │  POST /gorevler {baslik}   │
    │ ─────────────────────────►│  doğrula, diziye ekle        → 201 / 400
    │  PUT /gorevler/:id         │
    │ ─────────────────────────►│  bul, güncelle                → 200 / 404
    │  DELETE /gorevler/:id      │
    │ ─────────────────────────►│  bul, diziden çıkar            → 200 / 404
```

💡 `return res.status(...)` yazımındaki `return` kritik: kullanmazsan, hata durumunda bile fonksiyonun geri kalanı çalışmaya devam eder ve çift cevap göndermeye çalışıp sunucu hata verir.

**Küçük zafer:** Bellek içi de olsa, gerçek bir CRUD API'n var — hata durumlarını da kapsıyor.
**Terim defteri:** `CRUD`, `status code`, `201 Created`, `404 Not Found`, `validation`
**Çıktı:** GET/POST/PUT/DELETE'in hepsinin çalıştığı, hataları doğru status ile dönen tam iskelet
**Commit:** `hafta-08 g5: tam crud iskeleti + status kodları`

---

## Gün 6 — Test aracı + Railway deploy

### 0:00–1:00 · Thunder Client ile elle test

`curl` ile idare ettik ama gerçek geliştiriciler bir **API test aracı** kullanır. VS Code'a **Thunder Client** eklentisini kur (Extensions → "Thunder Client" ara → Install).

```text
Thunder Client'ta yeni istek oluştur:
  1. Metot seç: POST
  2. URL yaz: http://localhost:3000/gorevler
  3. Body sekmesi → JSON seç:
     { "baslik": "Kitap oku" }
  4. Send'e bas → sağda cevabı (status kodu + JSON) gör
```

Tüm route'larını sırayla test et: GET (liste), GET (tekil), POST, PUT, DELETE. Her birinin doğru status kodunu döndüğünü **gözünle gör** — bu, "çalışıyor" demenin gerçek yolu.

💡 Thunder Client'ta istekleri bir "Collection" içinde kaydedebilirsin — her seferinde yeniden yazmak yerine kayıtlı isteklerine tıklarsın.

### 1:00–2:00 · Deploy'a hazırlık

```bash
# .gitignore dosyası oluştur (node_modules Git'e asla eklenmez)
```

```text
# .gitignore
node_modules/
.env
```

```json
// package.json — Railway'in sunucuyu nasıl başlatacağını bilmesi için start script şart
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

```js
// server.js — PORT'u sabit değil, ortamdan oku (Railway kendi portunu atar)
const PORT = process.env.PORT || 3000;
```

`process.env.PORT` — Railway sunucuyu kendi seçtiği bir port numarasında çalıştırır ve bunu bir **ortam değişkeni (environment variable)** olarak sunar. `|| 3000` ise "eğer Railway bir port vermediyse (yani lokaldeysen), 3000 kullan" demek.

```bash
# Git'e ekle, ilk commit'i at
git init
git add .
git commit -m "ilk commit: gorev defteri api"
```

### 2:00–3:00 · Railway'e deploy

```bash
# railway.app'te hesap aç (GitHub ile giriş yapabilirsin)
# Sonra terminalden Railway CLI ile:
npm install -g @railway/cli
railway login
railway init
railway up
```

Railway, projeni GitHub'a push ettiğinde de otomatik deploy edebilir (dashboard üzerinden repo bağlayarak) — istersen `railway up` yerine bunu tercih edebilirsin. Deploy bitince Railway sana `https://gorev-defteri-api-production.up.railway.app` gibi gerçek bir URL verir.

```bash
# Canlı URL'i Thunder Client'ta test et — artık localhost değil!
# GET https://senin-projen.up.railway.app/gorevler
```

💡 İlk deploy'da hata alırsan panik yapma — Railway'in "Logs" sekmesi tam olarak ne patladığını satır satır gösterir. Hata mesajını oku, genelde eksik bir `npm install` ya da yanlış `start` script'idir.

**Küçük zafer:** Kendi yazdığın API artık internette — dünyanın herhangi bir yerinden erişilebilir bir URL'in var.
**Terim defteri:** `Thunder Client`, `deploy`, `environment variable`, `PORT`, `production`
**Çıktı:** ✔ Railway'de canlı, gerçek URL'i olan görev defteri API'si
**Commit:** `hafta-08 g6: railway deploy - api canlıda`

---

## Gün 7 — Review (Pazar)

Bugün kod yazmıyorsun, **anlatıyorsun**. Roy'a ya da Ertan'a şunları kendi cümlelerinle, koda bakmadan anlat:

- **Teach-back 1:** İstek (request) sunucuna geldiğinde tam olarak ne olur? (Gün 1'deki şemayı ezbere anlatabiliyor musun?)
- **Teach-back 2:** GET, POST, PUT, DELETE arasındaki fark ne? Her birine bir örnek ver.
- **Teach-back 3:** `req.params` ile `req.query` ne zaman kullanılır, farkları ne?
- **Teach-back 4:** Middleware nedir, `next()` neden şart?
- **Teach-back 5:** 404 ile 400 arasındaki fark ne — hangi durumda hangisini dönersin?

Kontrol listesi:
- [ ] `localhost`'ta çalışan tam bir CRUD API'n var mı?
- [ ] Railway'de canlı URL'in var mı, Thunder Client ile test ettin mi?
- [ ] `.gitignore` içinde `node_modules/` ve `.env` var mı?
- [ ] Her gün commit attın mı — GitHub'da 6 yeşil kare görüyor musun?

**Sıradaki hafta (Hafta 9):** Bugünkü `gorevler` dizisi sunucu her yeniden başladığında sıfırlanıyor — çünkü bellek içi (RAM'de). Hafta 9'da PostgreSQL ve Prisma ile bu veriyi **kalıcı** hale getireceksin. Aynı API, ama artık gerçek bir veritabanının üstünde.
