import os
import json
import logging
import secrets
import ssl
import pika
import sys
from datetime import datetime
import pytz
from simulation_pipeline import simulate_images


class Consumer(object):
    RABBIT_QUEUE_NAME = None
    RABBIT_HOST = None
    RABBIT_PORT = None
    RABBIT_USER = None
    RABBIT_PASS = None
    RABBIT_VHOST = None
    LOG_LEVEL = None
    rabbit_connection = None
    logger = None

    def __init__(self):
        self.load_parameter()
        self.logger = logging.getLogger()
        log_level = logging.INFO
        if self.LOG_LEVEL == "DEBUG":
            log_level = logging.DEBUG

        self.logger.setLevel(log_level)
        formater = logging.Formatter("%(asctime)s %(levelname)-8s %(message)s")

        # create stream handler
        streamhdlr = logging.StreamHandler(sys.stdout)
        streamhdlr.setFormatter(formater)
        self.logger.addHandler(streamhdlr)

        self.logger.info("LaviDB : SIMULATION-PIPELINE")
        self.rabbit_connection = self.rabbit_connect()
        self.consume()

    def load_parameter(self):
        self.LOG_LEVEL = os.getenv("LOG_LEVEL")
        self.RABBIT_QUEUE_NAME = os.getenv("RABBIT_QUEUE_NAME")
        self.RABBIT_HOST = os.getenv("RABBIT_HOST")
        self.RABBIT_PORT = os.getenv("RABBIT_PORT")
        self.RABBIT_USER = os.getenv("RABBIT_USER")
        self.RABBIT_PASS = os.getenv("RABBIT_PASS")
        self.RABBIT_VHOST = os.getenv("RABBIT_VHOST")
        return

    def consume(self) -> None:

        try:
            self.logger.info("Start consuming...")
            channel = self.rabbit_connection.channel()
            channel.queue_declare(queue=self.RABBIT_QUEUE_NAME, durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(
                queue=self.RABBIT_QUEUE_NAME,
                on_message_callback=self.callback,
                auto_ack=False,
            )
            channel.start_consuming()
            self.logger.info("Consuming messages!")
        except Exception as e:
            self.logger.error(f"Error connecting rabbitmq => {e}")

    def callback(self, ch, method, properties, body):
        try:
            self.logger.info(f"Message received!")
            payload = json.loads(body)

            simulate_images(payload, self.logger)

            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            self.logger.error(f"Error executing pipeline => {e}")

    def rabbit_connect(self):
        self.logger.info("Connecting to rabbitmq...")
        # ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        # ssl_context.set_ciphers("ECDHE+AESGCM:!ECDSA")
        credentials = pika.PlainCredentials(self.RABBIT_USER, self.RABBIT_PASS)
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=self.RABBIT_HOST,
                port=self.RABBIT_PORT,
                virtual_host=self.RABBIT_VHOST,
                credentials=credentials,
                # ssl_options=pika.SSLOptions(context=ssl_context),
                heartbeat=0,
                # blocked_connection_timeout=43200000
            )
        )
        self.logger.info("Rabbitmq connected!")
        return connection


Consumer()
