
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            pushType: ""//推送方式
        }
    },
    methods: {

        updatePushType: function () {//更新推送方式
            var _this = this;
            requestApi("/Api/User/UpdatePushType.ashx", "POST", { pushType: _this.requestPar.pushType }, function (resp) {

                if (resp.status) {
                    alert("操作成功");

                }

            }

            )


        },
        getData: function () {//获取数据
            var _this = this;
            requestApi("/Api/User/Info.ashx", "POST", {}, function (resp) {

                if (resp.status) {
                    _this.requestPar.pushType = resp.data.info.push_type;

                }

            }

            )


        },
        init: function () {//初始化
            this.getData();

        }
    }
})
vm.init();
