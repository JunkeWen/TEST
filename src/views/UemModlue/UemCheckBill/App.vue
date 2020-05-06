<template>
  <div class="app">
    <!-- 标题头 -->
    <safe-header
      v-bind="{title:title,color:'#fff',textColor:'#000',isBack:true,backIconColor: '#4da274',fixedTop:true}"
    ></safe-header> 

    <!-- 条件查询 -->
    <mu-list style="overflow-X: visible;">
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <mu-icon value="search" size="28"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-content>
          <mu-text-field type="text" v-model="workOrderCode" placeholder="请输入单据号" style="width:100%;" v-on:keyup.enter="scanWorkOrder"></mu-text-field>
        </mu-list-item-content>
      </mu-list-item>
    </mu-list>

    <!-- tabs切换 -->
    <mu-tabs :value.sync="active" center color="white" indicator-color="rgba(0,0,0,0)" full-width @change="tabChange">
      <mu-tab>
        待处理
      </mu-tab>
      <mu-tab class="right-border">
        已处理
      </mu-tab>
    </mu-tabs>

    <!-- 设备点检任务列表 -->
    <mu-container id="container" style="height:75vh;width:100%;max-width:100%;overflow-y:scroll;overflow-x:hidden;">

    <div id="checkBillContainer" v-for="(item,index) in checkBills" :key="index">
      <div class="flex-ul" @click="goPage(item)" :style="{'background-color':(index++)%2==0?'#E8E8E8':'WHITE'}">
        <!-- 设备点检任务单信息title -->
        <div class="flex-li"><span class="colorText">任务单号：</span>{{item.taskCode}}</div>
        <div class="flex-li"><span>计划单编码：</span>{{item.mtCode}}</div>
        <div class="flex-li"><span>计划单名称：</span>{{item.mtName}}</div>
        <div class="flex-li"><span>预计维护时间：</span>{{item.mntTime}}分</div>
        <div class="flex-li" v-if="active==0"><span>计划开始时间：</span>{{item.beginDate}}</div>
        <div class="flex-li" v-if="active==0"><span>计划结束时间：</span>{{item.endDate}}</div>
        <div class="flex-li"><span>检验项模板编码：</span>{{item.chkCode}}</div>
        <div class="flex-li"><span>检验项模板名称：</span>{{item.chkCode}}</div>
        <div class="flex-li"><span>维护类型编码：</span>{{item.typeCode}}</div>
        <div class="flex-li"><span>维护类型名称：</span>{{item.typeName}}</div>

        <!-- 已处理任务单信息  -->
        <div class="flex-li" v-if="active==1">单据状态：
          <span v-if="item.taskState == '0'">编辑</span>
          <span v-if="item.taskState == '1'">审核</span>
          <span v-if="item.taskState == '2'">进行</span>
          <span v-if="item.taskState == '3'">完成</span>
        </div>
        <div class="flex-li" v-if="active==1">操作人：<span>{{item.taskPerson}}</span></div>
        <div class="flex-li" v-if="active==1">实际开始时间：<span>{{item.actualBeginDate}}</span></div>
        <div class="flex-li" v-if="active==1">实际结束时间：<span>{{item.actualEndDate}}</span></div>
        <div class="flex-li" v-if="active==1">消耗时间：<span>{{item.consumeTime}}</span></div>
        <div class="flex-li" v-if="active==1">任务结果：
          <span v-if="item.taskResult == '0'">未判定</span>
          <span v-if="item.taskResult == '1'">正常</span>
          <span v-if="item.taskResult == '2'">异常</span>
        </div>
      </div>
    </div>
    <div id="loadMoreDiv" v-if="checkBills.length >= 5 && hasMore == true" style="text-align: center; font-size: 20px;padding:.5% 1%;" @click="loadMore">
      <span>加载更多</span>
    </div>
    </mu-container>
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
  name: "UemCheckBill",
  components: {
    SafeHeader
  },
  data: () => {
    return {
      title: "设备点检单",
      workCellIds: [], //工位

      active: 0,  //tab下标
      pageNum: 1, //页码
      hasMore: true,  //是否还有更多数据
      isLoading: false, //是否正在加载中

      workOrderCode: "",  //点检单据号
      processState: 0,
      checkBills:[{ //设备点检单据数组
        taskCode: 'PO-2019120101',
        mtCode: 'WO-201903271',
        mtName: 'S30-123456',
        beginDate: '测试产品1',
        endDate: 'OP-01',
        mntTime: '2019120301',
        chkCode: '0',
        CHKname: 'lq',
        typeCode: '2019-12-02 14:00:00',
        typeName:'',
        processState: '0'
      }],

      woCode: "",//输入的执行工单号
      trackOrder: {},//派工单
      lotCode: "",//批次号
      remark: ""//备注
    };
  },
  methods: {
    scanWorkOrder(){//输入工单号查询
      this.pageNum = 1;
      this.hasMore = true;
      this.getCheckBills();
    },

    //获取检测单
    getCheckBills(flag){
      const loading = this.$loading({});

      let formData = new FormData();
      formData.append("workCellIds", this.workCellIds);
      formData.append("pageNum", this.pageNum);
      formData.append("processState", this.processState);
      formData.append("workOrderCode", this.workOrderCode);
      
      http.post({url: "productPadCommController!getSbMntTask.m",
          data: formData
        }).then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            // console.log("请求返回数据:检测单" + JSON.stringify(res.data.data));
            // let resData = res.data.data;
            let resData = JSON.parse(res.data.data);
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
        // console.log(JSON.stringify(err));
      });
    },

    //处理检测单
    goPage(item) {
      console.log(JSON.stringify(item));
      this.$root.api.api.openWin({
        name: "UemCheckBillDetail",
        url: "UemCheckBillDetail.html",
        pageParam: {
          checkBill:item,
          taskId:item.id,//点检任务单GID
          taskCode:item.taskCode,//任务单编码
          equipGid:item.equipGid,//点检设备主键
          processState:this.active //0 待处理  1 已完成
        },
        progress: {}
      });
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
    },
    handleScroll: function () {
      // 设备/屏幕高度
      let scrollObj = document.getElementById("container"); // 滚动区域
      let clientHeight = scrollObj.clientHeight;  //容器高度
      let scrollTop = scrollObj.scrollTop; // div 到头部的距离
      let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
      // 距离底部小于屏幕5%高度时加载一次
      let bottomOfWindow = (scrollTop+clientHeight)/scrollHeight > 0.95;
      if (bottomOfWindow && this.isLoading == false && this.hasMore == true) {
          this.isLoading = true
          this.loadMore();
      }  
    }
  },
  mounted: function() {
    //绑定的工位Gid
    let workCellInfo = storage.getObject('workCells') || [];
    workCellInfo.forEach(item => {
      if(item.id && item.id.length > 0) this.workCellIds.push(item.id);
    });

    this.getCheckBills();//初始化列表
    //this.scroll();//滚动加载数据
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
  }
};
</script>
<style scoped lang="scss">
// .app {
//   overflow: hidden;
//   background-color: white;
//   min-height: 100vh;
// }

