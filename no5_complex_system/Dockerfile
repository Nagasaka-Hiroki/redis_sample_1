FROM node:18.13.0-bullseye

SHELL ["/bin/bash","-c"]

USER root

RUN apt-get update \
 && apt-get upgrade -y \
 && npm install -g wscat

CMD ["/bin/bash"]