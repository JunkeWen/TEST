<template>
  <div id="app">

    <!-- 返回上一层级 -->
    <div class="pro-top">
          <mu-button class="pro-top-back" icon large @click="goBack()">
            <mu-icon value="chevron_left" class="main-font" size="45"></mu-icon>
          </mu-button>
    </div>

    <!-- 遍历循环 工艺资源地址URL :cycle 禁止自动切换-->
    <mu-carousel :cycle='false'  style="position:absolute;width:100%;height:100%;">
      <!-- 自定义指示器 -->
      <mu-icon value="arrow_back" slot="left"></mu-icon>
      <mu-icon value="arrow_forward" slot="right"></mu-icon>
      <mu-carousel-item v-for="(item,index) in reportUrl" :key="index">
        <iframe  name = "child" id = "child" v-bind:src="item" frameborder="0" scrolling="no" style="position:absolute;width:100%;height:100%;">
        </iframe>
      </mu-carousel-item>
    </mu-carousel>

    <!-- <iframe  name = "child" id = "child" v-bind:src="urlPath2" frameborder="0" scrolling="no" style="position:absolute;width:100%;height:100%;"></iframe> -->
  </div>
</template>
<script >
import SafeHeader from "../../../components/safeHeaderMenu";
import Loading from "muse-ui-loading";

export default {
  name: "reportView",
  components: {
    SafeHeader,
  },
  data() {
    return {
      title:'报表展示',
      reportUrl:[],
      pageComponent: "",

      // active: 0,//轮播图下标
      resData:[],
      urlParams:{},
      urlPath2:'http://www.baidu.com'
    };
  },
  methods: {
    goBack() {
      this.$root.api.api.closeWin();
    }
  },
  mounted() {
     //初始化方法
    let pageParam = this.$root.api.api.pageParam || {}
    this.title = pageParam.title || this.title;
    //主页面传递过来的参数
    let thePreUrl=pageParam.pageData;
    let theUrlParam=pageParam.urlParams;

    this.resData=thePreUrl;
    this.urlParams=theUrlParam;
    // console.log("=====thePreUrl====="+ thePreUrl);
    // console.log("=====urlParams====="+ JSON.stringify(theUrlParam));

    let urlPaths=[];
    Object.keys(theUrlParam).forEach((key, i) => {
        let item=theUrlParam[key];
        // console.log("key===="+key+",Value===="+theUrlParam[key]+",i===="+i);

        let urlPath="";
        //对象的直接遍历
        Object.keys(item).forEach(key1 => (
          urlPath+=(key1+"="+item[key1])+"&"
        ));
       urlPaths.push(thePreUrl[i]+"?"+urlPath);
    });

    // console.log("=======urlPaths===="+urlPaths);

    this.reportUrl = urlPaths || {};
    this.pageComponent = pageParam.component || this.pageComponent;
  }
};
</script>
<style scoped lang="scss">
// #app {
//   background-color: #fff;
// }

.pro-top {
  position: relative;
  width: 8%;
  height: 8%;
  z-index:100;
  //返回按钮
  .pro-top-back {
    position: absolute;
    width: 100%;
    left: 0%;
    top: 1%;
    z-index:0;
  }
}

// 轮播图控制器图标颜色
/deep/.mu-carousel-button.mu-icon-button {
    color: #2196f3;//#2196f3
    width: 48px;
    height: 48px;
    z-index: 3;
    position: absolute;
    top: 50%;
    margin-top: -24px;
    font-size: 36px;
    padding: 0;
}
</style>
