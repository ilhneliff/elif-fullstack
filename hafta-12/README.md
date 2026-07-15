# Hafta 12 — Donanım → Bulut (Faz 4 🔌)

> **Hedef:** ESP32'nin ürettiği gerçek sensör verisinin, senin kendi API'n üzerinden PostgreSQL'e ulaşmasını sağla — donanım ve yazılım yarıların ilk kez gerçekten konuşması.
> **Çıktı:** ✔ Fiziksel sensör verisi veritabanında + son 24 saati sorgulayabiliyorsun
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Hafta 11'i `hafta-11/g6_tam_dongu.py` ile bitirdin: kart sensörden okuyor, WiFi'de, JSON üretiyor — ama sonuç sadece ekrana basılıyordu. Bu hafta o `print()` satırı gerçek bir HTTP isteğine dönüşüyor. Şema 3'ün ("sensör → ESP32 → API → Postgres") sol yarısını bu hafta tamamen kuruyorsun.

---

## Gün 1 — ESP32'den HTTP POST: ilk test isteği

### 0:00–1:00 · urequests kütüphanesi

MicroPython'da standart `requests` kütüphanesi yok — hafif bir kardeşi var: **`urequests`** ("micro requests"). Genelde ön yüklü gelmez, kurman gerekir.

```
Thonny → Tools → Manage packages... → "micropython-urequests" ara → Install
```

Ya da REPL üzerinden (kart WiFi'ye bağlıyken):

```python
# REPL'de çalıştır — modern MicroPython firmware'lerinde mip kullanılır
import mip
mip.install("urequests")
```

💡 `mip` = MicroPython'ın kendi paket yükleyicisi (pip'in küçük kardeşi). WiFi bağlantısı gerektirir çünkü paketi internetten indirir.

### 1:00–2:00 · Dışarıya test isteği

Kendi API'ne geçmeden önce, HTTP POST'un nasıl çalıştığını bilinen bir test servisiyle dene — `httpbin.org` gönderdiğin her şeyi olduğu gibi geri yansıtan, test için var olan ücretsiz bir servistir.

```python
# g1_http_test.py
import urequests as requests

url = "https://httpbin.org/post"
veri = {"merhaba": "ESP32", "sicaklik": 23.4}

yanit = requests.post(url, json=veri)
print("Durum kodu:", yanit.status_code)
print("Cevap:", yanit.text)
yanit.close()  # ÖNEMLİ: ESP32'de bağlantıyı elle kapatman gerekir
```

💡 `yanit.close()` unutma — MicroPython'da masaüstü `requests` kütüphanesinin aksine bağlantılar otomatik kapanmaz. Kapatmazsan birkaç istekten sonra kartın soketleri (bağlantı kaynakları) tükenir ve yeni istek atamaz hale gelir. Bu, "çalışıyor ama 10 istekten sonra donuyor" tarzı bug'ların klasik sebebidir.

### 2:00–2:40 · Kendi bilgisayarına test isteği (yerel ağ)

Şimdi `httpbin.org` yerine, aynı WiFi ağındaki **kendi bilgisayarına** istek at. Bunun için bilgisayarının yerel IP adresini bul:

```bash
# macOS'ta yerel IP adresini bul
ipconfig getifaddr en0
# örnek çıktı: 192.168.1.42
```

