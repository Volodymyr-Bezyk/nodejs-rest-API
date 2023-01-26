run:
	docker run -d -p 3000:3000 --env-file .env --rm --name cont volodymyrbezyk/nodeapp
stop:
	docker stop cont