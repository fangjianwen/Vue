
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            stageId: "",//招标状态 0招标 1中标
            keyword: "",//关键字
            pageIndex: 1,//页码
            pageSize: 10//页数
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showHistoryKeyword: false,//是否显示历史关键字面板
        showNoHistory:false,//是否有历史记录
        historyKeywordList: [],//历史关键字     
        totalCount: "",//搜索总数量
        list: []      //项目集合 
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/History/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
                    _this.list = _this.list.concat(resp.data.list);
                    _this.totalCount = resp.data.total;
                    _this.loading = false;
                    if (_this.requestPar.stageId == "" && _this.requestPar.keyword == "" && _this.requestPar.pageIndex == 1 && _this.totalCount == 0) {
                        _this.showNoHistory = true;
                    }
                }

            }

            )
        },
        setStageId: function (stageId) {//设置招标状态
            this.requestPar.pageIndex = 1;
            if (this.requestPar.stageId != stageId) {
                this.requestPar.stageId = stageId;
            } else {
                this.requestPar.stageId = "";
            }
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();
        } ,
        setKeyword: function () {//设置搜索关键字

            this.requestPar.pageIndex = 1;
            this.showHistoryKeyword = false;
            this.saveKeyword();
            this.getHistoryKeyword();
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();

        },
        saveKeyword: function () {//保存搜索关键字
            if (this.requestPar.keyword.trim() != "") {
                var tkey = this.requestPar.keyword.trim();
                var keywords = JSON.parse(localStorage.getItem(config.localStorageKey_SearchWords));
                if (keywords == null)
                    keywords = [];
                var exsit = false;
                $.each(keywords, function (i, item) {
                    if (item == tkey) {
                        exsit = true;
                        return false;
                    }
                });
                if (exsit == false) {
                    keywords.push(tkey);
                }

                localStorage.setItem(config.localStorageKey_SearchWords, JSON.stringify(keywords));
            }
        },
        clearHistoryKeyword: function () {//清除搜索关键字
            localStorage.removeItem(config.localStorageKey_SearchWords);
            this.historyKeywordList = [];
            this.showHistoryKeyword = false;
        },
        getHistoryKeyword: function () {//获取历史关键字
            var keywords = JSON.parse(localStorage.getItem(config.localStorageKey_SearchWords));
            if (keywords != null) {
                this.historyKeywordList = keywords;
                this.historyKeywordList = this.historyKeywordList.reverse();
            }
        },
        toTop: function () {//
            $('.list-box').animate({ scrollTop: 0 }, 'fast');
        },
        handleScroll: function () {//滚动加载

            var h = $('.list-box').height();//div可视区域的高度
            var sh = $('.list-box')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $('.list-box')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            //console.log(h + st -sh);
            //上面的代码是判断滚动条滑到底部的代码
            if (h + st - sh>=-90) {
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
            //if (scrollTop + windowHeight>=(scrollHeight-1))
            //{
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
            this.getHistoryKeyword();
            this.getDataList();
        }
    }
})
vm.init();
