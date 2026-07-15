# Hafta 9 — Veritabanı (Faz 3)

> **Hedef:** Hafta 8'in "sunucu kapanınca kaybolan" dizisini gerçek, kalıcı bir veritabanına taşımak.
> **Çıktı:** ✔ kalıcı verili API
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Hafta 8'de bitirdiğin **Görev Defteri API**'sine devam ediyoruz. Şu anki hâlinde `gorevler` bir JS dizisi — sunucuyu yeniden başlattığında sıfırlanıyor. Bu hafta o diziyi PostgreSQL'e, sonra da Prisma denen bir köprüye taşıyacaksın. Hafta sonunda API'n aynı route'lara sahip olacak ama artık cevapları **gerçek bir veritabanından** verecek.

---

## Gün 1 — İlişkisel veritabanı + SQL zihni, PostgreSQL kurulum

### 0:00–1:00 · Neden veritabanı?

Hafta 8'deki `gorevler` dizisi bir problem taşıyordu: veri sadece **RAM**'de (sunucunun geçici hafızası) tutuluyordu. Sunucu çöker, yeniden başlar ya da Railway "uyku moduna" geçerse — her şey silinir. Bir **veritabanı**, veriyi diske yazar; sunucu kapansa bile veri durur.

**İlişkisel veritabanı** (PostgreSQL gibi), veriyi Excel'e benzer bir mantıkla saklar:

```text
   TABLO: gorevler

   ┌────┬───────────────────────┬─────────────┐
   │ id │ baslik                 │ tamamlandi  │  ← kolonlar (sütunlar)
   ├────┼───────────────────────┼─────────────┤
   │ 1  │ Süt al                  │ false       │  ← satır (kayıt)
   │ 2  │ Backend öğren           │ true        │  ← satır (kayıt)
   │ 3  │ Elektrik faturasını öde  │ false       │  ← satır (kayıt)
   └────┴───────────────────────┴─────────────┘
```

Bu, aslında Hafta 8'deki `gorevler` dizisindeki her objenin **bir satıra**, her alanın (`id`, `baslik`, `tamamlandi`) **bir kolona** dönüşmesinden başka bir şey değil. Fark: bu tablo diskte durur, JS dizisi gibi RAM'de uçup gitmez.

### 1:00–2:00 · PostgreSQL kurulumu

```bash
# Mac'te Homebrew ile PostgreSQL kur
brew install postgresql@16

# Servisi başlat (arka planda sürekli çalışsın)
brew services start postgresql@16

# Kurulumu doğrula
psql --version
```

`psql`, PostgreSQL'e terminalden bağlanmanı sağlayan araç — kendi veritabanı "konsolun".

```bash
# psql ile varsayılan veritabanına bağlan
psql postgres
```

### 2:00–3:00 · İlk veritabanı ve tablo

`psql` içindeyken (istem `postgres=#` gibi görünür):

```sql
-- Kendi projen için yeni bir veritabanı oluştur
CREATE DATABASE gorev_defteri;

-- O veritabanına geç
\c gorev_defteri

-- İlk tabloyu oluştur — Hafta 8'deki gorevler dizisinin veritabanı karşılığı
CREATE TABLE gorevler (
  id SERIAL PRIMARY KEY,        -- SERIAL: otomatik artan sayı (1, 2, 3...)
  baslik TEXT NOT NULL,         -- TEXT: metin, NOT NULL: boş bırakılamaz
  tamamlandi BOOLEAN DEFAULT false  -- BOOLEAN: true/false, varsayılan false
);

-- Tabloyu doğrula
\d gorevler
```

`PRIMARY KEY` (birincil anahtar), o tablodaki her satırı **tekil** olarak tanımlayan kolondur — hiçbir iki satırın `id`'si aynı olamaz. Hafta 8'de elle `gorevler.length + 1` ile ürettiğin `id`'yi artık veritabanı `SERIAL` ile otomatik üretecek.

💡 `psql`'den çıkmak için `\q` yaz. `\dt` tüm tabloları listeler, `\d tablo_adi` bir tablonun yapısını gösterir — bunları sık kullanacaksın.

