<template>
  <div class="app">
    <safe-header
      v-bind="{title:'在制品转出',color:'#fff',textColor:'#000',isBack:true,backIconColor: '#4da274',fixedTop:true}"
    ></safe-header>
    <div class="barCode-div">
      <div class="barCode-div-div">
        <mu-icon size="30" class="barCode-search-icon" value="search" color="#2196f3"></mu-icon>
        <input class="barCode-input" type="text" placeholder="请输入条码..." v-model="barCode" v-bind:disabled="isDisabled" v-on:keyup.enter="scanBarCode"/>
      </div>
    </div>
    <mu-sub-header class="item-hedaer">已扫描明细</mu-sub-header>
    <div class="div-inline">
      <div class="list" v-for="(item,index) in uwipTransInDetails" :key="index" style="width: 70%;">
        <mu-row class="list-content" @click="alertIsDeleteRow(item.id)">
          <mu-col span="12" class="list-header">料车信息</mu-col>
          <!-- <mu-divider></mu-divider> -->
          <mu-col span="1" class="list-label" style="color:green;">料车号：</mu-col>
          <mu-col span="3" style="color:green;">{{item.materRackCode}}</mu-col>
          <mu-col span="1" class="list-label">物料编码：</mu-col>
          <mu-col span="3">{{item.mrlCode}}</mu-col>
          <mu-col span="1" class="list-label">物料名称：</mu-col>
          <mu-col span="3">{{item.mrlName}}</mu-col>

          <mu-col span="1" class="list-label">工单号：</mu-col>
          <mu-col span="3">{{item.workOrderCode}}</mu-col>
          <mu-col span="1" class="list-label">派工单号：</mu-col>
          <mu-col span="3">{{item.trackOrderCode}}</mu-col>
          <mu-col span="1" class="list-label">工序：</mu-col>
          <mu-col span="3">[{{item.opCode}}]{{item.opName}}</mu-col>

          <mu-col span="1" class="list-label">来源工位：</mu-col>
          <mu-col span="3">[{{item.workCellCode}}]{{item.workCellName}}</mu-col>
          <mu-col span="1" class="list-label">批次号：</mu-col>
          <mu-col span="3">{{item.lotCode}}</mu-col>
          <mu-col span="1" class="list-label">数量：</mu-col>
          <mu-col span="3">{{item.transQty}}</mu-col>
        </mu-row>
      </div>
      <div v-if="uwipTransInDetails.length > 0 || workCellId.length > 0" class="list div-div-inline div-right-div" style="min-height: 5rem;">
          <mu-row class="list-content">
            <mu-col span="12" class="list-header col-workCell">货位<font v-if="workCellId.length == 0" color="red">(待扫描)</font></mu-col>
            <mu-col span="12" class="col-workCell">{{workCellCode}}</mu-col>
            <mu-col span="12" class="col-workCell">{{workCellName}}</mu-col>
          </mu-row>
      </div>
    </div>
    <section>
      <mu-row>
        <mu-col span="12"><mu-button style="min-width:0;width:0;"></mu-button></mu-col>
      </mu-row>
    </section>
    <section>
      <mu-row class="tabberWarp">
        <mu-col span="12" class="warp">
          <mu-button large class="main-bg" textColor="white" style="width:100%;" v-bind:disabled="isDisabled" @click="submit">提交</mu-button>
        </mu-col>
      </mu-row>
    </section>
  </div>
</template>
<script>
import SafeHeader from "../../../components/safeHeaderNew";
import "muse-ui-loading/dist/muse-ui-loading.css";
import "muse-ui-message/dist/muse-ui-message.css";
import Loading from "muse-ui-loading";
import Toast from "muse-ui-toast";
import Message from "muse-ui-message";

