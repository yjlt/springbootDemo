package com.yjlt.userinfo.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @program: userinfo
 * @package: com.yjlt.userinfo.config
 * @class: DruidProperties
 * @description
 * @author: yjlt
 * @date: 2019/12/19 21:36
 * @Version 1.0
 **/
@ConfigurationProperties(prefix = "spring.datasource")
@Setter
@Getter
public class DruidProperties {
    private String url;

    private String username;

    private String password;

    private String driverClassName;

    private int initialSize;

    private int minIdle;

    private int maxActive;

    private int maxWait;
}
