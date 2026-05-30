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
        this.chatClient = builder.build();
    }

    private String getSystemPrompt() {
        java.time.ZonedDateTime nowICT = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh"));
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss, 'ngày' dd/MM/yyyy");
        String formattedDateTime = nowICT.format(formatter);

        return """
                Bạn là TicketBox AI Agent – trợ lý thông minh có khả năng suy luận (Reasoning) và hành động (Acting - ReAct).
                Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sự kiện và giải đáp các thắc mắc về chính sách.

                ### THỜI GIAN HIỆN TẠI (DÙNG ĐỂ TÍNH CÁC NGÀY KHÁC VÀ TRẢ LỜI KHÁCH HÀNG):
                Thời gian hiện tại ở Việt Nam là: %s (Múi giờ Việt Nam, ICT).

                ### CÔNG CỤ HIỆN CÓ:
                1. `searchEventTool`: Dùng để tìm kiếm sự kiện theo từ khóa, danh mục, thành phố, giá vé, khoảng thời gian, địa điểm cụ thể và nhà tổ chức.
                2. `getTicketPolicyTool`: Dùng để tra cứu các quy định về chính sách hoàn/đổi/trả vé, độ tuổi tham gia, và quy định ăn uống tại sự kiện.

                ### QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
                1. Hãy suy nghĩ từng bước (Thought) xem câu hỏi của người dùng cần những thông tin gì. Chọn công cụ phù hợp để gọi.
                2. Có thể gọi liên tiếp nhiều công cụ hoặc gọi một công cụ nhiều lần nếu người dùng hỏi câu hỏi phức tạp (ví dụ: vừa tìm sự kiện vừa hỏi chính sách hoàn vé).
                3. TUYỆT ĐỐI KHÔNG tự bịa đặt thông tin sự kiện hoặc chính sách quy định. Tất cả phải dựa trên thông tin trả về từ các công cụ.
                4. Khi công cụ searchEventTool trả về kết quả sự kiện, BẮT BUỘC phải bao gồm link đặt vé theo định dạng chính xác trong trường 'bookingUrl' của mỗi sự kiện:
                   https://localhost:8443/event/{eventId}
                5. Không đề xuất các sự kiện đã hết hạn hoặc sự kiện trong quá khứ.
                6. Khi gọi công cụ (tool call), TUYỆT ĐỐI KHÔNG truyền giá trị null hoặc chuỗi rỗng cho bất kỳ tham số nào. Nếu một tham số không có thông tin hoặc không cần thiết, bạn PHẢI loại bỏ hoàn toàn (omit) tham số đó khỏi danh sách đối số truyền vào công cụ.

                ### HƯỚNG DẪN TRẢ LỜI:
                - Trả lời thân thiện, ngắn gọn và hữu ích bằng tiếng Việt.
                - Trình bày rõ ràng các sự kiện tìm được: tên sự kiện, ngày giờ, địa điểm, giá vé và link đặt vé.
                - Đối với các câu hỏi về chính sách, hãy trích dẫn câu trả lời từ getTicketPolicyTool.
                - TUYỆT ĐỐI KHÔNG hiển thị các phần suy nghĩ (Thought), lập luận, hay quá trình phân tích nội bộ trong câu trả lời cuối cùng gửi cho khách hàng. Chỉ đưa ra câu trả lời trực tiếp và thân thiện.
                """.formatted(formattedDateTime);
    }

    private boolean isSimpleGreeting(String message) {
        if (message == null) {
            return false;
        }
        String trimmed = message.trim().toLowerCase();
        return trimmed.equals("hello") || 
               trimmed.equals("hi") || 
               trimmed.equals("xin chào") || 
               trimmed.equals("xinchao") || 
               trimmed.equals("chào bạn") || 
               trimmed.equals("chaoban") || 
               trimmed.equals("chào") || 
               trimmed.equals("chao") || 
               trimmed.equals("bắt đầu") || 
               trimmed.equals("bat dau") || 
               trimmed.equals("greetings");
    }

    @Override
    public String chat(String userMessage) {
        var spec = chatClient.prompt()
                .system(getSystemPrompt())
                .user(userMessage);
        if (!isSimpleGreeting(userMessage)) {
            spec = spec.functions("searchEventTool", "getTicketPolicyTool");
        }
        return spec.call().content();
    }

    @Override
    public reactor.core.publisher.Flux<String> streamChat(String userMessage) {
        try {
            var spec = chatClient.prompt()
                    .system(getSystemPrompt())
                    .user(userMessage);
            if (!isSimpleGreeting(userMessage)) {
                spec = spec.functions("searchEventTool", "getTicketPolicyTool");
            }
            return spec.stream().content();
        } catch (Exception e) {
            return reactor.core.publisher.Flux.error(e);
        }
    }
}
