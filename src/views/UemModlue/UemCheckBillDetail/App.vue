<template>
  <div class="app">
    <safe-header
      v-bind="{title:title,color:'#fff',textColor:'#000',isBack:true,backIconColor: '#4da274',fixedTop:true}"
    ></safe-header>
    <mu-flex align-items="center" style="width:100%;padding:.5% 1%;">
      <fieldset style="width:100%; font-size:1.2rem;">
        <mu-sub-header class="item-hedaer">待检任务单</mu-sub-header>
        <!-- 第一行 -->
        <mu-flex align-items="center" fill class="flex-padding">
          <mu-flex style="width:30%;">
            <span>检验单号：{{checkBill.taskCode}}</span>
          </mu-flex>
          <mu-flex style="width:30%;">
            <span>设备编码：{{checkBill.equipCode}}</span>
          </mu-flex>
        </mu-flex>
        <!-- 第二行 -->
        <mu-flex align-items="center" fill class="flex-padding">
          <mu-flex style="width:30%;">
            <span>任务模板编码：{{checkBill.chkCode}}</span>
          </mu-flex>
          <mu-flex style="width:30%;">
            <span>任务模板名称：{{checkBill.CHKname}}</span>
          </mu-flex>
          <mu-flex style="width:25%;vertical-align: middle;">
            <span>执 行 人：</span>
            <mu-select v-model="checkBill.taskPerson">
                <mu-option v-for="(value, key) in options" :key="key" :label="value" :value="key"></mu-option>
            </mu-select>
          </mu-flex> 
        </mu-flex>
        <!-- 第三行  label-float full-width-->
        <mu-flex align-items="center" fill class="flex-padding">
          <mu-flex style="width:30%;">
            <span>实际开始时间：</span>
            <!-- <input type="datetime-local" v-model="checkBill.actualBeginDate" name="bdaytime" required="true" class="html5Input"/> -->
            <mu-date-input v-model="checkBill.actualBeginDate" placeholder="请选择时间" type="dateTime" format="YYYY-MM-DD HH:mm:ss" actions landscape></mu-date-input>
          </mu-flex>
          <mu-flex style="width:30%;">
            <span>实际结束时间：</span>
            <!-- <input type="datetime-local" v-model="checkBill.actualEndDate"  name="bdaytime" required="true" class="html5Input"/> -->
            <mu-date-input v-model="checkBill.actualEndDate" placeholder="请选择时间" type="dateTime"  format="YYYY-MM-DD HH:mm:ss" actions landscape></mu-date-input>
          </mu-flex>
          <mu-flex style="width:30%;margin-top: -16px;">
            <span>备  注：</span>
            <input type="text" v-model="checkBill.remark" class="html5Input" />
          </mu-flex>
        </mu-flex>

        <!-- 第四行 : 在默认值不起作用时，有可能时数据类型出现了问题 :value="0" 整数类型 -->
        <mu-flex align-items="center" fill class="flex-padding"> 
          <mu-flex style="width:40%;vertical-align: middle;">
            <span>执行结果：</span>
            <mu-radio :value="0" v-model="checkBill.taskResult" :disabled="isDisabled" style="margin-right:10%;" class="finished" label="未判定"></mu-radio>
            <mu-radio :value="1" v-model="checkBill.taskResult" :disabled="isDisabled" style="margin-right:10%;" class="finished" label="正常"></mu-radio>
            <mu-radio :value="2" v-model="checkBill.taskResult" :disabled="isDisabled" style="margin-right:10%;" class="finished" label="异常"></mu-radio>
          </mu-flex>
          <mu-flex style="width:40%;vertical-align: middle;">
            <span>执行状态：</span>
            <mu-radio :value="2" v-model="checkBill.taskState" style="margin-right:10%;" :disabled="isDisabled" class="finished" label="进行"></mu-radio>
            <mu-radio :value="3" v-model="checkBill.taskState" style="margin-right:10%;" :disabled="isDisabled" class="finished" label="完成"></mu-radio>
          </mu-flex>
        </mu-flex>
      </fieldset>
    </mu-flex>

    <!-- 检测项明细 -->
    <mu-flex align-items="center" style="padding:.5% 1%;">
      <fieldset style="width:100%;">
        <mu-sub-header class="item-hedaer">检测项明细</mu-sub-header>
        <mu-flex align-items="center" v-for="(item,index) in chkBillCitem" :key="index">

          <div class="flex-ul">
