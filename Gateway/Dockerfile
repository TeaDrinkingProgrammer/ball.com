FROM rust:1.67 as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path .

FROM debian:latest
COPY --from=builder /usr/local/cargo/bin/gateway /usr/local/bin/gateway
CMD ["gateway"]