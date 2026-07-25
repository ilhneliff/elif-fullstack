let gorevler = []

let sonrakiId = 1;

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


gorevler.forEach((gorev) => {
    const li = document.createElement("li");
    li.textContent = gorev.metin;

    if (gorev.tamamlandi) {
        li.classList.add("tamamlandi");

    }

    listeElement.appendChild(li);
});

gorevler.forEach((gorev) => {
    const li = document.createElement("li");

    const metinSpan = document.createElement("span");

    metinSpan.textContent = gorev.metin;
    if (gorev.tamamlandi) {
        metinSpan.classList.add("tamamlandi");
    }

    const tamamlaButon = document.createElement("button");
    tamamlaButon.textContent = "✓";
    tamamlaButon.classList.add("mini-buton", "tamamla-buton");
    tamamlaButon.dataset.id = gorev.id;

    const silButon = document.createElement("button");
    silButon.textContent = "✕";
    silButon.classList.add("mini-buton", "sil-buton");
    silButon.dataset.id = gorev.id;

    li.appendChild(metinSpan);
    li.appendChild(tamamlaButon);
    li.appendChild(silButon);
    listeElement.appendChild(li);
});
listeElement.addEventListener("click", (event) => {
    // Bu dinleyici SADECE BİR KEZ eklenir (listeyi her yeniden çizdiğimizde SİLİNMEZ,
    // çünkü <ul> elementinin kendisi hiç yok edilmiyor, sadece İÇİNDEKİLER değişiyor)

    const tiklananId = Number(event.target.dataset.id);
    // event.target: gerçekte TIKLANAN eleman (buton)
    // dataset.id: string olarak gelir, Number() ile sayıya çeviriyoruz (id'ler sayı çünkü)

    if (event.target.classList.contains("tamamla-buton")) {
        gorevTamamlaToggle(tiklananId);
    }

    if (event.target.classList.contains("sil-buton")) {
        gorevSil(tiklananId);
    }
});
const gorevTamamlaToggle = (id) => {
    gorevler = gorevler.map((gorev) => {
        // map ile YENİ bir dizi oluşturuyoruz — id eşleşen görevin tamamlandi'sini ÇEVİR, diğerlerine dokunma
        if (gorev.id === id) {
            return { ...gorev, tamamlandi: !gorev.tamamlandi };
            // { ...gorev, tamamlandi: !gorev.tamamlandi }:
            //   ...gorev → gorev nesnesinin TÜM alanlarını kopyala ("spread" sözdizimi)
            //   tamamlandi: !gorev.tamamlandi → SADECE bu alanı tersine çevirerek EZ
            // Sonuç: id, metin aynı kalır, sadece tamamlandi değişir
        }
        return gorev;
        // eşleşmeyen görevleri OLDUĞU GİBİ geri döndür
    });

    listeyiEkranaCiz();
};

const gorevSil = (id) => {
    gorevler = gorevler.filter((gorev) => gorev.id !== id);
    // filter: id'si SİLİNMEK İSTENEN id'YE EŞİT OLMAYAN tüm görevleri tut
    // yani sadece o TEK görev dizi dışında kalır, geri kalan her şey aynı

    listeyiEkranaCiz();
};
