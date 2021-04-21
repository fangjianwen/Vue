
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {
            mobile: "",//手机号
            verCode:""//验证码
        }//请求信息
        
    },
    methods: {
        getVerCode: function () {//获取验证码
            var _this = this;
            if (_this.requestPar.mobile == "") {
                alert("请输入手机号");
                return;
            }
            requestApi("/Api/Sms/GetVerCode.ashx", "POST", _this.requestPar, function (resp) {

                if (resp.status==true) {
                    alert("验证码已经发送");
                   
                }
              
            }

            )
        },
        bindMobile: function () {//绑定手机号
            var _this = this;
            if (_this.requestPar.mobile == "") {
                alert("请输入手机号");
                return;
            }
            if (_this.requestPar.verCode == "") {
                alert("请输入验证码");
                return;
            }
            requestApi("/Api/User/BindMobile.ashx", "POST", _this.requestPar, function (resp) {

                if (resp.status==true) {
                    alert("绑定成功");
                    window.location.href = 'home.html';
                }
              
            })
        }
        
    }
})

