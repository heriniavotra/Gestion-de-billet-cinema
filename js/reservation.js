const value = document.getElementById('value');


function lateraleGauche() {
    let section;
    let choixSiege = parseInt(prompt("Entrez le numéro de rangée que vous souhaitez y installer (1 à 10):", "1"));
    if (choixSiege < 1 || choixSiege > 10) {
        alert("Saisie erroné. Recommencez!");
    } else if (choixSiege === 1) {
        section = "Latérale gauche" + " " + choixSiege + " ère rangée";
    } else {
        section = "Latérale gauche" + " " + choixSiege + " ème rangée";
    }
    value.value = section;
}

function Milieu() {
    let section;
    let choixSiege = parseInt(prompt("Entrez le numéro de rangée que vous souhaitez y installer (1 à 10):", "1"));
    if (choixSiege < 1 || choixSiege > 10) {
        alert("Saisie erroné. Recommencez!");
    } else if (choixSiege === 1) {
        section = "Au milieu" + " " + choixSiege + " ère rangée";
    } else {
        section = "Au milieu" + " " + choixSiege + " ème rangée";
    }
    value.value = section;
}
function lateraleDroite() {
    let section;
    let choixSiege = parseInt(prompt("Entrez le numéro de rangée que vous souhaitez y installer (1 à 10):", "1"));
    if (choixSiege < 1 || choixSiege > 10) {
        alert("Saisie erroné. Recommencez!");
    } else if (choixSiege === 1) {
        section = "Latérale droite" + " " + choixSiege + " ère rangée";
    } else {
        section = "Latérale droite" + " " + choixSiege + " ème rangée";
    }
    value.value = section;
}

const data = document.getElementById("element");
const info = document.getElementById("idSeance");
data.onclick = (event) => {
    //element pointé par le souris
    const selectData = event.target.closest('tr');
    //données contenues par l'element selectionné
    const rowData = Array.from(selectData.children).map(cell => cell.textContent);
   console.log(rowData);
   info.value=rowData[0]

}