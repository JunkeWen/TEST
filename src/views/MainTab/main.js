// import Vue from 'vue'
// import App from './App.vue'
// import store from '@/store'
// import VueI18n from 'vue-i18n'
// //todo 引入下面的js，准备使用双层架构，既可以在app内使用，也可以在浏览器端开发调试
// import appCommon from '../../utils/doubleApi.js'
// import Storage from '../../utils/storage'
// //主要ui组件库
// import MuseUI from 'muse-ui';
// import 'muse-ui/dist/muse-ui.css';
// import '../../assets/font/material-icons.css'
// import "muse-ui-loading/dist/muse-ui-loading.css";
// import Progress from 'vue-multiple-progress'

// import '../../assets/style/main.scss'
// //new appCommon.DoubleApi().ready(Vue,App,VueI18n,MuseUI,Loading)
// Vue.use(MuseUI).use(VueI18n).use(Progress);

// Vue.config.productionTip = false
// //解决app的一个报错提醒：[WDS] Disconnected! 
// module.hot ? module.hot.accept() : null

// const doubleProp = new appCommon.DoubleProp()

// let lang = Storage.getObject('lang')
// const i18n = new VueI18n({
//     locale: lang ? lang.value : 'cn',
//     fallbackLocale: 'cn',
//     messages: {
//         'cn': require('../../utils/lang/cn'), // 中文语言包
//         'en': require('../../utils/lang/en') // 英文语言包
//     },
//     silentTranslationWarn: true   //去掉 无法转换keypath'....'的值 的报错
// })

// window[doubleProp.ready] = () => {
//     let doubleApi = new appCommon.DoubleApi(window.api)
//     new Vue({
//         store,
//         i18n,
//         data: {
//             api: doubleApi
//         },
//         render: h => h(App)
//     }).$mount('#app')
// }
import App from './App.vue'
import Main from '../../utils/start'
import "muse-ui-loading/dist/muse-ui-loading.css";
import Loading from "muse-ui-loading";
import Progress from 'vue-multiple-progress';

let start = new Main.Start(App)
start.ready(Loading,Progress)