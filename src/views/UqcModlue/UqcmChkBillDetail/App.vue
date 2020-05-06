<template>
  <div class="app">
    <safe-header
      v-bind="{title:title,color:'#fff',textColor:'#000',isBack:true,backIconColor: '#4da274',fixedTop:true}"
    ></safe-header>
    <mu-flex align-items="center" style="width:100%;padding:.5% 1%;">
      <fieldset style="width:100%; font-size:1.2rem;">
        <mu-sub-header class="item-hedaer">待检任务单</mu-sub-header>
        <mu-flex align-items="center" fill>
          <mu-flex style="width:25%;">
            <span class="lableSpan">检验单号：</span>
            <span>{{checkBill.code}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">工 单 号：</span>
            <span>{{checkBill.workOrderCode}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">产品编码：</span>
            <span>{{checkBill.mrlCode}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">产品名称：</span>
            <span>{{checkBill.mrlName}}</span>
          </mu-flex>
        </mu-flex>
        <mu-flex align-items="center" fill>
          <mu-flex style="width:25%;">
            <span class="lableSpan">工 序 号：</span>
            <span>{{checkBill.opCode}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">批 次 号：</span>
            <span>{{checkBill.lotCode}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">检测时间：</span>
            <span>{{checkBill.checkTime}}</span>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">检 测 人：</span>
            <span>{{checkBill.checkId}}</span>
          </mu-flex>
        </mu-flex>
        <mu-flex align-items="center" fill>
          <mu-flex style="width:25%;">
            <span class="lableSpan">检测数量：</span>
            <mu-text-field type="number" v-model="checkBill.chkCount" disabled style="width:60%;"></mu-text-field>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">合格数量：</span>
            <mu-text-field type="number" v-model="checkBill.qualifiedCount" @input="calculateOther(1)" v-bind:disabled="isDisabled" style="width:60%;"></mu-text-field>
          </mu-flex>
          <mu-flex style="width:25%;">
            <span class="lableSpan">报废数量：</span>
            <mu-text-field type="number" v-model="checkBill.scrappedCount" @input="calculateOther(2)" v-bind:disabled="isDisabled" style="width:60%;"></mu-text-field>
          </mu-flex>
        </mu-flex>
        <mu-flex align-items="center" fill>
          <mu-flex style="width:50%;">
            <span style="width:15%; text-align:right;">检测结果：</span>
            <mu-radio :value="0" v-model="checkBill.chkResult" v-bind:disabled="isDisabled" style="margin-right:10%;" class="finished" label="未判定"></mu-radio>
            <mu-radio :value="1" v-model="checkBill.chkResult" v-bind:disabled="isDisabled" style="margin-right:10%;" class="finished" label="不合格"></mu-radio>
            <mu-radio :value="5" v-model="checkBill.chkResult" v-bind:disabled="isDisabled" style="margin-right:10%;" class="finished" label="放行"></mu-radio>
            <mu-radio :value="7" v-model="checkBill.chkResult" v-bind:disabled="isDisabled" style="margin-right:10%;" class="finished" label="合格"></mu-radio>
          </mu-flex>
          <mu-flex style="width:50%;">
            <span style="width:15%; text-align:right;">审核状态：</span>
            <mu-radio :value="0" v-model="checkBill.processState" style="margin-right:10%;" v-bind:disabled="isDisabled_processState" class="finished" label="未审核"></mu-radio>
            <mu-radio :value="8" v-model="checkBill.processState" style="margin-right:10%;" v-bind:disabled="isDisabled_processState" class="finished" label="审核确认"></mu-radio>
            <mu-radio :value="9" v-model="checkBill.processState" style="margin-right:10%;" v-bind:disabled="isDisabled_processState" class="finished" label="审核取消"></mu-radio>
          </mu-flex>
        </mu-flex>
      </fieldset>
    </mu-flex>
    <mu-flex align-items="center" style="width:100%;padding:.5% 1%;">
    <fieldset style="width:100%; font-size:1.2rem;">
      <mu-sub-header class="item-hedaer">检测项明细</mu-sub-header>
      <mu-flex v-for="(item,index) in chkBillCitem" :key="index">
        <mu-flex class="list" v-if="(chkEmpType == 0 && item.chkEmpType == 0) || chkEmpType == 1">
          <mu-flex align-items="center" fill>
            <mu-flex style="width:40%;">{{++index}}
              <mu-row class="list-content" style="width: 100%;">
                <mu-col class="machine_properties fontcolor" span="12">
                  <mu-flex><span class="lableSpan">检测项编码：</span><span>{{item.citemCode}}</span></mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="12">
                  <mu-flex><span class="lableSpan">检测项名称：</span><span>{{item.citemName}}</span></mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="12">
                  <mu-flex><span class="lableSpan">检测方式：</span>
                    <span v-if="item.checkMode == '0'">定性检测</span>
                    <span v-if="item.checkMode == '1'">定量检测</span>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="12">
                  <mu-flex><span class="lableSpan">检测结果：</span>
                    <mu-radio :value="0" v-model="item.chkResult" v-bind:disabled="isDisabled" class="finished lineSet" label="未判定"></mu-radio>
                    <mu-radio :value="1" v-model="item.chkResult" v-bind:disabled="isDisabled" class="finished lineSet" label="不合格"></mu-radio>
                    <mu-radio :value="5" v-model="item.chkResult" v-bind:disabled="isDisabled" class="finished lineSet" label="放行"></mu-radio>
                    <mu-radio :value="7" v-model="item.chkResult" v-bind:disabled="isDisabled" class="finished lineSet" label="合格"></mu-radio>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="12">
                  <mu-flex><span class="lableSpan">内容补充：</span>
                    <mu-text-field v-model="item.ps" v-bind:disabled="isDisabled" type="text"></mu-text-field>
                  </mu-flex>
                </mu-col>
              </mu-row>
            </mu-flex>
            <mu-flex v-if="item.controlType == 0" style="width:60%;">
              <mu-row class="list-content" style="width: 100%;">
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">控制上限：</span>
                    <mu-text-field v-model="item.maxValue" type="text" disabled></mu-text-field>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">控制下限：</span>
                    <mu-text-field v-model="item.minValue" type="text" disabled></mu-text-field>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">规格上限：</span>
                    <mu-text-field v-model="item.specMax" type="text" disabled></mu-text-field>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">规格下限：</span>
                    <mu-text-field v-model="item.specMin" type="text" disabled></mu-text-field>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">标准值：</span>
                    <mu-text-field v-model="item.standardValue" type="text" disabled></mu-text-field>
                  </mu-flex>
                </mu-col>
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex v-for="(item2,index2) in citemResult" :key="index2"><span v-if="item2.chkBillCitemId == item.id" class="lableSpan">检测值：</span>
                    <mu-text-field v-if="item2.chkBillCitemId == item.id" v-model="item2.chkValue" type="number" v-bind:disabled="isDisabled"></mu-text-field>
                  </mu-flex>
                </mu-col>
              </mu-row>
            </mu-flex>
            <mu-flex v-if="item.controlType != 0" style="width:60%;">
              <mu-row class="list-content" style="width: 100%;">
                <mu-col class="machine_properties fontcolor" span="6">
                  <mu-flex><span class="lableSpan">检测值：</span>
                    <div v-for="(item3,index3) in citemResultD" :key="index3">
                    <div v-for="(item2,index2) in citemResult" :key="index2">
                      <mu-checkbox @change="checkBoxChange(item2.id,item3.id)" v-if="item.controlType == 1 && item2.chkBillCitemId == item.id && item3.citemResultId == item2.id" 
                        :value=2 v-model="item3.selectFlags" :label="item3.citemDName" v-bind:disabled="isDisabled"></mu-checkbox>
                      <mu-radio @change="radioChange(item2.id,item3.id)" v-if="item.controlType == 2 && item2.chkBillCitemId == item.id && item3.citemResultId == item2.id" 
                        :value=2 v-model="item3.selectFlag" v-bind:disabled="isDisabled" class="finished lineSet" :label="item3.citemDName"></mu-radio>
                      <span v-if="item.controlType != 0 && item2.chkBillCitemId == item.id && item3.citemResultId == item2.id">&nbsp;&nbsp;&nbsp;</span>
                    </div>
                    </div>
                  </mu-flex>
                </mu-col>
              </mu-row>
            </mu-flex>
          </mu-flex>
        </mu-flex>
      </mu-flex>
    </fieldset>
    </mu-flex>
    <section>
      <mu-row>
        <mu-col span="12"><mu-button style="min-width:0;width:0;"></mu-button></mu-col>
      </mu-row>
    </section>
    <section class="bottom-auto">
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
  name: "UqcmChkBillDetail",
  components: {
    SafeHeader
  },
  data: () => {
    return {
      title: "检测单明细",
      checkType: "",
      chkEmpType: 0, //检测人员类别(0操作工/1质检员)
      checkBill: {} ,//检验单
      isDisabled: false,//所有可操作按钮是否可用
      isDisabled_processState: false, // 审核按钮是否可用
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
      },{
        id: '2',
        citemCode: 'TEST_1234567892',
        citemName: '测试检测项2',
        checkMode: '0',
        chkResult: '0',
        ps: '待检测',
        controlType: '1',
        maxValue: 15,
        minValue: 5,
        specMax: 10,
        specMin: 10,
        standardValue: 10
      },{
        id: '3',
        citemCode: 'TEST_1234567893',
        citemName: '测试检测项3',
        checkMode: '0',
        chkResult: '0',
        ps: '待检测',
        controlType: '2',
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
        },
        {
          id: '22',
          chkBillCitemId: '2',
          chkValue: '0'
        },
        {
          id: '33',
          chkBillCitemId: '3',
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
        },{
          id: '444',
          citemResultId: '33',
          selectFlag: 1,
          citemDName: '优良'
        },{
          id: '555',
          citemResultId: '33',
          selectFlag: 1,
          citemDName: '良好'
        },{
          id: '666',
          citemResultId: '33',
          selectFlag: 2,
          citemDName: '劣质'
        }
      ]
    };
  },
  methods: {
    //初始化质检明细数据
    getCheckBillDetails(){
      //先清理数据
      this.chkBillCitem = [];//检验项明细
      this.citemResult = [];//检测值明细
      this.citemResultD = [];//检测选项明细
      let data = qs.stringify({
        uqcmChkBillDetailId: this.checkBill.uqcmChkBillDetailId
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getChkBillDetailsById.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:检测单明细" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.chkBillCitem = resData.chkBillCitem;//检验项明细
            this.citemResult = resData.citemResult;//检测值明细
            //this.citemResultD = resData.citemResultD;//检测选项明细
            resData.citemResultD.forEach(item => {
              if(!item.selectFlags) item.selectFlags = [];
              item.selectFlags.push(item.selectFlag);
              this.citemResultD.push(item);//检测选项明细
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //根据检测数量及合格数/报废数计算报废数/合格数
    calculateOther(flag){
      if(this.checkBill.chkCount && this.checkBill.chkCount * 1 > 0){
        if(flag == 1){
          this.checkBill.scrappedCount = this.checkBill.chkCount * 1 - this.checkBill.qualifiedCount;
        }
        if(flag == 2){
          this.checkBill.qualifiedCount = this.checkBill.chkCount * 1 - this.checkBill.scrappedCount;
        }
      }
    },
    //多选改变
    checkBoxChange(selectCitemResultId, selectItemId){
      this.citemResultD.forEach(item => {
        if(item.citemResultId == selectCitemResultId){
          if(item.id == selectItemId) {
            if(item.selectFlag == 2) {
              item.selectFlag = 1;
            }else{
              item.selectFlag = 2;
            }
            return false;
          }
        }
      });
    },
    //单选改变
    radioChange(selectCitemResultId, selectItemId){
      this.citemResultD.forEach(item => {
        if(item.citemResultId == selectCitemResultId){
          if(item.id == selectItemId) {
            item.selectFlag = 2;
          }else{
            item.selectFlag = 1;
          }
        }
      });
    },
    //检测结果提交
    submit(){
      if((this.checkBill.scrappedCount && this.checkBill.scrappedCount * 1 < 0) 
        || (this.checkBill.qualifiedCount && this.checkBill.qualifiedCount * 1 < 0)){
          Toast.error({
            message: "合格或报废数量不能小于0!",
            close: false
          });
          return false;
      }
      let user = storage.getObject("user");
      this.checkBill.currentId = user.username;
      let data = qs.stringify({
        checkBill: JSON.stringify(this.jsonArrFormat(this.checkBill)),
        chkBillCitem: JSON.stringify(this.jsonArrFormat(this.chkBillCitem)),
        citemResult: JSON.stringify(this.jsonArrFormat(this.citemResult)),
        citemResultD: JSON.stringify(this.jsonArrFormat(this.citemResultD))
      });
      console.log(JSON.stringify(this.jsonArrFormat(this.citemResultD)));
      if(this.isDisabled) return;//提交中，不允许重复提交
      this.isDisabled = true;
      const loading = this.$loading({});
      http.post({url: "productPadCommController!updateCheckBill.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("提交成功:" + JSON.stringify(res.data.data));
            Toast.success({
              message: "提交成功!",
              close: false
            });
            setTimeout(() => {this.goBack();},1000);
          }else{
            this.isDisabled = false;
            Toast.error({
              message: JSON.stringify(res.data.msg),
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        this.isDisabled = false;
        console.log(JSON.stringify(err));
      });
    },
    //返回上一页
    goBack(){
      this.$root.api.api.closeWin();
    },
    //格式化提交参数，不要数组类参数，json转实体会有问题
    jsonArrFormat(arr){
      let obj;
      if(!Array.isArray(arr)){
        let item = arr;
        obj = {};
        for(var key in item){
              if(!Array.isArray(item[key])){
                obj[key] = item[key];
              }
        }
      }else{
        obj = [];
        arr.forEach(item => {
            let o = {};
            for(var key in item){
              if(!Array.isArray(item[key])){
                console.log(item[key]);
                o[key] = item[key];
              }
            }
            obj.push(o);
        });
      }
      return obj;
    }
  },
  mounted: function() {
    let pageParam = this.$root.api.api.pageParam || {};
    this.checkType = pageParam.checkType; //检验类型
    this.chkEmpType = pageParam.chkEmpType || 0; //检测人员类别(0操作工/1质检员)
    if(this.chkEmpType == 0) this.isDisabled_processState = true; //操作工不允许审核
    this.checkBill = pageParam.checkBill; //检验单
    if(this.checkBill.processState != 8 && this.checkBill.processState != 9) this.checkBill.processState = 0;
    if(this.checkBill.processState == 8) this.isDisabled = true;//审核确认后不可再操作
    let preTitle = "";
    if(this.checkType == "ZZP_SJ"){
      preTitle = "首检";
    }
    if(this.checkType == "ZZP_XJ"){
      preTitle = "巡检";
    }
    if(this.checkType == "ZZP_MJ"){
      preTitle = "末检";
    }
    this.title = preTitle + this.title; //页面标题
    this.getCheckBillDetails();//初始化检测相关数据
  }
};
</script>
<style scoped lang="scss">
.app {
  overflow: hidden;
  background-color: #f0eff4;
  min-height: 100vh;
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
  text-align: right;
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