Basit bir test sunucusu aç (Node/Express — Hafta 8-10'dan tanıdık):

```js
// test-server.js — geçici, sadece bugün için
import express from "express";
const app = express();
app.use(express.json());

app.post("/test", (req, res) => {
  console.log("ESP32'den geldi:", req.body);
  res.json({ tamam: true });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Test sunucusu 3000 portunda, ağdaki her cihaz erişebilir");
});
```

```bash
node test-server.js
```

Kart tarafında:

```python
# g1_local_test.py
import urequests as requests

# kendi bilgisayarının yerel IP'sini yaz (0.0.0.0 DEĞİL, gerçek IP)
API_URL = "http://192.168.1.42:3000/test"

yanit = requests.post(API_URL, json={"sicaklik": 23.4, "nem": 41})
print(yanit.status_code, yanit.text)
yanit.close()
```

Terminaldeki Node loguna bak — ESP32'den gelen veriyi görmelisin. **Bu satır, capstone'un donanım-yazılım köprüsünün ilk gerçek testi.**

💡 Kart ve bilgisayar aynı WiFi ağında olmalı — kart evdeki WiFi'ye bağlıysa, bilgisayarın da aynı ağda olması gerekir (ikisi de kablosuz veya biri kablolu aynı router'a bağlıysa çalışır; farklı ağlardaysa — mesela telefon hotspot'u — çalışmaz).

### 2:40–3:00 · Terim defteri + commit

**Küçük zafer:** Kart, internete gerçek bir istek attı ve karşılığında bir cevap aldı — donanım artık "konuşuyor". **Terim defteri:** `HTTP POST` `request body` `urequests` `local network / yerel IP` **Çıktı:** `hafta-12/g1_local_test.py`, terminaldeki Node logunda ESP32 verisi görünüyor. **Commit:** `hafta-12 g1: ESP32'den HTTP POST test isteği`

---

## Gün 2 — API tarafı: POST /readings

Bugün geçici test sunucusunu bırakıp, gerçek API'ne (Hafta 8-10'da kurduğun Express + Prisma projesi) kalıcı bir uç ekliyorsun.

### 0:00–1:00 · Prisma modeli: Reading

```prisma
// prisma/schema.prisma — mevcut şemana ekle
model Reading {
  id          Int      @id @default(autoincrement())
  deviceId    String
  temperature Float
  humidity    Float
  createdAt   DateTime @default(now())
}
```

```bash
# migration oluştur ve uygula — Postgres'te tablo yaratır
npx prisma migrate dev --name add_reading
```

💡 `@default(now())` — her yeni satırda `createdAt` otomatik olarak "şu an" değerini alır, sen elle göndermek zorunda değilsin. Bu, karttan zaman göndermeye güvenmek yerine, "veritabanına ulaştığı an" gerçeğine dayanan daha sağlam bir yaklaşım.

### 1:00–2:30 · POST /readings route'u

```js
// routes/readings.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ESP32 buraya her ölçümde bir istek atacak
router.post("/readings", async (req, res) => {
  const { deviceId, temperature, humidity } = req.body;

  const kayit = await prisma.reading.create({
    data: { deviceId, temperature, humidity },
  });

  res.status(201).json(kayit);
});

export default router;
```

```js
// index.js (veya app.js) — mevcut route'ların yanına ekle
import readingsRouter from "./routes/readings.js";
app.use("/", readingsRouter);
```

Test et — Thonny'den `g1_local_test.py`'deki URL'i `/test` yerine `/readings` yap ve tekrar çalıştır. Ya da terminalden curl ile:

```bash
curl -X POST http://localhost:3000/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"esp32-oda-1","temperature":23.4,"humidity":41}'
```

Prisma Studio'yu aç (`npx prisma studio`) ve `Reading` tablosunda yeni satırı gör.

### 2:30–3:00 · Terim defteri + commit

**Küçük zafer:** API'n artık ölçüm kabul ediyor ve veritabanında kalıcı bir satır oluşuyor — ilk kez donanım verisi disk'e yazıldı. **Terim defteri:** `Prisma model` `migration` `route handler` `201 Created` **Çıktı:** `prisma/schema.prisma` güncellendi, `routes/readings.js` yeni. **Commit:** `hafta-12 g2: POST /readings endpoint + Prisma Reading modeli`

---

## Gün 3 — Zaman damgası, cihaz kimliği, validation

### 0:00–1:00 · Neden validation gerekli

Şu an API'n `req.body`'ye körü körüne güveniyor. Sensör bozulursa, kart resetlenirse ya da biri kötü niyetle isteğe rastgele veri koyarsa, DB'ne anlamsız satırlar (`temperature: "abc"`, `humidity: 9999`) girebilir. Bu senin **veri kalitenin** garantisi — Hafta 13'te grafiğin bozuk bir noktayla çirkinleşmesini önler.

### 1:00–2:00 · Validation ekle

