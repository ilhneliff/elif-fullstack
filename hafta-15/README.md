# Hafta 15 — Mülakat Pratiği (Faz 5)
> **Hedef:** Mülakat sorularına ezberle değil, anlayarak, rahat ve akıcı cevap verebilmek.
> **Çıktı:** ✔ mülakata hazır — 2dk ve 10dk proje anlatımı, JS kavramları, temel DSA, sistem sohbeti, hepsi provalı.
> ~3 sa/gün · Başvurular paralel devam ediyor.

## Gün 1 — Terminoloji drilleri

### 0:00–1:00 · Terim defterini derle
13 haftadır öğrendiğin her terimi tek bir yerde topla (Notion, Google Doc, ya da basit bir markdown dosyası — `hafta-15/terimler.md` gibi). Kategorilere ayır:

```
JS Temelleri: closure, hoisting, this, event loop, promise, async/await,
              callback, scope, prototip zinciri

React:        state, props, hook, useEffect, virtual DOM, key prop,
              controlled/uncontrolled component, re-render

Backend:      REST API, endpoint, middleware, status code, CORS,
              authentication vs authorization, JWT

Veritabanı:   şema, foreign key, index, migration, ORM, N+1 problemi

Deploy/DevOps: environment variable, CI/CD, build, container (Docker)

IoT/Embedded:  mikrodenetleyici, seri port, WebSocket, polling vs push
```

💡 Not: Amaç ansiklopedik tanım ezberlemek değil — her terimi "bir arkadaşına anlatır gibi" 2 cümlede açıklayabilmek. Sözlük tanımı ile mülakat cevabı farklıdır.

### 1:00–2:00 · Roy ile hızlı ateş quiz — round 1
Roy'a şunu söyle: "Terim defterimden bana sırayla soru sor, ben 20-30 saniyede cevap vereyim, sonra doğruluğunu/eksiğini söyle." Kategori kategori ilerle. Bilmediğin/eksik kaldığın her terimi ayrı bir listeye işaretle — bunlar bugünün gerçek hedefi.

### 2:00–3:00 · Zayıf noktaları tekrar et + round 2
İşaretlediğin terimleri tek tek çalış (13 hafta boyunca kullandığın gerçek kod/proje üzerinden hatırla — "closure'ı nerede kullanmıştım?" diye kendi projene bak, soyut tanım yerine somut örnek bul). Sonra Roy'la ikinci bir hızlı tur yap, bu sefer akıcılık hedefle (tereddütsüz, 15-20 saniyede).

**Küçük zafer:** "Bunu biliyordum ama şu an anlatamıyorum" hissi bugün kapanıyor. **Çıktı:** Kategorize edilmiş terim defteri + iki quiz turu geçmiş. **İşaret/Commit:** `hafta-15/terimler.md` dosyasını commit et.

---

## Gün 2 — "Projeni anlat": 2 dakika ve 10 dakika

### 0:00–1:00 · 2 dakikalık versiyon (asansör konuşması)
Her mülakatın ilk sorusu neredeyse hep budur: "Bize kendinden/projelerinden bahseder misin?" İskelet:

```
[1 cümle] Kim olduğun + ne yaptığın
  "Bilgisayar mühendisiyim, son aylarda yoğun şekilde fullstack
   geliştirmeye odaklandım."

[1-2 cümle] En güçlü/en önemli proje
  "En çok gurur duyduğum proje, bir ESP32 mikrodenetleyicisini kendi
   yazdığım API'ye bağlayıp canlı bir React panosunda gösterdiğim
   uçtan uca bir IoT sistemi."

[1 cümle] Problem + çözüm özeti
  "Sıcaklık verisini gerçek zamanlı takip etmek istiyordum, donanımdan
   veritabanına, oradan da canlı arayüze kadar tüm katmanı kendim kurdum."

[1 cümle] Şu an ne arıyorsun
  "Şu an junior fullstack pozisyonlarına odaklanıyorum, özellikle
   [ilgi alanın varsa buraya]."
```

Bunu yaz, sesli 3-4 kez prova et — kağıttan okuma, doğal aksın oturana kadar tekrarla.

### 1:00–2:00 · 10 dakikalık versiyon (derin anlatım)
Genişletilmiş versiyon, ekstra 4 katman:

```
1. Problem/motivasyon — biraz daha detay, gerçek bağlam
2. Teknik kararlar — "neden bu stack, neden bu yaklaşım"
   örn: "WebSocket seçtim çünkü polling'de 5 saniyelik gecikme oluyordu,
        gerçek zamanlı hissettirmesi gerekiyordu."
3. Karşılaştığın en zor problem + nasıl çözdün
   örn: "ESP32 bağlantısı koptuğunda API tarafında stale data
        gösteriyordu, bunu heartbeat + timeout mantığıyla çözdüm."
4. Sonuç + öğrenim + "bugün olsa ne farklı yapardım"
```

