FROM ubuntu:latest
LABEL authors="HomePC"

ENTRYPOINT ["top", "-b"]