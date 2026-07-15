# Hafta 11 — Embedded'e Giriş (Faz 4 🔌)

> **Hedef:** Mikrodenetleyici dünyasına ilk adım — ESP32'yi tanı, ilk firmware'ini yaz, gerçek bir sensörden (DHT22) sıcaklık/nem oku, karta WiFi ver, ölçümü JSON'a çevir.
> **Çıktı:** ✔ Seri portta canlı sıcaklık/nem akışı + WiFi'ye bağlı, JSON üreten firmware
> ~3 sa/gün · 20 dk kuralı · Her gün commit + push.

Faz 3'te yazılım yarısını kurdun (kendi API'n + veritabanın). Bu hafta madalyonun diğer yüzü açılıyor: **donanım.** Elindeki $8'lık kart bir bilgisayardan çok farklı çalışır — ve tam da bu farkı sevdiğin için bu hafta capstone'un en keyifli parçalarından biri olacak. Yavaş git, her günü bir öncekinin üstüne kur; hafta sonunda kartın gerçek oda sıcaklığını okuyup WiFi üzerinden gönderime hazır JSON üretiyor olacak.

---

## Gün 1 — Mikrodenetleyici nedir, ESP32'yi tanı, kurulum

### 0:00–0:45 · Bilgisayar vs mikrodenetleyici

Şimdiye kadar kod yazdığın bilgisayar (laptop'un) bir **işletim sistemi** (macOS/Windows) çalıştırıyor: aynı anda onlarca program, dosya sistemi, pencereler. Bir **mikrodenetleyici** (microcontroller) bambaşka bir hayvan:

- **Tek program çalışır**, baştan sona, sonsuz döngüde. İşletim sistemi yok (ya da çok minimal bir tane var).
- **GPIO pinleri** var — kartın fiziksel dünyaya dokunduğu bacaklar. Bir pine "yüksek" (3.3V) veya "düşük" (0V) sinyal verebilir/okuyabilirsin.
- **Düşük güç, düşük maliyet, gerçek zamanlı.** Bir buzdolabının termostatı, bir akıllı prizin içi, senin DHT22 sensörünü okuyacak kart — hepsi mikrodenetleyici.

**ESP32** senin kartın: çift çekirdekli işlemci, **WiFi ve Bluetooth dahili** (bu yüzden seçtik — capstone'da internete çıkacak), ~30+ GPIO pini, ~$8. MicroPython veya C++ (Arduino) ile programlanır.

💡 Kaba kural: bilgisayar = "genel amaçlı beyin", mikrodenetleyici = "tek işe adanmış küçük beyin, ama fiziksel dünyaya doğrudan bağlı."

### 0:45–1:45 · Kurulum: Thonny + MicroPython flash

Elif Python'a aşina olduğun için firmware dilini **MicroPython** seçiyoruz — mantık ve söz dizimi tanıdık gelecek, öğrenme eğrisi çok daha kısa. (Arduino/C++ alternatifini aşağıda kısaca göreceksin.)

**1) Thonny'yi kur** — Python için basit, ESP32 desteği yerleşik bir editör.

```bash
# macOS (Homebrew ile)
brew install --cask thonny
```

**2) ESP32'yi USB ile bilgisayarına bağla.**

**3) Thonny'de firmware'i flashla:**

```
Thonny → Run menüsü → Select interpreter...
  → Interpreter: "MicroPython (ESP32)"
  → altta "Install or update MicroPython" linkine tıkla
  → Target port'u seç (kartın bağlı olduğu USB portu)
  → Variant: "Espressif ESP32 / ESP32" seç
  → Install tuşuna bas
```

Bu işlem kartın hafızasına MicroPython **firmware**'ini yazar (bu adıma **flash etmek** denir — kalıcı hafızaya yazma anlamında). 1-2 dakika sürer, ilerleme çubuğunu izle.

💡 Firmware = kartın çalıştığı temel yazılım katmanı. Telefonundaki işletim sistemi gibi düşün — MicroPython'ı flashlamak, kartına "artık Python komutlarını anlıyorsun" demek.

### 1:45–2:15 · Alternatif: Arduino IDE (kısaca)

Piyasada çoğu ESP32 örneği **Arduino IDE** ile C++ kullanır. Sen MicroPython'la devam edeceksin ama nasıl göründüğünü bilmen iyi olur — bir gün bir tutorial'da C++ örneği görürsen yabancılık çekmezsin.

