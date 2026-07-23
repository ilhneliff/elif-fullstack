console.log("Önce bu");

setTimeout(() => {

    console.log("2 saniye sonra bu");
}, 2000);

console.log("Ama bu, setTimeout'tan ÖNCE yazdırılır!");

const sozVer = new Promise((resolve, reject) => {
    // resolve: iş BAŞARILI olursa çağrılır
    // reject: iş BAŞARISIZ olursa çağrılır
    setTimeout(() => {
        const basariliMi = true;
        if (basariliMi) {
            resolve("Veri geldi!");
        } else {
            reject("Bir hata oldu.");
        }
    }, 1000);
});

sozVer
    .then((sonuc) => {
        // resolve olursa buraya düşer, sonuc = resolve'a verilen değer
        console.log("Başarılı:", sonuc);
    })
    .catch((hata) => {
        // reject olursa buraya düşer
        console.log("Hata:", hata);
    });

console.log("Bu satır, Promise sonuçlanmadan hemen çalışır — asenkron çünkü!");

// Şimdilik hayali bir örnek (Gün 5'te gerçeğini yapacağız):
fetch("https://ornek-api.com/veri")
    .then((cevap) => cevap.json())
    // cevap.json() de kendisi bir Promise döner — bu yüzden zincirlenebiliyor
    .then((veri) => {
        console.log(veri);
    })
    .catch((hata) => {
        console.log("İstek başarısız:", hata);
    });

sozVer
    .then((sonuc1) => {
        console.log(sonuc1);
        return "ikinci adım";
    })
    .then((sonuc2) => {
        console.log(sonuc2);
        return "üçüncü adım";
    })
    .then((sonuc3) => {
        console.log(sonuc3);
    })
    .catch((hata) => {
        console.log("Zincirin herhangi bir yerinde hata olursa buraya düşer:", hata);
    });