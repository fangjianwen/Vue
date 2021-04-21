
var vm = new Vue({
    el: '#app',
    data: {
        requestPar: {//接口请求参数
            id: GetQueryString("id")
        },
        loading: false,//是否正在加载中
        summaryDivToggle: true,//是否展开项目概况
        qualificationDivToggle: true,//是否展开项目要求
        timeLineDivToggle: true,//是否展开里程碑
        contactDivToggle: true,//是否展开业主代理信息
        detailDivToggle: true,//是否展开详情信息
        showSourceInfo: false,//显示来源弹框
        //showAnnotateEdit: true,//是否显示标注编辑
        showAnnotate: false,//是否显示分享的标注

        dealInfo: {},//项目信息
        sourceInfo: {list:[]},//来源
        annotateInfo: { id: GetQueryString("id"), detail: "", imgs: "", is_show: false },//批注信息
        shareAnnotateInfo: {},//分享的批注信息
        bidDocInfo: {},//标书信息
        userInfo: {},//当前用户信息
        uploadImages: [],//上传的图片
        shareImages: [],//分享的图片
        timeLineList:[],//时间轴列表
    },
    methods: {
        getDealInfo: function () {
            var _this = this;
            _this.loading = true;
            requestApi("/Api/Deal/Detail.ashx", "POST", _this.requestPar, function (resp) {

                _this.dealInfo = resp.data;
                _this.loading = false;
                $("title").text(_this.dealInfo.titleshow);
            }

            )
        },
        getSourceInfo: function () {//来源
            var _this = this;
            requestApi("/Api/Deal/Source.ashx", "POST", _this.requestPar, function (resp) {

                _this.sourceInfo = resp.data;


            }

            )
        },
        getAnnotateInfo: function () {//获取批注
            var _this = this;
            requestApi("/Api/Deal/Annotate/Get.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {
                    _this.annotateInfo = resp.data;
                    if (resp.data.imgs!="") {
                        _this.uploadImages = resp.data.imgs.split(',');
                    }
                   
                }



            }

            )
        },
        getShareAnnotateInfo: function () {//获取分享的批注
            var _this = this;
            requestApi("/Api/Deal/Annotate/Get.ashx", "POST", { id: _this.requestPar.id, shareUserId: GetQueryString("shareUserId") }, function (resp) {
                if (resp.data != null && resp.data.is_show == true) {

                    _this.showAnnotate = true;
                    if (_this.userInfo.id == GetQueryString("shareUserId")) {
                        _this.showAnnotate = false;
                        return;
                    }
                    _this.shareAnnotateInfo = resp.data;
                    if (resp.data.imgs != "") {
                        _this.shareImages = resp.data.imgs.split(',');
                    }


                }



            }

            )
        },
        getBidDocInfo: function () {//获取标书信息
            var _this = this;
            requestApi("/Api/Deal/BidDoc/Get.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {
                    _this.bidDocInfo = resp.data;
                }



            }

            )
        },
        updateAnnotateInfo: function () {//保存批注内容
            var _this = this;
            _this.annotateInfo.imgs = _this.uploadImages.join(',');
            requestApi("/Api/Deal/Annotate/Update.ashx", "POST", _this.annotateInfo, function (resp) {

                if (resp.status) {
                    toast('保存成功!');
                }


            }

            )
        },
        updateAnnotateInfoShow: function () {//保存是否分享
            var _this = this;
            requestApi("/Api/Deal/Annotate/UpdateShow.ashx", "POST", { id: _this.requestPar.id, is_show: !_this.annotateInfo.is_show }, function (resp) {

                if (resp.status) {
                    toast('操作成功!');
                } else {
                    _this.annotateInfo.is_show = false;
                }


            }

            )
        },
        followDeal: function () {//关注项目
            var _this = this;
            requestApi("/Api/Deal/Follow.ashx", "POST", { id: _this.requestPar.id, isFollow: 1 }, function (resp) {
                if (resp.status) {
                    _this.dealInfo.is_follow = true;
                    _this.dealInfo.follow_count++;
                    toast('关注成功!');

                }
            }

            )
        },
        unFollowDeal: function () {//取消关注项目
            var _this = this;
            requestApi("/Api/Deal/Follow.ashx", "POST", { id: _this.requestPar.id, isFollow: 0 }, function (resp) {
                if (resp.status) {
                    _this.dealInfo.is_follow = false;
                    _this.dealInfo.follow_count--;
                    toast('已取消关注');
                }
            }

            )
        },
        reportError: function () {//提交错误报告
            var _this = this;
            requestApi("/Api/Deal/ErrorReport.ashx", "POST", { id: _this.requestPar.id, state: 1 }, function (resp) {
                if (resp.status) {
                    _this.dealInfo.error_report = true;
                    toast('已提交错误报告!');
                }
            }

            )
        },
        unReportError: function () {//取消提交错误报告
            var _this = this;
            requestApi("/Api/Deal/ErrorReport.ashx", "POST", { id: _this.requestPar.id, state: 0 }, function (resp) {
                if (resp.status) {
                    _this.dealInfo.error_report = false;
                    toast('已取消提交错误报告');
                }
            }

            )
        },
        getUserInfo: function () {//获取当前用户信息
            var _this = this;
            requestApiSync("/Api/User/Info.ashx", "POST", {}, function (resp) {
                _this.userInfo = resp.data.info;


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
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'checkJsApi', 'openLocation', 'getLocation', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
                    });
                    haveLoadWeixinConfig = true;

                }

            }

            )
        },
        uploadImg: function () {//上传微信图片
            var _this = this;
            wx.chooseImage({
                count: 9, // 默认9
                success: function (res) {
                    
                    for (var i = 0; i < res.localIds.length; i++) {
                      
                        wx.uploadImage({
                            localId: res.localIds[i],
                            isShowProgressTips: 1,
                            success: function (res) {
                             requestApiSync("/Api/Weixin/UploadImg.ashx", "POST", { serverId: res.serverId }, function (resp)
                             {
                                 if (resp.data != "")
                                 {
                                     _this.uploadImages.push(resp.data);
                                  }
                             } )
                            },
                            fail: function (res) {
                                toast("上传失败");
                               
                            }
                        });
                    }
                   



                }
            });

        },
        previewImg: function (item) {//预览微信图片
            var _this = this;
            wx.previewImage({
                current: item,
                urls: _this.shareImages
            })
        },
        previewImgEdit: function (item) {//预览微信图片
            var _this = this;
            wx.previewImage({
                current: item,
                urls: _this.uploadImages
            })
        },
        deleteImg: function (item) {//删除上传的图片
            this.uploadImages.splice(this.uploadImages.indexOf(item), 1);
        },
        getTimeLineList: function () {//获取时间轴
            var _this = this;
            requestApi("/Api/Deal/TimeLine.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.data != null) {

                    _this.timeLineList = resp.data.list;

                }

            }

            )
        },
        addHistory: function () {//添加访问记录
            var _this = this;
            requestApi("/Api/Deal/AddHistory.ashx", "POST", _this.requestPar, function (resp) {
                if (resp.status) {

                 

                }

            }

            )
        },
        init: function () {//初始化
            this.getDealInfo();
            this.getWeixinConfig();
            this.getSourceInfo();
            this.getAnnotateInfo();
            this.getBidDocInfo();
            this.getTimeLineList();
            this.addHistory();
            this.getUserInfo();
            var shareUserId = GetQueryString("shareUserId");
            if (shareUserId != "") {
                //this.showAnnotateEdit = false;
                this.getShareAnnotateInfo();
            }
        }
    }

})
vm.init();
