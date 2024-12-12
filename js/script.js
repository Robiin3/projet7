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
        console.error(error.message);
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
    document.querySelector(".gallery").append(figure);     // Ajoute la figure dans l'élément avec la classe CSS "gallery"
}

async function getCategories() { // fonction asynchrone pour gérer les opérations nécessitant des délais
    const url = "http://localhost:5678/api/categories"; // Définit l'URL de l'API qui retourne les données des categories (URL issue du Swagger Get/Works/categories)
    try {
        const response = await fetch(url); // Envoie une requête GET à l'API (await permet d'attendre la réponse sans bloquer l'exécution)
        if (!response.ok) { // Vérifie si la réponse n'est pas réussie (code HTTP autre que 200 etc) Le point d'exclamation inverse la valeur logique
            throw new Error(`Response status: ${response.status}`); // si pas réussie
        }

        const json = await response.json(); // si réussie, fetch la réponse au format json
        console.log(json);

        // Parcourt chaque élément du tableau JSON
        for (let i = 0; i < json.length; i++) {
            // Appelle la fonction pour créer un filtre pour chaque élément
            setFilter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCategories();

function setFilter(data) {
    const div = document.createElement("div");     // Crée une nouvelle balise <div>
    div.addEventListener("click, ")
    div.innerHTML = data.name; // Ajoute une div enfant de la div-container
    document.querySelector(".div-container").append(div);
}