Yaz, sonra sesli anlat (kağıda bakmadan, sadece madde başlıklarını hatırla).

### 2:00–3:00 · Kaydet, izle, düzelt
Telefonunla kendini kaydet (video ya da en azından ses) — hem 2dk hem 10dk versiyonu. Sonra izle/dinle ve şunlara dikkat et:

- "Şey", "yani", "böyle" gibi dolgu kelimeler ne sıklıkta?
- Göz teması var mı (kamera/karşındakine bakıyor musun, kağıda mı)?
- Teknik terimleri açıklarken duraksıyor musun?

Zayıf noktaları düzelt, en az bir kez daha kaydet. İlk kayıt kötü hissettirir — normal, herkeste öyle. İkincisi fark yaratır.

💡 Not: Kayda bakmak rahatsız edici gelir, kaçma. Profesyonel oyuncular/sunucular bile kendi kaydını izleyip düzeltir — bu bir zayıflık değil, hazırlık disiplini.

**Küçük zafer:** Artık "ne anlatsam" paniği yok, iki hazır, provalı versiyon var. **Çıktı:** 2dk + 10dk script + en az 2 kayıt turu. **İşaret/Commit:** Script'i `hafta-15/proje-anlatimi.md` olarak kaydet, commit et.

---

## Gün 3 — JS temelleri Q&A (kavramsal, ezber değil)

### 0:00–1:00 · Closure + this
**Closure nedir?**
Kavramsal cevap: "Bir fonksiyon, tanımlandığı yerdeki değişkenlere, o fonksiyon dışarıda çalıştırılsa bile erişebilir. Yani fonksiyon kendi 'çevresini' hafızada taşır."

Örnek cevap (mülakatta söyleyeceğin gibi):
> "Closure'ı en çok bir sayaç (counter) yazarken kullandım — dışarıdaki bir `count` değişkenini, döndürdüğüm fonksiyon hatırlıyor ve her çağrıldığında onu güncelliyor, ama dışarıdan direkt erişilemiyor. Bu bana bir tür 'private state' sağladı."

```js
function counter() {
  let count = 0;
  return () => ++count;
}
const inc = counter();
inc(); // 1
inc(); // 2 — count, inc dışında görünmez ama hafızada tutuluyor
```

**`this` nedir?**
Kavramsal cevap: "`this`, bir fonksiyonun *nasıl çağrıldığına* bağlı olarak değişen bir referans. Tanımlandığı yere değil, çağrıldığı yere bakar (arrow function hariç — o `this`'i çevresinden miras alır)."

Örnek cevap:
> "React'te bir class component yazarken `this` kaybı sorunu yaşamıştım — event handler'ı `bind` etmeyi unutunca `this.setState` çalışmıyordu. Bu yüzden artık genelde arrow function kullanıyorum, `this` davranışı daha öngörülebilir oluyor."

### 1:00–2:00 · Event loop + async
**Event loop nedir?**
Kavramsal cevap: "JavaScript tek thread'de çalışır ama event loop sayesinde uzun süren işleri (network isteği, timer) bloklamadan yönetir. Call stack boşaldığında, bekleyen callback'ler (microtask'lar önce, sonra macrotask'lar) sıraya girer ve çalıştırılır."

Örnek cevap:
> "Bunu en net şu örnekle anlıyorum: `console.log('1'); setTimeout(() => console.log('2'), 0); console.log('3');` çalıştırdığında sıra 1, 3, 2 olur — çünkü setTimeout'un callback'i, stack boşalana kadar bekler, 0ms olsa bile."

**Promise / async-await farkı?**
Kavramsal cevap: "İkisi de aynı şeyi yapar — asenkron işlemi yönetir. async/await, Promise'in üzerine kurulu 'syntax sugar'; kodu senkron gibi okunur hale getirir, try/catch ile hata yönetimi de kolaylaşır."

