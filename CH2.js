// 🔍 Funzione per cercare musica con l'API di Deezer
async function search() {
    const query = document.getElementById("searchField").value;
    if (!query) {
        alert("Inserisci un artista o una canzone!");
        return;
    }

    nascondiArtistiIniziali();
    const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Errore nella chiamata API");

        const data = await response.json();
        mostraRisultati(data.data);
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante la ricerca.");
    }
}

// 🎵 Funzione per mostrare i risultati della ricerca
function mostraRisultati(tracks) {
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.style.display = "block"; 
    searchResultsContainer.innerHTML = ""; 

    if (tracks.length === 0) {
        searchResultsContainer.innerHTML = "<p style='color: white;'>Nessun risultato trovato.</p>";
        return;
    }

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const colDiv = document.createElement("div");
    colDiv.classList.add("col-10");

    const searchSectionDiv = document.createElement("div");
    searchSectionDiv.setAttribute("id", "found");
    searchSectionDiv.classList.remove("d-none");

    const artistName = tracks[0].artist.name;
    const artistHeader = document.createElement("h2");
    artistHeader.textContent = artistName;
    artistHeader.style.color = "white";

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-lg-3", "row-cols-xl-4", "imgLinks", "py-3");
    cardsContainer.setAttribute("id", "searchCards");

    tracks.forEach(track => {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
            <div class="card mb-3">
                <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
                <div class="card-body">
                    <h5 class="card-title" style="color: black;">${track.title}</h5>
                    <p class="card-text" style="color: black; font-weight: normal;">Artista: ${track.artist.name}</p>
                    <a href="${track.link}" target="_blank" class="btn btn-success">Ascolta su Deezer</a>
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);
    });

    searchSectionDiv.appendChild(artistHeader);
    searchSectionDiv.appendChild(cardsContainer);
    colDiv.appendChild(searchSectionDiv);
    rowDiv.appendChild(colDiv);
    searchResultsContainer.appendChild(rowDiv);
}

// 🎵 Funzione per mostrare i titoli degli album nel MODALE
function mostraTitoliNelModale(tracks) {
    const albumListModal = document.getElementById("albumListModal");
    albumListModal.innerHTML = "";

    if (tracks.length === 0) {
        albumListModal.innerHTML = "<li class='list-group-item'>Nessun risultato trovato.</li>";
        return;
    }

    const titoli = new Set();
    tracks.forEach(track => {
        if (!titoli.has(track.album.title)) {
            titoli.add(track.album.title);

            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = track.album.title;

            albumListModal.appendChild(listItem);
        }
    });

    $("#albumModal").modal("show");
}

// 🎵 Funzione per ottenere i titoli degli album e aprire il modale
document.getElementById("createListBtn").addEventListener("click", async function () {
    const query = document.getElementById("searchField").value;
    if (!query) {
        alert("Inserisci un artista o un album!");
        return;
    }

    const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Errore nella chiamata API");

        const data = await response.json();
        mostraTitoliNelModale(data.data);
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante la ricerca.");
    }
});

// 🔥 Funzione per caricare automaticamente "Eminem", "Metallica" e "Queen" al caricamento della pagina
async function caricaArtistiIniziali() {
    const artisti = ["eminem", "metallica", "queen"];

    for (let artista of artisti) {
        const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${artista}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Errore nel caricamento di ${artista}`);

            const data = await response.json();
            mostraRisultatiIniziali(data.data, artista);
        } catch (error) {
            console.error(`Errore durante il caricamento di ${artista}:`, error);
        }
    }
}

// 🎵 Funzione per mostrare i risultati iniziali nelle sezioni dedicate senza sovrascrivere
function mostraRisultatiIniziali(tracks, artista) {
    let section = null;

    if (artista === "eminem") {
        section = document.getElementById("eminemSection");
        document.getElementById("eminem").classList.remove("d-none");
    } else if (artista === "metallica") {
        section = document.getElementById("metallicaSection");
        document.getElementById("metallica").classList.remove("d-none");
    } else if (artista === "queen") {
        section = document.getElementById("queenSection");
        document.getElementById("queen").classList.remove("d-none");
    }

    if (!section) return;

    tracks.forEach(track => {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
        <div class="card mb-3">
            <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
            <div class="card-body">
                <h5 class="card-title" style="color: black;">${track.title}</h5>
                <p class="card-text" style="color: black; font-weight: normal;">Artista: ${track.artist.name}</p>
                <a href="${track.link}" target="_blank" class="btn btn-success">Ascolta su Deezer</a>
            </div>
        </div>
    `;

        section.appendChild(card);
    });
}

// 🎵 Funzione per nascondere gli artisti iniziali quando si fa una nuova ricerca
function nascondiArtistiIniziali() {
    document.getElementById("eminem").classList.add("d-none");
    document.getElementById("metallica").classList.add("d-none");
    document.getElementById("queen").classList.add("d-none");
}

// 🚀 Avvia il caricamento degli artisti iniziali quando la pagina viene caricata
window.onload = caricaArtistiIniziali;

// 🎯 Event listener per il pulsante di ricerca
document.getElementById("button-search").addEventListener("click", search);
