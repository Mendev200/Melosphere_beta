document.addEventListener("DOMContentLoaded", function () {
    // Vérification de la présence du jeton d'accès
    let accessToken = (localStorage.token) ? localStorage.token : null;
    if (!accessToken) window.location.href = "homePage.html";

    // URL de l'API pour la musique
    let urlApi = 'https://music.freefakeapi.io';

    // Vérification de la présence de l'ID de la musique dans le stockage
    let idMusic = (localStorage.idMusic) ? localStorage.idMusic : null;
    if (!idMusic) {
        console.log('navigation vers la page d\'accueil');
        window.location.href = "homePage.html";
    };

    // Définition de méthodes prototypes pour manipuler les éléments HTML
    HTMLElement.prototype.hide = function () {
        this.style.display = 'none';
        return this;
    }

    HTMLElement.prototype.show = function (param = null) {
        this.style.display = (param) ? param : 'block';
        return this;
    }

    HTMLElement.prototype.setOpacity = function (param = 'visible') {
        this.classList.add(param);
        return this;
    }

    // Fonction pour formater la durée au format minutes:secondes
    let formattedDuration = function (duration = null) {
        if (!duration) return 'mauvaise date/heure';
        let time = new Date(duration);
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let formatedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formatedTime;
    }

    // Obtention des éléments du DOM
    // let $mainLoader = document.querySelector('.mainLoader');
    // console.log($mainLoader);
    let $main = document.querySelector('main');
    let $header = document.querySelector('header');
    $main.hide();
    $header.hide();

    // Fonction pour obtenir une piste aléatoire depuis l'API
    let getRandomTrack = function () {
        return new Promise((resolver, reject) => {
            // Appel à l'API pour obtenir des pistes aléatoires
            fetch(urlApi + '/api/tracks?limit=20', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    "Accept": "application/json",
                    "Content-type": "application/json",
                }
            }).then(response => response.json()).then(data => {
                resolver(data)
            }).catch(errorApi => {
                reject(errorApi)
            });
        });
    }

    // Fonction pour obtenir les informations d'une piste par son ID
    let getMusicById = (id = null) => {
        return new Promise((resolver, reject) => {
            if (!id) reject('ID de la musique non trouvé');

            // Appel à l'API pour obtenir une piste par ID
            fetch(urlApi + '/api/tracks/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    "Accept": "application/json",
                    "Content-type": "application/json",
                }
            }).then(response => response.json()).then(data => {
                resolver(data)
            }).catch(errorApi => {
                reject(errorApi)
            });
        });
    }

    // Fonction pour obtenir les informations d'un artiste par son ID
    let getArtistInfo = function (idArtist = null) {
        return new Promise((resolver, reject) => {
            if (!idArtist) reject("ID de l'artiste non défini");

            // Appel à l'API pour obtenir les informations de l'artiste par ID
            fetch(urlApi + '/api/artists/' + idArtist, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    "Accept": "application/json",
                    "Content-type": "application/json",
                }
            }).then(response => response.json()).then(data => {
                resolver(data)
            }).catch(errorApi => {
                reject(errorApi)
            });
        })
    }

    // Fonction pour obtenir une catégorie par son ID
    let getCategoryById = function (idCat = null) {
        return new Promise((resolver, reject) => {
            if (!idCat) reject("ID de catégorie non défini");

            // Appel à l'API pour obtenir la catégorie par ID
            fetch(urlApi + '/api/categories/' + idCat, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    "Accept": "application/json",
                    "Content-type": "application/json",
                }
            }).then(response => response.json()).then(data => {
                resolver(data)
            }).catch(errorApi => {
                reject(errorApi)
            });
        })
    }

    // Fonction pour ajouter une piste aux favoris
    let addMusicToFavorites = function () {
        let idMusic = localStorage.idMusic;
        let form = {
            track: idMusic,
        }

        // Appel à l'API pour ajouter une piste aux favoris
        fetch(urlApi + '/api/favorites', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                "Accept": "application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify(form)
        }).then(response => response.json).then(updateFav => {
            console.log(updateFav)
        }).catch(errorUpadateFav => {
            console.log(errorUpadateFav);
        })
    };

    // Fonction pour supprimer une piste des favoris
    let removeMusicToFavorites = function () {
        let idMusic = localStorage.idMusic;

        // Appel à l'API pour supprimer une piste des favoris
        fetch(urlApi + '/api/favorites/' + idMusic, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                "Accept": "application/json",
                "Content-type": "application/json",
            },
        }).then(response => response.json).then(deleteFav => {
            console.log(deleteFav)
        }).catch(errorDeleteFav => {
            console.log(errorDeleteFav);
        })
    };

    // Fonction pour mettre à jour la dernière lecture de la musique
    let addMusicOnLatest = function () {
        let idMusic = localStorage.idMusic;
        let form = {
            last_play: new Date,
        }

        // Appel à l'API pour mettre à jour la dernière lecture
        fetch(urlApi + '/api/tracks/' + idMusic, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                "Accept": "application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify(form)
        }).then(response => response.json).then(updateLatest => {
            console.log(updateLatest)
        }).catch(ErrorUpdateLatest => {
            console.log(ErrorUpdateLatest);
        })
    }

    if (/audioPlayer.html/.test(window.location.href)) {
        /**
         * Méthode pour définir les données sur l'élément player
         * @param {Object} track 
         */
        let setPlayer = function (track) {
            // Mettre à jour l'ID de la musique dans le stockage local
            localStorage.idMusic = track.id;

            // Afficher le lecteur et masquer le chargeur
            // $mainLoader.hide();
            $main.show();
            $header.show();

            // Définir la source de la pochette
            $cover.src = urlApi + track.cover;

            // Lier la nouvelle source Audio
            $player.src = urlApi + track.file;

            // Lier le titre de la piste
            $main.querySelector('.trackTitle').textContent = track.title;

            // Lier la durée
            $main.querySelector('.trackDuration').textContent = formattedDuration(track.duration);

            // Vérifier si cette piste est dans les favoris de l'utilisateur
            if (track.is_favorite) {
                favIcon.src = 'assets/icons/favHeartClicked.svg';
                favIcon.classList.add('liked');
            } else {
                favIcon.classList.remove('liked');
                favIcon.src = 'assets/icons/favHeart.svg';
            }

            let idArtist = track.artist.replace('/api/artists/', '');

            // Appeler l'API pour obtenir les informations de l'artiste
            getArtistInfo(idArtist).then(info => {
                if (info.name)
                    $main.querySelector('.trackArtist').textContent = info.name;
                else
                    throw 'erreur dans les données de l\'artiste';
            }).catch(errorInfo => {
                $main.querySelector('.trackArtist').textContent = '...';
                console.log(errorInfo);
            });

            $main.querySelector('.trackCategory').textContent = "";

            // Obtenir le tableau des catégories
            let idsCat = track.categories;

            // Pour chaque catégorie, appeler l'API et obtenir le nom de la catégorie
            idsCat.forEach(cat => {
                getCategoryById(cat.replace('/api/categories/', '')).then(infoCat => {
                    if (infoCat.name) {
                        let elToAppend = document.createElement('span');
                        elToAppend.classList.add('item-genre');
                        elToAppend.setAttribute('id-cat', infoCat.id);
                        elToAppend.textContent = infoCat.name;
                        $main.querySelector('.trackCategory').append(elToAppend);
                    } else {
                        throw 'erreur dans les données de la catégorie';
                    }
                }).catch(errorInfo => {
                    $main.querySelector('.trackArtist').textContent = '...';
                    console.log(errorInfo);
                });
            });
        }

        // Récupérer $cover
        let $cover = $main.querySelector('.trackImage');

        // Lier l'événement onload sur l'image de la pochette
        $cover.onload = function (e) {
            e.target.parentElement.querySelector('.loading-img').hide();
            this.show();
        }

        // Récupérer l'élément player HTML
        let $player = $main.querySelector('audio');
        let pauseMusicBtn = document.querySelector(".pause-button"); // Bouton PAUSE
        let whiteBkgProgressBar = document.querySelector(".progressBkg"); // Barre de progression noire
        let playMusicBtn = document.querySelector(".play-button"); // Bouton PLAY
        let playPauseGroupBtns = document.querySelector(".playPauseBtnGroup"); // Groupe de boutons PLAY
        let stopBtn = document.querySelector(".stopBtn"); // Bouton STOP
        let track = document.querySelector("#track"); // Barre de progression
        let trackDurationElement = document.querySelector(".trackDuration"); // Durée
        let progressElement = $main.querySelector(".progress");
        let customTrack = $main.querySelector(".customProgressBar"); // Barre de progression personnalisée
        let randomBtn = $main.querySelector('.randomBtn');
        let favIcon = document.querySelector('.heartFav'); // Icône de favori vide

        // Lier l'événement clic sur le bouton playMusicBtn
        playMusicBtn.addEventListener("click", function () {
            playMusicBtn.hide();
            pauseMusicBtn.show();
            whiteBkgProgressBar.show();
            playPauseGroupBtns.classList.add("playAnimation");
            $player.play();
            addMusicOnLatest();
        });

        // Lier l'événement clic sur le bouton pauseMusicBtn
        pauseMusicBtn.addEventListener("click", function () {
            pauseMusicBtn.hide();
            playMusicBtn.show();
            playPauseGroupBtns.classList.remove("playAnimation");
            $player.pause();
        });

        // Lier l'événement clic sur le bouton stopBtn
        stopBtn.addEventListener("click", function () {
            pauseMusicBtn.hide();
            whiteBkgProgressBar.hide();
            playMusicBtn.show();
            playPauseGroupBtns.classList.remove("playAnimation");
            $player.pause();
            $player.currentTime = 0;
        });

        // Lier l'événement clic sur le bouton favIcon
        favIcon.addEventListener("click", function () {
            if (!this.classList.contains('liked')) {
                favIcon.src = 'assets/icons/favHeartClicked.svg';
                favIcon.classList.add('liked');
                // Ajouter la musique aux favoris
                addMusicToFavorites();
            } else {
                favIcon.classList.remove('liked');
                favIcon.src = 'assets/icons/favHeart.svg';
                // Retirer la musique des favoris
                removeMusicToFavorites();
            }
        });

        // Arrêter l'animation du vinyle et stopper la musique lorsque celle-ci est terminée
        $player.addEventListener("ended", function () {
            pauseMusicBtn.hide();
            playMusicBtn.show();
            whiteBkgProgressBar.hide();
            playPauseGroupBtns.classList.remove("playAnimation");
            $player.pause();
            $player.currentTime = 0;
        });

        // Gestion de la barre de progression
        $player.addEventListener("timeupdate", function () {
            track.value = this.currentTime;
            track.setAttribute("max", $player.duration);

            // Mise à jour du temps écoulé
            let elapsedMinutes = Math.floor(this.currentTime / 60);
            let elapsedSeconds = Math.floor(this.currentTime % 60);
            let formattedElapsed = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`;
            trackDurationElement.textContent = formattedElapsed;

            let currentTime = $player.currentTime; // Temps de lecture actuel de la musique
            let duration = $player.duration; // Durée totale de la musique

            let progressWidth = (currentTime / duration) * 100 + "%";
            progressElement.style.width = progressWidth;
        });

        // Écouteur d'événement pour détecter un clic sur la barre de progression personnalisée
        customTrack.addEventListener("click", function (clickEvent) {
            let seekPosition = clickEvent.offsetX; // Récupérer la position sur la barre de progression
            let progressBarWidth = customTrack.offsetWidth; // Récupérer la largeur totale de la barre de progression
            let seekTime = (seekPosition / progressBarWidth) * $player.duration; // Calculer le temps de recherche en fonction de la position du clic

            $player.currentTime = seekTime; // Mettre à jour le temps de lecture de la musique

            // Mise à jour de la position de lecture de la barre de progression personnalisée
            whiteBkgProgressBar.show();
        });

        // Lier l'événement clic sur le bouton randomBtn
        randomBtn.addEventListener("click", function (clickEvent) {
            // Arrêter la musique
            stopBtn.click();
            // Masquer le lecteur et afficher le chargeur
            $main.hide();
            $header.hide();
            // $mainLoader.show();

            // Obtenir une piste aléatoire
            getRandomTrack().then(tracks => {
                let tracksLength = Object.keys(tracks).length;

                if (tracksLength > 0) {
                    let indexRandom = Math.floor(Math.random() * tracksLength);
                    // Définir la piste aléatoire
                    setPlayer(tracks[indexRandom]);
                } else {
                    throw 'pas de données de pistes aléatoires';
                }
            }).catch(randomError => {
                console.log(randomError);
            });
        });

        // Appeler l'API pour obtenir la piste par ID et la définir sur HTML
        getMusicById(idMusic).then((track) => {
            if (track.artist) {
                setPlayer(track);
            } else {
                throw 'mauvaises données de piste';
            }
        }).catch(error => {
            console.log(error);
        });
    }

    if (/cdc-favoris-musique.html/.test(window.location.href)) {
        // Appeler l'API pour obtenir les pistes favorites
        fetch(urlApi + '/api/favorites', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                "Accept": "application/json",
                "Content-type": "application/json",
            },
        }).then(response => response.json())
            .then((favoritesTracks) => {
                // Parcourir les pistes favorites
                Object.keys(favoritesTracks).forEach((key) => {
                    // Cloner le modèle de carte favorite
                    let FavCardModel = document.querySelector("#FavoriteList .model").cloneNode(true);

                    // Lier les données de la piste à la carte favorite
                    FavCardModel.querySelector(".image-musique").src = urlApi + favoritesTracks[key].cover;
                    FavCardModel.querySelector("h4").textContent = "Titre: " + favoritesTracks[key].title;
                    FavCardModel.querySelector(".licence").textContent = favoritesTracks[key].licence;
                    FavCardModel.querySelector(".duration").textContent = "Durée: " + formattedDuration(favoritesTracks[key].duration);

                    // Ajouter l'ID de la musique en tant que dataset
                    FavCardModel.dataset.id = favoritesTracks[key].id;

                    // Ajouter un écouteur d'événement clic à la carte favorite
                    FavCardModel.addEventListener('click', function () {
                        localStorage.idMusic = this.dataset.id; // Stockage de l'ID de la musique dans localStorage
                        window.location.href = "audioPlayer.html"; // Redirection vers la page "audioPlayer.html"
                    });

                    // Appeler l'API pour obtenir les informations de l'artiste
                    getArtistInfo(favoritesTracks[key].id).then(info => {
                        FavCardModel.querySelector(".name").textContent = "Auteur: " + info.name;
                        FavCardModel.querySelector(".name").show();
                    });

                    // Pour chaque catégorie de la piste, appeler l'API pour obtenir le nom de la catégorie
                    favoritesTracks[key].categories.forEach(cat => {
                        getCategoryById(cat.replace('/api/categories/', '')).then(infoCat => {
                            if (infoCat.name) {
                                FavCardModel.querySelector(".cat").textContent += infoCat.name;
                                FavCardModel.querySelector(".cat").show();
                            } else {
                                throw 'erreur dans les données de la catégorie';
                            }
                        }).catch(errorInfo => {
                            $main.querySelector('.trackArtist').textContent = '...';
                            console.log(errorInfo);
                        });
                    });

                    // Supprimer la classe "model" et afficher la carte favorite
                    FavCardModel.classList.remove("model");
                    FavCardModel.show('flex');
                    document.querySelector("#FavoriteList").append(FavCardModel);
                });

                // Supprimer le modèle de carte favorite initial
                document.querySelector("#FavoriteList .model").remove();

                // Afficher le contenu
                $main.show();
                $header.show('flex');
            }).catch(ErrorUpdateLatest => {
                console.log(ErrorUpdateLatest);
            });
    }
});