```js
// Promise
fetchData().then(data => console.log(data)).catch(err => console.error(err));

// async/await — aynı şey, daha okunaklı
async function load() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 2:00–3:00 · Roy ile sözlü pratik — karışık sorular
Roy'a bu 4 konudan (closure, this, event loop, async) karışık sırayla, takip sorularıyla (follow-up) sormasını iste — gerçek mülakat "peki ya şu durumda?" diye derinleşir, tek seferlik soru-cevap değildir. Amacın: ilk cevabın kısa ve net olsun, follow-up geldiğinde panik yapma, "iyi soru, düşüneyim" diyip 2-3 saniye durup cevap vermek gayet normal.

💡 Not: Bilmediğin bir şey sorulursa "bilmiyorum" demekten çekinme — "tam emin değilim ama tahminim şu, çünkü..." demek, uydurmaktan çok daha iyi bir izlenim bırakır.

**Küçük zafer:** 4 kavramı artık ezbersiz, kendi cümlelerinle, örnekle anlatabiliyorsun. **Çıktı:** Yazılı Q&A notu + sözlü pratik turu tamamlanmış. **İşaret/Commit:** `hafta-15/js-kavramlar.md` yaz, commit et.

---

## Gün 4 — Temel DSA: array/string/hashmap

### 0:00–1:00 · Problem 1 — Two Sum
Junior mülakatlarda en sık çıkan problemlerden. Sorusu: bir sayı dizisinde, toplamı hedef değere eşit olan iki sayının index'lerini bul.

Naif çözüm (iç içe döngü, O(n²)) ile başla, sonra hashmap ile optimize et (O(n)):

```js
function twoSum(nums, target) {
  const seen = new Map(); // değer -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

twoSum([2, 7, 11, 15], 9); // [0, 1] çünkü 2 + 7 = 9
```

💡 Not: Mülakatta önce naif çözümü söyle ("iç içe döngüyle O(n²) yapabilirim ama..."), sonra optimize et. Direkt en iyi çözümü ezberden yazmak yerine düşünce sürecini göstermek, junior mülakatında asıl aranan şey.

### 1:00–2:00 · Problem 2 — Valid Anagram
İki string'in anagram olup olmadığını (aynı harflerden oluşup oluşmadığını) kontrol et — hashmap/frekans sayacı kullanımına iyi bir örnek:

```js
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const counts = {};
  for (const char of s) counts[char] = (counts[char] || 0) + 1;
  for (const char of t) {
    if (!counts[char]) return false;
    counts[char]--;
  }
  return true;
}

isAnagram("kalem", "melak"); // true
isAnagram("araba", "sokak"); // false
```

### 2:00–3:00 · Problem 3 (stretch) — Duplicate bulma + Big-O sohbeti
Bir dizide tekrar eden ilk elemanı bul (Set kullanarak O(n)):

```js
function firstDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return null;
}

firstDuplicate([2, 5, 3, 5, 1]); // 5
```

Big-O'yu kavramsal seviyede tekrar et — junior mülakatında matematiksel ispat istenmez, "bu çözüm neden O(n), diğeri neden O(n²)" diye 2 cümlede anlatabilmen yeterli:
> "O(n²) demek, veri iki katına çıkarsa işlem süresi dört katına çıkar — iç içe döngü var demektir. O(n) demek ise veriyle doğru orantılı büyür — genelde tek geçişte hashmap/set kullanınca elde edilir."

**Küçük zafer:** "DSA" kelimesi artık korkutmuyor — junior seviyede istenenin ne olduğunu gördün. **Çıktı:** 3 çözülmüş problem + Big-O'yu 2 cümlede açıklayabilme. **İşaret/Commit:** `hafta-15/dsa-pratik.js` dosyasına çözümleri kaydet, commit et.

---

## Gün 5 — Üst düzey sistem sohbeti

### 0:00–1:00 · Kendi mimarini anlat
Sık sorulan bir üst-düzey soru: "Bu projeyi nasıl kurdun?" Capstone'unu katman katman anlatma provası yap:

```
Frontend:  React ile SPA, state'i [useState/Context] ile yönettim,
           Vercel'e deploy ettim.
Backend:   Node.js/Express ile REST API, endpoint'ler [/api/sensors,
           /api/latest gibi], Railway'de host ediyorum.
Veritabanı: PostgreSQL, [tablo adları] şeması, Prisma ORM ile
           sorguluyorum.
Donanım:   ESP32, sensör verisini seri/WiFi üzerinden API'ye POST
           ediyor, X saniyede bir.
Bağlantı:  Frontend, WebSocket ile backend'e bağlı, yeni veri geldiğinde
           anlık güncelleniyor (polling değil push).
