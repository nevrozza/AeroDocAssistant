
# https://github.com/shaharv/docker/blob/master/alpine/onnxruntime/Dockerfile

# BUILD .VENV
FROM python:3.13.11-slim AS builder
WORKDIR /venv_build
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync


# RUNTIME
FROM python:3.13.11-slim AS runtime

WORKDIR /airdoc
COPY --from=builder /venv_build/.venv /airdoc/.venv
COPY ./app ./app
ENV PATH="/airdoc/.venv/bin:$PATH"