<!-- 不用v-if 这里使用 :style 样式绑定，为了防止使用方式出现的红色警告 -->
              <div class="flex-li" v-for="(value1, key1, index1) in billKeysName" :key="index1" :style="!(item.chkMode==0 && (key1=='maxValue' || key1=='minValue' || key1=='standardValue' || key1=='chkValue'))?'display:block':'display:none;'" >
                <!--if 检测类型：输入  最大|最小|标准值|任务值-->
                <mu-flex v-if="item.chkMode===1 && (key1=='maxValue' || key1=='minValue' || key1=='standardValue')">
                  <span>{{value1}}:</span>
                  <mu-text-field style="width:50%;" v-model="item[key1]" :disabled="true" type="text"></mu-text-field>
                </mu-flex>
                <mu-flex v-if="item.chkMode===1 &&  key1=='chkValue'">
                  <span>{{value1}}：</span>
                  <mu-text-field style="width:50%;" v-model="item[key1]" :disabled="isDisabled" type="text"></mu-text-field>
                </mu-flex>
                <!-- else-if  0未判定/1正常/2异常 -->
                <mu-flex v-else-if="key1==='checkResult'">
                  <span>检测结果:</span>
                  <mu-radio :value="0" v-model="item.checkResult" :disabled="isDisabled" class="finished lineSet" label="未判定"></mu-radio>
                  <mu-radio :value="1" v-model="item.checkResult" :disabled="isDisabled" class="finished lineSet" label="正常"></mu-radio>
                  <mu-radio :value="2" v-model="item.checkResult" :disabled="isDisabled" class="finished lineSet" label="异常"></mu-radio>
                </mu-flex>
                <!-- else if -->
                <mu-flex v-else-if="key1==='chkBeginTime' || key1==='chkEndTime'">
                  <span>{{value1}}:</span>
                  <!-- <input type="datetime-local" v-model="item[key1]" class="html5Input backgroundColor"/> -->
                  <mu-date-input style="width:50%;" v-model="item[key1]" placeholder="请选择时间" type="dateTime" landscape></mu-date-input>
                </mu-flex>
                <!--else if 检测类型：勾选-->
                <mu-flex v-else-if="key1=='chkPerson'">
                  <span>{{value1}}:</span>
                  <mu-select class="selectInpput" v-model="item[key1]">
                      <mu-option v-for="(value, key) in options" :key="key" :label="value" :value="key"></mu-option>
                  </mu-select>
                </mu-flex>
                <!--else if 检测类型：勾选-->
                <mu-flex v-else-if="key1=='remark'">
                  <span>{{value1}}：</span>
                  <input type="text" v-model="item[key1]" class="html5Input backgroundColor"/>
                  <!-- <mu-text-field  v-model="item[key1]" :disabled="isDisabled" type="text"></mu-text-field> -->
                </mu-flex>
                <!-- else if-->
                <mu-flex v-else-if="key1==='chkClassName'">
                  <span>{{++index}}&nbsp;{{value1}}：</span>{{item[key1]}}
                </mu-flex>
                <!-- else -->
                <mu-flex v-else-if="key1!='maxValue' && key1!='minValue' && key1!='standardValue' && key1!='chkValue'">
                  <span>{{value1}}：</span>{{item[key1]}}
                </mu-flex>
              </div>
            </div>
        </mu-flex>
      </fieldset>
    </mu-flex>
   
   <!-- 提交按钮 -->
    <section>
      <mu-row>
        <mu-col span="12"><mu-button style="min-width:0;width:0;"></mu-button></mu-col>
      </mu-row>
    </section>
    <section class="bottom-auto">
      <mu-row class="tabberWarp">
        <mu-col span="12" class="warp">
          <mu-button large class="main-bg" textColor="white" style="width:100%;" v-bind:disabled="isDisabled" @click="saveChkResult">提交</mu-button>
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
//引入的JS文件function，必须添加{},因为此方法在JS中时export导出的
import {formatDate} from "../../../utils/formatDate.js";

