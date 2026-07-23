// gun4.js

const sozVer = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Veri geldi!"), 1000);
    });
};


const eskiYol = () => {
    sozVer().then((sonuc) => {
        console.log("eski yol:", sonuc);
    });
};


const yeniYol = async () => {

    const sonuc = await sozVer();

    console.log("yeni yol:", sonuc);
};

yeniYol();

const adimlarYeni = async () => {
    const s1 = await sozVer();
    console.log(s1);
    const s2 = await sozVer();
    console.log(s2);
};

adimlarYeni();

const veriGetir = async () => {
    try {
        const sonuc = await sozVer();
        console.log("başarılı:", sonuc);
    }
    catch (hata) {
        console.log("hata yakalandı:", hata);
    }

};

const basarisizİstek = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject("sunucuya ulaşılamadı!"), 1000);
    });
};

const veriGetir2 = async () => {
    try {
        const sonuc = await basarisizİstek();
        console.log(sonuc);
    } catch (hata) {
        console.log("hata:", hata);
    }

};
veriGetir2();



const sahteKullaniciGetir = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 1) {
                resolve({ id: 1, ad: "Elif", meslek: "Geliştirici" });
            } else {
                reject(`ID ${id} ile kullanıcı bulunamadı`);
            }
        }, 800);
    });
};

const kullaniciGoster = async (id) => {
    console.log(`ID ${id} için kullanıcı aranıyor...`);
    try {
        const kullanici = await sahteKullaniciGetir(id);
        console.log("Bulundu:", kullanici);
    } catch (hata) {
        console.log("Hata:", hata);
    } finally {
        
        console.log("İstek tamamlandı.\n");
    }
};


kullaniciGoster(1);
kullaniciGoster(99); 