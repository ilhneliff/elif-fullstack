# Hafta 1 — Temel & Zihin Haritası (Faz 0)
> **Hedef:** Bilgisayarının ve internetin nasıl çalıştığını kavramak; terminal, Git ve GitHub ile rahat çalışabilmek; JavaScript'in temel yapı taşlarını (değişken, tip, mantık, döngü, fonksiyon, dizi, nesne) öğrenip kendi konsol programını yazmak.
> **Çıktı:** ✔ Canlı GitHub profili + ilk konsol programı
> ~3 sa/gün · Takılınca 20 dk kuralı: 20 dakika tek başına uğraş, çözemezsen notunu al ve devam et, akşam ya da Claude ile birlikte dön.
> Her gün sonunda commit + push.

---

## Gün 1 — Zihin Haritası + Terminal + VS Code

### 0:00–0:30 · Fullstack nedir? Büyük resim
Bir web uygulaması aslında iki bilgisayarın konuşmasıdır: **senin tarayıcın** ve **başka bir yerdeki sunucu**. "Fullstack developer" ikisini de yazabilen kişidir.

```
[SEN — Tarayıcı]   <---- istek/yanıt ---->   [SUNUCU — başka bir bilgisayar]
     FRONTEND                                        BACKEND
```

- **Frontend (FE):** Kullanıcının gördüğü, tıkladığı, ekranda duran her şey.
- **Backend (BE):** Kullanıcının göremediği, arka planda çalışan kısım — veri, hesaplama, güvenlik.
- **Fullstack:** İkisini birden yapabilen kişi. Bu 16 haftanın hedefi tam olarak bu.

💡 Şimdilik ezberlemene gerek yok, sadece "iki taraf var" fikrini kafanda tut. İlerleyen haftalarda her ikisini de gerçek kodla göreceksin.

### 0:30–1:00 · Frontend vs Backend: "Görüyorsan FE, göremiyorsan BE"
Basit kural: **Ekranda görüp dokunabiliyorsan → Frontend. Perde arkasında, gözle görünmeyen bir yerde oluyorsa → Backend.**

| Örnek | FE mi BE mi? | Neden |
|---|---|---|
| Butonun rengi mor | Frontend | Gözle görülüyor |
| Şifrenin doğru olup olmadığının kontrolü | Backend | Sunucuda, gizli şekilde oluyor |
| "Yükleniyor..." animasyonu | Frontend | Ekranda oynayan bir şey |
| Verilerin veritabanında saklanması | Backend | Hiçbir zaman göremezsin, ama oradadır |
| Sayfanın telefon ekranına sığması | Frontend | Görsel düzenleme |
| E-posta gönderme işlemi | Backend | Arka planda tetiklenir, sonucu görürsün ama işleyişi görmezsin |

Bir sonraki sefer bir uygulama kullanırken kendine sor: *"Bunu görüyor muyum, yoksa sadece sonucunu mu görüyorum?"* Cevap sana FE mi BE mi olduğunu söyler.

### 1:00–2:00 · Terminal temelleri
Terminal, bilgisayarınla fare yerine **yazarak** konuştuğun bir pencere. İlk başta garip gelir ama bir programcının en hızlı aracıdır — tıklamak yerine yazarsın, çok daha hızlıdır.

Mac'te **Terminal** uygulamasını aç (Spotlight: Cmd+Space, "Terminal" yaz, Enter). Şimdi şu komutları sırayla, tek tek dene:

```bash
pwd              # "print working directory" — şu an hangi klasördeyim?
ls                # "list" — bu klasörde neler var, listele
cd ~              # "change directory" — ana klasörüne (home) git
pwd               # kontrol et: /Users/senin-adin gibi bir şey görmelisin
mkdir kod         # "make directory" — "kod" adında yeni bir klasör oluştur
cd kod            # o klasörün içine gir
pwd               # kontrol: /Users/senin-adin/kod
touch merhaba.txt # boş bir dosya oluştur
ls                # merhaba.txt görünmeli
```

💡 Klasör = bilgisayarındaki bir çekmece. `cd` = "çekmeceyi aç ve içine gir". `cd ..` yazarsan bir üst çekmeceye (üst klasöre) çıkarsın — bunu da dene.

Bundan sonraki 16 hafta boyunca **her şeyi `~/kod` klasörünün içinde** yapacaksın. Bugünden itibaren bu senin "atölyen".

### 2:00–2:45 · VS Code kurulumu ve tanıma
VS Code, kod yazmak için tasarlanmış özel bir metin editörü (kelime işlemcinin kodcu versiyonu gibi düşün).

