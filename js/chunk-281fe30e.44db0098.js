(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-281fe30e"],{"1f09":function(t,e,a){},"1f4f":function(t,e,a){"use strict";a("a9e3");var i=a("5530"),s=(a("8b37"),a("80d2")),n=a("7560"),r=a("58df");e["a"]=Object(r["a"])(n["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(i["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(s["i"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"268e":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return!t.loading&&t.itemExtra.item.masterpiece?a("div",[a("v-subheader",{staticClass:"d-flex justify-space-between"},[a("div",[t._v(" "+t._s(t.$t("setting.dialog.detailArrangement.itemNames.DetailItemMasterpiece"))+" ")]),a("div",[t._v(t._s(t.lvl))])]),t.loading?a("v-skeleton-loader",{staticClass:"mx-1",attrs:{type:"table-row-divider@3"}}):a("v-simple-table",{staticClass:"pt-2 inner",attrs:{dense:""}},[[a("thead",[a("tr",[a("td",{staticClass:"d-flex align-center justify-center"},[a("i",{staticClass:"xiv collectables",staticStyle:{"font-size":"22px"},attrs:{title:"收藏品"}}),a("span",{staticClass:"ml-1"},[t._v("所需收藏价值")])]),a("td",[a("div",{staticClass:"d-flex align-center justify-center"},[a("v-img",{attrs:{src:t.scriptIconUrl,"max-height":"20","max-width":"20"}}),a("span",{staticClass:"ml-1"},[t._v("工票")])],1)]),a("td",[a("div",{staticClass:"d-flex align-center justify-center"},[a("v-img",{attrs:{src:t.expIconUrl,"max-height":"20","max-width":"20"}}),a("span",{staticClass:"ml-1"},[t._v("经验值")])],1)])])]),a("tbody",t._l(t.masterpieceEntries,(function(e,i){return a("tr",{key:i},[a("td",{staticStyle:{"text-align":"center"}},[t._v(" "+t._s(e.ratingMin)+" ~ "+t._s(e.ratingMax||"")+" ")]),a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.script))]),a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.exp))])])})),0)]],2),a("v-divider")],1):t._e()},s=[],n=(a("7db0"),a("a15b"),a("d81d"),a("2909")),r=a("7a7d"),l={name:"DetailItemMasterpiece",components:{},props:{fish:{type:Object,default:void 0},itemExtra:{type:Object,default:void 0},loading:{type:Boolean,default:!0}},data:function(){return{}},computed:{lvl:function(){var t,e,a=null===(t=this.itemExtra)||void 0===t||null===(e=t.item)||void 0===e?void 0:e.masterpiece,i="";return a&&(i+="等级 ",2===a.lvl.length&&(a.lvl[0]===a.lvl[1]?i+=a.lvl[0]:i+=a.lvl.join("-")),a.stars&&(i+=" "+Object(n["a"])(new Array(a.stars)).map((function(){return"★"})).join(""))),i},masterpieceEntries:function(){var t,e,a=null===(t=this.itemExtra)||void 0===t||null===(e=t.item)||void 0===e?void 0:e.masterpiece;return a?a.rating.map((function(t,e){return{ratingMin:t,ratingMax:a.rating[e+1]-1,script:a.rewardAmount[e],exp:a.xp[e]}})):[]},scriptIconUrl:function(){var t,e;if(null!==(t=this.itemExtra)&&void 0!==t&&null!==(e=t.item)&&void 0!==e&&e.masterpiece){var a,i,s,n,l,o,d=null===(a=this.itemExtra)||void 0===a||null===(i=a.item)||void 0===i||null===(s=i.masterpiece)||void 0===s?void 0:s.reward,c=null===(n=this.itemExtra)||void 0===n||null===(l=n.partials)||void 0===l?void 0:l.find((function(t){return"item"===t.type&&+t.id===d}));return r["a"].getIconUrl(null===c||void 0===c||null===(o=c.obj)||void 0===o?void 0:o.c,!0)}},expIconUrl:function(){return r["a"].getIconUrl(65001,!0)}},methods:{}},o=l,d=a("2877"),c=a("6544"),h=a.n(c),u=a("ce7e"),p=a("adda"),v=a("1f4f"),f=a("3129"),m=a("e0c7"),g=Object(d["a"])(o,i,s,!1,null,"24e1f818",null);e["default"]=g.exports;h()(g,{VDivider:u["a"],VImg:p["a"],VSimpleTable:v["a"],VSkeletonLoader:f["a"],VSubheader:m["a"]})},3129:function(t,e,a){"use strict";a("a630"),a("c975"),a("d81d"),a("ac1f"),a("3ca3"),a("5319"),a("1276");var i=a("3835"),s=a("5530"),n=(a("1f09"),a("c995")),r=a("24b2"),l=a("7560"),o=a("58df"),d=a("80d2");e["a"]=Object(o["a"])(n["a"],r["a"],l["a"]).extend({name:"VSkeletonLoader",props:{boilerplate:Boolean,loading:Boolean,tile:Boolean,transition:String,type:String,types:{type:Object,default:function(){return{}}}},computed:{attrs:function(){return this.isLoading?this.boilerplate?{}:Object(s["a"])({"aria-busy":!0,"aria-live":"polite",role:"alert"},this.$attrs):this.$attrs},classes:function(){return Object(s["a"])(Object(s["a"])({"v-skeleton-loader--boilerplate":this.boilerplate,"v-skeleton-loader--is-loading":this.isLoading,"v-skeleton-loader--tile":this.tile},this.themeClasses),this.elevationClasses)},isLoading:function(){return!("default"in this.$scopedSlots)||this.loading},rootTypes:function(){return Object(s["a"])({actions:"button@2",article:"heading, paragraph",avatar:"avatar",button:"button",card:"image, card-heading","card-avatar":"image, list-item-avatar","card-heading":"heading",chip:"chip","date-picker":"list-item, card-heading, divider, date-picker-options, date-picker-days, actions","date-picker-options":"text, avatar@2","date-picker-days":"avatar@28",heading:"heading",image:"image","list-item":"text","list-item-avatar":"avatar, text","list-item-two-line":"sentences","list-item-avatar-two-line":"avatar, sentences","list-item-three-line":"paragraph","list-item-avatar-three-line":"avatar, paragraph",paragraph:"text@3",sentences:"text@2",table:"table-heading, table-thead, table-tbody, table-tfoot","table-heading":"heading, text","table-thead":"heading@6","table-tbody":"table-row-divider@6","table-row-divider":"table-row, divider","table-row":"table-cell@6","table-cell":"text","table-tfoot":"text@2, avatar@2",text:"text"},this.types)}},methods:{genBone:function(t,e){return this.$createElement("div",{staticClass:"v-skeleton-loader__".concat(t," v-skeleton-loader__bone")},e)},genBones:function(t){var e=this,a=t.split("@"),s=Object(i["a"])(a,2),n=s[0],r=s[1],l=function(){return e.genStructure(n)};return Array.from({length:r}).map(l)},genStructure:function(t){var e=[];t=t||this.type||"";var a=this.rootTypes[t]||"";if(t===a);else{if(t.indexOf(",")>-1)return this.mapBones(t);if(t.indexOf("@")>-1)return this.genBones(t);a.indexOf(",")>-1?e=this.mapBones(a):a.indexOf("@")>-1?e=this.genBones(a):a&&e.push(this.genStructure(a))}return[this.genBone(t,e)]},genSkeleton:function(){var t=[];return this.isLoading?t.push(this.genStructure()):t.push(Object(d["u"])(this)),this.transition?this.$createElement("transition",{props:{name:this.transition},on:{afterEnter:this.resetStyles,beforeEnter:this.onBeforeEnter,beforeLeave:this.onBeforeLeave,leaveCancelled:this.resetStyles}},t):t},mapBones:function(t){return t.replace(/\s/g,"").split(",").map(this.genStructure)},onBeforeEnter:function(t){this.resetStyles(t),this.isLoading&&(t._initialStyle={display:t.style.display,transition:t.style.transition},t.style.setProperty("transition","none","important"))},onBeforeLeave:function(t){t.style.setProperty("display","none","important")},resetStyles:function(t){t._initialStyle&&(t.style.display=t._initialStyle.display||"",t.style.transition=t._initialStyle.transition,delete t._initialStyle)}},render:function(t){return t("div",{staticClass:"v-skeleton-loader",attrs:this.attrs,on:this.$listeners,class:this.classes,style:this.isLoading?this.measurableStyles:void 0},[this.genSkeleton()])}})},"8b37":function(t,e,a){}}]);