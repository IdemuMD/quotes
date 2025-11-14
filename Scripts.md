# 🧩 Bruk av prosjektskript

Dette prosjektet inneholder to hjelpeskript som gjør det enkelt å generere og fylle databasen med data.  
Begge skriptene er **selvstendige** og kan kjøres på enhver maskin med **Node.js** og **MongoDB** installert.

---

## 💾 `seed.js`

### 📘 Formål
`seed.js` er et **alt-i-ett-skript** som både **lager data** og **importerer dem** direkte inn i MongoDB.  
Det brukes vanligvis til å nullstille databasen før en test eller demonstrasjon.

---

### ⚙️ Hva skriptet gjør
1. Genererer automatisk **150 helter** med realistiske data (dyr, mennesker, roboter, romvesener).  
2. Lagrer dataene som `seed/heroes.json`.  
3. Kobler seg til lokal MongoDB på: mongodb://127.0.0.1:27017
4. Sletter (dropper) samlingen `assignment1.heroes`.  
5. Setter inn alle heltene på nytt i databasen.  
6. Lukker tilkoblingen når importen er ferdig.

---

### 🧩 Forutsetninger
- **Node.js** må være installert.  
- **MongoDB** må kjøre lokalt på port **27017**.  
- Installer MongoDB-driveren én gang med:
```bash
npm i mongodb
