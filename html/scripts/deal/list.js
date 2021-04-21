
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
            cityIds:"",//选中城市 id 多个用,分隔
            distIds:"",//选中 城市区域 id 多个用,分隔
            platformIds:"",//选中 平台id 多个用,分隔
            typeIds:"",//选中 分类id 多个用,分隔
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
        timeRangeType:0,//时间范围 0 全部 1 近三天 2 近十天 3 近一个月
        historyKeywordList: [],//历史关键字列表     
        totalCount: 0,//搜索总数量
        list: [],      //项目集合 
        dealTypeList: [],//行业列表
        sugList: [],//搜索建议集合 

        selectCityIds: [],//选中的城市Id 多个用,分隔
        selectDistIds: [],//选中的城市区域Id 多个用,分隔
        selectPlatmIds: [],//选中的平台Id 多个用,分隔

        selectCity: [],//选中的城市名称 多个用,分隔
        selectDist: [],//选中的城市区域名称 多个用,分隔
        selectPlatm: [],//选中的平台名称 多个用,分隔
        selectTypeNames:"",//选中的行业名称 多个用,分隔

        areaSelectIndexLeve11:0,//地区 第一级选中 id
        areaSelectIndexLeve12:0,// 地区 第二级选中 id
        areaSelectIndexLeve13:0,// 地区 第三级选中 id
        areaSelectIndexLeve14: 0,//地区 第四级选中 id
        areaSelectIndexLevel5:0,// 地区 第五级选中 id

        areaLevel1Name:"", //地区 第一级选中名称
        areaLevel2Name:"",//地区 第二级选中名称
        areaLevel3Name:"",//地区 第三级选中名称
        areaLevel4Name:"",//地区 第四级选中名称
        areaLevel5Name:"",//地区 第五级选中名称

        areaListLevel1:[],//地区 第一级
        areaListLevel2:[],//地区 第二级
        areaListLevel3:[],//地区 第三级
        areaListLevel4:[],//地区 第四级
        areaListLevel5:[],//地区 第五级




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
                _this.loading = false;
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
        areaLevelClick: function (item,level) {//地区点击

            switch (level) {
                case 1:
                    this.areaSelectIndexLeve11=item.id;
                    this.areaLevel1Name=item.name;
                    this.areaListLevel2 = [];//第二级 数据
                    this.areaListLevel3 = [];// 第三级 数据
                    this.areaListLevel4 = [];//第四级 数据
                    this.areaListLevel5 = [];//第五级 数据
                    break;
                case 2:
                    this.areaSelectIndexLeve12=item.id;
                    this.areaLevel2Name=item.name;
                    this.areaListLevel3 = [];// 第三级 数据
                    this.areaListLevel4 = [];//第四级 数据
                    this.areaListLevel5 = [];//第五级 数据
                    break;
                case 3:
                    this.areaSelectIndexLeve13=item.id;
                    this.areaLevel3Name=item.name;
                    this.areaListLevel4 = [];//第四级 数据
                    this.areaListLevel5 = [];//第五级 数据
                    break;
                case 4:
                    this.areaSelectIndexLeve14=item.id;
                    this.areaLevel4Name=item.name;
                    this.areaListLevel5 = [];//第五级 数据
                    break;
                case 5:
                    break;
                default:
        
            }
            this.getAreaDataList(parseInt(level)+1);
           
            

        },
        getAreaDataList: function (level) {//获取地区数据
            var _this = this;
            var url="/Api/Area/GetAreaLevel"+level+".ashx";
            if (level>5) {
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

                    switch (level) {
                        case 1:
                            _this.areaListLevel1 = resp.data;
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

                }

            }

            )


        },
        restoreSelectDist: function () {//还原选中的区域
           
            for (var i = 0; i < this.selectDistIds.length; i++) {
                $('[data-dist-id="' + this.selectDistIds [i]+ '"]').addClass("active");
            }

            

        },
        restoreSelectCity: function () {//还原选中的城市
           
            for (var i = 0; i < this.selectCityIds.length; i++) {
                $('[data-city-id="' + this.selectCityIds[i] + '"]').addClass("city-select");
            }

            

        },
        restoreSelectPlat: function () {//还原选中的平台
           
            if (this.areaLevel2Name=="央企招采") {
                for (var i = 0; i < this.selectPlatmIds.length; i++) {
                    $('[data-dist-id="' + this.selectPlatmIds [i]+ '"]').addClass("active");
                }
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
            this.getAreaDataList(1);//获取地区第一级

        }
    } ,
    watch: {

       
        areaListLevel1: {// pro start 
            handler(newValue, oldName) 
                    {
                    if (newValue.length>0) 
{
    this.areaLevel1Name=newValue[0].name;
    this.areaSelectIndexLeve11=newValue[0].id;
    this.getAreaDataList(2);
}
            
}
},// pro end 
areaListLevel2: {// pro start 
    handler(newValue, oldName) 
    {
        if (newValue.length>0) 
        {
            this.areaLevel2Name=newValue[0].name;
            this.areaSelectIndexLeve12=newValue[0].id;
            this.getAreaDataList(3);
        }
            
    }

},// pro end 
areaListLevel3: {// pro start 
    handler(newValue, oldName) 
    {
        if (newValue.length>0) 
        {
            this.areaLevel3Name=newValue[0].name;
            this.areaSelectIndexLeve13=newValue[0].id;
            this.getAreaDataList(4);
        }
            
    }


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
            
    }


}// pro end 
           

}//watch end

    
})
vm.init();
