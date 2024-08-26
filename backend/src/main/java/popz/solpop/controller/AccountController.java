package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.SSAFYUserRequest;
import popz.solpop.dto.SSAFYUserResponse;
import popz.solpop.service.AccountService;
import popz.solpop.service.AuthService;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    AccountService accountService;

    @PostMapping("/checkAccountNo")
    public Map<String, Object> postCheckAccountNo(
            @RequestBody Map<String, Object> requestBody) {
        try {
            return accountService.checkAccountNo(requestBody);
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/withdrawal")
    public Map<String, Object> postWithdrawal(
            @RequestBody Map<String, Object> requestBody) {
        try {
            return accountService.withdrawal(requestBody);
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }

}