**Küçük zafer:** Lokalinde gerçek bir PostgreSQL çalışıyor ve ilk tablonu elinle oluşturdun.
**Terim defteri:** `ilişkisel veritabanı`, `tablo`, `satır/kolon`, `primary key`, `SERIAL`
**Çıktı:** Çalışan PostgreSQL + `gorev_defteri` veritabanı + `gorevler` tablosu
**Commit:** `hafta-09 g1: postgresql kurulum + ilk tablo` *(kod deposu olmasa da notlarını commit'le — bir sonraki günden itibaren gerçek kod gelecek)*

---

## Gün 2 — SQL temel: SELECT, INSERT, UPDATE, DELETE, WHERE

### 0:00–1:00 · Veri ekleme ve okuma

`psql gorev_defteri` ile dünkü veritabanına tekrar bağlan, sonra:

```sql
-- INSERT: yeni satır ekle
INSERT INTO gorevler (baslik, tamamlandi) VALUES ('Süt al', false);
INSERT INTO gorevler (baslik, tamamlandi) VALUES ('Backend öğren', true);
INSERT INTO gorevler (baslik) VALUES ('Kitap oku');
-- tamamlandi belirtmedik, DEFAULT değeri (false) otomatik atandı

-- SELECT: tüm satırları oku
SELECT * FROM gorevler;
-- "*" = tüm kolonlar. Sonuç Hafta 8'deki gorevler dizisiyle aynı bilgiyi taşır,
-- sadece artık kalıcı.
```

### 1:00–2:00 · Filtreleme ve güncelleme

```sql
-- WHERE: koşula uyan satırları filtrele (JS'teki .filter() gibi düşün)
SELECT * FROM gorevler WHERE tamamlandi = false;

-- tek bir kolonu seçmek istersen
SELECT baslik FROM gorevler WHERE id = 1;

-- UPDATE: var olan satırı güncelle
UPDATE gorevler SET tamamlandi = true WHERE id = 1;
-- WHERE'i UNUTMA! WHERE olmadan UPDATE tüm tabloyu değiştirir.

-- kontrol et
SELECT * FROM gorevler WHERE id = 1;
```

💡 `WHERE`'siz `UPDATE` ya da `DELETE` yazmak, en sık yapılan SQL hatasıdır — tüm tabloyu bozar. Her zaman önce `SELECT ... WHERE ...` ile "kimi etkileyeceğim" diye kontrol et, sonra `UPDATE`/`DELETE`'e geç.

### 2:00–3:00 · Silme + birkaç el pratik

```sql
-- DELETE: satır sil
DELETE FROM gorevler WHERE id = 3;

-- kontrol
SELECT * FROM gorevler;

-- daha fazla pratik: başlığında "a" harfi geçenleri bul
SELECT * FROM gorevler WHERE baslik LIKE '%a%';
-- LIKE + % : "içinde şunu geçiren" araması (JS'teki .includes() karşılığı)

-- kaç görev var, say
SELECT COUNT(*) FROM gorevler;
```

Bu dört komut (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) SQL'in kalbidir — CRUD'un veritabanı karşılığı, Hafta 8'deki route isimlerini hatırlıyor musun?

| Route (Hafta 8) | SQL (bugün) |
|---|---|
| `GET /gorevler` | `SELECT * FROM gorevler` |
| `POST /gorevler` | `INSERT INTO gorevler ...` |
| `PUT /gorevler/:id` | `UPDATE gorevler SET ... WHERE id = ...` |
| `DELETE /gorevler/:id` | `DELETE FROM gorevler WHERE id = ...` |

**Küçük zafer:** Elle yazdığın SQL sorgularıyla veriyi ekleyip, filtreleyip, güncelleyip silebiliyorsun.
**Terim defteri:** `SELECT`, `WHERE`, `INSERT INTO`, `UPDATE ... SET`, `DELETE FROM`
**Çıktı:** 10+ elle yazılmış, çalışan SQL sorgusu (bir `.sql` not dosyasına kaydet)
**Commit:** `hafta-09 g2: sql temel sorgular`

---

## Gün 3 — Prisma (ORM)

### 0:00–1:00 · ORM nedir, kurulum

Dün SQL'i elle yazdın — çalışıyor ama JS kodunun içinde SQL metni olarak yazmak hataya açık ve garip hissettirir. **ORM** (Object-Relational Mapping), veritabanı tablolarını JS objeleri gibi kullanmanı sağlayan bir köprüdür. Biz **Prisma**'yı kullanacağız.

```bash
# Hafta 8'deki proje klasöründesin (gorev-defteri-api)
npm install prisma --save-dev
npm install @prisma/client

# Prisma'yı projeye başlat
npx prisma init
```

Bu komut iki şey oluşturur: `prisma/schema.prisma` (modellerini tanımlayacağın dosya) ve `.env` (veritabanı bağlantı adresini tutan dosya).

```bash
# .env dosyasında DATABASE_URL'i düzenle — dünkü lokal veritabanına işaret etsin
```

```text
# .env
DATABASE_URL="postgresql://KULLANICI_ADIN@localhost:5432/gorev_defteri"
```

⚠️ **`.env` dosyasını asla Git'e ekleme** — içinde şifre/bağlantı bilgisi olur. Hafta 8'de `.gitignore`'a `.env` eklemiştin, kontrol et hâlâ orada mı.

### 1:00–2:00 · schema.prisma'da model tanımla

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Gorev modeli — dünkü "gorevler" tablosunun Prisma karşılığı
model Gorev {
  id         Int      @id @default(autoincrement()) // SERIAL PRIMARY KEY karşılığı
  baslik     String                                   // TEXT karşılığı
  tamamlandi Boolean  @default(false)                 // BOOLEAN DEFAULT false karşılığı
}
```

Prisma'da model isimleri **tekil ve büyük harfle** başlar (`Gorev`), Prisma bunu otomatik olarak `gorevler` (çoğul, küçük harf) tablo adına çevirir.

### 2:00–3:00 · Migration + Prisma Studio

**Migration**, schema'ndaki değişikliği gerçek veritabanına uygulama işlemidir:

```bash
# schema.prisma'daki modeli veritabanına uygula
npx prisma migrate dev --name init
```

Bu komut: (1) veritabanında tabloyu oluşturur/günceller, (2) `prisma/migrations/` altına bir kayıt bırakır (geçmişi takip eder), (3) `@prisma/client`'ı senin modeline göre yeniden üretir.

```bash
# Prisma Studio — tarayıcıda açılan görsel veritabanı arayüzü
npx prisma studio
```

Prisma Studio'da tabloyu Excel gibi görüp elle satır ekleyip silebilirsin — dünkü `psql` ile yaptığını görsel arayüzle yapıyorsun. Tarayıcıda `localhost:5555` açılır.

💡 Migration ismini (`--name init`) anlamlı seç — her `migrate dev` çağrısı yeni bir migration dosyası oluşturur, isimler geçmişte "ne değişti" diye okunabilir bir günlük tutar.

**Küçük zafer:** Artık veritabanı tabloların JS tarafında bir `model` tanımı olarak da var — iki dünya birbirine bağlandı.
**Terim defteri:** `ORM`, `schema.prisma`, `migration`, `Prisma Client`, `Prisma Studio`
**Çıktı:** Prisma ile tanımlı `Gorev` modeli + migration uygulanmış veritabanı
**Commit:** `hafta-09 g3: prisma kurulum + ilk model`

---

## Gün 4 — API'yi veritabanına bağla

### 0:00–1:00 · PrismaClient ile ilk sorgu

Şimdi Hafta 8'in `server.js`'indeki `gorevler` dizisini tamamen kaldırıp, Prisma ile değiştireceğiz.

```js
// server.js — en üste ekle, dizi tanımını SİL
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
```

```js
// GET /gorevler → artık diziden değil, veritabanından okuyoruz
app.get("/gorevler", async (req, res) => {
  const gorevler = await prisma.gorev.findMany();
  res.json(gorevler);
});
```

İki yeni kelimeye dikkat: `async` ve `await`. Veritabanı sorgusu **anlık değil** — biraz zaman alır (disk okuma, ağ gecikmesi). `await`, "bu işlem bitene kadar bekle, sonucu bana ver" demek. `async` de, içinde `await` kullanan her fonksiyonun başına eklenmesi gereken işaret.

```text
   normal fonksiyon              async fonksiyon
  ┌──────────────────┐          ┌──────────────────────┐
  │ satır çalışır      │          │ await ile karşılaşınca │
  │ hemen sıradakine    │          │ sonucu bekler,          │
  │ geçer               │          │ gelince devam eder       │
  └──────────────────┘          └──────────────────────┘
```

### 1:00–2:00 · Create, update, delete Prisma ile

```js
// POST /gorevler → prisma.gorev.create
app.post("/gorevler", async (req, res) => {
  const { baslik } = req.body;
  if (!baslik || baslik.trim() === "") {
    return res.status(400).json({ hata: "baslik alanı zorunlu" });
  }

  const yeniGorev = await prisma.gorev.create({
    data: { baslik }, // tamamlandi belirtmezsek schema'daki @default(false) devreye girer
  });
  res.status(201).json(yeniGorev);
});

// PUT /gorevler/:id → prisma.gorev.update
app.put("/gorevler/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const guncellenen = await prisma.gorev.update({
      where: { id },
      data: {
        baslik: req.body.baslik,
        tamamlandi: req.body.tamamlandi,
      },
    });
    res.status(200).json(guncellenen);
  } catch (hata) {
    res.status(404).json({ hata: "Görev bulunamadı" });
  }
});

