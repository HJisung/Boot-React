package org.zerock.mallapi.service;

import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${kakao.rest-api-key:}") private String restApiKey;
    @Value("${kakao.client-secret:}") private String clientSecret;
    @Value("${kakao.redirect-uri}") private String redirectUri;
    @Value("${kakao.token-url}") private String tokenUrl;
    @Value("${kakao.user-url}") private String userUrl;

    @Override
    public MemberDTO getKakaoMemberFromCode(String code) {
        if (restApiKey.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "카카오 앱 키가 설정되지 않았습니다.");
        if (code == null || code.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인가 코드가 없습니다.");
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", restApiKey);
        form.add("redirect_uri", redirectUri);
        form.add("code", code);
        if (!clientSecret.isBlank()) form.add("client_secret", clientSecret);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        try {
            Map<?, ?> token = new RestTemplate().postForObject(tokenUrl, new HttpEntity<>(form, headers), Map.class);
            if (token == null || !(token.get("access_token") instanceof String accessToken)) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 토큰 응답을 확인할 수 없습니다.");
            }
            return getKakaoMember(accessToken);
        } catch (RestClientException error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 로그인 요청을 완료하지 못했습니다.");
        }
    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        try {
            Map<?, ?> profile = new RestTemplate().exchange(userUrl, HttpMethod.GET,
                    new HttpEntity<>(headers), Map.class).getBody();
            if (profile == null || !(profile.get("id") instanceof Number id)) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 회원 정보를 확인할 수 없습니다.");
            }
            String email = "kakao-" + id.longValue() + "@social.local";
            Member member = memberRepository.getWithRoles(email);
            if (member == null) {
                member = Member.builder().email(email).pw(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .nickname("소셜회원").social(true).build();
                member.addRole(MemberRole.USER);
                member = memberRepository.save(member);
            }
            return entityToDTO(member);
        } catch (RestClientException error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 회원 조회를 완료하지 못했습니다.");
        }
    }

    @Override
    public void modifyMember(MemberModifyDTO dto) {
        Member member = memberRepository.findById(dto.getEmail()).orElseThrow();
        if (dto.getNickname() == null || dto.getNickname().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임을 입력해 주세요.");
        }
        if (member.isSocial() && (dto.getPw() == null || dto.getPw().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "소셜 회원은 비밀번호를 설정해 주세요.");
        }
        if (dto.getPw() != null && !dto.getPw().isBlank()) {
            member.changePw(passwordEncoder.encode(dto.getPw()));
            member.changeSocial(false);
        }
        member.changeNickname(dto.getNickname());
        memberRepository.save(member);
    }
}
