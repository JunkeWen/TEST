<template>
  <div :class="{fixedTop:fixedTop}" ref="headerTop">
    <mu-appbar :style="headerStyle" :title="title" :color="color" :textColor="textColor">
      <mu-button icon slot="left" v-if="isBack" @click="goBack()">
        <mu-icon value="chevron_left" class="main-font" size="36"></mu-icon>
      </mu-button>
      <slot name="leftArea" slot="left" justify-content="center">
          <span style="position:absolute;width:10%;left:10%;">用户：{{myUser}}</span>
          <span style="position:absolute;width:10%;left:25%;">班次：{{workClass.workClassCode}}</span>
      </slot>
      <slot name="rightArea" slot="right">
          <span style="position:absolute;width:10%;right:25%;">生产线：{{workCenter.workCenterCode}}</span>
          <span style="position:absolute;width:10%;right:15%;">工位：{{workCell.workCellCode}}</span>
          <span style="position:absolute;width:10%;right:5%;">{{timeBox}}</span>
      </slot>
    </mu-appbar>
  </div>
</template>

<script>
import storage from "../utils/storage.js";
import http from "../utils/http.js";
import Toast from "muse-ui-toast";
export default {
  name: "SafeHeader",
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
      paddingTop: 0,
      //-------主页面数据--------
      myUser:"",//标题头用户信息
      workClassArr:[],//班次数组
      workCenterArr:[],
      workCellArr:[],
      workClass: {workClassId:"" ,workClassCode:""},//班次
      workCenter:{workCenterId:"",workCenterCode:""},//工作中心
      workCell:  {workCellId:"",workCellCode:""},//绑定的工位ID/CODE
      timeBox:"0000-00-00"
    };
  },
  computed: {
    headerStyle() {
      return {
        paddingTop: this.paddingTop + "px",
        height: this.paddingTop + 56 + "px"
      };
    }
  },
  methods: {
    goBack() {
      this.$root.api.api.closeWin();
    },
    // 发送请求:获取工作中心  
    getWorkCenter(){
        // 请求参数:获取工位
        let form = new FormData();
        form.append("workCellId", this.workCell.workCellId);
        form.append("workCellCode", this.workCell.workCellCode);

        http.post({ url: "productPadCommController!getWorkCenter.m", data: form })
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              let resData = JSON.parse(res.data.data);
              // console.log(res.data.data+"工作中心 ===="+resData);

              this.workCenterArr = resData;
              this.workCenter.workCenterId=resData[0].id;
              this.workCenter.workCenterCode=resData[0].code;
              localStorage.setItem("workCenterId", resData[0].id);
          }else{
            Toast.error({message: res.data.msg,close: false,position: "bottom"});
            return;
          }
        });
    },
    //发送请求:获取班次  
    getClasses(){
        http.post({ url: "productPadCommController!getUdiClasses.m"})
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              let resData = JSON.parse(res.data.data);
              // console.log(res.data.data+"班次 ===="+resData);
              this.workClassArr = resData;

              this.workClass.workClassId=resData[0].id;
              this.workClass.workClassCode=resData[0].name;
          }else{
            Toast.error({message: res.data.msg,close: false,position: "bottom"});
            return;
          }
        });
    },
    // 发送请求:获取登录用户  
    getCUser(){
      // 请求参数:获取登录人
      let form = new FormData();
      let user = storage.getObject("user");
      form.append("un", user.username);//登录人员

      http.post({ url: "productPadCommController!getCUser.m", data: form})
      .then(res => {
        if(res.status == 200  && res.data.erroCode == 0){
            let resData = JSON.parse(res.data.data);
            // console.log("登录用户 ===="+resData.user);
            this.myUser = resData.user;
        }else{
          Toast.error({message: res.data.msg,close: false,position: "bottom"});
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
      if(month < 10)
        month = '0' + month;
      if(day < 10)
        day = '0' + day;
      if(hours < 10)
        hours = '0' + hours;
      if(mins < 10)
        mins = '0' + mins;
      if(sec < 10)
        sec = '0' + sec;
      return this.timeBox=(year + '-' + month + '-' + day + ' ' + hours + ':' + mins +	':' + sec);	
		},
    currentTime() {
        setInterval(this.formatDate, 1000);
    },
    //获取登录人员和绑定工位
    initCellAndPerson(){
      let form = new FormData();

      let workCellInfo = storage.getObject('workCells') || []
      workCellInfo = workCellInfo[0] || {}
      form.append("workCellId", workCellInfo.id || '');//绑定的工位
      form.append("workCellCode", workCellInfo.code || '');//绑定的工位

      this.workCell.workCellId=workCellInfo.id || '';
      this.workCell.workCellCode=workCellInfo.code || '';

      let user = storage.getObject("user");
      form.append("un", user.username);//登录人员
      this.myUser=user.username;
      this.person=user.username;
      return form;
    }
  },
  mounted: function() {
    this.paddingTop = window.api ? window.api.safeArea.top : 0;
    this.$refs.headerTop.nextSibling.style.paddingTop = (this.fixedTop? (this.paddingTop + this.$refs.headerTop.offsetHeight):0) + 'px';
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
/deep/.mu-appbar-title{
    font-size: 18px;
    margin-left: -20px;
}
.mu-appbar {
  width: 100%;
}
.fixedTop {
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 100;
}
</style>
<style>
.fixedTop + * {
  padding-top: 80px;
}
.mu-appbar-title {
  text-align: center;
  margin-right: 2rem;
}
</style>

