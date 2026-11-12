package org.zerock.mallapi.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.repository.MemberRepository;

@Configuration
public class SampleMemberConfig {
    @Bean
    ApplicationRunner createSampleMembers(MemberRepository repository, PasswordEncoder encoder) {
        return args -> {
            for (int i = 0; i < 10; i++) {
                String email = "user" + i + "@aaa.com";
                if (repository.existsById(email)) continue;
                Member member = Member.builder().email(email).pw(encoder.encode("1111"))
                        .nickname("USER" + i).social(false).build();
                member.addRole(MemberRole.USER);
                if (i >= 5) member.addRole(MemberRole.MANAGER);
                if (i >= 8) member.addRole(MemberRole.ADMIN);
                repository.save(member);
            }
        };
    }
}
