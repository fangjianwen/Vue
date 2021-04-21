
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            remindId:"-2",// 0中标  -1截止 -2进行中
            pageIndex: 1,//页码
            pageSize: 10//页数
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData: false,//是否无数据
        totalCount: "",//搜索总数量
        color:"",
        list: [],      //项目数据集合 
        remindList: [
            { id: "-2", text: "进行中", color: "", days: 0, count: 0 },
            { id: "0", text: "中标", color: "", days: 0, count: 0 },
            { id: "-1", text: "已截止", color: "", days: 0, count: 0 }
            
        ]     
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Follow/Project/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {
                    _this.list = _this.list.concat(resp.data.list);
                    _this.totalCount = resp.data.total;
                    _this.loading = false;
                    _this.color = resp.data.color;
                    if (_this.requestPar.pageIndex == 1 && _this.totalCount == 0) {
                        _this.showNoData = true;
                    }
                }

            }

            )
        },
        getRemindList: function () {//请求接口数据
            var _this = this;
           
            requestApi("/Api/My/Remind/List.ashx", "POST", { pageIndex: 1, pageSize: 10}, function (resp)
            {
                if (resp.data != null)
                {
                    _this.remindList = resp.data.list.concat(_this.remindList);
                    for (var i = 0; i < _this.remindList.length; i++)
                    {
                        _this.setCount(_this.remindList[i]);
                    }
                    _this.requestPar.remindId = _this.remindList[0].id;
                    console.log(_this.requestPar.remindId);
                    _this.getDataList();
                }
                else{
                    _this.getDataList();
                }

            }

            )
        },
        setCount: function (item) {//统计数量
            var _this = this;
            requestApiSync("/Api/My/Follow/Project/List.ashx", "POST", {remindId:item.id}, function (resp)
            {
                if (resp.status) {
                    for (var i = 0; i < _this.remindList.length; i++) {
                      
                        if (_this.remindList[i].id == item.id) {
                            
                            _this.remindList[i].count = resp.data.total;
                           
                        }

                    }
                }

            })

        },
        setRemindId: function (remindId) {
            this.requestPar.pageIndex = 1;
            this.requestPar.remindId = remindId;
            this.isLoadAll = false;
            this.showNoData = false;
            this.list = [];
            this.getDataList();


        },
        handleScroll: function () {//滚动加载
            var h = $('.list-box').height();//div可视区域的高度
            var sh = $('.list-box')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $('.list-box')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离

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
            this.getRemindList();
           // this.getDataList();
            
        }
    }
})
vm.init();
