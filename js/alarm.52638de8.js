(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["alarm"],{"12b4":function(t,e,i){"use strict";i("3965")},2069:function(t,e,i){"use strict";i("caad"),i("2532");var s=i("5530"),n=i("2f62");e["a"]={computed:Object(s["a"])({},Object(n["c"])(["toBeNotifiedIKDRoutes"])),methods:Object(s["a"])(Object(s["a"])({},Object(n["d"])(["setIKDRouteToBeNotified"])),{},{hasAlarm:function(t){return this.toBeNotifiedIKDRoutes.includes(t)},setAlarm:function(t,e){this.setIKDRouteToBeNotified({routeId:t,toBeNotified:e})},onVoyageSelected:function(t){this.$emit("onVoyageSelected",t)}})}},3965:function(t,e,i){},"8f5a":function(t,e,i){},"929c":function(t,e,i){"use strict";i("a30a")},"98c6":function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{directives:[{name:"scroll",rawName:"v-scroll.self",value:t.onScroll,expression:"onScroll",modifiers:{self:!0}}],ref:"scrollTarget",class:{"px-1":t.isMobile,"filter-list-container":!0,"filter-list-container--web":!t.isElectron,"filter-list-container--desktop":t.isElectron&&!t.original,"filter-list-container--desktop-original":t.isElectron&&t.original},staticStyle:{position:"relative"},attrs:{fluid:""}},[i("div",[i("div",{staticClass:"filter-wrapper"},[i("fish-filter",{attrs:{show:t.showFilter,filters:t.filters,"is-mobile":t.isMobile,isNormalTabActive:t.isNormalTabActive},on:{input:t.onFiltersUpdate}},[i("div",[i("div",{staticClass:"d-flex align-center"},[i("div",{staticClass:"text-subtitle-2 ml-1 mr-3"},[t._v(t._s(t.$t("filter.bait.switch")))]),i("v-switch",{attrs:{inset:""},model:{value:t.baitFilterEnabledComputed,callback:function(e){t.baitFilterEnabledComputed=e},expression:"baitFilterEnabledComputed"}})],1),t.baitFilterEnabledComputed?i("div",[i("div",{staticClass:"d-flex align-center"},[i("v-btn",{staticClass:"mx-1",attrs:{text:"",small:""},on:{click:function(e){return t.selectAllBaits()}}},[i("v-icon",{attrs:{left:""}},[t._v(" "+t._s(t.mdiCheckAll)+" ")]),t._v(" "+t._s(t.$t("common.ui.selectAll"))+" ")],1),i("v-btn",{staticClass:"mx-1",attrs:{text:"",small:""},on:{click:t.clearAllBaits}},[i("v-icon",{attrs:{left:""}},[t._v(" "+t._s(t.mdiClose)+" ")]),t._v(" "+t._s(t.$t("common.ui.clearAll"))+" ")],1),i("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-icon",t._g(t._b({},"v-icon",n,!1),s),[t._v(" "+t._s(t.mdiHelpCircleOutline)+" ")])]}}],null,!1,2142499825)},[i("div",[i("div",[t._v(t._s(t.$t("baitSearch.dialog.hint1")))]),i("div",[t._v(t._s(t.$t("baitSearch.dialog.hint2")))])])])],1),i("v-chip-group",{attrs:{column:"",multiple:""},model:{value:t.selectedBaitIdIndices,callback:function(e){t.selectedBaitIdIndices=e},expression:"selectedBaitIdIndices"}},[t._l(t.bait2Fish,(function(e,s,n){return[i("v-menu",{key:n,attrs:{"open-on-hover":"",right:"","offset-x":"","offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(n){var a=n.on;return[i("v-chip",t._g({staticClass:"ma-1",attrs:{"active-class":"primary--text",outlined:"",disabled:0===e.length},on:{click:function(e){t.baitFilterInputted=!0}}},a),[i("item-icon",{attrs:{"icon-class":t.getItemIconClass(s),small:""}}),i("span",{domProps:{textContent:t._s(t.getItemName(s)+"("+e.length+")")}})],1)]}}],null,!0)},[i("v-card",[i("v-card-text",[i("div",{staticClass:"d-flex align-center flex-wrap",staticStyle:{"max-width":"500px"}},t._l(e,(function(e){return i("div",{key:e,staticClass:"d-flex align-center mx-1"},[i("item-icon",{attrs:{"icon-class":t.getItemIconClass(e),title:t.getItemName(e)}}),i("span",[t._v(t._s(t.getItemName(e)))])],1)})),0)])],1)],1)]}))],2)],1):t._e()])])],1),i("div",{class:{"main-area":!0,"show-filter":t.showFilter}},[i("div",{staticStyle:{width:"100%"}},[i("v-tabs-items",{attrs:{touchless:""},model:{value:t.activeTabIndex,callback:function(e){t.activeTabIndex=e},expression:"activeTabIndex"}},[i("v-tab-item",{key:"normal",staticClass:"list-wrapper",attrs:{transition:!1,"reverse-transition":!1}},[i("v-expansion-panels",{staticClass:"my-2 rounded-lg",attrs:{accordion:""},model:{value:t.pinnedListExpansion,callback:function(e){t.pinnedListExpansion=e},expression:"pinnedListExpansion"}},[i("v-expansion-panel",[i("v-expansion-panel-header",[i("div",{staticClass:"d-flex align-center"},[i("div",[t._v(t._s(t.$t("list.pinTitle")))]),i("v-spacer"),i("div",{staticClass:"mr-2"},[i("v-switch",{attrs:{inset:"",label:t.$t("list.showPinInNormal")},on:{click:function(t){t.stopPropagation()}},model:{value:t.showPinnedInNormalList,callback:function(e){t.showPinnedInNormalList=e},expression:"showPinnedInNormalList"}})],1)],1)]),i("v-expansion-panel-content",[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.pinnedFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)}},scopedSlots:t._u([{key:"empty",fn:function(){return[i("span",[t._v(" "+t._s(t.$t("list.pinned.empty.prefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiPinOutline))]),t._v(" "+t._s(t.$t("list.pinned.empty.suffix"))+" ")],1)]},proxy:!0}])})],1)],1)],1),i("v-expansion-panels",{staticClass:"my-2 rounded-lg",attrs:{accordion:""},model:{value:t.normalListExpansion,callback:function(e){t.normalListExpansion=e},expression:"normalListExpansion"}},[i("v-expansion-panel",[i("v-expansion-panel-header",[t._v(t._s(t.$t("list.normalTitle")))]),i("v-expansion-panel-content",[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.sortedFilteredFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"show-fish-divider":"","enable-load-more":"","is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)}},scopedSlots:t._u([{key:"empty",fn:function(){return[i("span",[t._v(" "+t._s(t.$t("list.normal.empty"))+" ")])]},proxy:!0}])})],1)],1)],1)],1),i("v-tab-item",{key:"notification",staticClass:"list-wrapper",attrs:{transition:!1,"reverse-transition":!1}},[i("fish-list",{attrs:{"fish-dict":t.lazyTransformedFishDict,"fish-ids":t.toBeNotifiedFishIdList,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart,"clear-all-button":"",type:"notification","is-mobile":t.isMobile},on:{"fish-selected":function(e){return t.onFishSelected(e)},"clear-all":t.clearToBeNotified},scopedSlots:t._u([{key:"empty",fn:function(){return[i("div",{staticClass:"d-flex flex-column align-center"},[i("span",[t._v(" "+t._s(t.$t("list.toBeNotified.empty.prefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiBellOutline))]),t._v(" "+t._s(t.$t("list.toBeNotified.empty.suffix"))+" ")],1),i("span",[t._v(" "+t._s(t.$t("list.toBeNotified.empty.helpPrefix"))+" "),i("v-icon",{staticClass:"mx-1",attrs:{small:""}},[t._v(t._s(t.mdiCog))]),t._v(" "+t._s(t.$t("list.toBeNotified.empty.helpSuffix"))+" ")],1)])]},proxy:!0}])})],1)],1)],1)])]),i("v-fab-transition",[i("v-btn",{directives:[{name:"show",rawName:"v-show",value:t.showBackToTopBtn,expression:"showBackToTopBtn"}],staticClass:"primary back-to-top-btn",style:"right: "+t.rightPercentage+"%; bottom: "+t.bottomOffset+"px",attrs:{fab:""},on:{click:t.backToTop}},[i("v-icon",[t._v(t._s(t.mdiChevronUp))])],1)],1)],1)},n=[],a=(i("a623"),i("4de4"),i("4160"),i("caad"),i("d81d"),i("b64b"),i("2532"),i("159b"),i("5530")),o=i("eed6"),r=i.n(o),l=i("6edf"),c=i.n(l),d=i("9e86"),h=i.n(d),u=i("2f62"),f=i("94ed"),m=i("1aeb"),p=i("47f3"),v=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-expand-transition",[t.show&&!t.loading?i("v-card",{staticClass:"mb-2 rounded-b-lg",attrs:{color:"inner"}},[i("v-expand-transition",[[t.isNormalTabActive?i("div",[i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.patch")))])])],1),i("v-row",{attrs:{wrap:"","no-gutters":""}},t._l(t.exVersion,(function(e){return i("v-col",{key:e,staticClass:"my-1",attrs:{cols:t.isMobile?12:6}},[i("div",[i("div",{staticClass:"d-flex align-center"},[i("div",{staticClass:"mr-2 ml-4"},[t._v(t._s(e))]),i("v-btn",{attrs:{text:"",small:""},on:{click:function(i){return t.checkAll(e)}}},[t._v(" "+t._s(t.$t("common.ui.selectAll"))+" "),i("v-icon",[t._v(t._s(t.mdiCheckAll))])],1),i("v-btn",{attrs:{text:"",small:""},on:{click:function(i){return t.uncheckAll(e)}}},[t._v(" "+t._s(t.$t("common.ui.clearAll"))+" "),i("v-icon",[t._v(t._s(t.mdiClose))])],1)],1),i("v-btn-toggle",{attrs:{rounded:"",dense:"",multiple:"","active-class":"primary"},on:{change:t.onChange},model:{value:t.patchSelectedIndices[e],callback:function(i){t.$set(t.patchSelectedIndices,e,i)},expression:"patchSelectedIndices[version]"}},t._l(t.patches[e],(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(e.toFixed(1))+" ")])})),1)],1)])})),1),i("v-row",{staticClass:"my-2",attrs:{"no-gutters":""}},[i("v-col",{attrs:{cols:t.isMobile?12:6}},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.bigFish.title")))]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.bigFishTypes,callback:function(e){t.bigFishTypes=e},expression:"bigFishTypes"}},t._l(t.bigFishFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.bigFish."+e))+" ")])})),1)],1),i("v-col",{attrs:{cols:t.isMobile?12:6}},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(" "+t._s(t.$t("filter.fishConstraint.title"))+" ")]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.fishConstraintTypes,callback:function(e){t.fishConstraintTypes=e},expression:"fishConstraintTypes"}},t._l(t.fishConstraintFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.fishConstraint."+e))+" ")])})),1)],1)],1),i("v-row",{attrs:{"no-gutters":""}},[i("v-col",{staticClass:"col-12"},[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.mark.title")))]),i("v-btn-toggle",{attrs:{multiple:"",mandatory:"",rounded:"","active-class":"primary",dense:""},on:{change:t.onChange},model:{value:t.completeTypes,callback:function(e){t.completeTypes=e},expression:"completeTypes"}},t._l(t.completeFilterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.mark."+e))+" ")])})),1)],1)],1)],1),i("v-divider"),i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",{staticClass:"col-12"},[t._t("default")],2)],1)],1),i("v-divider")],1):t._e()]],2),i("v-card-text",[i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("div",{staticClass:"subtitle-2 ml-2"},[t._v(t._s(t.$t("filter.sorter.title")))])])],1),i("v-row",{attrs:{"no-gutters":""}},[i("v-col",[i("v-btn-toggle",{attrs:{dense:"",rounded:"",mandatory:"","active-class":"primary"},on:{change:t.onChange},model:{value:t.sorterType,callback:function(e){t.sorterType=e},expression:"sorterType"}},t._l(t.fishSorterTypes,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(t.$t("filter.sorter."+e))+" ")])})),1)],1)],1)],1)],1):t._e()],1)},g=[],b=(i("5db7"),i("c975"),i("73d9"),i("4fad"),i("d3b7"),i("25f0"),i("3835")),y=i("d79a"),_=y["SystemInfo"].patches,I=["10","20","50","ALL"],T={name:"FishFilter",props:{show:{type:Boolean,default:!0},filters:{type:Object,default:function(){return{}}},isMobile:{type:Boolean,default:!1},isNormalTabActive:{type:Boolean,default:!1}},data:function(){return{mdiCheckAll:f["u"],mdiClose:f["D"],patches:_,exVersion:Object.keys(_),patchSelectedIndices:h()(_,(function(){return[]})),completeFilterTypes:m["a"].COMPLETE_FILTER_TYPES,completeTypes:[],bigFishFilterTypes:m["a"].BIG_FISH_FILTER_TYPES,bigFishTypes:[],fishNFilterTypes:I,fishNType:I.length-1,fishSorterTypes:m["a"].FISH_SORTER_TYPES,sorterType:m["a"].FISH_SORTER_TYPES.indexOf("COUNTDOWN"),fishConstraintFilterTypes:m["a"].FISH_CONSTRAINT_FILTER_TYPES,fishConstraintTypes:[]}},computed:{loading:function(){return this.filters==={}},filtersReturned:function(){var t=this,e=this.fishNFilterTypes[this.fishNType];return{patches:Object.entries(this.patchSelectedIndices).flatMap((function(e){var i=Object(b["a"])(e,2),s=i[0],n=i[1];return n.map((function(e){return t.patches[s][e]}))})).sort(),completeTypes:this.completeTypes.map((function(e){return t.completeFilterTypes[e]})),bigFishTypes:this.bigFishTypes.map((function(e){return t.bigFishFilterTypes[e]})),fishN:"ALL"===e?-1:+e,sorterType:this.fishSorterTypes[this.sorterType],fishConstraintTypes:this.fishConstraintTypes.map((function(e){return t.fishConstraintFilterTypes[e]}))}}},watch:{filters:{handler:function(t){this.init(t)},immediate:!0}},methods:{init:function(t){var e,i,s,n;this.patchSelectedIndices={"2.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"2.x"),"3.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"3.x"),"4.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"4.x"),"5.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"5.x"),"6.x":this.getPatchesInVersion(null===t||void 0===t?void 0:t.patches,"6.x")},this.completeTypes=(null!==(e=null===t||void 0===t?void 0:t.completeTypes)&&void 0!==e?e:[]).map((function(t){return m["a"].COMPLETE_FILTER_TYPES.indexOf(t)})),this.bigFishTypes=(null!==(i=null===t||void 0===t?void 0:t.bigFishTypes)&&void 0!==i?i:[]).map((function(t){return m["a"].BIG_FISH_FILTER_TYPES.indexOf(t)})),this.fishConstraintTypes=(null!==(s=null===t||void 0===t?void 0:t.fishConstraintTypes)&&void 0!==s?s:[]).map((function(t){return m["a"].FISH_CONSTRAINT_FILTER_TYPES.indexOf(t)})),this.fishNType=I.indexOf(this.fishN2Type(null===t||void 0===t?void 0:t.fishN)),this.sorterType=m["a"].FISH_SORTER_TYPES.indexOf(null!==(n=null===t||void 0===t?void 0:t.sorterType)&&void 0!==n?n:"COUNTDOWN")},checkAll:function(t){this.$set(this.patchSelectedIndices,t,this.patches[t].map((function(t,e){return e}))),this.$emit("input",this.filtersReturned)},uncheckAll:function(t){this.$set(this.patchSelectedIndices,t,[]),this.$emit("input",this.filtersReturned)},onChange:function(){this.$emit("input",this.filtersReturned)},getPatchesInVersion:function(t,e){var i;return null!==(i=null===t||void 0===t?void 0:t.map((function(t){var i;return(null!==(i=_[e])&&void 0!==i?i:[]).indexOf(t)})).filter((function(t){return-1!==t})))&&void 0!==i?i:[]},fishN2Type:function(t){var e=null!==t&&void 0!==t?t:-1;return-1===e?"ALL":e.toString()}}},x=T,F=i("2877"),C=i("6544"),S=i.n(C),w=i("8336"),P=i("a609"),N=i("b0af"),k=i("99d9"),B=i("62ad"),L=i("ce7e"),R=i("0789"),O=i("132d"),E=i("0fd9"),V=Object(F["a"])(x,v,g,!1,null,"4c26dbc5",null),D=V.exports;S()(V,{VBtn:w["a"],VBtnToggle:P["a"],VCard:N["a"],VCardText:k["c"],VCol:B["a"],VDivider:L["a"],VExpandTransition:R["a"],VIcon:O["a"],VRow:E["a"]});var $=i("20ed"),A=i("8b70"),j=i("6fab"),M={name:"FishFilterList",mixins:[j["a"]],components:{ItemIcon:A["a"],FishList:$["a"],FishFilter:D},props:["original","lazyTransformedFishDict","pinnedFishIdList","fishListTimePart","fishListWeatherChangePart","sortedFilteredFishIdList","toBeNotifiedFishIdList","filteredFishIdSet","activeTabIndex","showRightPane"],data:function(){return{mdiCheckAll:f["u"],mdiClose:f["D"],mdiHelpCircleOutline:f["cb"],mdiLock:f["ib"],mdiInformation:f["fb"],mdiPinOutline:f["rb"],mdiBellOutline:f["m"],mdiCog:f["E"],mdiChevronUp:f["C"],isElectron:p["a"].isElectron(),selectedBaitIdIndices:[],offsetTop:0,baitFilterInputted:!1}},computed:Object(a["a"])(Object(a["a"])(Object(a["a"])({},Object(u["e"])({allFish:"fish",items:"items",fishingSpots:"fishingSpots",bigFish:"bigFish",sounds:"sounds",showFishPageRightPane:"showFishPageRightPane",baitFilter:"baitFilter"})),Object(u["c"])(["listSetting","getFishCompleted","filters","showFilter","showBanner","getFishPinned","rightPanePercentageV2","getItemName","getItemIconClass","getZoneName","getFishingSpotsName","getBaits","getWeather","getFishToBeNotified","notification","getItemIconUrl","isSystemNotificationEnabled","listSetting"])),{},{showBackToTopBtn:function(){return!1},rightPercentage:function(){return this.showRightPane?25:3},bottomOffset:function(){return this.isMobile?4:36},isNormalTabActive:function(){return this.activeTabIndex===m["a"].TAB_INDEX_NORMAL},normalListExpansion:{get:function(){return this.listSetting.normal.expanded?0:void 0},set:function(t){this.setListExpandedStatus("normal",0===t)}},pinnedListExpansion:{get:function(){return this.listSetting.pinned.expanded?0:void 0},set:function(t){this.setListExpandedStatus("pinned",0===t)}},showPinnedInNormalList:{get:function(){return this.listSetting.pinned.showPinnedInNormalList},set:function(t){this.updateShowPinnedInNormalList(t)}},baitFilterEnabledComputed:{get:function(){return this.baitFilter.enabled},set:function(t){this.updateUserBaitFilterData({path:"enabled",data:t})}},baitFilterIds:{get:function(){return this.baitFilter.baitIds},set:function(t){this.updateUserBaitFilterData({path:"baitIds",data:t})}},bait2Fish:function(){var t=this,e=[];return this.filteredFishIdSet.forEach((function(i){var s=t.allFish[i];null!=s.gig||!t.listSetting.pinned.showPinnedInNormalList&&t.getFishPinned(i)||(e.push({bait:s.bestCatchPath[0],fish:m["a"].toItemId(i)}),s.predators&&Object.keys(s.predators).map((function(s){var n=t.allFish[s];e.push({bait:n.bestCatchPath[0],fish:m["a"].toItemId(i)})})))})),h()(c()(e,"bait"),(function(t){return r()(t.map((function(t){return t.fish})))}))}}),watch:{bait2Fish:{handler:function(t,e){var i=this,s=null==e&&0===this.baitFilterIds.length||null!=e&&Object.keys(e).every((function(t){return i.baitFilterIds.includes(+t)}));if(s)this.$nextTick((function(){return i.selectAllBaits(t)}));else{var n=[];Object.keys(t).forEach((function(t,e){i.baitFilterIds.includes(+t)&&n.push(e)})),this.selectedBaitIdIndices=n}},immediate:!0},selectedBaitIdIndices:function(t){this.baitFilterIds=Object.keys(this.bait2Fish).filter((function(e,i){return t.includes(i)})).map((function(t){return+t}))}},methods:Object(a["a"])(Object(a["a"])({},Object(u["d"])(["updateListExpanded","updateUserBaitFilterData","updateUserData","setFilters","setShowSearchDialog","setNotShowBanner","clearToBeNotified","setShowFishPageRightPane","showSnackbar","updateShowPinnedInNormalList"])),{},{backToTop:function(){this.$refs.scrollTarget.scroll({top:0,left:0,behavior:"smooth"})},onFishSelected:function(t){var e=t.fishId,i=t.components,s=t.firstSpotId;this.$emit("fish-selected",{fishId:e,components:i,firstSpotId:s})},clearAllBaits:function(){this.selectedBaitIdIndices=[]},onFiltersUpdate:function(t){this.setFilters(t)},setListExpandedStatus:function(t,e){this.updateListExpanded({listType:t,expanded:e})},onScroll:function(t){this.offsetTop=t.target.scrollTop},selectAllBaits:function(t){this.baitFilterInputted=!1,this.selectedBaitIdIndices=Object.keys(null!==t&&void 0!==t?t:this.bait2Fish).map((function(t,e){return e}))},onDismiss:function(){this.setNotShowBanner()}})},z=M,U=(i("12b4"),i("cc20")),W=i("ef9a"),K=i("a523"),H=i("cd55"),Y=i("49e2"),G=i("c865"),q=i("0393"),J=i("e449"),Z=i("2fa4"),X=i("b73d"),Q=i("c671"),tt=i("aac8"),et=i("3a2f"),it=i("269a"),st=i.n(it),nt=i("f977"),at=Object(F["a"])(z,s,n,!1,null,"4907e90a",null);e["a"]=at.exports;S()(at,{VBtn:w["a"],VCard:N["a"],VCardText:k["c"],VChip:U["a"],VChipGroup:W["a"],VContainer:K["a"],VExpansionPanel:H["a"],VExpansionPanelContent:Y["a"],VExpansionPanelHeader:G["a"],VExpansionPanels:q["a"],VFabTransition:R["c"],VIcon:O["a"],VMenu:J["a"],VSpacer:Z["a"],VSwitch:X["a"],VTabItem:Q["a"],VTabsItems:tt["a"],VTooltip:et["a"]}),st()(at,{Scroll:nt["b"]})},a30a:function(t,e,i){},a6d8:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"resize",rawName:"v-resize",value:t.onWindowResize,expression:"onWindowResize"}],staticClass:"d-flex"},[i("div",{directives:[{name:"show",rawName:"v-show",value:!t.rightPaneFullScreen||!t.showRightPane,expression:"!rightPaneFullScreen || !showRightPane"}],ref:"fishPageScrollTarget",class:{"list-part":!0,"list-part--web":!t.isElectron,"list-part--desktop":t.isElectron,"show-divider":t.showRightPane},style:"flex: 1 1 "+t.mainPaneFlexPercentage+"%"},[-1===t.spotId?i("v-row",{attrs:{"no-gutters":""}},[i("v-col",{attrs:{cols:"12"}},[i("fish-filter-list",{attrs:{lazyTransformedFishDict:t.lazyTransformedFishDict,pinnedFishIdList:t.pinnedFishIdList,fishListTimePart:t.fishListTimePart,fishListWeatherChangePart:t.fishListWeatherChangePart,sortedFilteredFishIdList:t.sortedFilteredFishIdList,toBeNotifiedFishIdList:t.toBeNotifiedFishIdList,filteredFishIdSet:t.filteredFishIdSet,activeTabIndex:1,"is-mobile":t.isMobile,"show-right-pane":t.showRightPane,original:!0},on:{"fish-selected":t.onFishSelected}})],1),i("v-col",{staticClass:"px-1 px-md-3",attrs:{cols:"12"}},[i(t.isMobile?"OceanFishingTimeTableContentSmall":"OceanFishingTimeTableContentLarge",{tag:"component",attrs:{voyages:t.voyages,"current-voyage-index":t.currentVoyageIndex,"show-current-route-indicator":""}}),t.hasIKDRouteAlarm?t._e():i("v-sheet",{staticClass:"text-center py-4"},[t._v(" "+t._s(t.$t("list.toBeNotifiedIKDRoute.empty.prefix"))+" ")]),t.voyages.length>0?i("rc-dialog",{attrs:{"max-width":"330"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-btn",t._g(t._b({staticClass:"rounded-t-0",attrs:{block:"",color:"error"}},"v-btn",n,!1),s),[i("v-icon",[t._v(t._s(t.mdiPlaylistRemove))]),i("span",[t._v(t._s(t.$t("list.toBeNotifiedIKDRoute.clearAll")))]),i("span",[t._v("（共"+t._s(t.voyages.length)+"条）")])],1)]}}],null,!1,3307137530),model:{value:t.showClearConfirmDialog,callback:function(e){t.showClearConfirmDialog=e},expression:"showClearConfirmDialog"}},[i("v-card",[i("v-card-title",{staticClass:"headline"},[t._v(" "+t._s(t.$t("list.toBeNotifiedIKDRoute.dialog.title"))+" ")]),i("v-card-actions",[i("v-spacer"),i("v-btn",{attrs:{text:""},on:{click:function(e){t.showClearConfirmDialog=!1}}},[t._v(" "+t._s(t.$t("general.dialog.cancel"))+" ")]),i("v-btn",{attrs:{color:"error",text:""},on:{click:t.onConfirmClear}},[t._v(" "+t._s(t.$t("list.toBeNotifiedIKDRoute.dialog.confirm"))+" ")])],1)],1)],1):t._e()],1)],1):i("wiki-spot-detail",{attrs:{"show-close":"","current-spot-id":t.spotId,mode:t.wikiSpotMode,"is-mobile":t.isMobile,"is-electron":t.isElectron,"lazy-transformed-fish-dict":t.lazyTransformedFishDict,"fish-list-time-part":t.fishListTimePart,"fish-list-weather-change-part":t.fishListWeatherChangePart},on:{"fish-selected":t.onFishSelected,close:function(e){t.spotId=-1}}})],1),t.showRightPane?i("div",{staticClass:"detail-part"},[i("fish-detail",{ref:"fishDetail",attrs:{fish:t.selectedFish,forceShowComponents:t.forceShowComponents,"in-pane":"","show-close":"","show-spot-button":!t.isMobile},on:{close:function(e){t.showRightPane=!1},"show-spot":function(e){return t.showSpot(e)}}})],1):t._e()])},n=[],a=(i("7db0"),i("c740"),i("5530")),o=i("0f32"),r=i.n(o),l=i("b8ce"),c=i.n(l),d=i("832b"),h=i("2f62"),u=i("94ed"),f=i("47f3"),m=i("1335"),p=i("98c6"),v=i("c27d"),g=i("b0e3"),b=i("e899"),y=i("a93a"),_=i("f0e7"),I=i("6fab"),T=i("1450"),x=i("2aaa"),F={name:"AlarmPage",components:{RcDialog:T["a"],OceanFishingTimeTableContentLarge:b["a"],OceanFishingTimeTableContentSmall:y["a"],WikiSpotDetail:x["a"],FishFilterList:p["a"],FishDetail:m["a"]},inject:{theme:{default:{isDark:!1}}},mixins:[I["a"],v["a"]],props:["original","lazyFishSourceList","lazyTransformedFishList","lazyTransformedFishDict","pinnedFishIdList","fishListTimePart","extraFishListTimePart","fishListWeatherChangePart","sortedFilteredFishIdList","toBeNotifiedFishIdList","selectedFish","filteredFishIdSet","activeTabIndex","now"],data:function(){return{mdiPlaylistRemove:u["ub"],showClearConfirmDialog:!1,isElectron:f["a"].isElectron(),openPanelIndex:void 0,fishListOpenStatus:[0,1],throttledResizeFn:void 0,resizing:!1,rightPaneFullScreen:!1,loading:!0,forceShowComponents:void 0,spotId:-1,wikiSpotMode:"normal"}},computed:Object(a["a"])(Object(a["a"])({currentVoyageIndex:function(){var t=this;return this.voyages.findIndex((function(e){return e.milliseconds<=t.now&&t.now<=e.milliseconds+d["INTERVAL_HOUR"]}))},hasIKDRouteAlarm:function(){return this.toBeNotifiedIKDRoutes.length>0},voyages:function(){var t=this.hasIKDRouteAlarm?this.assembleVoyages(_["a"].shiftTimeForCheckInLimit(Date.now()),24,this.toBeNotifiedIKDRoutes,!0):[],e=c()(this.toBeNotifiedIKDRoutes),i=[],s=function(){var s=e.shift();i.push(t.find((function(t){return t.id===s})))};while(e.length>0)s();return i},mainPaneFlexPercentage:function(){return Math.floor(100*(1-this.rightPanePercentageV2)/this.rightPanePercentageV2)},showRightPane:{get:function(){return this.showFishPageRightPane},set:function(t){this.setShowFishPageRightPane(t)}}},Object(h["e"])({allFish:"fish",items:"items",sounds:"sounds",showFishPageRightPane:"showFishPageRightPane"})),Object(h["c"])(["listSetting","getFishCompleted","filters","showFilter","showBanner","getFishPinned","rightPanePercentageV2","getItemName","getItemIconClass","getZoneName","getFishingSpotsName","getBaits","getWeather","getFishToBeNotified","notification","getItemIconUrl","isSystemNotificationEnabled","listSetting","toBeNotifiedIKDRoutes"])),watch:{mainPaneFlexPercentage:function(){this.showRightPane=!1}},created:function(){var t=this;g["a"].isNotificationSupported()&&g["a"].requestNotificationPermission().then((function(e){"default"===e?t.showSnackbar({text:t.$t("setting.dialog.notification.message.requestNotificationPermissionNotSelected"),color:"warn"}):"denied"===e&&t.showSnackbar({text:t.$t("setting.dialog.notification.message.requestNotificationPermissionDenied"),color:"error"})}))},mounted:function(){this.showRightPane=!1,this.throttledResizeFn=r()(this.resizeInternal,100),this.onWindowResize()},methods:Object(a["a"])({onConfirmClear:function(){this.clearIKDRouteToBeNotified(),this.showClearConfirmDialog=!1},showSpot:function(t){var e=this,i=t.spotId,s=t.mode;this.spotId=i,this.wikiSpotMode=s,this.$nextTick((function(){e.$refs.fishPageScrollTarget.scroll({top:0,left:0})}))},onFishSelected:function(t){var e=t.fishId,i=t.components,s=t.firstSpotId;this.$emit("fish-selected",{fishId:e,firstSpotId:s}),this.forceShowComponents=i,this.original&&(this.showRightPane=!0)},resizeInternal:function(){var t;null===(t=this.$refs.fishDetail)||void 0===t||t.resize()},onResize:function(){},onWindowResize:function(){var t=this;this.rightPaneFullScreen=window.innerWidth<this.$vuetify.breakpoint.thresholds.sm,setTimeout((function(){t.throttledResizeFn()}),500)}},Object(h["d"])(["updateListExpanded","updateUserBaitFilterData","updateUserData","setFilters","setShowSearchDialog","setNotShowBanner","setRightPanePercentageV2","clearToBeNotified","setShowFishPageRightPane","showSnackbar","updateShowPinnedInNormalList","clearIKDRouteToBeNotified"]))},C=F,S=(i("929c"),i("2877")),w=i("6544"),P=i.n(w),N=i("8336"),k=i("b0af"),B=i("99d9"),L=i("62ad"),R=i("132d"),O=i("0fd9"),E=i("8dd9"),V=i("2fa4"),D=i("269a"),$=i.n(D),A=i("dc22"),j=Object(S["a"])(C,s,n,!1,null,"64f2a342",null);e["default"]=j.exports;P()(j,{VBtn:N["a"],VCard:k["a"],VCardActions:B["a"],VCardTitle:B["d"],VCol:L["a"],VIcon:R["a"],VRow:O["a"],VSheet:E["a"],VSpacer:V["a"]}),$()(j,{Resize:A["a"]})},a93a:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[i("colgroup",[i("col",{staticStyle:{width:"40%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"60%"},attrs:{span:"1"}})]),i("thead",[i("tr",[i("th",{staticClass:"text-right"},[t._v("登船登记时间"),i("br"),t._v("（本地）")]),i("th",{staticClass:"text-left pl-5"},[t._v("目标")])])]),i("tbody",t._l(t.voyages,(function(e,s){return i("tr",{key:e.day+"-"+e.time,class:t.showCurrentRouteIndicator&&t.currentVoyageIndex===s?"primary":"",staticStyle:{cursor:"pointer"},on:{click:function(e){return t.onVoyageSelected({index:s})}}},[i("td",[i("div",{staticClass:"d-flex align-center"},[i("toggle-button",{attrs:{value:t.hasAlarm(e.id),"checked-icon":t.mdiBell,"unchecked-icon":t.mdiBellOutline,"checked-title":t.$t("actions.toBeNotifiedLocked.checked"),"unchecked-title":t.$t("actions.toBeNotifiedLocked.unchecked")},on:{input:function(i){return t.setAlarm(e.id,i)}}}),i("v-spacer"),i("div",{style:e.showDay?"":"visibility: hidden"},[t._v(" "+t._s(e.day)+" ")]),i("div",{staticClass:"ml-1"},[t._v(t._s(e.time))])],1)]),i("td",[i("div",{staticClass:"d-flex align-center"},t._l(e.targets,(function(e){return i("div",{key:e.id,style:"item"===e.type?"padding-top: 4px":"",on:{click:function(i){return i.stopPropagation(),t.onVoyageSelected({index:s,targetId:e.id,targetType:e.type})}}},[i("item-icon",{attrs:{title:e.name,"icon-url":e.iconUrl,"icon-class":e.icon,cover:e.cover,type:e.type}})],1)})),0)])])})),0)]},proxy:!0}])})},n=[],a=(i("a9e3"),i("94ed")),o=i("8b70"),r=i("2069"),l=i("9197"),c={name:"OceanFishingTimeTableContentSmall",components:{ToggleButton:l["a"],ItemIcon:o["a"]},mixins:[r["a"]],props:{voyages:{type:Array,default:function(){return[]}},showCurrentRouteIndicator:{type:Boolean,default:!1},currentVoyageIndex:{type:Number,default:-1}},data:function(){return{mdiBell:a["l"],mdiBellOutline:a["m"]}}},d=c,h=i("2877"),u=i("6544"),f=i.n(u),m=i("1f4f"),p=i("2fa4"),v=Object(h["a"])(d,s,n,!1,null,"f8c1fb30",null);e["a"]=v.exports;f()(v,{VSimpleTable:m["a"],VSpacer:p["a"]})},c27d:function(t,e,i){"use strict";i("99af"),i("4de4"),i("5db7"),i("d81d"),i("73d9");var s=i("5530"),n=i("b3e7"),a=i("2f62"),o=i("dd1b"),r=i.n(o),l=i("1aeb"),c=i("e6f2"),d=i.n(c),h=i("7a7d"),u=i("f0e7"),f=i("1879"),m=i.n(f);e["a"]={name:"IKDRouteMixin",computed:Object(s["a"])({},Object(a["c"])(["getItemName","getItemIconClass","getAchievementName","getAchievementIconClass"])),methods:{assembleVoyages:function(t,e,i){var s=this,n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return u["a"].voyagesWithTipOf(t,e,i).map((function(t,e,i){var a=n||0===e||l["a"].getCNTime(t.time).day!==l["a"].getCNTime(i[e-1].time).day,o=t.voyageTip.achievements.map((function(t){return s.assembleAchievement(t)})).concat(t.locationTips.map((function(t){return{blueFish:s.assembleItem(t.blueFish)}})).flatMap((function(t){return[t.blueFish]}))).filter((function(t){return t}));return{showDay:a,id:t.voyageType,milliseconds:t.time,day:l["a"].formatDateTime(t.time,"MM-dd"),time:l["a"].formatDateTime(t.time,"HH:mm"),shiftIcon:l["a"].shift2Icon(t.shift.type),name:l["a"].getName(d.a[t.shift.routeId]),targets:o,typeMission:t.typeMission,starMission:t.starMission,tugMission:t.tugMission,voyageLocations:t.locationTips.map((function(t){return{id:t.fishingSpots.normal,spectralCurrentId:t.fishingSpots.spectralCurrent,weatherSet:t.weatherSet,shift:t.shift,name:l["a"].getName(m.a[t.locationName]),mainName:l["a"].getName(m.a[t.locationMainName]),subName:l["a"].getName(m.a[t.locationSubName]),icon:l["a"].shift2Icon(t.shift),hint:t.locationHint}}))}}))},assembleAchievement:function(t){var e;if(!t)return null;var i=r.a.OCEAN_FISHING_ACHIEVEMENTS[t];return{id:t,name:this.getAchievementName(t),icon:this.getAchievementIconClass(t),bonus:i.bonus,bonusRequirement:null===(e=n["OCEAN_FISHING_BONUS"][i.bonus])||void 0===e?void 0:e.requirement,iconUrl:i.iconLocal&&h["a"].getImgUrl(i.iconLocal),nonTipOptions:i.nonTipOptions,type:"achievement"}},assembleItem:function(t){return t&&{id:t,name:this.getItemName(t),icon:this.getItemIconClass(t),type:"item"}}}}},e6f2:function(t,e){var i={1:{id:1,name_chs:"梅尔托尔海峡北航线",name_en:"Northern Strait of Merlthor",name_ja:"メルトール海峡北行き"},2:{id:2,name_chs:"梅尔托尔海峡北航线",name_en:"Northern Strait of Merlthor",name_ja:"メルトール海峡北行き"},3:{id:3,name_chs:"梅尔托尔海峡北航线",name_en:"Northern Strait of Merlthor",name_ja:"メルトール海峡北行き"},4:{id:4,name_chs:"罗塔诺海航线",name_en:"Rhotano Sea",name_ja:"ロータノ海行き"},5:{id:5,name_chs:"罗塔诺海航线",name_en:"Rhotano Sea",name_ja:"ロータノ海行き"},6:{id:6,name_chs:"罗塔诺海航线",name_en:"Rhotano Sea",name_ja:"ロータノ海行き"},7:{id:7,name_chs:"绯汐海航线",name_en:"Bloodbrine Sea",name_ja:"緋汐海行き"},8:{id:8,name_chs:"绯汐海航线",name_en:"Bloodbrine Sea",name_ja:"緋汐海行き"},9:{id:9,name_chs:"绯汐海航线",name_en:"Bloodbrine Sea",name_ja:"緋汐海行き"},10:{id:10,name_chs:"罗斯利特湾航线",name_en:"Rothlyt Sound",name_ja:"ロズリト湾行き"},11:{id:11,name_chs:"罗斯利特湾航线",name_en:"Rothlyt Sound",name_ja:"ロズリト湾行き"},12:{id:12,name_chs:"罗斯利特湾航线",name_en:"Rothlyt Sound",name_ja:"ロズリト湾行き"}};t.exports=i},e899:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[i("colgroup",[i("col",{staticStyle:{width:"15%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"15%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"20%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"50%"},attrs:{span:"1"}})]),i("thead",[i("tr",[i("th",{staticClass:"text-right"},[t._v("登船登记时间（本地）")]),i("th",{staticClass:"text-left pl-5"},[t._v("目标")]),i("th",{staticClass:"text-left"},[t._v("航线")]),i("th",{staticClass:"text-left"},[t._v("航线线路")])])]),i("tbody",t._l(t.voyages,(function(e,s){return i("tr",{key:e.day+"-"+e.time,class:t.showCurrentRouteIndicator&&t.currentVoyageIndex===s?"primary":"",staticStyle:{cursor:"pointer"},on:{click:function(e){return t.onVoyageSelected({index:s})}}},[i("td",[i("div",{staticClass:"d-flex align-center"},[i("toggle-button",{attrs:{value:t.hasAlarm(e.id),"checked-icon":t.mdiBell,"unchecked-icon":t.mdiBellOutline,"checked-title":t.$t("actions.toBeNotifiedLocked.checked"),"unchecked-title":t.$t("actions.toBeNotifiedLocked.unchecked")},on:{input:function(i){return t.setAlarm(e.id,i)}}}),i("v-spacer"),i("div",{style:e.showDay?"":"visibility: hidden"},[t._v(" "+t._s(e.day)+" ")]),i("div",{staticClass:"ml-1"},[t._v(t._s(e.time))])],1)]),i("td",[i("div",{staticClass:"d-flex align-center"},t._l(e.targets,(function(e){return i("div",{key:e.id,style:"item"===e.type?"padding-top: 4px":"",on:{click:function(i){return i.stopPropagation(),t.onVoyageSelected({index:s,targetId:e.id,targetType:e.type})}}},[i("item-icon",{attrs:{title:e.name,"icon-url":e.iconUrl,"icon-class":e.icon,type:e.type}})],1)})),0)]),i("td",[i("div",{staticClass:"d-flex align-center"},[i("div",[t._v(t._s(e.name))]),i("v-icon",[t._v(" "+t._s(e.shiftIcon)+" ")])],1)]),i("td",[i("div",{staticClass:"d-flex align-center"},t._l(e.voyageLocations,(function(e,s){return i("div",{key:s,staticClass:"d-flex align-center"},[0!==s?i("v-icon",{attrs:{color:"grey"}},[t._v(t._s(t.mdiArrowRight))]):t._e(),i("div",{staticClass:"mx-1 d-flex align-center"},[i("span",[t._v(t._s(e.name))]),i("v-icon",{attrs:{title:e.hint}},[t._v(t._s(e.icon))])],1)],1)})),0)])])})),0)]},proxy:!0}])})},n=[],a=(i("a9e3"),i("94ed")),o=i("8b70"),r=i("2069"),l=i("9197"),c={name:"OceanFishingTimeTableContentLarge",components:{ToggleButton:l["a"],ItemIcon:o["a"]},mixins:[r["a"]],props:{voyages:{type:Array,default:function(){return[]}},showCurrentRouteIndicator:{type:Boolean,default:!1},currentVoyageIndex:{type:Number,default:-1}},data:function(){return{mdiBell:a["l"],mdiBellOutline:a["m"],mdiArrowRight:a["j"]}}},d=c,h=i("2877"),u=i("6544"),f=i.n(u),m=i("132d"),p=i("1f4f"),v=i("2fa4"),g=Object(h["a"])(d,s,n,!1,null,"492d58ca",null);e["a"]=g.exports;f()(g,{VIcon:m["a"],VSimpleTable:p["a"],VSpacer:v["a"]})},ef9a:function(t,e,i){"use strict";var s=i("5530"),n=(i("8f5a"),i("7efd")),a=i("a9ad"),o=i("58df");e["a"]=Object(o["a"])(n["a"],a["a"]).extend({name:"v-chip-group",provide:function(){return{chipGroup:this}},props:{column:Boolean},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({},n["a"].options.computed.classes.call(this)),{},{"v-chip-group":!0,"v-chip-group--column":this.column})}},watch:{column:function(t){t&&(this.scrollOffset=0),this.$nextTick(this.onResize)}},methods:{genData:function(){return this.setTextColor(this.color,Object(s["a"])({},n["a"].options.methods.genData.call(this)))}}})}}]);