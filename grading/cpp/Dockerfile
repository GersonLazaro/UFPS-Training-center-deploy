#-------------------------------------------------------------------------------#
# Grading for c++ code                                                          #
# Based on Ubuntu 16.04                                                         #
#-------------------------------------------------------------------------------#


# Pull base image
FROM ubuntu:16.04

# Container Basic Info 
MAINTAINER GERSON LAZARO

# Update the repository sources list
RUN apt-get -qq update
RUN apt-get -y upgrade
RUN apt-get -y clean
RUN apt-get install -f

# Install the language/compiler
RUN apt-get install -qqy --no-install-recommends build-essential

# Install utils
RUN apt-get install -y sudo
RUN apt-get install -y bc

VOLUME /files 

