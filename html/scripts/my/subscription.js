
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {
            id:GetQueryString ("id")
        },//请求信息
        loading: false,//是否正在请求

        selectCityIds: [],//选中的城市Id 多个用,分隔
        selectDistIds: [],//选中的城市区域Id 多个用,分隔
        selectPlatmIds: [],//选中的平台Id 多个用,分隔

        selectCity: [],//选中的城市名称 多个用,分隔
        selectDist: [],//选中的城市区域名称 多个用,分隔
        selectPlatm: [],//选中的平台名称 多个用,分隔

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

        keywords_result:"请设置",
        type_result:"全部",
        region_result:'全国',//选择地区
        
        base_container_show:true,//编辑container
        region_container_show:false,//地区选择container
        type_container_show:false,//行业选择container
        keywords_show:false,//关键字编辑

        dealTypeList: [],//分类列表
        subscriptionInfo:{},//订阅信息

        keywordsList:[],//关键词列表
        selecttdDealTypeList: [],//选中行业列表

        dealTypeStatus:false,//行业选中状态

        list: []      //数据集合 
    },
    methods: {



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
        setAreaConfirm:function(){//确认地区选择
            var _this = this;

            _this.region_container_show=false;
            _this.base_container_show=true;

            //生成region_result
            var allNames = [];
            allNames = allNames.concat(_this.selectCity);
            allNames = allNames.concat(_this.selectDist);
            allNames = allNames.concat(_this.selectPlatm);
            allNames = unique(allNames);            
            _this.region_result = allNames.join(',');
            if (_this.region_result=="") {
                _this.region_result="全国";
            }
            console.log("vm.selectCityIds", vm.selectCityIds);
            console.log("vm.selectDistIds", vm.selectDistIds);
            //console.log("vm.selectPlatmIds", vm.selectPlatmIds);

            console.log("vm.selectCity", vm.selectCity);
            console.log("vm.selectDist", vm.selectDist);
            // console.log("vm.selectPlatm", vm.selectPlatm);

        },
        clearAreaSearch: function () {//重置区域设置

            this.selectCityIds = [];
            this.selectDistIds = [];
            this.selectPlatmIds = [];
            this.selectCity= [];
            this.selectDist = [];
            this.selectPlatm = [];

            $('[data-dist-id]').removeClass("active");
            $('[data-city-id]').removeClass("city-select");

        },
       
        showAreaSelect:function(){
            
                this.region_container_show=true;
                this.base_container_show=false;

            

        },
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            if(_this.requestPar.id != ""){
                requestApi("/Api/My/Subscription/Get.ashx", "POST", _this.requestPar, function (resp) {
                    if (resp.data != null) {
                        _this.subscriptionInfo = resp.data;
                        _this.loading = false;

                        $('.title-value').val(_this.subscriptionInfo.title);
                        _this.keywordsList = _this.subscriptionInfo.keywords.split('、');
                        _this.keywords_result = _this.subscriptionInfo.keywords;
                        _this.type_result = _this.subscriptionInfo.category == ""?"全部":_this.subscriptionInfo.category;
                        _this.selectCityIds=_this.subscriptionInfo.city_ids_show == "" ? [] :JSON.parse(_this.subscriptionInfo.city_ids_show);
                        _this.selectCity=_this.subscriptionInfo.city_names == "" ? [] :JSON.parse(_this.subscriptionInfo.city_names);

                        _this.selectDistIds=_this.subscriptionInfo.district_ids_show == "" ? [] :JSON.parse(_this.subscriptionInfo.district_ids_show);
                        _this.selectDist=_this.subscriptionInfo.district_names == "" ? [] :JSON.parse(_this.subscriptionInfo.district_names);
                        _this.selectPlatmIds=_this.subscriptionInfo.platform_ids == "" ? [] :JSON.parse(_this.subscriptionInfo.platform_ids);
                        _this.selectPlatm=_this.subscriptionInfo.platform_names == "" ? [] :JSON.parse(_this.subscriptionInfo.platform_names);
                        _this.selecttdDealTypeList = _this.subscriptionInfo.category_ids == "" ? [] :JSON.parse(_this.subscriptionInfo.category_ids);
                        _this.region_result = _this.subscriptionInfo.region == ""?"全国":_this.subscriptionInfo.region;

                        //生成region_result
                        var allNames = [];
                        allNames = allNames.concat(_this.selectCity);
                        allNames = allNames.concat(_this.selectDist);
                        allNames = allNames.concat(_this.selectPlatm);
                        allNames = unique(allNames);            
                        _this.region_result = allNames.join(',');
                        if (_this.region_result=="") {
                            _this.region_result="全国";
                        }

                        //国家级项目单独处理
                        if(_this.selectCityIds.includes(492)){
                            _this.selectPlatmIds.push("all_492");
                            _this.selectCityIds.splice(_this.selectCityIds.indexOf(492), 1);
                        }
                     

                    }

                }
                )
            }
        },
        getDealTypeList: function () {//获取分类
            var _this = this;
            requestApi("/Api/Deal/DealTypeList.ashx", "POST", {}, function (resp) {

                if (resp.status)
                {
                    _this.dealTypeList=resp.data.list;
                    _this.dealTypeList.forEach((item)=>{
                        _this.selecttdDealTypeList.forEach((itemInner)=>{                       
                            if (itemInner == item.id) {
                                if(_this.type_result == ""){
                                    _this.type_result = item.name;
                                }
                                else{
                                    _this.type_result += "," + item.name;
                                }
                            }     
                        }) 
                    })
                }

            }

            )
            

        },
        setDealTypeStutus: function () {//行业初始选中状态
            var _this = this;
            if(_this.selecttdDealTypeList.length > 0){                
                _this.selecttdDealTypeList.forEach((item)=>{
                    $('[data-typeid-id]').each(function () {                        
                        if ($(this).data("typeid-id") == item) {
                            $(this).addClass("active");
                        }     
                    }) 
                })
            }
                    

        },
        setDealTypeClick: function () {//行业点击事件
            $('[data-typeid-id]').live('click', function () {
           

                var ischeck= $(this).hasClass("active");
                if (!ischeck) {
                    $(this).addClass("active");
     
                    if ($(this).data("typeid-id") == "0") {
     
                        $('[data-typeid-id]').each(function () {
     
                            $(this).addClass("active");
     
     
     
                        })
                    } else {
     
                        var isCheckAll = true;
                        $('[data-typeid-id]').each(function () {
     
                            if (!$(this).hasClass("active") && $(this).data("typeid-id") != "0") {
                                isCheckAll = false;
                            } 
     
     
     
                        })
                        if (isCheckAll) {
                            $('[data-typeid-id="0"]').addClass("active");
                        }
     
     
                    }
     
     
     
                }
                else {
                    
                    $(this).removeClass("active");
                    $('[data-typeid-id="0"]').removeClass("active");
                    if ($(this).data("typeid-id") == "0") {
                        $('[data-typeid-id]').each(function () {
     
                            $(this).removeClass("active");
     
     
     
                        })
                    } else {
     
                    }
                }
                
                 
             })//行业点击            

        },
        setTypeId:function(){//设置分类
            var _this = this;
            _this.selecttdDealTypeList=this.getSelectTypeIds();   
            _this.type_container_show = false;
            _this.base_container_show = true;       
        },
        clearTypeId:function(){//重置分类
            $('[data-typeid-id]').removeClass("active");          
        },
        getSelectTypeIds:function(){//获取选中的行业id
            var _this = this;
            var arry=[];
            _this.type_result = "";
            if ($('[data-typeid-id="0"]').hasClass("active")) 
            {
                arry.push("0");
            }     
            else{       
                $('[data-typeid-id]').each(function () {

                    if ($(this).hasClass("active") && $(this).data("typeid-id") != "0") {                   
                        arry.push($(this).data("typeid-id"));
                        if(_this.type_result == ""){
                            _this.type_result = $(this).data("typeid-name");
                        }
                        else{
                            _this.type_result += "," + $(this).data("typeid-name");
                        }
                    } 
                })
            }
            if(_this.type_result == ""){
                _this.type_result = "全部";
            }

            return arry;
        },
        confirmKeyword: function () {//确认关键词
            var _this = this;
            console.log(_this.keywordsList);
            if(_this.keywordsList.length > 0){
                _this.keywords_result = "";
                _this.keywordsList.forEach((item)=>{
                   if(_this.keywords_result == ""){
                    _this.keywords_result = item;
                   }
                   else{
                    _this.keywords_result += "、" + item;
                   }
                   
                })
            }
            else{
                _this.keywords_result = "请设置";
            }
            _this.keywords_show = false;

        },
        deleteKeyword: function (index) {//删除关键词
            var _this = this;
            if (confirm("确定删除?")) {                
                _this.keywordsList.splice(index,1)
                console.log(index);
            }

        },
        addKeyword: function () {//新增关键词
                var _this = this;
                var keyword = $('.txt_keyword').val();
                if(keyword != ""){
                    var reg = new RegExp("、", "g")
                    keyword = keyword.replace(reg, "");

                    var exsit = false;
                    
                    _this.keywordsList.forEach((item)=>{
                        if(item == keyword){
                            exsit = true;
                            return false;
                        }
                    })
                    if(!exsit){
                        _this.keywordsList.push(keyword);
                        $('.txt_keyword').val("");
                    }
                    else{
                        layer.open({
                            content: '关键字已存在'
                            ,skin: 'msg'
                            ,time: 2 
                        });
                    }
                }
            

        },
        saveClick: function () {//保存
            var _this = this;
            if(_this.keywordsList.length == 0){
                alert("请设置关键词");
                return false;
            }
            if($('.title-value').val() == ""){
                alert("请输入标题");
                return false;
            }
            if($('.title-value').val().length > 20){
                alert("标题请控制在20个字符");
                return false;
            }
            var arryCity = [];
            for (var i = 0; i < _this.selectCityIds.length; i++) {
                if (_this.selectCityIds[i].toString().indexOf("all") <= -1) {
                    arryCity.push(_this.selectCityIds[i]);
                }
            }
            
            var arryDist = [];
            for (var i = 0; i < _this.selectDistIds.length; i++) {
                if (_this.selectDistIds[i].toString().indexOf("all")<=-1) {
                    arryDist.push(_this.selectDistIds[i]);
                }
            }
            
            var arryPlat = [];
            for (var i = 0; i < _this.selectPlatmIds.length; i++) {
                if (_this.selectPlatmIds[i].toString().indexOf("all") <= -1) {
                    arryPlat.push(_this.selectPlatmIds[i]);
                }
            }

            for (var i = 0; i < _this.selectPlatmIds.length; i++) {
                if (_this.selectPlatmIds[i].toString().indexOf("all_492")>-1) {
                    arryCity.push(492);
                
                }
            }
            arryCity = unique(arryCity);
            arryDist = unique(arryDist);
            arryPlat = unique(arryPlat);

            requestApi("/Api/My/Subscription/Edit.ashx", "POST", {
                id:_this.requestPar.id,
                title:$('.title-value').val(),
                city_ids:JSON.stringify(arryCity),
                district_ids:JSON.stringify(arryDist),
                platform_ids:JSON.stringify(arryPlat),
                cityNames:JSON.stringify(_this.selectCity),
                districtNames:JSON.stringify(_this.selectDist),
                platformNames:JSON.stringify(_this.selectPlatm),
                region:_this.region_result,
                category_ids:JSON.stringify(_this.selecttdDealTypeList),                
                category:_this.type_result,
                keywords:_this.keywords_result
            }, function (resp) {

                if (resp.status == true) {
                    window.location.href = 'subscription_list.html';
                }

            })


        },
