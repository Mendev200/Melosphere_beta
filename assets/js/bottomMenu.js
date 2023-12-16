// AFFICHAGE DE LA FENÊTRE DIALOGUE AU CLIC sur .dotLink
document.querySelector(".dotLink").addEventListener("click", function () {
    let bottomSheet = document.getElementById("bottomSheet");
    bottomSheet.classList.toggle("open");
    let overlay = document.getElementById("overlay");
    overlay.classList.toggle("hideShowOverlay");
});

// AFFICHAGE DE LA FENÊTRE DIALOGUE AU CLIC sur Licence/Source
document.querySelector(".trackLicense").addEventListener("click", function () {
    let LicensebottomSheet = document.querySelector(".licenceBottomSheet");
    LicensebottomSheet.classList.toggle("open");
    let licenseOverlay = document.getElementById("licenseOverlay");
    licenseOverlay.classList.toggle("hideShowOverlay");
});

// DISPARITION DE LA FENÊTRE DIALOGUE AU CLIC SUR .overlay
document.querySelector(".overlay").addEventListener("click", function () {
    bottomSheet.classList.toggle("open");
    let overlay = document.getElementById("overlay");
    overlay.classList.toggle("hideShowOverlay");
});

// DISPARITION DE LA FENÊTRE DIALOGUE AU CLIC SUR .licenseOverlay
document.getElementById("licenseOverlay").addEventListener("click", function () {
    let LicensebottomSheet = document.querySelector(".licenceBottomSheet");
    LicensebottomSheet.classList.toggle("open");
    let licenseOverlay = document.getElementById("licenseOverlay");
    licenseOverlay.classList.toggle("hideShowOverlay");
});

