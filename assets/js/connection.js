// Déclenche l'évènement quand le HTML est chargé
document.addEventListener("DOMContentLoaded", function () {
    // Déclaration des variables
    const loginForm = document.getElementById("loginForm");

    // Ajout d'un écouteur d'événement pour le soumission du formulaire
    loginForm.addEventListener('submit', async (e) => {
        // Empêche la soumission du formulaire par défaut
        e.preventDefault();

        // Récupération des valeurs des champs du formulaire avec trim()
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Construction du corps de la requête pour la connexion
        const loginRequestBody = {
            email,
            password
        };

        // Requête de connexion vers l'API
        try {
            const loginResponse = await fetch('https://music.freefakeapi.io/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequestBody)
            });

            // Analyse du corps de la réponse de la connexion
            const loginData = await loginResponse.json();
            console.log('Réponse complète du serveur lors de l\'enregistrement :', loginResponse);
            console.log('Corps de la réponse du serveur lors de l\'enregistrement :', loginData);
            if (loginResponse.ok) {
                // Connexion réussie, récupération du token et stockage dans le localStorage
                localStorage.setItem('token', loginData.token);
                console.log("Token d'accès: " + loginData.token);
                console.log('Connexion réussie !');
                // Redirection vers la page d'accueil
                window.location.href = 'homePage.html';
            } else {
                // Affichage d'un message d'erreur en cas d'échec de la connexion
                console.log('Erreur lors de la connexion : ' + loginData.error);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion : ', error);
        }
    });
});