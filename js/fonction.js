// Configuration des images
const images = [
  "./img/hero.png",
  "./img/tile_roche.png",
  "./img/tile_cristal.png",
  "./img/tile_vide.png",
  "./img/icone_cristal.png",
  "./img/pasteque.png",
];

// initialisation du score et de l'energie
let score = 0;
let energie = 40;
let maxCristaux = 38;

// Creation de grille pour le jeu
const creerGrilleJeu = () => {
  afficherEnergie();

  // dimensions de la grille
  const hauteur = 15;
  const largeur = 20;
  // recuperation de l'interface ou la grille sera
  const grilleRocher = document.getElementById("grille");

  // On vide la div par mesure de precaution
  grilleRocher.innerHTML = "";
  grilleRocher.style.gridTemplateColumns = `repeat(${largeur}, 1fr)`;
  grilleRocher.style.gridTemplateRows = `repeat(${hauteur}, 1fr)`;

  // Création d'une grille contenant des pierres (tableau a deux dimensions)
  const grille = Array(hauteur)
    .fill()
    .map(() =>
      Array(largeur).fill({
        type: "pierre",
        image: images[1],
      })
    );

  // Positionnement des cristaux
  positionnerCristaux(grille, largeur, hauteur);

  // Positionnement  du mineur
  const centreY = Math.floor(hauteur / 2);
  const centreX = Math.floor(largeur / 2);

  // Création du nouveau mineur
  grille[centreY][centreX] = {
    x: centreX,
    y: centreY,
    type: "mineur",
    image: images[0],
  };

  grille.mineur = grille[centreY][centreX];

  // Positionner les fruits
  positionnerFruit(grille, largeur, hauteur);

  // Remplissage visuel
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < largeur; x++) {
      const caseElement = document.createElement("div");
      caseElement.className = "case";
      caseElement.dataset.x = x;
      caseElement.dataset.y = y;

      const cell = grille[y][x];
      let imgSrc = "";
      let altText = "";

      if (cell?.type === "cristal") {
        imgSrc = images[2];
        altText = "cristal";
      } else if (cell?.type === "mineur") {
        imgSrc = images[0];
        altText = "mineur";
      } else if (cell?.type === "fruit") {
        imgSrc = images[5];
        altText = "fruit";
      } else {
        imgSrc = images[1];
        altText = "pierre";
      }

      caseElement.innerHTML = `<img src="${imgSrc}" class="img" alt="${altText}">`;
      grilleRocher.appendChild(caseElement);
    }
  }

  return grille;
};

// Fonction pour positionner les cristaux
const positionnerCristaux = (grille, largeur, hauteur) => {
  for (let i = 0; i < maxCristaux; i++) {
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

// Fonction pour positionner les fruits pour donner de l'energie
const positionnerFruit = (grille, largeur, hauteur) => {
  for (let i = 0; i < 5; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * largeur);
      y = Math.floor(Math.random() * hauteur);
    } while (
      grille[y][x]?.type === "cristal" ||
      grille[y][x]?.type === "mineur" ||
      grille[y][x]?.type === "fruit"
    );

    grille[y][x] = {
      x: x,
      y: y,
      type: "fruit",
      image: images[5],
    };
  }
};

// Déplacement du mineur
const deplacerMineur = (direction, grille) => {
  const endGameElem = document.getElementById("resultat");
  const estVisible = endGameElem.style.display === "flex";

  // Si l'énergie est épuisée ou que l'écran de fin est visible, on arrête
  if (energie <= 0 || estVisible) return;

  // Trouver le mineur dans la grille
  const mineur = grille.flat().find((caseObj) => caseObj?.type === "mineur");
  if (!mineur) return;

  const hauteur = grille.length;
  const largeur = grille[0]?.length;

  let newX = mineur.x;
  let newY = mineur.y;

  // Calcul des nouvelles coordonnées en fonction de la direction
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

  // Vérification des limites de la grille
  if (newX >= 0 && newX < largeur && newY >= 0 && newY < hauteur) {
    // Récupérer la position prochaine du mineur dans la grille
    const positionMineur = grille[newY][newX];

    // Vérifier si la position du mineur contient un cristal ou un fruit
    const contientCristal = positionMineur?.type === "cristal";
    const contientFruits = positionMineur?.type === "fruit";

    // Déterminer si la case cible est une pierre ou un cristal
    const estPierreOuCristal =
      positionMineur?.type === "pierre" || positionMineur?.type === "cristal";

    // coordonnées de l'ancienne position du mineur
    const ancienneX = mineur.x;
    const ancienneY = mineur.y;
    // coordonnees de la nouvelle position du moineur
    mineur.x = newX;
    mineur.y = newY;

     // Mise à jour de la grille : déplacer le mineur
    grille[newY][newX] = mineur;

    // Mise à jour visuelle
    const anciennePosition = document.querySelector(
      `.case[data-x="${ancienneX}"][data-y="${ancienneY}"]`
    );
    const nouvellePosition = document.querySelector(
      `.case[data-x="${newX}"][data-y="${newY}"]`
    );

    if (nouvellePosition && anciennePosition) {
      anciennePosition.innerHTML = `<img src="${images[3]}" class="img" alt="mineur">`;
      nouvellePosition.innerHTML = `<img src="${images[0]}" class="img" alt="mineur">`;
    }

    // Décrémenter l'énergie uniquement si la case cible est une pierre ou un cristal
    if (estPierreOuCristal || contientFruits ) {
      updateEnergie(contientFruits);
    }

    // Mise à jour du score si un cristal est collecté
    updateScore(contientCristal);

    // Vérifier si la partie est terminée
    if (energie === 0) {
      endGame();
    }
  }
};

// Mise à jour du score
const updateScore = (contientCristal) => {
  if (contientCristal) {
    score++;
    document.getElementById("nombreCristaux").textContent = score;
    document.getElementById(
      "cristalResultat"
    ).innerHTML = `Cristaux : ${score} <img src="${images[4]}" alt="cristal" class="img-icon">`;
    if (score === maxCristaux) {
      endGame();
    }
  }
};

// Mise à jour de l'énergie
const updateEnergie = (contientFruits) => {
  if (contientFruits) {
    // Les fruits donnent de l'énergie
    energie = Math.min(energie + 2, 40);
  } else {
    // Miner coûte de l'énergie
    if (energie > 0) {
      energie--;
    }
  }
  afficherEnergie();
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

  // Création d'une nouvelle grille
  const nouvelleGrille = creerGrilleJeu();

  return nouvelleGrille;
};

export { creerGrilleJeu, deplacerMineur, rejouerPartie };
