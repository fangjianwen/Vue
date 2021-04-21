
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            orderNo: GetQueryString("orderNo")
        }        
    },
    methods: {
        getPayJson: function () {//请求接口数据
            var _this = this;
            _this.loading = true;

            requestApi("/Api/Pay/PayJson.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
                    //alert(resp.data);
                     //document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

                        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
                        WeixinJSBridge.invoke('getBrandWCPayRequest',resp.data, function (res) {
                            // 返回res.err_msg,取值 
                            // get_brand_wcpay_request:cancel 用户取消 
                            // get_brand_wcpay_request:fail 发送失败 
                            // get_brand_wcpay_request:ok 发送成功 
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                
                                window.location.href = "../my/myorder.html";
                
                            }
                            else {
                
                                window.location.href = "../my/myorder.html";
                            }
                
                        });
                        //
                
                
                                
                     //})
                }
            }
            )
        },         
        init: function () {//初始化    
            this.getPayJson();
        }
    }
})
vm.init();
