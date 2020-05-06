<template>
  <div class="app">
    <safe-header
      v-bind="{title:title,color:'#fff',textColor:'#000',isBack:true,backIconColor: '#4da274',fixedTop:true}"
    ></safe-header>
    <mu-list class="input-items">
      <mu-list-item :ripple="false" class="input-item" style="text-align:center;">
        <mu-list-item-action>
          <mu-icon value="search" class="finished" size="28"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-content>
          <section class="bottom-auto">
            <mu-row>
              <mu-col span="11">
                <mu-text-field type="text" v-model="workOrderCode" placeholder="请输入工单号" style="width:100%;" v-on:keyup.enter="scanWorkOrder"></mu-text-field>
              </mu-col>
              <!-- <mu-col span="1" style="text-align: right;">
                <mu-button large class="main-bg" textColor="white" @click="opAddCheckBillDialog(1)">创建</mu-button>
              </mu-col> -->
            </mu-row>
          </section>
        </mu-list-item-content>
      </mu-list-item>
    </mu-list>
    <!-- <mu-flex align-items="center" style="width:100%;padding:.5% 1%;">
      <fieldset style="width:100%;">
        <legend class="mylegend">工序</legend>
        <div v-for="count in Math.ceil(ops.length/10)" :key="count">
          <mu-flex align-items="center" fill>
            <mu-checkbox value="all" v-model="opCheckboxSet.checked" label="全选" @change="isCheckAll"></mu-checkbox>
            <mu-flex v-for="(item,index) in getRowOps((count-1)*10,count*10)" :key="index" style="width:10%;">
                <mu-checkbox :value="item.code" v-model="opCheckboxSet.checked" :label="item.showName" @change="opChange"></mu-checkbox>
            </mu-flex>
          </mu-flex>
        </div>
      </fieldset>
    </mu-flex> -->
      <mu-tabs :value.sync="active" center color="white" indicator-color="rgba(0,0,0,0)" full-width @change="tabChange">
        <mu-tab>
          待处理
        </mu-tab>
        <mu-tab>
          已处理
        </mu-tab>
      </mu-tabs>
    <div id="checkBillContainer" v-for="(item,index) in checkBills" :key="index">
      <div class="list" @click="goPage(item)">
      <mu-row class="list-content" style="width: 100%;">
        <mu-col class="machine_name" span="3">检验单号：<span>{{item.code}}</span></mu-col>
        <mu-col class="machine_name" span="3">&nbsp;&nbsp;&nbsp;工单号：<span>{{item.workOrderCode}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">产品编码：<span>{{item.mrlCode}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">产品名称：<span>{{item.mrlName}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">&nbsp;&nbsp;&nbsp;工序号：<span>{{item.opCode}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">&nbsp;&nbsp;&nbsp;批次号：<span>{{item.lotCode}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">检测结果：
          <span v-if="item.chkResult == '0'">未判定</span>
          <span v-if="item.chkResult == '1'">不合格</span>
          <span v-if="item.chkResult == '5'">放行</span>
          <span v-if="item.chkResult == '7'">合格</span>
        </mu-col>
        <mu-col class="machine_properties fontcolor" span="3">&nbsp;&nbsp;&nbsp;检测人：<span>{{item.checkId}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">检测时间：<span>{{item.checkTime}}</span></mu-col>
        <mu-col class="machine_properties fontcolor" span="3">审核状态：
          <span v-if="item.processState != '8' && item.processState != '9'">未审核</span>
          <span v-if="item.processState == '8'">已审核</span>
          <span v-if="item.processState == '9'">已取消</span>
        </mu-col>
      </mu-row>
      </div>
    </div>
    <div id="loadMoreDiv" v-if="checkBills.length >= 5 && hasMore == true" style="text-align: center; font-size: 20px;padding:.5% 1%;" @click="loadMore">
      <span>加载更多</span>
    </div>
    <mu-dialog title="新建检测单" width="60%" style="text-align:center;" :open.sync="showAddCheckBillDialog" 
      :esc-press-close="false" :overlay-close="false" dialog-class="dialog-div">
      <div class="mu-dialog-body">
        <div class="input-form">
          <mu-row style="width: 100%;">
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工单号</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="woCode" v-on:keyup.enter="scanWoCode" placeholder="请输入工单号" type="text" underline-color="#2cb69a"></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">检测模板</span></mu-col>
            <mu-col span="4">
              <mu-select filterable="" v-model="chkTemplateId">
                <mu-option v-for="(item,index) in defOpChkTemplates" :key="index" :label="item.showName" :value="item.id"></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">订单号</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.orderCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">派工单号</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.dispatchCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">物料编码</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.mrlCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">物料名称</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.mrlName" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工作中心编码</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.workCenterCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工作中心名称</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.workCenterName" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工位编码</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.workCellCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工位名称</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.workCellName" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工序编码</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.opCode" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">工序名称</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="trackOrder.opName" type="text" underline-color="#2cb69a" disabled></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">批次号</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="lotCode" type="text" underline-color="#2cb69a"></mu-text-field></mu-col>
            <mu-col span="2" style="text-align:right;padding-right:3%;"><span class="span-lable">备注</span></mu-col>
            <mu-col span="4"><mu-text-field class="text-input" v-model="remark" type="text" underline-color="#2cb69a"></mu-text-field></mu-col>
          </mu-row>
        </div>
        <div class="button-db" style="padding-top:5%;">
          <mu-row>
            <mu-col span="6"><mu-button slot="actions" color="primary" @click="addCheckBill">提交</mu-button></mu-col>
            <mu-col span="6"><mu-button slot="actions" color="gray" @click="opAddCheckBillDialog(0)">关闭</mu-button></mu-col>
          </mu-row>
        </div>
      </div>
    </mu-dialog>
    <section class="bottom-auto">
      <mu-row class="tabberWarp" style="background-color: rgba(0,0,0,0)">
        <mu-col span="12" class="warp">
          <mu-button large textColor="white" @click="opAddCheckBillDialog(1)" fab color="teal">
            <mu-icon value="add">创建</mu-icon>
          </mu-button>
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
  name: "UqcmChkBill",
  components: {
    SafeHeader
  },
  data: () => {
    return {
      workCellIds: [], //工位
      title: "检测单",
      checkType: "ZZP_SJJ", //检测类型
      chkEmpType: 0, //检测人员类别(0操作工/1质检员)
      active: 0,  //tab下标
      workOrderCode: "",  //工单
      pageNum: 1, //页码
      processState: 0,  //查询的单据状态
      hasMore: true,  //是否还有更多数据
      isLoading: false, //是否正在加载中
      showAddCheckBillDialog: false,
      opCheckboxSet: {
        checked: []//工序多选框值
      },
      ops: [{ //工序数组
          code: '1',
          showName: '工序11'
        },{
          code: '2',
          showName: '工序12'
        },{
          code: '3',
          showName: '工序13'
        },{
          code: '4',
          showName: '工序21'
        },{
          code: '5',
          showName: '工序22'
        },{
          code: '6',
          showName: '工序23'
        }],
      checkBills:[{ //检测单数组
        code: 'PO-2019120101',
        workOrderCode: 'WO-201903271',
        mrlCode: 'S30-123456',
        mrlName: '测试产品1',
        opCode: 'OP-01',
        lotCode: '2019120301',
        chkResult: '0',
        checkId: 'lq',
        checkTime: '2019-12-02 14:00:00',
        processState: '0'
      },{
        code: 'PO-2019120102',
        workOrderCode: 'WO-201903272',
        mrlCode: 'S30-1234567',
        mrlName: '测试产品2',
        opCode: 'OP-02',
        lotCode: '2019120302',
        chkResult: '1',
        checkId: 'lq',
        checkTime: '2019-12-02 14:00:00',
        processState: '0'
      },{
        code: 'PO-2019120103',
        workOrderCode: 'WO-201903273',
        mrlCode: 'S30-12345678',
        mrlName: '测试产品3',
        opCode: 'OP-03',
        lotCode: '2019120303',
        chkResult: '7',
        checkId: 'lq',
        checkTime: '2019-12-02 14:00:00',
        processState: '1'
      }],
      woCode: "",//输入的执行工单号
      //执行工单
      defOpChkTemplates: [],//检测模板下拉框
      chkTemplateId: "",//选择的检测模板id
      trackOrder: {},//派工单
      lotCode: "",//批次号
      remark: ""//备注
    };
  },
  methods: {
    //获取检测人员类别
    getChkEmpTypeByUserId(){
      let user = storage.getObject("user");//登录人员
      let data = qs.stringify({
        loginName: user.username
      });
      http.post({url: "productPadCommController!getChkEmpTypeByUserId.m",
          data: data,
          autoLogin: true
        }).then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:人员类别" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.chkEmpType = resData.chkEmpType;
          }
      }).catch( err => {
        console.log(JSON.stringify(err));
      });
    },
    //获取工序
    getOps(){
      http.post({url: "productPadCommController!getOpList.m",
          data:{},
          autoLogin: true
        }).then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:工序" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.ops = resData;
          }
      }).catch( err => {
        console.log(JSON.stringify(err));
      });
    },
    //获取行单行工序
    getRowOps(start, end){
      return this.ops.slice(start, end);
    },
    //控制新建检测单dialog
    opAddCheckBillDialog(flag){
      if(flag == 1){
        this.showAddCheckBillDialog = true;
      }else{
        this.showAddCheckBillDialog = false;
      }
    },
    //获取派工单
    scanWoCode(){
      let data = qs.stringify({
        woCode: this.woCode.trim(),
        workCellIds: JSON.stringify(this.workCellIds)
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getTrackOrder.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          this.woCode = "";
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:派工单" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            this.trackOrder = resData.trackOrder;
            this.getUqcmDefOpChkTemplateByParamMap();
          }else{
            Toast.error({
              message: JSON.stringify(res.data.msg),
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //获取当前物料的检测模板
    getUqcmDefOpChkTemplateByParamMap(){
      let data = qs.stringify({
        chkTypeCode: this.checkType,
        produCode: this.trackOrder.mrlCode,
        opCode: this.trackOrder.opCode
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getUqcmDefOpChkTemplateByParamMap.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          this.woCode = "";
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:检测模板" + JSON.stringify(res.data.data));
            let resData = res.data.data || [];
            this.defOpChkTemplates = resData;
            if(resData.length > 0){
              this.chkTemplateId = (resData[0]).id;
            }
          }else{
            Toast.error({
              message: JSON.stringify(res.data.msg),
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //新增检测单
    addCheckBill(){
      if(!this.chkTemplateId || this.chkTemplateId == ""){
        Toast.error({
            message: "请选择检测模板!",
            close: false
          });
        return false;
      }
      let data = qs.stringify({
        chkTemplateId: this.chkTemplateId,
        trackOrder: JSON.stringify(this.trackOrder),
        lotCode: this.lotCode,
        remark: this.remark
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!addCheckBill.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回结果" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            if(resData){
              this.trackOrder = {};
              this.lotCode = "";
              this.remark = "";
              this.defOpChkTemplates = {};
              this.chkTemplateId = "";
              this.opAddCheckBillDialog(0);
              this.scanWorkOrder();
              Toast.success({
                message: "提交成功!",
                close: false
              });
            }else{
              Toast.error({
                message: resData,
                close: false
              });
            }
          }else{
            Toast.error({
              message: JSON.stringify(res.data.msg),
              close: false
            });
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //获取检测单
    getCheckBills(flag){
      let data = qs.stringify({
        workCellIds: JSON.stringify(this.workCellIds),
        checkType: this.checkType,
        workOrderCode: this.workOrderCode,
        opCodes: JSON.stringify(this.opCheckboxSet.checked),
        pageNum: this.pageNum,
        processState: this.processState
      });
      const loading = this.$loading({});
      http.post({url: "productPadCommController!getCheckList.m",
          data: data
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            console.log("请求返回数据:检测单" + JSON.stringify(res.data.data));
            let resData = res.data.data;
            if(flag && flag == 'append'){
              resData.forEach(item => {
                this.checkBills.push(item);
              });
              this.isLoading = false;
            }else{
              this.checkBills = resData;
            }
          }else{
            this.hasMore = false;
            if(flag && flag == 'append'){
              this.isLoading = false;
            }else{
              this.checkBills = [];
            }
          }
      }).catch( err => {
        if(loading) loading.close();
        console.log(JSON.stringify(err));
      });
    },
    //处理检测单
    goPage(checkBill) {
      console.log(JSON.stringify(checkBill));
      this.$root.api.api.openWin({
        name: "UqcmChkBillDetail",
        url: "UqcmChkBillDetail.html",
        pageParam: {
          checkType: this.checkType,
          chkEmpType: this.chkEmpType,
          checkBill: checkBill
        },
        progress: {}
      });
    },
    scanWorkOrder(){//输入工单号查询
      this.pageNum = 1;
      this.hasMore = true;
      this.getCheckBills();
    },
    opChange(){//工序改变，重新查询
      this.pageNum = 1;
      this.hasMore = true;
      this.getCheckBills();
    },
    tabChange(){//切换tab
      this.pageNum = 1;
      this.hasMore = true;
      this.processState = this.active;
      this.getCheckBills();
    },
    loadMore(){//加载更多
      this.pageNum = this.pageNum + 1;
      this.getCheckBills('append');
    },
    scroll() {
      window.onscroll = () => {
        // 距离底部小于屏幕5%高度时加载一次
        let bottomOfWindow = (document.documentElement.scrollTop + window.innerHeight) / document.documentElement.offsetHeight > 0.95
        if (bottomOfWindow && this.isLoading == false && this.hasMore == true) {
          this.isLoading = true
          this.loadMore();
        }
      }
    }
  },
  mounted: function() {
    let pageParam = this.$root.api.api.pageParam || {};
    this.checkType = pageParam.checkType; //检验类型
    //绑定的工位Gid
    let workCellInfo = storage.getObject('workCells') || [];
    workCellInfo.forEach(item => {
      if(item.id && item.id.length > 0) this.workCellIds.push(item.id);
    });

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
    this.getChkEmpTypeByUserId();//获取检测人员类别
    this.title = preTitle + this.title;//页面标题
    //this.getOps();//初始化工序多选框
    this.getCheckBills();//初始化列表
    this.scroll();//滚动加载数据
  }
};
</script>
<style scoped lang="scss">
.app {
  overflow: hidden;
  background-color: #f0eff4;
  min-height: 100vh;
}

/deep/ .list {
  padding: 0 8px 10px 8px;
  margin-top: 10px;
  background-color: white;
  overflow: hidden;
}

.list-content {
  height: 5.5rem;
  padding-top: 10px;
  margin: 3px 0;
  .machine_properties {
    height: 28px;
    font-size: 1.2rem;
    line-height: 28px;
    vertical-align: middle;
    padding-left: 10px;
  }
  .machine_name {
    color: #1abc9c;
    font-size: 1.2rem;
    font-weight: bold;
    padding-left: 10px;
  }
}
//不可用样式
/deep/ .mu-input-line.disabled{
  border-bottom: none;
}
//表头标签样式
/deep/ .lableCol {
  text-align:right;
  padding-right:3%;
}
//按钮漂浮
.warp{
		display: flex;
	}
.tabberWarp{
  position: fixed;
  bottom: 5%;
  right: 5%;
  background: #fff; 
}
//tab默认文本样式
/deep/ .mu-tab{
  color:black;
  font-size: 1.3rem;
}
//tab激活样式
/deep/ .mu-tab-active {
    color:white;
    background-color: #1184e1;
}
//dialog弹框中 input样式
// mu-dialog-wrapper 和 product 是平级的 所以应该定义再外层
.mu-dialog-wrapper /deep/ .dialog-div {
  border: 1px solid rgb(112, 110, 110);
  border-radius: 15px;
  text-align: center;
  //span元素块
  .span-lable{
    line-height: 2.5rem;
  }
  //输入框元素块
  .text-input {
    input {
      z-index: 100;
      border: 1px solid rgb(112, 110, 110);
      border-radius: 3px;
    }
    /deep/  .mu-input-line.disabled {
        height: 100%;
        z-index: 1;
        padding: .5% 3%;
        background-color:rgba(221, 216, 216,.85);
        border: none;
    }
  }
}
</style>