(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-eb34b16a"],{6758:function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return t.loading?e("div",[e("v-progress-linear",{attrs:{value:100,height:"25",color:t.fishingColor}},[[e("strong",[t._v(t._s(t.$t("detail.countDown.loading")))])]],2)],1):e("div",[t.fish.countDownType===t.WAITING?e("div",[e("v-progress-linear",{attrs:{height:"25",color:t.fishingColor}},[[e("v-tooltip",{attrs:{top:"",color:"secondary"},scopedSlots:t._u([{key:"activator",fn:function(n){var i=n.on,o=n.attrs;return[e("div",t._g(t._b({staticClass:"d-flex align-center"},"div",o,!1),i),[e("strong",[t._v(t._s(t.$t(t.fish.countDownTypeName,{interval:t.countDownTimeText})))])])]}}],null,!1,3615994076)},[e("span",[t._v(t._s(t.fish.countDownTimePointText))])])]],2)],1):t.fish.countDownType===t.FISHING?e("div",[e("v-progress-linear",{attrs:{value:t.countDownRemainPercentage,height:"25",color:t.fishingColor},scopedSlots:t._u([{key:"default",fn:function(n){var i=n.value;return[e("v-tooltip",{attrs:{top:"",color:"secondary"},scopedSlots:t._u([{key:"activator",fn:function(n){var o=n.on,s=n.attrs;return[e("div",t._g(t._b({staticClass:"d-flex align-center"},"div",s,!1),o),[e("v-icon",{attrs:{size:"20"}},[t._v(t._s(t.mdiAlarm))]),e("strong",[t._v(" "+t._s(t.$t(t.fish.countDownTypeName,{interval:t.countDownTimeText}))+" ("+t._s(i)+"%) ")]),t.fish.addBuffSuffix?e("effect-icon",{staticStyle:{"margin-left":"2px"},attrs:{"icon-class":t.fish.predatorsIcon,title:t.$t("list.item.countDown.fisherIntuitionHint")}}):t._e()],1)]}}],null,!0)},[e("span",[t._v(t._s(t.fish.countDownTimePointText))])])]}}],null,!1,325230500)})],1):t.fish.checkInfo&&(t.fish.checkInfo.timeRestricted||t.fish.checkInfo.weatherRestricted)?e("div",{staticClass:"d-flex justify-center"},[e("v-icon",{attrs:{small:"",color:"warning"}},[t._v(t._s(t.mdiAlertOutline))]),e("span",{staticClass:"warning--text"},[t._v("开荒中")])],1):e("div",[e("v-progress-linear",{attrs:{value:100,height:"25",color:t.fishingColor}},[[e("strong",[t._v(t._s(t.$t(t.fish.countDownTypeName)))])]],2)],1)])},o=[],s=e("5530"),a=e("63ea"),c=e.n(a),r=e("2f62"),l=e("94ed"),u=e("1aeb"),f=e("ecdf"),h={name:"DetailItemCountdownBar",components:{EffectIcon:f["a"]},props:{fish:{type:Object,default:void 0}},data:function(){return{mdiAlarm:l["b"],mdiAlertOutline:l["f"],FISHING:u["a"].FISHING,WAITING:u["a"].WAITING,loading:!0,countDownTimeText:"",countDownRemainPercentage:void 0}},computed:Object(s["a"])(Object(s["a"])({},Object(r["e"])(["now"])),{},{countDownTime:function(){return this.fish.countDownTimePoint-this.now},fishingColor:function(){return u["a"].getColorByStatus(this.$vuetify.theme.currentTheme,this.fish.isCompleted,this.fish.countDownType)}}),watch:{"fish.id":{handler:function(){var t=this;this.loading=this.fish.countDownType!==u["a"].ALL_AVAILABLE&&this.fish.countDownTime>u["a"].INTERVAL_MINUTE,setTimeout((function(){return t.loading=!1}),500)},immediate:!0},countDownTime:function(t){var n=this.printCountDownTime(t,2);c()(this.countDownTimeText,n)||(this.countDownTimeText=n);var e=Math.ceil(t/this.fish.countDownTotal*100);this.countDownRemainPercentage!==e&&(this.countDownRemainPercentage=e)}},methods:{printCountDownTime:u["a"].printCountDownTime}},d=h,v=e("2877"),m=e("6544"),p=e.n(m),g=e("132d"),w=e("8e36"),T=e("3a2f"),_=Object(v["a"])(d,i,o,!1,null,"4525d7ba",null);n["default"]=_.exports;p()(_,{VIcon:g["a"],VProgressLinear:w["a"],VTooltip:T["a"]})},"71ff":function(t,n,e){},addb:function(t,n,e){"use strict";e("71ff")},ecdf:function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"item-icon-style",attrs:{title:t.title}},[t.iconUrl?e("v-img",{staticClass:"effect-icon-24-32",attrs:{src:t.iconUrl}}):e("div",{class:t.iconClass+" effect-icon-24-32"})],1)},o=[],s={name:"EffectIcon",props:{iconClass:{type:String},iconUrl:{type:String},title:{type:String}}},a=s,c=(e("addb"),e("2877")),r=e("6544"),l=e.n(r),u=e("adda"),f=Object(c["a"])(a,i,o,!1,null,"996ad178",null);n["a"]=f.exports;l()(f,{VImg:u["a"]})}}]);