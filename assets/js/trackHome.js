document.addEventListener("DOMContentLoaded", function () {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("token");

    // Fonction pour effectuer la requête et afficher les morceaux
    function fetchAndDisplayTracks() {
        fetch("https://music.freefakeapi.io/api/tracks?order=latest&limit=10", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Inclure le token d'authentification dans l'en-tête
            }
        })
            .then(response => response.json())
            .then(data => {
                const tracksContainer = document.getElementById("tracks-container");
                if (Array.isArray(data)) {
                    // Parcourir les morceaux et les afficher
                    data.forEach(track => {
                        const coverElement = document.createElement("img");
                        coverElement.classList.add("cover-accueil");
                        coverElement.src = "https://music.freefakeapi.io/" + track.cover;
                        coverElement.setAttribute("data-id", track.id);
                        tracksContainer.appendChild(coverElement);
                        // Ajouter un écouteur d'événements pour chaque morceau
                        coverElement.addEventListener("click", function () {
                            console.log(this.dataset.id);
                            localStorage.idMusic = this.dataset.id;
                            window.location.href = "audioPlayer.html";
                        });
                    });
                } else {
                    console.log("Les données renvoyées ne sont pas au format attendu.");
                }
            })
            .catch(error => {
                console.log("Une erreur s'est produite lors de la récupération des morceaux :", error);
            });
    }

    // Fonction pour récupérer les 8 derniers morceaux écoutés
    function fetchRecentlyPlayed() {
        fetch("https://music.freefakeapi.io/api/tracks?order=played", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Inclure le token d'authentification dans l'en-tête
            }
        })
            .then(response => response.json())
            .then(data => {
                const recentlyPlayedContainer = document.getElementById("recently-played-container");
                if (Array.isArray(data)) {
                    // Parcourir les morceaux écoutés récemment et les afficher
                    data.forEach(track => {
                        const coverElement = document.createElement("img");
                        coverElement.classList.add("cover-accueil");
                        coverElement.classList.add("scroll-cover-accueil");
                        coverElement.setAttribute("data-id", track.id);
                        coverElement.src = "https://music.freefakeapi.io/" + track.cover;
                        recentlyPlayedContainer.appendChild(coverElement);
                        // Ajouter un écouteur d'événements pour chaque morceau écouté récemment
                        coverElement.addEventListener("click", function () {
                            console.log(this);
                            localStorage.idMusic = this.dataset.id;
                            window.location.href = "audioPlayer.html";
                        });
                    });
                } else {
                    console.log("Les données renvoyées ne sont pas au format attendu.");
                }
            })
            .catch(error => {
                console.log("Une erreur s'est produite lors de la récupération des morceaux écoutés :", error);
            });
    }

    // Appeler la fonction pour récupérer les morceaux et les afficher
    fetchAndDisplayTracks();
    // Appeler la fonction pour récupérer les 8 derniers morceaux écoutés
    fetchRecentlyPlayed();
});
