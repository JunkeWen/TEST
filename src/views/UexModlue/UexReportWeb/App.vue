<template>
  <div id="app" style="width:100%;height:2730px;">
   <!-- <safe-header v-bind="{title:'生产作业',color:'#fff',textColor:'#000',isBack:true,backIconColor: '#2cb69a',fixedTop:true}"></safe-header>-->

      <!-- 标题头 -->
      <div id="head" style="height:8%;">
        <mu-flex class="head-wrapper" align-items="center">
              <mu-flex class="head-demo" style="width:15%;" justify-content="center" fill>
                <span style="width:95%;position:relative;right:20%;">账号:  {{myUser}}</span>
              </mu-flex>
              <mu-flex class="head-demo" style="width:35%;" justify-content="center" fill>
                  <span style="width:20%;">班次:  {{workClass.workClassCode}}</span>
                  <!-- <span class="select-wrapper" style="width:15%;height:60%;">
                    <mu-select  v-model="workClass.workClassId" full-width>
                      <mu-option v-for="item in workClassArr" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</mu-option>
                    </mu-select>
                  </span> -->
                  <span style="width:45%;">生产线:  {{workCenter.workCenterCode}}</span>
                  <!-- <span class="select-wrapper" style="width:27%;height:60%;">
                    <mu-select  v-model="workCenter.workCenterId" full-width @change="getRouteOp">
                      <mu-option v-for="item in workCenterArr" :key="item.id" :label="item.code" :value="item.id">{{item.code}}</mu-option>
                    </mu-select>
                  </span> -->
                  <span style="margin-left:1%;width:34%;text-align:left;">工位:  {{workCell.workCellCode}}</span>
                  <!-- <span class="select-wrapper" style="width:15%;height:60%;margin-right:2%;">
                    <mu-select  v-model="workCell.workCellId" full-width>
                      <mu-option v-for="item in workCellArr" :key="item.id" :label="item.name" :value="item.name"></mu-option>
                    </mu-select>
                  </span> -->
              </mu-flex>
              <mu-flex class="head-demo" style="width:19%;" justify-content="center" fill>
                  <span style="width:95%;">生产报工</span>
              </mu-flex>
              <mu-flex class="head-demo" style="width:29%;border-right:none;" justify-content="center" fill>
                  <span style="width:60%;">{{timeBox}}</span>
                  <span style="width:35%;" @click="fullScreen">全屏</span>
              </mu-flex>
        </mu-flex>
      </div>

      <!-- 为什么父元素设置相对定位?因为相对定位不会脱离文档流，别且子元素 使用绝对定位会以此作为‘最近的包含块’（参考父节点）,配合top left使用 -->
      <div id="center">
        <div id="center-left">
          <!-- 流转卡扫码 -->
          <div style="width:100%;height:15%;border:none;">
            <mu-text-field class="input-radius" ref="woInputVal" v-model="woInputVal" placeholder="流转卡扫码......" @keyup.enter="queryCurWork"></mu-text-field><br/>
          </div>
          <!-- 工单详细信息 -->
          <div style="width:100%;height:85%;border:none;">
            <fieldset style="height: 99%;">
              <legend class="mylegend">当前任务</legend>
              <div style="width:98%;height:75%;padding:.5% 1%;background-color:LightGrey;">
                <mu-flex class="flex-wrapper" align-items="center">
                      <mu-flex class="flex-demo" justify-content="center" fill><span>产品编码</span>
                         <mu-text-field v-model="form.mrlCode" :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>产品名称</span>
                         <mu-text-field v-model="form.mrlName" :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>计划数量</span>
                         <mu-text-field v-model="form.planQty" :disabled="true"></mu-text-field>
                      </mu-flex>
                </mu-flex>
                <mu-flex class="flex-wrapper" align-items="center">
                      <mu-flex class="flex-demo" justify-content="center" fill><span>工单号</span>
                         <mu-text-field v-model="form.workOrderCode" :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>派工单号</span>
                         <mu-text-field v-model="form.dispatchCode" :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>所在工序</span>
                         <mu-text-field v-model="form.opCode" :disabled="true"></mu-text-field>
                      </mu-flex>
                </mu-flex>
                <mu-flex class="flex-wrapper" align-items="center">
                      <mu-flex class="flex-demo" justify-content="center" fill><span>任务状态</span>
                         <mu-text-field v-model="form.disCodeState" :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>排程开始时间</span>
                         <mu-text-field v-model="form.plannedStartTime"  :disabled="true"></mu-text-field>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span>排程结束时间</span>
                         <mu-text-field v-model="form.plannedFinishTime" :disabled="true"></mu-text-field>
                      </mu-flex>
                </mu-flex>
              </div>
              <div class="button-db" style="width:98%;height:16%;margin-top:.2%;">
                  <mu-button  color="primary"   :disabled="start"  @click="toggleStatus('start')">开工</mu-button>
                  <mu-button  color="secondary" :disabled="report"  @click="toggleStatus('report')">报工</mu-button>
                  <mu-button  color="success" :disabled="finish" @click="toggleStatus('finish')">完工</mu-button>
                  <mu-button color="warning"  :disabled="pause" @click="toggleStatus('pause')">停工</mu-button>
                  <mu-button color="info"     :disabled="back" @click="toggleStatus('back')">复工</mu-button>
                  <mu-button :disabled="ZZP_SMJ"  @click="addCheckBill('ZZP_SJ')">首检</mu-button>
                  <mu-button :disabled="ZZP_SMJ"  @click="addCheckBill('ZZP_MJ')">末检</mu-button>
              </div> 
            </fieldset>
          </div>
        </div>
        <!-- 按钮操作区域 -->
        <div id="center-right">
            <mu-flex class="but-xy" justify-content="center" align-items="center" fill>
                <mu-button  color="primary" @click="toggleStatus('openMaterRack')">查看文件</mu-button>
                <mu-button  color="secondary" @click="toggleStatus('openReportInfo')">报工记录</mu-button>
            </mu-flex>
            <mu-flex class="but-xy" justify-content="center" fill>
                <mu-button  color="success" @click="toggleStatus('openOpBindMrl')">信息录入</mu-button>
                <mu-button  color="warning"  @click="toggleStatus('openTrans')">料车转运</mu-button>
            </mu-flex>
            <mu-flex class="but-xy" justify-content="center" fill>
                <mu-button disabled>异常发起</mu-button>
                <mu-button disabled>异常关闭</mu-button>
            </mu-flex>
        </div>
      </div>

      <!-- 待处理任务 -->
      <div style="height:32%;">
          <fieldset style="width:100%;height: 95%; margin-top: 20px;">
            <legend class="mylegend">待处理任务</legend>
            <!-- 待处理数据  表格数据展示-->
            <mu-data-table  height="90%" :loading="true" :columns="columns" :sort.sync="sort" @sort-change="handleSortChange" :data="list"  @row-click="goBack">
                <template slot-scope="scope" class="textOverflow">
                  <td class="is-center other-type">{{scope.$index+1}}</td>
                  <td class="is-center other-type">{{scope.row.workOrderCode}}</td>
                  <td class="is-center other-type">{{scope.row.mrlCode  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.mrlName  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.planQty  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.opCode   | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.effectiveQty}}</td>
                  <td class="is-center other-type">{{scope.row.discardQty}}</td>
                  <td class="is-center other-type">{{scope.row.disCodeState}}</td>
                  <td class="is-center other-type">{{scope.row.isTransport}}</td>
                  <td class="is-center other-type">{{scope.row.scheduledBeginDate | ellipsis}}</td>
                  <td class="is-center other-type" @click="toggleStatus('openMaterRack')">
                    <mu-button color="Gray" style="width:80%;height:70%;border-radius:15px;">{{scope.row.mrlPostion | ellipsis}}</mu-button>
                  </td>
                </template>
            </mu-data-table>          
          </fieldset>
      </div>
      <!-- 消息提示窗 -->
      <div style="height:15%;">
          <fieldset style="height: 90%; margin: 10px auto;padding:10px auto;">
            <legend class="mylegend">消息提醒</legend>
            <div id="messageInfo">
                <p v-if="alterMsg.color === 0" style="color:#008B00">{{alterMsg.msg}}</p>
                <p v-if="alterMsg.color === 1" style="color:red">{{alterMsg.msg}}</p>
            </div>
          </fieldset>
      </div>

