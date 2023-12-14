// Déclenche l'évènement quand le HTML est chargé
document.addEventListener("DOMContentLoaded", function () {
    // Déclaration des variables
    const registerForm = document.getElementById("registerForm");

    // Ajout d'un écouteur d'événement pour le soumission du formulaire
    registerForm.addEventListener('submit', async (e) => {
        // Empêche la soumission du formulaire par défaut
        e.preventDefault();

        // Récupération des valeurs des champs du formulaire avec trim()
        const pseudo = document.getElementById("pseudo").value.trim();
        const email = document.getElementById("email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const password = document.getElementById("password").value.trim();
        const rgpd = document.getElementById("rgpd");

        // CONDITIONS DE VALIDATION DU FORMULAIRE

        // Validation du pseudo
        if (pseudo.length < 3) {
            console.log("Le pseudo est trop court, il doit contenir au moins 3 caractères.");
            return false;  // Arrête l'exécution si la validation échoue
        }

        // Validation de l'adresse e-mail
        if (!emailRegex.test(email)) {
            console.log("Adresse e-mail invalide.");
            return false;
        }

        // Validation du mot de passe
        if (!/[A-Z]/.test(password)) {
            console.log("Le mot de passe doit contenir au moins une lettre majuscule.");
            return false;
        }

        if (!/[0-9]/.test(password)) {
            console.log("Le mot de passe doit contenir au moins un chiffre.");
            return false;
        }

        if (!/[!@#$%^&*]/.test(password)) {
            console.log("Le mot de passe doit contenir au moins un caractère spécial.");
            return false;
        }

        if (password.length < 16) {
            console.log("Le mot de passe est trop court, il doit contenir au moins 16 caractères.");
            return false;
        }

        // Validation de la case à cocher RGPD
        if (!rgpd.checked) {
            console.log("La case RGPD doit être cochée.");
            return false;
        }

        // Construction du corps de la requête
        const requestBody = {
            pseudo,
            email,
            password
        };

        // Requête d'enregistrement vers l'API
        try {
            const response = await fetch("https://music.freefakeapi.io/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            // Analyse du corps de la réponse
            const data = await response.json();
            console.log('Réponse complète du serveur lors de l\'enregistrement :', response);
            console.log('Corps de la réponse du serveur lors de l\'enregistrement :', data);

            // Vérification du succès de la requête d'enregistrement
            if (response.ok) {
                // Enregistrement réussi
                console.log('Enregistrement réussi !');
                console.log('Réponse du serveur lors de l\'enregistrement :', data);

                // Redirection vers la page de connexion
                window.location.href = "connection.html";

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

                    if (loginResponse.ok) {
                        // Connexion réussie, récupération du token et stockage dans le localStorage
                        localStorage.setItem('token', loginData.token);
                        console.log("Token d'accès: " + loginData.token);
                        console.log('Connexion réussie !');
                        // Redirection vers la page d'accueil
                        window.location.href = 'home_page.html';
                    } else {
                        // Affichage d'un message d'erreur en cas d'échec de la connexion
                        console.log('Erreur lors de la connexion : ' + loginData.error);
                    }
                } catch (error) {
                    console.error('Erreur lors de la connexion : ', error);
                }
            } else {
                // Affichage d'un message d'erreur en cas d'échec de l'enregistrement
                console.log('Erreur lors de l\'enregistrement : ' + data.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement : ', error);
        }
    });
});
