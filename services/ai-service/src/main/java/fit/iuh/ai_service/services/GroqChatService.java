package fit.iuh.ai_service.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import fit.iuh.ai_service.config.AiToolConfig;


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

    /**
     * After the LLM generates its response, replace any event-card section it
     * wrote with the exact markdown captured in {@link AiToolConfig#LAST_SEARCH_OUTPUT}.
     *
     * <p>Local Ollama models often reorder or reformat the tool result and
     * accidentally swap event IDs in deep-links. By overriding the event
     * section with our own formatted output we guarantee correct links.
     *
     * <p>Strategy:
     * <ol>
     *   <li>If no tool was called (ThreadLocal is empty), return {@code response} as-is.</li>
     *   <li>Extract the LLM's intro text (everything before the first event bullet).</li>
     *   <li>Append the authoritative tool output after the intro.</li>
     * </ol>
     */
    private String restoreSearchOutput(String response) {
        String toolOutput = AiToolConfig.LAST_SEARCH_OUTPUT.get();
        AiToolConfig.LAST_SEARCH_OUTPUT.remove(); // always clean up to avoid leaks

        if (toolOutput == null || toolOutput.isBlank()) {
            return response; // no tool was called — nothing to restore
        }

        // Find where the LLM started writing event bullets so we can keep
        // only the intro sentence(s) and discard the potentially-wrong events.
        int bulletIdx = response.indexOf("- **");
        if (bulletIdx > 0) {
            String intro = response.substring(0, bulletIdx).trim();
            return intro + "\n\n" + toolOutput;
        }

        // Fallback: LLM did not use the bullet format (e.g. numbered list).
        // Try to find the first numbered-list entry like "1. **" or "1."
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(?m)^\\d+[.)][\\s*]")
                .matcher(response);
        if (m.find() && m.start() > 0) {
            String intro = response.substring(0, m.start()).trim();
            return intro + "\n\n" + toolOutput;
        }

        // If no recognisable list structure, just append the authoritative
        // output so at least the user can see the correct links.
        return response.trim() + "\n\n" + toolOutput;
    }

    @Override
    public String chat(String userMessage) {
        // Clear any stale ThreadLocal from a previous call on this thread
        AiToolConfig.LAST_SEARCH_OUTPUT.remove();

        var spec = chatClient.prompt()
                .system(getSystemPrompt())
                .user(userMessage);
        if (!isGeneralQuery(userMessage)) {
            spec = spec.functions("searchEventTool", "getTicketPolicyTool");
        }
        String raw = spec.call().content();
        String sanitized = sanitizeResponse(raw);
        return restoreSearchOutput(sanitized);
    }


    /**
     * Splits a string into small tokens suitable for simulated streaming.
     * We split on whitespace boundaries, keeping the whitespace attached to the
     * preceding word so the reconstructed text is identical to the original.
     */
    private static String[] tokenise(String text) {
        // Split after every space/newline so each token carries its trailing whitespace
        return text.split("(?<=[ \t\n])|(?=\n)");
    }

    @Override
    public reactor.core.publisher.Flux<String> streamChat(String userMessage) {
        try {
            if (!isGeneralQuery(userMessage)) {
                // Function-calling + streaming is unreliable on Ollama, so we do a
                // synchronous round-trip for the tool result, then re-emit the
                // complete text token-by-token to keep the SSE "typewriter" effect.
                String fullResponse = chat(userMessage);
                String[] tokens = tokenise(fullResponse);

                // Emit one token every 25 ms — fast enough to feel live, slow enough
                // for the frontend to render word-by-word.
                return reactor.core.publisher.Flux
                        .interval(java.time.Duration.ofMillis(25))
                        .take(tokens.length)
                        .map(idx -> tokens[(int)(long) idx]);
            }

            // For general queries (greetings, simple talks), use real streaming.
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