<!-- 工位选择弹框 -->
      <!-- <div class="mu-dialog" v-drag v-if="openOpCode">
        <div class="mu-dialog-title"><span>工位选择</span></div>
        <div class="mu-dialog-body">
            <div class="button-db" style="width:98%;height:16%;margin-top:.2%;">
                <mu-button v-for="(item,index) in bindMrls" :key="index"  color="primary"  @click="form.opCode=item.id">{{item.codename}}</mu-button>
            </div>
        </div>
     </div> -->


<!-- 报工页面弹窗 -->
      <!-- <mu-dialog title="报工采集" width="31%" max-width="60%" :open.sync="openAlert"> -->
       <div class="mu-dialog" v-drag v-if="openAlert">
        <div class="mu-dialog-title"><span>报工采集</span></div>
        <div class="mu-dialog-body">
          <!-- 按钮 -->
          <div class="button-db" style="height:15%;">
            <mu-button slot="actions" color="primary" @click="doSubmit('report')" style="width:30%;height:70%;border-radius:25px;margin:auto auto;">提交</mu-button>
            <mu-button slot="actions" color="primary" @click="closeAlertDialog" style="width:30%;height:70%;border-radius:25px;margin:auto auto;">重置</mu-button>
            <mu-button slot="actions" color="secondary" @click="closeAlertDialog('report')" style="width:30%;height:70%;border-radius:25px;margin:auto auto;">关闭</mu-button>
          </div>
          <!-- 报工输入信息 -->         
          <div class="input-form">
            <span class="input-lable">良品数:</span>
            <mu-text-field  v-model="form.goodQty" type="number" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">报废数:</span>
            <mu-text-field  v-model="form.discardQty" type="number" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">工单号:</span>
            <mu-text-field  :disabled="true" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">产品编码:</span>
            <mu-text-field  :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">派工单号:</span>
            <mu-text-field  :disabled="true" v-model="form.dispatchCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
        </div>
      </div> 
      <div class="mu-overlay" v-if="openAlert==true || openTrans==true  || openMaterRack==true || openReportInfo==true || openOpBindMrl==true" ></div>
      <!-- </mu-dialog> -->

<!-- 料车转运输入框 -->
      <div class="mu-dialog" v-drag style="width:60%;left:20%;" v-if="openTrans">
        <div class="mu-dialog-title"><span>绑定料车转运</span></div>
        <div class="mu-dialog-body">
          <!-- 按钮 -->
          <div class="button-db" style="height:15%;">
            <mu-button slot="actions" color="primary" @click="saveMrlTransport()" style="width:20%;height:70%;border-radius:25px;margin-left:16%;">确定</mu-button>
            <mu-button slot="actions" color="primary" @click="restTranSport()" style="width:20%;height:70%;border-radius:25px;margin:auto auto;">重置</mu-button>
            <mu-button slot="actions" color="secondary" @click="closeAlertDialog('openTrans')" style="width:20%;height:70%;border-radius:25px;margin-right:16%;">关闭</mu-button>
          </div>
          <!-- 转运绑定料车料架 -->         
          <div class="input-transform">
            <span class="input-lable">料架号:</span>
            <mu-text-field  style="width:78%;height:12%;" v-model="form.materRackCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">工单号:</span>
            <mu-text-field  :disabled="true" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field>
            <span class="input-lable">派工单号:</span>
            <mu-text-field  :disabled="true" v-model="form.dispatchCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">产品编码:</span>
            <mu-text-field  :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field>
            <span class="input-lable">产品名称:</span>
            <mu-text-field  :disabled="true" v-model="form.mrlName" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">批次号:</span>
            <mu-text-field  :disabled="true" v-model="form.lotCode" type="text" underline-color="#2cb69a"></mu-text-field>
            <span class="input-lable">工序:</span>
            <mu-text-field  :disabled="true" v-model="form.opCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
            <span class="input-lable">计划数量:</span>
            <mu-text-field  :disabled="true" v-model="form.planQty" type="number" underline-color="#2cb69a"></mu-text-field>
            <span class="input-lable">转运数量:</span>
            <mu-text-field  v-model="form.transQty" type="number" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
        </div>
      </div>

