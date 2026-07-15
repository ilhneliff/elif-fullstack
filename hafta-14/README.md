# Hafta 14 — Portföy & CV (Faz 5)
> **Hedef:** Elindeki 4 canlı projeyi (+ capstone) inandırıcı, sade bir vitrine dönüştürmek — "ben şunları yaptım" değil, "işte yaptıklarım, işte kanıtı".
> **Çıktı:** ✔ canlı portföy sitesi + GitHub'ı temiz + LinkedIn güncel + 1 sayfa ATS-dostu CV (TR + EN)
> ~3 sa/gün · Başvurular paralel devam ediyor — bu hafta vitrini cilalıyorsun, başvuruyu durdurmuyorsun.

## Gün 1 — Portföy sitesi: iskelet ve tasarım

### 0:00–1:00 · Kurulum ve karar
Bugün kod yazmaya değil karar vermeye başlıyorsun: portföyün TEK SAYFA olacak (scroll ile gezilen), route'lara bölünmeyecek. Sebep: işe alım uzmanı sitende 30-45 saniye geçiriyor, gezinmeye değil görmeye ihtiyacı var.

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install
```

Sayfa iskeletini kur — 4 bölüm, başka bir şey yok:
1. **Hero** — adın, unvanın, 1 cümlelik "ne yaparsın", CTA (CV indir + iletişim)
2. **Projeler** — 3-4 kart (capstone en üstte/en büyük)
3. **Hakkımda** — kısa, 3-4 cümle, "neden fullstack" hikayesi
4. **İletişim** — email, LinkedIn, GitHub linkleri

💡 Not: Bu hafta güzelleştirmeye (animasyon, gradient, vs.) zaman harcama. Sade > gösterişli. İşe alım uzmanı hız ve netlik arar, "wow" değil.

### 1:00–2:00 · Proje kartı bileşeni
Tek bir `ProjectCard` bileşeni yaz, 4 projede de aynısını kullan:

```jsx
function ProjectCard({ title, tagline, stack, liveUrl, repoUrl, image }) {
  return (
    <article className="project-card">
      <img src={image} alt={`${title} ekran görüntüsü`} />
      <h3>{title}</h3>
      <p className="tagline">{tagline}</p>
      <ul className="stack">
        {stack.map((tech) => <li key={tech}>{tech}</li>)}
      </ul>
      <div className="links">
        <a href={liveUrl} target="_blank" rel="noreferrer">Canlı Demo →</a>
        <a href={repoUrl} target="_blank" rel="noreferrer">GitHub →</a>
      </div>
    </article>
  );
}
```

Şimdilik placeholder içerikle 4 kartı sayfaya diz (gerçek metinler yarın). Grid ile düzenle (`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`) — mobilde otomatik tek sütuna düşer.

### 2:00–3:00 · İlk deploy
Boş/placeholder haliyle bile bugün deploy et — "sonra deploy ederim" deme, alışkanlık ilk günden kurulsun.

```bash
git init && git add . && git commit -m "portfolio: iskelet"
git remote add origin <github-repo-url>
git push -u origin main
```

Vercel'e bağla (dashboard → New Project → repo seç → Deploy). 2 dakikada canlıdır. URL'i not al, hafta boyu her gün buraya push edeceksin.

💡 Not: Domain almana gerek yok, `.vercel.app` uzantısı junior başvurusu için fazlasıyla yeterli. Bütçeyi/zamanı domaine harcama.

**Küçük zafer:** Boş de olsa portföyün artık canlı bir URL'de. **Çıktı:** Deploy edilmiş 4 bölümlü iskelet site. **İşaret/Commit:** `git commit -m "portfolio: iskelet + proje kartı bileşeni + ilk deploy"`

---

## Gün 2 — Her proje anlatısı: problem → çözüm → stack

### 0:00–1:00 · Anlatı şablonu + capstone metni
Her proje kartı 4 parçadan oluşacak. Şablon:

```
[PROBLEM] — 1-2 cümle, kim/ne için, neden önemli
[ÇÖZÜM]   — 1-2 cümle, ne yaptın (özellik değil sonuç odaklı)
[STACK]   — 4-6 etiket, en önemliden başla
[SONUÇ]   — 1 cümle, ölçülebilirse sayı ver ("gerçek zamanlı", "3 saniyede güncelleniyor")
```

Capstone (ESP32 → API → canlı pano) için örnek dolu metin:

> **Problem:** Oda sıcaklığını takip etmek istiyordum ama tüm "akıllı ev" çözümleri ya pahalıydı ya da kapalı kutu (veriye erişemiyordum).
> **Çözüm:** ESP32 üzerinde sıcaklık/nem sensörünü okuyup kendi Node.js API'ime gönderen, veriyi PostgreSQL'e yazan ve canlı bir React panosunda gösteren uçtan uca bir sistem kurdum.
> **Stack:** ESP32 (C++) · Node.js/Express · PostgreSQL · React · WebSocket · Railway
> **Sonuç:** Sensör verisi 2 saniye içinde panoya düşüyor, geçmiş veriyi grafikte görebiliyorum.

💡 Not: "Kullandım", "öğrendim", "denedim" gibi pasif fiillerden kaçın. "Kurdum", "yazdım", "çözdüm" gibi aktif fiiller kullan — kendi işin olduğunu hissettirsin.

### 1:00–2:00 · Diğer 2-3 proje için anlatı yaz
Aynı şablonu diğer projelerine uygula. Elinde en az 3-4 canlı proje var (haftalar 2-10 arası). Her biri için 4 satırlık metni bir not dosyasına (örn. `PROJECTS.md`) yaz, sonra siteye taşıyacaksın.

Zorlanırsan şu soruları kendine sor:
- Bu projeyi neden yaptım, hangi ihtiyaçtan doğdu? (gerçek olmasa bile öğrenme motivasyonun neydi?)
- Karşılaştığım en zor teknik problem neydi, nasıl çözdüm?
- Bugün tekrar yapsam neyi farklı yapardım? (bu soru mülakatta da sorulacak, şimdiden düşün)

### 2:00–3:00 · Kartları gerçek içerikle doldur, deploy et
Placeholder metinleri gerçek anlatılarla değiştir, ekran görüntülerini ekle (her projenin canlı halinden gerçek screenshot al — placeholder image kalmasın). Deploy et.

💡 Not: Ekran görüntüsü çekerken tarayıcı penceresini temiz tut (bookmark bar kapalı, gereksiz sekme yok) — detay küçük ama fark yaratır.

**Küçük zafer:** 4 proje artık "ne yaptım" değil "neden ve nasıl yaptım" anlatıyor. **Çıktı:** İçerik dolu, gerçek screenshot'lı proje kartları, canlıda. **İşaret/Commit:** `git commit -m "portfolio: proje anlatıları (problem/çözüm/stack/sonuç) + gerçek görseller"`

---

## Gün 3 — GitHub temizlik: README'ler, pinned repos, profil README

### 0:00–1:00 · Proje README şablonu
İşe alım uzmanı (ve daha çok mühendis) portföy sitesinden sonra GitHub'a bakar. Dağınık repo = güven kaybı. Her proje reposu için bu şablonu kullan:

```markdown
# Proje Adı

