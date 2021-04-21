
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            typeId: "",//
            pageIndex: 1,//页码
            pageSize: 10//页数
        },
        info: {},//个人信息
        showMobile2Div: false,//是否显示编辑第二个手机号弹框
        loading: false,//是否正在请求
        isLoadAll: false,//是否已经加载全部
        showNoData:false,//是否无数据
        totalCount: "",//搜索总数量
        list: [],      //数据集合 
        upgrade_product_id:0 //升级所选产品id
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Order/List.ashx", "POST", _this.requestPar, function (resp) {
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
        saveMobile2: function () {//保存第二个手机号
            var _this = this;
            requestApi("/Api/User/UpdateMobile2.ashx", "POST", {mobile2:_this.info.mobile2}, function (resp) {

                if (resp.status==true) {
                    alert("保存成功");
                    _this.showMobile2Div = false;
                }
                else{
                    alert(resp.msg);
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
        setTypeId: function (typeId) {//设置 tab
            this.requestPar.pageIndex = 1;
            if (this.requestPar.typeId != typeId) {
                this.requestPar.typeId = typeId;
            } else {
                this.requestPar.typeId = "";
            }
            this.isLoadAll = false;
            this.showNoData = false;
            this.list = [];
            this.getDataList();
        },
        upgrade : function (product_id) { //升级
            var _this = this;
            _this.upgrade_product_id = 0;
            var content = '';
            //全国只能升公司
            if(product_id == 4){
                content = '<div class="main" style="padding:0;"><div class="pay-box"> <div class="pay-item" style="margin-left: 1rem;" data-product-id="5"><div class="icon"></div> <div class="label">公司套餐</div></div></div></div>';
            }
            //单省多省 可以升全国、公司
            else{
                content = '<div class="main" style="padding:0;"><div class="pay-box"><div class="pay-item" data-product-id="4"><div class="icon"></div> <div class="label">全国套餐</div></div> <div class="pay-item" style="margin-left: 1rem;" data-product-id="5"><div class="icon"></div> <div class="label">公司套餐</div></div></div></div>';
            }
            layer.open({
                title: [
                  '请选择升级套餐',
                  'background-color:#2C78E8; color:#fff;'
                ]
                ,anim: 'up'
                ,content: content
                ,btn: ['确认', '取消']
                ,yes: function(index){                
                    if(_this.upgrade_product_id == 0){                        
                        return false;
                    }
                    else{
                        layer.close(index);
                        window.location.href="../pay/buy.html?product_type=1&product="+_this.upgrade_product_id;
                    }

                }
              });
        },
        updateOrder: function (order,state) {//修改订单状态
            
            var msg = "";
            if (state==1) {
                msg = "取消";
            }
            if (state == -1) {
                msg = "删除";
            }
            var _this = this;
            //询问框
            layer.open({
                content: "确定 "+msg+"订单?"
                ,btn: ['删除', '取消']
                ,yes: function(index){                
                    layer.close(index);

                    requestApi("/Api/My/Order/Update.ashx", "POST", {orderId:order.id,state:state}, function (resp) {
                        if (resp.status) {
                            toast("操作成功");
                            for (var i = 0; i < _this.list.length; i++) {
                                if (_this.list[i].id==order.id) {
                                    _this.list[i].state = state;
                                    if (state==1) {
                                        _this.list[i].state_show = "已取消";
                                    }
                                    if (state == -1) {
                                        _this.list[i].state_show = "已删除";
                                        _this.list.splice(_this.list.indexOf(order), 1);
                                    }
                                   
                                }
                            }
                           
    
                        }
    
                    }
    
                    )

                }
            });
            // if (confirm("确定 "+msg+"订单?")) {
               
                
            // }

        },
        handleScroll: function () {//滚动加载

            var h = $('.list').height();//div可视区域的高度
            var sh = $('.list')[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $('.list')[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            //console.log(h + st -sh);
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
            this.requestPar.typeId = GetQueryString("typeId");
            this.getDataList();
            this.getUserInfo();
        }
    }
})
vm.init();