<!-- 料架信息查看 -->
      <div class="mu-dialog" v-drag style="width:60%;left:20%;" v-if="openMaterRack">
        <div class="mu-dialog-title">
            <span style="width:92%;margin-left:8%;">料架信息查看</span>
            <mu-button slot="actions" flat color="rgb(190, 187, 187)" @click="closeAlertDialog('openMaterRack')" style="color:#f0f0f0;width:6%;height:60%;margin-right:2%;border:none;font-size:1.6em;">X</mu-button>
        </div>
        <div class="mu-dialog-body">
          <!-- 按钮 -->
          <!-- <div class="button-db" style="height:15%;"></div> -->
          <!-- 料架信息展示 -->         
          <div class="input-transform" style="height:100%;height:100%;">
            <mu-data-table height="100%"  :rowStyle="{height:'150px'}"  :columns="materRackcolumns" :sort.sync="sort" @sort-change="handleSortChange" :data="materRacks">
                <template slot-scope="scope" class="textOverflow">
                  <td class='is-center other-type'>{{scope.$index+1}}</td>
                  <td class="is-center other-type">{{scope.row.workOrderCode}}</td>
                  <td class="is-center other-type">{{scope.row.mrlCode  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.mrlName  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.planQty  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.lotCode   | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.transQty}}</td>
                  <td class="is-center other-type">{{scope.row.materRackCode | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.storeHouseCode | ellipsis}}</td>
                </template>
            </mu-data-table>          
          </div>
        </div>
      </div>

<!-- 报工记录信息查看-->
      <div class="mu-dialog" v-drag style="width:60%;left:20%;" v-if="openReportInfo">
        <div class="mu-dialog-title">
            <span style="width:92%;margin-left:8%;">报工历史记录</span>
            <mu-button slot="actions" flat color="rgb(190, 187, 187)" @click="closeAlertDialog('openReportInfo')" style="color:#f0f0f0;width:6%;height:60%;margin-right:2%;border:none;font-size:1.6em;">X</mu-button>
        </div>
        <div class="mu-dialog-body">
          <!-- 按钮 -->
          <!-- <div class="button-db" style="height:15%;"></div> -->
          <!-- 报工信息展示 -->         
          <div class="input-transform" style="height:100%;height:100%;">
            <mu-data-table  height="100%"  :columns="historyInfocolumns" :sort.sync="sort" @sort-change="handleSortChange" :data="list">
                <template slot-scope="scope" class="textOverflow">
                  <td class='is-center other-type'>{{scope.$index+1}}</td>
                  <td class="is-center other-type">{{scope.row.workOrderCode}}</td>
                  <td class="is-center other-type">{{scope.row.mrlCode  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.mrlName  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.planQty  | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.opCode   | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.effectiveQty}}</td>
                  <td class="is-center other-type">{{scope.row.discardQty | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.disCodeState | ellipsis}}</td>
                  <td class="is-center other-type">{{scope.row.scheduledBeginDate | ellipsis}}</td>
                </template>
            </mu-data-table>          
          </div>
        </div>
      </div> 

<!-- 信息录入：展示工序生产所需耗材/物料   -->
      <div class="mu-dialog" v-drag style="left:15%;top:10%;width:70%;height:70%;" v-if="openOpBindMrl">
       <!-- 标题头 -->
        <div class="mu-dialog-title" style="height:10%;">
          <span>信息录入</span>  
        </div>
        <!-- 产品信息 -->
        <div style="width:100%;height:25%;border:none;">
          <fieldset>
            <legend class="mylegend">产品信息</legend>
            <div style="width:100%;height:90%;padding:.5% 1%;background-color:LightGrey;padding-top:0px;">
              <mu-flex class="flex-wrapper" style="height:50%;"  align-items="center">
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>工单号</span>
                      <mu-text-field v-model="form.workOrderCode"></mu-text-field>
                  </mu-flex>
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>产品编码</span>
                      <mu-text-field v-model="form.mrlCode" ></mu-text-field>
                  </mu-flex>
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>产品名称</span>
                      <mu-text-field v-model="form.mrlName"></mu-text-field>
                  </mu-flex>
              </mu-flex>
              <mu-flex class="flex-wrapper" style="height:50%;"  align-items="center">
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>工序</span>
                      <mu-text-field v-model="form.opCode"></mu-text-field>
                  </mu-flex>
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>计划数量</span>
                      <mu-text-field v-model="form.planQty"></mu-text-field>
                  </mu-flex>
                  <mu-flex class="flex-demo" style="width:33%;" justify-content="center" fill><span>合格数量</span>
                      <mu-text-field v-model="heGeQty"></mu-text-field>
                  </mu-flex>
              </mu-flex>
            </div>
          </fieldset>
        </div>
        <!-- 按钮 -->
        <mu-divider></mu-divider>
        <div class="button-db" style="height:10%;">
          <mu-button slot="actions" color="primary" @click="saveHistoryInfo()" style="width:14%;height:60%;border-radius:25px;margin-left:16%;">保存</mu-button>
          <mu-button slot="actions" color="primary" @click="addRows" style="width:14%;height:60%;border-radius:25px;margin:auto auto;">添加行</mu-button>
          <mu-button slot="actions" color="primary" @click="Reset" style="width:14%;height:60%;border-radius:25px;margin:auto auto;">重置</mu-button>
          <mu-button slot="actions" color="secondary" @click="closeAlertDialog('openOpBindMrl')" style="width:14%;height:60%;border-radius:25px;margin-right:16%;">关闭</mu-button>
        </div>
        <!-- 原材料信息 -->
        <div id="center" style="height:55%;">
          <div id="center-left" style="width:75%;">
            <fieldset style="height: 99%;">
               <legend class="mylegend">原材料信息</legend>
                 <div style="height:90%;padding:.5% 1%;background-color:LightGrey;overflow-y: scroll;overflow-x: hidden;">
                  <mu-flex v-for="(item,index) in bindMrls" :key="index" class="flex-wrapper" style="height:20%;" align-items="center">
                        <mu-flex class="flex-demo" style="width:21%;" justify-content="center" fill><span style="width:48%;font-size:50px;">材料批次</span>
                          <mu-text-field style="width:50%;" v-model="item.lotCode" @blur="refresh(item,index)"></mu-text-field>
                        </mu-flex>
                        <mu-flex class="flex-demo"  style="width:21%;" justify-content="center" fill><span style="width:48%;font-size:50px;">材料编码</span>
                          <mu-text-field style="width:50%;" v-model="item.mrlCode" @blur="refresh(item,index)"></mu-text-field>
                        </mu-flex>
                        <mu-flex class="flex-demo"  style="width:21%;" justify-content="center" fill><span style="width:48%;font-size:50px;">材料数量</span>
                          <mu-text-field style="width:50%;" v-model="item.qty" @blur="refresh(item,index)"></mu-text-field>
                        </mu-flex>
                        <mu-flex class="flex-demo"  style="width:21%;" justify-content="center" fill><span style="width:48%;font-size:50px;">材料单位</span>
                          <mu-text-field style="width:50%;" v-model="item.unit" @blur="refresh(item,index)"></mu-text-field>
                        </mu-flex>
                        <!-- 删除按钮图标 -->
                        <mu-icon  @click="deleteRow(item,index)" style="width:4%;padding:0px;margin-top:-2%;" right value="delete" size="100"></mu-icon>
                  </mu-flex>
                </div>
            </fieldset>
          </div>
          <div id="center-right"  style="width:25%;">
            <fieldset style="height: 99%;">
               <legend class="mylegend">资源信息</legend>
                <div style="height:90%;background-color:LightGrey;margin-bottom:0px;">
                  <!-- 资源信息 -->         
                  <div class="input-form" style="height:80%;">
                    <span class="input-lable" style="width:32%;margin-left:2%;">操作人编码:</span>
                    <mu-text-field  :disabled="true" v-model="person" type="text" underline-color="#2cb69a"></mu-text-field><br/>
                    <span class="input-lable" style="width:32%;margin-left:2%;">设备编码:</span>
                    <mu-text-field  v-model="form.equip" type="text" underline-color="#2cb69a"></mu-text-field><br/>
                    <span class="input-lable" style="width:32%;margin-left:2%;">模具编码:</span>
                    <mu-text-field  v-model="form.tool" type="text" underline-color="#2cb69a"></mu-text-field><br/>
                  </div>
                </div>
            </fieldset>
          </div>
        </div>
      </div> 

  </div>
