package fit.iuh.ticket_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.RepublishMessageRecoverer;
import org.springframework.boot.amqp.autoconfigure.SimpleRabbitListenerContainerFactoryConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;

@Configuration
public class RabbitConfig {

    @Value("${booking.messaging.queue}")
    private String bookingQueue;

    @Bean
    public Queue bookingDlq() {
        return new Queue(bookingQueue + ".dlq", true);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            SimpleRabbitListenerContainerFactoryConfigurer configurer,
            ConnectionFactory connectionFactory,
            RabbitTemplate rabbitTemplate
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        configurer.configure(factory, connectionFactory);
        factory.setDefaultRequeueRejected(false);
        factory.setAdviceChain(RetryInterceptorBuilder.stateless()
                .maxRetries(3)
                .backOffOptions(1000, 2.0, 10000)
                .recoverer(new RepublishMessageRecoverer(rabbitTemplate, "", bookingQueue + ".dlq"))
                .build());
        return factory;
    }
}
