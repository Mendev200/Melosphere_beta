document.addEventListener("DOMContentLoaded", function () {
    let logOut = document.querySelector(".personcircle");

    logOut.addEventListener("click", function () {
        function disconnectUser() {
           window.location.href = "connection.html"
        }

        // Affiche une boîte de dialogue de confirmation
        if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
            // Si l'utilisateur confirme, déconnectez l'utilisateur
            disconnectUser();
        } else {
            // Si l'utilisateur annule, ne faites rien ou effectuez des actions supplémentaires si nécessaire
            console.log("Déconnexion annulée.");
        }
    });
});