</template>
<script>
import http from "../../../utils/http.js";
import SafeHeader from "../../../components/safeHeader";
import storage from "../../../utils/storage";
import "muse-ui-loading/dist/muse-ui-loading.css";
import "muse-ui-message/dist/muse-ui-message.css";
import Loading from "muse-ui-loading";
import Toast from "muse-ui-toast";
import Message from "muse-ui-message";
// 托拽组件
import drag from "../../../utils/drag.js";

let isFullScreen=false;

export default {
  name: "uexReportWeb",
  components: {
    SafeHeader,
  },
  filters: {//定义过滤器
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0,4)+'...'+value.slice(6,10);
      }
      return value
      }
  },
  data ()  {
    return {
        ZZP_SMJ:true,//在制品首末检查按钮禁用
        openAlert:false,//生产报工
        openTrans:false,//料车转运
        openMaterRack:false,//料架信息查看   
        openReportInfo:false,//报工记录
        openOpBindMrl:false,//工序绑定物料信息
        list:[],//【待处理任务】表格数据
        materRacks:[],//料架位置【查看】
        bindMrls:[{lotCode:'',mrlCode:'',qty:'',unit:''}],//【原材料】|【资源】信息录入

        //-------主页面数据--------
        myUser:"",//标题头用户信息
        workClassArr:[],//班次数组
        workCenterArr:[],
        workCellArr:[],
        workClass: {workClassId:"" ,workClassCode:""},//班次
        workCenter:{workCenterId:"",workCenterCode:""},//工作中心
        workCell:  {workCellId:"",workCellCode:""},//绑定的工位ID/CODE

        //流转卡扫码
        woInputVal:'',//工单号 或者为 料架号
        dispatchId:'',//料架位置查看按钮
        person:"",//信息录入: 人员
        heGeQty:0,//信息录入：合格数量

        timeBox:"0000-00-00",
        form: {
          id:"",//主键
          mrlCode: "",//产品编码
          mrlName: "",
          planQty:"",//计划数量
          workOrderCode: "",
          dispatchCode: "",
          opCode:"",//所在工序
          disCodeState: "",//派工状态
          plannedStartTime: "",//排程开始时间
          plannedFinishTime:"",//排程结束时间

          goodQty:0,//生产报工:良品数量/不良品/报废数量
          badQty:0,
          discardQty:0,

          materRackCode:'',//料架号
          lotCode:"",//批次
          transQty:0,//转运数量
          storehouseCode:"",//仓库号

          equip:"",//设备
          tool:"",//磨具
        },
        start:true,//开工按钮
        report:true,//报工
        finish:true,//完工
        pause:true,
        back:true,
        sort: {
          name: 'planQty',
          order: 'asc'
        },
        columns: [
          { title: '序号', name: 'seqNum', align: 'center', width:300,sortable: true,class:'headColumns'},
          { title: '工单号', name: 'workOrderCode', align: 'center', width:700,sortable: true,class:'headColumns'},
          { title: '产品编码', name: 'mrlCode',align: 'center', width:600,sortable: true ,class:'headColumns'},
          { title: '产品名称', name: 'mrlName',align: 'center', width:600,sortable: true ,class:'headColumns'},
          { title: '计划数量', name: 'planQty',align: 'center', width:500,sortable: true ,class:'headColumns'},
          { title: '工序', name: 'opCode', align: 'center', width:600,sortable: true,class:'headColumns' },
          { title: '合格数量', name: 'effectiveQty',align: 'center',width:350, sortable: true,class:'headColumns' },
          { title: '报废数量', name: 'discardQty',align: 'center', width:350,sortable: true ,class:'headColumns'},
          { title: '任务状态', name: 'disCodeState',align: 'center',width:350, sortable: true ,class:'headColumns'},
          { title: '已转运', name: 'isTransport',align: 'center',width:600, sortable: true ,class:'headColumns'},
          { title: '排程开始时间', name: 'scheduledBeginDate',align: 'center',width:600, sortable: true ,class:'headColumns'},
          { title: '料架位置', name: 'mrlPostion',align: 'center', width:450,sortable: true ,class:'headColumns'},
      ],
      historyInfocolumns: [
          { title: '序号', name: 'seqNum', align: 'center', width:300,sortable: true,class:'headColumns'},
          { title: '工单号', name: 'workOrderCode', align: 'center', width:700,sortable: true,class:'headColumns'},
          { title: '产品编码', name: 'mrlCode',align: 'center', width:600,sortable: true ,class:'headColumns'},
          { title: '产品名称', name: 'mrlName',align: 'center', width:600,sortable: true ,class:'headColumns'},
          { title: '计划数量', name: 'planQty',align: 'center', width:500,sortable: true ,class:'headColumns'},
          { title: '工序', name: 'opCode', align: 'center', width:600,sortable: true,class:'headColumns' },
          { title: '合格数量', name: 'effectiveQty',align: 'center',width:350, sortable: true,class:'headColumns' },
          { title: '报废数量', name: 'discardQty',align: 'center', width:350,sortable: true ,class:'headColumns'},
          { title: '任务状态', name: 'disCodeState',align: 'center',width:350, sortable: true ,class:'headColumns'},
          { title: '排程开始时间', name: 'scheduledBeginDate',align: 'center',width:600, sortable: true ,class:'headColumns'},
      ],
      materRackcolumns: [
        { title: '序号', name: 'seqNum', align: 'center', width:200,sortable: true,class:'headColumns'},
          { title: '工单号', name: 'workOrderCode', align: 'center', width:600,sortable: true,class:'headColumns'},
          { title: '产品编码', name: 'mrlCode',align: 'center', width:500,sortable: true ,class:'headColumns'},
          { title: '产品名称', name: 'mrlName',align: 'center', width:500,sortable: true ,class:'headColumns'},
          { title: '计划数量', name: 'planQty',align: 'center', width:300,sortable: true ,class:'headColumns'},

          { title: '批次号', name: 'lotCode',align: 'center',width:600, sortable: true,class:'headColumns' },
          { title: '转运数量', name: 'transQty',align: 'center',width:300, sortable: true ,class:'headColumns'},
          { title: '料架号', name: 'materRackCode',align: 'center',width:285, sortable: true ,class:'headColumns'},
          { title: '库位号', name: 'storehouseCode',align: 'center', width:300,sortable: true ,class:'headColumns'},
      ],
//消息提示框 color=0绿色和color=1红色
      alterMsg:{msg:"",color:0},
    };
  },
  methods: {
    fullScreen() {
      let el = document.documentElement;
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
        el.mozRequestFullScreen || el.msRequestFullscreen;
      if(!isFullScreen){
        if(typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        };
        //IE浏览器全屏方法调用
        if((rfs ==el.msRequestFullscreen) && !f_IsFullScreen()){
          window.open(location.href,'','fullscreen=1');
        }
        isFullScreen=true;
      }else{
        //判断浏览器样式
  			if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if(document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if(document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				if(typeof cfs != "undefined" && cfs) {
					cfs.call(el);
				} 
				//IE浏览器调用
				if((rfs ==el.msRequestFullscreen)){
					 window.close();
        }
        isFullScreen=false;
      }
      //然后调用focus方法
      this.$nextTick(()=>{
          this.$refs.woInputVal.focus();  //也可单独使用
      })
    },
    //报工按钮点击弹窗
    openAlertDialog (operState) {
      if(operState=='report'){
        this.openAlert = true;
      }else if(operState=='openTrans'){
        this.openTrans=true;
      }else if(operState=='openMaterRack'){
        this.openMaterRack=true;
        this.queryShelfPostion();
      }else if(operState=='openReportInfo'){
        this.openReportInfo=true;
      }else if(operState=='openOpBindMrl'){
        this.openOpBindMrl=true;
      }
    },
    closeAlertDialog (operState) {
      if(operState=='report'){
        this.openAlert = false;
      }else if(operState=='openTrans'){
        this.openTrans=false;
      }else if(operState=='openMaterRack'){
        this.openMaterRack=false;
      }else if(operState=='openReportInfo'){
        this.openReportInfo=false;
      }else if(operState=='openOpBindMrl'){
        this.openOpBindMrl=false;
      }
    },
     //表格改变排序
    handleSortChange ({name, order}) {
      this.list = this.list.sort((a, b) => order === 'asc' ? a[name] - b[name] : b[name] - a[name]);
    },
    //料架位置   表格查找带回
    goBack(index, row, event) {
       this.dispatchId=row.id;
    },
    //开工报工等按钮点击事件
    toggleStatus(operState) {
      //派工单状态
      let woState=this.form.disCodeState;
      //如果为禁用按钮,则只改变按钮状态
      if(operState =='disableButton'){
        this.disableButton(woState);
        // Toast.info({message:'当前派工任务已完工',close: false,position: "bottom"});
        return;
      }else{
        //如果是报工按钮点击,则打开dialog弹窗
        if(operState=='report' || operState=='openTrans' || operState=='openMaterRack' || operState=='openReportInfo' || operState=='openOpBindMrl'){
          this.openAlertDialog(operState);
        }else{
          this.doSubmit(operState);
        }
      }
    },

    //开工 复工 停工
    doSubmit(type) {
        //报工时校验填报 良品/报废 数量
        if(type=='report'){
          if(this.form.workOrderCode==""){
            this.alterMsg.msg="请先扫码流转卡";
            this.alterMsg.color=parseInt(1);
            return;
          }
          if(this.form.goodQty==undefined || this.form.discardQty==undefined){//良品数量 && 不良品数量
            // Toast.error({message: '请先输入良品数和报废数量',close: false,position: "bottom"});
            this.alterMsg.msg="请先输入良品数和报废数量";
            this.alterMsg.color=parseInt(1);
            return;
          }else if(parseInt(this.form.goodQty) + parseInt(this.form.discardQty)>parseInt(this.form.planQty)){
            // Toast.error({message: '良品('+this.form.goodQty+')+报废('+this.form.discardQty+')数必须小于计划量('+this.form.planQty+')',close: false,position: "bottom"});
            this.alterMsg.msg='良品('+this.form.goodQty+')+报废('+this.form.discardQty+')数必须小于计划量('+this.form.planQty+')';
            this.alterMsg.color=parseInt(1);
            return;
          }
        }

        // 请求参数:获取工位
        let form = new FormData();
        form.append("workCellId", this.workCell.workCellId);//绑定的工位 
        form.append("workCellCode", this.workCell.workCellCode);
        form.append("effectiveQty", this.form.goodQty);//良品数量
        form.append("uneffectiveQty", this.form.badQty);//不良品数量
        form.append("discardQty", this.form.discardQty);//报废数量
        form.append("type",type );//操作类型

        //对派工操作时[开工/完工/暂停/报工],记录工时
        form.append("uexpTrackOrderId", this.form.id);
        form.append("disCodeState", this.transferDisState(type));//this.form.disCodeState
        form.append("workOrderCode", this.form.workOrderCode);
        form.append("dispatchCode", this.form.dispatchCode);
        form.append("myUser", this.myUser);

        // const loading = Loading({text: '加载中...',size: 60,});

        // 发送请求:获取待响应的任务  
        http.post({ url: "productPadCommController!doSubmit.m", data: form })
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
            //按钮的启用和禁用
              if(type=='start'){
                this.disableButton('已开工');
                this.form.disCodeState='已开工';
              }else if(type=='back'){
                this.disableButton('复工');
                this.form.disCodeState='已开工';
              }else if(type=='pause'){
                this.disableButton('暂停');
                this.form.disCodeState='暂停';
              }else if(type=='finish'){
                this.disableButton('完工');
                this.form.disCodeState='完工'; 
                //调用主页面监听
                // this.$root.api.api.sendEvent({name: 'refreshReportWeb',extra: {} });
                //this.$root.api.api.closeWin();  
              }else{
                this.form.disCodeState='报工'; 
                this.openAlert=false;
              }
          }
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
        })
        .finally(e => {
          // loading.close();
        });             
    },
    transferDisState(type){
      let disNum=0;
      if (type=="start" || type=="report") {
        disNum = "1";
      } else if (type=="back") {
        disNum = "10";//开始操作类型:点击复工按钮  --新创建开工【工时数据】
      } else if (type=="pause") {
        disNum = "2";
      } else if (type=="finish") {
        disNum = "3";
      }
      return disNum;
    },

    //新增检测单
    addCheckBill(operType){
      let data = qs.stringify({
        trackOrderId: this.form.id,//派工单ID
        chkTypeCode: operType,//检测类型:首检 末检
        lotCode: '',
        remark: '',
      });
      http.post({url: "productPadCommController!addCheckBillByReport.m",data: data})
       .then(res => {
          if(loading) loading.close();
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = res.data.data;
            if(resData == "success"){
              // Toast.success({message: "提交成功!", close: false});
            }
            //提示框消息展示
            this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
            this.alterMsg.color=parseInt(res.data.erroCode);
          }
      })
      .finally(e => {
        // loading.close();
      }); 
    },

    //添加行
    addRows(){
      // let size=this.bindMrls.length+1;
      let map=new Map();
      // map["lotCode"]="";
      // map["mrlCode"]="";
      // map["qty"]="";
      // map["unit"]="";
      map.set("lotCode","");
      map.set("mrlCode","");
      map.set("qty","");
      map.set("unit","");
      this.bindMrls.push(map);
    },

    //刷新行
    refresh(item,index){
      let map=new Map();
      map["lotCode"]=item.lotCode;
      map["mrlCode"]=item.mrlCode;
      map["qty"]=item.qty;
      map["unit"]=item.unit;
      // console.log("---"+item.lotCode+"--"+item.mrlCode+"----"+item.qty+"------"+item.unit+"-----");
      this.bindMrls[index]=map;
      //解决更新数组之后,试图不同步的问题【还可以时使用 数组的push splice方法新增或删除元素解决】
      this.bindMrls.sort();
    },

    //删除行
    deleteRow(item,index){
        this.bindMrls.splice(index,1); 
    },
    //重置行
    Reset(){
      this.bindMrls=[{lotCode:'',mrlCode:'',qty:'',unit:''}];

    },

