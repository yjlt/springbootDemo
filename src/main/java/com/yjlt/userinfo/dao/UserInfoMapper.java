package com.yjlt.userinfo.dao;

import com.yjlt.userinfo.entity.UserInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository(value = "userInfoMapper")
public interface UserInfoMapper {

    int deleteUserById(Integer id);

    int deleteBatchUserByIds(List<Integer> idList);

    int insertUser(UserInfo record);

    List<UserInfo> selectAllUsers();

    void updateUser(UserInfo record);

    UserInfo checkUserByName(String name);

    //int updateByPrimaryKeySelective(UserInfo record);


}