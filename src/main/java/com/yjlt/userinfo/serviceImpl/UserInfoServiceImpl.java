package com.yjlt.userinfo.serviceImpl;

import com.yjlt.userinfo.dao.UserInfoMapper;
import com.yjlt.userinfo.entity.UserInfo;
import com.yjlt.userinfo.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @program: userinfo
 * @package: com.yjlt.userinfo.serviceImpl
 * @class: UserInfoServiceImpl
 * @description
 * @author: yjlt
 * @date: 2020/1/8 19:09
 * @Version 1.0
 **/
@Service(value = "userInfoService")
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    /**
     * get all user info
     * @return
     */
    @Override
    public List<UserInfo> getAllUser() {
        return userInfoMapper.selectAllUsers();
    }

    /**
     * save user
     * @param user
     */
    @Override
    public void saveUser(UserInfo user) {
        userInfoMapper.insertUser(user);
    }

    /**
     * check if user exist by name
     * @param userName
     * @return false if exist ,true if not exist
     */
    @Override
    public Boolean checkUserName(String userName) {
        UserInfo user = userInfoMapper.checkUserByName(userName);
        if(user != null){
            return false;
        }

        return true;
    }

    /**
     * update user info
     * @param user
     */
    @Override
    public void updateUser(UserInfo user) {
        userInfoMapper.updateUser(user);
    }

    /**
     * delete user by id
     * @param id
     */
    @Override
    public void deleteUser(Integer id) {
        userInfoMapper.deleteUserById(id);
    }

    /**
     * delete some users by ids
     * @param useridList
     */
    @Override
    public void deleteBatchUser(List<Integer> useridList) {
      userInfoMapper.deleteBatchUserByIds(useridList);
    }
}