init: function () {//初始化
   
            //快捷订阅初始化

            try {
                
                //来自搜索页
                var cityids= localStorage.getItem(config.localStorageKey_CityIds);
                var citynames= localStorage.getItem(config.localStorageKey_CityNames);
                var distids= localStorage.getItem(config.localStorageKey_DistIds);
                var distnames= localStorage.getItem(config.localStorageKey_DistNames);
                var platformids= localStorage.getItem(config.localStorageKey_PlatformIds);
                var platformnames= localStorage.getItem(config.localStorageKey_PlatformNames);
                var typeids= localStorage.getItem(config.localStorageKey_TypeIds);
          
                if (cityids!=null&&cityids!="") {
                
                    var citys=JSON.parse(cityids);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectCityIds.push(parseInt(citys[i]));                        
                    }
                    localStorage.removeItem(config.localStorageKey_CityIds);                   
                }
                if (citynames!=null&&citynames!="") {
                
                    var citys=JSON.parse(citynames);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectCity.push(citys[i]);                        
                    }
                    localStorage.removeItem(config.localStorageKey_CityNames);                   
                }
                if (distids!=null&&distids!="") {
                
                    var citys=JSON.parse(distids);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectDistIds.push(parseInt(citys[i]));                        
                    }
                    localStorage.removeItem(config.localStorageKey_DistIds);                   
                }
                if (distnames!=null&&distnames!="") {
                
                    var citys=JSON.parse(distnames);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectDist.push(citys[i]);                        
                    }
                    localStorage.removeItem(config.localStorageKey_DistNames);                   
                }
                if (platformids!=null&&platformids!="") {
                
                    var citys=JSON.parse(platformids);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectPlatmIds.push(parseInt(citys[i]));                        
                    }
                    localStorage.removeItem(config.localStorageKey_PlatformIds);                   
                }

                if (platformnames!=null&&platformnames!="") {
                
                    var citys=JSON.parse(platformnames);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selectPlatm.push(citys[i]);                        
                    }
                    localStorage.removeItem(config.localStorageKey_PlatformNames);                   
                }

                if (typeids!=null&&typeids!="") {
                
                    var citys=JSON.parse(typeids);
                    for (var i = 0; i < citys.length; i++) {
                        vm.selecttdDealTypeList.push(parseInt(citys[i]));                        
                    }
                    localStorage.removeItem(config.localStorageKey_TypeIds);
                   
                }

                var keyword = decodeURI(GetQueryString("keyword"));//关键字
                console.log(keyword);
                if(keyword != ""){
                    vm.keywordsList = keyword.split(' ');
                    vm.keywords_result = keyword;
                }
                
                

                //来自大局观

                var citysJson= localStorage.getItem(config.localStorageKey_City);
                var distsJson= localStorage.getItem(config.localStorageKey_Dist);
                var platmsJson= localStorage.getItem(config.localStorageKey_Platm);

                if (citysJson!=null&&citysJson!="") {
                
                    var citys=JSON.parse(citysJson);
                    for (var i = 0; i < citys.length; i++) {
                    
                        vm.selectCityIds.push(parseInt(citys[i].id));
                        vm.selectCity.push(citys[i].name);
                        
                    }

                    localStorage.removeItem(config.localStorageKey_City);
                   
                }

                if (distsJson!=null&&distsJson!="") {
                
                    var dists=JSON.parse(distsJson);
                    for (var i = 0; i < dists.length; i++) {
                    
                        vm.selectDistIds.push(parseInt(dists[i].id));
                        vm.selectDist.push(dists[i].name);
                    }
                    localStorage.removeItem(config.localStorageKey_Dist);
                }

                if (platmsJson!=null&&platmsJson!="") {
                
                    var platms=JSON.parse(platmsJson);
                    for (var i = 0; i < platms.length; i++) {
                    
                        vm.selectPlatmIds.push(parseInt(platms[i].id));
                        vm.selectPlatm.push(platms[i].name);
                    }
                    localStorage.removeItem(config.localStorageKey_Platm);
                }

                //生成region_result
                var allNames = [];
                allNames = allNames.concat(vm.selectCity);
                allNames = allNames.concat(vm.selectDist);
                allNames = allNames.concat(vm.selectPlatm);            
                vm.region_result = allNames.join(',');
                if(vm.region_result == ""){
                    vm.region_result = "全国"
                }

    
            } catch (e) {
                console.log("err",e);
                localStorage.removeItem(config.localStorageKey_City);
                localStorage.removeItem(config.localStorageKey_Dist);
                localStorage.removeItem(config.localStorageKey_Platm);

                localStorage.removeItem(config.localStorageKey_CityIds);
                localStorage.removeItem(config.localStorageKey_CityNames);
                localStorage.removeItem(config.localStorageKey_DistIds);
                localStorage.removeItem(config.localStorageKey_DistNames);
                localStorage.removeItem(config.localStorageKey_PlatformIds);
                localStorage.removeItem(config.localStorageKey_PlatformNames);
                localStorage.removeItem(config.localStorageKey_TypeIds);
            }

            this.getDataList();
            this.getDealTypeList();
            this.setDealTypeClick();
            this.getAreaDataList(1);//获取地区第一级
            
        }
},
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
}
})
vm.init();
