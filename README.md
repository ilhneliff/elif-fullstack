# Elif — Sıfırdan Fullstack 🧭

Neredeyse sıfırdan **fullstack developer**'a: 16 haftalık, gün-gün, kendi içinde öğreten bir sprint.
Web fullstack = iş motoru, embedded = fark yaratan hikaye (IoT capstone 🔌).

> **📋 Tam görsel yol haritası (şemalar + saat-saat plan + kod):**
> https://claude.ai/code/artifact/0970e838-de07-4f63-817c-c56a841b2d7e
>
> Bu repo senin **çalışma alanın ve takip merkezin**. Yukarıdaki link ne öğreneceğini,
> bu repo ise ne yaptığını tutar.

---

## Nasıl kullanılır (haftalık ritim)

```bash
# 1) Repoyu bir kez bilgisayarına çek
git clone https://github.com/ilhneliff/elif-fullstack.git
cd elif-fullstack

# 2) O haftanın klasöründe çalış (örn. hafta-01)
#    Her gün, o günün görevini yap.

# 3) Her günün sonunda ilerlemeni kaydet
git add .
git commit -m "hafta-01 g4: değişkenler + ilk js"
git push
```

- **Her gün** en az bir commit → "yeşil kareler" birikir (motivasyon + işverene kanıt).
- **Her pazar** Roy ile 30 dk review: teach-back + sıradaki hafta saat-saat açılır.
- **Takılınca 20 dk kuralı:** 20 dk kendin dene, sonra Roy'a/Ertan'a sor.

## Repo yapısı

```
elif-fullstack/
├── README.md            ← buradasın: kullanım + özet
├── yol-haritasi.html    ← görsel harita (tarayıcıda aç, offline çalışır)
├── CLAUDE.md            ← bilgisayarındaki Claude'u koça çevirir
├── hafta-01/
│   └── README.md        ← o haftanın gün-gün, saat-saat detayı + kod
├── hafta-02/ ... hafta-16/   ← aynı şekilde her hafta
└── projeler/            ← büyük projeler (React app, IoT dashboard...)
```

**Her `hafta-XX/README.md` o haftanın tam planı** — saat-saat bloklar, kavram anlatımı ve gerçek kod içinde. Dışarı "araştır" diye göndermez; ders dosyanın içinde.

## 16 haftalık harita (özet)

| Hafta | Faz | Tema | Çıktı |
|---|---|---|---|
| 1 | 0 | Temel + JS sıfırdan | GitHub profili + ilk program |
| 2 | 1 | HTML/CSS/DOM | 🌐 ilk canlı site |
| 3–4 | 1 | Modern JS + fetch, JS projesi | 2–3 canlı statik site |
| 5–7 | 2 | React + TypeScript | 🌐 canlı React app |
| 8–10 | 3 | Backend + Veritabanı | ✔ ilk fullstack app |
| 11–13 | 4 🔌 | IoT capstone (ESP32 → API → pano) | ✔ portföy yıldızı |
| 14–16 | 5 | Portföy, mülakat, başvuru | ✔ başvuruya hazır aday |

**Stack:** JavaScript → TypeScript · React · Node/Express · PostgreSQL/Prisma · Vercel/Railway · ESP32 (embedded)

## Bilgisayarında Claude (koç)

Bu repoda bir `CLAUDE.md` var. **Claude Code'u bu klasörde açtığında**, Claude senin kişisel kodlama koçun olur: hangi haftada olduğunu bilir, cevabı doğrudan vermez (öğretir), Türkçe konuşur, takıldığında adım adım götürür. Takıldığın an hata mesajını yapıştır, birlikte çözersiniz.

## Kaybolmama kuralları

1. **Tek ray: plan.** Kavramlar planın içinde — "şunu da araştır" diye dağılma.
2. **Günlük çıktı.** Her gün "bitmiş" bir şey olsun, küçük bile olsa.
3. **%70 kod, %30 izle.** İzlerken bile klavye elinde.
4. **20 dakika kuralı.** Ne saatlerce boğul, ne 2 dakikada pes et.
5. **Cuma commit.** Her hafta görünür ilerleme.
6. **Teach-back.** Anlatamıyorsan öğrenmemişsin.

---

*Elif için Ertan & Roy tarafından hazırlandı · yaşayan doküman — her pazar güncellenir.*
*"Durmak yok, küçük de olsa her gün ileri."*
