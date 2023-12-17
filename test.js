/**
 * check if user has token in storage 
 */
let accessToken = (localStorage.token) ? localStorage.token : null;
if (!accessToken) window.location.href = 'accueil-jour.html';

//path api music freefakeapi.io
let urlApi = 'https://music.freefakeapi.io';

/**
 * check if user has is musique  in storage 
 */
let idMusic = (localStorage.idMusic) ? localStorage.idMusic : null;
if (!idMusic) {
    console.log('navigation to home page ');
    window.location.href = 'accueil-jour.html';
};

/**
 * methode prototype to hide element html 
 */
HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
    return this
}

/**
 * methode to show element 
 * @param {string} param 
 */
HTMLElement.prototype.show = function (param = null) {
    this.style.display = (param) ? param : 'block';
    return this
}

/**
 * methode prototype to set opacity element html 
 */
HTMLElement.prototype.setOpacity = function (param = 'visible') {
    this.classList.add(param);
    return this
}

/**
 * methode to formate duration minutes:secondes
 * @param {Date} duration 
 * @returns 
 */
let formattedDuration = function (duration = null) {
    if (!duration) return 'bad date time'
    let time = new Date(duration);
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let formatedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formatedTime;
}


//get loader  main 
let $mainLoader = document.querySelector('.mainLoader');

//get  main 
let $main = document.querySelector('main');
let $header = document.querySelector('header')

//per default hide main 
$main.hide();
$header.hide();


/**
 * Methode to get tracks random 
 * @returns {Promise}
 */