**Kurulum:**
1. `code.visualstudio.com` adresinden Mac (Apple Silicon veya Intel, kendi Mac'ine uygun olanı) sürümünü indir.
2. İndirilen `.zip` dosyasını aç, `Visual Studio Code.app`'i **Applications** klasörüne sürükle.
3. Uygulamayı aç.

**Arayüzü tanı:**
- Sol taraf → **Explorer**: açık klasördeki dosya/klasör ağacı.
- Orta → **Editör**: kodun burada yazılır.
- Alt kısım → **Terminal**: Terminal.app'e gitmene gerek kalmadan, tam burada terminal komutu çalıştırabilirsin.

Terminalden `~/kod` klasörünü VS Code'da açmayı öğren:

```bash
cd ~/kod
code .    # "code" komutu VS Code'u, "." ise "şu an bulunduğum klasör" demek
```

Eğer `code .` "command not found" hatası verirse: VS Code içinde **Cmd+Shift+P** tuşlarına bas, açılan kutuya `Shell Command` yaz, **"Shell Command: Install 'code' command in PATH"** seçeneğine tıkla. Terminali kapatıp yeniden aç, tekrar dene.

💡 **Ctrl+`** (Control + backtick, tire tuşunun solundaki tuş) VS Code içindeki terminali açıp kapatır. Artık iki ayrı pencere arasında geçiş yapmana gerek yok — hepsi tek yerde.

### 2:45–3:00 · Pekiştirme alıştırması
Sadece bugün öğrendiğin 5 komutla (pwd, ls, cd, mkdir, touch) şunu yap — VS Code'un içindeki terminalden dene:

```bash
cd ~/kod
mkdir pratik            # "pratik" adında yeni klasör
touch pratik/gunluk.txt # içine bir dosya
pwd                     # neredesin, kontrol et
cd pratik
ls                      # gunluk.txt burada mı?
cd ..                   # bir üst klasöre çık
ls                      # pratik klasörünü görüyor musun?
```

Hepsi çalıştıysa, terminal artık senin dostun.

**Küçük zafer:** Artık fareye dokunmadan bilgisayarında dolaşabiliyorsun — bu her programcının kazandığı ilk süper güç.
**Terim defteri:** `terminal` — yazarak komut verdiğin pencere, `dizin (klasör)` — dosyaların tutulduğu yer, `komut satırı` — terminale yazdığın her satır, `IDE/editör` — kod yazmak için özel program (VS Code), `frontend/backend` — gördüğün/görmediğin taraf.
**Çıktı:** ✔ `~/kod` klasörü oluşturuldu, VS Code kuruldu, terminal ile bağlandı (`code .` çalışıyor).
**Commit:** Bugün git henüz yok — bu yarın geliyor. `~/kod` klasörünü olduğu gibi bırak, yarın (Gün 2) içeriğini git'e ilk kez tanıtacaksın.

---

## Gün 2 — Git + GitHub: kodunu kaybetmeme sanatı

### 0:00–0:20 · Git nedir? Kurulum + config
Git, kodunun **geçmişli kaydet tuşu**. Normal "Kaydet" (Cmd+S) dosyanın son halini tutar, öncekini siler. Git ise her kaydı (commit) ayrı ayrı saklar — istediğin ana geri dönebilirsin, kim ne zaman ne değiştirdi görebilirsin.

```
dosya v1 --commit--> dosya v2 --commit--> dosya v3 --commit--> dosya v4
   (kayıp değil, hepsi geçmişte duruyor, istediğine dönebilirsin)
```

Kurulu mu kontrol et:

```bash
git --version
```

Kurulu değilse Mac ilk `git` komutunda otomatik olarak "Command Line Tools kurulsun mu?" diye soracak — "Install" de, birkaç dakika sürer.

Git'e kim olduğunu söyle (her commit'inde bu bilgi görünecek):

```bash
git config --global user.name "Elif"
git config --global user.email "senin-email-adresin@example.com"
```

💡 `--global` demek "bu bilgisayardaki tüm projelerde geçerli olsun" demek — her repo için tekrar girmene gerek yok.

### 0:20–0:45 · Mini pratik: git init/add/commit nasıl çalışır
Gerçek ders deposuna dokunmadan önce, git'in üç temel komutunu (init, add, commit) boş bir deneme klasöründe gör:

```bash
cd ~/kod
mkdir git-pratik && cd git-pratik
git init                       # bu klasörü bir git deposuna çevirir (gizli .git klasörü oluşur)
git status                     # "henüz commit yok" der — normal, daha yeni başladık

touch deneme.txt               # boş bir dosya oluştur
git status                     # deneme.txt kırmızı/"untracked" görünür — git onu henüz izlemiyor

git add deneme.txt             # dosyayı "sahne"ye (staging) al
git status                     # şimdi yeşil/"to be committed" görünür

git commit -m "ilk commitim"   # kalıcı bir kayıt (snapshot) oluştur
git log                        # commit geçmişini gör
```

💡 `.git` gizli klasörü tüm geçmişin saklandığı yer. `git status`'u her adımda çalıştırıp rengin/mesajın nasıl değiştiğine dikkat et — bu, git'i anlamanın en hızlı yolu.

### 0:45–1:15 · GitHub hesabı
GitHub, git depolarının internette barındığı yer — kodun hem yedeklenir hem de dünyaya açık (ya da özel) hale gelir.

1. `github.com` adresine git, sağ üstten **Sign up**.
2. Kullanıcı adını dikkatli seç — bunu sonra değiştirmek zahmetli, ve az sonra profilinde de kullanacaksın.
3. E-postanı doğrula.

Bu kursun deposu senin için zaten hazırlanmış durumda: **`github.com/ilhneliff/elif-fullstack`**. Bu senin hesabın değilse ya da erişimin yoksa, davet linki için sor.

### 1:15–1:45 · Gerçek ders deposunu klonlama
Şimdi önemli bir kavram: `git init` bir klasörü **sıfırdan** git deposuna çevirir. Ama bizim ders deposu **GitHub'da zaten var** — sıfırdan başlamaya gerek yok, sadece **indirmemiz** gerekiyor. Buna **clone** denir.

```bash
cd ~/kod
git clone https://github.com/ilhneliff/elif-fullstack.git
cd elif-fullstack
ls              # hafta-01, hafta-02 ... hafta-16, README.md, CLAUDE.md görmelisin
```

💡 `clone` = "git init + GitHub bağlantısını (remote) kurma" işleminin ikisini birden, tek komutla yapar. Bu yüzden `git init` burada gerekmiyor — clone zaten senin için yaptı.

### 1:45–2:25 · İlk gerçek commit + push
`hafta-01` klasörüne bugünün küçük bir notunu ekleyip GitHub'a gönderelim:

```bash
cd ~/kod/elif-fullstack/hafta-01
touch notlarim.md
code .          # VS Code'da aç, notlarim.md'ye 2-3 satır "bugün öğrendiklerim" yaz, kaydet (Cmd+S)

cd ~/kod/elif-fullstack
git add hafta-01/notlarim.md
git commit -m "hafta-01 g2: git kurulumu + ilk commit + GitHub bağlantısı"
git push
```

💡 Üç farklı komut, üç farklı görev: `add` = "bunu bir sonraki kayda dahil et", `commit` = "kaydı kalıcı yap (ama hâlâ sadece SENİN bilgisayarında)", `push` = "bu kayıtları GitHub'a (uzak depoya) gönder". Push etmezsen commit'in sadece senin bilgisayarında kalır, kimse göremez.

Eğer `git push` sana kullanıcı adı/şifre sorarsa: şifre yerine artık bir **Personal Access Token (PAT)** gerekiyor (GitHub 2021'den beri normal şifreyle push'a izin vermiyor).
1. GitHub → sağ üst profil fotoğrafı → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.
2. `repo` kutusunu işaretle, bir süre seç (örn. 90 gün), **Generate token**.
3. Görünen token'ı hemen kopyala (bir daha gösterilmez!) — push isteyince şifre yerine bunu yapıştır.

💡 macOS bunu bir kere Keychain'e kaydeder, her seferinde tekrar girmen gerekmez.

### 2:25–3:00 · GitHub profil README'si
GitHub'da kullanıcı adınla **birebir aynı isimde** bir repo oluşturursan, GitHub bunu profilinin en üstünde özel bir tanıtım alanı olarak gösterir.

1. GitHub'da sağ üstteki **+** → **New repository**.
2. Repository name: kullanıcı adınla birebir aynı yaz (örn. kullanıcı adın `ilhneliff` ise repo adı da `ilhneliff`).
3. **Public** seçili kalsın.
4. **Add a README file** kutusunu işaretle.
5. **Create repository**.

Şimdi README'yi düzenle: dosyanın yanındaki kalem ✏️ ikonuna tıkla, içeriği sil, kendi tanıtımını yaz:

```markdown
# Merhaba, ben Elif 👋

Bilgisayar mühendisiyim, şu an sıfırdan **fullstack web developer** olmaya çalışıyorum.

## Şu an öğrendiklerim
- 🌱 JavaScript temelleri
- 🔧 Git & GitHub
- 🌐 HTTP ve web'in nasıl çalıştığı

## Yol haritam
16 haftalık bir plan izliyorum: JavaScript → React → Node/Express → PostgreSQL → embedded (ESP32).

📫 Bana ulaşmak için: (email adresin)
```

Sağ altta **Commit changes...** → **Commit changes** (yeşil buton) — bu, GitHub'ın web arayüzü üzerinden yaptığın bir commit, terminale hiç gerek kalmadı.

**Küçük zafer:** İlk kez bir değişikliği git ile kalıcı hale getirdin ve GitHub'a gönderdin — artık kodun internette, bilgisayarın bozulsa bile kaybolmaz.
**Terim defteri:** `repository (repo/depo)` — bir projenin git ile takip edilen klasörü, `clone` — GitHub'daki bir depoyu bilgisayarına indirme, `commit` — kalıcı bir kayıt/anlık görüntü, `staging (git add)` — bir sonraki kayda dahil edilecekleri işaretleme, `push` — kayıtları GitHub'a (uzak depoya) gönderme.
**Çıktı:** ✔ `elif-fullstack` reposu bilgisayarında + ilk commit'in GitHub'da + profil README'n yayında (`github.com/kullanici-adin`).
**Commit:**
```bash
git add hafta-01/notlarim.md
git commit -m "hafta-01 g2: git kurulumu + ilk commit + GitHub bağlantısı"
git push
```

---

## Gün 3 — İnternet & HTTP: bir sayfa nasıl yüklenir?

### 0:00–0:30 · İnternet nasıl çalışır?
Dün "client/server" dedik — bugün aralarında ne konuştuklarını göreceğiz. Bu konuşmanın dili **HTTP** (HyperText Transfer Protocol).

```
   TARAYICI (client)                          SUNUCU (server)
        |                                            |
        |---- İSTEK (Request) --------------------->|
        |     "GET /index.html ver bana"             |
        |                                            |
        |<--- YANIT (Response) ---------------------|
        |     "200 OK, buyur işte HTML'in"           |
```

Her sayfa yüklemesi, her buton tıklaması bu döngünün bir tekrarıdır: **istek gönder, yanıt bekle, yanıtı işle.**

### 0:30–1:00 · HTTP metodları: GET/POST/PUT/DELETE
Sunucuya "ne istediğini" söylemenin dört temel yolu var — bir restoranı düşün:

| Metod | Ne yapar | Restoran benzetmesi |
|---|---|---|
| **GET** | Veri iste, oku (bir şey değiştirmez) | Menüyü oku |
| **POST** | Yeni veri gönder/oluştur | Sipariş ver |
| **PUT** | Var olan veriyi güncelle | Siparişini değiştir |
| **DELETE** | Veri sil | Siparişi iptal et |

Bir web sayfası açtığında tarayıcı otomatik olarak **GET** isteği atar. Bir formu doldurup "Gönder" dediğinde genelde **POST** atılır.

### 1:00–1:30 · Status kodları
Sunucu yanıt verirken bir **status code** (durum kodu) da gönderir — "işlem nasıl gitti" özetidir:

| Kod | Anlamı | Günlük hayat benzetmesi |
|---|---|---|
| **200 OK** | Her şey yolunda | "Buyurun, istediğiniz burada" |
| **404 Not Found** | Aradığın yok | "Böyle bir sayfa/kaynak yok" |
| **500 Internal Server Error** | Sunucuda bir hata var | "Mutfakta bir şeyler ters gitti" |
| 301/302 | Yönlendirme | "O adres taşındı, şuraya git" |
| 401/403 | Yetkin yok | "Buraya giremezsin" |

💡 "2 ile başlıyorsa iyi, 4 ile başlıyorsa senin hatan (yanlış istek), 5 ile başlıyorsa sunucunun hatası" — kaba ama işe yarayan bir hafıza kuralı.

### 1:30–2:15 · Tarayıcı DevTools → Network sekmesi (canlı gözlem)
Bugüne kadar anlattığımız her şeyi **canlı olarak görebilirsin**. Herhangi bir tarayıcıda (Chrome, Edge, Safari, Firefox) dene:

1. Bir web sitesi aç (örn. bir haber sitesi).
2. Sayfada sağ tık → **İncele (Inspect)**, ya da **F12** tuşuna bas.
3. Üstte açılan panelde **Network** (Ağ) sekmesine tıkla.
4. Sayfayı yenile (Cmd+R) — Network sekmesi isteklerle dolmaya başlar.
5. Listenin en üstündeki satıra (genelde ana HTML dosyası) tıkla.
6. Sağda açılan detayda **Headers** sekmesine bak: `Request URL`, `Request Method: GET`, `Status Code: 200` gibi bilgiler orada.
7. **Response** sekmesine geç — sunucunun sana gönderdiği ham HTML'i orada göreceksin.

💡 Bu, "sayfa nasıl yükleniyor" sorusunun cevabını dışarıda değil, tam önünde canlı gösteren bir araç. Şüphen olduğunda her zaman buraya bak.

### 2:15–2:45 · URL parçaları + DNS
Bir URL'nin her parçasının bir görevi var:

```
https://www.example.com:443/urunler/ayakkabi?renk=kirmizi#yorumlar
└─┬──┘   └──────┬───────┘ └┬┘ └──────┬───────┘└──────┬─────┘└──┬───┘
protokol       host       port     path            query    fragment
(nasıl         (kiminle    (hangi   (hangi          (ek        (sayfa
konuşulacak)   konuşulacak) kapı)   kaynak)         filtre)     içinde nereye)
```

Peki tarayıcı `www.example.com` yazısının hangi bilgisayar olduğunu nereden biliyor? **DNS (Domain Name System)** — internetin telefon rehberi. `google.com` gibi insanın hatırlayacağı bir ismi, bilgisayarların anladığı bir IP adresine (örn. `142.250.187.14`) çevirir.

```
sen: "google.com'a git"
     |
     v
  DNS sunucusu: "google.com = 142.250.187.14"
     |
     v
tarayıcı: 142.250.187.14 ile konuşmaya başlar
```

### 2:45–3:00 · Yazma alıştırması: "Bir sayfa nasıl yüklenir?"
`hafta-01/gun-3-notlar.md` dosyasını oluştur (`touch` + `code .`), aşağıdaki 5 noktayı **kendi cümlelerinle** anlatan kısa bir paragraf yaz:

1. Tarayıcıya bir URL yazıp Enter'a basınca ilk ne olur?
2. DNS'in görevi nedir?
3. Tarayıcı sunucuya ne gönderir?
4. Sunucu nasıl cevap verir?
5. Tarayıcı bu cevapla ne yapar?

Kopyala-yapıştır yapma — kendi kelimelerinle 5-6 cümle yeter. Bu, bugünün gerçek çıktısı.

**Küçük zafer:** Artık her web sayfasının arkasında bir istek-yanıt döngüsü olduğunu **görebiliyorsun** — DevTools'u açan herkes bunu göremez, ama sen artık ne aradığını biliyorsun.
**Terim defteri:** `HTTP` — tarayıcı ile sunucunun konuşma dili, `istek/yanıt (request/response)` — HTTP'nin temel döngüsü, `status code` — işlemin nasıl gittiğinin özeti, `DNS` — isim-IP çevirici, `URL` — bir kaynağın internet adresi.
**Çıktı:** ✔ `hafta-01/gun-3-notlar.md` içinde "sayfa nasıl yüklenir" paragrafı.
**Commit:**
```bash
git add hafta-01/gun-3-notlar.md
git commit -m "hafta-01 g3: HTTP notları ve sayfa yükleme paragrafı"
git push
```

---

## Gün 4 — JavaScript'i çalıştırmak: değişkenler ve tipler

### 0:00–0:20 · Node.js kurulumu
JavaScript normalde tarayıcıda çalışır, ama **Node.js** sayesinde tarayıcı olmadan, direkt terminalden çalıştırabilirsin. Bu haftadan itibaren kod yazıp anında terminalde sonucunu göreceksin.

`nodejs.org` adresinden **LTS** (en kararlı) sürümü indir, kur (sihirbazı takip et, hepsi "Next"). Kurulumu doğrula:

```bash
node -v      # örn. v20.11.0 gibi bir şey görmelisin
```

### 0:20–0:40 · İlk JS dosyası
```bash
cd ~/kod/elif-fullstack/hafta-01
touch gun-4-degiskenler.js
code .
```

`gun-4-degiskenler.js` dosyasına yaz:

```js
console.log("Merhaba, ben kod yazıyorum!");
```

Terminalden çalıştır:

```bash
node gun-4-degiskenler.js
# çıktı: Merhaba, ben kod yazıyorum!
```

💡 `console.log(...)` = "bunu ekrana yazdır" demek. Bu haftadan sonra en çok kullanacağın komut bu olacak — her şeyi kontrol etmek için kullanırsın.

### 0:40–1:10 · Değişkenler: let/const — "etiketli kutu"
Bir değişken, içine bir değer koyduğun **etiketli bir kutu**dur:

```
let isim = "Elif";

   ┌────────────┐
   │   isim     │  <- etiket (kutunun adı)
   ├────────────┤
   │  "Elif"    │  <- kutunun içindeki değer
   └────────────┘
```

```js
let isim = "Elif";       // let = değeri sonra değiştirebileceğin kutu
const dogumYili = 2000;  // const = değeri bir daha DEĞİŞMEYECEK kutu

console.log(isim);
console.log(dogumYili);

isim = "Elif Y.";        // let olduğu için değiştirebiliyoruz
console.log(isim);

// dogumYili = 2001;     // BU SATIRI AÇARSAN hata alırsın: "Assignment to constant variable"
```

💡 Kural: değeri değişmeyecekse **const** kullan (varsayılan tercihin bu olsun), değişecekse **let** kullan. Eski kod örneklerinde göreceğin `var`'ı bu kursta hiç kullanmayacağız.

### 1:10–1:40 · Tipler: string, number, boolean
JavaScript'te her değerin bir **tipi** vardır:

```js
let sehir = "İstanbul";   // string — tırnak içindeki metin
let yas = 26;              // number — sayı
let ogrenciMi = true;      // boolean — sadece true ya da false

console.log(typeof sehir);     // "string"
console.log(typeof yas);       // "number"
console.log(typeof ogrenciMi); // "boolean"
```

💡 `typeof` bir değerin tipini sana söyler — bir değişkenin ne tuttuğundan emin değilsen bunu kullan.

### 1:40–2:10 · String birleştirme: + ve template literal
İki yöntem var, ikincisi çok daha kolay:

```js
let ad = "Elif";
let soyad = "Yılmaz";

// yöntem 1: + operatörü
let tamAd1 = ad + " " + soyad;
console.log(tamAd1);   // "Elif Yılmaz"

// yöntem 2: template literal (backtick ` işareti + ${ })
let tamAd2 = `${ad} ${soyad}`;
console.log(tamAd2);   // "Elif Yılmaz"

let yas = 26;
console.log(`Benim adım ${ad} ve ${yas} yaşındayım.`);
// "Benim adım Elif ve 26 yaşındayım."
```

💡 Template literal, tırnak yerine **backtick** (`` ` ``, klavyede genelde Esc'in altında/solunda) kullanır ve `${degisken}` ile değişkeni doğrudan cümlenin içine gömmeni sağlar. Artık `+` ile uğraşmana çoğunlukla gerek kalmaz.

### 2:10–3:00 · 10 mini alıştırma
Her birini `gun-4-degiskenler.js` dosyasının altına ekleyip `node gun-4-degiskenler.js` ile test et. Önce kendin dene, sonra çözümle karşılaştır.

**1.** `isim` adında bir değişken oluştur, kendi adını ata, `console.log` ile yazdır.
<details><summary>💡 Çözüm</summary>

```js
const isim = "Elif";
console.log(isim);
```
</details>

**2.** `yas` adında bir number değişken oluştur, yaşını ata, yazdır.
<details><summary>💡 Çözüm</summary>

```js
const yas = 26;
console.log(yas);
```
</details>

**3.** `ogrenciMi` adında bir boolean değişken oluştur (true ya da false), yazdır.
<details><summary>💡 Çözüm</summary>

```js
const ogrenciMi = false;
console.log(ogrenciMi);
```
</details>

**4.** `let` ile bir değişken oluştur, değerini değiştir ve iki halini de yazdır. Sonra aynısını `const` ile dene, hatayı gör.
<details><summary>💡 Çözüm</summary>

```js
let sehir = "Ankara";
console.log(sehir);
sehir = "İzmir";
console.log(sehir);

const ulke = "Türkiye";
console.log(ulke);
// ulke = "Almanya";  // bu satırı açarsan: TypeError: Assignment to constant variable.
```
</details>

**5.** İki number değişken oluştur (`a`, `b`), toplamlarını üçüncü bir değişkende tut, yazdır.
<details><summary>💡 Çözüm</summary>

```js
const a = 12;
const b = 30;
const toplam = a + b;
console.log(toplam);   // 42
```
</details>

**6.** `+` operatörüyle iki string'i birleştir: `"Merhaba"` ve `"Dünya"`.
<details><summary>💡 Çözüm</summary>

```js
console.log("Merhaba" + " " + "Dünya");   // "Merhaba Dünya"
```
</details>

**7.** Template literal kullanarak bir cümle oluştur: adın ve yaşınla "Benim adım ... ve ... yaşındayım."
<details><summary>💡 Çözüm</summary>

```js
const ad = "Elif";
const yas2 = 26;
console.log(`Benim adım ${ad} ve ${yas2} yaşındayım.`);
```
</details>

**8.** `typeof` ile 3 farklı değişkenin tipini yazdır (bir string, bir number, bir boolean).
<details><summary>💡 Çözüm</summary>

```js
console.log(typeof "merhaba");   // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
```
</details>

**9.** Bir number değişkenini bir string ile `+` kullanarak birleştir, sonucun tipine bak (JS burada number'ı otomatik string'e çevirir).
<details><summary>💡 Çözüm</summary>

```js
const puan = 95;
const mesaj = "Puanın: " + puan;
console.log(mesaj);            // "Puanın: 95"
console.log(typeof mesaj);     // "string" — number, string'e "eridi"
```
</details>

**10.** Kendi mini "kimlik kartını" tek bir `console.log` ile, template literal kullanarak, çok satırlı şekilde yazdır (isim, yaş, meslek, şehir).
<details><summary>💡 Çözüm</summary>

```js
const kIsim = "Elif";
const kYas = 26;
const kMeslek = "Bilgisayar Mühendisi";
const kSehir = "İstanbul";

console.log(`
Kimlik Kartı
------------
İsim: ${kIsim}
Yaş: ${kYas}
Meslek: ${kMeslek}
Şehir: ${kSehir}
`);
```
</details>

**Küçük zafer:** İlk JavaScript kodunu terminalden çalıştırdın — bilgisayara senin yazdığın talimatları izlettin, bu programcı olmanın ta kendisi.
**Terim defteri:** `değişken` — etiketli kutu, `let/const` — değişebilir/değişemez kutu, `tip (string/number/boolean)` — bir değerin türü, `console.log` — ekrana yazdırma komutu, `template literal` — backtick + `${}` ile string oluşturma.
**Çıktı:** ✔ `hafta-01/gun-4-degiskenler.js` içinde 10 alıştırmanın çözümü, çalışır durumda.
**Commit:**
```bash
git add hafta-01/gun-4-degiskenler.js
git commit -m "hafta-01 g4: değişkenler + tipler + 10 alıştırma"
git push
```

---

## Gün 5 — Mantık: koşullar, döngüler, fonksiyonlar

### 0:00–0:30 · if/else + karşılaştırma operatörleri
Kod, insan gibi karar verebilir: "eğer şu doğruysa bunu yap, değilse şunu yap."

```js
const yas = 20;

if (yas >= 18) {
  console.log("Reşitsin.");
} else {
  console.log("Reşit değilsin.");
}
```

Karşılaştırma operatörleri:

| Operatör | Anlamı |
|---|---|
| `===` | tam olarak eşit mi (bu kursta hep bunu kullanacağız) |
| `!==` | eşit değil mi |
| `>`  `<` | büyük mü / küçük mü |
| `>=`  `<=` | büyük eşit mi / küçük eşit mi |

💡 JavaScript'te bir de `==` var ama tipleri zorla eşitlemeye çalışır ve garip sürprizler yapar (`"5" == 5` → `true`!). Bu kursta **her zaman `===`** kullan, kafa karışıklığından kurtulursun.

### 0:30–1:00 · && ve || (VE / VEYA)
Birden fazla koşulu birleştirmek için:

```js
const yas2 = 20;
const ehliyetVar = true;

// && (VE) — İKİSİ DE doğru olmalı
if (yas2 >= 18 && ehliyetVar) {
  console.log("Araba kullanabilirsin.");
} else {
  console.log("Kullanamazsın.");
}

const havaGuzel = false;
const canSikkin = true;

// || (VEYA) — EN AZ BİRİ doğru olması yeterli
if (havaGuzel || canSikkin) {
  console.log("Dışarı çıkalım.");
}
```

### 1:00–1:40 · Döngüler: for ve while
Aynı işi tekrar tekrar yapman gerektiğinde döngü kullanırsın — elle 100 kere yazmak yerine bilgisayara "bunu 100 kere yap" dersin.

```js
// for döngüsü: kaç kere çalışacağını başta bilirsen kullan
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// çıktı: 1 2 3 4 5 (her biri ayrı satırda)
```

```js
// while döngüsü: koşul doğru olduğu sürece çalışır
let sayac = 1;
while (sayac <= 5) {
  console.log(sayac);
  sayac = sayac + 1;   // BUNU UNUTMA, yoksa sonsuz döngüye girer!
}
```

💡 `for (let i = 1; i <= 5; i++)` üç parçadır: **başlangıç** (`let i = 1`), **koşul** (`i <= 5` doğru olduğu sürece devam), **artış** (`i++` = her turda i'yi 1 artır). `i++`, `i = i + 1`'in kısayoludur.

### 1:40–2:20 · Fonksiyonlar: girdi → kutu → çıktı
Bir fonksiyon, tekrar tekrar kullanacağın bir kod parçasını **isimlendirip paketlemendir**.

```
   girdi (parametre)        kutu (fonksiyon)          çıktı (return)
        5      ------->    [ kareAl(sayi) ]   ------->      25
```

```js
function kareAl(sayi) {
  return sayi * sayi;   // return = "bu değeri geri gönder"
}

const sonuc = kareAl(5);
console.log(sonuc);      // 25

console.log(kareAl(10)); // 100 — aynı fonksiyonu farklı girdiyle tekrar kullandık
```

💡 `sayi`, fonksiyonun **parametresi** — dışarıdan içeri giren değer. `return`, fonksiyonun dışarı verdiği sonuç. `console.log` sadece ekrana yazar, `return` ise değeri **fonksiyonun dışına taşır** ki başka bir yerde kullanabilesin — ikisi farklı şeyler.

### 2:20–3:00 · Kapanış: FizzBuzz
Klasik bir alıştırma (iş görüşmelerinde bile sorulur): 1'den 100'e kadar say. 3'e bölünenlere "Fizz", 5'e bölünenlere "Buzz", hem 3 hem 5'e bölünenlere (yani 15'e) "FizzBuzz" yaz, geri kalanları olduğu gibi yazdır.

`hafta-01/gun-5-fizzbuzz.js` dosyasını oluştur, önce **kendin** dene (20 dakika kuralı!), sonra çözümle karşılaştır:

<details><summary>💡 Çözüm — sadece kendin denedikten sonra aç</summary>

```js
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```
</details>

💡 `%` (mod operatörü) bölmenin **kalanını** verir. `15 % 3` → `0` demek "15, 3'e tam bölünüyor" demektir. Bu yüzden `i % 3 === 0` → "i, 3'e tam bölünüyor mu?" sorusunun cevabıdır. `i % 15 === 0` kontrolünü en başa koyduk çünkü hem 3'e hem 5'e bölünen sayılar aynı zamanda 3'e de bölünür — sıra önemli, en özel koşul en üstte olmalı.

**Küçük zafer:** FizzBuzz'ı çözdün — bu iş görüşmelerinde bile sorulan klasik bir test, ve sen onu daha ilk haftada geçtin.
**Terim defteri:** `koşul (if/else)` — karar verme yapısı, `döngü (for/while)` — tekrar eden işlem, `fonksiyon` — isimlendirilmiş, tekrar kullanılabilir kod bloğu, `parametre` — fonksiyona giren değer, `return` — fonksiyondan çıkan değer.
**Çıktı:** ✔ `hafta-01/gun-5-fizzbuzz.js` içinde çalışan FizzBuzz kodu (1-100).
**Commit:**
```bash
git add hafta-01/gun-5-fizzbuzz.js
git commit -m "hafta-01 g5: mantık + döngü + fonksiyon + fizzbuzz"
git push
```

---

## Gün 6 — Diziler, nesneler ve mini proje: konsol görev listesi

### 0:00–0:30 · Diziler (array): liste
Bir dizi, sırayla duran birden fazla değeri tek bir kutuda tutar.

```js
const meyveler = ["elma", "armut", "muz"];

console.log(meyveler[0]);      // "elma" — index (sıra numarası) 0'dan başlar!
console.log(meyveler[1]);      // "armut"
console.log(meyveler.length);  // 3 — kaç eleman var
```

💡 İlk eleman her zaman `[0]`'dadır, `[1]` değil — bu, yeni başlayanların en çok düştüğü tuzaklardan biri.

### 0:30–1:00 · Dizi metotları: push, forEach
```js
meyveler.push("çilek");         // sona yeni eleman ekle
console.log(meyveler);          // ["elma", "armut", "muz", "çilek"]

meyveler.forEach(function (meyve) {
  console.log(meyve);           // her elemanı tek tek yazdır
});
```

💡 `forEach`, dizideki her eleman için verdiğin fonksiyonu bir kere çalıştırır — bir `for` döngüsünün diziler için daha okunaklı hali.

### 1:00–1:30 · Nesneler (object): anahtar-değer
Bir nesne, ilişkili bilgileri **isimli alanlarda** bir arada tutar (dizideki gibi sıra numarası değil, isim ile erişirsin).

```js
const kisi = {
  isim: "Elif",
  yas: 26,
  meslek: "mühendis"
};

console.log(kisi.isim);   // "Elif" — nokta ile erişim
console.log(kisi.yas);    // 26
```

💡 Dizi = "sırayla duran liste" (index ile eriş: `[0]`). Nesne = "etiketli alanlar" (isim ile eriş: `.isim`). İkisini de birazdan mini projede birlikte kullanacaksın.

### 1:30–2:45 · Mini proje: konsol tabanlı görev listesi
Bu haftanın tüm kavramlarını (değişken, tip, koşul, döngü, fonksiyon, dizi, nesne) tek bir projede birleştiriyoruz.

```bash
cd ~/kod/elif-fullstack/hafta-01
touch gun-6-gorev-listesi.js
code .
```

Adım adım inşa et — her fonksiyonu yazdıktan sonra `node gun-6-gorev-listesi.js` ile test et:

```js
// görevler dizisi — her görev bir nesne (object)
const gorevler = [];

// yeni görev ekleyen fonksiyon
function gorevEkle(baslik) {
  const yeniGorev = {
    baslik: baslik,
    tamamlandi: false,
  };
  gorevler.push(yeniGorev);
  console.log(`✅ Eklendi: ${baslik}`);
}

// tüm görevleri listeleyen fonksiyon
function gorevleriListele() {
  console.log("--- Görev Listesi ---");
  gorevler.forEach(function (gorev, index) {
    const durum = gorev.tamamlandi ? "[x]" : "[ ]";
    console.log(`${index + 1}. ${durum} ${gorev.baslik}`);
  });
}

// bir görevi tamamlandı olarak işaretleyen fonksiyon
function gorevTamamla(sira) {
  const gorev = gorevler[sira - 1];   // insanlar 1'den sayar, diziler 0'dan
  if (gorev) {
    gorev.tamamlandi = true;
    console.log(`🎉 Tamamlandı: ${gorev.baslik}`);
  } else {
    console.log("Böyle bir görev yok!");
  }
}

// kaç görev tamamlanmış, sayan fonksiyon (döngü + koşul + return)
function tamamlananSayisi() {
  let sayac = 0;
  for (let i = 0; i < gorevler.length; i++) {
    if (gorevler[i].tamamlandi) {
      sayac++;
    }
  }
  return sayac;
}

// --- Kullanım ---
gorevEkle("JavaScript temellerini bitir");
gorevEkle("Git push yap");
gorevEkle("FizzBuzz çöz");

gorevleriListele();

gorevTamamla(2);

gorevleriListele();

console.log(`Tamamlanan görev sayısı: ${tamamlananSayisi()}`);
```

Çalıştır:

```bash
node gun-6-gorev-listesi.js
```

Beklenen çıktının sonu şöyle görünmeli:

```
--- Görev Listesi ---
1. [ ] JavaScript temellerini bitir
2. [x] Git push yap
3. [ ] FizzBuzz çöz
Tamamlanan görev sayısı: 1
```

💡 Bu küçük program aslında her uygulamanın (Instagram, Trello, bankacılık uygulaması dahil) temel iskeletidir: **veriyi tut (dizi/nesne) → işle (fonksiyon) → ekrana bas (console.log)**. Hafta 8-10'da bu veriyi bir veritabanına taşıyacaksın, mantık aynı kalacak.

**Kendi başına genişlet (isteğe bağlı, vaktin kalırsa):** Bir `gorevSil(sira)` fonksiyonu yaz — `gorevler.splice(sira - 1, 1)` kullanabilirsin.

### 2:45–3:00 · Test et, commit + push
Kodun hatasız çalıştığından emin ol, sonra haftanın son commit'ini at.

**Küçük zafer:** Kendi konsol uygulamanı baştan sona yazdın: veri tuttun, işledin, ekrana bastın — bu, her uygulamanın temel iskeleti, ve sen bunu 6. günde yaptın.
**Terim defteri:** `dizi (array)` — sıralı liste, `nesne (object)` — anahtar-değer çiftleri, `metot (push, forEach)` — bir veri tipine özel hazır fonksiyon, `index` — dizideki sıra numarası (0'dan başlar), `anahtar-değer` — nesnede `isim: "Elif"` gibi bir çift.
**Çıktı:** ✔ `hafta-01/gun-6-gorev-listesi.js` içinde çalışan mini görev listesi uygulaması.
**Commit:**
```bash
git add hafta-01/gun-6-gorev-listesi.js
git commit -m "hafta-01 g6: mini proje - konsol görev listesi"
git push
```

---

## Gün 7 — Pazar review (~30 dk)

### 0:00–0:15 · Teach-back quiz
Kendine (ya da yüksek sesle, sanki birine anlatıyormuş gibi) şu soruları sor ve **yazmadan, 1-2 cümleyle** cevapla. Açıklayamadığın soru varsa, o günün klasörüne geri dön, kod örneğini tekrar oku.

1. **Client / server:** Aralarındaki fark nedir? Somut bir örnek ver.
2. **Git:** `git add`, `git commit`, `git push` arasındaki fark nedir? Neden tek komut değil de üç ayrı adım var?
3. **HTTP:** Tarayıcıya bir adres yazıp Enter'a basınca arka planda ne olur, baştan sona anlat.
4. **Fonksiyon:** Bir fonksiyon nedir? Neden "girdi → kutu → çıktı" diyoruz?

**Bonus meydan okuma:** `gun-5-fizzbuzz.js` dosyasını kapat, hiçbir yere bakmadan sıfırdan yeniden yaz. Yazabiliyorsan, gerçekten öğrenmişsin — kopyalamak değil, anlamak kalıcı olan.

### 0:15–0:30 · Hafta 2'ye bakış
Bu hafta hep "görünmeyen" tarafla (terminal, git, JS mantığı) uğraştın. **Hafta 2'de HTML ve CSS'e geçiyorsun** — yani artık gördüğün (frontend) tarafı gerçek bir web sayfası olarak inşa etmeye başlayacaksın. Bu hafta öğrendiğin hiçbir şey boşa gitmiyor: HTML/CSS ile yazacağın ilk sayfayı yine bugünkü terminal ve git bilginle canlıya alacaksın. Hafta 2'nin çıktısı: **✔ ilk canlı site.**

**Küçük zafer:** Bir haftada sıfırdan; terminal, git, HTTP ve JavaScript'in temellerini görebiliyorsun — çoğu insanın aylarca sürdüğü bir başlangıcı 7 günde yaptın.