// DELETE /gorevler/:id → prisma.gorev.delete
app.delete("/gorevler/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.gorev.delete({ where: { id } });
    res.status(200).json({ mesaj: "Görev silindi" });
  } catch (hata) {
    res.status(404).json({ hata: "Görev bulunamadı" });
  }
});
```

Prisma, kayıt bulunamadığında bir **exception (hata) fırlatır** — bu yüzden `try/catch` kullanıyoruz: `try` bloğunu dene, patlarsa `catch` bloğuna düş ve oradan doğru status kodunu dön.

### 2:00–3:00 · Test et

```js
// GET /gorevler/:id → prisma.gorev.findUnique
app.get("/gorevler/:id", async (req, res) => {
  const id = Number(req.params.id);
  const gorev = await prisma.gorev.findUnique({ where: { id } });

  if (!gorev) {
    return res.status(404).json({ hata: "Görev bulunamadı" });
  }
  res.json(gorev);
});
```

Thunder Client ile tüm route'ları tekrar test et. Sonra sunucuyu durdurup (`Ctrl+C`) tekrar başlat — Hafta 8'de veri sıfırlanırdı, şimdi **kalıcı**, çünkü PostgreSQL'de duruyor.

💡 Route isimleri Hafta 8 ile birebir aynı kaldı — sadece **içerideki mantık** değişti (dizi yerine veritabanı). Bu, iyi tasarlanmış bir API'nin işareti: dışarıdan kullanan (senin React uygulaman) hiçbir şeyin değiştiğini fark etmez.

**Küçük zafer:** Sunucuyu kapatıp açtın, veri hâlâ orada — ilk kez gerçek kalıcılık gördün.
**Terim defteri:** `async/await`, `findMany`, `findUnique`, `create`, `update`, `delete`, `try/catch`
**Çıktı:** Artık PostgreSQL'e okuyup yazan, tamamen çalışan CRUD API
**Commit:** `hafta-09 g4: crud artık prisma ile db'ye bağlı`

