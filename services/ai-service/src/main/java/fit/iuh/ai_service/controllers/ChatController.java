package fit.iuh.ai_service.controllers;

import fit.iuh.ai_service.dtos.ChatRequest;
import fit.iuh.ai_service.dtos.ChatResponse;
import fit.iuh.ai_service.services.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ChatController — exposes the conversational AI endpoint backed by Groq
 * (llama3-70b-8192) with function-calling via {@code searchEventTool}.
 *
 * <pre>
 *   POST /api/chat/ask
 *   Request:  { "message": "Cho tôi xem các sự kiện âm nhạc tại Hà Nội" }
 *   Response: { "reply": "Dưới đây là các sự kiện âm nhạc tại Hà Nội..." }
 * </pre>
 */
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Vui lòng nhập câu hỏi của bạn."));
        }

        log.debug("Chat request received: '{}'", request.getMessage());

        try {
            String reply = chatService.chat(request.getMessage());
            log.debug("Chat reply generated ({} chars)", reply != null ? reply.length() : 0);
            return ResponseEntity.ok(new ChatResponse(reply));
        } catch (Exception ex) {
            log.error("LLM call failed for message '{}': {}", request.getMessage(), ex.getMessage(), ex);
            return ResponseEntity.internalServerError()
                    .body(new ChatResponse(
                            "⚠️ Xin lỗi, trợ lý AI tạm thời không phản hồi được. Vui lòng thử lại sau ít phút."));
        }
    }

    @PostMapping(value = "/stream", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public reactor.core.publisher.Flux<org.springframework.http.codec.ServerSentEvent<String>> streamChat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return reactor.core.publisher.Flux.just(
                org.springframework.http.codec.ServerSentEvent.builder("Vui lòng nhập câu hỏi của bạn.").build()
            );
        }

        log.debug("Chat stream request received: '{}'", request.getMessage());

        return chatService.streamChat(request.getMessage())
                .map(chunk -> org.springframework.http.codec.ServerSentEvent.builder(chunk).build())
                .onErrorResume(ex -> {
                    log.error("LLM stream call failed for message '{}': {}", request.getMessage(), ex.getMessage(), ex);
                    return reactor.core.publisher.Flux.just(
                        org.springframework.http.codec.ServerSentEvent.builder("⚠️ Xin lỗi, trợ lý AI gặp sự cố khi tải kết quả. Vui lòng thử lại sau ít phút.").build()
                    );
                });
    }
}
