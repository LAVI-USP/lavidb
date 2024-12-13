package br.usp.eesc.lavidb.rabbit;

import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SenderConfig {

    @Value("${spring.rabbitmq.queue}")
    private String message;

    @Bean
    public Queue queue() {
        return new Queue(message, true);
    }
}
