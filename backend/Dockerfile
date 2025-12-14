FROM python:3.13.11-slim

WORKDIR /srv
COPY . .

RUN pip install uv
RUN uv sync

ENTRYPOINT ["fastapi", "run", "app.main"]
CMD ["--reload"]