Tek cümlelik açıklama.

![screenshot](./screenshot.png)

## Ne yapar
2-3 cümle.

## Neden yaptım
1-2 cümle (motivasyon/problem).

## Stack
- Frontend: ...
- Backend: ...
- DB: ...
- Deploy: ...

## Kurulum
\`\`\`bash
git clone ...
npm install
npm run dev
\`\`\`

## Öğrendiklerim
- Madde madde 2-3 gerçek teknik öğrenim (yüzeysel değil, spesifik).

## Canlı
🔗 [Demo](url) · 🔗 [Repo](url)
```

### 1:00–2:00 · Her repoyu güncelle
4 ana projenin (+ varsa küçük egzersiz repoları) README'sini bu şablonla yaz. En çok zamanı capstone'a ayır — o senin "en güçlü kanıtın".

💡 Not: "Öğrendiklerim" bölümünü boş klişelerle doldurma ("çok şey öğrendim" gibi). Spesifik ol: "WebSocket ile gerçek zamanlı veri akışını ilk kez kurdum, reconnect mantığını kendim yazdım" gibi somut cümleler kullan.

### 2:00–3:00 · Pinned repos + profil README
GitHub profilinde en fazla **6 repo pinlenebilir** — seçim kriterin: en iyi 4-6 proje, en eski/yarım kalan denemeler değil. Profilin → Customize your pins → seç.

