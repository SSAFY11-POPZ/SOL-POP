package popz.solpop.service;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import popz.solpop.dto.FindPwResponse;
import popz.solpop.dto.Response;
import popz.solpop.entity.Member;
import popz.solpop.repository.MemberRepository;

@Service
@AllArgsConstructor
public class MailService {

    @Autowired
    MemberRepository memberRepository;
    @Autowired
    AuthService authService;

    private JavaMailSender mailSender;


    public String getTempPassword() {
        char[] charSet = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};

        String str = "";

        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            str += charSet[idx];
        }
        return str;
    }



    public FindPwResponse createMailAndChangePassword(String userId, String name) {
        String tempPassword = getTempPassword();
        Member member = memberRepository.findMemberByUserId(userId);
        FindPwResponse findPwResponse = new FindPwResponse();
        findPwResponse.setAddress(userId);
        findPwResponse.setTitle("SOL POP 임시비밀번호 안내 이메일 입니다.");
        findPwResponse.setMessage("안녕하세요. " + name + "님, SOL POP 임시비밀번호 안내 관련 이메일 입니다." + "\n 임시 비밀번호는 " + tempPassword + " 입니다.");
        authService.updatePassword(member, tempPassword);
        return findPwResponse;
    }
    public void mailSend(FindPwResponse findPwResponse){
        System.out.println("Successfully sent email");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(findPwResponse.getAddress());
        message.setFrom("souffle1903@gmail.com");
        message.setSubject(findPwResponse.getTitle());
        message.setText(findPwResponse.getMessage());

        mailSender.send(message);
    }


}
