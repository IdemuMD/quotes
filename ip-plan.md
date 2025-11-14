# IP-Plan for Dataspillhelter Prosjekt

## Oversikt
Dette dokumentet beskriver IP-adressene og nettverkskonfigurasjonen for maskinene som brukes i Dataspillhelter-prosjektet.

## Maskiner og IP-adresser

| Komponent | IP-adresse | Bruker | Autentisering | Kommentar |
|------------|-------------|--------|----------------|------------|
| Node.js-server | `10.12.[pool].180` | superpadde | SSH-nøkkel | Må være sudo |
| MongoDB-server (valgfri) | `10.12.[pool].181` | superpadde | SSH-nøkkel | Egen VM om ønskelig |

## Gateway
- Alle maskiner bruker samme gateway: `10.12.[pool].1`

## Brukerkonfigurasjon
- Bruker: `superpadde`
- Passord: `Passord1`
- SSH-nøkkel: Samme nøkkel som utlevert tidligere i kurset
- Rettigheter: sudo

## Sikkerhet
- SSH-nøkkel autentisering (ingen passord)
- Brannmur: Tillat kun nødvendig trafikk (SSH, HTTP)

## Notater
- Erstatt `[pool]` med din tildelte pool-nummer
- Dokumenter eventuelle endringer i denne filen
