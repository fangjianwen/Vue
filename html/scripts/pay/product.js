
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            typeId: 1
        },
        info: {},//个人信息
        loading: false,//是否正在请求
        list: []      //数据集合 
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/Pay/Product/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
                    _this.list = _this.list.concat(resp.data.list);
                    _this.loading = false; 
                }

            }

            )
        },
        getUserInfo: function () {//获取当前用户信息
            var _this = this;
            requestApi("/Api/User/Info.ashx", "POST", {}, function (resp) {

                _this.info = resp.data.info;

            }

            )
        },
        setTypeId: function (typeId) {//设置 tab
            if(typeId == 2){
                alert("敬请期待");
            }
        },        
        init: function () {//初始化
            window.addEventListener('scroll', this.handleScroll);//滚动监听
            this.getDataList();
            this.getUserInfo();
        }
    }
})
vm.init();
