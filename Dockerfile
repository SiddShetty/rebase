FROM python:3.6
COPY . /opt/app
WORKDIR /opt/app

ENV AWS_REGION=eu-central-1
ENV SERVICE_NAME="adam"
ENV STAGE=docker

ARG ARTIFACTORY_PWD
ENV ARTIFACTORY_PWD=$ARTIFACTORY_PWD

# AWS vars
ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# NPM
RUN echo "➜ npm install 😱"
RUN apt-get update && apt-get install -y vim npm
RUN npm install -g npm@latest
RUN echo $NPM_RC | cut -d ' ' -f2 > .npmrc
RUN npm config set @amenity:registry https://amenity.jfrog.io/amenity/api/npm/npm-amenity
RUN npm install
RUN npm i -g serverless

RUN pip install awscli

RUN echo "➜ Upgrading pip, installing pipenv"
RUN pip install --upgrade pip pipenv

RUN echo "➜ Starting to install packages, Hooopa....."
RUN pipenv sync -d

RUN echo "Done! ✅"

