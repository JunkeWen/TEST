<template>
  <div id="product">

    <!-- 头部导航 -->
    <Safe-header v-bind="{title:'',color:'#fff',textColor:'#000',isBack:true,backIconColor:'#4da274',fixedTop:true}">  
      <span slot="myUser">用户：{{myUser}}</span>
      <span slot="workInfo">
        <span class="top-divide" style="width:25%;">班次: {{workClass.workClassCode}}</span>
        <span class="top-divide" style="width:50%;margin-left:1rem;">生产线: {{workCenter.workCenterCode}}</span>
        <span class="top-divide" style="width:25%;margin-left:1rem;">工位: {{workCell.workCellCode}}</span>
      </span>
      <span slot="title">{{ topName }}</span>
      <span slot="time">{{timeBox}}</span>
      <span slot="jiahao" @click="showmore()">
        <mu-icon value="menu"></mu-icon>
      </span>
    </Safe-header>
    <div class="pro-top-menu" v-if="showFlag">
      <div class="top-box" @click="queryWoOpResource()">查看文件</div>
      <div class="top-box" @click="toggleStatus('openTrans')">料车转运</div>
      <div class="top-box" @click="toggleStatus('openTrialProduct')">试制品记录</div>
      <div class="top-box" @click="toggleStatus('openSuspiProduct')">可疑品记录</div>
    </div>

    <!-- 功能菜单切换  改动最大宽度: max-width:100% -->
    <mu-paper class="demo-paper" :z-depth="1">
      <mu-container style="height:100%;width:100%;max-width:100%;">
        <mu-tabs
          style="height:30%;"
          :value.sync="active"
          full-width
          color="white"
          indicator-color="blue"
          active-class="pro-active"  @change="tabChange"
        >
          <mu-tab @click="queryWaitWork('')">待处理任务</mu-tab>
          <mu-tab>当前任务</mu-tab>
          <mu-tab  @click="queryDaqInfo">报工记录</mu-tab>
          <mu-tab class="right-border">异常按灯</mu-tab>
        </mu-tabs>

        <div class="pro-demo pro-demo-product" v-if="active === 1">
          <!-- 当前任务展示 -->
          <p class="pro-demo-title">扫码展示</p>
          <div class="center" style="margin:0px;height:20vh;">
            <!-- 工单信息展示 -->
            <div class="center-left" style="height:100%;overflow-y:hidden;">
              <div class="pro-saoma" style="height:25%;margin:0.6rem auto 0px;"> <!-- 如果input需要回撤，去掉高度样式-->
                <input class="input-radius" style="height:2.5rem;" type="text" placeholder="料车扫描....."  ref="woInputVal" v-model="woInputVal" @keyup.enter="unBindShelf"/>
                <mu-icon size="30" class="pro-saoma-search" value="search" color="#2196f3" @click="unBindShelf"></mu-icon>
              </div>
              <div class="flex-ul"  style="height:75%;width:100%;padding:0px 1% 1% 1%;">  <!-- 循环遍历 -->
                <div class="flex-li" :style="item.title=='排程开始时间'?bindStyle1:(item.title=='排程结束时间'?bindStyle2:(item.title.slice(item.title.length-2, item.title.length)=='单号'?bindStyle3:''))"  v-for="(item, i) in contentList" :key="i">
                    <span :style="item.title.slice(item.title.length-2, item.title.length)=='单号'?'width:29%;':'width:35%;'">{{ item.title }}:</span>
                   <!--可以隐藏显示 复制信息可完整 class="line-limit-length"  -->
                    <div  :style="item.title.slice(item.title.length-2, item.title.length)=='单号'?'width:70%;':'width:60%;'">{{ item.content | ellipsis}}</div>
                </div>
              </div>
            </div>
            <!-- 当前料车信息  行高调整修改 -->
            <div  class="center-right" style="top:0px;height:100%;line-height:2rem;">
                <div class="center-title">当前料车信息</div>
                <div class="flex-ul" style="width:100%;height:90%;padding:0px 1% 1%;">
                  <div class="flex-li" style="width:100%;height:30%;"><span>料车号:</span><div>{{ljform.LJCODE}}</div></div>
                  <div class="flex-li" style="width:100%;height:30%;"><span>料车状态:</span><div>{{ljform.LJSTATE}}</div></div>
                  <div class="flex-li" style="width:100%;height:30%;"><span>料车数量:</span><div>{{ljform.LJQTY}}</div></div>
                </div>
            </div>
          </div>
          
          <!-- 工序原材料及资源绑定区域 -->
          <p class="pro-demo-title">工序材料及资源录入</p>
          <div class="center" style="width:100%;height:39vh;border:none;margin: 20px auto;">
            <!-- left 工序资源信息   overflow:visible; 和 hidden 按钮显示暂时这样解决-->
            <div class="center-left" style="width:52%;margin-left:1%;height:100%;border: 1px solid #666666;overflow:visible;border-radius: 15px;">
                <!-- 资源录入标题头 -->
                <div class="center-title" style='line-height:1.2rem;'>工艺资源信息填报</div>
                <mu-divider></mu-divider>
                <!-- 资源录入填报内容区域 -->
                <div class="center" style="width:100%;height:93%;">
                  <div class="center-left" style="margin-left:25%;">  <!-- 工艺资源填报区域 -->
                    <div class="flex-ul-start">
                      <div class="flex-li-start" style="width:50%" v-for="(item, index) in bindOpRes" :key="index">
                        <span style="width:46%;">{{item.checkItem}}</span>
                        <input style="width:25%;" v-model="item.checkValue"/>
                        <span style="display:inline-block;width:28%;height:60%;">{{item.threshold}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center-right" style="width:25%;top:0px;left:0px;line-height: 1.5rem;">  <!-- 设备磨具区域 -->
                    <span class="center-right-title">操作人编码:</span>
                    <input class="center-right-content" v-model="person" :disabled="true" />
                    <span class="center-right-title">设备编码:</span>
                    <input class="center-right-content" v-model="equip" underline-color="#2cb69a" />
                    <span class="center-right-title">模具编码:</span>
                    <input class="center-right-content" v-model="tool" underline-color="#2cb69a"  :disabled="toolDisable"  @keydown.enter="getBarCodeByRouteLine()" @blur="getBarCodeByRouteLine()"/>
                  </div>
                  
                  <div class="center-button" style="height:15%;">  <!-- 按钮区域 -->
                    <mu-button slot="actions"  color="primary" class="center-button-divider"  style="width:25%;margin-left:15%;"  @click="saveHistoryInfo('bindOps')">保存</mu-button>
                    <!-- <mu-button slot="actions"  color="primary" class="center-button-divider"  @click="addRows" >添加行</mu-button> -->
                    <mu-button slot="actions"  color="primary" class="center-button-divider"  style="width:25%;margin-right:15%;"  @click="queryOpMrlAndRes(1)">重置</mu-button>
                  </div>
                </div>
            </div>
            
            <!-- right 工序材料信息 -->
            <div class="center-right"  style="width:45%;margin: 0px 1%;height:100%;border: 1px solid #666666;top:0%;border-radius: 15px;">
                <!-- 资源录入标题头 -->
                <span class="center-title" style='line-height:1.2rem;'>原材料信息填报</span>
                <mu-divider></mu-divider>
                <!-- 材料录入 -->
                <div class="center" style="width:100%;height:93%;">
                  <div class="center-left"  style="width:100%;">
                    <div class="flex-ul-start">
                      <div class="flex-li-start" style="width:100%;height:20%;" v-for="(item, index) in bindMrls" :key="index">
                        <!-- <span  style="width:10%;">材料批次</span>
                        <input style="width:13%;margin-right:1%;"  v-model="item.lotCode"/>-->
                        <span @click="controDisplay(item)"   style="display:inline-block;width:32%;margin-right:1%;posistion:relation;">{{item.mrlName | ellipsis}}</span>
                        <input style="display:inline-block;width:30%;margin-right:1%;"  placeholder="材料批次..." v-model="item.lotCode"/>
                        <input style="display:inline-block;width:15%;margin-right:1%;"  placeholder="材料数量..." v-model="item.qty"/>
                        <input style="display:inline-block;width:15%;" placeholder="材料单位..." v-model="item.unit"/>
                      </div>
                    </div>
                  </div>
                  <div class="center-button" style="height:15%;">  <!-- 按钮区域 -->
                    <mu-button slot="actions"  color="primary" class="center-button-divider"  style="width:25%;margin-left:15%;"  @click="saveHistoryInfo('bindMrls')">保存</mu-button>
                    <!-- <mu-button slot="actions"  color="primary" class="center-button-divider"  @click="addRows" >添加行</mu-button> -->
                    <mu-button slot="actions"  color="primary" class="center-button-divider"  style="width:25%;margin-right:15%;"  @click="queryOpMrlAndRes(2)">重置</mu-button>
                  </div>
                </div>
            </div>
          </div>
          <div class="pro-shunxu">
            <div v-bind:style="divColor1" @click="toggleStatus('start')">{{ kai }}</div>
            <div v-bind:style="divColor2" class="pro-shunxu-active" @click="toggleStatus('finish')">完工</div>
            <div v-bind:style="divColor3" @click="toggleStatus('pause')">{{ ting }}</div>
            <div class="pro-shunxu-active" :disabled="ZZP_SJ"  @click="addCheckBill('ZZP_SJ')" >首检</div>
            <div class="pro-shunxu-active" :disabled="ZZP_MJ"  @click="addCheckBill('ZZP_MJ')">末检</div>
          </div>
        </div>

        <!-- 待处理任务 style="height:83vh;"-->
        <div class="pro-demo pro-demo-from"  v-if="active === 0">
          <mu-paper :z-depth="1" style="height:100%;">
            <div style="height:79vh;overflow-y:scroll;overflow-x:hidden;">
            <!-- 悬浮按钮 -->
                <div class="bottomRing" v-drag>
                  <div class="sonButton" v-for="(value,key,index) of opCodes" :key="'info'+index">
                     <mu-button  fab large  color="primary" @click="queryWaitWork(key)">{{value}}</mu-button>
                  </div>
                  <div class="sonButton">
                     <mu-button fab large  color="primary" @click="queryWaitWork('')">ALL</mu-button>
                  </div>
                </div>
                <div class="flex-ul" style="width:100%;height:25%;" :style="{'background-color':(index++)%2==0?'#E8E8E8':'WHITE'}" :class="{'flex-ulhover':(index++)%2!=0}" v-for="(item,index) of list" :key="index" @click="getCurrentItem(item)">
                  <div style="display:none;">{{item.id}}</div>
                  <div style="display:none;">{{item.reportNum}}</div>
                  <div style="display:none;">{{item.isFrist}}</div>
                  <div class="flex-li"><span class="success">工单号:</span><div class="success">{{item.workOrderCode}}</div></div>
                  <div class="flex-li"><span>产品编码:</span><div>{{item.mrlCode}}</div></div>
                  <div class="flex-li"><span>产品名称:</span><div>{{item.mrlName   | ellipsis }}</div></div>
                  <div class="flex-li" @click.stop="queryShelfPostion(item.id)">
                    <span>计划数量:</span><div style="width:25%;">{{item.planQty}}</div>
                    <span class="success" style="width:5rem;height:1.5rem;line-height:1.5rem;margin-right:0px;">料车查看</span>
                  </div>

                  <div class="flex-li"><span>订单号:</span><div>{{item.orderCode  | ellipsis }}</div></div>
                  <div class="flex-li"><span>所在工序:</span><div>{{item.opCode}}</div></div>
                  <div class="flex-li"><span>良品数:</span><div>{{item.effectiveQty}}</div></div>
                  <div class="flex-li"><span>报废数:</span><div>{{item.discardQty}}</div></div>

                  <div class="flex-li"><span>任务状态:</span><div>{{item.disCodeState}}</div></div>
                  <div class="flex-li"><span>是否转运:</span><div>{{item.isTransport}}</div></div>
                  <div class="flex-li"><span style="width:40%;margin-left:0px;">排程开始时间:</span><div style="width:54%;margin-right:6%;">{{item.plannedStartTime  | ellipsis }}</div></div>
                  <div class="flex-li"><span style="width:40%;margin-left:0px;">排程结束时间:</span><div style="width:54%;margin-right:6%;">{{item.plannedFinishTime | ellipsis }}</div></div>
                  <!-- 分割线 -->
                  <mu-divider></mu-divider> 
                </div>
            </div>   
          </mu-paper>
        </div>

        <!-- 报工记录  list-->
        <div class="pro-demo pro-demo-from" v-if="active === 2">
          <mu-paper :z-depth="1" style="height:100%;">
             <div style="height:79vh;overflow-y:scroll;overflow-x:hidden;">
                <div class="flex-ul" style="width:100%;height:25%;" v-for="(item,index) of daqInfos" :key="index">
                  <div style="display:none;">{{item.id}}</div>
                  <div class="flex-li"><span class="success">工单号:</span><div class="success">{{item.workOrderCode}}</div></div>
                  <div class="flex-li"><span>产品编码:</span><div>{{item.mrlCode}}</div></div>
                  <div class="flex-li"><span>产品名称:</span><div>{{item.mrlName | ellipsis }}</div></div>
                  <div class="flex-li"><span>计划数量:</span><div>{{item.planQty}}</div></div>
                  <!-- <div class="flex-li" @click.stop="toggleStatus('openOpBindMrl')">
                    <span>计划数量:</span><div style="width:25%;">{{item.planQty}}</div>
                    <span class="success" style="width:5rem;height:1.5rem;line-height:1.5rem;margin-right:0px;">资源查看</span>
                  </div> -->
                  <div class="flex-li"><span>订单号:</span><div>{{item.orderCode  | ellipsis }}</div></div>
                  <div class="flex-li"><span>所在工序:</span><div>{{item.opCode}}</div></div>
                  <div class="flex-li"><span>良品数:</span><div>{{item.effectiveQty}}</div></div>
                  <div class="flex-li"><span>报废数:</span><div>{{item.discardQty}}</div></div>

                  <div class="flex-li" style="margin-left:0px;margin-right:0px;"><span>任务状态:</span><div>{{item.disCodeState}}</div></div>
                  <div class="flex-li" style="margin-left:0px;margin-right:0px;"><span>报工人员:</span><div>{{item.person}}</div></div>
                  <div class="flex-li" style="margin-left:0px;margin-right:0px;"><span>设备信息:</span><div>{{item.equip}}</div></div>
                  <div class="flex-li" style="margin-left:0px;"><span>模具信息:</span><div>{{item.tool}}</div></div>
                  <!-- 分割线 -->
                  <mu-divider></mu-divider> 
                </div>
            </div> 
          </mu-paper>
        </div>

        <!-- 异常按灯 -->
        <div class="pro-demo pro-demo-from" v-if="active === 3">
          <!-- 引入异常控制自定义组件 -->
          <UsmAndon :workCell="workCell" :workCenter="workCenter" :tool="tool" :trackOrderId="form.id" :equip="equip"></UsmAndon>
        </div>
      </mu-container>
    </mu-paper>

    <!-- 消息提示窗 -->
    <span  v-if="active === 1" class="pro-tips" :style="{color: alterMsg.color==1?'red':'green'}">消息提醒: {{alterMsg.msg}}</span>

    <!-- 弹框提示区域 -->

    <!--异常响应弹框-->
    <mu-container v-if="openException">
      <mu-dialog title="响应" width="500" max-width="500" :padding="padding" scrollable :open.sync="openException">
        <mu-row>
          <mu-col span="12">
            <mu-select label="请选择异常小类" v-model="currentData.exTypeName" full-width @change="smallTypeChangeEvt">
              <mu-option v-for="(item,index) in exTypeList" 
                :key="index" 
                :label="item.exTypeName || ''"
                :value="item.exTypeName || ''"
              ></mu-option>
            </mu-select>
          </mu-col>
          <mu-col span="12">
            <mu-select
              label="请选择异常异常原因" v-model="currentData.exContentName"  full-width @change="contentChangeEvt" >
              <mu-option
                v-for="(item,index) in exContentList"
                :key="index"
                :label="item.usmContentName || ''"
                :value="item.usmContentName || ''"
              ></mu-option>
            </mu-select>
          </mu-col>
        </mu-row>
        <mu-button slot="actions" flat color="primary" @click="closeDialogToLanch">确定</mu-button>
      </mu-dialog>
    </mu-container>

    <!--工位弹框-->
    <mu-container v-if="openScroll_workCell">
      <mu-dialog title="工位列表" width="500" max-width="500"
        :padding="padding"
        scrollable
        :open.sync="openScroll_workCell">
        <tree-select
          :listData.sync="workListData" @doChildClick="doChildWorkCellClick" :isMultiple="isMultiple"
        ></tree-select>
        <mu-button slot="actions" flat color="primary" @click="closeWorkCellDialog">确定</mu-button>
      </mu-dialog>
    </mu-container>

    <!--点击完工按钮弹窗-->
    <mu-container v-if="openFinshReport">
      <mu-dialog title="消息提醒" width="32%"  max-width="80%" :open.sync="openFinshReport" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <!-- 报工输入信息 -->
        <div style="text-align:left;width:100%;min-height:8rem;">&nbsp;&nbsp;{{checkFinshInfo}}</div>
    
        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary" v-if="isConfireSubmit" @click="doSubmit('finish')">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="openFinshReport=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

    <!--可疑品保存弹框-->
    <mu-container v-if="openIsSave">
      <mu-dialog title="消息提醒" width="32%"  max-width="80%" :open.sync="openIsSave" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <!-- 报工输入信息 -->
        <div style="text-align:left;width:100%;min-height:8rem;">&nbsp;&nbsp;是否确认保存</div>
    
        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary" @click="restSuspiProduct()">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="openIsSave=false">取消</mu-button>
      </mu-dialog>
    </mu-container>

    <!-- 报工采集弹窗 -->
    <mu-container v-if="openAlert">
      <mu-dialog  title="报工采集"
        width="32%"  max-width="80%"  :open.sync="openAlert" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <!-- 报工输入信息 -->
        <div style="text-align:center;width:100%;">
          <br/>
          <span class="span-lable">工单号:</span>
          <mu-text-field class="text-input" :disabled="true" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          <span class="span-lable">产品编码:</span>
          <mu-text-field class="text-input" :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          <span class="span-lable">派工单号:</span>
          <mu-text-field class="text-input" :disabled="true" v-model="form.dispatchCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          <span class="span-lable">良品数:</span>
          <mu-text-field class="text-input" v-model="form.goodQty" type="number"  underline-color="#2cb69a" @change="checkIsNaN(form.goodQty)"></mu-text-field><br/>
          <span class="span-lable">报废数:</span>
          <mu-text-field class="text-input" :disabled="true" v-model="form.discardQty" type="number" underline-color="#2cb69a"></mu-text-field><br/>
        </div>
        <!-- <div class="flex-ul border-div"  :style="discInfoStyle" >
          修改之前  
          <div class="flex-li" style="margin-left:0px;width:90%;" v-for="(item,index) in discListData" :key="index" >
            <mu-checkbox :value="item.id" v-model="checkbox.value1"  style="zoom:150%;vertical-align:middle;font-size:.8rem;" :label="item.name" label-left></mu-checkbox>
            <input class="flex-input" style="text-align:center;" type="number" v-model="item.qty"/>
          </div>
        </div> -->

        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary" @click="doSubmit('report')">保存</mu-button>
        <mu-button slot="actions" flat color="primary" @click="openAlert=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

    <!-- 料车转运弹框 -->
    <mu-container v-if="openTrans" v-bind="showFlag=false">
      <mu-dialog  title="绑定料车转运"
        width="60%"  max-width="80%"  :open.sync="openTrans" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <div class="flex-content" style="text-align:center;width:100%; margin-top: 2%;">
          <div class="flex-item" style="width:100%;" >
            <span style="width:15%;">料车号:</span>
            <mu-text-field class="text-input" v-model="form.materRackCode" type="text"  underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>工单号:</span>
            <mu-text-field class="text-input" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>派工单号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.dispatchCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品编码:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品名称:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlName" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>批次号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.lotCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>工序:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.opCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>计划数量:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.planQty" type="number" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>转运数量:</span>
            <mu-text-field class="text-input" v-model="form.transQty" type="number" underline-color="#2cb69a" @change="checkIsNaN(form.transQty)"></mu-text-field><br />
          </div>
        </div>

        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary"  @click="saveMrlTransport()">保存</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="restTranSport()">重置</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="openTrans=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

    <!-- 开工前试制品记录 -->
    <mu-container v-if="openTrialProduct" v-bind="showFlag=false">
      <mu-dialog  title="试制品记录"
        width="60%"  max-width="80%"  :open.sync="openTrialProduct" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <div class="flex-content" style="text-align:center;width:100%; margin-top: 2%;">
          <div class="flex-item" style="width:100%;" >
            <span style="width:15%;">工单号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>派工单号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.dispatchCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品编码:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品名称:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlName" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>批次号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.lotCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>工序:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.opCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>计划数量:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.planQty" type="number" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>良品数:</span>
            <mu-text-field class="text-input" v-model="form.goodQtys" type="number" underline-color="#2cb69a" @change="checkIsNaN(form.goodQtys)"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>不良品数:</span>
            <mu-text-field class="text-input" v-model="form.badQtys" type="number" underline-color="#2cb69a" @change="checkIsNaN(form.badQtys)"></mu-text-field><br />
          </div>
        </div>

        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary"  @click="saveTrialProduct()">保存</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="openTrialProduct=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

    <!-- 开工前可疑品记录 -->
    <mu-container v-if="openSuspiProduct" v-bind="showFlag=false">
      <mu-dialog  title="可疑品记录"
        width="60%"  max-width="80%"  :open.sync="openSuspiProduct" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <div class="flex-content" style="text-align:center;width:100%; margin-top: 2%;">
          <div class="flex-item">
            <span>工单号:</span>
            <mu-text-field class="text-input" v-model="form.workOrderCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品编码:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlCode" type="text" underline-color="#2cb69a"></mu-text-field><br/>
          </div>
          <div class="flex-item">
            <span>产品名称:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.mrlName" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>批次号:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.lotCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>工序:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.opCode" type="text" underline-color="#2cb69a"></mu-text-field><br />
          </div>
          <div class="flex-item">
            <span>计划数量:</span>
            <mu-text-field class="text-input" :disabled="true" v-model="form.planQty" type="number" underline-color="#2cb69a"></mu-text-field><br />
          </div>

<!-- 报废明细项 -->
          <div class="flex-item" style="width:100%;">
              <mu-divider></mu-divider>
              <div class="flex-ul" style="width:100%;background-color:rgb(209, 209, 209);align-items:flex-start;justify-content:flex-start;text-align: left;">
                <div class="flex-li" style="width:45%;margin:auto 2.5% 1%;" v-for="(item,index) in discListData" :key="index" >
                  <span style='width:50%;text-align:left;'>{{item.name}}</span>
                  <div style='width:45%;text-align:right;'>
                    <mu-button icon style="vertical-align:middle;" @click.native="saveSuspiProduct(item,'del')">
                        <mu-icon  value="remove" size="36"></mu-icon>
                    </mu-button>
                    <input class="flex-input" style="text-align:center;" type="text" v-model="item.qty"   @blur="saveSuspiProduct(item,'entry')"/> 
                    <mu-button icon style="vertical-align:middle;"  @click="saveSuspiProduct(item,'add')">
                      <mu-icon value="add"  size="36"></mu-icon>
                    </mu-button>
                  </div>
                </div>
              </div>
              可疑品记录:
              <div style="border:1px solid rgb(112, 110, 110);width:10%;line-height:2rem;height:2rem;margin-top:1.2rem;">
                {{formSuspiQtys}}
              </div>&nbsp;件
          </div>         
<!-- 报废汇总统计 
        <div class="flex-item" style="width:100%;">
                <div style="border:1px solid rgb(112, 110, 110);width:46%;color:#fff;text-align:center;background-color: #e57373;">
                  <mu-button icon style="margin-left:5%;vertical-align:middle;" @click.native="saveSuspiProduct('del')">
                     <mu-icon  value="remove" size="36"></mu-icon>
                  </mu-button>
                  可疑品:
                  <mu-text-field class="text-input" style="width:4rem;margin-bottom:0px;" @keydown.13="saveSuspiProduct('entry')" @change="checkIsNaN(form.suspiQtys)" v-model="form.suspiQtys" type="number" underline-color="#2cb69a"></mu-text-field>
                  <mu-button icon style="margin-right:5%;vertical-align:middle;"  @click="saveSuspiProduct('add')">
                    <mu-icon value="add"  size="36"></mu-icon>
                  </mu-button>
                </div>
          </div>-->
        </div>

        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary"  @click="openIsSave=true">保存</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="openSuspiProduct=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

    <!-- 料车信息查看弹窗 -->
    <mu-container v-if="openMaterRack">
      <mu-dialog  title="料车信息"
        width="76%"  max-width="80%"  :open.sync="openMaterRack" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <!-- materRacks  list-->
        <div v-if="materRacks.length===0" class="mu-item-empty">未获取到数据</div>

        <div v-if="materRacks.length!=0" style="height:60vh;overflow-y:scroll;overflow-x:hidden;">
            <div class="flex-ul" style="width:100%;height:25%;" v-for="(item,index) of materRacks" :key="index">
              <div style="display:none;">{{item.id}}</div>
              <div class="flex-li" style="width:33%;text-align:left;"><span class="success">工单号:</span><div>{{item.workOrderCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>订单号:</span><div>{{item.orderCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>计划数量:</span><div>{{item.planQty}}</div></div>
              <div class="flex-li" style="width:33%"><span>产品编码:</span><div>{{item.mrlCode  | ellipsis}}</div></div>
              <div class="flex-li" style="width:33%"><span>产品名称:</span><div>{{item.mrlName  | ellipsis}}</div></div>
              <div class="flex-li" style="width:33%"><span>批次:</span><div>{{item.lotCode}}</div></div>

              <div class="flex-li" style="width:33%"><span>转运数量:</span><div>{{item.transQty}}</div></div>
              <div class="flex-li" style="width:33%"><span>料车号:</span><div>{{item.materRackCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>仓库号:</span><div>{{item.storeHouseCode}}</div></div>
            </div>
        </div>  

        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider>
        <!-- <mu-button slot="actions" flat color="primary"  @click="saveMrlTransport()">保存</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="restTranSport()">重置</mu-button> -->
        <mu-button slot="actions" flat color="primary"  @click="openMaterRack=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>


    <!-- 工序资源查看弹窗 -->
    <mu-container v-if="openOpBindMrl">
      <mu-dialog  title="工序资源信息"
        width="76%"  max-width="80%"  :open.sync="openOpBindMrl" dialog-class="dialog-div"
        :esc-press-close="false"
        :overlay-close="false" >
        <!-- 分割线 -->
        <mu-divider style="margin-top:-1%;"></mu-divider> 

        <!-- materRacks  list-->
        <div v-if="materRacks.length===0" class="mu-item-empty">未获取到数据</div>

        <div v-if="materRacks.length!=0" style="height:60vh;overflow-y:scroll;overflow-x:hidden;">
            <div class="flex-ul" style="width:100%;height:25%;" v-for="(item,index) of materRacks" :key="index">
              <div style="display:none;">{{item.id}}</div>
              <div class="flex-li" style="width:33%;text-align:left;"><span class="success">工单号:</span><div>{{item.workOrderCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>派工单号:</span><div>{{item.dispatchCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>计划数量:</span><div>{{item.planQty}}</div></div>
              <div class="flex-li"><span>派工单号:</span><div>{{item.dispatchCode}}</div></div>
              <div class="flex-li"><span>所在工序:</span><div>{{item.opCode}}</div></div>

              <div class="flex-li" style="width:33%"><span>产品编码:</span><div>{{item.mrlCode  | ellipsis}}</div></div>
              <div class="flex-li" style="width:33%"><span>产品名称:</span><div>{{item.mrlName  | ellipsis}}</div></div>
              <div class="flex-li" style="width:33%"><span>批次:</span><div>{{item.lotCode}}</div></div>
              <div class="flex-li" style="width:33%"><span>数量:</span><div>{{item.transQty}}</div></div>
              <!-- 分割线 -->
              <mu-divider></mu-divider> 
            </div>
        </div>  
        <!-- 分割线 -->
        <mu-divider style="margin-bottom:-1%;"></mu-divider> 
        <mu-button slot="actions" flat color="primary"  @click="saveMrlTransport()">保存</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="restTranSport()">重置</mu-button>
        <mu-button slot="actions" flat color="primary"  @click="openOpBindMrl=false">关闭</mu-button>
      </mu-dialog>
    </mu-container>

  </div>
</template>

<script>
// import qs from "qs";
// import Message from "muse-ui-message";
// import business from "../../../utils/business_product.js";
import http from "../../../utils/http.js";
import SafeHeader from "../../../components/safeHeaderMenu";
import storage from "../../../utils/storage.js";
import "muse-ui-loading/dist/muse-ui-loading.css";
import "muse-ui-message/dist/muse-ui-message.css";
// import Loading from "muse-ui-loading";
import Toast from "muse-ui-toast";

import UsmAndon from "../../../components/usmAndon";
import drag from "../../../utils/drag.js";


export default {
  name: "demo",
  components: {
    SafeHeader,
    UsmAndon,
  },
  filters: {
    //定义过滤器
    ellipsis(value) {
      if (!value) return "";
      if(value.length > 16  && value.length != 19){
        return value.slice(0, 4) + "..." + value.slice(6, 10);
      }else if(value.length == 19){
        return value.slice(0, 10);
      }else if(value.length == 12){
        return value;
      }else if(value.length > 12 && value.length <= 15){
        return value.slice(0, 4) + "..." + value.slice(value.length-4, value.length);
      }
      return value;
    }
  },
  data() {
    return {
      ////在制品首末检查按钮禁用
      ZZP_SJ:false,
      ZZP_MJ:false,
      //动态绑定样式应用
      bindStyle1:'margin-left:0px;margin-right:0px;width:34%;',//排程开始和结束时间
      bindStyle2:'margin-left:0px;width:34%;',
      bindStyle3:'width:28%;text-align:left;',//工单号 | 派工单号 样式
      bindStyle4:'width:20%;',//其他

      // discInfoStyle:'display:none',//报废明细div-style
      discListData:[],//报废明细集合
      checkbox: {
        value1: [],
      },

      divDisplay:"display: none;",//显示物料明细
      divDisplay1:true,

      divColor1: "", //DIV的背景色
      divColor2: "", //DIV的背景色
      divColor3: "", //DIV的背景色
      divColor: "div:hover{background: rgb(33, 100, 243,.89);color:white}", //'div:hover{background: white;color:#2196f3;}'
      openAlert: false, //生产报工
      openTrans: false, //料车转运
      openMaterRack: false, //料车信息查看
      openReportInfo: false, //报工记录
      openOpBindMrl: false, //工序绑定物料信息

      openIsSave:false,
      openTrialProduct:false,//开工前试制品记录
      openSuspiProduct:false,//可疑品记录并修改

      openException:false,//异常响应弹窗
      openScroll_workCell:false,//工位弹窗

      openFinshReport:false,//完工按钮点击弹窗
      checkFinshInfo:"",//检测是否允许完工的回馈信息
      isConfireSubmit:true,

      list: [], //【待处理任务】表格数据
      opCodes:{},//待处理任务的工序编码集合
      materRacks: [], //料车位置【查看】
      daqInfos:[],//报工记录
      bindMrls: [{ lotCode: "", mrlCode: "", qty: "", unit: "" }], //【原材料】|【资源】信息录入
      bindOpRes:[],//工艺加工检测项

      //-------主页面数据--------
      myUser: "", //标题头用户信息
      workClassArr: [], //班次数组
      workCenterArr: [],
      workCellArr: [],
      workClass: { workClassId: "", workClassCode: "" }, //班次
      workCenter: { workCenterId: "", workCenterCode: "" }, //工作中心
      workCell: { workCellId: "", workCellCode: "" }, //绑定的工位ID/CODE

      //流转卡扫码
      woInputVal: "", //工单号 或者为 料车号
      dispatchId: "", //料车位置查看按钮
      person: "", //信息录入: 人员
      heGeQty: 0, //信息录入：合格数量

      timeBox: "0000-00-00",
      equip: "", //设备
      tool: "" ,//磨具
      toolDisable:false,
      ljform:{
        LJCODE:'',//料车号
        LJSTATE:'',//料车状态
        LJQTY:'',//料车数量
      },
      form: {
        id: "", //主键
        mrlCode: "", //产品编码
        mrlName: "",
        planQty: "", //计划数量
        workOrderCode: "",
        dispatchCode: "",
        orderCode:'',//订单号
        opCode: "", //所在工序
        disCodeState: "", //派工状态
        reportNum:'',//最大报工量【料车解绑时 再派工单递增当前可报工的最大数量】
        isFrist:'YES',
        plannedStartTime: "", //排程开始时间
        plannedFinishTime: "", //排程结束时间

        goodQty: 0, //生产报工:良品数量/不良品/报废数量
        badQty: 0,
        discardQty: 0,


        goodQtys:0,//试制品记录信息：良品/不良
        badQtys:0,
        suspiQtys:0,//可疑品记录信息[舍弃]

        materRackCode: "", //料车号
        lotCode: "", //批次
        transQty: 0, //转运数量
        storehouseCode: "", //仓库号
      },
      startReport: false, //开工|报工 按钮
      finish: false, //完工
      pauseBack: false,//暂停|复工 按钮
      sort: {
        name: "planQty",
        order: "asc"
      },
     
      //消息提示框 color=0绿色和color=1红色
      alterMsg: { msg: "", color: "red" },

      active: 0,
      topName: "生产报工",
      contentList: [
        { title: "工单号", content: "" },
        { title: "产品编码", content: "" },
        { title: "产品名称", content: "" },
        { title: "订单号", content: "" },
        { title: "所在工序", content: "" },
        { title: "计划数量", content: "" },
        { title: "排程开始时间", content: "" },
        { title: "任务状态", content: "" },
        { title: "可报工量", content: "" },
        { title: "排程结束时间", content: "" }
      ],
      kai: "开工",
      ting: "停工",
      showFlag: false,
    };
  },
  computed: {
    // 计算属性的 getter
     formSuspiQtys: function () {
      // `this` 指向 vm 实例
      let blYYQty=0;//不良原因明细 数量之和
      this.discListData.forEach(item => {
            if(!isNaN(item.qty)){
              blYYQty+=parseInt(item.qty || 0);
            }
        }
      );
      return blYYQty || 0;
    }
  },
  watch: {
    //watch监测数据可以直接监听，监听对象需要通过computed计算属性来完成
    form: {
      handler() {
        //handler:为关键字
        let j = 0;
        //由于不同浏览器所遵循的【规范版本】不同，造成排序顺序规则也不一致，所以遍历顺序并非set的顺序
        //这里采用单数组解决Map的遍历顺序问题
        let keys = [
          "workOrderCode",
          "mrlCode",
          "mrlName",
          "orderCode",
          "opCode",
          "planQty",
          "plannedStartTime",
          "disCodeState",
          "reportNum",
          "plannedFinishTime"
        ];
        keys.forEach(
          key => ((this.contentList[j].content = this.form[key]), j++)
        );
      },
      deep: true // 监听这个对象中的每一个属性变化
    }
  },
  methods: {
    //控制显示隐藏，鼠标悬停
    controDisplay(item){
      if(this.divDisplay1){
        this.divDisplay="color: #19d3ea;font-size: 18px;width: 100%;display: block;position: absolute;left:5%;top:-10%";
        this.divDisplay1=false;
      }else{
        this.divDisplay="display: none;"
        this.divDisplay1=true;
      }

      this.alterMsg.msg = "当前选择的物料编码:"+item.mrlCode+",物料名称:"+item.mrlName;
      this.alterMsg.color = parseInt(0);
    },
    showmore() {
      this.showFlag == true ? (this.showFlag = false) : (this.showFlag = true);
    },
    //页面跳转
    goPage(pageComponent) {
      //window.console.log(pageComponent);//openTrans openMaterRack

      if(pageComponent=='openTrans'){
        if(this.from.workOrderCode==''){
          Toast.info({message: '未获取到当前任务',time: "3000", close: false});
          return;
        }else if(this.from.disCodeState=='完工'){
         Toast.info({message: '当前任务已完工',time: "3000", close: false});
         return;
        }
      }
      this.$root.api.api.openWin({
        name: "UexQuery_" + pageComponent,
        url: "./UexQuery.html",
        pageParam: {
          component: pageComponent,
          title: "生产报工",
          pageData:this.setValue(null),
        }
      });
    },

    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[name] - b[name] : b[name] - a[name]
      );
    },

    getCurrentItem(rowData){
      //设置值
      if(rowData){
        this.form.id=rowData.id;
        this.form.mrlCode=rowData.mrlCode;
        this.form.mrlName=rowData.mrlName;
        this.form.workOrderCode=rowData.workOrderCode;
        this.form.planQty=rowData.planQty;
        this.form.dispatchCode=rowData.dispatchCode;
        this.form.opCode=rowData.opCode;

        this.form.orderCode=rowData.orderCode;
        this.form.disCodeState=rowData.disCodeState;
        // this.from.isTransport=rowData.isTransport;
        this.form.plannedStartTime=rowData.plannedStartTime;
        this.form.plannedFinishTime=rowData.plannedFinishTime;

        this.form.reportNum=rowData.reportNum;//最大可报工数量
        this.form.isFrist=rowData.isFrist;//是否首工序: YES NO
        //变更到当前任务页
        this.active=1;

        //form数据和 list之间转换[增加form数据的监听器]
        this.changeButtonColor(this.form.disCodeState);

        this.getBarCodeByRouteLine();//获取默认的模具条码号
            
        this.queryOpMrlAndRes(0);//加载资源维护项格式
      }
    },

     //查看资源地址
    queryWoOpResource(){
      let formData = new FormData();
      if (this.form.workOrderCode == "") {
        //提示框消息展示
        this.alterMsg.msg = "请先选择待处理任务";
        this.alterMsg.color = parseInt(1);
        return;
      }
      formData.append("dispatchId", this.form.id);  //派工单ID

      http.post({url: "productPadCommController!queryWoOpResource.m", data: formData})
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            //链接外部地址
            let resData = JSON.parse(res.data.data);
            //第一种方式 打开新的标签页 
                // window.location.href = resData[0].urlPath;
                // window.location.href = 'http://'+resData[0].urlPath;
            // 第二种方式 打开frame
              // let linkUrl="";
              if(resData && resData[0].urlPath){
               
                let urlPaths=resData.map(item=>{
                  //首先加前缀，如果没有HTTP自动拼写上
                  let urlPath=item.urlPath.split("?")[0];
                  if(urlPath.indexOf('http')==-1){
                    return item.urlPath='http://'+urlPath;
                  }else{
                    return urlPath;
                  }
                });

                let map={};
                resData.forEach((item, i)=>{
                  if(item.urlPath.indexOf('?')==-1){
                    map[i]="";
                  }else{
                    let map2={};
                    let value2=item.urlPath.split("?")[1];
                    value2.split("&").map(item2=>{
                      let key0=item2.split("=")[0];
                      let value0=item2.split("=")[1];
                      map2[key0]=value0;
                    });
                    map[i]=map2;
                  }
                });
                this.$root.api.api.openWin({
                    name: "ReportView",
                    url: "ReportView.html",
                    pageParam: {
                      title:'',
                      pageData:urlPaths,//encodeURI(linkUrl),
                      urlParams:map
                      // pageData:encodeURI('http://192.168.3.24:8075/WebReport/ReportServer?'),
                      // urlParams:{'formlet':'aaa.frm','searchByDate':'2019-10-18'},
                    }
                });
              }else{
              //提示框消息展示
                this.alterMsg.msg = "请先维护地址";
                this.alterMsg.color = parseInt(1);
              }
          }
        });
    },

    // 获取当前的待处理任务
    queryCurWork() {
      //表单提交的数据
      let formData = new FormData();
      if (this.form.workOrderCode == "") {
        //提示框消息展示
        this.alterMsg.msg = "请先选择待处理任务";
        this.alterMsg.color = parseInt(1);
        return;
      }
      formData.append("workCellId", this.workCell.workCellId); //工位
      formData.append("woInputVal", this.form.workOrderCode); //工单号
     
      http.post({url: "productPadCommController!queryCurWork.m", data: formData})
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            //清空VALUE,保留KEY
            // Object.keys(this.form).forEach(key => (this.form[key] = ""));

            //form数据和 list之间转换[增加form数据的监听器]
            let resData = JSON.parse(res.data.data);
            if (resData.length != 0) {
              this.form = resData[0];
              this.changeButtonColor(this.form.disCodeState);
            }
          }
        });
    },

    // 解绑的料车号
    unBindShelf() {
      //表单提交的数据
      let formData = new FormData();
      if (this.form.workOrderCode == "") {
        //提示框消息展示
        this.alterMsg.msg = "请先选择待处理任务";
        this.alterMsg.color = parseInt(1);
        return;
      }else{
        if(!this.woInputVal.trim()){
          this.alterMsg.msg = "请先扫码料车号";
          this.alterMsg.color = parseInt(1);
          return;
        }
      };
      formData.append("id", this.form.id); //派工单号
      formData.append("woInputVal2", this.woInputVal.trim()); //解绑的料车号
      formData.append("workCellId", this.workCell.workCellId); //工位
     
      http.post({url: "productPadCommController!unBindShelf.m", data: formData})
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            if(resData){
             //清空VALUE,保留KEY
             Object.keys(resData).forEach(key => (this.form[key] = ""));
             //料车基本信息
             this.ljform=resData;

             //料车解绑后重新查询当前任务，更新最大可报工数量
             this.queryCurWork();
            }
          }
          //提示框消息展示
          this.woInputVal = ""; //清空
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },

    //开工报工等按钮点击事件
    toggleStatus(operState) {
      //派工单状态
      let woState = this.form.disCodeState;
      //如果为禁用按钮,则只改变按钮状态
      if (operState == "disableButton") {
        this.changeButtonColor(woState);
        return;
      }else if(operState == "openTrialProduct"){
        //打开试制记录框
        if(this.form.id==''){
          this.alterMsg.msg = "请先选择待处理任务";
          this.alterMsg.color = 1;
          return;
        }
        this.openAlertDialog(operState);
        this.getTrialProduct();
      }else if(operState == "openSuspiProduct"){
        //打开可疑品记录框
        if(this.form.id==''){
          this.alterMsg.msg = "请先选择待处理任务";
          this.alterMsg.color = 1;
          return;
        }
        this.openAlertDialog(operState);
        this.queryBdDiscardByOpCode();
      }else {
        //打开dialog弹窗
        if ( operState == "openTrans" || operState == "openMaterRack" || operState == "openReportInfo" || operState == "openOpBindMrl") {
            this.openAlertDialog(operState);
        }else {
          //如果是点击完工按钮，则弹框提示检测回馈信息
          if(operState=="finish"){
            this.checkAllowEndReport();
          }else if(operState == "start" && this.kai == "报工"){
            this.openAlertDialog("report");
            this.queryBdDiscardByOpCode();
          }else{
            this.doSubmit(operState);
          }
        }
      }
    },

    //禁用按钮状态 并修改背景颜色
    changeButtonColor(woState) {
      if (woState == "待开工" || woState == "已开工" || woState == "报工") {
        //调整按钮文字及颜色
        this.divColor3 = "background: white; color:#2196f3;";
        this.divColor2 = "background: white; color:#2196f3;";
        this.divColor1 = "background: rgb(33, 100, 243);color:white;";
        woState == "待开工" ? (this.kai = "开工") : (this.kai = "报工");
        this.ting = "停工";
        return;
      } else if (woState == "完工") {
        this.divColor1 = "background: white; color:#2196f3;";
        this.divColor3 = "background: white; color:#2196f3;";
        this.divColor2 = "background: rgb(33, 100, 243);color:white;";
        return;
      } else if (woState == "暂停") {
        //调整按钮文字及颜色
        this.divColor1 = "background: white; color:#2196f3;";
        this.divColor2 = "background: white; color:#2196f3;";
        this.divColor3 = "background: rgb(33, 100, 243);color:white;";
        woState == "暂停" ? (this.ting = "复工") : (this.ting = "停工");
        return;
      }
    },

    //报工按钮点击弹窗
    openAlertDialog(operState) {
      if (operState == "report") {
        this.openAlert = true;
      } else if (operState == "openTrans") {
        this.openTrans = true;
      }else if (operState == "openReportInfo") {
        this.openReportInfo = true;
      } else if (operState == "openOpBindMrl") {
        this.openOpBindMrl = true;
      }else if (operState == "openTrialProduct") {
        this.openTrialProduct = true;
      }else if (operState == "openSuspiProduct") {
        this.openSuspiProduct = true;
      }
    },
    closeAlertDialog() {
      this.openAlert = false;
      this.openTrans = false;
      this.openMaterRack = false;
      this.openReportInfo = false;
      this.openOpBindMrl = false;
      this.openTrialProduct = false;
      this.openSuspiProduct = false;
      this.openFinshReport=false;
    },

    //新增首末检测
    addCheckBill(operType){
      //请求之前校验【2020-0318逻辑变更  只有再开工之后才能创建首检单据】  
      //(this.form.disCodeState== "报工" || this.form.disCodeState== "完工") &&
      if((this.form.disCodeState== "待开工" || this.form.disCodeState== "完工") && operType=="ZZP_SJ"){
        this.ZZP_SJ=true;//首末检
        this.alterMsg.msg="首检单据必须在开后之后且在完工之前创建";
        this.alterMsg.color=parseInt(1);
        return;
      };
      //创建单据之前校验：工艺资源和原材料必填
      if(!this.checkBindOps()){
        return;
      }else if(!this.checkBindMrls()){
        return;
      };
      // 请求参数
      let form = new FormData();
      form.append("trackOrderId", this.form.id);//派工单ID
      form.append("chkTypeCode", operType);//检测类型:首检 末检
      form.append("lotCode", '');
      form.append("remark", '');

      form.append("workCellId", this.workCell.workCellId); //绑定的工位
      form.append("workOrderCode", this.form.workOrderCode);//换人|班次|换单
      form.append("uda1", this.workClass.workClassCode);
      form.append("myUser", this.myUser);

      http.post({url: "productPadCommController!addCheckBillByReport.m",data: form})
       .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
          }
          //提示框消息展示
          this.alterMsg.msg=(res.data.msg=="OK"?"":res.data.msg);
          this.alterMsg.color=parseInt(res.data.erroCode);
      })
      .finally(e => {
        // loading.close();
      }); 
    },

    //按钮报工检查是否允许点击
    checkIsAllowClick(operType){
      if(this.form.disCodeState=='完工' && (operType=='start' || operType=='report' || operType=='pause' || operType=='back' || operType=='finish')){
          this.alterMsg.msg = "当前任务已完工,禁止其他操作";
          this.alterMsg.color = parseInt(1);
          return;
      }else if(this.form.disCodeState=='待开工' && (operType=='report' || operType=='pause' || operType=='back' || operType=='finish')){
          this.alterMsg.msg = "禁止操作,当前任务还未开工";
          this.alterMsg.color = parseInt(1);
          return;
      }else if(this.form.disCodeState=='已开工' && operType=='back'){
          this.alterMsg.msg = "禁止复工操作,当前任务不是暂停状态";
          this.alterMsg.color = parseInt(1);
          return;
      }else if(this.form.disCodeState=='暂停' && (operType=='start' ||  operType=='report'  || operType=='finish')){
          this.alterMsg.msg = "禁止操作,请先复工再进行操作";
          this.alterMsg.color = parseInt(1);
          return;
      }
    },

//检测是否为有效的数值
    checkIsNaN(data){
      if(data){
        this.alterMsg.msg = "";
        this.alterMsg.color = parseInt(0);

        if(typeof data != 'number' && isNaN(data)){
          this.alterMsg.msg = "请输入一个有效的数值";
          this.alterMsg.color = parseInt(1);
          return false;
        }else if(parseInt(data)<0){
          this.alterMsg.msg = "输入的值必须为正整数";
          this.alterMsg.color = parseInt(1);
          return false;
        }
      }
      return true;
    },
//获取不良明细
    queryBdDiscardByOpCode(){
      // 请求参数:获取工位
      let form = new FormData();
      form.append("uexpTrackOrderId", this.form.id);//派工单ID
      form.append("workCellId", this.workCell.workCellId); //绑定的工位
      form.append("workCellCode", this.workCell.workCellCode);
      // 发送请求:根据操作报工
      http.post({ url: "productPadCommController!queryBdDiscardByOpCode.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            if (resData.length != 0) {
              this.discListData = resData;
            }

            if(this.form.discardQty==0){//如果为初始值,则默认带出可报废数量
              this.form.discardQty=parseInt(res.data.discardQty || 0);
            }
          }else{
            //提示框消息展示
            this.alterMsg.msg = res.data.msg;
            this.alterMsg.color = parseInt(res.data.erroCode);
          }
        });
    },
    tabChange(value){//切换tab
      if(!this.form.id){
        this.active=0;
        Toast.info({message: '请先选择待处理任务',time: "3000", close: false});
        return;
      }
    },
    //开工 复工 停工
    doSubmit(type) {
      //按钮切换状态转化
      if (type == "start") {
        if (this.kai == "报工") {
          type = "report";
        }
      }
      if (type == "pause") {
        this.ting == "复工" ? (type = "back") : (type = "pause");
      }

      if(this.form.disCodeState=='完工' && (type=="report" || type == "pause")){
        this.alterMsg.msg = "当前任务已完工,禁止"+type+"操作";
        this.alterMsg.color = parseInt(1);
        return;
      }

      // 请求参数:获取工位
      let form = new FormData();
      //校验当前任务
      if (this.form.workOrderCode == "" || !this.form.workOrderCode) {
        this.alterMsg.msg = "没有当前任务,禁止报工";
        this.alterMsg.color = parseInt(1);
        return;
      }else{
        //设备模具校验
        if(!this.tool || !this.equip || !this.person){
          this.alterMsg.msg = "报工时设备及模具信息必填";
          this.alterMsg.color = parseInt(1);
          return;
        }
        //如果非首工序，且最大报工量等于0,则终止
        if (this.form.isFrist == "NO" && (!this.form.reportNum || this.form.reportNum==0) ) {
          this.alterMsg.msg = "最大可报工数量为0,请先解绑料车,再进行报工操作";
          this.alterMsg.color = parseInt(1);
          return;
        }
      }

      if (type == "report") {
        //报工时校验填报 良品/报废 数量
        if(!this.checkReportQty()){
          return;
        }

        form.append("effectiveQty", this.form.goodQty); //良品数量
        form.append("uneffectiveQty", this.form.badQty); //不良品数量
        form.append("discardQty", this.form.discardQty); //报废数量
        //报废不良项主键 及 明细数量
        //form.append("bdDiscardIds", this.checkbox.value1); 
        //form.append("bdDiscardQtys", JSON.stringify(this.discListData));
      }
      if(type == "start" || type == "report"){
        //开工时校验绑定的工序工艺参数,必填写
        if(!this.checkBindOps()){
          return;
        }
        if(type == "report"){
          if(!this.checkBindMrls()){
            return;
          }
        }
        form.append("dispatchId", this.form.id); //派工单ID
        //工序工艺资源信息
        form.append("bindOps", JSON.stringify(this.bindOpRes));
        form.append("person", this.person);
        form.append("equip", this.equip);
        form.append("tool", this.tool);
        //开工的时候原材料如果录入就保存，不录入就不保存,但是报工时必须填写
        form.append("bindMrls", JSON.stringify(this.bindMrls));
      }
      //校验是否为正常操作
      this.checkIsAllowClick(type);

      form.append("loginName", this.person);//操作人员编码
      form.append("equipment", this.equip+"_"+this.tool);//设备_模具
      form.append("workCellId", this.workCell.workCellId); //绑定的工位
      form.append("workCellCode", this.workCell.workCellCode);
      form.append("type", type); //操作类型

      //对派工操作时[开工/完工/暂停/报工],记录工时
      form.append("trackOrderId", this.form.id);
      form.append("workOrderCode", this.form.workOrderCode);
      form.append("dispatchCode", this.form.dispatchCode);

      form.append("myUser", this.myUser);
     
      form.append("uda1", this.workClass.workClassCode);//换人|班次|换单
      // const loading = Loading({text: '加载中...',size: 60,});

      // 发送请求:根据操作报工
      http.post({ url: "productPadCommController!doSubmit.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            //按钮的启用和禁用
            this.queryCurWork();
            this.alterMsg.msg = '';
          }
          // this.checkbox.value1=[];//不良明细选择的值清空   
          //提示框消息展示
          this.closeAlertDialog();
          this.alterMsg.msg = res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },

//检测是否允许完工
    checkAllowEndReport(){
      // 请求参数:获取工位
      let form = new FormData();
      form.append("uexpTrackOrderId", this.form.id);

      // 发送请求:获取待响应的任务
      http.post({ url: "productPadCommController!checkAllowEndReport.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            if(res.data.data==2){
              this.openFinshReport=true;
              this.checkFinshInfo=res.data.msg;
            }else if(res.data.data==3){
              this.openFinshReport=true;
              this.checkFinshInfo=res.data.msg;
              this.isConfireSubmit=false;
            }else if(res.data.data=="OK"){
              this.doSubmit('finish');
            }else{
              //提示框消息展示
              this.alterMsg.msg = res.data.msg;
              this.alterMsg.color = parseInt(res.data.erroCode);
            }
          }else{
            //提示框消息展示
            this.alterMsg.msg = res.data.msg;
            this.alterMsg.color = parseInt(res.data.erroCode);
          }
        });
    },

    // 发送请求:获取待处理任务
    queryWaitWork(opCode) {
      let form = new FormData();
      form.append("workCellId", this.workCell.workCellId); //工位
      form.append("opCode", !opCode?"":opCode);

      http.post({ url: "productPadCommController!queryWaitWork.m", data: form })
        .then(res => {
          this.list=[];
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            if (resData.length != 0) {
              this.list = resData;
              if(!opCode){
               this.opCodes={};
               this.opCodes=JSON.parse(res.data.opCodes);
              }
            }
          }
          //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
    // 发送请求:查询报工记录
    queryDaqInfo() {
      let form = new FormData();
      form.append("workCellId", this.workCell.workCellId); //工位

      http.post({ url: "productPadCommController!queryDaqInfo.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            if (resData.length != 0) {
              this.daqInfos = resData;
            }
          }
          //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
//校验绑定的工序工艺参数值值
    checkBindOps(){
      //工序资源保存验证
        if (!this.person || !this.tool || !this.equip) {
          this.alterMsg.msg = "人员、设备、模具信息必填";
          this.alterMsg.color = 1;
          return false;
        }
        //验证填报信息
        for(let j=0;j<this.bindOpRes.length;j++){
          let mapData=this.bindOpRes[j];
          if(!mapData.checkValue){
            this.alterMsg.msg = "请补充完整的工艺资源信息";
            this.alterMsg.color = 0;
            return false;
          }else if(parseInt(mapData.checkValue)<parseInt(mapData.threshold.split("-")[0]) && mapData.threshold.split("-")[0]){//小于最小值
            this.alterMsg.msg = "检测项{"+mapData.checkItem+"}录入的值超出合法范围{"+mapData.threshold+"}";
            this.alterMsg.color = 0;
            return false;
          }else if(parseInt(mapData.checkValue)>parseInt(mapData.threshold.split("-")[1]) && mapData.threshold.split("-")[1]){//大于最大值
            this.alterMsg.msg = "检测项{"+mapData.checkItem+"}录入的值超出合法范围{"+mapData.threshold+"}";
            this.alterMsg.color = 0;
            return false;
          }
        }
        return true;
    },
//校验绑定的原材料信息    
    checkBindMrls(){
        //原材料信息保存验证
        if (!this.bindMrls || this.bindMrls.length == 0) {
          // this.alterMsg.msg = "请先填写原材料信息";
          // this.alterMsg.color = 1;
          return true;
        } else {
          //some every  forEach都无法结束循环，可以用正常的JS语法去解决
          // this.bindMrls.forEach(item => { function });
          for(let j=0;j<this.bindMrls.length;j++){
            let item=this.bindMrls[j];
            if(!item.lotCode || !item.mrlCode || !item.qty || !item.unit){
              this.alterMsg.msg = "请补充完整的原材料信息";
              this.alterMsg.color = 1;
              return false;
            }
          }
        }
        return true;
    },
    //保存时校验报工的良品数和报废数量
    checkReportQty(){
      //良品数量 && 不良品数量
      if (this.form.goodQty == 0 || !this.form.goodQty) {
        this.alterMsg.msg = "请先输入有效的良品数";
        this.alterMsg.color = parseInt(1);
        return false;
      //报工量大于最大可报工数量
      } else if ((parseInt(this.form.goodQty || 0) + parseInt(this.form.discardQty || 0) > parseInt(this.form.reportNum || 0)) && parseInt(this.form.reportNum)!=0) {
        this.alterMsg.msg = "良品(" +(this.form.goodQty || 0) + ")+报废(" + (this.form.discardQty || 0) +")数必须小于可报工数量(" +(this.form.reportNum || 0) + ")";
        this.alterMsg.color = parseInt(1);
        return false;
      }else if(this.form.goodQty < 0 || this.form.discardQty<0){
        this.alterMsg.msg = "输入的数值不能为负数";
        this.alterMsg.color = parseInt(1);
        return false;
      }
      //修改之前为报工时 填写报废数量 及 勾选多选框checkBox的不良项和数量
      //修改之后为再可疑品记录中,通过 + - entry 记录,达到过程管控的目的,目前会根据质检员确认的可疑品数量自动带出为报废数量
      // else if(this.checkbox.value1.length==0 && parseInt(this.form.discardQty || 0)>0){
      //   this.alterMsg.msg = "当存在报废数量时,请勾选不良明细项";
      //   this.alterMsg.color = parseInt(1);
      //   return false;
      // }else if(parseInt(this.form.discardQty || 0)>0){
      //   let blYYQty=0;//不良原因明细 数量之和
      //   let selectArr=this.checkbox.value1;
      //   let discardQty=parseInt(this.form.discardQty || 0);

      //   for(let j=0;j<this.discListData.length;j++){
      //       let qty=parseInt(this.discListData[j].qty);
      //       let id=this.discListData[j].id;
      //       let name=this.discListData[j].name;
      //       if(selectArr.indexOf(id)!=-1 && (!qty || qty<=0)){
      //         this.alterMsg.msg = "请填写报废明细项("+name+")所对应的数量且数值为正整数";
      //         this.alterMsg.color = parseInt(1);
      //         return false;
      //       }
      //   };
      //   if(this.checkbox.value1 && this.checkbox.value1.length>0){
      //     this.discListData.forEach(item => {
      //       if(selectArr.indexOf(item.id)!=-1){
      //          blYYQty+=parseInt(item.qty);
      //       };
      //      }
      //     );
      //   };
      //   if(blYYQty>discardQty || blYYQty<discardQty){
      //     this.alterMsg.msg = "填报的报废数量("+discardQty+")和报废原因录入的总数量("+blYYQty+")不相等";
      //     this.alterMsg.color = parseInt(1);
      //     return false;
      //   };
      // }
      return true;
    },
    //信息录入 保存
    saveHistoryInfo(paramData) {
      //数据校验
      let form = new FormData();
      if (!this.form.workOrderCode) {
        this.alterMsg.msg = "没有当前任务,请先扫码";
        this.alterMsg.color = 1;
        return;
      }else{
        if (this.form.disCodeState!='已开工') {
          this.alterMsg.msg = "没有开工的任务禁止录入";
          this.alterMsg.color = 1;
          return;
        }
      }

      if(paramData=='bindMrls'){
        //保存时校验绑定的原材料信息
        if(!this.checkBindMrls()){
          return;
        }
        form.append("bindMrls", JSON.stringify(this.bindMrls));
      }else{
        //保存时校验绑定的工序工艺参数值是否合法
        if(!this.checkBindOps()){
          return;
        }
        form.append("bindOps", JSON.stringify(this.bindOpRes));
        form.append("person", this.person);
        form.append("equip", this.equip);
        form.append("tool", this.tool);
      }
      
      form.append("dispatchId", this.form.id); //派工单ID

      http.post({ url: "productPadCommController!saveBindMrlAndOps.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            //保存完成后清空 【这里变更为保存完成后不清空,只能手动点击清空按钮2020-0318】
            if(paramData=='bindMrls'){
              // this.bindMrls = storage.getObject("bindMrls") || [];
            }else{
              // this.bindOpRes =storage.getObject("bindOpRes") || [];
            }
          }

          //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
    //保存转运任务-目的是为了展示料车所在位置
    restTranSport() {
      this.form.materRackCode == ""; //undefined
      this.form.transQty = 0;
    },
    saveMrlTransport() {
      //数据校验
      if(!this.form.id){
        this.alterMsg.msg = "没有待处理任务";
        this.alterMsg.color = 1;
        return;
      }else{
        if (!this.form.materRackCode) {
          this.alterMsg.msg = "请先扫描料车号";
          this.alterMsg.color = 1;
          return;
        }else{
          if (!this.form.transQty || isNaN(this.form.transQty) || this.form.transQty == 0) {
            this.alterMsg.msg = "请先扫输入有效的转运数量";
            this.alterMsg.color = 1;
            return;
          }else if(this.form.transQty<0){
            this.alterMsg.msg = "输入的数值不能为负数";
            this.alterMsg.color = parseInt(1);
            return;
          }
        }
      }
      let form = new FormData();
      form.append("dispatchId", this.form.id); //派工单ID
      form.append("materRackCode", this.form.materRackCode);
      form.append("lotCode", this.form.lotCode);
      form.append("transQty", this.form.transQty);
      form.append("workCellId", this.workCell.workCellId); //工位
      
      http.post({
          url: "productPadCommController!saveMrlTransportInfo.m",
          data: form
        })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            // let resData = JSON.parse(res.data.data);
            // if(resData.length!=0){
            this.form.materRackCode = "";
            this.form.transQty = 0;
            // }
            this.closeAlertDialog();
          }
          //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
    //查看料车位置
    queryShelfPostion(dispatchId) {
      this.materRacks = [];
      let form = new FormData();
      form.append("dispatchId", dispatchId); //选择行所对应的 派工单ID

      this.openMaterRack = true;
      
      http.post({
          url: "productPadCommController!queryShelfPostion.m",
          data: form
        })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            let resData = JSON.parse(res.data.data);
            if (resData.length != 0) {
              this.materRacks = resData;
            }
          }
          //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },

    //添加行
    addRows() {
      // let size=this.bindMrls.length+1;
      let map = new Map();
      // map["lotCode"]="";
      // map["mrlCode"]="";
      // map["qty"]="";
      // map["unit"]="";
      map.set("lotCode", "");
      map.set("mrlCode", "");
      map.set("qty", "");
      map.set("unit", "");
      this.bindMrls.push(map);
    },

    //刷新行
    refresh(item, index) {
      let map = new Map();
      map["lotCode"] = item.lotCode;
      map["mrlCode"] = item.mrlCode;
      map["qty"] = item.qty;
      map["unit"] = item.unit;
      this.bindMrls[index] = map;
      //解决更新数组之后,试图不同步的问题【还可以时使用 数组的push splice方法新增或删除元素解决】
      this.bindMrls.sort();
    },

    //删除行
    deleteRow(item, index) {
      this.bindMrls.splice(index, 1);
    },
    //重置行
    Reset() {
      this.bindMrls = [{ lotCode: "", mrlCode: "", qty: "", unit: "" }];
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

      http.post({ url: "productPadCommController!getCUser.m", data: form })
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
    // 发送请求:获取工序资源及原材料格式
    queryOpMrlAndRes(type) {
      // 请求参数:获取工位
      let form = new FormData();
      //@update舍弃 2020-0421 根据工位无法确认唯一工序,需要改用派工单中的工序CODE去查找工序模板的维护关系
      // form.append("workCellId", this.workCell.workCellId);
      // form.append("workCellCode", this.workCell.workCellCode); 
      form.append("trackOrderId", this.form.id);
      http
        .post({ url: "productPadCommController!queryOpMrlAndRes.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            if(type==0){
              this.bindMrls = JSON.parse(res.data.mrls);
              this.bindOpRes = JSON.parse(res.data.reslabs);
            }else if(type==1){
              this.bindOpRes = JSON.parse(res.data.reslabs);
            }else{
              this.bindMrls = JSON.parse(res.data.mrls);
            }
            //设置缓存数据
            storage.setObject("bindMrls", JSON.parse(res.data.mrls));
            storage.setObject("bindOpRes", JSON.parse(res.data.reslabs));
          }
           //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
    // 发送请求:根据工位获取默认的设备编码
    getDefaultEquipment() {
      // 请求参数:获取工位
      let form = new FormData();
      form.append("workCellId", this.workCell.workCellId);
      form.append("workCellCode", this.workCell.workCellCode);
      
      http.post({ url: "productPadCommController!getDefaultEquipment.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            this.equip=res.data.data;
          }
           //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
 // 发送请求:根据工位获取默认的设备编码
    getBarCodeByRouteLine() {
      this.toolDisable=true;
      // 请求参数:获取工位
      let form = new FormData();
      form.append("trackOrderId", this.form.id);
      form.append("tool", this.tool);
      
      http.post({ url: "productPadCommController!getBarCodeByRouteLine.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
              this.tool="";
              this.tool=res.data.data;//模具条码号
          }
           //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);

          this.toolDisable=false;
        });
    },
    // 试制品相关方法
    saveTrialProduct() {
      let form = new FormData();
      this.alterMsg.msg = "";
      form.append("uexpTrackOrderId", this.form.id);
      form.append("workCellId", this.workCell.workCellId);
      form.append("workCellCode", this.workCell.workCellCode);
      form.append("goodQty", this.form.goodQtys);
      form.append("badQty", this.form.badQtys);

      if(this.form.goodQtys<0 || this.form.badQtys<0){
        this.alterMsg.msg = "输入的数值不能为负数";
        this.alterMsg.color = parseInt(1);
        return;
      }
      
      http.post({ url: "productPadCommController!saveTrialProduct.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            // this.openTrialProduct=false;
            this.getTrialProduct();
          }
           //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },
    getTrialProduct() {
       // 请求参数:获取工位
      let form = new FormData();
      form.append("uexpTrackOrderId", this.form.id);
      form.append("workCellId", this.workCell.workCellId);
      form.append("workCellCode", this.workCell.workCellCode);
      form.append("goodQty", this.form.goodQty);
      form.append("badQty", this.form.badQty);

      http.post({ url: "productPadCommController!getTrialProduct.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            var data=res.data.data;
            if(data){
              this.form.goodQtys=data.goodQty;
              this.form.badQtys=data.badQty;
            }
          }else{
            //提示框消息展示
           this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
           this.alterMsg.color = parseInt(res.data.erroCode);
          }
        });
    },

    
    // 可疑品相关方法
    saveSuspiProduct(item,operType) {
      // 请求参数:获取工位
      this.alterMsg.msg = "";
      let form = new FormData();
      form.append("uexpTrackOrderId", this.form.id);
      form.append("workCellId", this.workCell.workCellId);
      form.append("workCellCode", this.workCell.workCellCode);
      form.append("operType", operType);

      form.append("suspiQtys", this.formSuspiQtys);//formSuspiQtys this.form.suspiQtys
      form.append("item", JSON.stringify(item));

      if(isNaN(item.qty) || (operType=='del' && item.qty==0) || item.qty<0){
        this.alterMsg.msg = "不良原因["+item.name+"]的可疑品数量必须为正整数";
        this.alterMsg.color = 1;
        return;
      }

      http.post({ url: "productPadCommController!saveSuspiProduct.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            // this.openSuspiProduct=false;
            this.queryBdDiscardByOpCode();
          }
           //提示框消息展示
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
        });
    },

    restSuspiProduct() {
       // 请求参数:获取工位
      let form = new FormData();
      form.append("loginName", this.person);//操作人员编码
      form.append("uexpTrackOrderId", this.form.id);
      
      http.post({ url: "productPadCommController!restSuspiProduct.m", data: form })
        .then(res => {
          if (res.status == 200 && res.data.erroCode == 0) {
            this.form.discardQty=res.data.data;
          }
          this.queryBdDiscardByOpCode();
           //提示框消息展示
          this.openIsSave=false;
          this.alterMsg.msg = res.data.msg == "OK" ? "" : res.data.msg;
          this.alterMsg.color = parseInt(res.data.erroCode);
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
    },
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
    //获取默认的设备
    this.getDefaultEquipment();

    this.queryWaitWork();
  }
};
</script>

<style lang="scss" scoped>
// span{
//     border:1px solid rgb(112, 110, 110);
// }
//顶部工序编码 圆圈选择按钮
.bottomRing{
  position:fixed;
  top:20%;
  // bottom: 0%;
  //left: 40%;
  // width:20%;
  .sonButton{
    //display: inline-block;
    vertical-align: bottom;
    margin-bottom:1%;
    margin-left:3%;
    opacity:0.5;
  }
}

//多选框
.border-div{
  border: 1px solid rgb(112, 110, 110);
  border-radius: 15px;
  line-height: 1.2rem;
  font-size: 1.2rem;
  background-color: rgb(209, 209, 209);
}

.mu-dialog{
  height:60%;
  .mu-dialog-title{
    height:15%;
  }
  .mu-dialog-body{
    height:70%;
  }
  .mu-dialog-actions{
    height:15%;
  }
}

//dialog弹框中 input样式
// mu-dialog-wrapper 和 product 是平级的 所以应该定义再外层
.mu-dialog-wrapper /deep/ .dialog-div {
  border: 1px solid rgb(112, 110, 110);
  border-radius: 15px;
  text-align: center;
  font-size: 1.3rem;
  //span元素块
  .span-lable{
    display: inline-block;
    text-align: right;
    margin-right: 2%;
    width: 20%;
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
    .mu-input-content {
        height: 100%;
        position: relative;
        background-color: white;
    }
  }
  button{
    font-size:1.3rem;
  }
}

//弹性布局样式 【-行两列】
.flex-content{
   display: flex;
   flex-direction: row;//排列方式
   flex-wrap: wrap;//换行
   text-align: center;
  .flex-item {
    margin: 0px auto;//.5% 2%
    width:  50%;
    height: 16%;
    span,div{
      display: inline-block;
      line-height: 100%;
    }
    span{
      width: 25%;
      height: 100%;
      margin-left:1%;
      text-align: right;
      padding-right: .2rem;
    }
    div{
      width: 70%;
      height: 100%;
    }
  }
}

.flex-ul-start{
  display: flex;
  flex-direction: row;//排列方式
  flex-wrap: wrap;//换行
  align-items:flex-start;
  text-align: center;//侧轴顶部对齐
  width:100%;
  height:100%;
  padding: .5% .5% 0%;
  .flex-li-start{
    width:25%;
    height:20%;
    span,input{
      height:60%;
      vertical-align:middle;
      // display: inline-block;
    }
    span{
      width:46%;
    }
    input{
      width:53%;
      margin-left:3px;
    }
  }
}

//鼠标悬停
.information-title {
  color: #19d3ea;
  font-size: 18px;
  cursor: pointer;  /*鼠标悬停变小手*/
  width: 100%;
  display: none;
  position: absolute;
  left:5%;
  top:-10%;
}

//待处理任务样式
.flex-ul{
  display: flex;
  flex-direction: row;//排列方式
  flex-wrap: wrap;//换行
  justify-content:flex-start;
  text-align: center;
  align-items:center;
  padding: .5% .5% 0%;
  .flex-li {
    width:  25%;
    height: 32%;
    margin: 0px auto;//.5% 2%
    // color:#9e9e9e;
    span,div{
      display: inline-block;
      // border: 1px solid rgb(112, 110, 110);
      height: 100%; 
      font-size: 1.2rem;
      line-height: 2rem; //高度是百分比的文字上下居中解决   可以 font-size line-height 配合使用
      vertical-align: middle; //行内元素垂直【水平】不对齐解决 非常重要 参考链接 https://www.w3school.com.cn/css/pr_pos_vertical-align.asp
    }
    span{
      width: 28%;
      margin-left:1%;
      text-align: right;
      padding-right: .2rem;
    }
    div{
      width: 60%;
      text-align: left;
      padding-left: .35rem;
    }
  }
}
.flex-ul:hover {
  background: #eee;
}
.flex-ul-hover {
  background: '#E8E8E8';
}

.success {
  color: #2cb69a;
  font-weight: 546;
  margin: auto;
}

 .flex-input{
  display: inline-block;
   border:1px solid rgb(112, 110, 110);
   margin-right: 2%;
   width:33%;
   height:2rem;
   font-size:1rem;
   text-align:center;
   font-weight: bold;
  }

//表格的样式设置
// elementUI组件修改样式 覆盖无效
// 一、深度作用选择器（ >>> ）
// 二、/deep/ 预处理器less下使用
.other-type {
  font-size: 1rem;//定义的是td的��度
  text-align: center;
}

//表格头thead样式定义
/deep/ .mu-table th {
  text-align: center;
}
/deep/ .mu-table th.headColumns {
  color: #f0f0f0;
  font-weight: bolder;
  font-size: 1rem !important;
  background-color: gray;
  border-right: 1px solid #f0f0f0;
  text-align: center;
}

.mu-table /deep/.mu-table-body-wrapper {
  overflow-y: scroll;
  overflow-x: scroll;
}

//没有数据时的样式
/deep/.mu-table .mu-table-empty {
  font-weight: 400; //定义由粗到细的字符。400 等同于 normal，而 700 等同于 bold
  font-size: 4rem !important;
  height: 98%;
}

.mu-item-empty{
  width: 100%;
  height: 18rem;
  font-weight: 400;
  font-size: 1.5rem !important;
  line-height: 18rem;
  color:  gray;
}

.mu-tabs .mu-tab{
  font-size: 1.2rem;
}

//页面  可视区域占比
#product {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;

  //顶部隐藏菜单样式
  .pro-top-menu {
    position: absolute;
    top: 3.8rem;
    right: .2rem;
    width: 10%;
    z-index: 999;
    text-align: center;
    .top-box {
      width: 80%;
      height: 2rem;
      float: left;
      margin-top: 4%;
      font-size: 1.2rem;
      color: white;
      line-height: 30px;
      border-radius: 8px;
      cursor: pointer;
      background: #2164f3;//  rgb(33, 100, 243)
    }
  }

    //tabs 核心功能菜单paper
    /deep/.demo-paper{
      padding-top:2%;
      height:80%;
    }

  //核心主题内容 切换按钮 height：73%
  .container {
    padding: 0;
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

    //功能分区样式
    .pro-demo {
      min-height: 60vh;
      .pro-demo-title {
        margin: 0.5rem auto;
        background: #eae7e7;
        padding-left: 20px;
        height: 3vh;
        line-height: 3vh;
      }
      .pro-saoma {
        width: 80%;
        margin: 0.6rem auto;
        text-align: center;
        position: relative;
        //元素样式
        input {
          width: 60%;
          height: 2.6rem;
        }
        //流转卡扫码(圆角)
        /deep/ .input-radius {
          border: 1px solid rgb(33, 100, 243);
          border-radius: 30px; //圆角设置
          padding-left: 1.2rem;
        }
        //图标
        .pro-saoma-search {
          position: absolute;
          top: 15%;
          right: 21%;
        }
      }


      //信息录入
      .center {
        height: 20rem;
        position: relative; //铭记:relative作为父元素<包含块>  absolute作为子元素定位  配合使用
        font-size: 1rem;
        line-height: 0.8rem;
        .center-divider {
          margin-bottom: 0.2rem;
        }
        //按钮样式布局
        .center-button {
          height: 2.5rem;
          text-align: center;
          .center-button-divider {
            font-size: 1rem;//font-size 属性的继承性：父元素是 em或百分比单位，并且只传递子元素 【div-40px >div-50% >div 最后的div字体大小未 10px=40*.5*.5  】
            width: 20%;
            margin: .5% 1%;
            border-radius: 15px;
          }
        }
        .center-left {
          width: 75%;
          height: 82%;
          border: 1px solid rgba(0, 0, 0, 0.12);
          overflow-y: scroll;
          overflow-x: hidden; //溢出
          line-height: 2.3rem;
          .center-left-title {
            display: inline-block;
            width: 11%;
            text-align: right;
            padding-right: 5px;
          }
          .center-left-content {
            display: inline-block;
            width: 13%;
            height: 2rem;
            padding-left: 0.1rem;
            padding-right: 0.1rem;
          }
          .center-left-button {
            margin-top: 1%;
          }
        }
        .center-right {
          position: absolute;
          right: 0px;
          top: 3.6rem;
          width: 23%;
          height: 82%;
          border: 1px solid rgba(0, 0, 0, 0.12);
          line-height: 2.3rem;
          .center-right-title {
            display: block;
            width: 50%;
            text-align: left;
            margin-left: 5%;
            margin-top: 3.5%;
          }
          .center-right-content {
            display: block;
            width: 70%;
            margin-left: 15%;
            margin-top: 3%;
          }
        }
      }

      //布局标题
      .center-title{
        display:inline-block;
        width:100%;
        height:8%;
        border-radius: 15px;
        text-align:center;
        font-size:1.2rem;
        line-height:1.2rem;
      }

      //第一页底部报工按钮
      .pro-shunxu {
        width: 100%;
        min-height: 40px;
        border-top: 1px solid rgb(33, 100, 243);
        border-bottom: 1px solid rgb(33, 100, 243);
        border-radius: 15px;
        overflow: hidden;
        font-size: 1.2rem;
        div {
          float: left;
          width: 20%;
          min-height: 40px;
          line-height: 40px;
          text-align: center;
          border-left: 1px solid rgb(33, 100, 243);
          color: rgb(33, 100, 243);
          cursor: pointer;
        }
        // div:hover {
        //   background: rgb(33, 100, 243);
        //   color: white;
        // }
      }
    }

    .pro-demo-from {
      padding-top: 20px;
    }
  }

//消息提醒框
  .pro-tips {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 5%;
    line-height: 2rem;
    font-size: 1.35rem;
    font-weight: bold;
    margin-top: 1vh;
    // margin-bottom: 0px;
    padding: .2rem 2rem .2rem;
  }
}

.line-limit-length {
  display: block;//块状显示
  overflow: hidden;//隐藏文字
  text-overflow: ellipsis;//显示...
  white-space: nowrap;//不换行
}

</style>
<!--
//mu-list 等同于 ul标签  mu-list-item 等同于 li  
//标签mu-item-wrapper 等同于 li>a  通过对a标签样式的修改
// /deep/ li{
//   width:100%;
//   height: 20%;
//   .mu-item-wrapper{
//     width: 100%;
//     .mu-item{
//       width:100%;
//       height: 100%;
//     }
//   }
// }-->


