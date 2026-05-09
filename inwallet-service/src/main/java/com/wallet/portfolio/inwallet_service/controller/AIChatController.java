package com.wallet.portfolio.inwallet_service.controller;

import com.wallet.portfolio.inwallet_service.service.AIAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final AIAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam String message, @RequestParam Long userId) {
        String response = aiAssistantService.chatWithAgent(message, userId);
        return ResponseEntity.ok(response);
    }
}
