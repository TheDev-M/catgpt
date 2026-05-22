package com.codecool.catgpt.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/signup",
        "/home",
        "/cats/**",
        "/chat/**"
    })
    public String spa(HttpServletRequest request) {
        return "forward:/index.html";
    }
}
