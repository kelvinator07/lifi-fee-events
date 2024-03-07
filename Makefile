include .env

mongodb:
	docker run --name mongodb -p 27017:27017 -e MONGODB_INITDB_ROOT_USERNAME=${MONGODB_USER} -e MONGODB_INITDB_ROOT_PASSWORD=${MONGODB_PASSWORD} -d mongo:7.0.5-jammy

mongodb-stop:
	docker stop mongodb && docker rm mongodb

server:
	npm run start

test:
	npm run test

docker:
	docker compose up

docker-down:
	docker compose down
 
.PHONY: mongodb mongodb-stop server test docker docker-down
