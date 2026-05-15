package com.wallet.ai.controller;

import com.wallet.ai.service.AIAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIAssistantService aiAssistantService;

    public AIChatController(AIAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam String message, @RequestParam Long userId) {
        String response = aiAssistantService.chatWithAgent(message, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/insight")
    public ResponseEntity<String> getInsight(@RequestParam Long userId) {
        String insight = aiAssistantService.generateAutonomousInsight(userId);
        return ResponseEntity.ok(insight);
    }

    @PostMapping(value = "/chat/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> chatWithVoice(@RequestParam("audio") MultipartFile audioFile, 
                                                @RequestParam("userId") Long userId) {
        try {
            Resource audioResource = audioFile.getResource();
            String responseText = aiAssistantService.chatWithVoice(audioResource, userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("text/plain;charset=UTF-8"));
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(responseText);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/chat/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> chatWithImage(@RequestParam(value = "image", required = true) MultipartFile imageFile,
                                                @RequestParam(value = "message", required = false) String message,
                                                @RequestParam("userId") Long userId) {
        try {
            Resource imageResource = imageFile.getResource();
            String responseText = aiAssistantService.chatWithImage(imageResource, message, userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("text/plain;charset=UTF-8"));
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(responseText);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }
}
