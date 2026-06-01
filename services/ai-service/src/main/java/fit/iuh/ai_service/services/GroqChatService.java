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

    // ── Keyword lists ────────────────────────────────────────────────────────────

    /** Event categories / music genres that always imply a search query. */
    private static final java.util.Set<String> EVENT_CATEGORY_KEYWORDS = java.util.Set.of(
        "âm nhạc", "am nhac", "lễ hội", "le hoi", "festival", "concert", "show",
        "nhạc", "nhac", "kịch", "kich", "nghệ thuật", "nghe thuat", "thể thao",
        "the thao", "phim", "hài", "hai", "rock", "pop", "rap", "edm", "jazz",
        "opera", "ballet", "múa", "mua", "triển lãm", "trien lam", "hội chợ",
        "hoi cho", "hot", "trending", "nổi bật", "noi bat", "hay", "đặc sắc", "dac sac"
    );

    /** Vietnamese city names — always a functional (search) indicator. */
    private static final java.util.Set<String> CITY_KEYWORDS = java.util.Set.of(
        "hà nội", "ha noi", "hồ chí minh", "ho chi minh", "hcm", "tp.hcm", "sài gòn", "sai gon",
        "đà nẵng", "da nang", "hải phòng", "hai phong", "cần thơ", "can tho",
        "nha trang", "huế", "hue", "đà lạt", "da lat", "vũng tàu", "vung tau",
        "bình dương", "binh duong", "đồng nai", "dong nai", "an giang", "quảng ninh",
        "quang ninh", "thanh hóa", "thanh hoa"
    );

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
            trimmed.contains("tên gì") || 
            trimmed.contains("ten gi") || 
            trimmed.contains("làm được gì") || 
            trimmed.contains("lam duoc gi") || 
            trimmed.contains("chào cả nhà") ||
            trimmed.contains("hôm nay thế nào")) {
            return true;
        }

        // 3. Event category keywords always indicate a search query (not general)
        for (String kw : EVENT_CATEGORY_KEYWORDS) {
            if (trimmed.contains(kw)) return false;
        }

        // 4. City name keywords always indicate a search query
        for (String city : CITY_KEYWORDS) {
            if (trimmed.contains(city)) return false;
        }
        
        // 5. Catch very short inputs (e.g. less than 5 words) without functional keywords
        String[] words = trimmed.split("\\s+");
        if (words.length < 5) {
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
                                           trimmed.contains("lịch") || 
                                           trimmed.contains("lich") ||
                                           trimmed.contains("có không") ||
                                           trimmed.contains("nào");
            if (!hasFunctionalKeyword) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Strip leaked raw tool-call JSON fragments that some local models (Ollama)
     * accidentally include in text content instead of the proper function-call channel.
     *
     * <p>Examples of strings we want to remove:
     * <pre>
     *   {"name": "searchEventTool", "arguments": {...}}
     *   ronics\n{"name": ...}
     *   </tool_call>
     * </pre>
     */
    private String sanitizeResponse(String response) {
        if (response == null || response.isBlank()) {
            return "Xin lỗi, tôi chưa tìm được thông tin phù hợp. Bạn có thể thử lại với từ khóa khác không?";
        }

        // Detect and remove raw tool-call JSON blocks like {"name": "...", "arguments": ...}
        boolean hasToolCallLeak = response.contains("\"name\":") &&
                (response.contains("searchEventTool") || response.contains("getTicketPolicyTool") ||
                 response.contains("\"arguments\":"));
        boolean hasToolCallTag = response.contains("</tool_call>") || response.contains("<tool_call>");
        boolean hasRawJson = response.trim().startsWith("{") && response.contains("\"name\":");

        if (hasToolCallLeak || hasToolCallTag || hasRawJson) {
            // Attempt to strip the JSON block — remove everything from the first '{' that looks like a tool call
            String cleaned = response
                .replaceAll("(?s)\\{[^{}]*\"name\"\\s*:\\s*\"(?:searchEventTool|getTicketPolicyTool)[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}", "")
                .replaceAll("(?s)<tool_call>[^<]*</tool_call>", "")
                .replaceAll("ronics", "")
                .trim();

            if (cleaned.isBlank() || cleaned.length() < 10) {
                // The entire response was a tool call leak — return a friendly placeholder
                return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại nhé!";
            }
            return cleaned;
        }

        return response;
    }

    @Override
    public String chat(String userMessage) {
        var spec = chatClient.prompt()
                .system(getSystemPrompt())
                .user(userMessage);
        if (!isGeneralQuery(userMessage)) {
            spec = spec.functions("searchEventTool", "getTicketPolicyTool");
        }
        String raw = spec.call().content();
        return sanitizeResponse(raw);
    }

    @Override
    public reactor.core.publisher.Flux<String> streamChat(String userMessage) {
        try {
            if (!isGeneralQuery(userMessage)) {
                // If it is a functional query that requires tools, Ollama/Spring AI streaming with functions is buggy.
                // We fallback to synchronous call and emit the complete result as a single Flux chunk.
                String fullResponse = chat(userMessage);
                return reactor.core.publisher.Flux.just(fullResponse);
            }

            // For general queries (greetings, simple talks), we can stream safely.
            return chatClient.prompt()
                    .system(getSystemPrompt())
                    .user(userMessage)
                    .stream()
                    .content();
        } catch (Exception e) {
            return reactor.core.publisher.Flux.error(e);
        }
    }
}