```js
// routes/readings.js
router.post("/readings", async (req, res) => {
  const { deviceId, temperature, humidity } = req.body;

  // deviceId zorunlu ve metin olmalı
  if (!deviceId || typeof deviceId !== "string") {
    return res.status(400).json({ hata: "deviceId zorunlu ve metin olmalı" });
  }
  // fiziksel olarak makul sıcaklık aralığı (-40°C / 80°C)
  if (typeof temperature !== "number" || temperature < -40 || temperature > 80) {
    return res.status(400).json({ hata: "geçersiz sıcaklık değeri" });
  }
  // nem her zaman %0-100 arası olmalı
  if (typeof humidity !== "number" || humidity < 0 || humidity > 100) {
    return res.status(400).json({ hata: "geçersiz nem değeri" });
  }

  const kayit = await prisma.reading.create({
    data: { deviceId, temperature, humidity },
  });

  res.status(201).json(kayit);
});
```

Test et — bozuk veri gönder, `400 Bad Request` döndüğünü doğrula:

```bash
curl -X POST http://localhost:3000/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"esp32-oda-1","temperature":"cok-sicak","humidity":41}'
# beklenen: {"hata":"geçersiz sıcaklık değeri"}
```

💡 `400` = "senin isteğin bozuk" (client hatası). `500` = "benim sunucumda bir şey patladı" (server hatası). Bu ayrım mülakatlarda sorulur — hangi tarafın hatası olduğunu status code'dan anlarsın.

### 2:00–2:40 · deviceId'yi kartta sabitle

Hafta 11 Gün 6'da zaten `DEVICE_ID = "esp32-oda-1"` sabitini eklemiştin — bugün onun neden önemli olduğunu pekiştir: ileride ikinci bir kart eklersen (mesela mutfak için), aynı tablo iki cihazın verisini `deviceId` ile ayırt eder. Tek satırlık bir değişiklik, çok satırlık bir esneklik kazandırır.

```python
# ESP32 tarafı — Hafta 11'den hatırlarsın, bugün sadece doğrula
DEVICE_ID = "esp32-oda-1"
payload = {
    "deviceId": DEVICE_ID,
    "temperature": sensor.temperature(),
    "humidity": sensor.humidity(),
}
```

### 2:40–3:00 · Terim defteri + commit

**Küçük zafer:** Artık kötü veri DB'ye giremiyor, her satır hangi cihazdan geldiğini ve ne zaman geldiğini biliyor. **Terim defteri:** `validation` `400 Bad Request` `client hatası vs server hatası` `deviceId` **Çıktı:** `routes/readings.js` validation ile güncellendi. **Commit:** `hafta-12 g3: validation + deviceId doğrulaması`

---

## Gün 4 — Güvenilirlik: hata toleransı, aralıklı gönderim

### 0:00–1:00 · Neden gerekli

Kartın günlerce, kimse izlemeden çalışacak. Gerçek dünyada olabilecekler:

