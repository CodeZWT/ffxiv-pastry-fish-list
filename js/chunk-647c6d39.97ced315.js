(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-647c6d39"],{"12a1":function(e,t,i){},"1f09":function(e,t,i){},b877:function(e,t,i){"use strict";i("12a1")},f2d1:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-expansion-panels",{attrs:{hover:"",flat:"",tile:""},model:{value:e.lazyExpansionValue,callback:function(t){e.lazyExpansionValue=t},expression:"lazyExpansionValue"}},[i("v-expansion-panel",{staticClass:"system"},[i("v-expansion-panel-header",{staticClass:"system"},[i("div",{staticStyle:{display:"flex","justify-content":"center"}},[i("div",[i("v-icon",[e._v(e._s(e.mdiBookshelf))]),e._v(" "+e._s(e.$t("setting.dialog.detailArrangement.itemNames.DetailItemFishDescription"))+" ")],1)])]),i("v-expansion-panel-content",[e.loading?i("v-skeleton-loader",{attrs:{type:"list-item-three-line, divider, list-item-three-line"}}):[i("div",{staticClass:"pb-1"},[i("div",{staticClass:"subtitle-2 text--disabled d-flex"},[e._v(" "+e._s(e.$t("detail.description.item"))+" "),i("v-spacer"),e._v(" "+e._s(e.$t("detail.description.ilvl"))+e._s(e.ilvl)+" ")],1),i("div",{domProps:{innerHTML:e._s(e.description)}})]),i("v-divider"),i("div",{staticClass:"pt-1"},[i("div",{staticClass:"subtitle-2 text--disabled"},[e._v(" "+e._s(e.$t("detail.description.fishGuide"))+" ")]),i("div",{domProps:{textContent:e._s(e.fishGuide)}})]),i("div",{staticClass:"d-flex justify-end mt-2"},[i("a",{attrs:{href:e.link,target:"_blank"}},[e._v(" Garland数据")])])]],2)],1)],1)},a=[],s=(i("a4d3"),i("e01a"),i("9911"),i("96cf"),i("1da1")),r=i("94ed"),l=i("1aeb"),o=i("04d5"),d=(i("d3b7"),"https://garlandtools.cn/api/get.php"),c={getItem:function(e){return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e){t.next=2;break}return t.abrupt("return",void 0);case 2:return t.abrupt("return",fetch(d+"?id=".concat(e,"&type=item&lang=chs&version=3"),{headers:{"content-type":"application/json"},method:"GET"}).then((function(e){return e.json()})));case 3:case"end":return t.stop()}}),t)})))()}},u=function(e){var t,i,n,a,s,r,l,o;return{name_chs:null!==(t=null===e||void 0===e||null===(i=e.item)||void 0===i?void 0:i.description)&&void 0!==t?t:"",name_en:null!==(n=null===e||void 0===e||null===(a=e.item)||void 0===a||null===(s=a.en)||void 0===s?void 0:s.description)&&void 0!==n?n:"",name_ja:null!==(r=null===e||void 0===e||null===(l=e.item)||void 0===l||null===(o=l.ja)||void 0===o?void 0:o.description)&&void 0!==r?r:""}},p={name:"DetailItemFishDescription",mixins:[o["a"]],props:{fish:{type:Object,default:void 0},expanded:{type:Boolean,default:!1}},data:function(e){return{mdiBookshelf:r["p"],lazyExpansionValue:e.expanded?0:void 0,description:"",fishGuide:"",ilvl:"",link:"",loading:!0}},mounted:function(){},watch:{"fish._id":{handler:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){var i,n,a,s,r,o,d;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,o=l["a"].toItemId(t),this.loading=!0,e.next=5,c.getItem(o);case 5:d=e.sent,this.description=l["a"].getName(u(d)),this.fishGuide=null!==(i=null===d||void 0===d||null===(n=d.item)||void 0===n||null===(a=n.fish)||void 0===a?void 0:a.guide)&&void 0!==i?i:"",this.ilvl=null!==(s=null===d||void 0===d||null===(r=d.item)||void 0===r?void 0:r.ilvl)&&void 0!==s?s:"",this.link=o?l["a"].toGarlandItemLink({id:o}):"",this.loading=!1,e.next=19;break;case 13:e.prev=13,e.t0=e["catch"](0),this.description="",this.fishGuide="",this.ilvl="",this.link="";case 19:case"end":return e.stop()}}),e,this,[[0,13]])})));function t(t){return e.apply(this,arguments)}return t}(),immediate:!0}}},h=p,v=(i("b877"),i("2877")),f=i("6544"),m=i.n(f),g=i("ce7e"),b=i("cd55"),y=i("49e2"),x=i("c865"),k=i("0393"),_=i("132d"),S=(i("a630"),i("c975"),i("d81d"),i("ac1f"),i("3ca3"),i("5319"),i("1276"),i("3835")),j=i("5530"),B=(i("1f09"),i("c995")),E=i("24b2"),O=i("7560"),w=i("58df"),C=i("80d2"),L=Object(w["a"])(B["a"],E["a"],O["a"]).extend({name:"VSkeletonLoader",props:{boilerplate:Boolean,loading:Boolean,tile:Boolean,transition:String,type:String,types:{type:Object,default:function(){return{}}}},computed:{attrs:function(){return this.isLoading?this.boilerplate?{}:Object(j["a"])({"aria-busy":!0,"aria-live":"polite",role:"alert"},this.$attrs):this.$attrs},classes:function(){return Object(j["a"])(Object(j["a"])({"v-skeleton-loader--boilerplate":this.boilerplate,"v-skeleton-loader--is-loading":this.isLoading,"v-skeleton-loader--tile":this.tile},this.themeClasses),this.elevationClasses)},isLoading:function(){return!("default"in this.$scopedSlots)||this.loading},rootTypes:function(){return Object(j["a"])({actions:"button@2",article:"heading, paragraph",avatar:"avatar",button:"button",card:"image, card-heading","card-avatar":"image, list-item-avatar","card-heading":"heading",chip:"chip","date-picker":"list-item, card-heading, divider, date-picker-options, date-picker-days, actions","date-picker-options":"text, avatar@2","date-picker-days":"avatar@28",heading:"heading",image:"image","list-item":"text","list-item-avatar":"avatar, text","list-item-two-line":"sentences","list-item-avatar-two-line":"avatar, sentences","list-item-three-line":"paragraph","list-item-avatar-three-line":"avatar, paragraph",paragraph:"text@3",sentences:"text@2",table:"table-heading, table-thead, table-tbody, table-tfoot","table-heading":"heading, text","table-thead":"heading@6","table-tbody":"table-row-divider@6","table-row-divider":"table-row, divider","table-row":"table-cell@6","table-cell":"text","table-tfoot":"text@2, avatar@2",text:"text"},this.types)}},methods:{genBone:function(e,t){return this.$createElement("div",{staticClass:"v-skeleton-loader__".concat(e," v-skeleton-loader__bone")},t)},genBones:function(e){var t=this,i=e.split("@"),n=Object(S["a"])(i,2),a=n[0],s=n[1],r=function(){return t.genStructure(a)};return Array.from({length:s}).map(r)},genStructure:function(e){var t=[];e=e||this.type||"";var i=this.rootTypes[e]||"";if(e===i);else{if(e.indexOf(",")>-1)return this.mapBones(e);if(e.indexOf("@")>-1)return this.genBones(e);i.indexOf(",")>-1?t=this.mapBones(i):i.indexOf("@")>-1?t=this.genBones(i):i&&t.push(this.genStructure(i))}return[this.genBone(e,t)]},genSkeleton:function(){var e=[];return this.isLoading?e.push(this.genStructure()):e.push(Object(C["u"])(this)),this.transition?this.$createElement("transition",{props:{name:this.transition},on:{afterEnter:this.resetStyles,beforeEnter:this.onBeforeEnter,beforeLeave:this.onBeforeLeave,leaveCancelled:this.resetStyles}},e):e},mapBones:function(e){return e.replace(/\s/g,"").split(",").map(this.genStructure)},onBeforeEnter:function(e){this.resetStyles(e),this.isLoading&&(e._initialStyle={display:e.style.display,transition:e.style.transition},e.style.setProperty("transition","none","important"))},onBeforeLeave:function(e){e.style.setProperty("display","none","important")},resetStyles:function(e){e._initialStyle&&(e.style.display=e._initialStyle.display||"",e.style.transition=e._initialStyle.transition,delete e._initialStyle)}},render:function(e){return e("div",{staticClass:"v-skeleton-loader",attrs:this.attrs,on:this.$listeners,class:this.classes,style:this.isLoading?this.measurableStyles:void 0},[this.genSkeleton()])}}),V=i("2fa4"),$=Object(v["a"])(h,n,a,!1,null,"99ee2cd2",null);t["default"]=$.exports;m()($,{VDivider:g["a"],VExpansionPanel:b["a"],VExpansionPanelContent:y["a"],VExpansionPanelHeader:x["a"],VExpansionPanels:k["a"],VIcon:_["a"],VSkeletonLoader:L,VSpacer:V["a"]})}}]);