//禁用按钮状态
    disableButton(woState){   
      console.log("====="+woState+"=======");
      if(woState=='待开工'){
        this.start=false;//开工
        this.report=true;
        this.pause=true;
        this.finish=true;
        this.back=true;
        this.ZZP_SMJ=true;//首末检
        return;
      }else if(woState=='已开工' || woState=='报工' || woState=='复工'){
        this.start=true;
        this.report=false;//报工
        this.pause=false;//停工
        this.finish=false;//完工
        this.back=true;
        this.ZZP_SMJ=false;//首末检
        return;
      }else if(woState=='完工'){
        this.start=true;
        this.report=true;
        this.finish=true;
        this.pause=true;
        this.back=true;
        this.ZZP_SMJ=true;//首末检
      }else if(woState=='暂停'){
        this.start=true;
        this.report=true;
        this.finish=true;
        this.pause=true;
        this.back=false;//复工
        this.ZZP_SMJ=false;//首末检
      }
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
          }else{
            Toast.error({message: res.data.msg,close: false,position: "bottom"});
            return;
          }
        });
    },
// 发送请求:获取工序  
    // getRouteOp(){
    //     // 请求参数:获取登录人
    //     let form =this.initParams;
    //     http.post({ url: "productPadCommController!getRouteOp.m", data: form })
    //     .then(res => {
    //       if(res.status == 200  && res.data.erroCode == 0){
    //           let resData = JSON.parse(res.data.data);
    //           console.log(res.data.data+"工序 ===="+resData);
    //           this.workCellArr = resData;

    //           this.workCell.workCellId=resData[0].id;
    //           this.workCell.workCellCode=resData[0].code;
    //       }else{
    //         Toast.error({message: res.data.msg,close: false,position: "bottom"});
    //         return;
    //       }
    //     });
    // },
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
    // 获取当前的待处理任务
    queryCurWork(){
      let formData = new FormData();
      formData.append("workCellId", this.workCell.workCellId);//工位

      if(this.woInputVal.indexOf('WO')!=-1){//工单号
        formData.append("woInputVal", this.woInputVal.trim());//工单号
      }else if(this.form.workOrderCode==''){//提示框消息展示
        this.alterMsg.msg=('提示:请先扫码流转卡');
        this.alterMsg.color=parseInt(1);
        return;
      }else{
        formData.append("woInputVal", this.form.workOrderCode);//工单号
        formData.append("woInputVal2", this.woInputVal.trim());//解绑的料架号
      }

      http.post({ url: "productPadCommController!queryCurWork.m", data: formData})
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              //清空VALUE,保留KEY
              Object.keys(this.form).forEach(key => (this.form[key] = ''));

              let resData = JSON.parse(res.data.data);
              //工单已扫码，流转卡未扫
              if(formData.get("woInputVal") && !formData.get("woInputVal2")){
                if(resData.length!=0){
                  this.form=resData[0];
                  this.disableButton(this.form.disCodeState);
                }
              }
          }
          this.woInputVal="";//清空
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
        });
    },
  // 发送请求:获取待处理任务  
    queryWaitWork(){
      let form = new FormData();
      form.append("workCellId", this.workCell.workCellId);//工位
      form.append("woInputVal", this.woInputVal);//工单号

      http.post({ url: "productPadCommController!queryWaitWork.m", data: form})
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              let resData = JSON.parse(res.data.data);
              if(resData.length!=0){
                this.list=resData;
              }
          }
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
        });
    },
    //信息录入 保存
    saveHistoryInfo(){
      //数据校验
      if(!this.form.workOrderCode){
          this.alterMsg.msg="没有当前任务,请先扫码";
          this.alterMsg.color=1;
          return;
      }
      if(!this.heGeQty && parseInt(this.heGeQty)>parseInt(this.planQty)){
          this.alterMsg.msg="请先填写有效的合格数量";
          this.alterMsg.color=1;
          return;
      }
      if(!this.bindMrls || this.bindMrls.length==0){
          this.alterMsg.msg="请先填写原材料信息";
          this.alterMsg.color=1;
          return;
      }else{
        //some every  forEach都无法结束循环，可以用正常的JS语法去解决
          let falg=false;
          this.bindMrls.forEach(item => {
            if (!item.lotCode || !item.mrlCode || !item.qty || !item.unit) {
              falg=true;
              return;
            }
          })
          if(falg){
            this.alterMsg.msg="请补充完整原材料信息";
            this.alterMsg.color=1;
            return;
          }
      }

      if(!this.person || !this.form.tool || !this.form.equip){
          this.alterMsg.msg="请先填写资源信息";
          this.alterMsg.color=1;
          return;
      }

      let form = new FormData();
      form.append("dispatchId", this.form.id);//派工单ID
      form.append("bindMrls", JSON.stringify(this.bindMrls));
      form.append("person", this.person);
      form.append("equip", this.form.equip);
      form.append("tool", this.form.tool);

      http.post({ url: "productPadCommController!saveHistoryInfo.m", data: form})
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              let resData = JSON.parse(res.data.data);
              // if(resData.length!=0){
                this.openOpBindMrl=false;
              // }
          }
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
        });
    },
