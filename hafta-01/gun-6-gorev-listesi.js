const gorevler = [];

function gorevekle(baslik){
    const yenigorev = {
        baslik: baslik,
        tamamlandi: false
    }
    gorevler.push(yenigorev);
    console.log("eklendi.");

}
    
function gorevleriListele(){
    console.log("Görevler Listesi:");
    gorevler.forEach(function(gorev, index){
        const durum = gorev.tamamlandi ? "Tamamlandı" : "Tamamlanmadı";
        console.log(`${index + 1}. ${gorev.baslik} - ${durum}`);
    });

}

function gorevTamamla(sira){
    const gorev = gorevler[sira - 1];
    if(gorev){
        gorev.tamamlandi = true;
        console.log(`Görev "${gorev.baslik}" tamamlandı.`);
    }
    else{
        console.log("böyle bir görev yok.");
    }
}

function tamamlanansayisi(sira){
    let sayac = 0;
    for(let i=0;i<gorevler.length;i++){
        if(gorevler[i].tamamlandi){
            sayac++;
        }
    }
    return sayac;   
}

gorevekle("JavaScript temellerini bitir.");
gorevekle("Git push yap.");
gorevekle("FizzBuzz çöz.");

gorevleriListele();
gorevTamamla(2);
gorevleriListele();

console.log(`Tamamlanan görev sayısı: ${tamamlanansayisi}`);