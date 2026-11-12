package org.zerock.mallapi.controller;

import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.util.CustomJWTException;
import org.zerock.mallapi.util.JWTUtil;

@RestController
public class APIRefreshController {
    @RequestMapping("/api/member/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken) {
        if (refreshToken == null || authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomJWTException("INVALID_TOKEN");
        }
        String accessToken = authHeader.substring(7);
        Map<String, Object> access = JWTUtil.validateAllowExpired(accessToken);
        Map<String, Object> refresh = JWTUtil.validateToken(refreshToken);
        if (!"access".equals(access.get("tokenType")) || !"refresh".equals(refresh.get("tokenType"))
                || access.get("email") == null || !access.get("email").equals(refresh.get("email"))) {
            throw new CustomJWTException("INVALID_TOKEN");
        }
        long accessExpiry = ((Number) access.get("exp")).longValue();
        if (accessExpiry > Instant.now().getEpochSecond()) {
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }
        String nextAccess = JWTUtil.generateToken(refresh, 10);
        long refreshExpiry = ((Number) refresh.get("exp")).longValue();
        String nextRefresh = refreshExpiry - Instant.now().getEpochSecond() < 3600
                ? JWTUtil.generateToken(refresh, 60 * 24) : refreshToken;
        return Map.of("accessToken", nextAccess, "refreshToken", nextRefresh);
    }
}
