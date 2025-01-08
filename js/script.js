// Faire l’appel à l’API avec fetch afin de récupérer dynamiquement les projets de l’architecte :

async function getWorks() { // fonction asynchrone pour gérer les opérations nécessitant des délais
    const url = "http://localhost:5678/api/works"; // Définit l'URL de l'API qui retourne les données des travaux (URL issue du Swagger Get/Works)
    try {
        const response = await fetch(url); // Envoie une requête GET à l'API (await permet d'attendre la réponse sans bloquer l'exécution)
        if (!response.ok) { // Vérifie si la réponse n'est pas réussie (code HTTP autre que 200 etc) Le point d'exclamation inverse la valeur logique
            throw new Error(`Response status: ${response.status}`); // si pas réussie
        }

        const json = await response.json(); // si réussie, fetch la réponse au format json
        console.log(json);

        // Parcourt chaque élément du tableau JSON
        for (let i = 0; i < json.length; i++) {
            // Appelle la fonction pour créer une figure pour chaque élément
            setFigure(json[i]);
        }
    } catch (error) {
        console.log(error.message);
    }
}
// Appelle la fonction principale pour récupérer les travaux et les afficher
getWorks();


// Fonction pour créer une balise <figure> et l'ajouter à la galerie
function setFigure(data) {
    const figure = document.createElement("figure");     // Crée une nouvelle balise <figure>
    // Ajoute une image et une légende (<figcaption>) à la balise <figure>
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>     
    <figcaption>${data.title}</figcaption>`;
    figure.setAttribute('data-category', data.categoryId); // Ajoute un attribut data-category pour identifier la catégorie
    figure.setAttribute('data-id', data.id); // Ajoute un attribut data-id pour identifier l'élément
    document.querySelector(".gallery").append(figure);     // Ajoute la figure dans l'élément avec la classe CSS "gallery"

    // Crée une figure sans texte pour la modale
    const modalFigure = document.createElement("figure"); // Crée une nouvelle balise <figure>
    modalFigure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
    <i class="fa-regular fa-trash-can delete-icon"></i>`; // Icône de corbeille
    modalFigure.setAttribute('data-category', data.categoryId); // Ajoute un attribut data-category pour identifier la catégorie
    modalFigure.setAttribute('data-id', data.id); // Ajoute un attribut data-id pour identifier l'élément
    document.querySelector(".modal-gallery").append(modalFigure); // Ajoute la figure dans la modale

    // Ajoute un écouteur d'événement pour supprimer la figure
    modalFigure.querySelector(".delete-icon").addEventListener("click", async () => {
        const id = data.id;
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, { // Envoie une requête DELETE à l'API
                method: 'DELETE', 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                figure.remove(); // Supprime la figure de la galerie
                modalFigure.remove(); // Supprime la figure de la modale
            } else { 
                console.error('Suppression figure depuis API impossible'); // Affiche un message d'erreur
            }
        } catch (error) { 
            console.error('Error:', error);
        }
    });
}

// GESTION DES CATEGORIES et FILTRES

async function getCategories() { // fonction asynchrone pour gérer les opérations nécessitant des délais
    const url = "http://localhost:5678/api/categories"; // Définit l'URL de l'API qui retourne les données des categories (URL issue du Swagger Get/Works/categories)
    try {
        const response = await fetch(url); // Envoie une requête GET à l'API (await permet d'attendre la réponse sans bloquer l'exécution)
        if (!response.ok) { // Vérifie si la réponse n'est pas réussie (code HTTP autre que 200 etc) Le point d'exclamation inverse la valeur logique
            throw new Error(`Response status: ${response.status}`); // si pas réussie
        }

        const json = await response.json(); // si réussie, fetch la réponse au format json
        console.log(json);

        // Ajoute la catégorie "Tous" avec l'ID 0
        const allCategories = [{ id: 0, name: "Tous" }, ...json];

        // Ajoute un écouteur d'événement pour le bouton "Tous"
        const filterAllButton = document.getElementById("filter-all");
        filterAllButton.addEventListener("click", () => {
            const figures = document.querySelectorAll(".gallery figure");
            figures.forEach(figure => {
                figure.style.display = "block"; // Affiche toutes les figures
            });
            setActiveFilter(filterAllButton); // Définit le bouton "Tous" comme actif
        });

        // Définit le bouton "Tous" comme actif par défaut
        setActiveFilter(filterAllButton);

        // Parcourt chaque élément du tableau JSON
        for (let i = 0; i < json.length; i++) {
            // Appelle la fonction pour créer un filtre pour chaque élément
            setFilter(json[i]);
        }
    } catch (error) {
        console.log(error.message);
    }
}
getCategories();