---

## Gün 5 — İlişkiler (bir-çok) ve validation

### 0:00–1:00 · Bir-çok ilişki kavramı

Şu ana kadar tek bir tablo (`Gorev`) vardı. Gerçek uygulamalarda tablolar birbirine bağlanır. Hafta 10'da giriş sistemi ekleyeceğiz, o yüzden bugün bir `Kullanici` modeli ekleyip görevleri ona bağlayacağız: **bir kullanıcının birden çok görevi olabilir** (bir-çok ilişki).

```text
   Kullanici (1)                    Gorev (çok)
  ┌──────────────┐                ┌──────────────────────┐
  │ id: 1         │                │ id: 1, baslik: "Süt al" │
  │ email: elif@  │ ◄────────────  │   kullaniciId: 1         │
  │  ...          │                │ id: 2, baslik: "..."    │
  │               │ ◄────────────  │   kullaniciId: 1         │
  └──────────────┘                └──────────────────────┘
   1 kullanıcı ──────► birden çok görev
```

### 1:00–2:00 · schema.prisma'da ilişki tanımı

```prisma
// prisma/schema.prisma

model Kullanici {
  id      Int     @id @default(autoincrement())
  email   String  @unique          // @unique: iki kullanıcı aynı email'i kullanamaz
  gorevler Gorev[]                 // "bu kullanıcının bir dizi görevi var" — ters taraf
}

model Gorev {
  id          Int      @id @default(autoincrement())
  baslik      String
  tamamlandi  Boolean  @default(false)

  kullaniciId Int                                    // foreign key: hangi kullanıcıya ait
  kullanici   Kullanici @relation(fields: [kullaniciId], references: [id])
}
```

