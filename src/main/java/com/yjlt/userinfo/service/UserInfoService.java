package com.yjlt.userinfo.service;

import com.yjlt.userinfo.entity.UserInfo;

import java.util.List;

/**
 * @program: userinfo
 * @package: com.yjlt.userinfo.service
 * @class: UserInfoService
 * @description
 * @author: yjlt
 * @date: 2020/1/7 23:33
 * @Version 1.0
 **/
public interface UserInfoService {

    public List<UserInfo> getAllUser();

    void saveUser(UserInfo user);

    Boolean checkUserName(String userName);

    void updateUser(UserInfo user);

    void deleteUser(Integer id);

    void deleteBatchUser(List<Integer> useridList);
}