function setFilter(data) {
    const div = document.createElement("div"); // Crée une nouvelle balise <div>
    div.innerHTML = data.name; // Définit le contenu de la div avec le nom de la catégorie
    div.addEventListener("click", () => {
        const figures = document.querySelectorAll(".gallery figure");
        figures.forEach(figure => {
            if (figure.getAttribute('data-category') === data.id.toString() || data.id === 0) { //  Vérifie si la catégorie de la figure correspond à la catégorie cliquée. toString() convertit le nombre en chaîne de caractères. data.id === 0 pour la catégorie "Tous"
                figure.style.display = "block"; // Affiche les figures de la catégorie
            } else {
                figure.style.display = "none"; // Cache les autres figures
            }
        });
        setActiveFilter(div); // Définit le bouton cliqué comme actif
    });
    document.querySelector(".div-container").append(div); // Ajoute une div enfant de la div-container
}

function setActiveFilter(activeDiv) {
    // Supprime la classe active de tous les boutons de filtre
    const filters = document.querySelectorAll(".div-container > div");
    filters.forEach(filter => {
        filter.classList.remove("active");
    });

    // Ajoute la classe active au bouton de filtre cliqué
    activeDiv.classList.add("active");
}

// GESTION LOGIN/LOGOUT

const loginLogoutLink = document.getElementById("login-logout");
const token = localStorage.getItem("token"); // Récupère le token stocké dans le localStorage

// Cache le bouton "modifier" par defaut
document.getElementById("modifier").style.display = "none";

