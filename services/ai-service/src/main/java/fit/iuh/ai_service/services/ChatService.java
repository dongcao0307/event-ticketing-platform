package fit.iuh.ai_service.services;

/**
 * ChatService defines the contract for interacting with an LLM.
 */
public interface ChatService {

    /**
     * Sends a user message to the LLM and returns the AI's text reply.
     *
     * @param userMessage the raw text from the user
     * @return the AI-generated response string
     */
    String chat(String userMessage);

    /**
     * Streams the user message to the LLM and returns a Flux stream of text chunks.
     *
     * @param userMessage the raw text from the user
     * @return a Flux of streaming response chunks
     */
    reactor.core.publisher.Flux<String> streamChat(String userMessage);
}

