#  Choisir image de base.
FROM node:20-alpine
# Définir le dossier de travail.
WORKDIR /app
# Copier des fichiers dans l’image.
COPY package*.json ./
# Exécuter une commande pendant la construction de l’image.
RUN npm install

COPY . .
# Indiquer le port utilisé par l’application.
EXPOSE 3000
# Définir la commande exécutée au démarrage du conteneur.
CMD ["npm", "run", "dev"]