if (token) { // Si le token existe
    // Crée et ajoute la bannière en mode édition
    const editModeBanner = document.createElement("div"); // Crée une nouvelle balise <div>
    editModeBanner.id = "edit-mode-banner";
    editModeBanner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><span>Mode édition</span>`;
    document.body.insertBefore(editModeBanner, document.body.firstChild); // Insère la bannière en premier élément du body

    loginLogoutLink.textContent = "logout"; // Modifie le texte
    loginLogoutLink.href = "#"; // Pour que le lien ne redirige pas vers une autre page
    loginLogoutLink.addEventListener("click", () => { // Ecouteur d'événement pour la déconnexion
        localStorage.removeItem("token"); // Supprime le token du localStorage
        window.location.href = "index.html"; // Redirige vers la page d'accueil
    });
    document.querySelector(".div-container").style.display = "none";
    document.getElementById("modifier").style.display = "block";
    document.getElementById("modifier").addEventListener("click", () => {
        // Ouvre la fenêtre modale
        document.querySelector("#gallery-modal").style.display = "block";
    });
} else {
    loginLogoutLink.textContent = "login"; // Modifie le texte
    loginLogoutLink.href = "login.html"; // Redirige vers la page de connexion
    document.querySelector(".div-container").style.display = "flex";
    document.getElementById("modifier").style.display = "none";
}

// Ferme la modale - bouton croix
document.querySelectorAll(".close-button").forEach(button => {
    button.addEventListener("click", () => {
        button.closest(".modal").style.display = "none";
        clearAddPhotoModal();
    });
});

// Ferme la modale - clic overlay
window.addEventListener("click", (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        clearAddPhotoModal();
    }
});

// Ouvre la nouvelle modale d'ajout de photo
document.getElementById("add-photo-button").addEventListener("click", () => {
    document.querySelector("#gallery-modal").style.display = "none";
    document.querySelector("#add-photo-modal").style.display = "flex";
});

// Bouton de retour modale d'ajout de photo
document.querySelector(".back-button").addEventListener("click", () => {
    document.querySelector("#add-photo-modal").style.display = "none";
    document.querySelector("#gallery-modal").style.display = "flex";
    clearAddPhotoModal();
});

// Liste déroulante des catégories
async function CategoryListChoice() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const categories = await response.json();
        const categorySelect = document.getElementById("photo-category");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.log(error.message);
    }
}
CategoryListChoice();


// Fonction Miniature bouton ajout image
function handleThumbnailPreview(event) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) { // Si un fichier est sélectionné
        const reader = new FileReader(); // Crée un objet FileReader
        reader.onload = (e) => { // Ecouteur d'événement pour la fin du chargement
            const img = document.createElement("img"); // Crée une nouvelle balise <img>
            img.src = e.target.result; // Définit la source de l'image
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            const photoUploadBox = document.querySelector(".photo-upload-box");
            const inputElement = document.getElementById("upload-photo-button");
            const labelElement = document.querySelector("label[for='upload-photo-button']");
            photoUploadBox.innerHTML = ""; // Efface le contenu de photo-upload-box
            photoUploadBox.appendChild(inputElement); // Ré-ajoute l'élément <input> (nécessaire pour la soumission du formulaire)
            photoUploadBox.appendChild(img); // Ajoute l'image à la place
        };
        reader.readAsDataURL(file); // Lit le contenu du fichier sous forme d'URL de données
    }
}
document.getElementById("upload-photo-button").addEventListener("change", handleThumbnailPreview);


// Activer/désactiver le bouton "Valider" en fonction des champs remplis
function toggleValidateButton() {
    const title = document.getElementById("photo-title").value;
    const category = document.getElementById("photo-category").value;
    const fileInput = document.getElementById("upload-photo-button");
    const file = fileInput.files[0];
    const validateButton = document.getElementById("validate-photo-button");

    if (title && category && file) {
        validateButton.classList.remove("buttondisabled");
    } else {
        validateButton.classList.add("buttondisabled");
    }
}
document.getElementById("photo-title").addEventListener("input", toggleValidateButton);
document.getElementById("photo-category").addEventListener("change", toggleValidateButton);
document.getElementById("upload-photo-button").addEventListener("change", toggleValidateButton);

// Ajouter l'image à la galerie et à l'API
document.getElementById("validate-photo-button").addEventListener("click", async () => {
    const title = document.getElementById("photo-title").value; // Récupère le titre de la photo
    const category = document.getElementById("photo-category").value; // Récupère la catégorie
    const fileInput = document.getElementById("upload-photo-button"); // Récupère l'élément <input> de type "file"
    const file = fileInput.files[0]; // Récupère le fichier sélectionné

    if (title && category && file) { // Vérifie si tous les champs sont remplis
        const formData = new FormData(); // Crée un objet FormData
        formData.append("title", title); // Ajoute le titre à l'objet FormData
        formData.append("category", category); // Ajoute la catégorie
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:5678/api/works", { // Envoie une requête POST à l'API
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData // Envoie l'objet FormData
            });

            if (response.ok) {
                const newWork = await response.json(); // Récupère le travail ajouté
                setFigure(newWork); // Ajoute la nouvelle figure à la galerie via la fonction SetFigure du départ
                document.querySelector("#add-photo-modal").style.display = "none"; // Ferme la modale2
                document.querySelector("#gallery-modal").style.display = "flex"; // Ouvre la modale1 (optionnel)
                console.log("Photo ajoutée avec succès");
                alert("Photo ajoutée avec succès !");
                clearAddPhotoModal();
            } else {
                console.error("Erreur lors de l'ajout de la photo");
                alert("Erreur lors de l'ajout de la photo");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de l'ajout de la photo");
        }
    } else {
        console.error("Tous les champs ne sont pas remplis");
        alert("Tous les champs ne sont pas remplis");
    }
});

// Fonction pour vider les champs de la modale d'ajout de photo
function clearAddPhotoModal() { 
    document.getElementById("photo-title").value = ""; // Efface le titre
    document.getElementById("photo-category").value = ""; // Efface la catégorie
    const photoUploadBox = document.querySelector(".photo-upload-box");
    photoUploadBox.innerHTML = `
        <i class="fa-regular fa-image"></i>
        <label for="upload-photo-button" class="button-upload-box">+ Ajouter une photo</label>
        <input type="file" id="upload-photo-button" class="button-upload-box" accept="image/png, image/jpeg">
        <p>jpg, png : 4mo max</p>
    `;
    document.getElementById("upload-photo-button").addEventListener("change", handleThumbnailPreview); // Ré-attache l'écouteur d'événement pour la fct Miniature bouton ajout image
}






