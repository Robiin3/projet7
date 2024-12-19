// FORMULAIRE DE CONNEXION
const loginForm = document.getElementById("login-form");
console.log(loginForm);
    loginForm.addEventListener("submit", async function(event) { // Ecouteur d'événement validation formulaire de connexion (clic ou entrée)
        event.preventDefault(); // Empêche le rechargement de la page par défaut

        // récupère les valeurs des champs email et password
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try { // envoie les données au serveur pour vérification
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }) // Convertit les données en chaîne de caractères JSON
            });

            if (!response.ok) { // Vérifie si la réponse n'est pas réussie (code HTTP autre que 200 etc)
                throw new Error(`Erreur: ${response.statusText}`); // si pas réussie
            }

            const data = await response.json();
            
            // Stocke le token dans le localStorage
            localStorage.setItem("token", data.token);

            // Redirige vers la page d'accueil
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erreur lors de la connexion:", error); // Affiche l'erreur dans la console
            alert("Les informations utilisateur / mot de passe ne sont pas correctes"); 
        }
    });