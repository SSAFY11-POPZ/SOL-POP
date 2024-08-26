package popz.solpop.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.reactive.function.client.WebClient;
import popz.solpop.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Slf4j
@Service
@Transactional
public class AccountService {
  private static final Logger logger = LoggerFactory.getLogger(AccountService.class);


  @Autowired
  private AccountRepository accountRepository;


  private WebClient webClient;

  @PostConstruct
  public void initWebClient() {
      webClient = WebClient.create("https://finopenapi.ssafy.io/ssafy/api/v1");
  }

  public Map checkAccountNo(Map<String, Object> requestBody) throws Exception {
    try {
      return webClient.post()
              .uri("/edu/demandDeposit/inquireDemandDepositAccountBalance")
              .bodyValue(requestBody)
              .retrieve()
              .bodyToMono(Map.class)
              .block();
    } catch (Exception e) {
      logger.error("SSAFY inquireDemandDepositAccountBalance failed");
      System.out.println(e);
      throw new Exception("SSAFY inquireDemandDepositAccountBalance failed", e);
    }
  }

    //https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountWithdrawal
    public Map withdrawal(Map<String, Object> requestBody) throws Exception {
      try {
        return webClient.post()
                .uri("/edu/demandDeposit/updateDemandDepositAccountWithdrawal")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
      } catch (Exception e) {
        logger.error("SSAFY AccountWithdrawal failed");
        System.out.println(e);
        throw new Exception("SSAFY AccountWithdrawal failed", e);
      }
  }



}