`kullaniciId`, Gorev tablosunda tutulan **yabancı anahtar (foreign key)** — hangi Kullanici'ya ait olduğunu id ile işaret eder. `@relation` Prisma'ya "bu iki modeli birbirine bağla" der.

```bash
# yeni migration oluştur ve uygula
npx prisma migrate dev --name kullanici-gorev-iliskisi
```

⚠️ Var olan `Gorev` kayıtların varsa, `kullaniciId` zorunlu (NOT NULL) olduğu için migration hata verebilir. Geliştirme aşamasında en kolayı: `npx prisma migrate reset` ile veritabanını sıfırlayıp baştan başlamak (test verisi olduğu için sorun değil).

### 2:00–3:00 · İlişkili veri çekme (include) ve validation

```js
// GET /kullanicilar/:id → kullanıcıyı, ona ait TÜM görevlerle birlikte getir
app.get("/kullanicilar/:id", async (req, res) => {
  const id = Number(req.params.id);
  const kullanici = await prisma.kullanici.findUnique({
    where: { id },
    include: { gorevler: true }, // ilişkili gorevler'i de cevaba dahil et
  });

  if (!kullanici) {
    return res.status(404).json({ hata: "Kullanıcı bulunamadı" });
  }
  res.json(kullanici);
});
```

`include: { gorevler: true }` olmadan Prisma sadece Kullanici'nın kendi alanlarını (`id`, `email`) döner — ilişkili veriyi görmek istediğinde açıkça istemen gerekir.

Şimdi POST /gorevler'e basit bir validation daha ekleyelim — hem `baslik` hem `kullaniciId` zorunlu olsun:

```js
app.post("/gorevler", async (req, res) => {
  const { baslik, kullaniciId } = req.body;

  if (!baslik || baslik.trim() === "") {
    return res.status(400).json({ hata: "baslik alanı zorunlu" });
  }
  if (!kullaniciId) {
    return res.status(400).json({ hata: "kullaniciId alanı zorunlu" });
  }

  const yeniGorev = await prisma.gorev.create({
    data: { baslik, kullaniciId: Number(kullaniciId) },
  });
  res.status(201).json(yeniGorev);
});
```

💡 `include` ile ilişki çekmek, SQL'de iki tabloyu birleştiren `JOIN` işlemine karşılık gelir — Prisma bunu senin için otomatik yazar, sen sadece "hangi ilişkiyi istiyorum" dersin.

**Küçük zafer:** İki tablo arasında gerçek bir ilişki kurdun ve tek sorguyla ilişkili veriyi çektin.
**Terim defteri:** `one-to-many (bir-çok)`, `foreign key`, `@relation`, `include`, `validation`
**Çıktı:** `Kullanici`–`Gorev` ilişkisi + ilişkili veri çeken endpoint + POST validation
**Commit:** `hafta-09 g5: bir-çok ilişki + validation`

---

## Gün 6 — Railway Postgres deploy + seed

### 0:00–1:00 · Railway'de Postgres ekle

Railway dashboard'unda projene git → **"+ New"** → **"Database" → "PostgreSQL"** seç. Railway otomatik bir Postgres örneği kurar ve sana bir `DATABASE_URL` verir.

```bash
# Railway CLI ile ortam değişkenini kendi servisine bağla
railway variables set DATABASE_URL=$(railway variables get DATABASE_URL --service postgres)
```

Ya da dashboard'dan elle: backend servisinin **Variables** sekmesine `DATABASE_URL`'i Postgres servisinden kopyala-yapıştır yap. Bu, lokaldeki `.env`'in production karşılığı — aynı mantık, farklı yer.

```text
   LOKAL                              RAILWAY (production)
  .env dosyan                        Variables sekmesi
  DATABASE_URL=localhost:5432/...    DATABASE_URL=<railway'in verdiği adres>
  (sadece senin bilgisayarında)      (sadece Railway sunucusunda, gizli)
```

