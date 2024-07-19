const idseance = document.getElementById("idseance");
const dateSeance = document.getElementById("dateSeance");
const horaire = document.getElementById("horaire");
const film = document.getElementById("film");

const modifier = document.getElementById("modifier");
const donnee = document.getElementById("donnee");

donnee.onclick = (event) => {
    const selectData = event.target.closest('tr');
    const rowData = Array.from(selectData.children).map(cell => cell.textContent);
    idseance.value = rowData[0];
    dateSeance.value = rowData[1];
    horaire.value = rowData[2];
    film.value = rowData[3];
}

modifier.onclick = (event) => {
    event.preventDefault();
    modifier.setAttribute("href", "/admin/" + idseance.value + "/" + dateSeance.value + "/" + horaire.value + "/" + film.value);
    const destinationURL = modifier.getAttribute("href");
    window.location.href = destinationURL;
}
