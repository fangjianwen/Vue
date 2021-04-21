
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            typeId: "",
            region: "",
            hotRegion: "",
            level:"",
            objectId: ""
        },
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData: false,//是否无数据
        totalCount: "",//搜索总数量
        list: [],      //数据集合 
        showCountrySelectDiv: false,
        showTypeSelectDiv: false,
        showAreaSelectDiv: false,
        dealTypeList: [],
        selectTypeName: "行业",
        selectAreaName: "地区",
        regionList: [],
        regionHotList: [],
        areaSelectTab:0,
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/Statistics/Statistics.ashx", "POST", _this.requestPar, function (resp) {
                _this.loading = false;
                if (resp.status) {
                    var json = resp.data.list;
                    var projecthtml = '';
                    var listhtml = '';

                    for (var i = 0; i < json.length; i++) {

                        var name = "";
                        var region = "";
                        if (json[i].hot_region != "") {
                            name = json[i].hot_region;
                            region = 'hotRegion=' + json[i].hot_region;
                        }
                        else {
                            name = json[i].region;
                            region = 'region=' + json[i].region;
                        }

                        projecthtml += '<div  class="list-item list_item_region">'


                        projecthtml += ' <div class="increased ib">' + json[i].amount_today_show + '</div>'
                        projecthtml += ' <div class="total ib">' + json[i].amount_all_show + '</div>'
                        projecthtml += ' <div class="increased increased_today ib tc">' + json[i].count_today_show + '</div>'
                        projecthtml += ' <div class="total ib">' + json[i].count_all_show + '</div>'
                        projecthtml += ' <div class="imgitem followbtn ib" data-type-id="3" data-name=' + name + ' data-id=' + json[i].id + ' ><img src="../images/statistics/' + json[i].follow + '" /></div>'
                        projecthtml += ' <div class="imgitem ib subscription_link" data-type-id="3" data-region="' + region + '" onclick="regionSub(this)"><img src="../images/statistics/' + 'fast.png' + '" /></div>'
                        projecthtml += ' <div class="imgitem ib search_link" data-type-id="3" data-region="' + region + '" onclick="regionSearch(this)"><img src="../images/statistics/' + 'search.png' + '" /></div>'
                        projecthtml += ' </div>'

                        projecthtml += ' <div class="list-item-inner dn"></div>'


                        listhtml += '<div  class="list-item list_item_region">'
                        if (json[i].hot_region != "") {
                            listhtml += '<div class="province region ib" data-fk="0" data-region="' + region + '" data-type="hot_region">';
                            listhtml += '<span>' + name + '<i class="fa fa-angle-down"></i></span>';
                        }
                        else {
                            listhtml += '<div class="province region ib" data-region="' + region + '" data-fk="0" data-type="region">';
                            listhtml += '<span>' + name + '<i class="fa fa-angle-down"></i></span>'
                        }
                        listhtml += ' </div>';
                        listhtml += ' </div>';
                        listhtml += ' <div class="list-item-inner dn"></div>';
                    }



                    $(".list-right").html(projecthtml);
                    $(".list-left").html(listhtml);


                }

            }

            )
        },
        getDealTypeList: function () {//获取分类
            var _this = this;
            requestApi("/Api/Deal/DealTypeList.ashx", "POST", {}, function (resp) {

                if (resp.status) {
                    _this.dealTypeList = resp.data.list;
                   
                }

            }

            )


        },
        getRegionList: function () {//获取区域列表
            var _this = this;
            requestApi("/Api/Area/GetAreaLevel2.ashx", "POST", { areaLevel1Name: "省市县" }, function (resp) {

                if (resp.status) {
                    _this.regionList = resp.data;

                }

            }

            )


        },
        getHotRegionList: function () {//获取Hot热点
            var _this = this;
            requestApi("/Api/Area/GetAreaLevel2.ashx", "POST", { areaLevel1Name: "HOT热点" }, function (resp) {

                if (resp.status) {
                    _this.regionHotList = resp.data;

                }

            }

            )


        },
        setTypeId: function (item) {//设置分类id
           
            this.requestPar.typeId = item.id;
            this.showTypeSelectDiv = false;
            this.selectTypeName = item.name
            this.getDataList();
        },
        setAreaTab: function (index) {//设置分类id
           
            this.areaSelectTab =index;
          

          
        },
        setHotRegion: function (item) {//
           
            this.showAreaSelectDiv = false;
            this.selectAreaName = item.name;
            this.requestPar.region = "";
            this.requestPar.hotRegion = item.name;
            this.getDataList();
           
        },
        setRegion: function (name) {//设置地点

            this.showAreaSelectDiv = false;
            this.selectAreaName = name;
            this.requestPar.hotRegion = "";
            this.requestPar.region = name;
            this.getDataList();
           
        },
        init: function () {//初始化
           
            this.getDealTypeList();
            this.getRegionList();
            this.getHotRegionList();
            this.getDataList();
            this.setAreaTab(2);
        }
    }
})
vm.init();

