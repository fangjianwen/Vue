
var vm = new Vue({
    el: '#app',
    data: {
        info: {},//个人信息
        showMobile2Div: false,//是否显示编辑第二个手机号弹框
        showQrCode: false,//是否显示二维码
    },
    methods: {
        getUserInfo: function () {//获取当前用户信息
            var _this = this;
            requestApi("/Api/User/Info.ashx", "POST", {}, function (resp) {
                _this.info = resp.data.info;
              
            }

            )
        },
        saveMobile2: function () {//保存第二个手机号
            var _this = this;
            requestApi("/Api/User/UpdateMobile2.ashx", "POST", {mobile2:_this.info.mobile2}, function (resp) {

                if (resp.status==true) {
                    alert("保存成功");
                    _this.showMobile2Div = false;
                }



            }

            )
        }

    }
})
vm.getUserInfo();
