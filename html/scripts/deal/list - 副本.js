
var vm = new Vue({
    el: '#app',
    data: {//数据集合
        requestPar: {//接口请求参数
            stageId: "",//招标状态 0招标 1中标
            keyword: "",//关键字
            dealTimeFrom:"",//时间开始
            dealTimeTo:"",//时间结束
            minAmount:"",//最小金额 
            maxAmount:"",//最大金额
            cityIds:"",//选中城市 id 
            distIds:"",//选中 城市区域 id 多个用,分隔
            platformIds:"",//平台id 多个用,分隔
            typeIds:"",//分类id 多个用,分隔
            pageIndex: 1,//页码
            pageSize: 50//页数
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData:false,//是否无数据
        showHistoryKeyword: false,//是否显示历史关键字面板
        showSearchSug:false,//是否显示搜索建议面板
        selectTabIndex:1,//顶部tab 选择 搜项目 搜中标人 搜业主
        selectSearchOptionTabIndex:0,//搜索选项弹框索引 地区 时间 金额 行业 
        selectAreaTabIndex:0,//地区左侧Tab选中索引 HOT热点 国家级 省市县 全球订阅
        timeRangeType:0,//时间范围 0 全部 1 近三天 2 近十天 3 近一个月
        historyKeywordList: [],//历史关键字列表     
        totalCount: 0,//搜索总数量
        list: [],      //项目集合 
        dealTypeList: [],//行业列表
        areaListLevel1: [],//地区第一级分类
        sugList: [],//搜索建议集合 

        selectCityIds: [],//选中的城市Id 多个用,分隔
        selectDistIds: [],//选中的城市区域Id 多个用,分隔
        selectPlatmIds: [],//选中的平台Id 多个用,分隔

        selectCity: [],//选中的城市 多个用,分隔
        selectDist: [],//选中的城市区域 多个用,分隔
        selectPlatm: [],//选中的平台 多个用,分隔


        selectCityNames: [],//选中的城市 多个用,分隔
        selectDistNames: [],//选中的城市区域 多个用,分隔
        selectPlatmNames: [],//选中的平台 多个用,分隔

        selectTypeNames:"",//选中的行业名称 多个用,分隔

        areaLevel1Name:"", //地区 第一级选中名称
        areaLevel2Name:"",//地区 第二级选中名称
        areaLevel3Name:"",//地区 第三级选中名称
        areaLevel4Name:"",//地区 第四级选中名称
        areaLevel5Name:"",//地区 第五级选中名称

        areaListLevel2Hot:[],//HOT热点列表 第二级
        areaListLevel3Hot:[],//HOT热点列表 第三级
        areaListLevel4Hot:[],//HOT热点列表 第四级
        areaListLevel5Hot:[],//HOT热点列表 第五级
        areaSelectIndexLeve12Hot:0,// HOT热点第二级选中
        areaSelectIndexLeve13Hot:0,// HOT热点第三级选中
        areaSelectIndexLeve14Hot:0,// HOT热点第四级选中
        areaSelectIndexLevel5Hot:0,// HOT热点第五级选中

        areaListLevel2Nationa:[],//国家级列表 第二级
        areaListLevel3Nationa:[],//国家级列表 第三级
        areaListLevel4Nationa:[],//国家级列表 第四级
        areaListLevel5Nationa:[],//国家级列表 第五级
        areaSelectIndexLeve12Nationa:-2,// 国家级第二级选中
        areaSelectIndexLeve13Nationa: -2,// 国家级第三级选中
        areaSelectIndexLeve14Nationa: -2,// 国家级第四级选中
        areaSelectIndexLevel5Nationa: -2,// 国家级第五级选中

        areaListLevel2:[],//省市县列表 第二级
        areaListLevel3:[],//省市县列表 第三级
        areaListLevel4:[],//省市县列表 第四级
        areaListLevel5:[],//省市县列表 第五级
        areaSelectIndexLeve12:0,// 省市县第二级选中
        areaSelectIndexLeve13:0,// 省市县第三级选中
        areaSelectIndexLeve14: 0,// 省市县第四级选中
        areaSelectIndexLevel5:0,// 省市县第五级选中


    },
    methods: {//方法集合
        getDataList: function () {//请求项目列表接口数据
            var _this = this;
            var arryDist = [];
            for (var i = 0; i < _this.selectDistIds.length; i++) {
                if (_this.selectDistIds[i].toString().indexOf("all")<=-1) {
                    arryDist.push(_this.selectDistIds[i]);
                }
            }
            _this.requestPar.distIds = arryDist.join(',');

            var arryCity = [];
            for (var i = 0; i < _this.selectCityIds.length; i++) {
                if (_this.selectCityIds[i].toString().indexOf("all") <= -1) {
                    arryCity.push(_this.selectCityIds[i]);
                }
            }
            _this.requestPar.cityIds = arryCity.join(',');

            var arryPlat = [];
            for (var i = 0; i < _this.selectPlatmIds.length; i++) {
                if (_this.selectPlatmIds[i].toString().indexOf("all") <= -1) {
                    arryPlat.push(_this.selectPlatmIds[i]);
                }
            }

            for (var i = 0; i < _this.selectPlatmIds.length; i++) {
                if (_this.selectPlatmIds[i].toString().indexOf("all_492")>-1) {
                    _this.requestPar.cityIds = "492";//国家级项目
                
                }
            }
            _this.requestPar.platformIds = arryPlat.join(',');

            _this.loading = true;
            _this.showNoData = false;
            requestApi("/Api/Deal/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
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
        rep: function (titleshow) {//请求项目列表接口数据 (建议搜索)
            var _this = this;
            if (_this.requestPar.keyword != "") {
                var keyAarr = _this.requestPar.keyword.split(' ');  
                for (var i = 0; i < keyAarr.length; i++) {
                    if (keyAarr[i] != "") {
                        var reg = new RegExp(keyAarr[i], "g")
                        titleshow = titleshow.replace(reg, '<i>' + keyAarr[i] + '</i>');
                    }
                }
            }
            return titleshow;
        },        
        getSugDataList: function (keyword) {//请求项目列表接口数据 (建议搜索)
            var _this = this;
            // requestApi("/Api/Deal/List.ashx", "POST", {keyword:keyword,pageSize:20}, function (resp) {
            //     if (resp.data != null)
            //     {
            //         _this.sugList = resp.data.list;
            //         if (_this.sugList.length>0) {
            //             _this.showSearchSug=true;
            //             _this.showHistoryKeyword=false;
            //         }
                  
            //     }

            // }

            // )
        },
        getDealTypeList: function () {//获取分类
            var _this = this;
            requestApi("/Api/Deal/DealTypeList.ashx", "POST", {}, function (resp) {

                if (resp.status)
                {
                    _this.dealTypeList=resp.data.list;
                    
                }

            }

            )
            

        },
        restoreSelectDist: function () {//还原选中的区域id
           
            switch (this.areaLevel1Name) {
                case "HOT热点":
                    for (var i = 0; i < this.selectDistIds.length; i++) {
                        $('[data-distidhot-id="' + this.selectDistIds[i] + '"]').addClass("active");
                    }

                    break;
                case "国家级":
                    for (var i = 0; i < this.selectPlatmIds.length; i++) {
                        $('[data-platmid-id="' + this.selectPlatmIds[i] + '"]').addClass("active");
                    }

                    break;
                case "省市县":
                    for (var i = 0; i < this.selectDistIds.length; i++) {
                        $('[data-distid-id="' + this.selectDistIds [i]+ '"]').addClass("active");
                    }

                    break;
                default:

            }

            

        },
        restoreSelectCity: function () {//还原选中的城市id
           
            switch (this.areaLevel1Name) {
                case "HOT热点":
                    for (var i = 0; i < this.selectCityIds.length; i++) {
                        $('[data-cityidhot-id="' + this.selectCityIds[i] + '"]').addClass("city-select");
                    }
                    break;
                case "国家级":
                    break;
                case "省市县":
                    for (var i = 0; i < this.selectCityIds.length; i++) {
                        $('[data-cityid-id="' + this.selectCityIds[i] + '"]').addClass("city-select");
                    }

                    break;
                default:

            }

            

        },
        setTab: function (index) {//设置顶部tab

            this.selectTabIndex =index;
            this.selectSearchOptionTabIndex =0;
        },
        setSearchOptionTab:function (index) {//设置搜索条件弹框 时间 金额 行业 地区
            if (this.selectSearchOptionTabIndex!=index) {
                this.selectSearchOptionTabIndex =index;
            }else {
                this.selectSearchOptionTabIndex =0;
            }
           

        },
        setAreaTab: function (index) {//地区第一级
            //设置区域tab
            this.selectAreaTabIndex = index;
            switch (this.selectAreaTabIndex) {
                case 1://HOT热点
                    this.areaListLevel3Nationa = [];//国家级列表 第三级
                    this.areaListLevel4Nationa = [];//国家级列表 第四级
                    this.areaListLevel5Nationa = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12Nationa = -2;// 国家级第二级选中
                    this.areaSelectIndexLeve13Nationa = 0;// 国家级第三级选中
                    this.areaSelectIndexLeve14Nationa = 0;// 国家级第四级选中
                    this.areaSelectIndexLevel5Nationa = 0;// 国家级第五级选中

                    this.areaListLevel3 = [];//省市县 第三级
                    this.areaListLevel4 = [];//省市县 第四级
                    this.areaListLevel5 = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12 = 0;// 省市县第二级选中
                    this.areaSelectIndexLeve13 = 0;// 省市县第三级选中
                    this.areaSelectIndexLeve14 = 0;// 省市县第四级选中
                    this.areaSelectIndexLevel5 = 0;// 省市县第五级选中

                    this.areaLevel1Name="HOT热点";
                    this.areaLevel2Name=this.areaListLevel2Hot[0].name;
                    this.areaSelectIndexLeve12Hot=this.areaListLevel2Hot[0].id;
                    this.getAreaDataList(3);
                    break;
                case 2://国家级
                    this.areaListLevel3Hot = [];//HOT热点列表 第三级
                    this.areaListLevel4Hot = [];//HOT热点列表 第四级
                    this.areaListLevel5Hot = [];//HOT热点列表 第五级
                    this.areaSelectIndexLeve12Hot = 0;// HOT热点第二级选中
                    this.areaSelectIndexLeve13Hot = 0;// HOT热点第三级选中
                    this.areaSelectIndexLeve14Hot = 0;// HOT热点第四级选中
                    this.areaSelectIndexLevel5Hot = 0;// HOT热点第五级选中

                    this.areaListLevel3 = [];//省市县 第三级
                    this.areaListLevel4 = [];//省市县 第四级
                    this.areaListLevel5 = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12 = 0;// 省市县第二级选中
                    this.areaSelectIndexLeve13 = 0;// 省市县第三级选中
                    this.areaSelectIndexLeve14 = 0;// 省市县第四级选中
                    this.areaSelectIndexLevel5 = 0;// 省市县第五级选中

                    this.areaLevel1Name="国家级";
                    this.areaLevel2Name=this.areaListLevel2Nationa[0].name;
                    this.areaSelectIndexLeve12Nationa=this.areaListLevel2Nationa[0].id;
                    this.getAreaDataList(3);
                    break;
                case 3://省市县
                    this.areaListLevel3Hot = [];//HOT热点列表 第三级
                    this.areaListLevel4Hot = [];//HOT热点列表 第四级
                    this.areaListLevel5Hot = [];//HOT热点列表 第五级
                    this.areaSelectIndexLeve12Hot = 0;// HOT热点第二级选中
                    this.areaSelectIndexLeve13Hot = 0;// HOT热点第三级选中
                    this.areaSelectIndexLeve14Hot = 0;// HOT热点第四级选中
                    this.areaSelectIndexLevel5Hot = 0;// HOT热点第五级选中

                    this.areaListLevel3Nationa = [];//国家级列表 第三级
                    this.areaListLevel4Nationa = [];//国家级列表 第四级
                    this.areaListLevel5Nationa = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12Nationa = -2;// 国家级第二级选中
                    this.areaSelectIndexLeve13Nationa = 0;// 国家级第三级选中
                    this.areaSelectIndexLeve14Nationa = 0;// 国家级第四级选中
                    this.areaSelectIndexLevel5Nationa = 0;// 国家级第五级选中

                    this.areaLevel1Name="省市县";
                    this.areaLevel2Name=this.areaListLevel2[0].name;
                    this.areaSelectIndexLeve12=this.areaListLevel2[0].id;
                    this.getAreaDataList(3);


                    break;
                default:

            }
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
            this.showSearchSug = false;
            this.selectSearchOptionTabIndex = 0;
            this.saveKeyword();
            this.getHistoryKeyword();
            this.isLoadAll = false;
            this.selectTabIndex=1;
            this.list = [];
            this.getDataList();

        },
        setArea:function(areaLevel1Name,level,item)//设置地区 下一级数据
        {
            this.areaLevel1Name=areaLevel1Name;
            switch (areaLevel1Name) {
                case "HOT热点":
                    switch (level) {
                        case 1:
                            break;
                        case 2:
                            this.areaLevel2Name=item.name;
                            this.areaSelectIndexLeve12Hot=item.id;
                            this.areaListLevel3Hot=[];
                            this.areaListLevel4Hot=[];
                            this.areaListLevel5Hot=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 3:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13Hot=item.id;
                            this.areaListLevel4Hot=[];
                            this.areaListLevel5Hot=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 4:
                            this.areaLevel4Name=item.name;
                            this.areaSelectIndexLeve14Hot=item.id;
                            this.areaListLevel5Hot=[];
                            this.getAreaDataList(level+1);
                           
                            break;
                        case 5:
                            this.areaLevel5Name=item.name;
                            this.areaSelectIndexLeve15Hot=item.id;
                            this.requestPar.distIds=item.id;
                            break;
                        default:
        
                    }
                    this.requestPar.platformIds="";
                    break;
                case "国家级":
                    switch (level) {
                        case 1:
                            break;
                        case 2:
                            this.areaLevel2Name=item.name;
                            this.areaSelectIndexLeve12Nationa=item.id;
                            this.areaListLevel3Nationa=[];
                            this.areaListLevel4Nationa=[];
                            this.areaListLevel5Nationa=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 3:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13Nationa=item.id;
                            this.areaListLevel4Nationa=[];
                            this.areaListLevel5Nationa=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 4:
                            this.areaLevel4Name=item.name;
                            this.areaSelectIndexLeve14Nationa=item.id;
                            this.areaListLevel5Nationa=[];
                            if (item.name=="国家级项目") {
                                this.requestPar.cityIds="492";
                            }else {
                                this.requestPar.cityIds="";
                            }
                            this.getAreaDataList(level+1);
                            break;
                        case 5:
                            this.areaLevel5Name=item.name;
                            this.areaSelectIndexLeve15Nationa=item.id;
                           
                           
                            break;
                        default:
        
                    }
                    break;
                case "省市县":
                    switch (level) {
                        case 1:
                            break;
                        case 2:
                            this.areaLevel2Name=item.name;
                            this.areaSelectIndexLeve12=item.id;
                            this.areaListLevel3=[];
                            this.areaListLevel4=[];
                            this.areaListLevel5=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 3:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13=item.id;
                            this.areaListLevel4=[];
                            this.areaListLevel5=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 4:
                            this.areaLevel4Name=item.name;
                            this.areaSelectIndexLeve14=item.id;
                            this.areaListLevel5Nationa=[];
                            this.getAreaDataList(level+1);


                            break;
                        case 5:
                            this.areaLevel5Name=item.name;
                            this.areaSelectIndexLeve15=item.id;
                            this.requestPar.distIds=item.id;
                            break;
                        default:
        
                    }
                    this.requestPar.platformIds="";
                    break;
                default:
        
            }

        
        },
        setAreaSearch: function () {//设置区域搜索

            this.selectSearchOptionTabIndex=0;
            this.requestPar.pageIndex = 1;
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();
        },
        clearAreaSearch: function () {//重置区域设置

            this.selectCityIds = [];
            this.selectDistIds = [];
            this.selectPlatmIds = [];

            this.selectCity = [];
            this.selectDist = [];
            this.selectPlatm = [];

            this.requestPar.cityIds = "";
            this.requestPar.distIds = "";
            this.requestPar.platformIds = "";
            $('[data-distidhot-id]').removeClass("active");
            $('[data-cityidhot-id]').removeClass("city-select");
            $('[data-platmid-id]').removeClass("active");
            $('[data-distid-id]').removeClass("active");
            $('[data-cityid-id]').removeClass("city-select");

        },
        getAreaDataListLevel1: function (areaLevel1Name) {//获取第一级
            var _this = this;
            requestApi("/Api/Area/GetAreaLevel1.ashx", "POST", { }, function (resp) {

                if (resp.status) {
                        
                    _this.areaListLevel1 = resp.data;

                }

            }

            )


        },
        getAreaDataListLevel2: function (areaLevel1Name) {//获取第二级
            var _this = this;
            requestApiSync("/Api/Area/GetAreaLevel2.ashx", "POST", {areaLevel1Name:areaLevel1Name}, function (resp) {

                if (resp.status) {
                    switch (areaLevel1Name) {
                        case "HOT热点":
                            _this.areaListLevel2Hot = resp.data;
                            break;
                        case "国家级":
                            _this.areaListLevel2Nationa = resp.data;
                            break;
                        case "省市县":
                            _this.areaListLevel2= resp.data;
                            break;
                        default:
        
                    }
                  

                }

            }

            )


        },
        getAreaDataList: function (level) {//获取地区下一级数据
            var _this = this;
            var url="/Api/Area/GetAreaLevel"+level+".ashx";
            if (level>=6) {
                return;
            }

            requestApi(url, "POST", {
                areaLevel1Name:_this.areaLevel1Name,
                areaLevel2Name:_this.areaLevel2Name,
                areaLevel3Name:_this.areaLevel3Name,
                areaLevel4Name:_this.areaLevel4Name,
                areaLevel5Name:_this.areaLevel5Name,

            }, function (resp) {

                if (resp.status) {
                    switch (_this.areaLevel1Name) {
                        case "HOT热点":
                            switch (level) {
                                case 1:
                                    break;
                                case 2:
                                    _this.areaListLevel2Hot = resp.data;
                                    break;
                                case 3:
                                    _this.areaListLevel3Hot=resp.data;
                                    break;
                                case 4:
                                    _this.areaListLevel4Hot=resp.data;
                                    break;
                                case 5:
                                    _this.areaListLevel5Hot=resp.data;
                                    break;
                                default:
        
                            }
                            break;
                        case "国家级":
                            switch (level) {
                                case 1:
                                    break;
                                case 2:
                                    _this.areaListLevel2Nationa = resp.data;
                                    break;
                                case 3:
                                    _this.areaListLevel3Nationa=resp.data;
                                    break;
                                case 4:
                                    _this.areaListLevel4Nationa=resp.data;
                                    break;
                                case 5:
                                    _this.areaListLevel5Nationa=resp.data;
                                    break;
                                default:
        
                            }
                            break;
                        case "省市县":
                            switch (level) {
                                case 1:
                                    break;
                                case 2:
                                    _this.areaListLevel2 = resp.data;
                                    break;
                                case 3:
                                    _this.areaListLevel3=resp.data;
                                    break;
                                case 4:
                                    _this.areaListLevel4=resp.data;
                                    break;
                                case 5:
                                    _this.areaListLevel5 = resp.data;
                                    break;
                                default:
        
                            }
                            break;
                        default:
        
                    }

                }

            }

            )


        },
        setAmount: function () {//设置搜索金额

            if (this.requestPar.minAmount!=""&&this.requestPar.maxAmount!="") {
                
                if (parseInt(this.requestPar.minAmount)>parseInt(this.requestPar.maxAmount)) {
                    
                    toast("最小金额不能大于最大金额");
                    return;
                }

            }

            this.selectSearchOptionTabIndex=0;
            this.requestPar.pageIndex = 1;
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();

        },
        clearAmount: function () {//重置搜索金额
            this.requestPar.pageIndex = 1;
            this.requestPar.minAmount="";
            this.requestPar.maxAmount="";

        },
        setTime: function () {//设置搜索时间

            if (this.requestPar.dealTimeFrom!=""&&this.requestPar.dealTimeTo!="") {
                
                if (parseInt(this.requestPar.dealTimeFrom.replace(/-/g, "")) >parseInt(this.requestPar.dealTimeTo.replace(/-/g,"")) ) {
                    
                    toast("开始时间不能晚于结束时间");
                    return;
                }

            }
            this.selectSearchOptionTabIndex=0;
            this.requestPar.pageIndex = 1;
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();

        },
        clearTime: function () {//重置搜索时间
            this.requestPar.pageIndex = 1;
            this.requestPar.dealTimeFrom="";
            this.requestPar.dealTimeTo = "";
            this.timeRangeType = 0;

        },
        setTimeRangeType: function (type) {//设置时间范围
            this.timeRangeType=type;
            switch (type) {
                case 0://全部
                    this.requestPar.dealTimeFrom="";
                    this.requestPar.dealTimeTo="";
                    break;
                case 1://近三天
                    var fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() -3);
                    this.requestPar.dealTimeFrom=fromDate.format("yyyy-MM-dd");
                    this.requestPar.dealTimeTo=new Date().format("yyyy-MM-dd");
                    break;
                case 2://近十天
                    var fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() -10);
                    this.requestPar.dealTimeFrom=fromDate.format("yyyy-MM-dd");
                    this.requestPar.dealTimeTo=new Date().format("yyyy-MM-dd");
                    break;
                case 3://近一个月
                    var fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() -30);
                    this.requestPar.dealTimeFrom=fromDate.format("yyyy-MM-dd");
                    this.requestPar.dealTimeTo=new Date().format("yyyy-MM-dd");
                    break;
                default:
        
            }

        },
        setTypeId:function(){//设置分类
            this.selectSearchOptionTabIndex=0;
            this.requestPar.pageIndex = 1;
            this.requestPar.typeIds=this.getSelectTypeIds();
            this.isLoadAll = false;
            this.list = [];
            this.getDataList();
          
        },
        clearTypeId:function(){//重置分类
            this.requestPar.pageIndex = 1;
            this.requestPar.typeIds="";
            this.selectTypeNames="";
            $('[data-typeid-id]').removeClass("active");
          
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
            }
        },
        getSelectTypeIds:function(){//获取选中的行业id
        
            //if ($('[data-typeid-id="0"]').hasClass("active")) 
            //{
            //    return "0";
            //}
            var arry=[];
            $('[data-typeid-id]').each(function () {

                if ($(this).hasClass("active") && $(this).data("typeid-id") != "0") {
                   
                    arry.push($(this).data("typeid-id"));
                } 



            })

            return arry.join(',');
        },
        getSelectTypeNames:function(){//获取选中的行业
        
            var arry=[];
            if ($('[data-typeid-id="0"]').hasClass("active")) 
            {
                arry.push("全部");
            }else {

                $('[data-type-name]').each(function () {

                    if ($(this).hasClass("active")) {
                   
                        arry.push($(this).data("type-name"));
                    } 



                })
            }
            return arry.join(',');
        },
        setSelectTypeIds: function () {//设置行业id

            this.typeIds=this.getSelectTypeIds();
        },
        keywordKeyUp: function (event) {//建议搜索
            if (this.requestPar.keyword!="") {
               
                this.getSugDataList(this.requestPar.keyword);
            }
            if (event.keyCode==13) {
                this.setKeyword();
            }
        },
        subscription:function(){//订阅
            var _this=this;
            if (_this.selectCityIds.length>0) {
                localStorage.setItem(config.localStorageKey_CityIds, JSON.stringify(_this.selectCityIds));

            }
            if (_this.selectCity.length>0) {
                localStorage.setItem(config.localStorageKey_CityNames, JSON.stringify(_this.selectCity));

            }

            var arryDist = [];
            for (var i = 0; i < _this.selectDistIds.length; i++) {
                if (_this.selectDistIds[i].toString().indexOf("all")<=-1) {
                    arryDist.push(_this.selectDistIds[i]);
                }
            }
            if (arryDist.length>0) {
                localStorage.setItem(config.localStorageKey_DistIds, JSON.stringify(arryDist));

            }
            if (_this.selectDist.length>0) {
                localStorage.setItem(config.localStorageKey_DistNames, JSON.stringify(_this.selectDist));

            }
            var arryPlatIds = [];
            for (var i = 0; i < _this.selectPlatmIds.length; i++) {
 
                if (_this.selectPlatmIds[i].toString().indexOf("all_492")>-1) {

                    var arryIdCity=[];
                    arryIdCity.push(492);
                    var arryCityName=[];
                    arryCityName.push("国家级项目");
                    localStorage.setItem(config.localStorageKey_CityIds, JSON.stringify(arryIdCity));
                    localStorage.setItem(config.localStorageKey_CityNames, JSON.stringify(arryCityName));
                 
                
                }else{
                
                    if (_this.selectPlatmIds[i].toString().indexOf("all")<=-1) {
                        arryPlatIds.push(_this.selectPlatmIds[i]);
                    }
                
                }
            }
            if (arryPlatIds.length>0) {
                localStorage.setItem(config.localStorageKey_PlatformIds, JSON.stringify(arryPlatIds));

            }
            if (_this.selectPlatm.length>0) {

                localStorage.setItem(config.localStorageKey_PlatformNames, JSON.stringify(_this.selectPlatm));

            }
            var typeIds=_this.getSelectTypeIds().split(',');
            if (typeIds!="") {
                var arryTypeIdsNew = [];
                for (var i = 0; i < typeIds.length; i++) {
                    if (typeIds[i].toString().indexOf("all")<=-1) {
                        arryTypeIdsNew.push(typeIds[i]);
                    }
                }
                if (arryTypeIdsNew.length>0) {
                    localStorage.setItem(config.localStorageKey_TypeIds, JSON.stringify(arryTypeIdsNew));
                }
            }

            window.location.href="../my/subscription.html?keyword="+encodeURI(_this.requestPar.keyword);

        },
        handleScroll: function (event) {//滚动加载
            //console.log(event.srcElement.className);
           // console.log(event);
            var h = $('.list-box').height();//div可视区域的高度
            var sh = $('.list-box')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st =$('.list-box')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            //console.log(h + st-sh);
            //上面的代码是判断滚动条滑到底部的代码
            if (h + st >= sh - 2) {
                if ((this.requestPar.pageIndex * this.requestPar.pageSize >= this.totalCount)) {
                    this.isLoadAll = true;
                    console.log("加载完成");
                    return;
                }
                this.requestPar.pageIndex++;
                this.getDataList();
            }
        },
        init: function () {//初始化

            this.requestPar.stageId = GetQueryString("stageId");//项目状态
            //if (this.requestPar.stageId=="") {
            //    this.requestPar.stageId = 0;
            //}
            this.requestPar.keyword = decodeURI(GetQueryString("keyword"));//关键字
            try {
                var citysJson= localStorage.getItem(config.localStorageKey_City);
                var distsJson= localStorage.getItem(config.localStorageKey_Dist);
          
                if (citysJson!=null&&citysJson!="") {
                
                    var citys=JSON.parse(citysJson);
                    for (var i = 0; i < citys.length; i++) {
                    
                        this.selectCityIds.push(citys[i].id);
                        this.selectCity.push(citys[i].name);
                    }

                    localStorage.removeItem(config.localStorageKey_City);
                   
                }

                if (distsJson!=null&&distsJson!="") {
                
                    var dists=JSON.parse(distsJson);
                    for (var i = 0; i < dists.length; i++) {
                    
                        this.selectDistIds.push(dists[i].id);
                        this.selectDist.push(dists[i].name);
                    }
                    localStorage.removeItem(config.localStorageKey_Dist);
                }
    
            } catch (e) {
                console.log("err",e);
                localStorage.removeItem(config.localStorageKey_City);
                localStorage.removeItem(config.localStorageKey_Dist);
            }
              this.getDataList();//项目列表
              this.getHistoryKeyword();//历史关键字
              this.getDealTypeList();//行业列表
              this.getAreaDataListLevel2("HOT热点");
              this.getAreaDataListLevel2("国家级");
              this.getAreaDataListLevel2("省市县");
              this.setAreaTab(1);


        }
    } ,
    watch: {
        //热点开始
                areaListLevel3Hot: {// pro start 
                    handler(newValue, oldName) 
                    {
                        if (newValue.length>0) 
        {
            this.areaLevel3Name=newValue[0].name;
            this.areaSelectIndexLeve13Hot=newValue[0].id;
            this.getAreaDataList(4);
        }
                  
            
        },

        deep: true,
            immediate: true
        },// pro end 
        areaListLevel4Hot: {// pro start 
            handler(newValue, oldName) 
            {
                if (newValue.length>0) 
                {
                    this.areaLevel4Name=newValue[0].name;
                    this.areaSelectIndexLeve14Hot=newValue[0].id;
                    this.getAreaDataList(5);
                }
                   
            
            },

            deep: true,
            immediate: true
        },// pro end 
//热点区域结束  

//国家级开始
areaListLevel3Nationa: {// pro start 
    handler(newValue, oldName) 
    {
        if (newValue.length>0) 
        {
            this.areaLevel3Name=newValue[0].name;
            this.areaSelectIndexLeve13Nationa=newValue[0].id;
            this.getAreaDataList(4);
        }
                  
            
    },

    deep: true,
    immediate: true
},// pro end 
areaListLevel4Nationa: {// pro start 
    handler(newValue, oldName) 
    {
        if (newValue.length>0) 
        {
            this.areaLevel4Name=newValue[0].name;
            this.areaSelectIndexLeve14Nationa=newValue[0].id;
            this.getAreaDataList(5);
        }
                   
            
    },

    deep: true,
    immediate: true
},// pro end 
//国家级结束 

//省市县开始
        areaListLevel3: {// pro start 
            handler(newValue, oldName) 
            {
            if (newValue.length>0) 
            {
                this.areaLevel3Name=newValue[0].name;
                this.areaSelectIndexLeve13=newValue[0].id;
                this.getAreaDataList(4);
            }
            
            },

           deep: true,
           immediate: true
          },// pro end 
          areaListLevel4: {// pro start 
                handler(newValue, oldName) 
                {
                    if (newValue.length>0) 
                    {
                        this.areaLevel4Name=newValue[0].name;
                        this.areaSelectIndexLeve14=newValue[0].id;
                        this.getAreaDataList(5);
                    }
            
                },

                deep: true,
                immediate: true
          },// pro end 
            // 省市县结束
            


}//watch end

    
})
vm.init();
