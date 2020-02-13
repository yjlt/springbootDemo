package com.yjlt.userinfo.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjlt.userinfo.entity.UserInfo;
import com.yjlt.userinfo.service.UserInfoService;
import com.yjlt.userinfo.util.ResultData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @program: userinfo
 * @package: com.yjlt.userinfo.controller
 * @class: UserController
 * @description
 * @author: yjlt
 * @date: 2020/1/8 19:54
 * @Version 1.0
 **/

@RestController
public class UserController {

    @Autowired
    private UserInfoService userInfoService;

    /**
     *查询所有用户信息
     * @param pn 请求查询的页码
     * @return
     */
    @GetMapping("/users")
    public ResultData getAlluser(@RequestParam(value = "pn",defaultValue = "1") Integer pn){
        //这是一个分页查询,引入PageHelp分页插件
        //在查询之前只需要调用，传入页码，以及每页的大小
        PageHelper.startPage(pn,5);
        //startPage后面紧跟的查询就是分页查询
        List<UserInfo> userList= userInfoService.getAllUser();
        //使用pageInfo包装查询后的结果，只需要将pageInfo交给页面就行了。
        //封装了详细的分页信息,传入连续显示的页数
        //PageInfo<UserInfo> pageInfo = new PageInfo<>();
        PageInfo<UserInfo> pageInfo = new PageInfo<>(userList,5);
        return ResultData.success().add("pageInfo",pageInfo);
    }

    /**
     * 校验输入的用户名是否存在
     * @param userName
     * @return
     */
    @GetMapping("/checkUser")
    public ResultData checkUser(@RequestParam(value = "userName") String userName){
        Boolean isUserNotExist = userInfoService.checkUserName(userName);
        if(isUserNotExist){
            return ResultData.success();
        }
        return ResultData.fail();
    }

    /**
     * 保存用户信息
     * @param user
     * @param result
     * @return
     */
    @PostMapping("/users")
    public ResultData saveUser(@Valid UserInfo user, BindingResult result){
        if(result.hasErrors()){
            //校验失败，返回失败，模态框中显示失败
            Map<String,Object> map=new HashMap<>();
            List<FieldError> errors=result.getFieldErrors();
            for(FieldError fieldError:errors){
                System.out.println("错误的字段名"+fieldError.getField());
                System.out.println("错误信息"+fieldError.getDefaultMessage());
                map.put(fieldError.getField(),fieldError.getDefaultMessage());
            }
            return ResultData.fail().add("errorFields",map);
        }else {
            userInfoService.saveUser(user);
            return ResultData.success();
        }
    }

    /**
     * 更新用户信息
     * @param user
     * @return
     */
    @PutMapping("/users")
    public ResultData updateUser(@RequestBody @Valid UserInfo user, BindingResult result){
        if(result.hasErrors()){
            //校验失败，返回失败，模态框中显示失败
            Map<String,Object> map=new HashMap<>();
            List<FieldError> errors=result.getFieldErrors();
            for(FieldError fieldError:errors){
                System.out.println("错误的字段名"+fieldError.getField());
                System.out.println("错误信息"+fieldError.getDefaultMessage());
                map.put(fieldError.getField(),fieldError.getDefaultMessage());
            }
            return ResultData.fail().add("errorFields",map);
        }else{
            System.out.println(user);
            userInfoService.updateUser(user);
            return ResultData.success();
        }

    }

     /**
     * 删除用户信息,包括单个删除和批量删除
     * @param userid
     * @return
     */
    @DeleteMapping("/users/{del_idstr}")
    public ResultData deleteUser(@PathVariable("del_idstr") String del_idstr){
        //批量删除用户
        if(del_idstr.contains("-")){
            String[] ids_str = del_idstr.split("-");
            List<Integer> ids_list = new ArrayList<>();
            for(String id : ids_str){
                ids_list.add(Integer.valueOf(id));
            }
            userInfoService.deleteBatchUser(ids_list);
        }else{            //删除单个用户
            int user_id = Integer.valueOf(del_idstr);
            userInfoService.deleteUser(user_id);
        }
        return ResultData.success();
    }



}
