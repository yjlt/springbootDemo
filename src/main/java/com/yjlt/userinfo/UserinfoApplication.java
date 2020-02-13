package com.yjlt.userinfo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yjlt.userinfo.dao")
public class UserinfoApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserinfoApplication.class, args);
    }

}