### 1:00–2:00 · Seed script yazma

**Seed**, veritabanını örnek veriyle doldurma işlemidir — her yeni ortamda (yeni geliştirici, yeni deploy) elle veri girmek yerine bir script çalıştırırsın.

```js
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // önce bir kullanıcı oluştur
  const elif = await prisma.kullanici.create({
    data: { email: "elif@example.com" },
  });

  // sonra ona ait örnek görevler
  await prisma.gorev.createMany({
    data: [
      { baslik: "Süt al", kullaniciId: elif.id },
      { baslik: "Backend öğren", tamamlandi: true, kullaniciId: elif.id },
      { baslik: "Elektrik faturasını öde", kullaniciId: elif.id },
    ],
  });

  console.log("Seed tamamlandı ✔");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect()); // veritabanı bağlantısını düzgün kapat
```

```json
// package.json — Prisma'nın seed script'ini nereden çalıştıracağını bilmesi için
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

```bash
# lokalde dene
npx prisma db seed
```

### 2:00–3:00 · Production migration + seed

```bash
# Railway'e deploy et (Hafta 8'deki gibi)
git add .
git commit -m "prisma + kullanici-gorev iliskisi"
git push
railway up

# Production veritabanına migration'ları uygula
railway run npx prisma migrate deploy

# Production'ı seed et
railway run npx prisma db seed
```

`migrate deploy` (Hafta 9 Gün 3'teki `migrate dev`'den farklı olarak) production'da kullanılır — sadece bekleyen migration'ları uygular, yeni migration dosyası oluşturmaz. `railway run` ise komutu Railway'in ortam değişkenleriyle (yani gerçek `DATABASE_URL` ile) çalıştırır.

```bash
# canlı API'nı Thunder Client'ta test et
# GET https://senin-projen.up.railway.app/gorevler
# → seed ile eklediğin 3 görevi görmelisin
```

💡 `.env` dosyasını asla `git push` ile göndermedin, değil mi? Kontrol et: `git log --all --full-history -- .env` boş dönmeli. Boş dönmüyorsa `.gitignore`'a geç eklemişsindir — bu durumda Ertan'a/Roy'a haber ver, geçmişten temizlemek gerekir.

**Küçük zafer:** Artık production'da gerçek, ilişkili, örnek veriyle dolu bir veritabanın var — localhost'a bağımlı değilsin.
**Terim defteri:** `.env`, `DATABASE_URL`, `seed`, `migrate deploy`
**Çıktı:** ✔ Railway'de Postgres + seed edilmiş, canlı, kalıcı verili API
**Commit:** `hafta-09 g6: railway postgres deploy + seed`

---

## Gün 7 — Review (Pazar)

Teach-back — koda bakmadan anlat:

- **Teach-back 1:** Bir SQL tablosundaki satır/kolon, JS'teki dizi/obje ile nasıl eşleşiyor?
- **Teach-back 2:** `WHERE`'siz bir `UPDATE` neden tehlikeli?
- **Teach-back 3:** ORM (Prisma) ne işe yarıyor — SQL'i neden elle yazmak yerine bunu kullanıyoruz?
- **Teach-back 4:** `async`/`await` ne zaman gerekir, neden?
- **Teach-back 5:** Bir-çok ilişkide `foreign key` nerede durur — Kullanici'da mı, Gorev'de mi?

Kontrol listesi:
- [ ] Lokalde Prisma + PostgreSQL ile çalışan bir CRUD API'n var mı?
- [ ] Kullanici–Gorev ilişkisi kurulu mu, `include` ile test ettin mi?
- [ ] Railway'de Postgres eklendi mi, migration + seed production'da çalıştı mı?
- [ ] `.env` hiçbir zaman Git'e gitmedi mi?

**Sıradaki hafta (Hafta 10):** Şu an herkes her kullanıcının görevlerini görebiliyor — kimlik doğrulama yok. Hafta 10'da `Kullanici` modelini gerçek bir **giriş/kayıt sistemine** bağlayacaksın (şifre hash'leme, token), sonra da React frontend'ini bu API'ye bağlayarak ilk tam fullstack uygulamanı bitireceksin.
