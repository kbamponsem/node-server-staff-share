app=staff-share

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
	rsync -av --exclude 'node_modules' --exclude '.git' . root@202.182.118.57:/opt/server/staff-share 

connect-db:
	docker exec -it mysql mysql -u root -p staff-share

build-main:
	docker-compose build staff-share
	docker-compose up --no-deps -d staff-share

deploy-main: 
	make sync
	ssh root@202.182.118.57 "cd /opt/server/staff-share && make build-main"

deploy-all:
	make sync
	ssh root@202.182.118.57 "cd /opt/server/staff-share && make build-all"
	