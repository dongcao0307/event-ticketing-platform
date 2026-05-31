package fit.iuh.ai_service.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
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

    public GroqChatService(ChatClient.Builder builder, ChatMemory chatMemory) {
        this.chatClient = builder
                .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
                .build();
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

    private boolean isGeneralQuery(String message) {
        if (message == null || message.isBlank()) {
            return true;
        }
        
        String trimmed = message.trim().toLowerCase();
        
        // 1. Check if it is a simple greeting
        if (trimmed.equals("hello") || 
            trimmed.equals("hi") || 
            trimmed.equals("xin chào") || 
            trimmed.equals("xinchao") || 
            trimmed.equals("chào bạn") || 
            trimmed.equals("chaoban") || 
            trimmed.equals("chào") || 
            trimmed.equals("chao") || 
            trimmed.equals("bắt đầu") || 
            trimmed.equals("bat dau") || 
            trimmed.equals("greetings")) {
            return true;
        }
        
        // 2. Catch simple questions like "mấy giờ", "bạn là ai", "tên gì", "làm được gì"
        if (trimmed.contains("mấy giờ") || 
            trimmed.contains("may gio") || 
            trimmed.contains("bạn là ai") || 
            trimmed.contains("ban la ai") || 
            trimmed.contains("ai đó") || 
            trimmed.contains("ai do") || 
            trimmed.contains("tên gì") || 
            trimmed.contains("ten gi") || 
            trimmed.contains("làm được gì") || 
            trimmed.contains("lam duoc gi") || 
            trimmed.contains("chào cả nhà") ||
            trimmed.contains("hôm nay thế nào")) {
            return true;
        }
        
        // 3. Catch very short inputs (e.g. less than 5 words)
        String[] words = trimmed.split("\\s+");
        if (words.length < 5) {
            // Functional keywords: "tìm", "sự kiện", "vé", "mua", "hủy", "hoàn", "đổi", "trả", "show", "concert", "lịch"
            boolean hasFunctionalKeyword = trimmed.contains("tìm") || 
                                           trimmed.contains("tim") ||
                                           trimmed.contains("sự kiện") || 
                                           trimmed.contains("su kien") ||
                                           trimmed.contains("vé") || 
                                           trimmed.contains("ve") ||
                                           trimmed.contains("mua") ||
                                           trimmed.contains("hủy") || 
                                           trimmed.contains("huy") ||
                                           trimmed.contains("hoàn") || 
                                           trimmed.contains("hoan") ||
                                           trimmed.contains("đổi") || 
                                           trimmed.contains("doi") ||
                                           trimmed.contains("trả") || 
                                           trimmed.contains("tra") ||
                                           trimmed.contains("show") || 
                                           trimmed.contains("concert") || 
                                           trimmed.contains("lịch") || 
                                           trimmed.contains("lich");
            if (!hasFunctionalKeyword) {
                return true;
            }
        }
        
        return false;
    }

    @Override
    public String chat(String userMessage) {
        var spec = chatClient.prompt()
                .system(getSystemPrompt())
                .user(userMessage);
        if (!isGeneralQuery(userMessage)) {
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
            if (!isGeneralQuery(userMessage)) {
                spec = spec.functions("searchEventTool", "getTicketPolicyTool");
            }
            return spec.stream().content();
        } catch (Exception e) {
            return reactor.core.publisher.Flux.error(e);
        }
    }
}
