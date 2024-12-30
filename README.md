## To run the project:

```bash
docker compose build
docker compose up
```


## To develop the project:

#### Option 1

```bash
cd wolf-h3viewer-react && npm i && npm run dev

cd backend && npm i && npm run dev

cd backend/services/dggstools && python app.py
```

docker init the PostgreSQL database manually

#### Option 2

 - Start docker

 - Run `Set Up Local Project` VSCode task

 - Stop `backend-1`, `www-1` and `dggstools-1` docker containers
 
 - Restart `npm: dev - backend` VSCode task