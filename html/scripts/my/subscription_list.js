
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            pageIndex: 1,//页码
            pageSize: 10//页数
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData: false,//是否无数据
        showTipDiv:false,//是否显示购买提示
        totalCount: "",//搜索总数量
        list: []      //数据集合 
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Subscription/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {
                    _this.list = _this.list.concat(resp.data.list);
                    _this.totalCount = resp.data.total;
                    _this.loading = false;
                    if (_this.requestPar.pageIndex == 1 && _this.totalCount == 0) {
                        _this.showNoData = true;
                    }
                }

            }

            )
        },
        deleteSub: function (item) {//删除订阅
            var _this = this;
            //询问框
            layer.open({
                content: '确定删除？'
                ,btn: ['删除', '取消']
                ,yes: function(index){
                    requestApi("/Api/My/Subscription/Delete.ashx", "POST", { id: item.id }, function (resp)
                    {
    
                        if (resp.status) {
                            _this.list.splice(_this.list.indexOf(item), 1);
                            toast("操作成功");
                        }
    
                    }
    
                    )
                    
                    layer.close(index);
                }
            });
        },
        checkIsBuy: function () {//是否购买过
                var _this = this;
                requestApi("/Api/My/Subscription/IsBuy.ashx", "POST", {}, function (resp) {

                    if (resp.status) {
                        _this.showTipDiv=!resp.data.is_buy;

                    }

                }

                )
            

        },
        handleScroll: function () {//滚动加载

            var h = $('.list').height();//div可视区域的高度
            var sh = $('.list')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $('.list')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离

            //上面的代码是判断滚动条滑到底部的代码
            if (h + st >= sh - 2) {
                if (this.requestPar.pageIndex * this.requestPar.pageSize >= this.totalCount) {
                    this.isLoadAll = true;
                    console.log("加载完成");
                    return;
                }
                this.requestPar.pageIndex++;
                this.getDataList();
            }
            ////变量scrollTop是滚动条滚动时，距离顶部的距离
            //var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            ////变量windowHeight是可视区的高度
            //var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            ////变量scrollHeight是滚动条的总高度
            //var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            ////滚动条到底部的条件
            //if (scrollTop + windowHeight >= (scrollHeight - 1)) {
            //    if (this.requestPar.pageIndex * this.requestPar.pageSize >= this.totalCount) {
            //        this.isLoadAll = true;
            //        console.log("加载完成");
            //        return;
            //    }
            //    this.requestPar.pageIndex++;
            //    this.getDataList();
            //}
        },
        init: function () {//初始化
            //window.addEventListener('scroll', this.handleScroll);//滚动监听
            this.getDataList();
            this.checkIsBuy();
        }
    }
})
vm.init();
