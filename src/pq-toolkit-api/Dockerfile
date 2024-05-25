FROM python:3.10-slim

WORKDIR /app/

ENV PYTHONPATH=/app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x prestart.sh

EXPOSE 8787