import storage from "../../../utils/storage.js";
import http from "../../../utils/http.js";
import qs from "qs";
export default {
  name: "UwipTransOut",
  components: {
    SafeHeader
  },
  data: () => {
    return {
      barCode:"", //扫描的条码
      workCellSearchCode:"",  //扫描的工位
      workCellId:"",  //目标工位id
      workCellCode:"",  //目标工位code
      workCellName:"",  //目标工位name
      materRackCode:"",  //扫描的料车号
      uwipTransInDetails:[],  //转入明细
      isDisabled: false //是否可用
    };
  },
  methods: {
    scanBarCode(){
      if(!this.barCode || this.barCode.trim().length == 0) return;
      if(this.barCode.length >= 8){
        for(var index = 0 ; index < this.uwipTransInDetails.length; index ++ ){
          if(this.barCode.trim() == this.uwipTransInDetails[index].materRackCode) {
            Toast.error({
              message: "料车号"+ this.barCode.trim() +"已扫描，不允许重复扫描",
              close: false
            });
            this.barCode = "";
            return false;
          }
        }
        this.materRackCode = this.barCode.trim();
        this.getMrlTransportByMaterRackCode(); //查询料车信息
      }else{
        this.workCellSearchCode = this.barCode.trim(); //查询工位信息
        this.getWorkCellByCode();
      }
      this.barCode = "";
    },
    //根据料车号获取料车号已绑定派工单的转运记录
    getMrlTransportByMaterRackCode(){
      let data = qs.stringify({
        materRackCode: this.materRackCode
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getMrlTransportByMaterRackCode.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:料车转运信息" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.uwipTransInDetails.push(resData);
          }else{
            Toast.error({
              message: res.data.msg,
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //根据工位编码获取工位信息
    getWorkCellByCode(){
      let data = qs.stringify({
        workCellSearchCode: this.workCellSearchCode
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getWorkCellByCode.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:货位信息" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.workCellId = resData.workCellId;
            this.workCellCode = resData.workCellCode;
            this.workCellName = resData.workCellName;
          }else{
            Toast.error({
              message: res.data.msg,
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //删除明细行
    alertIsDeleteRow(id){
      Message.confirm('删除选中行？', '提示', {
        type: 'warning'
      }).then(({ result }) => {
        if (result) {
          let deleteIndex;
          for(var index = 0 ; index < this.uwipTransInDetails.length; index ++ ){
            if(id == this.uwipTransInDetails[index].id) {
              deleteIndex = index;
              break;
            }
          }
          this.uwipTransInDetails.splice(deleteIndex, 1);
        }
      });
    },
    //提交数据
    submit(){
      if(!this.uwipTransInDetails || this.uwipTransInDetails.length == 0){
        Toast.error({
          message: "未发现可操作的数据，不允许提交",
          close: false
        });
        return false;
      }
      if(!this.workCellId || this.workCellId.trim().length==0){
        Toast.error({
          message: "货位未扫描，不允许提交",
          close: false
        });
        return false;
      }
      this.isDisabled = true;
      let user = storage.getObject("user");//登录人员
      let data = qs.stringify({
        billType: 1,  //转出
        uwipTransInDetails: JSON.stringify(this.uwipTransInDetails),//数组参数需要先转json
        workCenterGid: localStorage.getItem("workCenterId"),
        workCellId: this.workCellId,
        workCellCode: this.workCellCode,
        workCellName: this.workCellName,
        loginName: user.username
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!saveRefInByMrlTransport.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("提交成功:" + JSON.stringify(res.data.data));
            Toast.success({
              message: "提交成功!",
              close: false
            });
            this.clearData();
          }else{
            Toast.error({
              message: res.data.msg,
              close: false
            });
          }
          this.isDisabled = false;
      }).catch( err => {
        if(loading) loading.close();
        this.isDisabled = false;
        console.log(JSON.stringify(err));
      });
    },
    //清空数据
    clearData(){
      this.uwipTransInDetails = [];
      this.workCellId = "";
      this.workCellCode = "";
      this.workCellName = "";
    }
  },
  mounted: function() {
    
  }
};
</script>
<style scoped lang="scss">
.app {
  overflow: hidden;
  background-color: #f0eff4;
  min-height: 100vh;
}

.barCode-div {
  min-height: 20vh;
  //扫码框样式
  .barCode-div-div {
    width: 80%;
    margin: 2rem auto;
    text-align: center;
    position: relative;
    //元素样式
    input {
      width: 60%;
      height: 2.6rem;
      outline: none;
    }
    //扫码(圆角)
    /deep/ .barCode-input {
      border: 1px solid rgb(33, 100, 243);
      border-radius: 30px; //圆角设置
      padding-left: 1.2rem;
    }
    //图标
    .barCode-search-icon {
      position: absolute;
      top: 15%;
      right: 21%;
    }
  }
}

//小标题样式
.item-hedaer.mu-sub-header {
  line-height: 1.3rem;
  margin: 0;
  background: #eaeaea;
  color: #63656a;
  font-weight: bold;
  font-size: 1.3rem;
}

//列表样式
/deep/ .list {
  padding: 0 8px 10px 8px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
  overflow: hidden;
  .list-content {
    //height: 6.2rem;
    padding-top: 5px;
    margin: 3px 0;
    font-size: 1rem;
    .list-header {
      text-align: center;
      font-size: 1.2rem;
      color: green;
    }
    .list-label {
      text-align:right;
    }
    .col-right-border{
      border-right: 1px solid black;
    }
    .col-workCell{
      text-align: center;
    }
  }
}

//div并列显示
.div-inline{
  display: block;
  white-space: nowrap;
  position:relative;
  .div-div-inline{ display:inline-block;}//行内块
  .div-right-div{
    position:absolute;top:0;bottom:0;right:0;//水平居右，高度跟随左div
    width: 28%;margin-top:0;display:flex;justify-content:center;align-items:center;//控件居中
  }
}

//底部提交按钮
.warp{
		border-top: 1px solid #eee;
		display: flex;
	}
.tabberWarp{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff; 
}
</style>