Profil README'i (`<kullaniciadi>/<kullaniciadi>` adında repo açarsan otomatik profilde görünür) için kısa şablon:

```markdown
### Merhaba, ben Elif 👋

Fullstack developer (React · Node.js · PostgreSQL). Bilgisayar mühendisliği
kökenimi web + embedded (ESP32/IoT) projeleriyle birleştiriyorum.

🔭 Şu an: iş arıyorum — junior fullstack / entry-level pozisyonlar
🌱 Öğreniyorum: [varsa bir sonraki hedef]
💬 Sorularınız için: [email/linkedin]
📌 Öne çıkan proje: [capstone linki]
```

**Küçük zafer:** GitHub artık gelişigüzel bir arşiv değil, düzenli bir vitrin. **Çıktı:** 4-6 repo temiz README'li, pinned, profil README yayında. **İşaret/Commit:** her repoda ayrı commit, örn. `git commit -m "docs: README şablonu ile yenilendi"`

---

## Gün 4 — LinkedIn: başlık, hakkında, ağ kurma

### 0:00–1:00 · Fotoğraf, banner, başlık
LinkedIn'de ilk 3 saniyede karar veriliyor — fotoğraf + başlık. Fotoğraf: yüzün net görünen, sade arka planlı bir kare (profesyonel ama samimi, stüdyo fotoğrafı şart değil).

Başlık (headline) — unvan + 3 anahtar teknoloji, İK'nın arama filtresine düşmen için kritik:

> `Junior Fullstack Developer | React · Node.js · PostgreSQL | Portfolio: [link]`

veya biraz daha kişisel:

> `Fullstack Developer (Junior) — React/Node/PostgreSQL | Bilgisayar Mühendisi → Web + IoT`

💡 Not: "Aspiring developer" veya "öğrenmekte" gibi ifadelerden kaçın — bunlar seni gerçek adaydan uzaklaştırır. Sen artık kod yazan, deploy eden birisin; başlık bunu net söylesin.

### 1:00–2:00 · Hakkında (About) + Featured + Deneyim
**Hakkında** bölümü için örnek metin (3 paragraf, birinci ağızdan):

> Bilgisayar mühendisliği kökenli bir fullstack developer'ım. 13 haftalık yoğun bir sprint'te React, Node.js ve PostgreSQL ile uçtan uca web uygulamaları geliştirmeyi öğrendim; capstone projemde bir ESP32 mikrodenetleyicisini kendi yazdığım API'ye bağlayıp canlı bir React panosunda gösterdim.
>
> Backend'de veri modelleme ve API tasarımından, frontend'de kullanıcı deneyimine kadar tüm katmanlarla çalışmaktan keyif alıyorum. Şu an junior/entry-level fullstack pozisyonları arıyorum.
>
> Projelerim: [portfolio linki]. Konuşmak isterseniz mesaj atmaktan çekinmeyin.