```bash
# Arduino IDE kurulumu (macOS)
brew install --cask arduino-ide
```

Kurulumdan sonra: `Tools → Board → Boards Manager` → "esp32" ara → yükle. Sonra `Tools → Board → ESP32 Arduino → ESP32 Dev Module` seç, doğru portu seç. Bir Arduino programının iskeleti şöyle görünür (bu haftalık ödevin değil, sadece tanışma):

```cpp
// Arduino/C++'ta her program iki fonksiyondan oluşur
void setup() {
  // kart açılınca BİR KEZ çalışır — kurulum burada
  Serial.begin(115200);
}

void loop() {
  // setup bitince SONSUZA kadar tekrar çalışır — ana iş burada
  Serial.println("Merhaba ESP32");
  delay(1000); // 1000 ms = 1 saniye bekle
}
```

MicroPython'da `setup()`/`loop()` yok — düz Python: en üstte kurulum kodu, altında `while True:` ile sonsuz döngü. Aynı fikir, daha az tören.

### 2:15–2:45 · REPL ile ilk temas

Thonny'nin alt panelinde **Shell** (REPL — Read-Eval-Print Loop, yazdığın her satırı anında çalıştıran interaktif konsol) açık olmalı, kartına bağlı. Şunu yaz ve Enter'a bas:

```python
>>> print("Merhaba, ESP32!")
Merhaba, ESP32!
>>> 2 + 2
4
```

Kart gerçekten senin komutlarını çalıştırıyor — Thonny'nin çalıştırdığı bir simülasyon değil. Şimdi bunu bir dosyaya kaydet (`Ctrl/Cmd+S`, dosya adı `g1_merhaba.py`, konum: **This computer**, `hafta-11/` klasörünün içine kaydet):

```python
# g1_merhaba.py
# Kartın gerçekten çalıştığını doğrulayan ilk dosya

print("Merhaba, ESP32!")
print("MicroPython versiyonu calisiyor.")
```

Yeşil ▶ (Run) tuşuna bas — kod kartta çalışır, çıktı Shell'de görünür.

