// Configuration des images
const images = [
  "/img/mineur.png",
  "/img/pierres.png",
  "/img/cristaux_creuser.png",
];

// Variables globales
let score = 0;
let energie = 40;

// Fonction pour positionner les cristaux
const positionnerCristaux = (grille, largeur, hauteur) => {
  for (let i = 0; i < 25; i++) {
    let x, y;
    const mineurX = Math.floor(largeur / 2);
    const mineurY = Math.floor(hauteur / 2);

    do {
      x = Math.floor(Math.random() * largeur);
      y = Math.floor(Math.random() * hauteur);
    } while (
      (Math.abs(x - mineurX) <= 1 && Math.abs(y - mineurY) <= 1) ||
      grille[y][x]?.type === "cristal"
    );

    grille[y][x] = {
      x: x,
      y: y,
      type: "cristal",
      image: images[2],
    };
  }
};

// Initialisation de la grille
const creerGrilleJeu = () => {
  afficherEnergie();
  const hauteur = 15;
  const largeur = 20;
  const grilleRocher = document.getElementById("grille");
  
  // Nettoyage complet
  grilleRocher.innerHTML = "";
  grilleRocher.style.gridTemplateColumns = `repeat(${largeur}, 1fr)`;
  grilleRocher.style.gridTemplateRows = `repeat(${hauteur}, 1fr)`;

  // Création d'une NOUVELLE grille vierge
  const grille = Array(hauteur).fill().map(() => Array(largeur).fill(null));

  // Positionnement des cristaux
  positionnerCristaux(grille, largeur, hauteur);

  // Positionnement UNIQUE du mineur
  const centreY = Math.floor(hauteur / 2);
  const centreX = Math.floor(largeur / 2);
  
  // Vérification qu'aucun mineur n'existe déjà
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < largeur; x++) {
      if (grille[y][x]?.type === "mineur") {
        grille[y][x] = null;
      }
    }
  }

  // Création du nouveau mineur
  grille[centreY][centreX] = {
    x: centreX,
    y: centreY,
    type: "mineur",
    image: images[0]
  };

  grille.mineur = grille[centreY][centreX];

  // Remplissage visuel
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < largeur; x++) {
      const caseElement = document.createElement("div");
      caseElement.className = "case";
      caseElement.dataset.x = x;
      caseElement.dataset.y = y;

      const cell = grille[y][x];
      let imgSrc = images[1]; // Pierre par défaut
      let altText = "pierre";

      if (cell?.type === "cristal") {
        imgSrc = images[2];
        altText = "cristal";
      } else if (cell?.type === "mineur") {
        imgSrc = images[0];
        altText = "mineur";
      }

      caseElement.innerHTML = `<img src="${imgSrc}" class="img" alt="${altText}">`;
      grilleRocher.appendChild(caseElement);
    }
  }
  
  return grille;
};

// Déplacement du mineur
const deplacerMineur = (direction, grille) => {
    const endGameElem = document.getElementById("resultat");
    const estVisible = endGameElem.style.display === "flex";

  if (energie <= 0 || estVisible) return;

  // Trouver le mineur
  const mineur = grille.flat().find((caseObj) => caseObj?.type === "mineur");
  if (!mineur) return;

  const hauteur = grille.length;
  const largeur = grille[0]?.length;

  let newX = mineur.x;
  let newY = mineur.y;
  switch (direction) {
    case "haut":
      newY--;
      break;
    case "bas":
      newY++;
      break;
    case "gauche":
      newX--;
      break;
    case "droite":
      newX++;
      break;
  }

  // Vérification des limites
  if (newX >= 0 && newX < largeur && newY >= 0 && newY < hauteur) {
    // Mise à jour de l'énergie
    updateEnergie();

    // Vérification de la présence d'un cristal
    const positionMineur = grille[newY][newX];
    const contientCristal = positionMineur?.type === "cristal";

    // Placer le mineur à la nouvelle position
    grille[newY][newX] = mineur;

    // Mise à jour des coordonnées
    const ancienneX = mineur.x;
    const ancienneY = mineur.y;
    mineur.x = newX;
    mineur.y = newY;

    // Mise à jour visuelle
    const anciennePosition = document.querySelector(
      `.case[data-x="${ancienneX}"][data-y="${ancienneY}"]`
    );
    const nouvellePosition = document.querySelector(
      `.case[data-x="${newX}"][data-y="${newY}"]`
    );

    if (nouvellePosition && anciennePosition) {
      anciennePosition.innerHTML = " "; // Remplacer par une pierre
      nouvellePosition.innerHTML = `<img src="${images[0]}" class="img" alt="mineur">`;
    }

    // Mise à jour du score
    updateScore(contientCristal);
  }
};

// Mise à jour du score
const updateScore = (contientCristal) => {
  if (contientCristal) {
    score++;
    document.getElementById("nombreCristaux").textContent = score;
    document.getElementById("cristalResultat").textContent = `Cristaux : ${score}`;
  }
};

// Mise à jour de l'énergie
const updateEnergie = () => {
  if (energie > 0) {
    energie--;
    afficherEnergie();
    if (energie === 0) {
      endGame();
    }
  }
};

// Affichage de l'énergie
const afficherEnergie = () => {
  const barreProgress = document.getElementById("progressBarGreen");
  const energieActuelle = document.getElementById("energie");

  const pourcentage = (energie / 40) * 100;
  barreProgress.style.width = `${pourcentage}%`;
  energieActuelle.textContent = `${energie} / 40`;
};

// Fin de jeu
const endGame = () => {
  const endGameElem = document.getElementById("resultat");
  endGameElem.style.display = "flex";
};

export const mettreAJourAffichageMineur = (grille) => {
  // Par exemple :
  const cellule = document.querySelector(`[data-x='${grille.mineur.x}'][data-y='${grille.mineur.y}']`);
  if (cellule) {
    cellule.classList.add("mineur");
  }
};

// Réinitialisation du jeu
const rejouerPartie = () => {
  // Réinitialisation complète
  score = 0;
  energie = 40;

  // Nettoyage de l'interface
  document.getElementById("cristalResultat").textContent = "Cristaux : 0";
  document.getElementById("nombreCristaux").textContent = "0";
  document.getElementById("resultat").style.display = "none";

  // Nettoyage complet de la grille
  const grilleRocher = document.getElementById("grille");
  grilleRocher.innerHTML = "";

  afficherEnergie();

  // Création d'une NOUVELLE grille
  const nouvelleGrille = creerGrilleJeu();

  return nouvelleGrille;
};

export { creerGrilleJeu, deplacerMineur, updateScore,rejouerPartie };