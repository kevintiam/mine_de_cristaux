// les images a utiliser pour notre jeu
const type = ["mineur", "pierre", "cristal", "vide"];
const images = {
  mineur: "./img/hero.png",
  pierre: "./img/tile_roche.png",
  cristal: "./img/tile_cristal.png",
  vide: "./img/tile_vide.png",
};

const grille = () => {
  // recuperation de l'interface ou la grille sera
  const grilleRocher = document.getElementById("grille");

  // On vide la div par mesure de precaution
  grilleRocher.innerHTML = "";

  // dimensions de la grille
  const hauteur = 15;
  const largeur = 20;

  // Création d'une grille contenant des pierres (tableau a deux dimensions)
  const grille = Array(hauteur)
    .fill()
    .map(() => Array(largeur).fill(null));

  for (let i = 0; i < hauteur; i++) {
    for (let j = 0; j < largeur; j++) {
      const caseImage = document.createElement("div");
      caseImage.className = "case";

      const cell = (grille[i][j] = {
        y: i,
        x: j,
        type: "vide",
        src: images.vide,
        alt: "case vide",
      });

      caseImage.style.backgroundImage = `url(${cell.src})`;
      caseImage.style.backgroundSize = "cover";
      caseImage.title = cell.alt;

      grilleRocher.appendChild(caseImage); 
    }
  }
};
