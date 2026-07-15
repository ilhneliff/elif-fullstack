# Hafta 13 — Capstone Cila (Faz 4 🔌)

> **Hedef:** Zincirin ucuna WebSocket ile canlı push ekle, React panosunu grafik + uyarı rozetleriyle donat, auth ile koru, deploy et ve hikayeyi mülakat için paketle.
> **Çıktı:** ✔ 🔌 IoT dashboard — portföy yıldızı
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Hafta 12'yi kartın ölçümü senin API'n üzerinden PostgreSQL'e güvenilir şekilde ulaşmasıyla bitirdin. Şema 3'ün sol yarısı ("sensör → ESP32 → API → Postgres") çalışıyor. Bu hafta sağ yarısını ("→ WebSocket → React panosu") ekleyip zinciri tamamlıyorsun — ve sonunda elinde, mülakatta 40 dakika konuşabileceğin bir proje oluyor.

---

## Gün 1 — WebSocket: canlı push

### 0:00–1:00 · HTTP'den WebSocket'e

Şimdiye kadar kullandığın HTTP isteği **tek yönlü ve anlık**: istemci sorar, sunucu cevaplar, bağlantı kapanır. Bir pano için bu yetersiz — sunucunun *"yeni veri geldi!"* diye kendiliğinden haber vermesi lazım, kullanıcı sürekli sayfayı yenilemeden.

**WebSocket**, HTTP'nin aksine **kalıcı, iki yönlü** bir bağlantı kurar: bir kere el sıkışılır (handshake), sonra bağlantı açık kalır ve her iki taraf da istediği an mesaj gönderebilir. Bu, canlı sohbet uygulamalarının, borsa ekranlarının ve — senin panonun — çalışma biçimi.

```bash
npm install ws
```

### 1:00–2:00 · WebSocket sunucusu ekle

```js
// server/ws.js
import { WebSocketServer } from "ws";

let wss;

export function wsBaslat(httpServer) {
  wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (socket) => {
    console.log("Yeni pano bağlandı, açık bağlantı sayısı:", wss.clients.size);
    socket.on("close", () => {
      console.log("Pano ayrıldı, açık bağlantı sayısı:", wss.clients.size);
    });
  });
}

// yeni bir ölçüm geldiğinde tüm açık panolara aynı anda yayınla
export function yayinla(veri) {
  if (!wss) return;
  const mesaj = JSON.stringify(veri);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(mesaj);
    }
  });
}
```

Express'in normal `app.listen()`'i tek başına WebSocket'i desteklemez — ikisinin aynı sunucuyu paylaşması gerekir:

```js
// index.js
import http from "http";
import express from "express";
import readingsRouter from "./routes/readings.js";
import { wsBaslat, yayinla } from "./server/ws.js";

const app = express();
app.use(express.json());
app.use("/", readingsRouter);

const server = http.createServer(app); // Express'i düz bir HTTP sunucusuna sar
wsBaslat(server);                       // aynı sunucu üzerinde WebSocket dinlesin

server.listen(3000, () => console.log("API + WebSocket 3000 portunda"));
```

Şimdi `readings.js`'deki POST handler'ına, kayıt oluşunca yayın yapmasını ekle:

```js
// routes/readings.js
import { yayinla } from "../server/ws.js";

router.post("/readings", async (req, res) => {
  // ...mevcut validation...

  const kayit = await prisma.reading.create({
    data: { deviceId, temperature, humidity },
  });

  yayinla(kayit); // yeni ölçümü tüm açık panolara anında yayınla

  res.status(201).json(kayit);
});
```

### 2:00–3:00 · Test et

