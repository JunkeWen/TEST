<template>
  <div :class="{fixedTop:fixedTop}" ref="headerTop">
  <!-- 头部导航定义 :z-depth="1" -->
     <mu-appbar :style="headerStyle" :title="title" :color="color" :textColor="textColor">
      <div class="pro-top">
      <!-- 返回按钮 -->
        <div class="pro-top-back">
          <mu-button class="pro-top-back" icon  v-if="isBack" @click="goBack()">
            <mu-icon value="chevron_left" class="main-font" size="36"></mu-icon>
          </mu-button>
        </div>
        <!-- 用户 -->
        <div class="pro-top-name">
          <slot name="myUser"></slot>
        </div>
        <!-- 工作中心 工位 -->
        <div class="pro-top-workInfo">
          <slot name="workInfo"></slot>
        </div>
        <!-- 标题 -->
        <div class="top-title">
          <slot name="title"></slot>
        </div>
        <!-- 时间 -->
        <div class="top-time">
          <slot name="time"></slot>
        </div>
        <!-- 菜单menu -->
        <div class="top-jiahao">
          <slot name="jiahao"></slot>
        </div>

        <slot name="menu"></slot>
      </div>
    </mu-appbar>
  </div>
</template>

<script>
import storage from "../utils/storage.js";
import http from "../utils/http.js";
export default {
  name: "SafeHeaderMenu",
  props: {
    title: {
      type: String,
      default: () => {
        return "标题";
      }
    },
    color: {
      // color和textColor 的设置，参照 https://muse-ui.org/#/zh-CN/color
      type: String,
      default: () => {
        return "";
      }
    },
    textColor: {
      type: String,
      default: () => {
        return "";
      }
    },
    fixedTop: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isBack: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    backIconColor: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data: () => {
    return {
      paddingTop: 10,
      //-------主页面数据--------
      myUser: "", //标题头用户信息
      workClassArr: [], //班次数组
      workCenterArr: [],
      workCellArr: [],
      workClass: { workClassId: "", workClassCode: "" }, //班次
      workCenter: { workCenterId: "", workCenterCode: "" }, //工作中心
      workCell: { workCellId: "", workCellCode: "" }, //绑定的工位ID/CODE
      timeBox: "0000-00-00"
    };
  },
  computed: {
    headerStyle() {
      return {
        paddingTop: this.paddingTop + "%",
        height: (100-this.paddingTop) + "%"
      };
    }
  },
  methods: {
    goBack() {
      this.$root.api.api.closeWin();
    },
    // 发送请求:获取工作中心
    getWorkCenter() {
      // 请求参数:获取工位
      let form = new FormData();
      form.append("workCellId", this.workCell.workCellId);
      form.append("workCellCode", this.workCell.workCellCode);

      http
        .post({ url: "productPadCommController!getWorkCenter.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            // console.log(res.data.data+"工作中心 ===="+resData);

            this.workCenterArr = resData;
            this.workCenter.workCenterId = resData[0].id;
            this.workCenter.workCenterCode = resData[0].code;
          } else {
            Toast.error({
              message: res.data.msg,
              close: false,
              position: "bottom"
            });
            return;
          }
        });
    },
    //发送请求:获取班次
    getClasses() {
      http
        .post({ url: "productPadCommController!getUdiClasses.m" })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            // console.log(res.data.data+"班次 ===="+resData);
            this.workClassArr = resData;

            this.workClass.workClassId = resData[0].id;
            this.workClass.workClassCode = resData[0].name;
          } else {
            Toast.error({
              message: res.data.msg,
              close: false,
              position: "bottom"
            });
            return;
          }
        });
    },
    // 发送请求:获取登录用户
    getCUser() {
      // 请求参数:获取登录人
      let form = new FormData();
      let user = storage.getObject("user");
      form.append("un", user.username); //登录人员

      http
        .post({ url: "productPadCommController!getCUser.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            // console.log("登录用户 ===="+resData.user);
            this.myUser = resData.user;
          } else {
            Toast.error({
              message: res.data.msg,
              close: false,
              position: "bottom"
            });
            return;
          }
        });
    },
    //获取时间
    formatDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var mins = date.getMinutes();
      var sec = date.getSeconds();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      if (hours < 10) hours = "0" + hours;
      if (mins < 10) mins = "0" + mins;
      if (sec < 10) sec = "0" + sec;
      return (this.timeBox =
        year + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + sec);
    },
    currentTime() {
      setInterval(this.formatDate, 1000);
    },
    //获取登录人员和绑定工位
    initCellAndPerson() {
      let form = new FormData();

      let workCellInfo = storage.getObject("workCells") || [];
      workCellInfo = workCellInfo[0] || {};
      form.append("workCellId", workCellInfo.id || ""); //绑定的工位
      form.append("workCellCode", workCellInfo.code || ""); //绑定的工位

      this.workCell.workCellId = workCellInfo.id || "";
      this.workCell.workCellCode = workCellInfo.code || "";

      let user = storage.getObject("user");
      form.append("un", user.username); //登录人员
      this.myUser = user.username;
      this.person = user.username;
      return form;
    }
  },
  mounted: function() {
    this.paddingTop = window.api ? window.api.safeArea.top : 0;
    // this.$refs.headerTop.nextSibling.style.paddingTop = (this.fixedTop? (this.paddingTop + this.$refs.headerTop.offsetHeight):0) + 'px';
    //获取登录人员和绑定工位
    this.initCellAndPerson();
    //时间定时器
    this.currentTime();
    //获取产线下拉框
    this.getWorkCenter();
    //获取班次下拉框
    this.getClasses();
    //获取当前登陆人信息
    this.getCUser();
  }
};
</script>