export default {
  name: "UemCheckBillDetail",
  components: {
    SafeHeader
  },
  filters: {
    formatDate(time) {
    //时间构造方式：new Date('dateStr')  new Date('yearNumber','monthNumber','dayNumber',...)
    //  let date = new Date(time); 
    //  let date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    //  return date_value;
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data: () => {
    return {
      title: "点检项明细",

      checkBill: {} ,//检验单
      taskId:'',
      taskCode:'',
      equipGid:'',
      username:'',//登录用户名称
      options:{},//人员下拉选

      isDisabled: false,//所有可操 作按钮是否可用

      billKeysName:{//勾选：检测任务单据详情列名称
        // taskCode: '单据编码',
        chkClassName:'任务类别',
        chkItemCode: '任务编码',
        chkItemName: '任务名称',
        chkItemRemark: '检测项说明',
        // chkMode: '输入类型',
        maxValue: '最 大 值',
        minValue: '最 小 值',
        standardValue: '标 准 值',
        chkValue: '任 务 值',
        chkPerson: '任务人',
        chkBeginTime: '实际开始时间',
        chkEndTime:  '实际结束时间',
        checkResult: '任务结果',
        remark:'备  注'
        // isDefaultEnable: '带出默认值',
        // detailRemark: '单据备注',
        // creatDate: '创建时间'
      },
      checkType: "",
      chkEmpType: 0, //检测人员类别(0操作工/1质检员)

      chkBillCitem:[{
        id: '1',
        citemCode: 'TEST_1234567891',
        citemName: '测试检测项1',
        checkMode: '0',
        chkResult: '0',
        ps: '待检测',
        controlType: '0',
        maxValue: 15,
        minValue: 5,
        specMax: 10,
        specMin: 10,
        standardValue: 10
      }],
      citemResult: [{
          id: '11',
          chkBillCitemId: '1',
          chkValue: '0'
        }
      ],
      citemResultD: [
        {
          id: '111',
          citemResultId: '22',
          selectFlag: [1],
          citemDName: '优良'
        },{
          id: '222',
          citemResultId: '22',
          selectFlag: [1],
          citemDName: '良好'
        },{
          id: '333',
          citemResultId: '22',
          selectFlag: [2],
          citemDName: '劣质'
        }
      ]
    };
  },
  methods: {
    //获取待填报点检项BO
    getEquipTaskItemBo(){
      //先清理数据
      this.chkBillCitem = [];//检验项明细

      let formData = new FormData();
      formData.append("id", this.taskId);
      formData.append("taskCode", this.taskCode);
      formData.append("uempChkListId", this.checkBill.uempChkListId);

      const loading = this.$loading({});
      http.post({url: "productPadCommController!getEquipTaskItemBo.m", data: formData})
      .then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            this.chkBillCitem = resData;//检验项明细
            // resData.forEach(item => {
            //   Object.keys(item).forEach(key => (
            //      console.log("key="+key+",item[key]="+item[key]
            //   )));
            // });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },

    //根据设备班组关系获取 人员列表
    getUserIdByEquipLabourGroup(){
      let formData = new FormData();
      formData.append("id", this.taskId);
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getUserIdByEquipLabourGroup.m", data: formData})
      .then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            // let resData = JSON.parse(res.data.data);
            // console.log("SB====="+res.data.data);
            this.options = res.data.data;
          }else{
            Toast.error({
                message: res.data.msg,
                close: false,
                position: "bottom"
              });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },

    //保存提交的任务检测项 EquipTaskItemBo的数据
    saveChkResult(){
      let formData = new FormData();

      //时间格式的校验,需要先判断是否未'' or null,否则转换格式错误 NaN-aN-aN aN:aN:aN
      if(!this.checkBill.actualBeginDate || !this.checkBill.actualEndDate){
        Toast.error({message: '实际开始时间和结束时间必填',time: "1000", close: false});
        return;
      }else{
        let beginDate = formatDate(new Date(this.checkBill.actualBeginDate),'yyyy-MM-dd hh:mm:ss');
        let endDate = formatDate(new Date(this.checkBill.actualEndDate),'yyyy-MM-dd hh:mm:ss');

        formData.append("actualBeginDate", beginDate);
        formData.append("actualEndDate", endDate);
        if(beginDate>endDate){
          Toast.error({message: '实际开始时间不能大于实际结束时间',time: "1000", close: false});
          return;
        } 
      }
      formData.append("taskId", this.taskId);//任务单主键
      formData.append("taskCode", this.taskCode);
      formData.append("taskState", this.checkBill.taskState);
      formData.append("taskResult", this.checkBill.taskResult);
      formData.append("taskPerson", this.checkBill.taskPerson);
      formData.append("remark", this.checkBill.remark);
      formData.append("rowData", JSON.stringify(this.chkBillCitem));//检测项

      const loading = this.$loading({});
      http.post({url: "productPadCommController!saveChkResult.m", data: formData})
      .then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            // let resData = JSON.parse(res.data.data);
            if(this.checkBill.taskState=="3"){
              this.isDisabled=true;
            }
            this.getEquipTaskItemBo();
            Toast.info({message: res.data.msg,time: "3000", close: false});
          }else{
              Toast.error({
                message: res.data.msg,
                close: false,
                position: "bottom"
              });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //返回上一页
    goBack(){
      this.$root.api.api.closeWin();
    },
  },
  mounted: function() {
    let pageParam = this.$root.api.api.pageParam || {};
    this.checkBill=pageParam.checkBill;
    this.taskId=pageParam.taskId;//点检任务单GID
    this.taskCode=pageParam.taskCode;//任务单编码
    this.equipGid=pageParam.equipGid;//点检设备主键
    this.processState=pageParam.processState;//0 待处理  1 已完成

    if(this.processState==1){
      this.isDisabled=true;
    }

    let user = storage.getObject("user");
    this.username=user.username;

    // console.log("====222 checkBill==="+this.checkBill.taskResult+","+this.checkBill.taskState);
    this.getEquipTaskItemBo();//初始点检任务项-依据检测模板创建 
    this.getUserIdByEquipLabourGroup();//依据设备人员班组关系，初始化带回检测人
  }
};
</script>
<style scoped lang="scss">
.app {
  overflow: hidden;
  background-color:white;
  min-height: 100vh;
}

//待检任务单信息
.flex-padding{
  padding-left: 25px;
    .flex-row{
      line-height: 1.6rem;
    }
}

// input输入框样式
/deep/.mu-input{
  vertical-align: middle;
  margin-bottom: 0px;
  padding-bottom: 0px;
  padding-top: 0px;
  min-height: 42px;
  min-width:55%;
}

.html5Input{
  width:62%;
  height: 1.5rem;
  border:1px solid #706e6e;
  font-weight: 400;
}

.backgroundColor{
    background-color: #b6e4e7;
}

// 下拉选div样式
/deep/.selectInpput .mu-input-content{
  width:80%;
}

//待处理任务样式
.flex-ul{
  display: flex;
  flex-direction: row;//排列方式
  flex-wrap: wrap;//换行
  justify-content:flex-start;
  align-items:center;//纵轴上的对齐方式
  background-color: rgb(182, 228, 231);
  overflow: hidden;
  padding: 10px 10px;
  margin:10px 5px 5px;
  height: 10rem;
  .flex-li {
    width:  25%;
    height: 25%;
    font-size: 1.2rem;
    text-align:left;
    i{
      line-height: 1.8rem;
    }
    span{
      width:50%;
      text-align:right;
    }
    .colorText{
      color: #1abc9c;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}

.item-hedaer.mu-sub-header {
  line-height: 1.3rem;
  margin: 0;
  background: #eaeaea;
  color: #63656a;
  font-weight: bold;
  font-size: 1.3rem;
}

//表头标签样式
.lableSpan {
  width: 30%;
  text-align: left;
}

//文本框样式
/deep/ .mu-text-field-input{
  border: 1px solid rgb(112, 110, 110);
  height: 1.5rem;
  line-height: 1.5rem;
  vertical-align: middle;
}

/deep/ input[disabled],input:disabled,input.disabled{  
    -webkit-text-fill-color:rgba(0,0,0,.38);  
    -webkit-opacity:1;  
    opacity: 1;  
}

/deep/ .mu-input-line.disabled{
  border-bottom: none;
}

/deep/ .list {
  padding: 0 8px 10px 8px;
  margin-top: 10px;
  background-color: rgb(182, 228, 231);
  overflow: hidden;
}

.list-content {
  padding-top: 10px;
  margin: 3px 0;
  .machine_properties {
    height: 28px;
    font-size: 1.2rem;
    line-height: 28px;
    vertical-align: middle;
    padding-left: 5%;
  }
  .machine_name {
    color: #1abc9c;
    font-size: 1.2rem;
    font-weight: bold;
    padding-left: 10px;
  }
}
.fontcolor {
  color: black;
}
.lineSet {
  height: 28px;
  line-height: 28px;
  margin-right:4%;
  vertical-align: middle;
}
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