app=main-server

logs:
	docker  logs --tail 10 -f ${app}

build-all:
	docker-compose up -d --build

stats:
	docker ps

login:
	docker exec -it ${app} /bin/sh

volumes:
	docker volume ls

stop:
	docker-compose down

sync:
	rsync -av --exclude 'node_modules' --exclude 'public' --exclude '.git' . root@202.182.118.57:/opt/staff-share 

connect-db:
	docker exec -it mysql mysql -u root -p staff-share

build-main:
	docker-compose build main-server
	docker-compose up --no-deps -d main-server

deploy-main: 
	make sync
	ssh root@202.182.118.57 "cd /opt/staff-share && make build-main"

deploy-all:
	make sync
	ssh root@202.182.118.57 "cd /opt/staff-share && make build-all"
	