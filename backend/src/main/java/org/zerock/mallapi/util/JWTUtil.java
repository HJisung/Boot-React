package org.zerock.mallapi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

import java.time.ZonedDateTime;
import java.util.*;

import javax.crypto.SecretKey;

@Log4j2
public class JWTUtil {

    private static final String key = System.getenv().getOrDefault("JWT_SECRET", "local-classroom-only-secret-key-change-before-production");

    public static String generateToken(Map<String, Object> valueMap, int min) {

      SecretKey key = null;

      try{
        key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
      
      }catch(Exception e){
          throw new RuntimeException(e.getMessage());
      }

      String jwtStr = Jwts.builder()
              .setHeader(Map.of("typ","JWT"))
              .setClaims(valueMap)
              .claim("tokenType", min == 10 ? "access" : "refresh")
              .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
              .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
              .signWith(key)
              .compact();

      return jwtStr;
    }

    public static Map<String, Object> validateToken(String token) {

      Map<String, Object> claim = null;
      
      try{

        SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

        claim = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token) // 파싱 및 검증, 실패 시 에러
                .getBody();
                
      }catch(MalformedJwtException malformedJwtException){
          throw new CustomJWTException("MalFormed");
      }catch(ExpiredJwtException expiredJwtException){
          throw new CustomJWTException("Expired");
      }catch(InvalidClaimException invalidClaimException){
          throw new CustomJWTException("Invalid");
      }catch(JwtException jwtException){
          throw new CustomJWTException("JWTError");
      }catch(Exception e){
          throw new CustomJWTException("Error");
      }
      return claim;
    }

    public static Map<String, Object> validateAllowExpired(String token) {
      try {
        SecretKey secret = Keys.hmacShaKeyFor(key.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token).getBody();
      } catch (ExpiredJwtException expired) {
        return expired.getClaims();
      } catch (Exception error) {
        throw new CustomJWTException("INVALID_TOKEN");
      }
    }

}
