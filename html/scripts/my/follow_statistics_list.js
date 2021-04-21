
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            
        },
        loading: false,//是否正在请求
        showNoData: false,//是否无数据
        totalCount: "",//搜索总数量
        list: [],      //数据集合 
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Follow/Statistics/List.ashx", "POST", _this.requestPar, function (resp) {
                _this.loading = false;
                if (resp.status) {
                    var json = resp.data.list;
                    var projecthtml = '';
                    var listhtml = '';

                    for (var i = 0; i < json.length; i++) {

                        var name = "";
                        var region = "";
                        if (json[i].hot_region != "") {
                           // name = json[i].hot_region;
                            region = 'hotRegion=' + json[i].hot_region;
                        }
                        else {
                           // name = json[i].region;
                            region = 'region=' + json[i].region;
                        }
                        name = json[i].name;
                        projecthtml += '<div  class="list-item list_item_region">'


                        projecthtml += ' <div class="increased ib">' + json[i].amount_today_show + '</div>'
                        projecthtml += ' <div class="total ib">' + json[i].amount_all_show + '</div>'
                        projecthtml += ' <div class="increased increased_today ib tc">' + json[i].count_today_show + '</div>'
                        projecthtml += ' <div class="total ib">' + json[i].count_all_show + '</div>'
                        projecthtml += ' <div class="imgitem followbtn ib" data-type-id="3" data-name=' + name + ' data-id=' + json[i].id + ' ><img src="../images/statistics/' + json[i].follow + '" /></div>'
                        projecthtml += ' <div class="imgitem ib subscription_link" data-dist-id="' + json[i].district_id + '" data-dist-name="' + json[i].district_name + '"  data-city-id="' + json[i].city_id + '"  data-city-name="' + json[i].city_name + '"  data-province-id="' + json[i].province_id + '" data-province-name="' + json[i].province_name + '" data-region="' + json[i].region + '" data-hotregion="' + json[i].hot_region + '"  onclick="subscription(this)"><img src="../images/statistics/' + 'fast.png' + '" /></div>'
                        projecthtml += ' <div class="imgitem ib search_link" data-dist-id="' + json[i].district_id + '" data-dist-name="' + json[i].district_name + '"  data-city-id="' + json[i].city_id + '"  data-city-name="' + json[i].city_name + '"  data-province-id="' + json[i].province_id + '" data-province-name="' + json[i].province_name + '" data-region="' + json[i].region + '" data-hotregion="' + json[i].hot_region + '"  onclick="subSearch(this)"><img src="../images/statistics/' + 'search.png' + '" /></div>'
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

        init: function () {//初始化
           
            
            this.getDataList();
        }
    }
})
vm.init();