//保存转运任务-目的是为了展示料车所在位置
    restTranSport(){
      this.form.materRackCode=='';//undefined
      this.form.transQty=0;
    },
    saveMrlTransport(){
      //数据校验
      if(!this.form.materRackCode){
          this.alterMsg.msg="请先扫描料架号";
          this.alterMsg.color=1;
          return;
      }
      if(!this.form.transQty || isNaN(this.form.transQty) || this.form.transQty==0){
          this.alterMsg.msg="请先扫输入有效的转运数量";
          this.alterMsg.color=1;
          return;
      }
      let form = new FormData();
      form.append("dispatchId", this.form.id);//派工单ID
      form.append("materRackCode", this.form.materRackCode);
      form.append("lotCode", this.form.lotCode);
      form.append("transQty", this.form.transQty);
      form.append("operType", "");//为空代表：绑定

      http.post({ url: "productPadCommController!saveMrlTransportInfo.m", data: form})
        .then(res => {
          if(res.status == 200  && res.data.erroCode == 0){
              let resData = JSON.parse(res.data.data);
              // if(resData.length!=0){
                this.form.materRackCode="";
                this.form.transQty="";
                this.openTrans=false;
              // }
          }
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
        });
    },
    //查看料架位置
    queryShelfPostion(){
      let form = new FormData();
      form.append("dispatchId", this.dispatchId);//选择行所对应的 派工单ID

      http.post({ url: "productPadCommController!queryShelfPostion.m", data: form})
          .then(res => {
            if(res.status == 200  && res.data.erroCode == 0){
                let resData = JSON.parse(res.data.data);
                if(resData.length!=0){
                  this.materRacks=resData;
                }
            }
            //提示框消息展示
            this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
            this.alterMsg.color=parseInt(res.data.erroCode);
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
    //获取待处理任务
    this.queryWaitWork();
  }
};
</script>
<style scoped lang="scss">
//弹性盒子布局
div{
  width:100%;
  background-color: rgb(255, 255, 255);
  padding: 0px;
  margin: 0% auto;
  border:3px solid rgb(112, 110, 110);
  font-size: 60px;
  // border:none;
  //display: flex;
 // align-items:center;//弹性盒子纵轴对齐
}

//标题布局
/deep/ .fieldset {
    border: .5px solid LightGrey;
    margin: 0 2px;
    padding: .35em .625em 0em;
    width:100%;
    height: 99%;
}

.mylegend {//标题头
  font-family: "微软雅黑";
  font-size: 60px;
  font-weight: bold;
  border-radius: 20px;
  border-width: 25%;
  border-color:  rgb(112, 110, 110);
  border-style: solid;
  padding: .1% .5%;
}

//下拉选择框样式
/deep/ .select-wrapper{
    width:15%;
    margin-left: .2%;
  /deep/ .mu-input {
    font-size: 50px;
    width: 100%;
    height:100%;
    display: inline-block;
    position: relative;
    color: rgba(0,0,0,.54);
    /deep/ .mu-select-content{
      min-height: 100%;
      /deep/ .mu-select-input{
        height: 100%;
      }
    }
  }
}

/deep/ .mu-popover{
   max-height: 1% !important; 
   min-width: 1%  !important; 
   top: 53.15px; 
   left: 1274.35px;
   /deep/ .mu-list{
      height:100%;
      /deep/ .mu-item{
        height:100%;
      }
   }
}

//流转卡扫码居中位置布局样式
#center{
  height:47%;
  position:relative;//铭记:relative作为父元素<包含块>  absolute作为子元素定位  配合使用
}

