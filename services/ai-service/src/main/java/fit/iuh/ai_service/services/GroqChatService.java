package fit.iuh.ai_service.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * GroqChatService — Spring AI ChatClient backed by the Groq OpenAI-compatible
 * endpoint (llama3-70b-8192, temperature 0.2).
 *
 * <p>Configuration is driven by {@code application.yml}:
 * <pre>
 *   spring.ai.openai.base-url=https://api.groq.com/openai/v1
 *   spring.ai.openai.api-key=${GROQ_API_KEY}
 *   spring.ai.openai.chat.options.model=llama3-70b-8192
 *   spring.ai.openai.chat.options.temperature=0.2
 * </pre>
 *
 * <p>The {@code searchEventTool} function bean is registered in
 * {@link fit.iuh.ai_service.config.AiToolConfig} and bound here via
 * {@code ChatClient.Builder#defaultFunctions}. Spring AI will automatically
 * inject the tool manifest (name + @Description) into the model's system
 * context and handle the function-call / function-result round-trip.
 */
@Service
public class GroqChatService implements ChatService {

    private final ChatClient chatClient;

    public GroqChatService(ChatClient.Builder builder) {
        String systemPrompt = """
                Bạn là trợ lý AI chính thức của TicketBox – nền tảng đặt vé sự kiện số 1 Việt Nam.

                ### THỜI GIAN HIỆN TẠI (DÙNG ĐỂ TÍNH CÁC NGÀY KHÁC):
                Hôm nay là ngày: %s.

                ### QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
                1. TUYỆT ĐỐI KHÔNG bịa đặt thông tin sự kiện. Mọi thông tin sự kiện (tên, giá, ngày, địa điểm) \\
                PHẢI đến từ kết quả của công cụ searchEventTool.
                2. BẮT BUỘC dùng công cụ searchEventTool cho MỌI câu hỏi liên quan đến sự kiện. Không được tự trả lời nếu chưa dùng công cụ. \\
                Khi người dùng hỏi về sự kiện, vé, buổi biểu diễn, lịch tổ chức, giá vé, hoặc bất kỳ \\
                câu hỏi nào liên quan đến tìm kiếm sự kiện, BẮT BUỘC phải gọi công cụ searchEventTool TRƯỚC \\
                khi trả lời. KHÔNG được trả lời dựa trên kiến thức có sẵn của bạn.
                3. Khi công cụ trả về kết quả sự kiện, BẮT BUỘC phải bao gồm link đặt vé theo định dạng \\
                chính xác trong trường 'bookingUrl' của mỗi sự kiện. Hiển thị link như sau: \\
                https://localhost:8443/event/{eventId}
                4. Nếu công cụ không tìm thấy sự kiện, hãy thành thật thông báo và gợi ý người dùng thử \\
                từ khóa khác hoặc danh mục khác.
                5. Không được đề xuất sự kiện từ năm 2024 trở về trước hoặc sự kiện đã hết hạn.

                ### HƯỚNG DẪN TRẢ LỜI:
                - Trả lời bằng tiếng Việt (trừ khi người dùng dùng ngôn ngữ khác).
                - Trình bày kết quả sự kiện rõ ràng: tên sự kiện, ngày giờ, địa điểm, giá vé, link đặt vé.
                - Giữ câu trả lời thân thiện, ngắn gọn và hữu ích.
                - Nếu người dùng hỏi về quy trình đặt vé, hỗ trợ thanh toán, hoặc câu hỏi chung, \\
                hãy giải thích rõ ràng mà không cần gọi công cụ.
                """.formatted(java.time.LocalDate.now().toString());

        this.chatClient = builder
                .defaultSystem(systemPrompt)
                .defaultFunctions("searchEventTool")
                .build();
    }

    @Override
    public String chat(String userMessage) {
        return chatClient
                .prompt()
                .user(userMessage)
                .call()
                .content();
    }

    @Override
    public reactor.core.publisher.Flux<String> streamChat(String userMessage) {
        return chatClient
                .prompt()
                .user(userMessage)
                .stream()
                .content();
    }
}