**Featured** bölümüne portföy sitesi linkini ve capstone repo linkini ekle. **Deneyim** kısmına varsa stajları, yoksa "Bağımsız Proje / Self-taught Sprint" gibi bir satır aç, tarih aralığı + 2-3 madde (yaptıkların, CV'deki gibi).

### 2:00–3:00 · Ağ kurma başlangıcı
Bugün pasif profil değil, aktif ağ kurmaya başla. Hedef: 15-20 bağlantı isteği (hepsi rastgele değil, hedefli).

Kimlere gönder: mezun olduğun okuldan mezunlar (junior/senior developer), hedef şirketlerdeki mühendisler, aynı bootcamp/topluluk kökeninden insanlar.

Örnek bağlantı mesajı (kısa, gösterişsiz):

> Merhaba [İsim], ben Elif — bilgisayar mühendisiyim, fullstack geliştirmeye yoğunlaşıyorum. [Şirket/alan] ile ilgilendiğim için bağlantıda olmak isterim.

15-20 istek gönder, hepsine kişiselleştirilmiş not ekle (kopyala-yapıştır yapma, LinkedIn bunu fark eder ve etkisiz olur).

**Küçük zafer:** LinkedIn artık "öğrenci profili" değil, aranabilir bir aday profili. **Çıktı:** Güncel başlık/hakkında/featured + 15-20 hedefli bağlantı isteği gönderilmiş. **İşaret/Commit:** kod değil profil işi — not defterine "LinkedIn güncellendi + 18 bağlantı isteği" yaz.

---

## Gün 5 — CV: 1 sayfa, ATS-dostu, TR + EN

### 0:00–1:00 · İngilizce CV — Header, Summary, Skills
CV kuralları: **1 sayfa**, sade font (Arial/Calibri/Inter), PDF, dosya adı `Elif_Soyad_CV.pdf` (İK'nın masasında "CV.pdf" adında 40 dosya olmasın).

İskelet:

```
[AD SOYAD]
[Şehir, Ülke] · [email] · [telefon] · [LinkedIn] · [Portfolio URL] · [GitHub]

SUMMARY
Junior Fullstack Developer with a computer engineering background.
Built and deployed 4+ full-stack projects (React, Node.js, PostgreSQL) and
an end-to-end IoT capstone (ESP32 → API → live dashboard). Comfortable
across the stack, from database schema to UI polish.

SKILLS
Languages: JavaScript, TypeScript, C++ (embedded)
Frontend: React, HTML/CSS
Backend: Node.js, Express, REST APIs
Database: PostgreSQL, Prisma
Tools/Deploy: Git, Vercel, Railway, Docker (basic)
```

💡 Not: "Summary" bölümü ATS taramasında ve insan gözünde de ilk okunan kısım — burada zayıf, genel ifadeler ("hardworking", "team player") kullanma, somut şeyler yaz: kaç proje, hangi stack, ne inşa ettin.

### 1:00–2:00 · Projects + Education, ATS kontrolü
**Projects** bölümü CV'nin en güçlü kısmı olacak (deneyimin az olduğu için). Her proje için 1 satır başlık + 2-3 madde, madde başları **aksiyon fiili + ne yaptın + sonuç** formatında:

```
IoT Live Dashboard — React · Node.js · PostgreSQL · ESP32          [link]
• Built an end-to-end pipeline streaming live sensor data from an
  ESP32 microcontroller to a PostgreSQL-backed API and React dashboard.
• Implemented WebSocket-based real-time updates with automatic
  reconnect handling.
• Designed and deployed the full stack independently (Railway + Vercel).
```

**Education**: üniversite, bölüm, yıl. Varsa ilgili dersler (Data Structures, Databases) 1 satır ekle.

**ATS kontrolü**: hedeflediğin 2-3 ilanı aç, iş tanımındaki tekrar eden kelimeleri (React, REST API, Agile, PostgreSQL vb.) not al, CV'nde geçtiğinden emin ol — ATS sistemleri anahtar kelime eşleşmesine bakar, yaratıcı eş anlamlılara değil.

### 2:00–3:00 · Türkçe versiyon + PDF export
Türkçe CV aynı bilgiyle, birebir çeviri değil — Türkçe İK diline uyarlanmış olsun ("Summary" → "Özet", "Skills" → "Yetenekler" vb., cümle yapıları Türkçe'ye doğal gelsin).

İki dosya olarak dışa aktar:
- `Elif_Yilmaz_CV_EN.pdf`
- `Elif_Yilmaz_CV_TR.pdf`

💡 Not: Word/Google Docs'tan direkt PDF export et (Canva gibi görsel-ağırlıklı şablonlardan kaçın — çoğu ATS sistemi görsel/tablo düzenini okuyamaz, metnin karışır).

**Küçük zafer:** Artık her başvuruda "hangi CV'yi göndersem" tereddüdü yok — hazır, güçlü, iki dilde bir CV var. **Çıktı:** `Elif_Soyad_CV_EN.pdf` + `Elif_Soyad_CV_TR.pdf`, ATS kontrolünden geçmiş. **İşaret/Commit:** CV dosyalarını `projeler/` altına ya da ayrı bir `cv/` klasörüne koy, versiyon notu düş.

---

## Gün 6 — Yayınla + Ertan/Roy review

### 0:00–1:00 · Son kontrol checklist
Yayına almadan önce tara:

- [ ] Portföy sitesi mobilde düzgün görünüyor mu? (telefonundan aç, kontrol et)
- [ ] Tüm proje linkleri (canlı demo + repo) çalışıyor mu? (tek tek tıkla)
- [ ] Yazım hatası var mı? (yüksek sesle oku — göz atlar, kulak yakalar)
- [ ] LinkedIn başlık/hakkında/featured güncel mi?
- [ ] CV'de (TR+EN) iletişim bilgileri doğru mu, linkler tıklanabilir mi?
- [ ] GitHub profil README + pinned repos son hali mi?

### 1:00–2:00 · Roy'a review isteği
Roy'a (veya Ertan'a) net, spesifik bir review isteği gönder — "bir bak" değil, şunu sor:

> "Portföy sitem hazır: [link]. CV'lerim ekte. 3 şey istiyorum: (1) ilk 10 saniyede net mi anlaşılıyor ne yaptığım, (2) proje anlatılarım abartısız ama etkileyici mi, (3) ATS/işe alım gözüyle CV'de eksik gördüğün var mı?"

Bu şekilde sormak genel "güzel olmuş" cevabı yerine somut, aksiyona dönüştürülebilir geri bildirim getirir.

### 2:00–3:00 · Geri bildirimle düzelt
Gelen geri bildirimi öncelik sırasına koy (kritik/orta/kozmetik), kritik olanları bugün düzelt, deploy et. Kozmetik olanları not al, zaman kalırsa hafta sonuna bırak.

💡 Not: Geri bildirimi savunmaya geçmeden dinle. "Ama ben şunu kastetmiştim" demek yerine "demek ki net iletememişim, nasıl daha net olur" diye düşün — bu, mülakat geri bildirimi alma pratiği de olacak (15. hafta).

**Küçük zafer:** Dışarıdan bir göz geçti, kör noktaların kapandı. **Çıktı:** Geri bildirime göre güncellenmiş, yayında bir portföy + CV seti. **İşaret/Commit:** `git commit -m "portfolio: review sonrası düzeltmeler (netlik + ATS)"`

---

## Gün 7 — Pazar review/strateji

30 dakika Roy ile otur, şunları teach-back yap (anlatamıyorsan not al, hafta içi eksik kalmış demektir):

- Portföy sitendeki her projeyi 30 saniyede anlat (problem/çözüm/stack/sonuç sırasıyla).
- CV'ndeki her madde için "bu neden orada" sorusuna cevap ver.
- LinkedIn'de bu hafta kaç bağlantı isteği attın, kaçı kabul edildi?

Sonraki haftaya köprü: 15. hafta mülakat pratiği. Bu hafta yazdığın proje anlatıları ("problem → çözüm → stack → sonuç") aynen 2 dakikalık ve 10 dakikalık mülakat anlatımının iskeleti olacak — boşa gitmedi, üzerine inşa edeceksin.

**Küçük zafer:** Bir haftada "elimde bir şeyler var ama dağınık"tan "elimde vitrin var" durumuna geçtin. **Çıktı:** Haftalık özet + 15. haftaya hazır zihin. **İşaret/Commit:** `git commit -m "hafta-14: portföy + CV + LinkedIn tamam, review yapıldı"`
