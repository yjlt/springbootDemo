package com.yjlt.userinfo.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class UserInfo {

    private Integer id;

    @NotNull(message = "姓名不能为空！")
    private String userName;

    private String userSex;

    @DecimalMin(value = "1",message = "年龄必须大于1岁！")
    @DecimalMax(value = "150",message = "年龄必须小于150岁！")
    private Integer userAge;

    @Size(max = 20,min = 2,message = "城市名应为2~20个字符！")
    private String userCity;

    }
