const veriCek = async () => {
    try {
        const cevap = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const veri = await cevap.json();
        console.log(veri);
    }
    catch (hata) {
        console.log("İstek başarısız:", hata);
    }
};

veriCek();

const tumKullanicilar = async () => {
    try {
        const cevap = await fetch("https://jsonplaceholder.typicode.com/users");
        const kullanicilar = await cevap.json();
        console.log(`Toplam ${kullanicilar.length} kullanıcı bulundu.`);
        const ozet = kullanicilar.map(({ name, address }) => {
            return `${name} — ${address.city}`;
        });
        console.log(ozet);
        const gollüSehirdekiler = kullanicilar.filter((k) =>
            k.address.city.includes("Lake")
        );
    } catch (hata) {

    }

}

const hataliIstekdene = async () => {
    try {
        const cevap = await fetch("https://jsonplaceholder.typicode.com/users/9999");

        if (!cevap.ok) {
            throw new Error('istek başarısız: ${cevap.status}');
        }
        const veri = await cevap.json();
        console.log(veri);
    } catch (hata) {
        console.log("hata:", hata.message);
    }
};
hataliIstekdene();

const ikikaynak = async () => {
    try {
        const kullaniciCevap = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const kullanici = await kullaniciCevap.json();

        const postlarCevap = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${kullanici.id}`
        );

        const postlar = await postlarCevap.json();

        console.log(`${kullanici.name} adlı kullanıcının ${postlar.length} gönderisi var.`);
    } catch (hata) {
        console.log("hata:", hata);
    }
};

ikikaynak();