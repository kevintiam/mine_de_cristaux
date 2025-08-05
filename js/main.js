import { creerGrilleJeu, deplacerMineur, rejouerPartie } from "./fonction.js"; 

let grilleCourante; 

// Initialisation du jeu au démarrage 
const initialisationJeu = () => { 
  grilleCourante = creerGrilleJeu(); 
}; 

// Récupère les boutons de déplacement 
const btnHaut = document.getElementById("haut"); 
const btnBas = document.getElementById("bas"); 
const btnGauche = document.getElementById("gauche"); 
const btnDroite = document.getElementById("droite"); 

// Ajoute les événements de déplacement 
btnHaut.addEventListener("click", () => deplacerMineur("haut", grilleCourante)); 
btnBas.addEventListener("click", () => deplacerMineur("bas", grilleCourante)); 
btnGauche.addEventListener("click", () => deplacerMineur("gauche", grilleCourante)); 
btnDroite.addEventListener("click", () => deplacerMineur("droite", grilleCourante)); 

// Bouton Quitter : affiche l’écran de fin 
document.getElementById("quitter").addEventListener("click", () => { 
  document.getElementById("resultat").style.display = "flex"; }); 

  // Bouton Rejouer : réinitialise les variables et la grille 
document.getElementById("rejouer").addEventListener("click", () => { 
  grilleCourante = rejouerPartie(); }); 
  
  // Lancement initial 
  initialisationJeu();