FROM mongo:latest

COPY dictionary.json /dictionary.json

ONBUILD RUN mongoimport --host 127.0.0.1 --port 27017 --db test --collection dictionary --authenticationDatabase admin --username root --password example --type json --file dictionary.json --jsonArray