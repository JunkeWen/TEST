<template>
  <div id="product">
  <mu-tabs :value.sync="active">
    <mu-tab>TAB ITEM 1</mu-tab>
    <mu-tab>TAB ITEM 2</mu-tab>
    <mu-tab>TAB ITEM 3</mu-tab>
  </mu-tabs>
  <div class="demo-text" v-if="active === 0">
    <p>{{data1}}</p>
  </div>
  <div class="demo-text" v-if="active === 1">
    <p>DSFDS</p>
    <p>“如果我后退呢？如果我想要死呢？我不想你再次背对着我逃跑了……”</p>
    <p>“那么就去地狱找到你，我绝对不逃！”</p>
    <p>“白痴，你也哭了？因为那些软弱拖累你的脚步？”</p>
  </div>
  <div class="demo-text" v-if="active === 2">
    <p>“不，这泪水……是因为勇气，因为力量，因为信任，……你不会懂的！”</p>
    <p>“我不会帮你，想要什么样的未来……自己去追寻吧！”</p>
    <p>“我不需要你的帮忙！未来我会一手开启，什么样的敌人我也不会惧怕……还有，其实我们可以成为朋友的……”</p>
    <p>“也许吧，未来……给你了。”</p>
  </div>
  </div>
</template>

<script>
import http from "../../../utils/http.js";
import SafeHeader from "../../../components/safeHeaderMenu";
import storage from "../../../utils/storage.js";
import "muse-ui-loading/dist/muse-ui-loading.css";
import "muse-ui-message/dist/muse-ui-message.css";
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
 
  },
  data() {
    return {
      LIST2:[],
      data1:'AAAAAAAAAAAAAAAAAAAAAAAAAAA',
      active:0,
      wl1:12,
      wl2:12,
      wl3:12,
    };
  },
  computed: {
 
  },
  watch: {
   
  },
  methods: {
   

   initMethod(){
     http.post({url: "productPadCommController!vueTest.m", data: {}})
         .then(res => {
           if (res.status == 200 && res.data.erroCode == 0) {
            this.data1= res.data.data;
           }else{
             
           }
         });
   }


  },
  mounted: function() {
    this.initMethod();
  }
};
</script>

<style lang="scss" scoped>
.demo-text {
  padding: 16px;
  background: #fff;
  p {
    margin: 8px 0;
  }
}

// .mu-tabs{  
//  position:fixed;
//  display: block;
//  width:10%;
//  height: 100%;
// }

// .demo-text{
//   border: 1px solid;
//   position:fixed;
//   left:10%;
//   top:0px;
//   width: 90%;
//   height: 100%;
//   background-color: lavender;
// }

</style>



