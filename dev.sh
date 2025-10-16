#! /bin/bash

# Make sure you run `./build.sh` before running this.
sudo docker compose -f ./docker-compose-dev.yml up --remove-orphans &
DATABASE_URL=mysql://bloguser:password@localhost:3306/blog pnpm dev
