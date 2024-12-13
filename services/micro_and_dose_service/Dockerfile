FROM python:3.9

RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends zip gzip tar pigz --no-install-suggests  ffmpeg libsm6 libxext6 -y 

WORKDIR /code

COPY . .
COPY .env .env

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN chmod a+x /code/run.sh
CMD ["/code/run.sh"]