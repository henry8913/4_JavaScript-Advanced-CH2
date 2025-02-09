const playlistGeneri = [
    "5792658322",
    "1282523285",
    "8659845862",
    "10080553142",
    "918969855",
    "1273315391",
    "7211997104",
    "7917332782",
    "3108779326",
    "7546160722",
    "5878415222",
    "11740257384",
];

const artistiIniziali = ["eminem", "metallica", "queen"];

async function search() {
    const query = document.getElementById("searchField").value;
    if (!query) {
        alert("Inserisci un artista o una canzone!");
        return;
    }

    nascondiArtistiIniziali();
    document.getElementById("searchResults").innerHTML = "";

    mostraPlaylistCasuali();

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

function mostraPlaylistCasuali() {
    const playlistContainer = document.getElementById("playlistResults");
    playlistContainer.style.marginLeft = "0";
    playlistContainer.classList.add("p-0");
    playlistContainer.style.display = "block"; 
    playlistContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Playlist consigliate";
    title.style.color = "white";
    title.style.textAlign = "start";
    playlistContainer.appendChild(title);

    const playlistCasuali = playlistGeneri.sort(() => 0.5 - Math.random()).slice(0, 4);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "py-3", "d-flex", "justify-content-center");

    playlistCasuali.forEach(playlistId => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-md-6", "col-lg-6", "mb-3");

        const deezerPlaylist = `
            <iframe title="deezer-widget" 
                    src="https://widget.deezer.com/widget/light/playlist/${playlistId}" 
                    width="100%" height="290" 
                    frameborder="0" 
                    allowtransparency="true" 
                    allow="encrypted-media; clipboard-write">
            </iframe>`;

        colDiv.innerHTML = deezerPlaylist;
        rowDiv.appendChild(colDiv);
    });

    playlistContainer.appendChild(rowDiv);
}

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
    colDiv.classList.add("col-12");

    const searchSectionDiv = document.createElement("div");
    searchSectionDiv.setAttribute("id", "found");
    searchSectionDiv.classList.remove("d-none");

    const artistName = tracks[0].artist.name;
    const artistHeader = document.createElement("h2");
    artistHeader.textContent = artistName;
    artistHeader.style.color = "white";

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("row", "row-cols-lg-4", "imgLinks");
    cardsContainer.setAttribute("id", "searchCards");

    tracks.forEach(track => {
        const card = document.createElement("div");
        card.classList.add("col");

        const deezerPlayer = `
            <iframe 
                title="${track.title}"
                scrolling="no"
                frameborder="0"
                allowTransparency="true"
                src="https://widget.deezer.com/widget/dark/track/${track.id}"
                width="100%"
                height="150">
            </iframe>`;

        card.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    ${deezerPlayer}
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

async function caricaArtistiIniziali() {
    for (let artista of artistiIniziali) {
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

function mostraRisultatiIniziali(tracks, artista) {
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.style.display = "block"; 

    const section = document.createElement("div");
    section.classList.add("artist-section");

    const artistHeader = document.createElement("h2");
    artistHeader.textContent = artista.toUpperCase();
    artistHeader.style.color = "white";

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-lg-3", "row-cols-xl-4", "imgLinks", "py-3", "col-12");

    tracks.slice(0, 4).forEach(track => {
        const card = document.createElement("div");
        card.classList.add("col", "container", "mt-3");

        const deezerPlayer = `
            <iframe 
                title="${track.title}"
                scrolling="no"
                frameborder="0"
                allowTransparency="true"
                src="https://widget.deezer.com/widget/dark/track/${track.id}"
                width="100%"
                height="100%">
            </iframe>`;

        card.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                ${deezerPlayer}
            </div>
        </div>
    `;

        cardsContainer.appendChild(card);
    });

    section.appendChild(artistHeader);
    section.appendChild(cardsContainer);
    searchResultsContainer.appendChild(section);
}

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

function nascondiArtistiIniziali() {
    document.getElementById("searchResults").innerHTML = "";
}

window.onload = caricaArtistiIniziali;

document.getElementById("button-search").addEventListener("click", search);
