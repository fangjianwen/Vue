
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            product_type: GetQueryString("product_type"),
            xufeiId: GetQueryString("xufeiId"),
            id: GetQueryString("product")
        },
        info: {},//个人信息
        loading: false,//是否正在请求

        help_modal_pay_offline:false,//显示其他支付提醒
        help_modal_pay_online: false,//显示在线支付提醒
        help_modal_buyed: false,//显示重复购买提醒
        help_modal_limited:false,//显示限制购买提醒
        help_modal_lower: false,//显示降级购买提醒
        agreement_show:false,//显示购买协议container
        base_show:true,//显示主体container
        region_select_show:false,//显示区域选择container
        biaoshu_price_show:false,//显示标书详细价格
        input_name_show:true,//推荐人输入框显示
        input_email_show:true,//邮箱输入框显示
        input_mobile_show:true,//推荐人手机号显示

        selectAreaTabIndex:0,//地区左侧Tab选中索引 HOT热点 国家级 省市县 全球订阅

        selectProvIds: [],//选中的城市Id 多个用,分隔
        selectPlatmIds: [],//选中的平台Id 多个用,分隔
        
        selectProvNames: [],//选中的城市 多个用,分隔
        selectPlatmNames: [],//选中的平台 多个用,分隔

        selectAllNames: [],//选中的所有名称

        areaLevel1Name:"", //地区 第一级选中名称
        areaLevel2Name:"",//地区 第二级选中名称
        areaLevel5Name:"",//地区 第五级选中名称

        areaListLevel2Hot:[],//HOT热点列表 第二级
        areaListLevel3Hot:[],//HOT热点列表 第五级
        areaSelectIndexLeve12Hot:0,// HOT热点第二级选中
        areaSelectIndexLevel3Hot:0,// HOT热点第五级选中

        areaListLevel2Nationa:[],//国家级列表 第二级
        areaListLevel3Nationa:[],//国家级列表 第五级
        areaSelectIndexLeve12Nationa:-2,// 国家级第二级选中
        areaSelectIndexLevel3Nationa: -2,// 国家级第五级选中

        areaListLevel2:[],//省市县列表 第二级
        areaListLevel3:[],//省市县列表 第五级
        areaSelectIndexLeve12:0,// 省市县第二级选中
        areaSelectIndexLevel3:0,// 省市县第五级选中
        

        agreement_select:false,//勾选购买协议
        pay_type:0,//支付方式1-线下 2-线上
        region_show:'选择购买地区',//购买地区显示
        
        productInfo: {},//商品信息
        region_ids: [],     //选择的省份数据集合 
        province_count_select:0,//总共选了几个省

        localId: "",//本地图片id
        serverId: "",//微信服务器图片id
        imgUrl: "../images/order/upimg.png" //图片地址
        
    },
    methods: {
        getProductInfo: function () {//请求接口数据
            var _this = this;
            _this.loading = true;

            $('.txt_agent').addClass('active');

            if(_this.requestPar.product_type == 1){
                _this.input_email_show = false;
            }
            if(_this.requestPar.product_type == 3){
                _this.input_name_show = false;
                _this.input_mobile_show = false;
            }

            requestApi("/Api/Pay/Product/Info.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
                    _this.productInfo = resp.data.info;
                    console.log(_this.productInfo)
                    //_this.loading = false; 

                    //限制购买
                    if(_this.productInfo.type_id == 1){
                        //特价购买一次
                        if(_this.productInfo.limited){
                            _this.help_modal_limited = true;
                        }
                        //不可降级购买
                        if(_this.productInfo.lower_buy){
                            _this.help_modal_lower = true;
                        }
                        //全国
                        if(_this.productInfo.province_count == 0){
                            _this.region_show = "全国";
                        }
                        //推荐人
                        $('.txt_agent').val(_this.productInfo.agent);
                        $('.txt_mobile').val(_this.productInfo.mobile);
                    }

                    //标书是否重复购买
                    if(_this.productInfo.type_id == 3){
                        if(_this.productInfo.buyed){
                            _this.help_modal_buyed = true;
                        }
                        //邮箱
                        $('.email').val(_this.productInfo.email);
                    }
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
        showRegionSelect: function () {//显示区域选择
            var _this = this;
            if(_this.region_show != "全国"){
                _this.region_select_show=true;
                _this.base_show=false;
            }
        }, 
        showAgreemen: function () {//显示交易协议
            var _this = this;
            _this.agreement_show=true;
            _this.base_show=false;
        }, 
        closeAgreement: function () {//隐藏交易协议
            var _this = this;
            _this.agreement_show=false;
            _this.base_show=true;
        }, 
        payClick: function () {//检查输入
            var _this = this;            

            var email = $('.email').val();
            var name = $('.txt_agent').val();
            var mobile = $('.txt_mobile').val();

            if(_this.requestPar.product_type == 3){
                if(email == ""){
                    alert("请输入邮箱地址");
                    $('.email').focus();
                    return false;
                }
                var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if(!myreg.test(email)){
                    alert("请输入正确邮箱地址");
                    return false;
                }
            }

            if(_this.requestPar.product_type == 1){
                if(_this.productInfo.province_count != 0){
                    var zhishao = "";
                    var count = _this.selectPlatmIds.length + _this.selectProvIds.length;
                    if(_this.productInfo.province_count == 2){                        
                        if(count < _this.productInfo.province_count){
                            alert('请选择 至少' + _this.productInfo.province_count + ' 个省份');
                            return false;
                        }
                    }
                    else{
                        if(count != _this.productInfo.province_count){
                            alert('请选择 ' + _this.productInfo.province_count + ' 个省份');
                            return false;
                        }
                    }
                }
                if(mobile != ""){
                    var pattern = /^1[3456789]\d{9}$/;
                    if(!pattern.test(mobile)){
                        alert("请输入正确的手机号码");
                        return false;
                    }
                }
            }

            if(_this.pay_type == 0){
                alert("请选择支付方式");
                return false;
            }
            if(_this.pay_type == 1 && _this.serverId == ""){
                alert('请先上传付款凭证');
                return false;
            }
            if(!_this.agreement_select){
                alert("请阅读并勾选《投标宝交易协议》");
                return false;
            }
            
            if(_this.requestPar.product_type == 1){
                if(mobile == ""){
                    layer.open({
                        content: '您还没有填写推荐人，无法享受推荐优惠哦！'
                        ,btn: ['继续支付', '取消']
                        ,yes: function(index){                    
                            layer.close(index);
                            _this.payRequest(name,mobile,email);
                        }
                    });
                }
                else{
                    _this.payRequest(name,mobile,email);
                }
            }
            else{
                _this.payRequest(name,mobile,email);
            }

        }, 
        payRequest: function (name,mobile,email) {//提交订单
            var _this = this;     

            requestApi("/Api/Pay/Add.ashx", "POST", {
                id:_this.requestPar.id,
                product_type:_this.requestPar.product_type,
                name:name,
                mobile:mobile,
                email:email,
                pay_type:_this.pay_type,
                xufeiid:GetQueryString("xufeiid"),
                img:_this.imgUrl,
                prov_ids:_this.selectProvIds.join(','),
                platm_ids:_this.selectPlatmIds.join(','),
                province_count_select:_this.selectProvIds.length + _this.selectPlatmIds.length,
                region:_this.region_show

            }, function (resp) {
                if (resp.data != null) {
                    //根据金额以及支付方式做跳转
                    if(resp.data.amount == 0){
                        window.location.href = "../my/myorder.html";
                    }
                    else{
                        if(resp.data.pay_type == 2){
                            window.location.href = "pay.html?orderNo="+resp.data.order_no;
                        }
                        else{
                            window.location.href = "../my/myorder.html";
                        }
                    }
                }

            }

            )
        },
        copyHandler: function () {//复制
            var clipboard = new ClipboardJS('.btn');
            clipboard.on('success', function(e) {
                console.log(e);
            });
            clipboard.on('error', function(e) {
                console.log(e);
            });
        }, 
        getWeixinConfig: function () {//获取微信配置
            var _this = this;
            requestApi("/Api/Weixin/Config/Get.ashx", "POST", {url:window.location.href}, function (resp) {
                if (resp.data != null) {                    
                    wx.config({
                        debug: false,
                        appId: resp.data.appId,
                        timestamp: resp.data.timestamp,
                        nonceStr: resp.data.nonceStr,
                        signature: resp.data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'checkJsApi', 'openLocation', 'getLocation', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
                    });
                    // haveLoadWeixinConfig = true;                    

                }

            }

            )
        },
        uploadImg: function () {//上传微信图片
            var _this = this;
            
            wx.chooseImage({
                count: 1, // 默认9
                success: function (res) {
                    _this.localId = res.localIds[0];
                    //alert(_this.localId);
                    wx.uploadImage({
                        localId: _this.localId,
                        isShowProgressTips: 1,
                        success: function (res) {
                            _this.serverId = res.serverId;
                            var formData = new FormData();                            
                            formData.append("serverId", _this.serverId);
                            $.ajax({
                                url: config.apiBaseUrl + "/Api/Weixin/UploadImg.ashx",
                                type: "POST",
                                headers: {
                                    Accept: "application/json; charset=utf-8",
                                    OpenId: getOpenId()
                                },
                                data: formData,
                                async: false,
                                contentType: false,
                                processData: false,
                                success: function (data) {
                                    if (data.status) {
                                        var re = data.data;
                                        if (re != "") {                                            
                                            _this.imgUrl = re;
                                        }
                                        

                                    }

                                },
                                error: function (data) {

                                }
                            });
                        },
                        fail: function (res) {
                            alert(JSON.stringify(res));
                            alert("error");
                        }
                    });



                }
            });

        },        
        setAreaSearch: function () {//
            var _this = this;

            _this.selectAllNames = _this.selectPlatmNames.concat(_this.selectProvNames);
            _this.region_show = _this.selectAllNames.join('、');
            if(_this.region_show == ""){
                _this.region_show = "选择购买地区"
            }

            var count = _this.selectPlatmIds.length + _this.selectProvIds.length;

            if(_this.requestPar.product_type == 1){
                if(_this.productInfo.province_count != 0){
                    var zhishao = "";
                    if(_this.productInfo.province_count == 2){                        
                        if(count < _this.productInfo.province_count){
                            alert('请选择 至少' + _this.productInfo.province_count + ' 个省份');
                            return false;
                        }
                    }
                    else{
                        if(count != _this.productInfo.province_count){
                            alert('请选择 ' + _this.productInfo.province_count + ' 个省份');
                            return false;
                        }
                    }
                        
                }

                //多省购买，重新计算价格
                if(_this.productInfo.province_count == 2){
                    _this.productInfo.amount_total = _this.productInfo.amount_total * count / 2;
                }
            }

            _this.region_select_show=false;
            _this.base_show=true;


        }, 
        clearAreaSearch: function () {//重置区域设置
            var _this = this;

            _this.selectProvIds = [];
            _this.selectPlatmIds = [];

            $('[data-providhot-id]').removeClass("active");
            //$('[data-cityidhot-id]').removeClass("city-select");
            $('[data-platmid-id]').removeClass("active");
            $('[data-provid-id]').removeClass("active");
            //$('[data-cityid-id]').removeClass("city-select");

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
                sourcePage:"buy",

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
                                default:
        
                            }
                            break;
                        default:
        
                    }

                }

            }

            )


        },
        restoreSelectProv: function () {//还原选中的区域id
           
            switch (this.areaLevel1Name) {
                case "HOT热点":
                    for (var i = 0; i < this.selectProvIds.length; i++) {
                        $('[data-providhot-id="' + this.selectProvIds[i] + '"]').addClass("active");
                    }

                    break;
                case "国家级":
                    for (var i = 0; i < this.selectPlatmIds.length; i++) {
                        $('[data-platmid-id="' + this.selectPlatmIds[i] + '"]').addClass("active");
                    }

                    break;
                case "省市县":
                    for (var i = 0; i < this.selectProvIds.length; i++) {
                        $('[data-provid-id="' + this.selectProvIds [i]+ '"]').addClass("active");
                    }

                    break;
                default:

            }
        },
        setAreaTab: function (index) {//地区第一级
            //设置区域tab
            this.selectAreaTabIndex = index;
            switch (this.selectAreaTabIndex) {
                case 1://HOT热点
                    this.areaListLevel3Nationa = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12Nationa = -2;// 国家级第二级选中
                    this.areaSelectIndexLevel3Nationa = 0;// 国家级第五级选中

                    this.areaListLevel3 = [];//省市县 第五级
                    this.areaSelectIndexLeve12 = 0;// 省市县第二级选中
                    this.areaSelectIndexLevel3 = 0;// 省市县第五级选中

                    this.areaLevel1Name="HOT热点";
                    this.areaLevel2Name=this.areaListLevel2Hot[0].name;
                    this.areaSelectIndexLeve12Hot=this.areaListLevel2Hot[0].id;
                    this.getAreaDataList(3);
                    break;
                case 2://国家级
                    this.areaListLevel3Hot = [];//HOT热点列表 第五级
                    this.areaSelectIndexLeve12Hot = 0;// HOT热点第二级选中
                    this.areaSelectIndexLevel3Hot = 0;// HOT热点第五级选中

                    this.areaListLevel3 = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12 = 0;// 省市县第二级选中
                    this.areaSelectIndexLevel3 = 0;// 省市县第五级选中

                    this.areaLevel1Name="国家级";
                    this.areaLevel2Name=this.areaListLevel2Nationa[0].name;
                    this.areaSelectIndexLeve12Nationa=this.areaListLevel2Nationa[0].id;
                    this.getAreaDataList(3);
                    break;
                case 3://省市县
                    this.areaListLevel3Hot = [];//HOT热点列表 第五级
                    this.areaSelectIndexLeve12Hot = 0;// HOT热点第二级选中
                    this.areaSelectIndexLevel3Hot = 0;// HOT热点第五级选中

                    this.areaListLevel3Nationa = [];//国家级列表 第五级
                    this.areaSelectIndexLeve12Nationa = -2;// 国家级第二级选中
                    this.areaSelectIndexLevel3Nationa = 0;// 国家级第五级选中

                    this.areaLevel1Name="省市县";
                    this.areaLevel2Name=this.areaListLevel2[0].name;
                    this.areaSelectIndexLeve12=this.areaListLevel2[0].id;
                    this.getAreaDataList(3);


                    break;
                default:

            }
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
                            this.getAreaDataList(level+1);
                            break;
                        case 5:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13Hot=item.id;
                            
                            break;
                        default:
        
                    }                    
                    break;
                case "国家级":
                    switch (level) {
                        case 1:
                            break;
                        case 2:
                            this.areaLevel2Name=item.name;
                            this.areaSelectIndexLeve12Nationa=item.id;
                            this.areaListLevel3Nationa=[];
                            this.getAreaDataList(level+1);
                            break;
                        case 5:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13Nationa=item.id;
                           
                           
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
                            this.getAreaDataList(level+1);
                            break;
                        case 5:
                            this.areaLevel3Name=item.name;
                            this.areaSelectIndexLeve13=item.id;
                            
                            break;
                        default:
        
                    }
                    break;
                default:
        
            }

        
        },
        init: function () {//初始化                      
            this.getUserInfo();
            this.getProductInfo();
            this.copyHandler();
            this.getWeixinConfig();
            this.getAreaDataListLevel2("HOT热点");
            this.getAreaDataListLevel2("国家级");
            this.getAreaDataListLevel2("省市县");
            vm.setAreaTab(1);
        }
    }
})
vm.init();
