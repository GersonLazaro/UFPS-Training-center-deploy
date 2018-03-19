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