function regionSearch(obj) {
    var region = $(obj).data("region");
    if (region.indexOf("hotRegion") > -1) {//热点搜索
        
        var value = region.split('=')[1];
        console.log("hot热点搜索", value);
        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel3.ashx", "POST", { areaLevel1Name: "HOT热点", areaLevel2Name: value }, function (resp) {

            if (resp.status) {

                for (var i = 0; i < resp.data.length; i++) {


                    //
                    requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: "HOT热点", areaLevel2Name: value, areaLevel3Name: resp.data[i].name }, function (resp) {

                        if (resp.status) {

                            for (var i = 0; i < resp.data.length; i++) {

                                citys.push(resp.data[i]);

                            }

                        }

                    }

)
                    //


                }


            }

        }

)
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../deal/list.html";

    } else {
        var value=region.split('=')[1];
        console.log("区域搜索", value);
        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel3.ashx", "POST", { areaLevel1Name: "省市县", areaLevel2Name: value }, function (resp) {

            if (resp.status) {
               
                for (var i = 0; i < resp.data.length; i++) {
                  

                    //
                    requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: "省市县", areaLevel2Name: value, areaLevel3Name: resp.data[i].name }, function (resp) {

                        if (resp.status) {
                            
                            for (var i = 0; i < resp.data.length; i++) {

                                citys.push(resp.data[i]);

                            }
                           
                        }

                    }

)
                    //


                }
              
                
            }

        }

)
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../deal/list.html";

    }
   

}//大区搜索


function regionChildSearch(obj) {
    var curr = $(obj).data("value");

    var areaLevel1Name = "";
    if ($(obj).data("region").indexOf("hotRegion")>-1) {
        areaLevel1Name = "HOT热点";
    }
    if ($(obj).data("region").indexOf("region") > -1) {
        areaLevel1Name = "省市县";
    }

    if (curr.indexOf("province") > -1) {//选中的是省

        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: areaLevel1Name, areaLevel2Name: $(obj).data("region").split('=')[1], areaLevel3Name: $(obj).data("name") }, function (resp) {

            if (resp.status) {

                for (var i = 0; i < resp.data.length; i++) {
                    citys.push(resp.data[i]);
                }
            }
                console.log("city", citys);
                localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
                window.location.href = "../deal/list.html";

            } )


    }

    if (curr.indexOf("city") > -1) {//选中的市

        var citys = [];
        var city = {
            id: $(obj).data("value").split('=')[1],
            name: $(obj).data("name")
        }
        citys.push(city);
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../deal/list.html";

    }

    if (curr.indexOf("district") > -1) {//选中的区

        var dists = [];
        var dist = {
            id: $(obj).data("value").split('=')[1],
            name: $(obj).data("name")
        }
        dists.push(dist);
        console.log("dists", dists);
        localStorage.setItem(config.localStorageKey_Dist, JSON.stringify(dists));
        window.location.href = "../deal/list.html";

    }


   


        }//省市区搜索


function regionSub(obj) {
    var region = $(obj).data("region");
    if (region.indexOf("hotRegion") > -1) {//热点搜索

        var value = region.split('=')[1];
        console.log("hot热点搜索", value);
        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel3.ashx", "POST", { areaLevel1Name: "HOT热点", areaLevel2Name: value }, function (resp) {

            if (resp.status) {

                for (var i = 0; i < resp.data.length; i++) {


                    //
                    requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: "HOT热点", areaLevel2Name: value, areaLevel3Name: resp.data[i].name }, function (resp) {

                        if (resp.status) {

                            for (var i = 0; i < resp.data.length; i++) {

                                citys.push(resp.data[i]);

                            }

                        }

                    }

)
                    //


                }


            }

        }

)
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../my/subscription.html";

    } else {
        var value = region.split('=')[1];
        console.log("区域搜索", value);
        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel3.ashx", "POST", { areaLevel1Name: "省市县", areaLevel2Name: value }, function (resp) {

            if (resp.status) {

                for (var i = 0; i < resp.data.length; i++) {


                    //
                    requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: "省市县", areaLevel2Name: value, areaLevel3Name: resp.data[i].name }, function (resp) {

                        if (resp.status) {

                            for (var i = 0; i < resp.data.length; i++) {

                                citys.push(resp.data[i]);

                            }

                        }

                    }

)
                    //


                }


            }

        }

)
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../my/subscription.html";

    }


}//大区订阅


function regionSubChild(obj) {
    var curr = $(obj).data("value");

    var areaLevel1Name = "";
    if ($(obj).data("region").indexOf("hotRegion") > -1) {
        areaLevel1Name = "HOT热点";
    }
    if ($(obj).data("region").indexOf("region") > -1) {
        areaLevel1Name = "省市县";
    }

    if (curr.indexOf("province") > -1) {//选中的是省

        var citys = [];
        requestApiSync("/Api/Area/GetAreaLevel4.ashx", "POST", { areaLevel1Name: areaLevel1Name, areaLevel2Name: $(obj).data("region").split('=')[1], areaLevel3Name: $(obj).data("name") }, function (resp) {

            if (resp.status) {

                for (var i = 0; i < resp.data.length; i++) {
                    citys.push(resp.data[i]);
                }
            }
            console.log("city", citys);
            localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
            window.location.href = "../my/subscription.html";

        })


    }

    if (curr.indexOf("city") > -1) {//选中的市

        var citys = [];
        var city = {
            id: $(obj).data("value").split('=')[1],
            name: $(obj).data("name")
        }
        citys.push(city);
        console.log("city", citys);
        localStorage.setItem(config.localStorageKey_City, JSON.stringify(citys));
        window.location.href = "../my/subscription.html";

    }

    if (curr.indexOf("district") > -1) {//选中的区

        var dists = [];
        var dist = {
            id: $(obj).data("value").split('=')[1],
            name: $(obj).data("name")
        }
        dists.push(dist);
        console.log("dists", dists);
        localStorage.setItem(config.localStorageKey_Dist, JSON.stringify(dists));
        window.location.href = "../my/subscription.html";

    }





}//省市区订阅
