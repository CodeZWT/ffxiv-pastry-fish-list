(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-2d0d5c41"],{"704f":function(n,t,e){"use strict";e.r(t);var i=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-expansion-panels",{attrs:{hover:"",flat:"",tile:""},model:{value:n.lazyExpansionValue,callback:function(t){n.lazyExpansionValue=t},expression:"lazyExpansionValue"}},[e("v-expansion-panel",{staticClass:"system"},[e("v-expansion-panel-header",{staticClass:"system"},[e("div",{staticStyle:{display:"flex","justify-content":"center"}},[e("div",[e("v-icon",[n._v(n._s(n.mdiBook))]),n._v(" 查看攻略 ")],1)])]),e("v-expansion-panel-content",[n.hasTips(n.fish.id)?e("v-row",{staticStyle:{margin:"0 -20px -16px -20px"},attrs:{"no-gutters":""}},[e("v-col",{attrs:{cols:"12"}},[e("tip7",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip5",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip3",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip2",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip1",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip4",{attrs:{id:n.fish.id}})],1),e("v-col",{attrs:{cols:"12"}},[e("tip6",{attrs:{id:n.fish.id}})],1)],1):e("div",{staticClass:"text-center"},[n._v("暂无攻略")])],1)],1)],1)},a=[],s=(e("caad"),e("d3b7"),e("2532"),e("dd1b")),l=e("94ed"),o=e("1aeb"),c={name:"DetailItemTips",components:{Tip1:function(){return e.e("chunk-55c8ae2e").then(e.bind(null,"a945"))},Tip2:function(){return e.e("chunk-f363ac68").then(e.bind(null,"f7e8"))},Tip3:function(){return e.e("chunk-b985ce72").then(e.bind(null,"e9c7"))},Tip4:function(){return e.e("chunk-2a736ee8").then(e.bind(null,"8c9e"))},Tip5:function(){return e.e("chunk-9289ffd4").then(e.bind(null,"40e8"))},Tip6:function(){return e.e("chunk-7d9d08b0").then(e.bind(null,"d765"))},Tip7:function(){return e.e("chunk-62e1d81b").then(e.bind(null,"ba76"))}},props:{fish:{type:Object,default:void 0},expanded:{type:Boolean,default:!1}},data:function(n){return{mdiBook:l["n"],lazyExpansionValue:n.expanded?0:void 0}},watch:{expanded:function(n){this.lazyExpansionValue=n?0:void 0},"fish.id":function(){this.lazyExpansionValue=this.expanded?0:void 0}},methods:{hasTips:function(n){return s["BIG_FISH"].includes(n)||o["a"].TIP3_FISH_IDS.includes(n)||o["a"].TIP5_FISH_IDS.includes(n)}}},d=c,u=e("2877"),p=e("6544"),r=e.n(p),h=e("62ad"),f=e("cd55"),v=e("49e2"),x=e("c865"),b=e("0393"),y=e("132d"),k=e("0fd9"),V=Object(u["a"])(d,i,a,!1,null,null,null);t["default"]=V.exports;r()(V,{VCol:h["a"],VExpansionPanel:f["a"],VExpansionPanelContent:v["a"],VExpansionPanelHeader:x["a"],VExpansionPanels:b["a"],VIcon:y["a"],VRow:k["a"]})}}]);