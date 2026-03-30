package com.jotomo.pomo.hello;

import com.jotomo.pomo.logging.AuditAction;
import com.jotomo.pomo.logging.AuditLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hello")
@Slf4j
public class HelloController {

  private final AuditLogger auditLogger;

  @GetMapping
  public String helloWorld() {
    log.info("Returning Hello");
    auditLogger.log(
            "Anonymous",
            AuditAction.TEST_HELLO,
            "Hello",
            "None",
            "Have a nice day!"
    );
    log.info("Hello Completed");
    return "Hello, World!";
  }
}
