#-------------------------------------------------------------------------------#
# Grading for java code                                                         #
# Based on Ubuntu 16.04                                                         #
#-------------------------------------------------------------------------------#


# Pull base image
FROM ubuntu:16.04

# Container Basic Info 
MAINTAINER GERSON LAZARO

# Update the repository sources list
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y clean
RUN apt-get install -f

# Install the language/compiler
RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java8-installer

# Install utils
RUN apt-get install -y sudo
RUN apt-get install -y bc

#ENVIRONMENT
ENV _JAVA_OPTIONS=Xmx512M

