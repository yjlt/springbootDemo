$(function () {
    var totalRecord, currentPage;
    //1.显示所有数据
    to_page(1);
    //2.添加用户
    addUser();
    //3.修改用户
    reviseUser();
    //4.单个删除用户
    deleteUser();
    //5.批量删除
    deleteSomeUser();

    //显示员工信息
    function to_page(pn) {
        $.ajax({
            url: "/userinfo/users",
            data: "pn=" + pn,
            type: "GET",
            success: function (result) {
                //1.解析并显示员工数据
                build_users_table(result);
                //2.解析并显示分页信息
                build_page_info(result);
                //3.解析并显示分页条数据
                build_page_nav(result);

            }
        })
    }

    /**
     * 1.1 解析并显示员工数据表
     * @param result
     */
    function build_users_table(result) {
        //清空table表格
        $("#users_table tbody").empty();
        //获取user数据
        var users = result.extend.pageInfo.list;

        //遍历元素
        $.each(users, function (index, item) {
            var checkBox = $("<td><input type='checkbox' class='check_item'/></td>");
            var id = $("<td></td>").append(item.id);
            var username = $("<td></td>").append(item.userName);
            var sex = $("<td></td>").append(item.userSex);
            var age = $("<td></td>").append(item.userAge);
            var city = $("<td></td>").append(item.userCity);


            var button_edit = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn").append($("<span></span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", true)).append("编辑");
            var button_del = $("<button></button>").addClass("tn btn-danger btn-sm delete_btn").append($("<span></span>").addClass("glyphicon glyphicon-trash").attr("aria-hidden", true)).append("删除");
            var td_btn = $("<td></td>").append(button_edit).append(" ").append(button_del);
            $("<tr></tr>").append(checkBox).append(id).append(username).append(sex).append(age).append(city)
                .append(td_btn).appendTo("#users_table tbody");

        })
    }

    /**
     * 1.2 解析显示分页信息
     * @param result
     */
    function build_page_info(result) {
        $("#page_info_area").empty();
        $("#page_info_area").append("当前" + result.extend.pageInfo.pageNum + "页,总共" + result.extend.pageInfo.pages +
            "页，总共" + result.extend.pageInfo.total + "条记录");
        totalRecord = result.extend.pageInfo.total;
        currentPage = result.extend.pageInfo.pageNum;
    }

    /**
     * 1.3 解析显示分页导航条
     * @param result
     */
    function build_page_nav(result) {
        $("#page_nav_area").empty();
        var pageInfo = result.extend.pageInfo;
        var ul = $("<ul></ul>").addClass("pagination");
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
        //如果没有前一页，前一页和首页就不能点
        if (pageInfo.hasPreviousPage === false) {
            firstPageLi.addClass("disabled");
            prePageLi.addClass("disabled");
        } else {            //有前一页
            //首页
            firstPageLi.click(function () {
                to_page(1);
            });
            prePageLi.click(function () {
                to_page(pageInfo.pageNum - 1);
            });
        }
        if (result.extend.pageInfo.hasNextPage === false) {   //没有后一页
            nextPageLi.addClass("disabled");
            lastPageLi.addClass("disabled");
        } else {                                    //有后一页
            //构建点击事件
            nextPageLi.click(function () {
                to_page(pageInfo.pageNum + 1);
            });
            lastPageLi.click(function () {
                to_page(pageInfo.lastPage);
            })
        }
        //添加首页和前一页
        ul.append(firstPageLi).append(prePageLi);
        //遍历添加页码result
        $.each(pageInfo.navigatepageNums, function (index, item) {
            var numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
            //如果是当前选中页面，添加active标识
            if (pageInfo.pageNum === item) {
                numLi.addClass("active");
            }
            //给每个页码添加点击就跳转
            numLi.click(function () {
                to_page(item);
            });
            ul.append(numLi);
        });
        //添加下一页和末页
        ul.append(nextPageLi).append(lastPageLi);
        var navEle = $("<nav></nav>").append(ul);
        navEle.appendTo("#page_nav_area");
    }


    /**
     * 2.新增用户信息
     * @returns {boolean}
     */
    function addUser() {

        //为新增按钮添加modal
        $("#user_add_modal_btn").click(function (){
            //清除表单数据
            $("#userAddModal form")[0].reset();
            $("#userName_add_input").next("span").text("");
            $("#userAddModal").modal({
                backdrop: "static"
            });
        });

        //校验该用户是否存在,如果存在就不能添加该用户
        $("#userName_add_input").change(function () {
            var userName = $("#userName_add_input").val();
            //发送Ajax请求校验姓名是否可用
            $.ajax({
                url: "/userinfo/checkUser",
                data: "userName=" + userName,
                type: "GET",
                success: function (result) {
                    //表示成功，用户名可用
                    if (result.code === 100) {
                        show_validate_msg($("#userName_add_input"), "success", "恭喜，该员工姓名可以使用!");
                        //为保存按钮添加属性
                        $("#user_save_btn").attr("ajax-validation", "success");
                    } else if (result.code === 200) {
                        show_validate_msg($("#userName_add_input"), "error", "该员工姓名已存在！");
                        $("#user_save_btn").attr("ajax-validation", "error");
                    }
                }
            })
        });

        //保存用户信息
        $("#user_save_btn").click(function () {
            //先校验表单信息
            if (!validate_form($("#userName_add_input"), $("#age_add_input"))) {
                return false;
            }
            //1.判断之前的ajax用户名校验是否成功
            if ($(this).attr("ajax-validation") === "error") {
                return false;
            }
            //2.发送ajax请求保存员工
            var userName = $("#userName_add_input").val();
            $.ajax({
                url: "/userinfo/users",
                type: "POST",
                data: $("#userAddModal form").serialize(),
                success: function (result) {
                    //员工保存成功(后端校验)
                    if (result.code === 100) {
                        //1.关闭modal框
                        $("#userAddModal").modal('hide');
                        //alert("恭喜，用户【"+userName+"】新增成功！");
                        Swal.fire({
                            type: 'success',
                            title: '用户新增成功',
                            text: "恭喜，用户【"+userName+"】新增成功！"
                        });

                        //2.来到最后一页，显示刚才保存的数据
                        to_page(totalRecord);
                    } else {
                         //显示失败信息(后端校验)
                         if (result.extend.errorFields.userName !== undefined) {
                             show_validate_msg($("#userName_add_input"), "error", result.extend.errorFields.userName);
                         }
                         if (result.extend.errorFields.userAge !== undefined) {
                             show_validate_msg($("#age_add_input"), "error", result.extend.errorFields.userAge);
                         }
                        if (result.extend.errorFields.userCity !== undefined) {
                            show_validate_msg($("#city_add_input"), "error", result.extend.errorFields.userCity);
                        }

                    }

                }
            });
        });

    }

    //校验表单信息是否满足正则要求
    function validate_form(Name_ele, age_ele) {
        //1.拿到要校验的数据，使用正则表达式
        //校验姓名(2~16个字符)
        var userName = Name_ele.val();
        var regName = /^[a-zA-Z0-9\u2E80-\u9FFF]{2,16}$/;
        //如果验证失败
        if (!regName.test(userName)) {
            show_validate_msg(Name_ele, "error", "姓名长度应在2-16位之间");
            Name_ele.focus();
            return false;
        } else {
            show_validate_msg(Name_ele, "success", "");
        }
        //2、检验年龄(1~3位数)
        var age = age_ele.val();
        var regAge = /^[0-9]{1,3}$/;
        if (!regAge.test(age)) {
            show_validate_msg(age_ele, "error", "年龄应为1-3位数字！");
            age_ele.focus();
            return false;
        } else {
            show_validate_msg(age_ele, "success", "");
        }
        return true;
    }

    //显示校验提示信息
    function show_validate_msg(ele, status, message) {
        //清除当前元素校验状态
        $(ele).parent().removeClass("has-error has-success has-feedback");
        $(ele).next("span").text("");
        if (status === "error") {
            ele.parent().addClass("has-error has-feedback");
            ele.next("span").text(message).css("color","red");
        } else if (status === "success") {
            ele.parent().addClass("has-success has-feedback");
            ele.next("span").text(message);
            ele.next("span").text(message).css("color","green");
        }

    }


    /**
     * 3.修改用户信息
     */
    function reviseUser() {
        //为编辑按钮绑定弹出modal框事件
        //1.因为在按钮创建之前就绑定了click，所以用普通click方法绑定不上
        $(document).on("click",".edit_btn",function () {
            //清除表单数据
            $("#userReviseModal form")[0].reset();
            $("#userName_revise_input").next("span").text("");

            //修改框中用户信息回显
            var id = $(this).parent().parent().children("td").eq(1).text();
            //将id的值传递给修改按钮的属性，方便发送Ajax请求
            $("#user_revise_btn").attr("edit-id", id);
            var username = $(this).parent().parent().children("td").eq(2).text();
            var sex = $(this).parent().parent().children("td").eq(3).text();
            var age = $(this).parent().parent().children("td").eq(4).text();
            var city = $(this).parent().parent().children("td").eq(5).text();

            $("#userName_revise_input").val(username);
            $("#userReviseModal input[name=userSex]").val([sex]);
            $("#city_revise_input").val(city);
            $("#age_revise_input").val(age);
            $("#userReviseModal").modal({
                backdrop: "static"
            })

        });

        //2.校验该用户是否存在,如果存在就不能添加该用户
        $("#userName_revise_input").change(function () {
            var userName = $("#userName_revise_input").val();
            //发送Ajax请求校验姓名是否可用
            $.ajax({
                url: "/userinfo/checkUser",
                data: "userName=" + userName,
                type: "GET",
                success: function (result) {
                    //表示成功，用户名可用
                    if (result.code === 100) {
                        show_validate_msg($("#userName_revise_input"), "success", "恭喜，该员工姓名可以使用!");
                        //为保存按钮添加属性
                        $("#user_revise_btn").attr("ajax-validation", "success");
                    } else if (result.code === 200) {
                        show_validate_msg($("#userName_revise_input"), "error", "该员工姓名已存在！");
                        $("#user_revise_btn").attr("ajax-validation", "error");
                    }
                }
            })
        });

        //3.为模态框中的修改按钮绑定事件，更新员工信息
        $("#user_revise_btn").click(function () {

            //判断之前的ajax用户名校验是否成功
            if ($(this).attr("ajax-validation") === "error") {
                return false;
            }

            //1.更新之前进行表单验证,验证没通过就直接返回
            if(!validate_form( $("#userName_revise_input"),$("#age_revise_input"))){
                return false;
            }

            //2.验证通过后发送ajax请求保存更新的员工数据
            var id = $(this).attr("edit-id");
            var userName = $("#userName_revise_input").val();

            var userSex = $("#userReviseModal input[name=userSex]:checked").val();

            var userAge =$("#age_revise_input").val();
            var userCity =$("#city_revise_input").val();

            //user对象
            var user = {
                id: id,
                userName: userName,
                userSex: userSex,
                userAge: userAge,
                userCity: userCity
            }

            $.ajax({
                //url:"/userinfo/users?&_method=PUT",
                url:"/userinfo/users",
                type:"PUT",
                data:JSON.stringify(user),
                dataType:"json",
                contentType:"application/json;charset=UTF-8",
                success:function (result) {
                    if (result.code === 100){
                        //1.关闭modal框
                        $("#userReviseModal").modal('hide');
                        //alert("恭喜，用户【"+userName+"】信息更新成功！");
                        Swal.fire({
                            type: 'success',
                            title: '更新成功',
                            text: "恭喜，用户【"+userName+"】信息更新成功！"
                        });
                        //2.来到当前页，显示刚才保存的数据
                        to_page(currentPage);
                    }else{
                        //显示失败信息(后端校验)
                        if (result.extend.errorFields.userName !== undefined) {
                            show_validate_msg($("#userName_revise_input"), "error", result.extend.errorFields.userName);
                        }
                        if (result.extend.errorFields.userAge !== undefined) {
                            show_validate_msg($("#age_revise_input"), "error", result.extend.errorFields.userAge);
                        }
                        if (result.extend.errorFields.userCity !== undefined) {
                            show_validate_msg($("#city_revise_input"), "error", result.extend.errorFields.userCity);
                        }
                    }

                }
            })

        })
    }


    /**
     * 4.删除单个用户
     */
    function deleteUser() {
        $(document).on("click",".delete_btn",function () {
            //1.弹出确认删除对话框
            var userid=$(this).parents("tr").find("td:eq(1)").text();
            var username=$(this).parents("tr").find("td:eq(2)").text();

            Swal.fire({
                title: "确认删除用户【"+username+"】吗？",
                text: "小心，该操作不可逆!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText:"取消",
                confirmButtonText: '确认删除'
            }).then((result) => {
                if (result.value) {
                //确认，发送ajax请求删除
                $.ajax({
                    url:"/userinfo//users/"+userid,
                    type:"DELETE",
                    success:function (result) {
                        //alert("恭喜,用户信息删除成功！");
                        Swal.fire({
                            type: 'success',
                            title: '删除成功',
                            text: "恭喜,用户信息删除成功！"
                        });
                        to_page(currentPage);
                    }
                });

                setTimeout(Swal.fire(
                    '删除成功',
                    '恭喜,用户信息删除成功！',
                    'success'
                ),1000);

            }
        });

           /* if(confirm("确认删除用户【"+username+"】吗？")){
                //确认，发送ajax请求删除
                $.ajax({
                    url:"/userinfo//users/"+userid,
                    type:"DELETE",
                    success:function (result) {
                        //alert("恭喜,用户信息删除成功！");
                        Swal.fire({
                            type: 'success',
                            title: '删除成功',
                            text: "恭喜,用户信息删除成功！"
                        });
                        to_page(currentPage);
                    }
                })
            }*/

        })
    }

    /**
     * 5.批量删除用户
     */
    function deleteSomeUser() {
        //1.实现全选全不选
        //attr获取checked是undefined
        //对于dom原生的属性要用prop读取和修改
        $("#check_all").click(function () {
            $(".check_item").prop("checked", $(this).prop("checked"));
        })

        //check_item
        $(document).on("click", ".check_item", function () {
            //判断当前选中的条目个数
            var flag = $(".check_item:checked").length === $(".check_item").length;
            $("#check_all").prop("checked", flag);
        })

        //为批量删除按钮添加点击事件
        $("#user_delete_all_btn").click(function () {
            var userNames = "";
            var del_idstr = "";
            $.each($(".check_item:checked"), function () {
                //拼接员工姓名字符串
                userNames += $(this).parents("tr").find("td:eq(2)").text() + ",";
                //拼接员工id字符串
                del_idstr += $(this).parents("tr").find("td:eq(1)").text() + "-";
            });
            userNames = userNames.substring(0, userNames.length - 1);
            del_idstr = del_idstr.substring(0, del_idstr.length - 1);

            if(del_idstr === ""){
                Swal.fire({
                    type: 'warning',
                    title: '没有选择要删除的用户',
                    text: "请至少选中一个用户！"
                });
                return false;
            }

            Swal.fire({
                title: "确认删除用户【" + userNames + "】吗",
                text: "小心，该操作不可逆!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText:"取消",
                confirmButtonText: '确认删除'
            }).then((result) => {
                if (result.value) {
                //确认，发送ajax请求删除
                $.ajax({
                    url:"/userinfo/users/" + del_idstr,
                    type:"DELETE",
                    success:function (result) {
                        Swal.fire({
                            type: 'success',
                            title: '删除成功',
                            text: "恭喜,用户信息删除成功！"
                        });
                        to_page(currentPage);
                    }
                });

                setTimeout(Swal.fire(
                    '删除成功',
                    '恭喜,用户信息删除成功！',
                    'success'
                ),1000);

            }
        });

           /* if (confirm("确认删除用户【" + userNames + "】吗")) {
                //发送Ajax请求
                $.ajax({
                    url: "/userinfo/users/" + del_idstr,
                    type: "DELETE",
                    success: function (result) {
                        alert("恭喜,用户信息删除成功！");
                        to_page(currentPage);
                    }

                });
            }*/

        })
    }

});