<style scoped lang="scss">
//顶部样式
.fixedTop {
  position: relative;
  width: 100%;
  height: 6.5vh;
  background: #fff;
  z-index: 100;
  .mu-appbar {
  width: 100%;
  height: 100%;
  .mu-appbar-title {
      text-align: center;
    }
  }
}

.fixedTop + * {
  padding-top: 80px;
}

//插槽DIV布局 行内块显示
.pro-top div{
    display: inline-block;
    height: 100%;
}

//顶部样式
.pro-top {
  position: relative;
  width: 100%;
  height: 10%;;
  min-height: 3rem;
  line-height: 3rem;
  text-align: center;
  font-size: 1.2rem;
  //返回按钮
  .pro-top-back {
    position: absolute;
    width: 5%;
    left: 0%;
  }
  //登录用户编码
  .pro-top-name {
    position: absolute;
    width: 12%;
    top: 0;
    left: 5%;
    font-size: 1.2rem;
    text-align: left;
  }
  //登录班次|产线|工位
  .pro-top-workInfo {
    position: absolute;
    width: 40%;
    top: 0;
    left: 17%;
    font-size: 1.2rem;
    .top-divide {
      width: 30%;
      height: 100%;
      margin-left: 3%;
    }
  }
  //标题头
  .top-title {
    position: absolute;
    width: 16%;
    height: 100%;
    left: 57%;
    font-size: 1.2rem;
    font-weight: 400;
  }
  //时间
  .top-time {
    position: absolute;
    width: 20%;
    height: 100%;
    right: 6%;
    font-size: 1.2rem;
    font-weight: 400;
  }
  .top-jiahao {
    position: absolute;
    width: 6%;
    right: 0%;
    height: 100%;
    font-size: 1.2rem;
    top:.35rem;

  }

  .pro-top-more {
    position: absolute;
    top: 40%;
    right: 3.5%;
    width: 16px;
    height: 16px;
    // background: url("../../assets/img/jiahao.png") center no-repeat;
  }
  // .pro-top-menu {
  //   position: absolute;
  //   top: 65px;
  //   right: 1%;
  //   width: 12%;
  //   z-index: 999;
  //   background: #f5f5f5;
  //   .top-box {
  //     width: 100%;
  //     float: left;
  //     margin-left: 4%;
  //     margin-top: 4%;
  //     color: white;
  //     font-size: 11px;
  //     height: 30px;
  //     line-height: 30px;
  //     border-radius: 8px;
  //     cursor: pointer;
  //     background: rgb(33, 100, 243);
  //   }
  // }
}
</style>
