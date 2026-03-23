package com.jotomo.pomo.hello;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hello")
public class HelloController {

  @GetMapping
  public String helloWorld() {
    return "Hello, World!";
  }
}
