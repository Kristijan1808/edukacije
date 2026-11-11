# EduStudio

Besplatna full-stack aplikacija za izradu edukacija, lekcija i interaktivnih kvizova.

## Tehnologije
- Angular 20 (standalone, responsive)
- Node.js + Express + TypeScript
- PostgreSQL 16
- Prisma ORM
- Lokalni AI: Ollama (opcionalno)
- SCORM 1.2 ZIP i PPTX export

## Lokalno pokretanje

### Preduvjeti
- Node.js 22.12+ (Angular 20 podržava i odgovarajuće Node 20/24 verzije)
- Docker Desktop ili lokalni PostgreSQL
- npm

### 1. Instalacija
```bash
npm install
cp api/.env.example api/.env
```
Windows PowerShell:
```powershell
Copy-Item api/.env.example api/.env
```

### 2. Baza
```bash
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 3. Pokretanje
```bash
npm run dev
```
- Frontend: http://localhost:4200
- API: http://localhost:3000
- Demo korisnik: `demo@edustudio.local` / `demo1234`

## Opcionalni besplatni lokalni AI
1. Instalirajte Ollama.
2. Preuzmite model, primjerice:
```bash
ollama pull gemma3:4b
```
3. Provjerite u `api/.env`:
```env
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="gemma3:4b"
```
AI se koristi samo za prijedlog strukture lekcija iz zalijepljenog teksta. Aplikacija radi i bez njega.

## Što je implementirano
- Registracija i prijava
- Dashboard edukacija
- Preporučeni predlošci
- Vizualni editor i promjena redoslijeda blokova
- Tekst, slika, tipka, single/multi choice, pisani odgovor, matching i drop-zone blokovi
- Lekcije, postavke kviza i Prisma modeli za random pitanja, shuffle, prolaznost i feedback
- Upload materijala do 25 MB
- PPTX export
- Osnovni SCORM 1.2 paket s `imsmanifest.xml`
- Modeli za upise, pokušaje, rezultate i izvještaje
- Responsivan prikaz za desktop, tablet i mobitel

## Važne napomene
- Import PDF/Word/PPTX/SCORM zahtijeva posebne parsere za svaki format. U ovoj verziji upload je implementiran, a AI može strukturirati tekst; produkcijski import treba proširiti ekstrakcijom sadržaja i sigurnosnim provjerama ZIP/XML datoteka.
- SCORM export je funkcionalna osnovna SCORM 1.2 implementacija. Prije produkcije preporučuje se testiranje u ciljnom LMS-u i proširenje runtime praćenja (bookmark, suspend_data, detaljni score).
- Za produkciju dodajte rate limiting, antivirusnu provjeru uploadova, object storage, refresh tokene, e-mail verifikaciju i detaljnije role/permissions.

## Build
```bash
npm run build
npm run start -w api
```
Angular build nalazi se u `web/dist/`.