- WiFi router'ı yeniden başlar → kart bağlantıyı kaybeder.
- Sensör ara sıra `OSError` fırlatır (Hafta 11'de gördün).
- API'n geçici olarak cevap vermez (deploy, yeniden başlatma).

Bunların hiçbiri programı **durdurmamalı**. Embedded kodun altın kuralı: *tek bir hata, sonsuz döngüyü kesmesin.*

### 1:00–2:00 · Dayanıklı ana döngü

```python
# g4_guvenilir_dongu.py
from machine import Pin
from secrets import WIFI_SSID, WIFI_SIFRE
import network
import dht
import urequests as requests
import time

DEVICE_ID = "esp32-oda-1"
API_URL = "http://192.168.1.42:3000/readings"
ARALIK_SANIYE = 10

wlan = network.WLAN(network.STA_IF)
sensor = dht.DHT22(Pin(4))

def wifi_kontrol():
    wlan.active(True)
    if not wlan.isconnected():
        print("WiFi koptu, yeniden bağlanıyor...")
        wlan.connect(WIFI_SSID, WIFI_SIFRE)
        baslangic = time.time()
        while not wlan.isconnected():
            if time.time() - baslangic > 15:
                print("WiFi'ye 15 sn'de bağlanılamadı, sonraki turda tekrar denenecek")
                return False
            time.sleep(0.5)
    return True

def guvenli_gonder(payload, deneme=3):
    for i in range(deneme):
        try:
            yanit = requests.post(API_URL, json=payload)
            durum = yanit.status_code
            yanit.close()
            if durum == 201:
                print("Gönderildi:", durum)
                return True
            else:
                print("Sunucu reddetti:", durum)
                return False
        except Exception as e:
            print("Deneme {} başarısız: {}".format(i + 1, e))
            time.sleep(2)
    return False

while True:
    if wifi_kontrol():
        try:
            sensor.measure()
            payload = {
                "deviceId": DEVICE_ID,
                "temperature": sensor.temperature(),
                "humidity": sensor.humidity(),
            }
            guvenli_gonder(payload)
        except OSError as e:
            print("Sensör okuma hatası, bu turu atlıyorum:", e)

    time.sleep(ARALIK_SANIYE)
```

Bunu test etmenin en iyi yolu: kart çalışırken evdeki WiFi'yi birkaç saniyeliğine kapat/aç ya da API sunucunu durdur/başlat. Program çökmeden devam etmeli, sadece hata mesajları basmalı.

💡 `try/except` içindeki her `except`, "bu spesifik hatayı bekliyorum ve ne yapacağımı biliyorum" demek. Genel bir `except:` (hiçbir tür belirtmeden) yakalamak kötü pratiktir — beklenmedik hataları da sessizce yutar. `OSError`, `Exception as e` gibi spesifik ve mesajlı yakalama tercih et.

### 2:00–2:40 · Gözlemle

Kartı 15-20 dakika serbest bırak, Shell çıktısını izle. Kaç başarılı gönderim, kaç hata oldu? Bu gözlem, capstone'un README'sinde ("sistem X saat kesintisiz çalıştı") kullanabileceğin gerçek bir kanıt.

### 2:40–3:00 · Terim defteri + commit

**Küçük zafer:** Kartı bilgisayardan çekip WiFi'yi kapatıp açtın, program çökmeden kendini toparladı. **Terim defteri:** `retry` `exception handling` `resilience / dayanıklılık` `timeout` **Çıktı:** `hafta-12/g4_guvenilir_dongu.py`. **Commit:** `hafta-12 g4: hata toleranslı, dayanıklı gönderim döngüsü`

---

## Gün 5 — Geçmiş uç: GET /readings?range=24h

### 0:00–1:30 · Sorgu parametresi ile filtreleme

Şimdiye kadar sadece veri **yazdın**. Bugün onu **okuyacak** bir uç ekliyorsun — Hafta 13'teki grafiğin veri kaynağı bu olacak.

```js
// routes/readings.js — GET uç ekle
router.get("/readings", async (req, res) => {
  const { range } = req.query; // örn: ?range=24h

  let since = new Date(0); // varsayılan: tüm zamanlar
  if (range === "24h") {
    since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  } else if (range === "1h") {
    since = new Date(Date.now() - 60 * 60 * 1000);
  }

  const kayitlar = await prisma.reading.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  res.json(kayitlar);
});
```

💡 `req.query` — URL'deki `?range=24h` kısmı buradan okunur (`req.body` ile karıştırma: `body` = isteğin gövdesi, POST'ta kullanılır; `query` = URL'nin sonundaki `?anahtar=değer` kısmı, GET'te kullanılır).

### 1:30–2:30 · Test et

```bash
# son 24 saat
curl "http://localhost:3000/readings?range=24h"

# tüm zamanlar
curl "http://localhost:3000/readings"
```

Eğer kartın az önce birkaç ölçüm gönderdiyse, bunları JSON dizisi olarak görmelisin — `createdAt`'e göre eskiden yeniye sıralı.

💡 `orderBy: { createdAt: "asc" }` — "ascending" (artan), yani en eski en başta. Bir grafik çizerken bu sıralama önemli: tersini yaparsan çizgi soldan sağa değil sağdan sola "akar", kafa karıştırır.

### 2:30–3:00 · Terim defteri + commit