📎 *Opsiyonel derinleşme: [Random Nerd Tutorials — Getting Started with MicroPython on ESP32](https://randomnerdtutorials.com/getting-started-micropython-esp32-esp8266/)* (kurulumda takılırsan tek referans burası, zorunlu değil).

**Küçük zafer:** Kartın MicroPython'la konuşuyor — REPL'de kendi komutunu çalıştırdın. **Terim defteri:** `mikrodenetleyici` `firmware` `flash` `REPL` `GPIO` **Çıktı:** Thonny ESP32'ye bağlı, `hafta-11/g1_merhaba.py` çalışıyor. **Commit:** `hafta-11 g1: ESP32 kurulumu + MicroPython flash + ilk REPL`

---

## Gün 2 — İlk firmware: LED blink, GPIO kavramı

### 0:00–1:00 · GPIO nedir

**GPIO** (General Purpose Input/Output) = genel amaçlı giriş/çıkış pini. Kartındaki her GPIO pini iki şekilde kullanılabilir:

- **Output (çıkış):** sen pine "yüksek" (3.3V, mantıksal `1`/`True`) veya "düşük" (0V, `0`/`False`) sinyal *veriyorsun*. Bir LED yakmak = bir pini yüksek yapmak.
- **Input (giriş):** pin dışarıdan gelen sinyali *okuyorsun*. Bir butona basılmış mı, bir sensör ne diyor — bunu böyle öğrenirsin.

ESP32'nin kartı üzerinde genelde **GPIO2**'ye bağlı dahili (onboard) bir LED vardır (kartında farklıysa üzerindeki yazıya bak — çoğu DevKit modelinde 2'dir). Bugün kablo bağlamadan, sadece kod ile bu LED'i kontrol edeceksin.

💡 MicroPython'da pinlerle `machine` modülünün `Pin` sınıfı üzerinden konuşulur — bu modül, Python kodunu doğrudan donanıma bağlayan köprü.

### 1:00–2:00 · Blink kodu

```python
# g2_blink.py
# Dahili LED'i yak-söndür — embedded dünyasının "Merhaba Dünya"sı

from machine import Pin
import time

led = Pin(2, Pin.OUT)  # GPIO2'yi ÇIKIŞ pini olarak ayarla

while True:
    led.value(1)      # pini yüksek yap → LED yanar
    time.sleep(0.5)    # 0.5 saniye bekle
    led.value(0)      # pini düşük yap → LED söner
    time.sleep(0.5)
    print("blink!")    # seri porta da bas — yarın bunu konuşacağız
```

Çalıştır (▶). Kartın üzerindeki küçük LED yarım saniyede bir yanıp sönmeli. `Ctrl+C` ile Shell'den durdurabilirsin.

💡 `led.value(1)` yerine `led.on()` / `led.off()` da yazılabilir — MicroPython'ın `Pin` sınıfı ikisini de destekler, ikisi de aynı işi yapar.

### 2:00–2:40 · Deneyerek öğren

Küçük değişikliklerle "neden böyle davranıyor" hissini kur:

```python
# Hızını değiştir — 0.5 yerine 0.1 yap, ne oluyor?
time.sleep(0.1)

# Sadece 5 kere yanıp sön, sonra dur (sonsuz döngü değil)
led = Pin(2, Pin.OUT)
for i in range(5):
    led.value(1)
    time.sleep(0.2)
    led.value(0)
    time.sleep(0.2)
print("bitti")
```

`while True` yerine `for` kullanmak döngünün *sonlu* olmasını sağlar — bu ayrımı embedded'de sık göreceksin: sensör okuma döngüleri genelde sonsuzdur, kurulum/kalibrasyon adımları sonludur.

### 2:40–3:00 · Arduino'da nasıl görünürdü (kısaca)

Aynı blink, C++ tarafında böyle:

```cpp
void setup() {
  pinMode(2, OUTPUT);   // GPIO2'yi çıkış yap
}

void loop() {
  digitalWrite(2, HIGH); // LED yak
  delay(500);
  digitalWrite(2, LOW);  // LED söndür
  delay(500);
}
```

`pinMode`/`digitalWrite`/`delay` ↔ `Pin(2, Pin.OUT)`/`.value()`/`time.sleep()` — kavramlar birebir aynı, sadece söz dizimi farklı. Bunu görmen yeterli, iki dilde de yazmana gerek yok.

**Küçük zafer:** Kod yazıp fiziksel bir ışığı yaktın/söndürdün — ilk kez yazılımın gerçek dünyada bir etkisini gördün. **Terim defteri:** `GPIO` `pin` `output` `input` `machine modülü` **Çıktı:** `hafta-11/g2_blink.py`, kart üzerinde LED blink çalışıyor. **Commit:** `hafta-11 g2: ilk firmware - LED blink (GPIO)`

---

## Gün 3 — Seri port: karttan bilgisayara veri, baud rate

### 0:00–1:00 · Seri port ve baud rate

Dün `print("blink!")` yazdığında bu metin nereye gitti? **Seri port** (serial port) üzerinden — USB kablosu, kart ile bilgisayar arasında bir **UART** (Universal Asynchronous Receiver-Transmitter, basitçe: iki cihazın sırayla bit bit konuştuğu iletişim protokolü) hattı gibi davranır. Thonny'nin Shell paneli aslında bu seri portu dinleyen bir terminal.

**Baud rate** = saniyede kaç bit gönderildiği (iletişim hızı). ESP32 + MicroPython'da varsayılan **115200 baud**dur. İki taraf (kart ve bilgisayar) aynı baud rate'te anlaşmazsa çıktı anlamsız karakterlere dönüşür — Thonny bunu senin için otomatik ayarlıyor, ama Arduino'da elle `Serial.begin(115200)` ile söylemen gerekir.

💡 Baud rate'i bir telefon hattının konuşma hızına benzet: iki taraf da aynı hızda konuşmazsa (biri çok hızlı, biri çok yavaş dinlerse) anlaşamazlar.

### 1:00–2:00 · Canlı veri akışı

```python
# g3_seri_port.py
# Karttan bilgisayara düzenli veri akışı — sayaç + zaman

import time

sayac = 0

while True:
    sayac += 1
    print("Ölçüm #{} - geçen süre: {} sn".format(sayac, sayac * 2))
    time.sleep(2)  # her 2 saniyede bir veri bas
```

Çalıştır ve Shell'de akan çıktıyı izle — bu, yarın DHT22'den okuyacağın gerçek sensör verisinin provası. `Ctrl+C` ile durdur.

💡 `print()` MicroPython'da otomatik olarak seri porta yazar — ekstra bir "seri port aç" komutuna gerek yok, REPL zaten seri port üzerinden konuşuyor.

### 2:00–2:30 · Arduino tarafında seri port (kısaca)

```cpp
void setup() {
  Serial.begin(115200);       // seri portu 115200 baud'da başlat
}

void loop() {
  Serial.println("Merhaba seri port");
  delay(1000);
}
```

`Serial.begin(baud_rate)` = "bu hızda konuşacağım" demek. `Serial.println()` ↔ Python'daki `print()`. Arduino IDE'de bunu izlemek için sağ üstteki büyüteç ikonu (**Serial Monitor**) açılır ve **aynı baud rate'i** seçmen gerekir — yoksa ekranda anlamsız karakterler görürsün (bu, başlangıçta herkesin düştüğü klasik bir tuzak).

### 2:30–3:00 · Terim pekiştirme + not

Bugünkü dosyayı kaydet, birkaç farklı `time.sleep()` değeriyle dene, akışın hızını gözlemle. Terim defterine bugünün terimlerini kendi cümlenle yaz.

**Küçük zafer:** Kartın bilgisayarına düzenli, canlı bir veri akışı gönderdiğini gördün — bu tam olarak sensör verisinin izleyeceği yol. **Terim defteri:** `seri port` `UART` `baud rate` `Serial.print` **Çıktı:** `hafta-11/g3_seri_port.py`. **Commit:** `hafta-11 g3: seri port ile canlı veri akışı`

---

## Gün 4 — DHT22 sensör bağla, sıcaklık/nem oku

Bugün fiziksel dünya gerçekten sayısala dönüyor. Kabloyu bağlayıp gerçek oda sıcaklığını ekranda göreceksin.

### 0:00–0:30 · DHT22 nedir, pin şeması

**DHT22**, sıcaklık ve nem ölçen, ucuz ve yaygın bir dijital sensördür. 3 veya 4 pinli olarak satılır:

- **3 pinli breakout modülü** (çoğu başlangıç kitinde bu var): VCC, DATA, GND — pull-up direnç (dirençlerin sinyali "temiz" tutmasını sağlayan küçük bir elektronik parça) kartın üzerinde hazır, ekstra bir şeye gerek yok.
- **Çıplak 4 pinli sensör**: VCC, DATA, NC (boş), GND — DATA ile VCC arasına **10kΩ pull-up direnç** eklemen gerekir.

Elindeki hangisiyse, bağlantı mantığı aynı:

```
        ESP32                          DHT22 (3 pinli modül)
      ┌──────────┐                    ┌────────────┐
      │      3V3 ●────────────────────●  VCC       │
      │          │                    │            │
      │    GPIO4 ●────────────────────●  DATA(OUT) │
      │          │                    │            │
      │      GND ●────────────────────●  GND       │
      └──────────┘                    └────────────┘

      (çıplak 4 pinli sensör kullanıyorsan VCC–DATA arasına
       10kΩ pull-up direnç ekle; 3 pinli modülde bu zaten üzerinde.)
```

**GPIO4**'ü seçtik çünkü ESP32'de "boot pin" gibi özel bir rolü yok — güvenle kullanılabilir (GPIO0, 2, 5, 12, 15 gibi bazı pinlerin kartın açılışında özel görevleri var, başlangıçta onlardan kaçınmak işini kolaylaştırır).

📎 *Opsiyonel: [Random Nerd Tutorials — ESP32 DHT22 with MicroPython](https://randomnerdtutorials.com/micropython-dht11-dht22-esp32-esp8266/)* (bağlantıda takılırsan).

### 0:30–1:30 · MicroPython ile oku

MicroPython'ın ESP32 firmware'i `dht` modülünü hazır getirir — ekstra kurulum gerekmez.

```python
# g4_dht22.py
# DHT22'den gerçek sıcaklık/nem oku

from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(4))  # DATA pini GPIO4'e bağlı

sensor.measure()                  # sensöre "yeni ölçüm al" de
sicaklik = sensor.temperature()   # santigrat derece
nem = sensor.humidity()           # yüzde nem

print("Sıcaklık: {}°C".format(sicaklik))
print("Nem: %{}".format(nem))
```

Çalıştır. Odandaki gerçek sıcaklığı görmelisin — sensörü avucunla ısıtıp tekrar çalıştırırsan sayının değiştiğini de görürsün.

### 1:30–2:30 · Döngüde oku + hata yönetimi

DHT22 zamanlamaya duyarlıdır; ara sıra okuma başarısız olur ve `OSError` fırlatır. Bunu yakalamazsan programın çöker — embedded'de bu kabul edilemez, kart günlerce çalışacak.

```python
# g4_dht22_dongude.py
from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(4))

while True:
    try:
        sensor.measure()
        print("Sıcaklık: {}°C, Nem: %{}".format(
            sensor.temperature(), sensor.humidity()
        ))
    except OSError as e:
        # sensör bazen zamanlama hatası verir - normal, bu turu atla
        print("Okuma hatası, tekrar denenecek:", e)

    time.sleep(2)  # DHT22 saniyede 1'den sık okuma istemiyor, 2 sn güvenli
```

💡 `try/except` embedded kodda süs değil, zorunluluk: bir masaüstü programı çökerse kullanıcı yeniden başlatır; bir sensör kartı çökerse kimse orada değildir, sonsuza kadar durur.

### 2:30–3:00 · Gözlemle ve terim defteri

Kartı 5 dakika açık bırak, sıcaklık/nem değerlerinin nasıl kaydığını izle. Sensörü üfle, avucunla kapat — tepkiyi gör. Bu "hissetme" anı, embedded'in sana neden hitap ettiğinin tam kalbi.

**Küçük zafer:** Ekranda gerçek oda sıcaklığın akıyor — fiziksel dünya ilk kez senin kodunla sayıya döndü. **Terim defteri:** `sensör` `pull-up direnç` `dijital sinyal` `OSError` `örnekleme (sampling)` **Çıktı:** `hafta-11/g4_dht22_dongude.py`, DHT22 bağlı ve okunuyor. **Commit:** `hafta-11 g4: DHT22 sıcaklık/nem okuma`

---

## Gün 5 — WiFi'ye bağlan

### 0:00–1:00 · network modülü, WLAN, STA mode

ESP32'nin WiFi çipini MicroPython'da `network` modülü ile konuşursun. Kartını iki moddan birine alabilirsin:

- **STA (station) mode:** kart, senin ev WiFi'ına *bağlanan bir cihaz* gibi davranır (telefonun gibi). Capstone'da bunu kullanacaksın.
- **AP (access point) mode:** kart kendi WiFi ağını yayınlar. Bugün ilgilenmiyoruz.

```python
# g5_wifi.py
import network
import time

SSID = "senin-wifi-adin"
SIFRE = "senin-wifi-sifren"

wlan = network.WLAN(network.STA_IF)  # STA moduna al
wlan.active(True)                     # WiFi radyosunu aç

if not wlan.isconnected():
    print("WiFi'ye bağlanıyor...")
    wlan.connect(SSID, SIFRE)
    while not wlan.isconnected():
        time.sleep(0.5)
        print(".", end="")

print("\nBağlandı! IP adresin:", wlan.ifconfig()[0])
```

Çalıştır — birkaç saniye içinde "Bağlandı!" ve kartının aldığı **IP adresini** görmelisin. Bu IP, kartının senin ev ağındaki kimliği; Hafta 12'de API'ne buradan istek atacak.

### 1:00–2:00 · Bağlantı durumunu yönet

```python
# WiFi durumunu her an kontrol edebilmek işine yarayacak
print("Bağlı mı?", wlan.isconnected())
print("Sinyal gücü (RSSI):", wlan.status('rssi'), "dBm")

# bağlantıyı kapat / tekrar aç denemesi
def wifi_baglan(ssid, sifre, deneme_saniye=15):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if wlan.isconnected():
        return wlan

    wlan.connect(ssid, sifre)
    baslangic = time.time()
    while not wlan.isconnected():
        if time.time() - baslangic > deneme_saniye:
            print("Bağlanılamadı, zaman aşımı.")
            return wlan
        time.sleep(0.5)

    print("Bağlandı:", wlan.ifconfig()[0])
    return wlan
```

Bu fonksiyonu bir dosyaya kaydet — Hafta 12'de aynen tekrar kullanacaksın (bağlantı koptuğunda yeniden bağlanma mantığının temeli bu).

### 2:00–2:40 · Güvenlik: şifreyi kodda tutma

SSID/şifreyi kaynak koduna gömüp bunu GitHub'a **asla** push etme — herkese açık bir repoda WiFi şifren dolaşır. Ayrı bir dosyaya al:

```python
# secrets.py — BU DOSYA .gitignore'DA OLMALI, ASLA COMMIT ETME
WIFI_SSID = "senin-wifi-adin"
WIFI_SIFRE = "senin-wifi-sifren"
```

```python
# g5_wifi_guvenli.py
from secrets import WIFI_SSID, WIFI_SIFRE
import network, time

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_SIFRE)
while not wlan.isconnected():
    time.sleep(0.5)
print("Bağlandı:", wlan.ifconfig()[0])
```

`.gitignore`'a ekle:

```
# hafta-11/.gitignore
secrets.py
```

💡 Bu, gerçek işlerde de standart pratik: kimlik bilgileri (şifre, API anahtarı) kod ile aynı dosyada değil, `.gitignore`'lı ayrı bir dosyada veya ortam değişkeninde (env var) yaşar. Hafta 8-10'daki `.env` alışkanlığının aynısı, embedded versiyonu.

### 2:40–3:00 · Terim defteri + commit

`secrets.py`'yi commitlemediğinden emin ol — `git status` ile kontrol et, listede görünmemeli.

**Küçük zafer:** Kartın artık internete çıkabiliyor — kendi IP adresi var. **Terim defteri:** `WiFi` `SSID` `WLAN` `STA mode` `IP adresi` **Çıktı:** `hafta-11/g5_wifi_guvenli.py` + `.gitignore`'lı `secrets.py`. **Commit:** `hafta-11 g5: WiFi bağlantısı (STA mode)`

---

## Gün 6 — Düzenli ölçüm + JSON'a çevir (API'ye hazırlık)

Bugün üç önceki günün parçalarını (sensör, döngü, WiFi) birleştirip; haftaya API'ye göndereceğin veri paketini hazırlıyorsun.

### 0:00–1:00 · Periyodik ölçüm döngüsü

```python
# g6_periyodik_olcum.py
from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(4))
ARALIK_SANIYE = 10  # her 10 saniyede bir ölç

while True:
    try:
        sensor.measure()
        print("Sıcaklık: {}°C, Nem: %{}".format(
            sensor.temperature(), sensor.humidity()
        ))
    except OSError as e:
        print("Okuma hatası:", e)

    time.sleep(ARALIK_SANIYE)
```

💡 Neden 10 saniye? DHT22 çok sık okumayı sevmez (minimum ~2 sn), ama bir web panosu için saniyede bir güncelleme de gereksiz — 10 saniye, "yeterince canlı ama sensörü yormayan" makul bir denge. Bu tür aralık kararları embedded'de sürekli karşına çıkar.

### 1:00–2:00 · JSON'a çevir

Kartın topladığı veriyi API'ne göndermenin dili **JSON**'dur (Hafta 8-10'da backend tarafında zaten kullandın). MicroPython'da `json` modülü bunu yapar:

```python
# g6_json_payload.py
from machine import Pin
import dht
import json
import time

sensor = dht.DHT22(Pin(4))
DEVICE_ID = "esp32-oda-1"  # bu kartın kimliği - birden fazla kart olursa ayırt eder

def olcum_yap():
    sensor.measure()
    return {
        "deviceId": DEVICE_ID,
        "temperature": sensor.temperature(),
        "humidity": sensor.humidity(),
    }

# tek seferlik test
veri = olcum_yap()
payload = json.dumps(veri)  # dict -> JSON string
print(payload)
# örnek çıktı: {"deviceId": "esp32-oda-1", "temperature": 23.4, "humidity": 41}
```

💡 `json.dumps()` bir Python `dict`'ini metne (string) çevirir — bunu HTTP isteğinin gövdesinde göndereceksin. `dumps` = "dump string", yani "stringe dök".

### 2:00–2:40 · Zaman damgası ekle

Her ölçümün *ne zaman* alındığını bilmek, DB'de sıralama ve "son 24 saat" gibi sorgular için gerekli. ESP32'nin dahili saati WiFi bağlanmadan doğru değildir; şimdilik basit bir sayaç/epoch kullan — sunucu tarafında da zaten `createdAt` otomatik eklenecek (Hafta 12'de göreceksin), bu yüzden karttaki zaman damgası "ne zaman" konusunda ikinci bir referans:

```python
import time

payload = {
    "deviceId": DEVICE_ID,
    "temperature": sensor.temperature(),
    "humidity": sensor.humidity(),
    "uptimeSaniye": time.time(),  # kart açıldığından beri geçen süre (referans)
}
```

### 2:40–3:00 · Hepsini birleştir

```python
# g6_tam_dongu.py — Hafta 12'nin başlangıç noktası bu dosya olacak
from machine import Pin
from secrets import WIFI_SSID, WIFI_SIFRE
import network
import dht
import json
import time

DEVICE_ID = "esp32-oda-1"
ARALIK_SANIYE = 10

def wifi_baglan():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        wlan.connect(WIFI_SSID, WIFI_SIFRE)
        while not wlan.isconnected():
            time.sleep(0.5)
    print("WiFi bağlı:", wlan.ifconfig()[0])
    return wlan

sensor = dht.DHT22(Pin(4))
wifi_baglan()

while True:
    try:
        sensor.measure()
        payload = {
            "deviceId": DEVICE_ID,
            "temperature": sensor.temperature(),
            "humidity": sensor.humidity(),
        }
        print(json.dumps(payload))  # haftaya bunun yerine HTTP POST atacağız
    except OSError as e:
        print("Okuma hatası:", e)

    time.sleep(ARALIK_SANIYE)
```

Bu dosyayı çalışır durumda bırak — Hafta 12 Gün 1 tam burada, `print()` yerine `urequests.post()` koyarak devam edecek.

**Küçük zafer:** Kartın; sensörden okuyup, WiFi'ye bağlanıp, düzenli aralıklarla API'ye gönderilmeye hazır bir JSON paketi üretiyor — donanım yarısı komple. **Terim defteri:** `JSON serialize` `payload` `epoch/uptime` `sabit (constant)` **Çıktı:** `hafta-11/g6_tam_dongu.py`. **Commit:** `hafta-11 g6: periyodik ölçüm + JSON payload (API'ye hazır)`

---

## Gün 7 — Pazar review

Bu hafta kod yazmak kadar, **anlatabilmek** de önemli. Aşağıdaki soruları kendi cümlelerinle, koda bakmadan cevaplamayı dene — takıldığın yer, gerçekten öğrenmediğin yerdir.

- Bir bilgisayar ile bir mikrodenetleyici arasındaki temel fark ne? GPIO ne işe yarar?
- `Pin(2, Pin.OUT)` satırı ne yapıyor? `.value(1)` ile `.value(0)` arasındaki fark ne?
- Seri port nedir, baud rate ne anlama gelir? İki taraf uyuşmazsa ne olur?
- DHT22'yi ESP32'ye nasıl bağladın (3 pin, hangi GPIO)? Okuma neden bazen `OSError` verebiliyor?
- `wlan.isconnected()` ne kontrol eder? Şifreni neden `secrets.py`'ye ayırdın?
- `json.dumps()` bir dict'e ne yapar? Bu payload'u haftaya nereye göndereceksin?

**Teach-back:** Roy'a (ya da Ertan'a) 5 dakikada "bu hafta ne yaptım" anlat — kartı göster, `g6_tam_dongu.py`'yi çalıştır, canlı çıktıyı izlet.

**Haftaya bakış:** Hafta 12'de bu JSON paketi artık ekrana değil, senin Node/Express API'ne gidecek — `print()` yerine `urequests.post()`. Donanım ile yazılım yarın ilk kez gerçekten konuşacak.

**Küçük zafer:** Haftanın tamamını, koda bakmadan, kendi cümlelerinle anlatabildin. **Terim defteri:** Haftanın 20+ terimini gözden geçir, takıldıklarını işaretle. **Çıktı:** Teach-back tamamlandı, `hafta-11/` klasöründeki 6 dosya çalışır durumda. **Commit:** `hafta-11 g7: review notları`

---
