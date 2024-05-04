FROM postgres:15.3

RUN apt-get update && apt-get install -y git curl
RUN apt-get update && apt-get install -y gcc make build-essential libz-dev zlib1g-dev strace libssl-dev pkg-config libclang-dev postgresql-server-dev-15

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN cargo install --version 0.9.8 cargo-pgrx
RUN cargo pgrx init --pg15=/usr/lib/postgresql/15/bin/pg_config

RUN git clone https://github.com/zombodb/zombodb.git
WORKDIR /zombodb
RUN git checkout v3000.2.4
RUN cargo pgrx install --release

WORKDIR /
RUN rm -rf /zombodb

RUN echo en_US.UTF-8 UTF-8 > /etc/locale.gen
RUN locale-gen en_US.UTF-8
