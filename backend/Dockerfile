FROM golang:1.23-alpine

ENV GOARCH=amd64
ENV GOOS=linux

RUN apk add --no-cache curl bash libc6-compat \
    && curl -sL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar xz -C /usr/local/bin

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN go build -o /app/main .

RUN ls -l /app

EXPOSE 8080

RUN chmod +x /app/main

CMD ["dockerize", "-wait", "tcp://postgres:5432", "-timeout", "60s", "/app/main"]
