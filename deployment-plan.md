# Utrullingsplan for Dataspillhelter

## Oversikt
Denne planen beskriver hvordan Dataspillhelter-applikasjonen skal implementeres i oppdragsgivers miljø.

## Forutsetninger
- Ubuntu Server 22.04 LTS
- Node.js 18+ installert
- MongoDB installert (lokalt eller på egen VM)
- SSH-tilgang med nøkkelautentisering

## Trinn-for-trinn utrulling

### 1. Klargjøring av server
```bash
# Oppdater systemet
sudo apt update && sudo apt upgrade -y

# Installer nødvendige pakker
sudo apt install -y curl wget git ufw

# Sett opp brannmur
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw --force enable
```

### 2. Installer Node.js og npm
```bash
# Installer fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc

# Installer Node.js
fnm install 18
fnm use 18
```

### 3. Installer MongoDB
```bash
# Importer MongoDB public GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Lag liste-fil for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.asc ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Klone og konfigurer applikasjonen
```bash
# Klone repository
git clone [repository-url] dataspillhelter
cd dataspillhelter

# Installer avhengigheter
npm install

# Konfigurer miljøvariabler
cp .env.example .env
# Rediger .env med riktige verdier
```

### 5. Seed databasen
```bash
# Kjør seed-script
node scripts/seed.js
```

### 6. Start applikasjonen
```bash
# Start med npm
npm start

# Eller for produksjon
npm install -g pm2
pm2 start app.js --name dataspillhelter
pm2 startup
pm2 save
```

## Overvåking og vedlikehold
- Sjekk applikasjonslogger: `pm2 logs dataspillhelter`
- MongoDB-status: `sudo systemctl status mongod`
- Oppdater applikasjonen: `git pull && npm install && pm2 restart dataspillhelter`

## Feilsøking
- Sjekk port 3000: `netstat -tlnp | grep 3000`
- MongoDB-tilkobling: `mongosh --eval "db.runCommand('ping')"`
- Brannmur-regler: `sudo ufw status`

## Videreutvikling
- Implementer flere EJS-partials for bedre gjenbruk
- Legg til autentisering og autorisering
- Optimaliser database-spørringer
- Implementer caching for bedre ytelse