**Küçük zafer:** API'nden gerçek sensör verisinin son 24 saatini JSON olarak çektin — Hafta 13'ün grafiği için veri kaynağı hazır. **Terim defteri:** `query parameter` `orderBy` `date range` `gte (greater than or equal)` **Çıktı:** `routes/readings.js`'e GET eklendi. **Commit:** `hafta-12 g5: GET /readings?range=24h`

---

## Gün 6 — Uçtan uca test

Bugün "kanıt günü": kartı aç, gerçek zamanlı izle, DB'yi sorgula — zincirin **tamamının** çalıştığını kendi gözünle gör.

### 0:00–1:00 · Canlı izleme

İki pencereyi yan yana aç:

1. **Thonny Shell** — kartın loglarını gösterir (`Gönderildi: 201` satırları).
2. **Terminal** — Node/Express sunucusunun konsol çıktısı.

Kartı çalıştır (`g4_guvenilir_dongu.py`), 5-10 dakika izle. Her ~10 saniyede bir kartın gönderdiğini, sunucunun kabul ettiğini gör.

### 1:00–2:00 · DB'yi sorgula

```bash
# terminal 3'te
curl "http://localhost:3000/readings?range=1h" | python3 -m json.tool
```

Ya da Prisma Studio ile görsel olarak (`npx prisma studio`), `Reading` tablosunda satırların gerçek zamanlı arttığını izle — sayfayı yenile, yeni satırlar görünsün.

### 2:00–3:00 · Belgele

`hafta-12/g6-e2e-notlari.md` dosyasına bugünkü testi kısaca not al — bu, capstone README'nin (Hafta 13 Gün 6) taslağı olacak:

```markdown
# Uçtan uca test — [tarih]

- Kart X dakika kesintisiz çalıştı, Y başarılı gönderim yaptı.
- WiFi'yi bilerek kestim, kart Z saniyede kendini toparladı.
- GET /readings?range=1h ile son 1 saatteki gerçek ölçümleri doğruladım.
- Sonraki adım (Hafta 13): bu veriyi WebSocket ile canlı panoya, Recharts ile grafiğe bağlamak.
```

**Küçük zafer:** Şema 3'ün sol yarısı — sensör → ESP32 → API → Postgres → sorgu — komple ve kanıtlanmış şekilde çalışıyor. **Terim defteri:** `end-to-end (uçtan uca) test` `pipeline` `log/debug` **Çıktı:** `hafta-12/g6-e2e-notlari.md`. **Commit:** `hafta-12 g6: uçtan uca test - donanım verisi DB'ye ulaşıyor`

---

## Gün 7 — Pazar review

- HTTP POST ile GET arasındaki fark ne? `req.body` ile `req.query` nerede kullanılır?
- `yanit.close()` neden ESP32'de elle çağrılması gerekiyor, ne olmazsa ne olur?
- Validation neden route'un en başında yapılır, veritabanına yazmadan önce?
- `guvenli_gonder()` fonksiyonu bir istek başarısız olunca ne yapıyor? Neden 1 kere değil de birkaç kere deniyor?
- `range=24h` sorgu parametresi Prisma tarafında nasıl bir `where` koşuluna dönüşüyor?
- Bu haftaki en kırılgan nokta neresiydi (WiFi kopması mı, sensör hatası mı, sunucu çökmesi mi)? Nasıl önledin?

**Teach-back:** Kartı aç, canlı bir ölçümün API'ne gidip DB'de göründüğünü Roy'a/Ertan'a uçtan uca göster.

**Haftaya bakış:** Hafta 13'te bu zincirin ucuna bir WebSocket ekleyip, React panosunu **anında** güncelleyeceksin. Sonra grafik, uyarı eşiği, deploy ve capstone'u mülakat için paketleme geliyor — bu, 13 haftanın vitrine çıktığı hafta.

**Küçük zafer:** Donanım ile yazılım yarıların artık gerçek zamanlı, güvenilir bir şekilde konuşuyor. **Terim defteri:** Hafta 12'nin terimlerini gözden geçir, teach-back'te kullan. **Çıktı:** Zincir uçtan uca doğrulandı. **Commit:** `hafta-12 g7: review notları`

---
