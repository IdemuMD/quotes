# Vurderingskriterier: Dataspillhelter (versjon 3)

Denne vurderingen måler både **funksjonalitet** (at løsningen virker), **kvalitet** (hvordan den er bygget opp), og **systemforståelse** (oppsett av maskin, bruker og sikkerhet).  
For høy måloppnåelse kreves både fungerende kode og gode faglige valg.

---

## Bestått (Karakter 2) – Funksjonelt minimum
- Serveren virker, og **Node/Express** leverer en `index.ejs` på `http://localhost:3000`.  
- Grunnleggende prosjektstruktur er på plass.  
- Brukeren **superpadde** er opprettet med riktig passord (**Passord1**) og har **sudo-rettigheter**.

---

## Karakter 3 – Grunnleggende funksjonalitet
**Kravene til karakter 2 er oppnådd**, og i tillegg:
- Minst én side viser **én av CRUD-funksjonene** (Create, Read, Update eller Delete).  
- SSH-nøkkel for **superpadde** er lagt til og innlogging via nøkkel fungerer.

**Merk:** CRUD innebærer at applikasjonen kan opprette, vise, oppdatere og slette dokumenter i databasen.

---

## Karakter 4 – Fullstendig CRUD og grunnleggende kvalitet
**Kravene til karakter 3 er oppnådd**, og i tillegg:
- CRUD er **fullstendig implementert** (alle fire operasjoner fungerer).  
- Eleven kan **redegjøre for kodekvalitet** (for eksempel struktur, navngivning eller kommentering).  
- **Ryddige commits** i git som viser jevn fremdrift.  
- Prosjektet viser **noen grad av planmessighet**, for eksempel logisk rekkefølge i arbeid eller enkle notater.  
- I prosjektet skal det også ligge en fil kalt `ip-plan.md` som dokumenterer alle hostene i prosjektet, inkludert IP-adresser, gateway og eventuelle andre relevante tilkoblingspunkter.  
- Har en **enkel søkefunksjon** som lar brukeren søke på ett spesifikt felt (for eksempel navn).  
- **SSH er konfigurert til kun å tillate innlogging med nøkkel** (ikke passord).  
- **IP-adresser** følger spesifikasjonen (`10.12.[pool].180` for Node.js, `10.12.[pool].181` for MongoDB).

**Planmessighet:** viser at eleven jobber trinnvis, tester fortløpende og dokumenterer fremdrift på en oversiktlig måte.

---

## Karakter 5 – God kodekvalitet og DRY-prinsipper
**Kravene til karakter 4 er oppnådd**, og i tillegg:
- CRUD er implementert og fungerer stabilt.  
- Koden følger **DRY-prinsippet** og **god praksis** med fornuftige funksjonsnavn og kommentarer.  
- Prosjektet har **oversiktlig struktur** og tydelig ansvarsdeling (MVC).  
- Har **listevisning** fra Read-funksjonen.  
- Har en **avansert søkefunksjon** som kan søke i flere tekstfelter.  
- **Systemoppsett og nettverk** stemmer overens med dokumentasjonen i `ip-plan.md`.

---

## Karakter 6 – Svært høy kvalitet og dokumentert plan
**Kravene til karakter 5 er oppnådd**, og i tillegg:
- En **tydelig plan** er fulgt, eller avvik fra planen er **dokumentert og forklart**.  
  - Planen skal være dokumentert i README eller egen `plan.md`.  
- Viser **høy grad av DRY og kodekvalitet**, med godt strukturerte moduler og gjennomtenkt arkitektur.  
- Har en **utvidet søke- og filterfunksjon** som gjør det mulig å søke på alle relevante attributter og/eller filtrere etter felt.  
- **Listeresultater kan sorteres** etter minst ett felt.  
- MongoDB-serveren er **separat fra serveren som leverer front-end**.

---

**Merk:**  
Elever som oppnår høy måloppnåelse skal kunne forklare egne valg, og vise forståelse for både:
- hvordan **Node.js, Express, EJS og MongoDB** samspiller i løsningen, og  
- hvordan **systemoppsett, SSH-tilgang og IP-konfigurasjon** bidrar til et sikkert og stabilt utviklingsmiljø.
