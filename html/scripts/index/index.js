
var vm = new Vue({
    el: '#app',
    data: {
        list: [],
        historyKeywordList:[]    
    },
    methods: {
        gethotkeywordList: function () {
            var _this = this;
            requestApi("/Api/Index/HotKeywordsList.ashx", "POST", {}, function (resp) {
               
                _this.list = resp.data.list;
             
              
            }

            )
        },
        getHistoryKeyword: function () {//获取历史关键字
            var _this = this;
            var keywords = JSON.parse(localStorage.getItem(config.localStorageKey_SearchWords));
            if (keywords != null) {
                _this.historyKeywordList = keywords;
                _this.historyKeywordList = _this.historyKeywordList.reverse();
                if(_this.historyKeywordList.length > 3){
                    _this.historyKeywordList = _this.historyKeywordList.slice(0,3);
                }
                console.log(_this.historyKeywordList);
            }
        },
        init: function () {//初始化
            this.gethotkeywordList();
            this.getHistoryKeyword();
        }
    }
})
vm.init(); 
