#!/bin/bash
./mvnw -Pprod clean verify -DskipTests=true
sudo docker build . -t lavidb
sudo docker tag lavidb:latest gregoryzanelato/lavidb:latest
sudo docker push gregoryzanelato/lavidb:latest