.app {
  overflow: hidden;
  //background-color: #f0eff4;
  min-height: 100vh;
  max-height: 100vh;
}


// 搜索框样式
/deep/.mu-list{
  height: 7rem;
}
/deep/ .mu-item{
  width:60%;
  height:4rem;
  /deep/  .mu-item-content{
    min-width:50%;
   /deep/ .mu-input{
      width:50%;
      margin-bottom: 0px;
      padding-bottom: 0px;
    }
  }
}

// 表格切换样式
.mu-tabs {
  height: 10%;
  border-radius: 15px;
  color: rgb(33, 100, 243);
  border: 1px solid rgb(33, 100, 243);
  /deep/.mu-ripple-wrapper {
    border-right: 1px solid rgb(33, 100, 243);
  }
  //最后一栏去掉有边框
  .right-border /deep/.mu-ripple-wrapper{
    border-right: none;
  }
  /deep/.mu-tab-active {
    background: rgb(33, 100, 243);
  }
}

//待处理任务样式
.flex-ul{
  display: flex;
  flex-direction: row;//排列方式
  flex-wrap: wrap;//换行
  justify-content:flex-start;
  align-items:center;//纵轴上的对齐方式
  background-color: white;
  overflow: hidden;
  padding: 10px 10px;
  margin:10px 5px 5px;
  height: 10rem;
  .flex-li {
    width:  25%;
    height: 25%;
    font-size: 1.2rem;
    text-align:left;
    .colorText{
      color: #1abc9c;
      font-size: 1.2rem;
      font-weight: bold;
    }
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