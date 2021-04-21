
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            head_type: '',
            id: GetQueryString("id")
        },
        info: {},//个人信息
        loading: false,//是否正在请求

        invoice_id_select:0,//选中的抬头id
        head_type_select: '',//选择的抬头类别
        head_select: '请选择',//选择的抬头
        default_select:true,//默认抬头
        editing: false,//正在编辑
        choosing: false,//正在选择

        invoice_id_edit:0,//编辑的抬头id
        head_type_edit:'企业',//编辑的抬头类别
        edit_default:false,//编辑 设为默认

        orderInfo: {},//订单信息
        list: []      //数据集合 
    },
    methods: {
        getDataList: function () {//请求接口数据
            var _this = this;
            _this.loading = true;
            requestApi("/Api/My/Invoice/List.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null)
                {
                    _this.list = resp.data.list;
                    _this.loading = false; 
                    if(_this.list.length > 0){
                        _this.invoice_id_select = _this.list[0].id;
                        _this.head_type_select = _this.list[0].head_type;
                        _this.head_select = _this.list[0].invoice_head;

                    }
                }
            }
            )
        },
        getOrderInfo: function () {//获取当前用户信息
            var _this = this;
            requestApi("/Api/My/Order/Get.ashx", "POST", _this.requestPar, function (resp) {

                _this.orderInfo = resp.data;
                console.log(_this.orderInfo.invoice_stage)
                if(_this.orderInfo.invoice_stage != 0){
                    alert("本订单已提交过开票信息！");
                    window.location = 'myorder.html';
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
                        jsApiList: ['chooseInvoiceTitle','checkJsApi'],
                        beta:true
                    });
                    haveLoadWeixinConfig = true;

                }

            }

            )
        },
        chooseWxTitle: function (head_type) {//显示抬头列表
            var _this = this;
           
            wx.invoke('chooseInvoiceTitle', {
                // 这里要传入参数
                //"scene":"1"
              }, function (res) {              

                var info = JSON.parse(JSON.stringify(res)).choose_invoice_title_info;
                info = JSON.parse(JSON.parse(JSON.stringify(info)));
                
                //alert(info);
                //alert(info.type);
                // alert(info.taxNumber);
                // alert(info.companyAddress);
                // alert(info.telephone);
                // alert(info.bankName);
                // alert(info.bankAccount);

                requestApi("/Api/My/Invoice/WxChoose.ashx", "POST", {
                    invoice_head:info.title,
                    tax_no:info.taxNumber,
                    bank_name:info.bankName,
                    bank_no:info.bankAccount,
                    address:info.companyAddress,
                    type:info.type,
                    tel:info.telephone}, function (resp) {
                    
                     
                    if (resp.status) {
                       _this.chooseInvoice(resp.data);                                        

                    }
                }
                )

              })

        }, 
        choose: function (head_type) {//显示抬头列表
            var _this = this;
            _this.choosing = true;
            _this.head_type_select = head_type;
            _this.requestPar.head_type = head_type;
            _this.getDataList();
        }, 
        chooseInvoice: function (invoice) {//选中抬头
            var _this = this;
            _this.invoice_id_select = invoice.id;
            _this.head_select = invoice.invoice_head;
            _this.head_type_select = invoice.head_type;
            _this.choosing = false;

        },  
        changeDefaultSelect: function () {//设为默认抬头
            var _this = this;
            _this.default_select = !_this.default_select;
        },  
        editInvoice: function (invoice) {//编辑抬头
            var _this = this;
            _this.editing = true;
            _this.choosing = false;
            if(invoice == null){
                _this.invoice_id_edit = 0;
                _this.edit_default = true;
            }
            else{
                $('.invoice_head').val(invoice.invoice_head);
                $('.tax_no').val(invoice.tax_no);
                $('.bank_name').val(invoice.bank_name);
                $('.bank_no').val(invoice.bank_no);
                $('.address').val(invoice.address);
                $('.tel').val(invoice.tel);
                _this.invoice_id_edit = invoice.id;
                _this.edit_default = invoice.is_default;
                _this.head_type_edit = invoice.head_type;

            }

        },
        editSave: function () {//保存编辑
            if ($('.invoice_head').val() == "") {
                alert("请输入抬头");
                return false;
            }
            if ($('.tax_no').val() == "" && model._this.head_type_edit == "企业") {
                alert("请输入税号");
                return false;
            }
            var _this = this;
            //询问框
            layer.open({
                content: '确定保存？'
                ,btn: ['保存', '取消']
                ,yes: function(index){
                    requestApi("/Api/My/Invoice/Edit.ashx", "POST", {
                        id:_this.invoice_id_edit,
                        head_type:_this.head_type_edit,
                        invoice_head:$('.invoice_head').val(),
                        tax_no:$('.tax_no').val(),
                        bank_name:$('.bank_name').val(),
                        bank_no:$('.bank_no').val(),
                        address:$('.address').val(),
                        tel:$('.tel').val(),
                        is_default:_this.edit_default}, function (resp) {
                        
                         
                        if (resp.status) {
                            _this.editing = false;
                            _this.choosing = true;
                            _this.getDataList();                       
    
                        }
    
                    }
    
                    )
                    
                layer.close(index);
                }
            });

        },    
        invoiceApply: function () {//提交开票
            var _this = this;
            if (_this.invoice_id_select == 0) {
                alert("请选择抬头");
                return false;
            }
            
        //询问框
        layer.open({
            content: '确定提交开票'
            ,btn: ['提交', '取消']
            ,yes: function(index){
              
                requestApi("/Api/My/Invoice/Apply.ashx", "POST", {
                    order_id:_this.requestPar.id,
                    invoice_id:_this.invoice_id_select,
                    is_default:_this.default_select}, function (resp) {
                    
                     
                    if (resp.status) {
                        alert("申请成功");
                        window.location.href = 'myorder.html';
                    }

                }

                )
              layer.close(index);
            }
          });            

        },      
        init: function () {//初始化   
            this.getWeixinConfig();                   
            this.getUserInfo();
            this.getOrderInfo();            
            this.getDataList();
        }
    }
})
vm.init();
