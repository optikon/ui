#!/bin/sh

echo "hello world!"

cat > env.json <<- EOM
{
	"OPTIKON_API_URL": "$1",
	"GOOGLE_MAP_KEY": "$2"
}
EOM

npm run start
