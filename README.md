# AMOGED-D4 - Plateforme Intelligente de Gestion des Déchets

AMOGED-D4 est une solution moderne et interactive destinée à révolutionner la gestion des déchets pour la Mairie de Douala 4ème. Ce prototype réaliste offre un écosystème complet permettant aux citoyens de signaler des incidents liés aux déchets, aux agents d'intervenir sur le terrain, et aux administrateurs de superviser l'ensemble des opérations via un tableau de bord analytique.

## 🌟 Fonctionnalités Principales

### 👨‍👩‍👧‍👦 Portail Citoyen
- **Signalement d'incidents :** Formulaire interactif avec géolocalisation et prise de photos.
- **Suivi des requêtes :** Statut en temps réel des signalements (En attente, En cours, Résolu).
- **Calendrier de collecte :** Planning des passages des camions poubelles selon la zone de résidence.
- **Notifications :** Alertes personnalisées sur l'avancement des requêtes et les annonces de la mairie.

### 👷‍♂️ Espace Agent de Terrain
- **Mes Missions :** Vue centralisée des interventions assignées.
- **Résolution :** Possibilité d'ajouter des notes, des photos de preuve et de mettre à jour le statut après l'intervention.

### 👨‍💼 Espace Administrateur / Superviseur
- **Tableau de Bord :** Statistiques en temps réel, taux de résolution et cartographie des incidents.
- **Gestion des Signalements :** Assignation des agents sur les signalements remontés par les citoyens.
- **Notifications Système :** Alertes pour les signalements critiques et suivi de l'activité globale.

## 🛠 Technologies Utilisées
- **Frontend :** React 18 avec TypeScript
- **Stylisation :** Tailwind CSS
- **Gestion d'état :** Zustand (avec persistance)
- **Cartographie :** Leaflet & React-Leaflet
- **Graphiques :** Recharts
- **Iconographie :** Lucide React

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm ou yarn

### Installation
1. Clonez le dépôt (si applicable) :
   ```bash
   git clone <url-du-repo>
   cd amoged-d4-waste-management-mvp
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

### Lancement en mode développement
Pour lancer l'application en local :
```bash
npm run dev
```
Ouvrez ensuite `http://localhost:5173` dans votre navigateur.

## 🔐 Authentification & Rôles
L'application gère différents rôles avec des accès spécifiques. Pour tester l'application, voici des identifiants valides à utiliser sur la page de connexion :

### 1. Administrateur
- **Email :** `admin@amoged-d4.cm`
- **Mot de passe :** `Admin@2026`

### 2. Superviseur
- **Email :** `supervisor1@amoged-d4.cm`
- **Mot de passe :** `Supervisor@2026`

### 3. Citoyen
- **Email :** `emmanuel.ngono0@gmail.com`
- **Mot de passe :** `Citizen@2026`

### 4. Agent de Terrain
- **Email :** `agent1@amoged-d4.cm`
- **Mot de passe :** `Agent@2026`

## 🐳 Déploiement Docker
Un `Dockerfile` est fourni pour conteneuriser l'application avec **Nginx**, idéal pour un environnement de production.

**Commande unique (build + lancement) :**
```bash
docker build -t amoged-d4-mvp . && docker run -d -p 8088:80 --name amoged-d4 amoged-d4-mvp
```

L'application sera alors accessible sur `http://localhost:8088`.

> **Note :** Pour arrêter et supprimer le conteneur : `docker rm -f amoged-d4`

## 📄 Licence
Mairie de Douala 4ème © 2026 - Tous droits réservés.
