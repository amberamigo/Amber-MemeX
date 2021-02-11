

# Run the app container on port 8081

docker-compose up -d

chmod +x sleep.sh
./sleep.sh

curl --location --request POST 'http://localhost:8081/memes' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "dup",
"url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNKrTMHoAsqhUNng-pnYZQjFhc-5K7iurhrQ&usqp=CAU",
"caption": "This is a meme"
}'


# Execute the GET /memes endpoint using curl

curl --location --request GET 'http://localhost:8081/memes'

