
var config = {//配置

    apiBaseUrl: "http://dealapi.1234okle.com",//请求接口基本路径
    //apiBaseUrl: "http://localhost:9297",//请求接口基本路径
    appId: "wx08a0fccd00b145f1",//微信公众号AppId
    devOpenId: "oGePYvgb57J5fzVroDtCAEffXjPg",//开发openId  oGePYvgb57J5fzVroDtCAEffXjPg  
    localStorageKey_SearchWords: "search_keywords",//localStorage key 搜索关键字
    localStorageKey_AuthReturnUrl: "auth_return_url",//localStorage key //登录成功后跳转
    localStorageKey_OpenId: "openid",//localStorage key //微信OpenId
    localStorageKey_City: "citys",//localStorage key //城市列表 包含 id name
    localStorageKey_Dist: "dists",//localStorage key //区域列表 包含 id name
    localStorageKey_CityIds: "cityids",//localStorage key //城市id列表
    localStorageKey_CityNames: "citynames",//localStorage key //城市名称列表
    localStorageKey_DistIds: "distids",//localStorage key //区域id列表
    localStorageKey_DistNames: "distnames",//localStorage key //区域名称列表
    localStorageKey_PlatformIds: "platformids",//localStorage key //平台id列表
    localStorageKey_PlatformNames: "platformnames",//localStorage key //平台id列表
    localStorageKey_TypeIds: "typeids",//localStorage key //平台id列表
}

//公共ajax封装 异步
function requestApi(path, type, params, successfn) {
    $.ajax({
        url: config.apiBaseUrl + path,
        type: type,
        headers: {
            Accept: "application/json; charset=utf-8",
            OpenId: getOpenId()
        },
        data: params,
        beforeSend: function (resp) {
        },
        success: function (resp) {
            if (resp.code == 1001) {
                //登录授权
                login();
            } else {

                if (resp.status) {
                    successfn(resp)
                } else {
                    alert(resp.msg);
                    successfn(resp)
                }
               
            }
        },
        error: function (resp) {
            alert("没有网络连接,请稍后再试");
        },
        complete: function () {

        }
    });
}

//公共ajax封装 同步
function requestApiSync(path, type, params, successfn) {
    $.ajax({
        url: config.apiBaseUrl + path,
        async:false,
        type: type,
        headers: {
            Accept: "application/json; charset=utf-8",
            OpenId: getOpenId()
        },
        data: params,
        beforeSend: function (resp) {
        },
        success: function (resp) {
            if (resp.code == 1001) {
                //登录授权
                login();
            } else {
                if (resp.status) {
                    successfn(resp)
                } else {
                    alert(resp.msg);
                    successfn(resp)
                }

            }
        },
        error: function (resp) {
            alert("没有网络连接,请稍后再试");
        },
        complete: function () {

        }
    });
}

//获取openid
function getOpenId() {

    if (config.devOpenId!="") {
        return config.devOpenId;
    }
    var openId = localStorage.getItem(config.localStorageKey_OpenId);
    if (openId != null) {
        return openId;
    }
    return "";

}

//登录
function login() {
    var url = window.location.href;
    localStorage.setItem(config.localStorageKey_AuthReturnUrl, url);//登录成功后跳转地址
    var authUrl = window.location.protocol + "//" + window.location.host + "/html/index/auth.html";//授权成功后跳转地址
    console.log(authUrl);
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.appId + "&redirect_uri=" + encodeURI(authUrl) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";//微信授权地址
    window.location.href = url;

}

//获取查询参数
function GetQueryString(name) {

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == name) { return pair[1]; }
    }
    return "";
}

//数组去重
function unique(arr) {
    var arr1 = [];       // 新建一个数组来存放arr中的值
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr1.indexOf(arr[i]) == -1) {
            arr1.push(arr[i]);
        }
    }
    return arr1;
}

//日期格式化
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//底部 Tab
Vue.component('vue-footer', {
    props: ['selecttab'],
    template: '<div class="bottom_btns">'+

        '<a :class="{\'active\':selecttab==\'首页\'}" class="bottom_btns_item" href="../index/index.html">' +
        '<div class="bottom_btns_item_icon">' +
        '<img src="../images/my/index.png" v-if="selecttab!=\'首页\'"/>' +
        '<img src="../images/my/indexactive.png" v-if="selecttab==\'首页\'"/>' +
        '</div>' +
        '<div class="home_txt">首页</div> ' +
        '</a>' +

        '<a :class="{\'active\':selecttab==\'大局观\'}" class="bottom_btns_item" href="../statistics/statistics.html"> ' +
        '<div class="bottom_btns_item_icon">' +
        '<img src="../images/my/statistics.png" v-if="selecttab!=\'大局观\'" />' +
        '<img src="../images/my/statisticsactive.png" v-if="selecttab==\'大局观\'" />' +
        '</div>' +
        ' <div class="home_txt">大局观</div> ' +
        '</a>' +
        
        '<a :class="{\'active\':selecttab==\'找项目\'}" class="bottom_btns_item" href="../deal/list.html">' +
        '<div class="bottom_btns_item_icon">' +
        '<img src="../images/my/deallist.png" v-if="selecttab!=\'找项目\'"/>' +
        '<img src="../images/my/deallistactive.png" v-if="selecttab==\'找项目\'"/>' +
        '</div>' +
        '<div class="home_txt">找项目</div> ' +
        '</a> ' +
        
        '<a :class="{\'active\':selecttab==\'我的\'}" class="bottom_btns_item" href="../my/home.html">' +
        '<div class="bottom_btns_item_icon">' +
        '<img src="../images/my/home.png" v-if="selecttab!=\'我的\'"/> ' +
        '<img src="../images/my/homeactive.png" v-if="selecttab==\'我的\'"/> ' +
        '</div>' +
        '<div class="home_txt">我的</div>' +
        '</a>' +

        '</div>'
})

//重写默认的alert方法
window.alert = function (msg) {
   layer.open({
       content: msg
       ,btn: '我知道了'
     });
}

function toast(msg){
    //提示
  layer.open({
    content: msg
    ,skin: 'msg'
    ,time: 2 //2秒后自动关闭
  });
}

// //询问框
// layer.open({
//     content: '您确定要刷新一下本页面吗？'
//     ,btn: ['刷新', '取消']
//     ,yes: function(index){
//       location.reload();
//       layer.close(index);
//     }
//   });