/deep/ #center-left{
  width:70%;
  height:99%;
  margin-left:0%;
  margin-top: 0px;
  border:none;
}

/deep/ #center-right{
  position: absolute;
  right: 0px;
  top:0%;
  width:30%;
  height:100%;
  border:none;
}

//流转卡扫码(圆角)
/deep/ .input-radius{
  width:80%;
  height:90%;
  margin-top: .5%;
  margin-left: 10%;
  border-radius:30px;//圆角设置
  /deep/ .mu-text-field-input{
    height: 100%;
    padding-left: 3%;
    font-weight: bolder;
  }
}

//遮罩层  不起作用重写定义
/deep/ .mu-overlay{
  width:100%;
  height:100%;
  opacity: 0.35 !important; //透明度的需要配合定位使用
  position: fixed !important; 
  background-color: rgb(0, 0, 0); 
  z-index: 20141226 !important;
}
// /deep/ .mu-dialog-wrapper{
//   z-index: 20141228 !important;
//   background:rgba(139, 135, 135, 0.6) !important;
//   // display:none;
//   // position:absolute;
//   // opacity: 0.1;
//   /deep/ .mu-scale{
//     z-index:20141230 !important;
//   }
// }

//重新定义dialog样式
/deep/ .mu-dialog{
  position: absolute;
  left: 34%;
  top:18% ;
  width:31%;
  height:60%;
  z-index:20141230;
    /deep/.mu-dialog-title{
      width:100%;
      height:13%;
      text-align: center;
      font-size: 60px;
      margin: .5% auto;
      background-color: rgb(190, 187, 187);//rgba(231, 230, 230, 0.89)
      color: #ffffff;
      font-weight: bolder;
      span{
        margin: auto auto;
      }
    }
    /deep/.mu-dialog-body{
      padding: 0%;
      margin-bottom: 0%;
      height: 87%;
    }
}

