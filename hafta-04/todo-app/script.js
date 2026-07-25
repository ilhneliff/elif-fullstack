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

        li.textContent = gorev.metin;

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

