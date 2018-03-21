#-------------------------------------------------------------------------------#
# Backend for UFPS Training Center                                              #
# Based on Node v8 (LTS)                                                        #
#-------------------------------------------------------------------------------#

# Pull base image
FROM node:carbon

# Container Basic Info 
MAINTAINER GERSON LAZARO
MAINTAINER MELISSA DELGADO

# Create app directory
WORKDIR /usr/src/app

# Install docker CE
RUN apt-get update && \
    apt-get -y install apt-transport-https \
      ca-certificates \
      curl \
      gnupg2 \
      software-properties-common && \
    curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
    add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
      $(lsb_release -cs) \
      stable" && \
   apt-get update && \
   apt-get -y install docker-ce


# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

#Define environment variables
ENV PORT 8080
ENV DEBUG *

# Bundle app source
COPY . .

#Expose container port
EXPOSE 8080

#Volumes
VOLUME /files 

#Initial command
CMD [ "npm", "start" ]
