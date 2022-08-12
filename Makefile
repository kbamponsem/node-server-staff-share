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
	docker exec -it mysql mysql -u root -p"8(tenga-tengai!?09"

migrate-db:
	docker exec mysql /bin/bash -c "mysql -u staffshare -p27a2c3e21340998fb6b7f95b0b621f6456825aed58f5edaf62e2d4bfb1582eae < docker-entrypoint-initdb.d/1.sql"

build-main:
	docker-compose build staff-share
	docker-compose up --no-deps -d staff-share

deploy-main: 
	make sync
	ssh root@202.182.118.57 "cd /opt/server/staff-share && make build-main"

deploy-all:
	make sync
	ssh root@202.182.118.57 "cd /opt/server/staff-share && make build-all"
	