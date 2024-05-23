# Community Patrols NZ
With the crime rate on the rise in New Zealand, regional committees like the Mt Roskill and Epsom committees conduct their patrols and reports independently, each using different processes. This makes it tedious for the main office to collect, process, and analyse information and statistics. Therefore, CPNZ seeks a universal solution to be used by all committees across New Zealand to simplify the reporting procedure of patrollers and admin work. 

## Team

- Project Manager - Isaac Lee
- Tech Lead - Jason Huang
- Frontend - Seth Yoo
- Frontend - Jay Song
- Frontend - Deasy Lie
- Backend - Tuocheng (Tony) Li
- Backend - Joey Sehan Back
- Backend - Joshua Mak
- Front & Back - Raymond Yang
- Front & Back - Cedric Yu
- Designer - Lucy Zhu
- Tech Consultant - Alex McLeod

## Tech Stack

- React
- Node.js
- Express.js
- Supabase 
- PostgreSQL
- Prisma


## Setup Runbook

1.  Clone the repo locally
```console
git clone https://github.com/UoaWDCC/patrols.git
```
2.  Change directory into the folder.
```console
cd patrols
```

### Frontend
1.  Change directory into web folder.
```console
cd web
```
2.  Install dependancies using yarn or npm
```console
yarn install
```
OR
```console
npm install
```

### Backend
1.  Change directory into web folder.
```console
cd api
```
2.  Install dependancies using yarn or npm
```console
yarn install
```
OR
```console
npm install
```

### Environments
1. Create a .env file inside the API folder with the following variables 
```dosini
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
```
2. Crate a .env file inside the Web folder with the following variables. 
```dosini
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
VITE_API_URL=
```