//报工弹窗页面(表单)   style="width:98%;height:80%;border:none;"
/deep/ .input-form{
  width:100%;
  height:85%;
  font-size: 50px;
  border: none;
  background-color:  LightGrey;
  /deep/ .input-lable{
    width:25%;
    height:10%;
    text-align: right;
    display: inline-block;
  }
  /deep/ .mu-input{
     width:60%;
     height:10%;
     text-align: left;
     margin-left: 3%;
     margin-top: 5%;
     /deep/ .mu-text-field-input{
      height: 100%;
      padding-left: 3%;
      border-radius:20px;//圆角设置
    }
  }
}

//料车转运
/deep/ .input-transform{
  width:100%;
  height:85%;
  font-size: 50px;
  border: none;
  background-color:  LightGrey;
  margin-bottom: 0%;
  /deep/ .input-lable{
    width:15%;
    height:10%;
    text-align: right;
    display: inline-block;
  }
  /deep/ .mu-input{
     width:30%;
     height:10%;
     text-align: left;
     margin-left: 3%;
     margin-top: 2.5%;
     /deep/ .mu-text-field-input{
      height: 100%;
      padding-left: 3%;
      border-radius:20px;//圆角设置
    }
  }
}

//标题头布局
.head-wrapper{
  width: 100%;
  height: 99%;
  border:none;
  text-align:center;
  font-size: 60px;
  color: #f0f0f0;
  font-weight: 900;
  font-family: "微软雅黑";
  /deep/ .head-demo{
    height:99%;
    position: relative;
    background-color:gray;
    border-right:3px solid #f0f0f0;
    padding-top: 1%;
    span{
      height: 100%;
      text-align: center;
      //position:absolute;
    }
  }
}

//当前任务布局
.flex-wrapper{
  width: 100%;
  height: 33%;
  border: none;
  background-color:LightGrey;
  padding-top: 1%;
  .flex-demo{//div父元素块
    width:33%;
    height:100%;
    font-weight: 400;
    font-size: 60px;
    border: none;
    background-color:LightGrey;
    span{//文本字体子元素设置
      width:30%;
      height:60%;
      text-align: center;
    }
    /deep/ .mu-input {//input子元素输入框
      width:68%;
      height:60%;
      text-align: center;
      margin-right: 2%;
      /deep/ .mu-text-field-input{
        height: 100%;
      }
    }
  }
}

//按钮的样式调整
.button-db {
    display: flex;
    flex-direction: row;//排列方式
    flex-wrap: nowrap;//换行
    text-align: center;
    width:100%;
    border:none;
}
.button-db .mu-button {
    margin:auto auto;//.5% 2%
    width:10%;
    height: 80%;
    font-size: 60px;
    font-weight:bolder;
    /deep/ .mu-button-wrapper{
      height: 100%;
    }
}

//center-right 右侧操作按钮
.but-xy{
  width:99%;
  height: 33%;
  border:none;
  .mu-button {
    margin:3% 0% 3% 11%;
    width:35%;
    height: 65%;
    font-size: 60px;
    font-weight:bolder;
    border-radius:30px;//圆角设置
  }
}


//表格的样式设置
// elementUI组件修改样式 覆盖无效
// 一、深度作用选择器（ >>> ）
// 二、/deep/ 预处理器less下使用
.other-type{
  font-size:3.5rem;
  height: 150px;
}

//表格头thead样式定义
/deep/ .mu-table th{
    text-align: center;
}
/deep/ .mu-table th.headColumns{
    color: #f0f0f0;
    font-weight: bolder;
    font-size: 4rem !important;
    background-color: gray;
    height: 150px;
    border-right:1px solid #f0f0f0;
}

//没有数据时的样式
/deep/.mu-table .mu-table-empty{
  font-weight: 400;//定义由粗到细的字符。400 等同于 normal，而 700 等同于 bold
  font-size: 4rem !important;
  height: 98%;
}

/* 消息提醒框字体样式 */
#messageInfo{
  width: 98%;
  height: 70%;
  border: none;
}
#messageInfo p,#messageInfo1 p {
  font-size: 60px;
  margin: .5% auto;
  height: 90%;
}

</style>