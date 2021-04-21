
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            stageId:"",//项目状态
            pageIndex: 1,//页码
            pageSize: 50,//页数
            typeId: "",//分类
            subId: "",//订阅id
            keywordTitle: "", //标题不包含关键字
            keywordDetail:"",//内容不包含关键字
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData: false,//是否无数据
        showTipDiv: false,//是否显示提示
        showEditKeyowrdDivTitle: false,//是否显示标题关键字编辑框
        showEditKeyowrdDivDetail: false,//是否显示详情关键字编辑框
        totalCount: "",//搜索总数量
        list: [],      //数据集合 
        dealTypeList: [],//DealTypeList
        subscriptionList: [],//订阅列表
        pushKeywordListTitle: [],//推送关键字列表
        pushKeywordListDetail: [],//推送详情列表
        pushKeywordInput: "",//用户输入的关键字 标题
        pushKeywordInputDetail:"",//用户输入的关键字 内容
        
        showNum:false//是否显示数字
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Push/HistoryList.ashx", "POST", _this.requestPar, function (resp) {
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
        getDealTypeList: function () {//获取分类
            var _this = this;
            _this.showNum = false;
                requestApi("/Api/My/Push/DealTypeList.ashx", "POST", _this.requestPar, function (resp) {

                    if (resp.status)
                    {
                        _this.dealTypeList=resp.data.list;
                        _this.showNum = true;
                        _this.getPushKeyword("title");
                        _this.getPushKeyword("detail");
                    }

                }

                )
            

        },
        getSubscriptionList: function () {//获取订阅列表
            var _this = this;
            requestApi("/Api/My/Subscription/List.ashx", "POST", {}, function (resp) {

                if (resp.status) {
                    _this.subscriptionList = resp.data.list;
                    if (_this.subscriptionList.length>0) {
                        if(GetQueryString ("subscription_id")== ""){
                            _this.requestPar.subId = _this.subscriptionList[0].id;
                        }
                        else{
                            _this.requestPar.subId = GetQueryString ("subscription_id");
                        }
                        _this.getDataList();
                        _this.getDealTypeList();

                    }
                    
                }

            }

            )


        },
        getPushKeyword: function (type) {//获取推送关键字
            var _this = this;
            requestApi("/Api/My/Push/Keyword/Get.ashx", "POST", { type: type }, function (resp) {

                if (resp.status) {
                    if (type=="title") {
                        _this.pushKeywordListTitle = resp.data.list;
                        _this.requestPar.keywordTitle = resp.data.keywords;
                    }
                    if (type == "detail") {
                        _this.pushKeywordListDetail = resp.data.list;
                        _this.requestPar.keywordDetail = resp.data.keywords;                        
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
            this.showNoData = false;
            this.list = [];
            this.getDataList();
            this.getDealTypeList();
        },
        setTypeId: function (typeId) {//设置分类id
            this.requestPar.pageIndex = 1;
            if (this.requestPar.typeId != typeId) {
                this.requestPar.typeId = typeId;
            } else {
                this.requestPar.typeId = "0";
            }
            this.isLoadAll = false;
            this.showNoData = false;
            this.list = [];
            this.getDataList();
        },
        setSubId: function (subId) {//设置订阅Id
            this.requestPar.pageIndex = 1;
            if (this.requestPar.subId != subId) {
                this.requestPar.subId = subId;
                this.isLoadAll = false;
                this.showNoData = false;
                this.list = [];            
                this.getDataList();
                this.getDealTypeList();
            } else {
                //this.requestPar.subId = "";
                return false;
            }
            
        },
        delKeywordTitle: function (item) {//删除关键字
            this.pushKeywordListTitle.splice(this.pushKeywordListTitle.indexOf(item), 1);
        },
        addKeywordTitle: function () {//添加关键字
            if (this.pushKeywordInput=="") {
                return;
            }
            this.pushKeywordListTitle.push(this.pushKeywordInput);
            this.pushKeywordInput = "";
        },
        updateKeywordTitle: function () {//保存关键字 标题
            //if (this.pushKeywordListTitle.length==0) {
            //    alert("关键字数量不能为0");
            //    return false;
            //}
            var _this = this;
            requestApi("/Api/My/Push/Keyword/Update.ashx", "POST", { type: "title", keywords: _this.pushKeywordListTitle.join(',')}, function (resp) {

                if (resp.status) {
                    toast("保存成功");
                    _this.requestPar.keywordTitle = _this.pushKeywordListTitle.join(',');
                    _this.showEditKeyowrdDivTitle = false;
                    _this.list = [];
                    _this.getDataList();
                    _this.getDealTypeList();
                }

            }

            )
        },
        delKeywordDetail: function (item) {//删除关键字
            this.pushKeywordListDetail.splice(this.pushKeywordListDetail.indexOf(item), 1);
        },
        addKeywordDetail: function () {//添加关键字
            if (this.pushKeywordInputDetail == "") {
                return;
            }
            this.pushKeywordListDetail.push(this.pushKeywordInputDetail);
            this.pushKeywordInputDetail = "";
        },
        updateKeywordDetail: function () {//保存关键字 内容
            //if (this.pushKeywordListDetail.length == 0) {
            //    alert("关键字数量不能为0");
            //    return false;
            //}
            var _this = this;
            requestApi("/Api/My/Push/Keyword/Update.ashx", "POST", { type: "detail", keywords: _this.pushKeywordListDetail.join(',') }, function (resp) {

                if (resp.status) {
                    toast("保存成功");
                    _this.requestPar.keywordDetail = _this.pushKeywordListDetail.join(',');
                    _this.showEditKeyowrdDivDetail = false;
                    _this.list = [];
                    _this.getDataList();
                    _this.getDealTypeList();
                }

            }

            )
        },
        handleScroll: function () {//滚动加载
            var h = $('.push_scroll_div').height();//div可视区域的高度
            var sh = $('.push_scroll_div')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $('.push_scroll_div')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离

            //上面的代码是判断滚动条滑到底部的代码
            if (h + st - sh >= -50) {
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
        toTop: function () {//
            $('.push_scroll_div').animate({ scrollTop: 0 }, 'fast');
        },
        init: function () {//初始化
           // window.addEventListener('scroll', this.handleScroll);//滚动监听
            this.getSubscriptionList();            
        }
    }
})
vm.init();
