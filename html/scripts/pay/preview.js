
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            id: GetQueryString("id")
        },
        bidDocInfo: {},//标书信息
        userInfo: {}//当前用户信息
    },
    methods: {
        
        getBidDocInfo: function () {//获取标书信息
            var _this = this;
            requestApi("/Api/Pay/BidDocPreview.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {
                    _this.bidDocInfo = resp.data;
                }



            }

            )
        },
        init: function () {//初始化
            this.getBidDocInfo();
        }
    }

})
vm.init();
