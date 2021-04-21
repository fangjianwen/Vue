
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: { 
            code: GetQueryString ("code")
        },
        loading: false,
        loadingText:"微信登录中..."
    },
    methods: {
        login: function () {//微信授权
            var _this = this;
            _this.loading = true;
            requestApi("/Api/User/Login.ashx", "POST", _this.requestPar, function (resp) {
                _this.loading = false;
                if (resp.status)
                {
                    localStorage.setItem(config.localStorageKey_OpenId, resp.data.openid);
                    _this.loading = true;
                    _this.loadingText ="微信登录成功,正在跳转...";
                    setTimeout(function () {

                        var url = localStorage.getItem(config.localStorageKey_AuthReturnUrl);
                        localStorage.removeItem(config.localStorageKey_AuthReturnUrl);
                        window.location.href = url;


                    }, 1000)
                } else {
                    _this.loading = false;
                }


            }

            )
        }
    }
})
vm.login();