let getRandomTrack = function () {
    return new Promise((resolver, reject) => {
        //call api to get random tracks
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



/**
 * 
 * @param {Number} id 
 * @returns 
 */
let getMusicById = (id = null) => {
    return new Promise((resolver, reject) => {
        //if no id return error 
        if (!id) reject('id  music not found');

        //call api to get track by id 
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

/**
 * methode to get info  one artist 
 * @param {Number} idArtist
 */
let getArtistInfo = function (idArtist = null) {
    return new Promise((resolver, reject) => {
        if (!idArtist) reject("idArtist not defined !!!");
        //call api to get track by id 
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

/**
 * methode to get category by id 
 * @param {Number} idCat
 */
let getCategoryById = function (idCat = null) {
    return new Promise((resolver, reject) => {
        if (!idCat) reject("id category not defined !!!");
        //call api to get category by id 
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





/**
 * methode to add track to fav
 */
let addMusicToFavorites = function () {
    let idMusic = localStorage.idMusic;

    let form = {
        track: idMusic,
    }

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


/**
 * methode to remove track from fav
 */
let removeMusicToFavorites = function () {
    let idMusic = localStorage.idMusic;


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


/**
 * UPDATE music last play 
 */
let addMusicOnLatest = function () {

    let idMusic = localStorage.idMusic;

    let form = {
        last_play: new Date,
    }

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
 * Methode to set data on player HTMLElement 
 * @param {Object} track 
 */
    let setPlayer = function (track) {
        //update id music on localstorage 
        localStorage.idMusic = track.id;

        //show player && hide loader 
        $mainLoader.hide()
        $main.show()
        $header.show()

        //set cover src 
        $cover.src = urlApi + track.cover;

        //bind new src Audio 
        $player.src = urlApi + track.file;

        //bind title track 
        $main.querySelector('.trackTitle').textContent = track.title;

        //bind duration 
        $main.querySelector('.trackDuration').textContent = formattedDuration(track.duration);

        //check if this track on  favories user 
        if (track.is_favorite) {
            favIcon.src = 'assets/icons/favHeartClicked.svg';
            favIcon.classList.add('liked')
        } else {
            favIcon.classList.remove('liked')
            favIcon.src = 'assets/icons/favHeart.svg';
        }

        let idArtist = track.artist.replace('/api/artists/', '');

        //call api to get artiste info 
        getArtistInfo(idArtist).then(info => {
            if (info.name)
                $main.querySelector('.trackArtist').textContent = info.name;
            else
                throw 'error bad data artist info ';

        }).catch(errorInfo => {
            $main.querySelector('.trackArtist').textContent = '...'
            console.log(errorInfo);
        });

        $main.querySelector('.trackCategory').textContent = "";
        //get categories array 
        let idsCat = track.categories;

        //foreach on idsCat to  call and return name of categories
        idsCat.forEach(cat => {

            //     //call api to get category info 
            getCategoryById(cat.replace('/api/categories/', '')).then(infoCat => {
                if (infoCat.name) {
                    let elToAppend = document.createElement('span');
                    elToAppend.classList.add('item-genre');
                    elToAppend.setAttribute('id-cat', infoCat.id)
                    elToAppend.textContent = infoCat.name;
                    $main.querySelector('.trackCategory').append(elToAppend)
                }
                else
                    throw 'error bad data artist info ';

            }).catch(errorInfo => {
                $main.querySelector('.trackArtist').textContent = '...'
                console.log(errorInfo);
            })



        });

    }


    //get $cover 
    let $cover = $main.querySelector('.trackImage');
    //bind event onload on image cover 
    $cover.onload = function (e) {
        e.target.parentElement.querySelector('.loading-img').hide();
        this.show();
        // this.show().setOpacity('visible');
    }
    //get player html 
    let $player = $main.querySelector('audio');
    let pauseMusicBtn = document.querySelector(".pause-button") // Bouton PAUSE
    let whiteBkgProgressBar = document.querySelector(".progressBkg"); // Black progress bar
    let playMusicBtn = document.querySelector(".play-button")// Bouton PLAY
    let playPauseGroupBtns = document.querySelector(".playPauseBtnGroup") // Bouton PLAY
    let stopBtn = document.querySelector(".stopBtn"); // Bouton STOP
    let track = document.querySelector("#track"); // Barre de progression
    let trackDurationElement = document.querySelector(".trackDuration"); // Durée
    let progressElement = $main.querySelector(".progress");
    let customTrack = $main.querySelector(".customProgressBar"); // Barre de progression BUSTOM
    let randomBtn = $main.querySelector('.randomBtn');
    let favIcon = document.querySelector('.heartFav');//icon fav empty

    //bind event click  play  on playMusicBtn
    playMusicBtn.addEventListener("click", function () {
        playMusicBtn.hide();
        pauseMusicBtn.show();
        whiteBkgProgressBar.show();
        playPauseGroupBtns.classList.add("playAnimation");
        $player.play();
        addMusicOnLatest();
    });

    //bind event click pause on pauseMusicBtn
    pauseMusicBtn.addEventListener("click", function () {
        pauseMusicBtn.hide();
        playMusicBtn.show()
        playPauseGroupBtns.classList.remove("playAnimation");
        $player.pause();
    });

    //bind event click stop on pause btn 
    stopBtn.addEventListener("click", function () {
        pauseMusicBtn.hide()
        whiteBkgProgressBar.hide()
        playMusicBtn.show()
        playPauseGroupBtns.classList.remove("playAnimation");
        $player.pause();
        $player.currentTime = 0;
    });

    //bind event click stop on pause btn 
    favIcon.addEventListener("click", function () {

        if (!this.classList.contains('liked')) {
            favIcon.src = 'assets/icons/favHeartClicked.svg';
            favIcon.classList.add('liked');
            //add music on fav 
            addMusicToFavorites();

        } else {
            favIcon.classList.remove('liked');
            favIcon.src = 'assets/icons/favHeart.svg';
            removeMusicToFavorites();
        }

    });

    // ARRETER L'ANIMATION DU VYNIL ET STOP QUAND LA MUSIQUE EST TERMINEE
    $player.addEventListener("ended", function () {
        pauseMusicBtn.hide();
        playMusicBtn.show();
        whiteBkgProgressBar.hide();
        playPauseGroupBtns.classList.remove("playAnimation");
        $player.pause();
        $player.currentTime = 0;
    });


    // GESTION DE LA BARRE DE PROGRESSION
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

        // updateCustomProgressBar(); // Mettre à jour la position de lecture de la barre de progression personnalisée

        whiteBkgProgressBar.show();

        progressTimeUpdate = track.value;

    });


    //bind event click to random btn 
    randomBtn.addEventListener("click", function (clickEvent) {
        //stop music 
        stopBtn.click();
        //show loader 
        $main.hide();
        $header.hide()
        $mainLoader.show();

        getRandomTrack().then(tracks => {

            let tracksLenght = Object.keys(tracks).length;

            if (tracksLenght > 0) {

                let indexRandom = Math.floor(Math.random() * tracksLenght);

                setPlayer(tracks[indexRandom]);


            } else {
                throw 'no  randoms data tracks returned'
            }



        }).catch(randomError => {
            console.log(randomError)
        });

    });

    //call api to get track by and &&  set on html 
    getMusicById(idMusic).then((track) => {
        if (track.artist) {
            setPlayer(track);
        } else {
            throw 'bad data track';
        }
    }).catch(error => {
        console.log(error)
    });



}


if (/cdc-favoris-musique.html/.test(window.location.href)) {
    fetch(urlApi + '/api/favorites', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            "Accept": "application/json",
            "Content-type": "application/json",
        },
    }).then(response => response.json())
        .then((favoritesTracks) => {

            // console.log(favoritesTracks);
            Object.keys(favoritesTracks).forEach((key) => {
                let FavCardModel = document.querySelector("#FavoriteList .model").cloneNode(true);
                FavCardModel.querySelector(".image-musique").src = urlApi + favoritesTracks[key].cover;
                FavCardModel.querySelector("h4").textContent = "Titre: " + favoritesTracks[key].title;
                FavCardModel.querySelector(".licence").textContent = favoritesTracks[key].licence;
                FavCardModel.querySelector(".duration").textContent = "Durée: " + formattedDuration(favoritesTracks[key].duration);

                FavCardModel.dataset.id = favoritesTracks[key].id; // Ajout de l'ID de la musique en tant que dataset

                FavCardModel.addEventListener('click', function () {
                    localStorage.idMusic = this.dataset.id; // Stockage de l'ID de la musique dans localStorage
                    window.location.href = "audioPlayer.html"; // Redirection vers la page "audioPlayer.html"
                });

                getArtistInfo(favoritesTracks[key].id).then(info => {
                    FavCardModel.querySelector(".name").textContent = "Auteur: " + info.name;
                    FavCardModel.querySelector(".name").show();
                });

                favoritesTracks[key].categories.forEach(cat => {
                    getCategoryById(cat.replace('/api/categories/', '')).then(infoCat => {
                        if (infoCat.name) {
                            FavCardModel.querySelector(".cat").textContent += infoCat.name;
                            FavCardModel.querySelector(".cat").show();
                        } else {
                            throw 'error bad data artist info';
                        }
                    }).catch(errorInfo => {
                        $main.querySelector('.trackArtist').textContent = '...';
                        console.log(errorInfo);
                    });
                });

                FavCardModel.classList.remove("model");
                FavCardModel.show('flex');
                document.querySelector("#FavoriteList").append(FavCardModel);
            });

            document.querySelector("#FavoriteList .model").remove();

            $main.show();
            $header.show('flex');
        }).catch(ErrorUpdateLatest => {
            console.log(ErrorUpdateLatest);
        });
}








