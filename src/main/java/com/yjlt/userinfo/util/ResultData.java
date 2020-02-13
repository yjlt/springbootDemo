package com.yjlt.userinfo.util;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

/**
 * @program: userinfo
 * @package: com.yjlt.userinfo.util
 * @class: ResultData
 * @description 统一返回的工具类
 * @author: yjlt
 * @date: 2020/1/8 20:02
 * @Version 1.0
 **/
@Setter
@Getter
public class ResultData {

    /** 状态代码**/
    private int code;

    /** 消息内容**/
    private String message;

    /** 扩展内容**/
    private Map<String,Object> extend = new HashMap<>();

    /**
     *  成功时调用此方法
     * @return
     */
    public static ResultData success(){
        ResultData result = new ResultData();
        result.setCode(100);
        result.setMessage("处理成功！");
        return result;
    }

    /**
     * 失败时调用此方法
     * @return
     */
    public static ResultData fail(){
        ResultData result = new ResultData();
        result.setCode(200);
        result.setMessage("处理失败！");
        return result;
    }

    /**
     * 增加返回内容
     * @param key
     * @param value
     * @return
     */
    public ResultData add(String key,Object value){
        this.getExtend().put(key, value);
        return this;
    }

}
