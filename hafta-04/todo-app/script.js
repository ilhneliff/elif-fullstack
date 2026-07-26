const KAYIT_ANAHTARI = "elif-todo-gorevler";

const gorevleriKaydet = () => {
    localStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(gorevler));
};

const gorevleriYukle = () => {
    const kayitliVeri = localStorage.getItem(KAYIT_ANAHTARI);

    if (kayitliVeri === null) {

        return [];
    }

    return JSON.parse(kayitliVeri);
};

let gorevler = gorevleriYukle();

let sonrakiId =
    gorevler.length > 0
        ? Math.max(...gorevler.map((g) => g.id)) + 1
        : 1;

const listeElement = document.querySelector("#gorev-listesi");
const bosMesajElement = document.querySelector("#bos-mesaj");

const listeyiEkranaCiz = () => {

    listeElement.innerHTML = "";


    if (gorevler.length === 0) {
        bosMesajElement.style.display = "block";

        return;

    }

    bosMesajElement.style.display = "none";

    gorevler.forEach((gorev) => {


        const li = document.createElement("li");

        const metinSpan = document.createElement("span");

        metinSpan.textContent = gorev.metin;

        if (gorev.tamamlandi) {
            metinSpan.classList.add("tamamlandi");
        }

        const tamamlaButon = document.createElement("button");

        tamamlaButon.textContent = "✓";

        tamamlaButon.classList.add(
            "mini-buton",
            "tamamla-buton"
        );

        tamamlaButon.dataset.id = gorev.id;


        const silButon = document.createElement("button");

        silButon.textContent = "✕";

        silButon.classList.add(
            "mini-buton",
            "sil-buton"
        );

        silButon.dataset.id = gorev.id;


        li.appendChild(metinSpan);

        li.appendChild(tamamlaButon);

        li.appendChild(silButon);

        listeElement.appendChild(li);
    });
};

listeyiEkranaCiz();

const gorevEkle = (metin) => {
    const yeniGorev = {
        id: sonrakiId,
        metin: metin,
        tamamlandi: false,
    };

    gorevler.push(yeniGorev);


    sonrakiId = sonrakiId + 1;

    gorevleriKaydet();
    listeyiEkranaCiz();

};

const formElement = document.querySelector("#gorev-form");
const inputElement = document.querySelector("#gorev-input");

formElement.addEventListener("submit", (event) => {


    event.preventDefault();

    const girilenMetin = inputElement.value.trim();



    if (girilenMetin === "") {
        return;

    }

    gorevEkle(girilenMetin);
    inputElement.value = "";

});

listeElement.addEventListener("click", (event) => {


    const tiklananId = Number(event.target.dataset.id);


    if (event.target.classList.contains("tamamla-buton")) {
        gorevTamamlaToggle(tiklananId);
    }

    if (event.target.classList.contains("sil-buton")) {
        gorevSil(tiklananId);
    }
});
const gorevTamamlaToggle = (id) => {
    gorevler = gorevler.map((gorev) => {

        if (gorev.id === id) {
            return { ...gorev, tamamlandi: !gorev.tamamlandi };

        }
        return gorev;

    });
    gorevleriKaydet();
    listeyiEkranaCiz();
};

const gorevSil = (id) => {
    gorevler = gorevler.filter((gorev) => gorev.id !== id);

    gorevleriKaydet();
    listeyiEkranaCiz();
};
localStorage.setItem("test-anahtar", "merhaba");


const okunanDeger = localStorage.getItem("test-anahtar");
console.log(okunanDeger);

localStorage.removeItem("test-anahtar");
localStorage.getItem("test-anahtar")


