(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-2d0e1bfd"],{"7c83":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{"background-color":"#1e1e1e"}},[a("v-subheader",[t._v(t._s(t.$t("task.detail.title")))]),t._l(t.fish.tasks,(function(e){return a("v-alert",{key:e.id,staticClass:"rounded-0 mb-0",attrs:{border:"top","colored-border":"",color:"secondary"}},[a("div",{staticClass:"d-flex align-center my-1"},[a("span",[t._v(t._s(t.$t("task.detail.taskTitle",[e.name])))]),a("v-spacer"),a("v-btn",{attrs:{text:"",outlined:""},on:{click:function(a){return t.goTo(e)}}},[t._v(" "+t._s(t.$t("task.detail.checkTaskDetail"))+" "),a("v-icon",{attrs:{right:""}},[t._v(t._s(t.mdiLinkVariant))])],1)],1),e.title?a("div",{staticClass:"my-1"},[t._v(" "+t._s(t.$t("task.detail.rewardTitle",[e.title]))+" ")]):t._e(),e.comment?a("div",{staticClass:"my-1"},[t._v(" "+t._s(t.$t("task.detail.comment"))+" "),a("span",{domProps:{innerHTML:t._s(e.comment)}})]):t._e(),a("div",{staticClass:"my-1"},[a("i18n",{attrs:{path:"task.detail.requirement"}},[e.requireCollectable?[a("i18n",{attrs:{place:"collectable",path:"common.ui.brackets"}},[a("span",[a("i",{staticClass:"xiv collectables",attrs:{title:t.$t("common.game.collectable")}}),t._v(" "+t._s(t.$t("common.game.collectable"))+" ")])])]:[a("span",{attrs:{place:"collectable"}})]],2)],1),a("div",{staticClass:"d-flex align-center my-1 flex-wrap"},t._l(e.items,(function(e){return a("div",{key:e.id,staticClass:"d-flex align-center"},[a("item-icon",{attrs:{"icon-class":e.icon,title:e.name}}),e.isInLog?a("link-list",{attrs:{id:e.id,"angler-id":e.anglerFishId,name:e.name,names:e.names,mode:"fish"}},[a("v-hover",{scopedSlots:t._u([{key:"default",fn:function(s){var i=s.hover;return[a("div",{class:"text-subtitle-1 "+(i?"info--text text-decoration-underline":""),attrs:{title:e.collectable?t.$t("common.game.collectable"):""}},[t._v(" "+t._s(e.name)+" "),e.collectable?a("i",{staticClass:"xiv collectables"}):t._e()])]}}],null,!0)})],1):a("div",{staticClass:"text-subtitle-1"},[t._v(" "+t._s(e.name)+" ")])],1)})),0)])}))],2)},i=[],l=(a("9911"),a("94ed")),n=a("1aeb"),c=a("8b70"),o=a("96a9"),r={name:"DetailItemQuest",components:{LinkList:o["a"],ItemIcon:c["a"]},props:{fish:{type:Object,default:void 0}},data:function(){return{mdiLinkVariant:l["lb"],mdiFormatListChecks:l["Y"]}},methods:{goTo:function(t){var e,a=null!==(e=t.link)&&void 0!==e?e:n["a"].toHuijiWikiQuestLink({name:t.name_chs});window.open(a)}}},d=r,m=a("2877"),u=a("6544"),v=a.n(u),b=a("0798"),_=a("8336"),k=a("ce87"),p=a("132d"),f=a("2fa4"),h=a("e0c7"),g=Object(m["a"])(d,s,i,!1,null,"3271348d",null);e["default"]=g.exports;v()(g,{VAlert:b["a"],VBtn:_["a"],VHover:k["a"],VIcon:p["a"],VSpacer:f["a"],VSubheader:h["a"]})}}]);