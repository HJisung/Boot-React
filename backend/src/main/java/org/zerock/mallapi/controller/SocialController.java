package org.zerock.mallapi.controller;

import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.service.MemberService;
import org.zerock.mallapi.util.JWTUtil;

@RestController
@RequiredArgsConstructor
public class SocialController {
    private final MemberService memberService;
    @Value("${kakao.rest-api-key:}") private String restApiKey;
    @Value("${kakao.redirect-uri}") private String redirectUri;

    @GetMapping("/api/member/kakao/config")
    public Map<String, Object> kakaoConfig() {
        return Map.of("configured", !restApiKey.isBlank(), "restApiKey", restApiKey, "redirectUri", redirectUri);
    }

    @PostMapping("/api/member/kakao")
    public Map<String, Object> getMemberFromKakao(@RequestBody Map<String, String> request) {
        MemberDTO member = memberService.getKakaoMemberFromCode(request.get("code"));
        Map<String, Object> claims = new HashMap<>(member.getClaims());
        claims.put("accessToken", JWTUtil.generateToken(member.getClaims(), 10));
        claims.put("refreshToken", JWTUtil.generateToken(member.getClaims(), 60 * 24));
        return claims;
    }

    @PutMapping("/api/member/modify")
    public ResponseEntity<Map<String, String>> modify(@RequestBody MemberModifyDTO dto, Authentication authentication) {
        if (authentication == null || !authentication.getName().equals(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "ERROR_ACCESSDENIED"));
        }
        memberService.modifyMember(dto);
        return ResponseEntity.ok(Map.of("result", "modified"));
    }
}