```

Bunu tahtaya çizer gibi (kutu-ok diyagramı zihninde) anlatabilmelisin — mülakatçı çoğu zaman kağıt/tahta istiyor, hazırlıklı ol.

### 1:00–2:00 · "Nasıl büyütürsün" sorusuna cevap
Junior seviyede derin sistem tasarımı beklenmez ama kavramsal farkındalık beklenir. Örnek soru: "1000 kullanıcı olsa bu sistem ne yapardı, sen ne değiştirirdin?"

Örnek cevap iskeleti (junior için yeterli derinlik):
> "Şu an tek sunucu ve tek veritabanı var, 1000 kullanıcıda muhtemelen darboğaz veritabanı sorgularında olur. İlk yapacağım şey sık sorgulanan alanlara **index** eklemek olurdu. Sonra sık istenen ama az değişen veriyi (örn. son 24 saatlik özet) **cache**'lemeyi düşünürdüm — Redis gibi. Backend'i yatayda ölçeklemek (birden fazla instance) bir sonraki adım olurdu, ama önce darboğazın gerçekten nerede olduğunu ölçmeden büyütmezdim."

💡 Not: "Ölçmeden optimize etme" cümlesi mülakatta iyi bir izlenim bırakır — junior'ların çoğu direkt "microservice'e geçerdim" gibi abartılı cevaplar verir, sen ölçülü ve gerçekçi kal.

### 2:00–3:00 · Roy ile sözlü pratik
Roy'a mimarini ve büyütme senaryosunu sözlü anlat, takip sorularıyla derinleştirmesini iste ("Peki cache'lediğin veri bayatlarsa ne olur?" gibi). Amaç: "bilmiyorum ama şöyle düşünürüm" diyebilme rahatlığı.

**Küçük zafer:** Artık sadece "ne yaptım" değil "nasıl büyürdü/büyütülür" sorusuna da cevabın var. **Çıktı:** Yazılı mimari anlatımı + büyütme senaryosu + sözlü pratik. **İşaret/Commit:** `hafta-15/sistem-sohbeti.md` yaz, commit et.

---

## Gün 6 — Mock interview (Roy ile) + dürüst geri bildirim

### 0:00–1:00 · Davranışsal sorular + STAR hazırlığı
Teknik sorular kadar sık gelen "davranışsal" sorulara hazırlan. STAR yöntemi: **S**ituation (durum), **T**ask (görev), **A**ction (aksiyon), **R**esult (sonuç).

Sık sorulan 3 soru + hazırlık:
- "Zorlandığın bir teknik problemi anlat." → capstone'daki bağlantı kopması/heartbeat problemini STAR ile anlat.
- "Bir hatayı nasıl fark edip düzelttin?" → gerçek bir debug hikayesi seç, dürüst ol (mükemmel görünmeye çalışma, öğrenim vurgusu yap).
- "Neden fullstack/yazılım?" → kısa, samimi, klişeden uzak bir cevap hazırla.

Her biri için 3-4 cümlelik STAR cevabı yaz.

### 1:00–2:00 · Tam mock interview simülasyonu
Roy'a "gerçek bir junior fullstack mülakatı gibi davran, karışık sırayla (proje anlatımı, JS kavramı, DSA, davranışsal, sistem sohbeti) soru sor, ben cevaplayayım, sonuna kadar kesme" de. Bu turu tek seferde, durmadan, gerçek mülakat temposunda yap (30-40 dakika).

### 2:00–3:00 · Dürüst geri bildirim + not al
Simülasyon bitince Roy'dan dürüst, madde madde geri bildirim iste: "Hangi cevaplarım zayıftı, hangi konuda tekrar çalışmalıyım?" Bunu yazılı bir listeye dök (`hafta-15/mock-interview-notlari.md`), önceliklendir (kritik/orta). Kritik olanı bu hafta bitmeden bir kez daha çalış.

💡 Not: Kötü geri bildirim almak = zaman kaybı değil, en ucuz hazırlıktır. Gerçek mülakatta aynı hatayı yapmak çok daha pahalı.

**Küçük zafer:** İlk defa uçtan uca, kesintisiz bir mülakat simülasyonu tamamladın. **Çıktı:** Mock interview kaydı/notu + önceliklendirilmiş zayıf nokta listesi. **İşaret/Commit:** `hafta-15/mock-interview-notlari.md` commit et.

---

## Gün 7 — Pazar review/strateji

30 dakika Roy ile otur:
- 2 dakikalık proje anlatımını tekrar sesli yap — akıcı mı, geçen haftaya göre iyileşti mi?
- Zayıf kalan 1-2 JS kavramını veya DSA problemini tekrar sözlü anlat.
- Haftanın en zorlandığın anını konuş — bu bir zayıflık değil, nereye odaklanacağının işareti.

Sonraki haftaya köprü: 16. hafta artık pratikten aksiyona geçiyor — bu hafta hazırladığın her şey (proje anlatımı, terimler, DSA, sistem sohbeti) gerçek mülakatlarda kullanılacak. Başvurular zaten 10. haftadan beri devam ediyor; şimdi elindeki mülakat daveti gelirse hazırsın.

**Küçük zafer:** Bir hafta önce "mülakatta ne desem" kaygısı vardı, şimdi elinde provalı, test edilmiş bir cevap seti var. **Çıktı:** Haftalık özet + 16. haftaya (başvuru yoğunlaşması) hazır bir zihin. **İşaret/Commit:** `git commit -m "hafta-15: mülakat pratiği tamam — proje anlatımı, JS Q&A, DSA, sistem sohbeti, mock interview"`
