# Assignment-1-MVC-and-CRUD

# Oppgave: Dataspillhelter

## Mål
Du skal lage en webapplikasjon som lar brukeren se, legge til, redigere og slette **dataspillhelter**.  
Prosjektet skal bruke **Node.js**, **Express**, **MongoDB** og **EJS**, og følge prinsippene for **MVC-arkitektur**.

Applikasjonen skal kunne kjøre på en egen virtuell maskin i Proxmox, og databasen skal inneholde flere helter med informasjon som for eksempel navn, spill, univers og egenskaper.

---

## Teknologier
- Node.js / Express  
- MongoDB (lokalt eller egen VM)  
- EJS for visning  
- MVC-struktur  

---

## Oppsett
Prosjektet skal kjøres på en VM kalt  
`[elevens navn] – Assignment 1`

De som ønsker å briljere kan installere MongoDB på en egen VM kalt  
`[elevens navn] – mongo-ass 1`.

---

## Maskinoppsett og brukerkrav

Alle maskiner som brukes i prosjektet skal settes opp med felles standard for brukere, tilgang og IP-adresser.

### Bruker
- Det skal opprettes en bruker med brukernavn **superpadde**.  
- Passord skal være **Passord1**.  
- Brukeren **superpadde** skal ha **sudo-rettigheter**.  
- Pålogging skal kun være mulig via **SSH-nøkkel**, ikke passord.  
  - Bruk samme nøkkel som er utlevert tidligere i kurset.

### Nettverk og IP-adresser
- Maskinen som kjører **Node.js** skal ha IP-adresse:  
  `10.12.[pool].180`
- Dersom databasen (MongoDB) ligger på en egen VM, skal denne ha IP-adresse:  
  `10.12.[pool].181`
- Begge maskinene skal bruke samme gateway som angitt i din `ip-plan.md`.

### Sammendrag
| Komponent | IP-adresse | Bruker | Autentisering | Kommentar |
|------------|-------------|--------|----------------|------------|
| Node.js-server | `10.12.[pool].180` | superpadde | SSH-nøkkel | Må være sudo |
| MongoDB-server (valgfri) | `10.12.[pool].181` | superpadde | SSH-nøkkel | Egen VM om ønskelig |

**Tips:**  
Husk å dokumentere begge maskinene i `ip-plan.md` med IP, gateway og formål.

---

## Krav til prosjektet
- Følger **MVC-struktur** med egne mapper for *models*, *views* og *controllers*.  
- Bruker **EJS-views** med minst ett **gjenbrukbart partial** (for eksempel header, footer eller form).  
- Har en **seed-funksjon eller et script** som fyller databasen med eksempeldata.  
  - Seed-scriptet skal kunne brukes til å **nullstille databasen** før for eksempel en demo.  
- Implementerer **CRUD-funksjonalitet** på datasettet:
  - **Create** – legg til nye helter  
  - **Read** – vis helter og detaljer  
  - **Update** – rediger helter  
  - **Delete** – fjern helter  
  - Prosjektet skal ha en enkel **søkefunksjon** som lar brukeren finne helter basert på **minst** ett felt (for eksempel navn, spill eller univers).  
  Søkefunksjonen skal hente resultater direkte fra databasen og vise dem i et eget view eller på samme side som listevisningen.
- Applikasjonen skal kunne startes og brukes via `http://localhost:3000`.

I prosjektmappen skal det også ligge en fil kalt ip-plan.md.  
Denne skal inneholde en oversikt over alle hostene som inngår i prosjektet, inkludert:

- Navn på hver VM som brukes  
- IP-adresser  
- Gateway for hvert nettverk  
- Eventuelle andre relevante tilkoblingspunkter (for eksempel database-VM eller frontend-VM)

Filens hensikt er å dokumentere hvordan prosjektets miljø er satt opp og gjøre det enkelt å gjenoppbygge eller feilsøke løsningen.

---

## Anbefalt fremgangsmåte
Du skal vise at du arbeider **planmessig**, og at du **bygger opp funksjonaliteten gradvis**.  
Del opp arbeidet i små trinn og push jevnlig til Git.

### 1. Grunnleggende oppsett
- Installer og klargjør VM-ene du skal bruke  
  - fnm/nvm, npm/node, MongoDB  
- Opprett prosjektet og bygg førsteversjonen  
  - Lag en enkel forside med EJS  
  - Commit → Push  

### 2. Read-funksjonalitet
- Implementer visning av helter (Read)  
- Lag nødvendige views for visning av lister og detaljer  
- Commit → Push  

### 3. Øvrig CRUD
- Implementer neste funksjon i CRUD-syklusen (Create/Update/Delete)  
- Test funksjonaliteten fortløpende  
- Commit → Push  

---

## Ekstra utfordringer 
- Bruk flere EJS-partials (navbar, cards, modaler osv.)  
- Legg til søk og filtrering på flere attributter (for eksempel navn, spill, univers)  
- Implementer relasjoner i databasen (for eksempel helter ↔ spill)  
- Gi applikasjonen enkel styling eller bruk et CSS-rammeverk  
- Flytt databasen til egen MongoDB-VM  
- sett opp brannmur og sørg for at kun ønsket trafikk kommer gjennom.

---