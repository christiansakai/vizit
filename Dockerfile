# to build:
# docker build -t="pgbovine/cokapi:v1" .
#
# to test:
# docker run -t -i --rm --user=netuser --net=none --cap-drop all pgbovine/cokapi:v1 bash
#
# remember --rm or else stale old containers will be left around!
# use "docker ps -a" to see all containers

# don't use 'latest' tag since that might change
FROM ubuntu:14.04.1
MAINTAINER Philip Guo <philip@pgbovine.net>

# if apt-get doesn't work, then follow these instructions:
# http://stackoverflow.com/questions/24991136/docker-build-could-not-resolve-archive-ubuntu-com-apt-get-fails-to-install-a
# Uncomment the following line in /etc/default/docker DOCKER_OPTS="--dns 8.8.8.8 --dns 8.8.4.4"
# Restart the Docker service sudo service docker restart
#
# lots of packages required especially to build ruby and to use the compiled version of 'gem'
RUN apt-get update && apt-get install -y \
  nodejs \
  openjdk-7-jdk \
  python \
  build-essential \
  zlibc \
  zlib1g \
  zlib1g-dev \
  libssl-dev


# ugh ubuntu calls node 'nodejs'
RUN ln -s /usr/bin/nodejs /usr/bin/node

# JS and Python backends
RUN mkdir /tmp/javascript

# IMPORTANT: make sure to run 'make deps' in backends/javascript first
# to install the proper node modules inside of here via npm before
# creating this Docker container, since it's a pain to install npm and
# modules within the container. Also untar node-v6.0.0-linux-x64.tar.xz
# (or the proper version of Node so that the proper binary is within the
# directory already before copying into container)
ADD ptjavascript /tmp/javascript

RUN useradd netuser
