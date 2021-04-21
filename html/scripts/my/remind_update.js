
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {
            days: "",//天数
            text: "",//文本
            color: "",
            id:GetQueryString ("id")
        },//请求信息
        showSelectColor: false,//选择颜色框
        colorList:[]//可选颜色框
        
    },
    methods: {
        colorSelect: function (color) {//选择颜色
            this.requestPar.color = color;
            this.showSelectColor = false;

        },
        saveRemind: function () {//保存提醒
            var _this = this;
            if (_this.requestPar.days == "") {
                alert("请输入天数");
                return;
            }
            if (_this.requestPar.text == "") {
                alert("请输入提示文本");
                return;
            }
            //询问框
            layer.open({
                content: '确定保存？'
                ,btn: ['保存', '取消']
                ,yes: function(index){                
                    requestApi("/Api/My/Remind/Update.ashx", "POST", _this.requestPar, function (resp) {

                        if (resp.status == true) {
                            window.location.href = 'remind_list.html';
                        }
    
                    })
                    layer.close(index);
                }
            });
        },
        getData: function () {//添加提醒
            var _this = this;
            requestApi("/Api/My/Remind/Get.ashx", "POST", { id: GetQueryString ("id")}, function (resp) {

                    if (resp.status == true) {
                        _this.requestPar.color = resp.data.color;
                        _this.requestPar.days = resp.data.days;
                        _this.requestPar.text = resp.data.text;

                    }

                })
            

        },
        getColorList: function () {
            var _this = this;
            requestApi("/Api/My/Remind/ColorList.ashx", "POST", { id: GetQueryString ("id")}, function (resp) {

                    if (resp.status == true) {
                        _this.colorList = resp.data.colorList;

                    }

                })
            

        },
        init: function () {//初始化
            this.getData();
            this.getColorList();
        }
    }
})
vm.init();

