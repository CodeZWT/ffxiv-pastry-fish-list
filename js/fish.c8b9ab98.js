(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["fish"],{"1ee5":function(t,e,i){},4897:function(t,e,i){"use strict";i("7a096")},"7a096":function(t,e,i){},"8f5a":function(t,e,i){},"98c6":function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{directives:[{name:"scroll",rawName:"v-scroll.self",value:t.onScroll,expression:"onScroll",modifiers:{self:!0}}],ref:"scrollTarget",class:{"px-1":t.isMobile,"filter-list-container":!0,"filter-list-container--web":!t.isElectron,"filter-list-container--desktop":t.isElectron&&!t.original,"filter-list-container--desktop-original":t.isElectron&&t.original},staticStyle:{position:"relative"},attrs:{fluid:""}},[i("div",[i("div",{staticClass:"filter-wrapper"},[i("fish-filter",{attrs:{show:t.showFilter,filters:t.filters,"is-mobile":t.isMobile,isNormalTabActive:t.isNormalTabActive},on:{input:t.onFiltersUpdate}},[i("div",[i("div",{staticClass:"d-flex align-center"},[i("div",{staticClass:"text-subtitle-2 ml-1 mr-3"},[t._v(t._s(t.$t("filter.bait.switch")))]),i("v-switch",{attrs:{inset:""},model:{value:t.baitFilterEnabledComputed,callback:function(e){t.baitFilterEnabledComputed=e},expression:"baitFilterEnabledComputed"}})],1),t.baitFilterEnabledComputed?i("div",[i("div",{staticClass:"d-flex align-center"},[i("v-btn",{staticClass:"mx-1",attrs:{text:"",small:""},on:{click:function(e){return t.selectAllBaits()}}},[i("v-icon",{attrs:{left:""}},[t._v(" "+t._s(t.mdiCheckAll)+" ")]),t._v(" "+t._s(t.$t("common.ui.selectAll"))+" ")],1),i("v-btn",{staticClass:"mx-1",attrs:{text:"",small:""},on:{click:t.clearAllBaits}},[i("v-icon",{attrs:{left:""}},[t._v(" "+t._s(t.mdiClose)+" ")]),t._v(" "+t._s(t.$t("common.ui.clearAll"))+" ")],1),i("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-icon",t._g(t._b({},"v-icon",n,!1),s),[t._v(" "+t._s(t.mdiHelpCircleOutline)+" ")])]}}],null,!1,2142499825)},[i("div",[i("div",[t._v(t._s(t.$t("baitSearch.dialog.hint1")))]),i("div",[t._v(t._s(t.$t("baitSearch.dialog.hint2")))])])])],1),i("v-chip-group",{attrs:{column:"",multiple:""},model:{value:t.selectedBaitIdIndices,callback:function(e){t.selectedBaitIdIndices=e},expression:"selectedBaitIdIndices"}},[t._l(t.bait2Fish,(function(e,s,n){return[i("v-menu",{key:n,attrs:{"open-on-hover":"",right:"","offset-x":"","offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(n){var a=n.on;return[i("v-chip",t._g({staticClass:"ma-1",attrs:{"active-class":"primary--text",outlined:"",disabled:0===e.length},on:{click:function(e){t.baitFilterInputted=!0}}},a),[i("item-icon",{attrs:{"icon-class":t.getItemIconClass(s),small:""}}),i("span",{domProps:{textContent:t._s(t.getItemName(s)+"("+e.length+")")}})],1)]}}],null,!0)},[i("v-card",[i("v-card-text",[i("div",{staticClass:"d-flex align-center flex-wrap",staticStyle:{"max-width":"500px"}},t._l(e,(function(e){return i("div",{key:e,staticClass:"d-flex align-center mx-1"},[i("item-icon",{attrs:{"icon-class":t.getItemIconClass(e),title:t.getItemName(e)}}),i("span",[t._v(t._s(t.getItemName(e)))])],1)})),0)])],1)],1)]}))],2)],1):t._e()])])],1),i("div",{class:{"main-area":!0,"show-filter":t.showFilter}},[i("div",{staticStyle:{width:"100%"}},[i("v-tabs-items",{attrs:{touchless:""},model:{value:t.activeTabIndex,callback:function(e){t.activeTabIndex=e},expression:"activeTabIndex"}},[i("v-tab-item",{key:"normal",staticClass:"list-wrapper",attrs:{transition:!1,"reverse-transition":!1}},[i("v-expansion-panels",{staticClass:"my-2 rounded-lg",attrs:{accordion:""},model:{value:t.pinnedListExpansion,callback:function(e){t.pinnedListExpansion=e},expression:"pinnedListExpansion"}},[i("v-expansion-panel",[i("v-expansion-panel-header",[i("div",{staticClass:"d-flex align-center"},[i("div",[t._v(t._s(t.$t("list.pinTitle")))]),i("v-spacer"),i("div",{staticClass:"mr-2"},[i("v-switch",{attrs:{inset:"",label:t.$t("list.showPinInNormal")},on:{click:function(t){t.stopPropagation()}},model:{value:t.showPinnedInNormalList,callback:function(e){t.showPinnedInNormalList=e},expression:"showPinnedInNormalList"}})],1)],1)]),i("v-expansion-panel-content",[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.pinnedFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)}},scopedSlots:t._u([{key:"empty",fn:function(){return[i("span",[t._v(" "+t._s(t.$t("list.pinned.empty.prefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiPinOutline))]),t._v(" "+t._s(t.$t("list.pinned.empty.suffix"))+" ")],1)]},proxy:!0}])})],1)],1)],1),i("v-expansion-panels",{staticClass:"my-2 rounded-lg",attrs:{accordion:""},model:{value:t.normalListExpansion,callback:function(e){t.normalListExpansion=e},expression:"normalListExpansion"}},[i("v-expansion-panel",[i("v-expansion-panel-header",[t._v(t._s(t.$t("list.normalTitle")))]),i("v-expansion-panel-content",[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.sortedFilteredFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"show-fish-divider":"","enable-load-more":"","is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)}},scopedSlots:t._u([{key:"empty",fn:function(){return[i("span",[t._v(" "+t._s(t.$t("list.normal.empty"))+" ")])]},proxy:!0}])})],1)],1)],1)],1),i("v-tab-item",{key:"notification",staticClass:"list-wrapper",attrs:{transition:!1,"reverse-transition":!1}},[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.toBeNotifiedFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"clear-all-button":"",type:"notification","is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)},"clear-all":t.clearToBeNotified},scopedSlots:t._u([{key:"empty",fn:function(){return[i("div",{staticClass:"d-flex flex-column align-center"},[i("span",[t._v(" "+t._s(t.$t("list.toBeNotified.empty.prefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiBellOutline))]),t._v(" "+t._s(t.$t("list.toBeNotified.empty.suffix"))+" ")],1),i("span",[t._v(" "+t._s(t.$t("list.toBeNotified.empty.helpPrefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiCog))]),t._v(" "+t._s(t.$t("list.toBeNotified.empty.helpSuffix"))+" ")],1)])]},proxy:!0}])})],1)],1)],1)])]),i("v-fab-transition",[i("v-btn",{directives:[{name:"show",rawName:"v-show",value:t.showBackToTopBtn,expression:"showBackToTopBtn"}],staticClass:"primary back-to-top-btn",style:"right: "+t.rightPercentage+"%; bottom: "+t.bottomOffset+"px",attrs:{fab:""},on:{click:t.backToTop}},[i("v-icon",[t._v(t._s(t.mdiChevronUp))])],1)],1)],1)},n=[],a=(i("a623"),i("4de4"),i("4160"),i("caad"),i("d81d"),i("b64b"),i("2532"),i("159b"),i("5530")),o=i("eed6"),r=i.n(o),l=i("6edf"),c=i.n(l),d=i("9e86"),h=i.n(d),f=i("2f62"),p=i("94ed"),u=i("1aeb"),m=i("47f3"),v=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-expand-transition",[t.show&&!t.loading?i("v-card",{staticClass:"mb-2 rounded-b-lg",attrs:{color:"inner"}},[i("v-expand-transition",[[t.isNormalTabActive?i("div",[i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.patch")))])])],1),i("v-row",{attrs:{wrap:"","no-gutters":""}},t._l(t.exVersion,(function(e){return i("v-col",{key:e,staticClass:"my-1",attrs:{cols:t.isMobile?12:6}},[i("div",[i("div",{staticClass:"d-flex align-center"},[i("div",{staticClass:"mr-2 ml-4"},[t._v(t._s(e))]),i("v-btn",{attrs:{text:"",small:""},on:{click:function(i){return t.checkAll(e)}}},[t._v(" "+t._s(t.$t("common.ui.selectAll"))+" "),i("v-icon",[t._v(t._s(t.mdiCheckAll))])],1),i("v-btn",{attrs:{text:"",small:""},on:{click:function(i){return t.uncheckAll(e)}}},[t._v(" "+t._s(t.$t("common.ui.clearAll"))+" "),i("v-icon",[t._v(t._s(t.mdiClose))])],1)],1),i("v-btn-toggle",{attrs:{rounded:"",dense:"",multiple:"","active-class":"primary"},on:{change:t.onChange},model:{value:t.patchSelectedIndices[e],callback:function(i){t.$set(t.patchSelectedIndices,e,i)},expression:"patchSelectedIndices[version]"}},t._l(t.patches[e],(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(e.toFixed(1))+" ")])})),1)],1)])})),1),i("v-row",{staticClass:"my-2",attrs:{"no-gutters":""}},[i("v-col",{attrs:{cols:t.isMobile?12:6}},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.bigFish.title")))]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.bigFishTypes,callback:function(e){t.bigFishTypes=e},expression:"bigFishTypes"}},t._l(t.bigFishFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.bigFish."+e))+" ")])})),1)],1),i("v-col",{attrs:{cols:t.isMobile?12:6}},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(" "+t._s(t.$t("filter.fishConstraint.title"))+" ")]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.fishConstraintTypes,callback:function(e){t.fishConstraintTypes=e},expression:"fishConstraintTypes"}},t._l(t.fishConstraintFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.fishConstraint."+e))+" ")])})),1)],1)],1),i("v-row",{attrs:{"no-gutters":""}},[i("v-col",{staticClass:"col-12"},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.mark.title")))]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.completeTypes,callback:function(e){t.completeTypes=e},expression:"completeTypes"}},t._l(t.completeFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.mark."+e))+" ")])})),1)],1)],1)],1),i("v-divider"),i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",{staticClass:"col-12"},[t._t("default")],2)],1)],1),i("v-divider")],1):t._e()]],2),i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.sorter.title")))])])],1),i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("v-btn-toggle",{attrs:{dense:"",rounded:"",mandatory:"","active-class":"primary"},on:{change:t.onChange},model:{value:t.sorterType,callback:function(e){t.sorterType=e},expression:"sorterType"}},t._l(t.fishSorterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.sorter."+e))+" ")])})),1)],1)],1)],1)],1):t._e()],1)},g=[],b=(i("5db7"),i("c975"),i("73d9"),i("4fad"),i("d3b7"),i("25f0"),i("3835")),F=i("d79a"),T=F["SystemInfo"].patches,I=["10","20","50","ALL"],x={name:"FishFilter",props:{show:{type:Boolean,default:!0},filters:{type:Object,default:function(){return{}}},isMobile:{type:Boolean,default:!1},isNormalTabActive:{type:Boolean,default:!1}},data:function(){return{mdiCheckAll:p["v"],mdiClose:p["E"],patches:T,exVersion:Object.keys(T),patchSelectedIndices:h()(T,(function(){return[]})),completeFilterTypes:u["a"].COMPLETE_FILTER_TYPES,completeTypes:[],bigFishFilterTypes:u["a"].BIG_FISH_FILTER_TYPES,bigFishTypes:[],fishNFilterTypes:I,fishNType:I.length-1,fishSorterTypes:u["a"].FISH_SORTER_TYPES,sorterType:u["a"].FISH_SORTER_TYPES.indexOf("COUNTDOWN"),fishConstraintFilterTypes:u["a"].FISH_CONSTRAINT_FILTER_TYPES,fishConstraintTypes:[]}},computed:{loading:function(){return this.filters==={}},filtersReturned:function(){var t=this,e=this.fishNFilterTypes[this.fishNType];return{patches:Object.entries(this.patchSelectedIndices).flatMap((function(e){var i=Object(b["a"])(e,2),s=i[0],n=i[1];return n.map((function(e){return t.patches[s][e]}))})).sort(),completeTypes:this.completeTypes.map((function(e){return t.completeFilterTypes[e]})),bigFishTypes:this.bigFishTypes.map((function(e){return t.bigFishFilterTypes[e]})),fishN:"ALL"===e?-1:+e,sorterType:this.fishSorterTypes[this.sorterType],fishConstraintTypes:this.fishConstraintTypes.map((function(e){return t.fishConstraintFilterTypes[e]}))}}},watch:{filters:{handler:function(t){this.init(t)},immediate:!0}},methods:{init:function(t){var e,i,s,n;this.patchSelectedIndices={"2.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"2.x"),"3.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"3.x"),"4.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"4.x"),"5.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"5.x"),"6.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"6.x")},this.completeTypes=(null!==(e=null===t||void 0===t?void 0:t.completeTypes)&&void 0!==e?e:[]).map((function(t){return u["a"].COMPLETE_FILTER_TYPES.indexOf(t)})),this.bigFishTypes=(null!==(i=null===t||void 0===t?void 0:t.bigFishTypes)&&void 0!==i?i:[]).map((function(t){return u["a"].BIG_FISH_FILTER_TYPES.indexOf(t)})),this.fishConstraintTypes=(null!==(s=null===t||void 0===t?void 0:t.fishConstraintTypes)&&void 0!==s?s:[]).map((function(t){return u["a"].FISH_CONSTRAINT_FILTER_TYPES.indexOf(t)})),this.fishNType=I.indexOf(this.fishN2Type(null===t||void 0===t?void 0:t.fishN)),this.sorterType=u["a"].FISH_SORTER_TYPES.indexOf(null!==(n=null===t||void 0===t?void 0:t.sorterType)&&void 0!==n?n:"COUNTDOWN")},checkAll:function(t){this.$set(this.patchSelectedIndices,t,this.patches[t].map((function(t,e){return e}))),this.$emit("input",this.filtersReturned)},uncheckAll:function(t){this.$set(this.patchSelectedIndices,t,[]),this.$emit("input",this.filtersReturned)},onChange:function(){this.$emit("input",this.filtersReturned)},getPatchesInVersion:function(t,e){var i;return null!==(i=null===t||void 0===t?void 0:t.map((function(t){var i;return(null!==(i=T[e])&&void 0!==i?i:[]).indexOf(t)})).filter((function(t){return-1!==t})))&&void 0!==i?i:[]},fishN2Type:function(t){var e=null!==t&&void 0!==t?t:-1;return-1===e?"ALL":e.toString()}}},y=x,_=i("2877"),S=i("6544"),w=i.n(S),P=i("8336"),C=i("a609"),L=i("b0af"),k=i("99d9"),N=i("62ad"),E=i("ce7e"),O=i("0789"),B=i("132d"),R=i("0fd9"),$=Object(_["a"])(y,v,g,!1,null,"4c26dbc5",null),V=$.exports;w()($,{VBtn:P["a"],VBtnToggle:C["a"],VCard:L["a"],VCardText:k["c"],VCol:N["a"],VDivider:E["a"],VExpandTransition:O["a"],VIcon:B["a"],VRow:R["a"]});var j=i("20ed"),D=i("8b70"),A=i("6fab"),z={name:"FishFilterList",mixins:[A["a"]],components:{ItemIcon:D["a"],FishList:j["a"],FishFilter:V},props:["original","lazyTransformedFishDict","pinnedFishIdList","fishListTimePart","fishListWeatherChangePart","sortedFilteredFishIdList","toBeNotifiedFishIdList","filteredFishIdSet","activeTabIndex","showRightPane"],data:function(){return{mdiCheckAll:p["v"],mdiClose:p["E"],mdiHelpCircleOutline:p["eb"],mdiLock:p["lb"],mdiInformation:p["ib"],mdiPinOutline:p["wb"],mdiBellOutline:p["m"],mdiCog:p["F"],mdiChevronUp:p["D"],isElectron:m["a"].isElectron(),selectedBaitIdIndices:[],offsetTop:0,baitFilterInputted:!1}},computed:Object(a["a"])(Object(a["a"])(Object(a["a"])({},Object(f["e"])({allFish:"fish",items:"items",fishingSpots:"fishingSpots",bigFish:"bigFish",sounds:"sounds",showFishPageRightPane:"showFishPageRightPane",baitFilter:"baitFilter"})),Object(f["c"])(["listSetting","getFishCompleted","filters","showFilter","showBanner","getFishPinned","rightPanePercentageV2","getItemName","getItemIconClass","getZoneName","getFishingSpotsName","getBaits","getWeather","getFishToBeNotified","notification","getItemIconUrl","isSystemNotificationEnabled","listSetting"])),{},{showBackToTopBtn:function(){return!1},rightPercentage:function(){return this.showRightPane?25:3},bottomOffset:function(){return this.isMobile?4:36},isNormalTabActive:function(){return this.activeTabIndex===u["a"].TAB_INDEX_NORMAL},normalListExpansion:{get:function(){return this.listSetting.normal.expanded?0:void 0},set:function(t){this.setListExpandedStatus("normal",0===t)}},pinnedListExpansion:{get:function(){return this.listSetting.pinned.expanded?0:void 0},set:function(t){this.setListExpandedStatus("pinned",0===t)}},showPinnedInNormalList:{get:function(){return this.listSetting.pinned.showPinnedInNormalList},set:function(t){this.updateShowPinnedInNormalList(t)}},baitFilterEnabledComputed:{get:function(){return this.baitFilter.enabled},set:function(t){this.updateUserBaitFilterData({path:"enabled",data:t})}},baitFilterIds:{get:function(){return this.baitFilter.baitIds},set:function(t){this.updateUserBaitFilterData({path:"baitIds",data:t})}},bait2Fish:function(){var t=this,e=[];return this.filteredFishIdSet.forEach((function(i){var s=t.allFish[i];null!=s.gig||!t.listSetting.pinned.showPinnedInNormalList&&t.getFishPinned(i)||(e.push({bait:s.bestCatchPath[0],fish:u["a"].toItemId(i)}),s.predators&&Object.keys(s.predators).map((function(s){var n=t.allFish[s];e.push({bait:n.bestCatchPath[0],fish:u["a"].toItemId(i)})})))})),h()(c()(e,"bait"),(function(t){return r()(t.map((function(t){return t.fish})))}))}}),watch:{bait2Fish:{handler:function(t,e){var i=this,s=null==e&&0===this.baitFilterIds.length||null!=e&&Object.keys(e).every((function(t){return i.baitFilterIds.includes(+t)}));if(s)this.$nextTick((function(){return i.selectAllBaits(t)}));else{var n=[];Object.keys(t).forEach((function(t,e){i.baitFilterIds.includes(+t)&&n.push(e)})),this.selectedBaitIdIndices=n}},immediate:!0},selectedBaitIdIndices:function(t){this.baitFilterIds=Object.keys(this.bait2Fish).filter((function(e,i){return t.includes(i)})).map((function(t){return+t}))}},methods:Object(a["a"])(Object(a["a"])({},Object(f["d"])(["updateListExpanded","updateUserBaitFilterData","updateUserData","setFilters","setShowSearchDialog","setNotShowBanner","clearToBeNotified","setShowFishPageRightPane","showSnackbar","updateShowPinnedInNormalList"])),{},{backToTop:function(){this.$refs.scrollTarget.scroll({top:0,left:0,behavior:"smooth"})},onFishSelected:function(t){var e=t.fishId,i=t.components,s=t.firstSpotId;this.$emit("fish-selected",{fishId:e,components:i,firstSpotId:s})},clearAllBaits:function(){this.selectedBaitIdIndices=[]},onFiltersUpdate:function(t){this.setFilters(t)},setListExpandedStatus:function(t,e){this.updateListExpanded({listType:t,expanded:e})},onScroll:function(t){this.offsetTop=t.target.scrollTop},selectAllBaits:function(t){this.baitFilterInputted=!1,this.selectedBaitIdIndices=Object.keys(null!==t&&void 0!==t?t:this.bait2Fish).map((function(t,e){return e}))},onDismiss:function(){this.setNotShowBanner()}})},M=z,W=(i("d40f"),i("cc20")),U=i("ef9a"),H=i("a523"),Y=i("cd55"),G=i("49e2"),q=i("c865"),J=i("0393"),Z=i("e449"),X=i("2fa4"),K=i("b73d"),Q=i("c671"),tt=i("aac8"),et=i("3a2f"),it=i("269a"),st=i.n(it),nt=i("f977"),at=Object(_["a"])(M,s,n,!1,null,"e152a24a",null);e["a"]=at.exports;w()(at,{VBtn:P["a"],VCard:L["a"],VCardText:k["c"],VChip:W["a"],VChipGroup:U["a"],VContainer:H["a"],VExpansionPanel:Y["a"],VExpansionPanelContent:G["a"],VExpansionPanelHeader:q["a"],VExpansionPanels:J["a"],VFabTransition:O["c"],VIcon:B["a"],VMenu:Z["a"],VSpacer:X["a"],VSwitch:K["a"],VTabItem:Q["a"],VTabsItems:tt["a"],VTooltip:et["a"]}),st()(at,{Scroll:nt["b"]})},c350:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"resize",rawName:"v-resize",value:t.onWindowResize,expression:"onWindowResize"}],staticClass:"d-flex"},[i("div",{directives:[{name:"show",rawName:"v-show",value:!t.rightPaneFullScreen||!t.showRightPane,expression:"!rightPaneFullScreen || !showRightPane"}],ref:"fishPageScrollTarget",class:{"list-part":!0,"list-part--web":!t.isElectron,"list-part--desktop":t.isElectron,"show-divider":t.showRightPane},style:"float: left; width: "+(t.showRightPane?t.mainPanePercent:100)+"%"},[-1===t.spotId?i("fish-filter-list",{attrs:{lazyTransformedFishDict:t.lazyTransformedFishDict,pinnedFishIdList:t.pinnedFishIdList,fishListTimePart:t.fishListTimePart,fishListWeatherChangePart:t.fishListWeatherChangePart,sortedFilteredFishIdList:t.sortedFilteredFishIdList,toBeNotifiedFishIdList:t.toBeNotifiedFishIdList,filteredFishIdSet:t.filteredFishIdSet,activeTabIndex:t.activeTabIndex,"is-mobile":t.isMobile,"show-right-pane":t.showRightPane,original:!0},on:{"fish-selected":t.onFishSelected}}):i("wiki-spot-detail",{attrs:{"show-close":"","current-spot-id":t.spotId,mode:t.wikiSpotMode,"is-mobile":t.isMobile,"is-electron":t.isElectron,"lazy-transformed-fish-dict":t.lazyTransformedFishDict,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart},on:{"fish-selected":t.onFishSelected,close:function(e){t.spotId=-1}}}),i("v-spacer"),i("rc-footer",{attrs:{columns:t.showRightPane?3:4}})],1),t.showRightPane?i("div",{staticStyle:{overflow:"hidden"}},[i("fish-detail",{ref:"fishDetail",attrs:{fish:t.selectedFish,forceShowComponents:t.forceShowComponents,"in-pane":"","show-close":"","show-spot-button":!t.isMobile},on:{close:function(e){t.showRightPane=!1},"show-spot":function(e){return t.showSpot(e)}}})],1):t._e()])},n=[],a=i("5530"),o=i("0f32"),r=i.n(o),l=i("2f62"),c=i("47f3"),d=i("1335"),h=i("98c6"),f=i("b0e3"),p=i("6fab"),u=i("4588"),m=i("2aaa"),v={name:"fish-page",components:{RcFooter:u["a"],WikiSpotDetail:m["a"],FishFilterList:h["a"],FishDetail:d["a"]},inject:{theme:{default:{isDark:!1}}},mixins:[p["a"]],props:["original","lazyFishSourceList","lazyTransformedFishList","lazyTransformedFishDict","pinnedFishIdList","fishListTimePart","extraFishListTimePart","fishListWeatherChangePart","sortedFilteredFishIdList","toBeNotifiedFishIdList","selectedFish","filteredFishIdSet","activeTabIndex","now"],data:function(){return{isElectron:c["a"].isElectron(),openPanelIndex:void 0,fishListOpenStatus:[0,1],throttledResizeFn:void 0,resizing:!1,rightPaneFullScreen:!1,loading:!0,forceShowComponents:void 0,spotId:-1,wikiSpotMode:"normal"}},computed:Object(a["a"])(Object(a["a"])({mainPanePercent:function(){return 100-100*this.rightPanePercentageV2},showRightPane:{get:function(){return this.showFishPageRightPane},set:function(t){this.setShowFishPageRightPane(t)}}},Object(l["e"])({allFish:"fish",items:"items",sounds:"sounds",showFishPageRightPane:"showFishPageRightPane"})),Object(l["c"])(["listSetting","getFishCompleted","filters","showFilter","showBanner","getFishPinned","rightPanePercentageV2","getItemName","getItemIconClass","getZoneName","getFishingSpotsName","getBaits","getWeather","getFishToBeNotified","notification","getItemIconUrl","isSystemNotificationEnabled","listSetting"])),watch:{mainPanePercent:function(){this.showRightPane=!1}},created:function(){var t=this;f["a"].isNotificationSupported()&&f["a"].requestNotificationPermission().then((function(e){"default"===e?t.showSnackbar({text:t.$t("setting.dialog.notification.message.requestNotificationPermissionNotSelected"),color:"warn"}):"denied"===e&&t.showSnackbar({text:t.$t("setting.dialog.notification.message.requestNotificationPermissionDenied"),color:"error"})}))},mounted:function(){this.showRightPane=!1,this.throttledResizeFn=r()(this.resizeInternal,100),this.onWindowResize()},methods:Object(a["a"])({showSpot:function(t){var e=this,i=t.spotId,s=t.mode;this.spotId=i,this.wikiSpotMode=s,this.$nextTick((function(){e.$refs.fishPageScrollTarget.scroll({top:0,left:0})}))},onFishSelected:function(t){var e=t.fishId,i=t.components,s=t.firstSpotId;this.$emit("fish-selected",{fishId:e,firstSpotId:s}),this.forceShowComponents=i,this.original&&(this.showRightPane=!0)},resizeInternal:function(){var t;null===(t=this.$refs.fishDetail)||void 0===t||t.resize()},onResize:function(){},onWindowResize:function(){var t=this;this.rightPaneFullScreen=window.innerWidth<this.$vuetify.breakpoint.thresholds.sm,setTimeout((function(){t.throttledResizeFn()}),500)}},Object(l["d"])(["updateListExpanded","updateUserBaitFilterData","updateUserData","setFilters","setShowSearchDialog","setNotShowBanner","setRightPanePercentageV2","clearToBeNotified","setShowFishPageRightPane","showSnackbar","updateShowPinnedInNormalList"]))},g=v,b=(i("4897"),i("2877")),F=i("6544"),T=i.n(F),I=i("2fa4"),x=i("269a"),y=i.n(x),_=i("dc22"),S=Object(b["a"])(g,s,n,!1,null,"b48a4bd2",null);e["default"]=S.exports;T()(S,{VSpacer:I["a"]}),y()(S,{Resize:_["a"]})},d40f:function(t,e,i){"use strict";i("1ee5")},ef9a:function(t,e,i){"use strict";var s=i("5530"),n=(i("8f5a"),i("7efd")),a=i("a9ad"),o=i("58df");e["a"]=Object(o["a"])(n["a"],a["a"]).extend({name:"v-chip-group",provide:function(){return{chipGroup:this}},props:{column:Boolean},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({},n["a"].options.computed.classes.call(this)),{},{"v-chip-group":!0,"v-chip-group--column":this.column})}},watch:{column:function(t){t&&(this.scrollOffset=0),this.$nextTick(this.onResize)}},methods:{genData:function(){return this.setTextColor(this.color,Object(s["a"])({},n["a"].options.methods.genData.call(this)))}}})}}]);