Terminalden basit bir test istemcisiyle dinle (Node'un yerleşik `ws` paketiyle küçük bir script, ya da tarayıcı konsolunda):

```js
// tarayıcı konsolunda dene (F12 → Console)
const socket = new WebSocket("ws://localhost:3000");
socket.onmessage = (e) => console.log("Yeni ölçüm:", JSON.parse(e.data));
```

Kartını çalıştır (Hafta 12'nin `g4_guvenilir_dongu.py`) — bir ölçüm gönderdiğinde konsolda anında mesajın düştüğünü görmelisin. Bu, "push" un ne demek olduğunu gözünle gördüğün an.

💡 WebSocket URL'i `http://` değil `ws://` ile başlar (güvenli versiyonu `wss://`, tıpkı `https://` gibi). Deploy ederken bunu unutma — Hafta 5'te (Faz 2) `wss://` gereksinimine tekrar döneceksin.

**Küçük zafer:** Yeni bir ölçüm geldiği anda, sayfayı yenilemeden, bir mesaj anında düştü — ilk gerçek "canlı" anın. **Terim defteri:** `WebSocket` `broadcast` `persistent connection (kalıcı bağlantı)` `handshake` **Çıktı:** `server/ws.js`, `POST /readings` artık yayın yapıyor. **Commit:** `hafta-13 g1: WebSocket sunucusu + broadcast`

---

## Gün 2 — React pano: canlı son değer + durum kartı

### 0:00–1:00 · Proje iskeleti + WebSocket hook'u

`projeler/iot-dashboard/` altında Hafta 5-7'den tanıdığın React + TypeScript (Vite) projeni kur:

```bash
npm create vite@latest iot-dashboard -- --template react-ts
cd iot-dashboard
npm install
```

WebSocket bağlantısını yöneten bir **custom hook** yaz — bağlantıyı açar, mesaj geldikçe state'i günceller, component kapanınca temizler:

```tsx
// src/hooks/useCanliOlcum.ts
import { useEffect, useState } from "react";

type Olcum = {
  deviceId: string;
  temperature: number;
  humidity: number;
  createdAt: string;
};

export function useCanliOlcum(wsUrl: string) {
  const [sonOlcum, setSonOlcum] = useState<Olcum | null>(null);
  const [bagli, setBagli] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => setBagli(true);
    socket.onclose = () => setBagli(false);
    socket.onerror = () => setBagli(false);
    socket.onmessage = (event) => {
      const veri: Olcum = JSON.parse(event.data);
      setSonOlcum(veri);
    };

    // component ekrandan kalkınca bağlantıyı mutlaka kapat
    // (kapatmazsan sayfa değişince "hayalet" bağlantılar birikir)
    return () => socket.close();
  }, [wsUrl]);

  return { sonOlcum, bagli };
}
```

💡 `useEffect`'in `return` ile döndürdüğü fonksiyon **cleanup**'tır — component kaldırıldığında React'ın otomatik çağırdığı "temizlik" adımı. WebSocket gibi kalıcı bağlantılarda bunu unutmak, sızıntıya (leak) yol açar.

### 1:00–2:30 · Durum kartı

```tsx
// src/components/StatusCard.tsx
import { useCanliOlcum } from "../hooks/useCanliOlcum";

const WS_URL = "ws://localhost:3000";

export function StatusCard() {
  const { sonOlcum, bagli } = useCanliOlcum(WS_URL);

  return (
    <div className="kart">
      <div className="baslik">
        <span className={bagli ? "nokta yesil" : "nokta gri"} />
        <span>{bagli ? "Canlı" : "Bağlanıyor..."}</span>
      </div>

      {sonOlcum ? (
        <>
          <h2>{sonOlcum.temperature.toFixed(1)}°C</h2>
          <p>%{sonOlcum.humidity.toFixed(0)} nem</p>
          <small>{sonOlcum.deviceId}</small>
        </>
      ) : (
        <p>Henüz ölçüm gelmedi, kartın çalıştığından emin ol.</p>
      )}
    </div>
  );
}
```

```tsx
// src/App.tsx
import { StatusCard } from "./components/StatusCard";

export default function App() {
  return (
    <main>
      <h1>🔌 IoT Dashboard</h1>
      <StatusCard />
    </main>
  );
}
```

### 2:30–3:00 · Canlı test et

`npm run dev` ile projeyi başlat, kartını çalıştır, tarayıcıda değerlerin sensöre üflediğinde/ısıttığında anında değiştiğini gör. Bu, capstone'un "wow" anı — fiziksel dünyadaki değişikliğin tarayıcıda anlık yansıması.

**Küçük zafer:** Sensörü elinle etkiledin, tarayıcıdaki sayı sayfayı yenilemeden anında değişti. **Terim defteri:** `custom hook` `useEffect cleanup` `connection state` `real-time UI` **Çıktı:** `projeler/iot-dashboard/src/components/StatusCard.tsx`. **Commit:** `hafta-13 g2: React canlı durum kartı (WebSocket)`

---

## Gün 3 — Grafik: son 24 saat (Recharts)

### 0:00–1:00 · Recharts kurulumu + veri çekme

```bash
npm install recharts
```

Hafta 12 Gün 5'te kurduğun `GET /readings?range=24h` ucunu burada kullanıyorsun:

```tsx
// src/hooks/useGecmisOlcumler.ts
import { useEffect, useState } from "react";

type Olcum = { temperature: number; humidity: number; createdAt: string };

export function useGecmisOlcumler(apiUrl: string) {
  const [veri, setVeri] = useState<Olcum[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/readings?range=24h`)
      .then((r) => r.json())
      .then(setVeri)
      .catch((e) => console.error("Geçmiş veri çekilemedi:", e));
  }, [apiUrl]);

  return veri;
}
```

### 1:00–2:30 · Çizgi grafik + min/maks

```tsx
// src/components/TemperatureChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGecmisOlcumler } from "../hooks/useGecmisOlcumler";

const API_URL = "http://localhost:3000";

export function TemperatureChart() {
  const veri = useGecmisOlcumler(API_URL);

  if (veri.length === 0) {
    return <p>Grafik için henüz yeterli veri yok.</p>;
  }

  const sicakliklar = veri.map((v) => v.temperature);
  const min = Math.min(...sicakliklar);
  const max = Math.max(...sicakliklar);

  return (
    <div className="grafik-kutusu">
      <p>Son 24 saat · min {min.toFixed(1)}°C · maks {max.toFixed(1)}°C</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={veri}>
          <XAxis
            dataKey="createdAt"
            tickFormatter={(t) => new Date(t).toLocaleTimeString("tr-TR", {
              hour: "2-digit", minute: "2-digit",
            })}
          />
          <YAxis domain={["auto", "auto"]} unit="°C" />
          <Tooltip
            labelFormatter={(t) => new Date(t).toLocaleString("tr-TR")}
          />
          <Line type="monotone" dataKey="temperature" stroke="#e67e22" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

`App.tsx`'e ekle:

```tsx
import { StatusCard } from "./components/StatusCard";
import { TemperatureChart } from "./components/TemperatureChart";

export default function App() {
  return (
    <main>
      <h1>🔌 IoT Dashboard</h1>
      <StatusCard />
      <TemperatureChart />
    </main>
  );
}
```

### 2:30–3:00 · Gözlemle + terim defteri

Kartı birkaç saat açık bırakmışsan (Hafta 12'den beri), grafikte gerçek bir eğri göreceksin — gün içindeki sıcaklık dalgalanması. Yoksa, birkaç dakika daha veri topla, grafiğin en az birkaç noktası olsun.

💡 `dataKey="temperature"` — Recharts'a "bu alandaki değeri çiz" diyorsun; veri dizisindeki her nesnenin bu alana sahip olması gerekir (tıpkı bir tablo sütunu seçer gibi).

**Küçük zafer:** Son 24 saatlik gerçek sıcaklık eğrini, kendi API'nden çekilmiş gerçek veriyle grafikte gördün. **Terim defteri:** `time series` `min/maks (aggregate)` `tooltip` `responsive chart` **Çıktı:** `src/components/TemperatureChart.tsx`. **Commit:** `hafta-13 g3: Recharts ile 24 saatlik sıcaklık grafiği`

---

## Gün 4 — Uyarı eşiği + durum rozetleri

### 0:00–1:00 · Eşik mantığı

Bir dashboard'u "akıllı" yapan şey ham sayı değil, **yorum**: "23°C" nötr bir bilgi, ama "⚠️ Sıcaklık yüksek" bir *anlam*. Bugün basit bir eşik (threshold) mantığı ekliyorsun — bu kararı frontend'de tutuyoruz (basit, hızlı; büyük bir sistemde backend'e taşınabilir ama capstone için gereksiz karmaşıklık).

```tsx
// src/lib/esikler.ts
export const ESIK_SICAKLIK_YUKSEK = 28; // °C üstü "uyarı"
export const ESIK_SICAKLIK_DUSUK = 15;  // °C altı "uyarı"
export const ESIK_NEM_YUKSEK = 70;      // % üstü "uyarı"

export function durumHesapla(temperature: number, humidity: number) {
  const sicaklikUyari =
    temperature > ESIK_SICAKLIK_YUKSEK || temperature < ESIK_SICAKLIK_DUSUK;
  const nemUyari = humidity > ESIK_NEM_YUKSEK;

  return sicaklikUyari || nemUyari ? "uyari" : "iyi";
}
```

### 1:00–2:00 · Rozet component'i

```tsx
// src/components/StatusBadge.tsx
import { durumHesapla } from "../lib/esikler";

type Props = { temperature: number; humidity: number };

export function StatusBadge({ temperature, humidity }: Props) {
  const durum = durumHesapla(temperature, humidity);

  return (
    <span className={durum === "uyari" ? "rozet uyari" : "rozet iyi"}>
      {durum === "uyari" ? "⚠️ Dikkat" : "✅ Normal"}
    </span>
  );
}
```

`StatusCard.tsx`'e ekle:

```tsx
import { StatusBadge } from "./StatusBadge";

// StatusCard içindeki JSX'e, sonOlcum varken:
{sonOlcum && (
  <StatusBadge temperature={sonOlcum.temperature} humidity={sonOlcum.humidity} />
)}
```

### 2:00–3:00 · Test et ve gözlemle

Sensörü elinle ısıt (avucunla sar, birkaç dakika bekle) — eşiği aştığında rozetin "⚠️ Dikkat"e döndüğünü gör. Bu, **koşullu render**'ı (conditional rendering — veriye göre farklı JSX gösterme) gerçek bir fiziksel tetikleyiciyle deneyimlediğin an.

💡 `durum === "uyari" ? "rozet uyari" : "rozet iyi"` — bu, **derived state** (türetilmiş durum) örneği: `durum` kendi başına saklanan bir state değil, mevcut `temperature`/`humidity`'den her render'da yeniden hesaplanıyor. Gereksiz state değişkeni açmaktan kaçınmanın standart yolu budur.

**Küçük zafer:** Sensörü ısıttığında kart gerçekten "tepki verdi" — statik bir ekran değil, gerçek bir izleme sistemi oldu. **Terim defteri:** `threshold (eşik)` `conditional rendering` `derived state` `status badge` **Çıktı:** `src/lib/esikler.ts`, `src/components/StatusBadge.tsx`. **Commit:** `hafta-13 g4: uyarı eşiği + durum rozetleri`

---

## Gün 5 — Auth + deploy

### 0:00–1:00 · Cihaz kimlik doğrulama (API key)

Şu an herkes internetten `POST /readings`'e rastgele veri gönderebilir. Hafta 8-10'da kullanıcı auth'unu (JWT) kurmuştun — kart için daha basit bir yöntem yeterli: sabit bir **API anahtarı**.

```js
// middleware/cihazAuth.js
export function cihazAuth(req, res, next) {
  const anahtar = req.headers["x-api-key"];
  if (anahtar !== process.env.DEVICE_API_KEY) {
    return res.status(401).json({ hata: "geçersiz cihaz anahtarı" });
  }
  next();
}
```

```js
// routes/readings.js
import { cihazAuth } from "../middleware/cihazAuth.js";

router.post("/readings", cihazAuth, async (req, res) => {
  // ...mevcut kod...
});
```

```bash
# .env dosyana ekle (commitleme!)
DEVICE_API_KEY=uzun-rastgele-bir-anahtar-uret
```

ESP32 tarafında header'a ekle:

```python
# g5_auth_ile_gonder.py — Hafta 12'nin guvenli_gonder fonksiyonuna ekle
API_ANAHTARI = "uzun-rastgele-bir-anahtar-uret"  # secrets.py'ye taşı, aynı .gitignore mantığı

def guvenli_gonder(payload, deneme=3):
    headers = {"X-API-Key": API_ANAHTARI}
    for i in range(deneme):
        try:
            yanit = requests.post(API_URL, json=payload, headers=headers)
            yanit.close()
            return True
        except Exception as e:
            print("Deneme başarısız:", e)
            time.sleep(2)
    return False
```

Pano tarafı (`GET /readings`) genel görünüm olduğu için Hafta 8-10'daki kullanıcı auth'unla (kim panoyu görebilir) koruyabilirsin — bu capstone'un kapsamı dışında detaylandırmıyoruz, mevcut auth middleware'ini yeniden kullan.

### 1:00–2:00 · Deploy: BE+DB Railway, FE Vercel

Hafta 8-10'da kurduğun deploy alışkanlığının aynısı:

```bash
# Backend + Postgres — Railway (repo bağlıysa push otomatik deploy eder)
railway up

# Frontend — Vercel
cd projeler/iot-dashboard
vercel --prod
```

Ortam değişkenlerini ayarla:

| Değişken | Nerede | Değer |
|---|---|---|
| `DATABASE_URL` | Railway (backend) | Postgres bağlantı adresi |
| `DEVICE_API_KEY` | Railway (backend) | ESP32'nin kullandığı anahtar |
| `VITE_API_URL` | Vercel (frontend) | `https://senin-api.up.railway.app` |
| `VITE_WS_URL` | Vercel (frontend) | `wss://senin-api.up.railway.app` |

Frontend kodunda `localhost` yerine bu env değişkenlerini kullan:

```tsx
const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;
```

### 2:00–3:00 · Kart hariç uçtan uca doğrula

ESP32 firmware'indeki `API_URL`'i canlı Railway adresine güncelle (yerel IP yerine `https://...`), kartı yeniden çalıştır. Şimdi kart → canlı API → canlı DB → canlı pano — **tüm zincir internette.**

💡 "Kart hariç deploy" derken kastımız şu: kartın kendisi hâlâ senin evinde, aynı WiFi'de çalışıyor — ama gittiği API artık canlı sunucuda. Kartın taşınabilir olması (örneğin başka bir eve götürülmesi) capstone'un kapsamı dışında, gerekmiyor.

**Küçük zafer:** Panonu bir link olarak herkese gönderebiliyorsun — "işte canlı sensörüm" diyebiliyorsun. **Terim defteri:** `API key` `environment variable` `401 Unauthorized` `production deploy` **Çıktı:** `.env` güncellendi, Railway + Vercel'de canlı. **Commit:** `hafta-13 g5: cihaz auth (API key) + deploy (Railway + Vercel)`

---

## Gün 6 — README + mimari şeması + demo videosu

Bugün kod yazmıyorsun — bugün **hikayeyi paketliyorsun.** Bir işveren capstone'unu ilk 2 dakikada anlayabilmeli.

### 0:00–1:00 · Proje README'si

```markdown
<!-- projeler/iot-dashboard/README.md -->
# IoT Dashboard — Fiziksel Dünyadan Canlı Web Panosuna

Bir ESP32 mikrodenetleyici + DHT22 sensörden okunan gerçek sıcaklık/nem verisini,
kendi yazdığım Node/Express API'si üzerinden PostgreSQL'e kaydedip, WebSocket ile
canlı bir React panosunda gösteren uçtan uca bir sistem.

## Neden bu proje

Fullstack yolculuğumun (16 hafta) capstone'u. Yazılımın FE/BE/DB katmanlarını,
gerçek fiziksel bir veri kaynağıyla birleştiriyor.

## Mimari

(aşağıdaki şemaya bak)

## Stack

- **Donanım:** ESP32 + DHT22, MicroPython firmware
- **Backend:** Node.js, Express, WebSocket (ws)
- **Veritabanı:** PostgreSQL + Prisma ORM
- **Frontend:** React, TypeScript, Recharts
- **Deploy:** Railway (API+DB), Vercel (frontend)

## Canlı demo

- Pano: https://senin-pano.vercel.app
- Demo video: (link)

## Kurulum

\`\`\`bash
npm install
npx prisma migrate dev
npm run dev
\`\`\`
```

### 1:00–2:00 · Mimari şeması

```
   🌡️ DHT22          🔌 ESP32                🧠 API              🗄️ Postgres         📊 React Pano
  (sıcaklık/nem) ──okur──▶ (MicroPython) ──WiFi/HTTP POST──▶ (Express) ──yazar──▶ (Prisma)
                                                                  │
                                                                  └──WebSocket broadcast──▶ (canlı grafik)
                                                                        ▲
                                                            GET /readings?range=24h
                                                            (geçmiş veri, ilk yüklemede)
```

Bunu README'ye ekle (yukarıdaki kod bloğu gibi, sade metin şema yeterli — bir görsel araçla (Excalidraw, Figma) çizmek istersen bonus, zorunlu değil).

### 2:00–3:00 · Demo videosu + mülakat cümlesi

Telefonla veya ekran kaydıyla 60-90 saniyelik bir video çek:

1. Kartı göster (fiziksel obje — "işte bu").
2. Sensörü elinle etkile (ısıt/üfle).
3. Ekrandaki panonun anında değiştiğini göster.
4. Grafiği ve uyarı rozetini göster.

Mülakat için tek cümlelik pitch'ini ezberle (kendi cümlenle, örnek):

> *"Bir sensörden gelen fiziksel veriyi, kendi yazdığım API üzerinden veritabanına kaydedip, WebSocket'le canlı bir React panosunda gösteren uçtan uca bir sistem kurdum — donanımdan tarayıcıya tam zincir."*

Videoyu bir yere yükle (YouTube unlisted, Google Drive) ve linki README'ye ekle.

**Küçük zafer:** Capstone'unu yabancı birine 2 dakikada, hem sözle hem görüntüyle anlatabilecek bir paket hazırladın. **Terim defteri:** `architecture diagram` `pitch` `portfolio piece` **Çıktı:** `projeler/iot-dashboard/README.md` + mimari şema + demo video linki. **Commit:** `hafta-13 g6: capstone README + mimari şema + demo videosu`

---

## Gün 7 — Pazar review (capstone bitti)

Bugün 13 haftanın en büyük teach-back'i: capstone'unu baştan sona, koda bakmadan anlat.

- WebSocket ile HTTP arasındaki fark ne? Neden pano için WebSocket seçtin?
- `useEffect`'in cleanup fonksiyonu ne işe yarıyor, WebSocket bağlamında neden önemli?
- Recharts'a verdiğin veri nereden geliyor (`GET /readings?range=24h`) — bu uç Hafta 12'de nasıl yazılmıştı?
- Uyarı eşiği kararını neden frontend'de tuttun? Backend'de olsaydı ne değişirdi?
- Cihaz auth (`X-API-Key`) ile kullanıcı auth (JWT, Hafta 8-10) arasındaki fark ne, ikisi neden farklı problemleri çözüyor?
- Şema 3'ü ("sensör → ESP32 → API → Postgres → WebSocket → React") baştan sona, elini kullanmadan, sadece konuşarak anlatabiliyor musun?

**Teach-back:** Roy'a/Ertan'a demo videonu izlet, sonra canlı kartı çalıştırıp aynı akışı gerçek zamanlı tekrar göster. İkisi arasındaki fark (kayıt vs canlı) senin özgüvenini test eder.

**Capstone bitti.** Donanımdan tarayıcıya, sensörden mülakat hikayesine — tam zincir elinde. Faz 5 (Hafta 14-16: portföy, CV, mülakat, başvuru) açılıyor; bu proje o üç haftanın vitrin parçası olacak.

**Küçük zafer:** 13 haftalık capstone'unu uçtan uca, canlı ve kayıtlı olarak gösterebiliyorsun — junior havuzundan seni ayıran hikaye artık elinde. **Terim defteri:** 13 haftanın embedded terimlerinin tamamını (mikrodenetleyici → WebSocket) tek seferde gözden geçir. **Çıktı:** `projeler/iot-dashboard` tamamlandı, canlı deploy + demo video + README. **Commit:** `hafta-13 g7: capstone tamamlandı - review notları`

---
