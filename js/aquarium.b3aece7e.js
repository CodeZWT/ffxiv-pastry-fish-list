(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["aquarium"],{"0a33":function(t,e,i){"use strict";i("c5f5")},"12c3":function(t,e,i){t.exports=i.p+"img/beian-icon.d0289dc0.png"},"1b30":function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-hover",{attrs:{"open-delay":"200","close-deplay":"300"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.hover;return[i("v-card",{staticClass:"rounded-b-xl rounded-t-l",staticStyle:{overflow:"hidden"},attrs:{elevation:"8"}},[i("v-card-text",[i("div",{staticClass:"d-flex align-center"},[i("item-icon",{attrs:{"icon-class":t.fish.icon}}),i("div",[i("div",{staticClass:"d-flex"},[i("div",[t._v(t._s(t.fish.name))]),1===t.fish.available?i("v-badge",{attrs:{color:"primary",inline:"",content:"新"}}):t._e(),2===t.fish.available?i("v-badge",{attrs:{color:"error",inline:"",content:"未实装"}}):t._e()],1),i("v-badge",{attrs:{content:t.fish.patch,inline:""}})],1),i("v-spacer"),i("div",[i("div",{staticClass:"d-flex flex-column align-end"},[i("div",[t._v(t._s(t.fish.size))]),i("div",[t._v(t._s(t.fish.water))])])])],1)]),1===t.fish.sizeId?i("v-carousel",{attrs:{"hide-delimiter-background":"","show-arrows-on-hover":"",height:"175"},model:{value:t.currentIndex,callback:function(e){t.currentIndex=e},expression:"currentIndex"}},t._l(t.fish.images,(function(t,e){return i("v-carousel-item",{key:e},[i("gif-loader",{attrs:{src:t.gif,"cover-src":t.cover,height:175,contain:0===e}})],1)})),1):i("gif-loader",{attrs:{src:t.fish.images[0].gif,"cover-src":t.fish.images[0].cover,height:175}}),a&&!t.isMobile?i("div",{staticStyle:{position:"absolute",right:"0",bottom:"0"}},[i("v-chip",{staticClass:"rounded-tl-xl rounded-bl-0 rounded-r-0",staticStyle:{"z-index":"5"},on:{click:function(e){t.showExpandedDialog=!0}}},[i("v-icon",[t._v(" "+t._s(t.mdiArrowExpandAll)+" ")])],1)],1):t._e()],1)]}}])}),1===t.fish.sizeId?[i("rc-dialog",{attrs:{"content-class":"rounded-xl",width:0===t.currentIndex?t.imageSizeS.w:t.imageSizeNormal.w,height:0===t.currentIndex?t.imageSizeS.h:t.imageSizeNormal.h},model:{value:t.showExpandedDialog,callback:function(e){t.showExpandedDialog=e},expression:"showExpandedDialog"}},[i("gif-loader",{attrs:{src:t.fish.images[t.currentIndex].gif,"cover-src":t.fish.images[t.currentIndex].cover,width:0===t.currentIndex?t.imageSizeS.w:t.imageSizeNormal.w,height:0===t.currentIndex?t.imageSizeS.h:t.imageSizeNormal.h}})],1)]:[i("rc-dialog",{attrs:{"content-class":"rounded-xl",width:t.imageSizeNormal.w},model:{value:t.showExpandedDialog,callback:function(e){t.showExpandedDialog=e},expression:"showExpandedDialog"}},[i("gif-loader",{attrs:{src:t.fish.images[0].gif,"cover-src":t.fish.images[0].cover,width:t.imageSizeNormal.w,height:t.imageSizeNormal.h}})],1)]],2)},s=[],n=i("94ed"),o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.showGif?i("div",{staticClass:"system d-flex justify-center align-center",staticStyle:{"min-width":"100px","min-height":"100px"}},[i("div",{staticStyle:{position:"absolute","text-align":"center"}},[t._v("加载中...")]),i("v-img",{attrs:{src:t.src,height:t.height,width:t.width,contain:t.contain},scopedSlots:t._u([{key:"placeholder",fn:function(){return[i("v-row",{staticClass:"fill-height ma-0",attrs:{align:"center",justify:"center"}},[i("v-progress-circular",{attrs:{indeterminate:"",color:"grey lighten-5"}})],1)]},proxy:!0}])})],1):i("div",[i("v-hover",{attrs:{"open-delay":"200","close-deplay":"300"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.hover;return[i("div",{staticStyle:{position:"relative"},on:{click:function(e){t.showGif=!0}}},[a?i("v-overlay",{attrs:{absolute:""}},[i("div",{staticClass:"fill-height d-flex align-center"},[i("v-icon",{attrs:{"x-large":""}},[t._v(t._s(t.mdiPlayCircle))])],1)]):t._e(),i("v-img",{attrs:{src:t.coverSrc,height:t.height,width:t.width,contain:t.contain},scopedSlots:t._u([{key:"placeholder",fn:function(){return[i("v-row",{staticClass:"fill-height ma-0",attrs:{align:"center",justify:"center"}},[i("v-progress-circular",{attrs:{indeterminate:"",color:"grey lighten-5"}})],1)]},proxy:!0}],null,!0)})],1)]}}],null,!1,2683872969)})],1)},r=[],l=(i("a9e3"),{name:"GifLoader",props:{coverSrc:{type:String,default:void 0},src:{type:String,default:void 0},height:{type:Number,default:void 0},width:{type:Number,default:void 0},contain:{type:Boolean,default:!1}},data:function(){return{mdiPlayCircle:n["yb"],showGif:!1}},computed:{},created:function(){}}),c=l,d=i("2877"),u=i("6544"),h=i.n(u),v=i("ce87"),m=i("132d"),f=i("adda"),p=i("a797"),g=i("490a"),b=i("0fd9"),_=Object(d["a"])(c,o,r,!1,null,"310a3ffc",null),w=_.exports;h()(_,{VHover:v["a"],VIcon:m["a"],VImg:f["a"],VOverlay:p["a"],VProgressCircular:g["a"],VRow:b["a"]});var y=i("8b70"),x=i("1450"),S={name:"FishAquarium",components:{RcDialog:x["a"],ItemIcon:y["a"],GifLoader:w},props:{fish:{type:Object,default:function(){return{}}},isMobile:{type:Boolean,default:!1}},data:function(){return{mdiArrowExpandAll:n["i"],currentIndex:0,showExpandedDialog:!1,imageSizeNormal:{w:892,h:363},imageSizeS:{w:548,h:435}}}},I=S,C=i("4ca6"),k=i("b0af"),$=i("99d9"),T=i("5e66"),P=i("3e35"),V=i("cc20"),A=i("2fa4"),E=Object(d["a"])(I,a,s,!1,null,"76be3a46",null);e["a"]=E.exports;h()(E,{VBadge:C["a"],VCard:k["a"],VCardText:$["c"],VCarousel:T["a"],VCarouselItem:P["a"],VChip:V["a"],VHover:v["a"],VIcon:m["a"],VSpacer:A["a"]})},"1f4f":function(t,e,i){"use strict";i("a9e3");var a=i("5530"),s=(i("8b37"),i("80d2")),n=i("7560"),o=i("58df");e["a"]=Object(o["a"])(n["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(a["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(s["i"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"265e":function(t,e,i){},"3e35":function(t,e,i){"use strict";var a=i("5530"),s=i("1e6c"),n=i("adda"),o=i("58df"),r=i("80d2"),l=i("1c87"),c=Object(o["a"])(s["a"],l["a"]);e["a"]=c.extend().extend({name:"v-carousel-item",inject:{parentTheme:{default:{isDark:!1}}},provide:function(){return{theme:this.parentTheme}},inheritAttrs:!1,methods:{genDefaultSlot:function(){return[this.$createElement(n["a"],{staticClass:"v-carousel__item",props:Object(a["a"])(Object(a["a"])({},this.$attrs),{},{height:this.windowGroup.internalHeight}),on:this.$listeners,scopedSlots:{placeholder:this.$scopedSlots.placeholder}},Object(r["u"])(this))]},genWindowItem:function(){var t=this.generateRouteLink(),e=t.tag,i=t.data;return i.staticClass="v-window-item",i.directives.push({name:"show",value:this.isActive}),this.$createElement(e,i,this.genDefaultSlot())}}})},4588:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-footer",{staticClass:"text-subtitle-2 inner mt-10",staticStyle:{"border-top":"1px #494949 solid !important"}},[i("v-row",{staticClass:"d-flex justify-center text-center",attrs:{"no-gutters":""}},[i("v-col",{attrs:{cols:"12",md:t.columnCols}},[i("v-row",{attrs:{"no-gutters":""}},[i("v-subheader",[t._v(" 联系方式 ")]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiIdentifier))]),i("div",[t._v(t._s(t.$t("footer.author")))])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:t.openQQ}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiQqchat))]),i("div",[t._v("1153646847")])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openWeibo("7546879530")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiSinaWeibo))]),i("div",[t._v("红豆年糕找不到")])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:t.openQQGuild}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiQqchat))]),i("div",[t._v("频道：FF14 捕鱼人研究会")])],1)],1)],1),i("v-col",{attrs:{cols:"12",md:t.columnCols}},[i("v-row",{attrs:{"no-gutters":""}},[i("v-subheader",[t._v(" 友情链接 ")]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openWeibo("7245459345")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiSinaWeibo))]),i("div",[t._v("光之渔夫bot")])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink(t.GARLAND_URL+"/db/")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiLink))]),i("div",[t._v("Garland/花环国服数据站")])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink("http://www.ffxiv.co")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiLink))]),i("div",[t._v("飞艇坪 - 最终幻想14网址导航")])],1)],1)],1),i("v-col",{attrs:{cols:"12",md:t.columnCols}},[i("v-row",{attrs:{"no-gutters":""}},[i("v-subheader",[t._v(" 站点信息 ")]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"}},[i("v-img",{attrs:{src:t.logo,"max-width":"24","max-height":"24"}}),i("div",{staticClass:"ml-1"},[t._v("鱼糕 V"+t._s(t.version))])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink("https://github.com/ricecake404/ffxiv-pastry-fish-list")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiGithub))]),i("div",[t._v("FFXIV Pastry Fish List")])],1),i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink("https://ricecake302.coding.net/s/569c25c7-3f53-4678-baaa-95641a4d27f3")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiHammerWrench))]),i("div",[t._v(t._s(t.$t("faqPage.title")))])],1),"CN"===t.region?i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink("https://fish.ricecake302.com")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiEarth))]),i("div",[t._v(t._s("国际站点"))])],1):i("v-col",{staticClass:"link-item",attrs:{cols:"12"},on:{click:function(e){return t.openLink("https://ricecake.traveleorzea.com")}}},[i("v-icon",{staticClass:"pr-1"},[t._v(t._s(t.mdiEarth))]),i("div",[t._v(t._s("国内站点"))])],1)],1)],1),i("v-col",{attrs:{cols:"12",md:t.columns%2===1?12:t.columnCols}},[i("v-row",{attrs:{"no-gutters":""}},[i("v-subheader",[t._v(" 其他信息 ")]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"}},[i("a",{staticClass:"pl-6",attrs:{target:"_blank",href:"https://beian.miit.gov.cn"}},[t._v(" 黔ICP备2020011894号-1 ")])]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"}},[i("div",{staticClass:"d-flex justify-center"},[i("v-img",{staticClass:"mr-1",attrs:{src:t.beianIcon,"max-width":"20","max-height":"20"}}),i("a",{attrs:{target:"_blank",href:"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52270102000276"}},[t._v(" 黔公网安备 52270102000276号 ")])],1)]),i("v-col",{staticClass:"link-item",attrs:{cols:"12"}},[i("div",[t._v(t._s(t.$t("footer.ffRights")))])])],1)],1)],1)],1)},s=[],n=(i("a9e3"),i("94ed")),o=i("9224"),r=i("47f3"),l=i("04d5"),c=i("7a7d"),d=i("e111"),u=i.n(d),h=i("12c3"),v=i.n(h),m={name:"RcFooter",mixins:[l["a"]],props:{columns:{type:Number,default:4}},data:function(){return{GARLAND_URL:"https://ffxiv.cyanclay.xyz",beianIcon:v.a,showAboutDialog:!1,mdiQqchat:n["Bb"],mdiIdentifier:n["hb"],mdiSinaWeibo:n["Eb"],mdiLink:n["jb"],mdiGithub:n["bb"],mdiHammerWrench:n["cb"],mdiEarth:n["O"],logo:c["a"].getImgUrl("pastry-fish-flat.webp","logo"),version:o["a"],region:r["a"].siteRegion()}},computed:{columnCols:function(){return 12/this.columns}},methods:{openQQ:function(){window.open(u.a.QQ)},openQQGuild:function(){window.open(u.a.QQGuild)},openWeibo:function(t){window.open("https://weibo.com/u/".concat(t))},openAfdian:function(){window.open(u.a.AFDian)},openLink:function(t){window.open(t)}}},f=m,p=(i("0a33"),i("2877")),g=i("6544"),b=i.n(g),_=i("62ad"),w=(i("c7cd"),i("5530")),y=(i("b5b6"),i("8dd9")),x=i("3a66"),S=i("d10f"),I=i("58df"),C=i("80d2"),k=Object(I["a"])(y["a"],Object(x["a"])("footer",["height","inset"]),S["a"]).extend({name:"v-footer",props:{height:{default:"auto",type:[Number,String]},inset:Boolean,padless:Boolean,tag:{type:String,default:"footer"}},computed:{applicationProperty:function(){return this.inset?"insetFooter":"footer"},classes:function(){return Object(w["a"])(Object(w["a"])({},y["a"].options.computed.classes.call(this)),{},{"v-footer--absolute":this.absolute,"v-footer--fixed":!this.absolute&&(this.app||this.fixed),"v-footer--padless":this.padless,"v-footer--inset":this.inset})},computedBottom:function(){if(this.isPositioned)return this.app?this.$vuetify.application.bottom:0},computedLeft:function(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.left:0},computedRight:function(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.right:0},isPositioned:function(){return Boolean(this.absolute||this.fixed||this.app)},styles:function(){var t=parseInt(this.height);return Object(w["a"])(Object(w["a"])({},y["a"].options.computed.styles.call(this)),{},{height:isNaN(t)?t:Object(C["i"])(t),left:Object(C["i"])(this.computedLeft),right:Object(C["i"])(this.computedRight),bottom:Object(C["i"])(this.computedBottom)})}},methods:{updateApplication:function(){var t=parseInt(this.height);return isNaN(t)?this.$el?this.$el.clientHeight:0:t}},render:function(t){var e=this.setBackgroundColor(this.color,{staticClass:"v-footer",class:this.classes,style:this.styles});return t(this.tag,e,this.$slots.default)}}),$=i("132d"),T=i("adda"),P=i("0fd9"),V=i("e0c7"),A=Object(p["a"])(f,a,s,!1,null,"0ff25cac",null);e["a"]=A.exports;b()(A,{VCol:_["a"],VFooter:k,VIcon:$["a"],VImg:T["a"],VRow:P["a"],VSubheader:V["a"]})},4802:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("page-template",[i("v-row",[i("v-card",{staticClass:"mx-2",staticStyle:{width:"100%"}},[i("v-expansion-panels",{attrs:{hover:"",flat:""}},[i("v-expansion-panel",{staticClass:"system"},[i("v-expansion-panel-header",{staticClass:"system"},[i("div",{staticStyle:{display:"flex","justify-content":"center"}},[i("div",[i("v-icon",[t._v(t._s(t.mdiInformation))]),t._v(" "+t._s(t.$t("aquariumPage.note.title"))+" ")],1)])]),i("v-expansion-panel-content",[i("v-row",[i("v-col",{attrs:{cols:t.isMobile?12:10}},[i("i18n",{staticClass:"text-subtitle-1",staticStyle:{"text-align":"center"},attrs:{path:"aquariumPage.note.source",tag:"div"}},[i("span",{staticClass:"font-weight-bold",attrs:{place:"author"}},[t._v(t._s(t.$t("aquariumPage.note.author")))])]),i("div",[i("div",[t._v(t._s(t.$t("aquariumPage.note.explanation.line1")))]),i("div",[t._v(t._s(t.$t("aquariumPage.note.explanation.line2")))]),i("div",[t._v(" "+t._s(t.$t("aquariumPage.note.explanation.line3"))+" ")]),i("v-simple-table",[i("colgroup",[i("col",{staticStyle:{width:"12%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}})]),i("thead",[i("tr",[i("th"),i("th",[t._v(t._s(t.$t("aquariumPage.note.box1")))]),i("th",[t._v(t._s(t.$t("aquariumPage.note.explanation.box2")))]),i("th",[t._v(t._s(t.$t("aquariumPage.note.explanation.box3")))]),i("th",[t._v(t._s(t.$t("aquariumPage.note.explanation.box4")))])])]),i("tbody",[i("tr",[i("td",[t._v(" "+t._s(t.$t("aquariumPage.note.explanation.boxFishQuantity"))+" ")]),i("td",[t._v("1")]),i("td",[t._v("2")]),i("td",[t._v("3")]),i("td",[t._v("4")])]),i("tr",[i("th",[t._v(t._s(t.$t("aquariumPage.note.explanation.boxCapacity")))]),i("td",[t._v("1")]),i("td",[t._v("2")]),i("td",[t._v("4")]),i("td",[t._v("7")])])])]),i("div",[t._v(" "+t._s(t.$t("aquariumPage.note.explanation.line4"))+" ")]),i("v-simple-table",[i("colgroup",[i("col",{staticStyle:{width:"12%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}}),i("col",{staticStyle:{width:"22%"},attrs:{span:"1"}})]),i("thead",[i("tr",[i("th"),i("th",[t._v("S")]),i("th",[t._v("M")]),i("th",[t._v("L")]),i("th",[t._v("XL")])])]),i("tbody",[i("tr",[i("th",[t._v(" "+t._s(t.$t("aquariumPage.note.explanation.fishSizeNumber"))+" ")]),i("td",[t._v("1")]),i("td",[t._v("2")]),i("td",[t._v("4")]),i("td",[t._v("7")])])])])],1)],1),i("v-col",{attrs:{cols:t.isMobile?12:2}},[i("v-img",{attrs:{src:t.aquariumSettingImg}})],1)],1)],1)],1)],1),i("v-card-text",[i("v-row",[i("v-col",[i("v-subheader",[t._v(t._s(t.$t("aquariumPage.note.explanation.fishSize")))]),i("v-btn-toggle",{attrs:{rounded:"",multiple:"",mandatory:"","active-class":"primary"},model:{value:t.sizeIndicesToShow,callback:function(e){t.sizeIndicesToShow=e},expression:"sizeIndicesToShow"}},t._l(t.allSizes,(function(e){return i("v-btn",{key:e.id,attrs:{small:""}},[t._v(" "+t._s(e.size)+" ")])})),1)],1),i("v-col",[i("v-subheader",[t._v(t._s(t.$t("aquariumPage.note.explanation.waterType")))]),i("v-btn-toggle",{attrs:{rounded:"",multiple:"",mandatory:"","active-class":"primary"},model:{value:t.waterIndicesToShow,callback:function(e){t.waterIndicesToShow=e},expression:"waterIndicesToShow"}},t._l(t.allWater,(function(e){return i("v-btn",{key:e.id,attrs:{small:""}},[t._v(" "+t._s(e.name_chs)+" ")])})),1)],1),i("v-col",[i("v-subheader",[t._v(t._s(t.$t("aquariumPage.note.explanation.fishPatch")))]),i("v-btn-toggle",{attrs:{rounded:"",multiple:"",mandatory:"","active-class":"primary"},model:{value:t.fishPatchIndicesToShow,callback:function(e){t.fishPatchIndicesToShow=e},expression:"fishPatchIndicesToShow"}},t._l(t.PATCH_TEXT,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(e)+" ")])})),1)],1),i("v-col",[i("v-subheader",[t._v(t._s(t.$t("aquariumPage.note.explanation.updateStatus")))]),i("v-btn-toggle",{attrs:{rounded:"",multiple:"",mandatory:"","active-class":"primary"},model:{value:t.availableIndicesFilter,callback:function(e){t.availableIndicesFilter=e},expression:"availableIndicesFilter"}},t._l(t.AVAILABLE_TYPES,(function(e){return i("v-btn",{key:e,attrs:{small:""}},[t._v(" "+t._s(e)+" ")])})),1)],1)],1),i("v-row",[i("v-col",[i("rc-autocomplete",{ref:"search",attrs:{items:t.filteredList,"item-value":"id","item-text":"name",label:t.$t("aquariumPage.search.placeholder"),clearable:"",solo:"",filter:t.filterOptions},scopedSlots:t._u([{key:"item",fn:function(e){return[i("div",{staticClass:"d-flex"},[i("v-list-item-avatar",[i("raw-item-icon",{attrs:{"icon-class":e.item.icon}})],1),i("v-list-item-content",[i("v-list-item-title",[i("div",[t._v(" "+t._s(e.item.name)+" ")])])],1)],1)]}}]),model:{value:t.fishId,callback:function(e){t.fishId=e},expression:"fishId"}})],1)],1)],1)],1)],1),i("v-row",t._l(t.searchFilteredList,(function(e){return i("v-col",{key:e.id,attrs:{cols:t.cols}},[i("v-lazy",{attrs:{options:{threshold:.5},"min-height":"240",transition:"fade-transition"}},[i("fish-aquarium",{attrs:{fish:e,"is-mobile":t.isMobile}})],1)],1)})),1)],1)},s=[],n=(i("4de4"),i("caad"),i("c975"),i("d81d"),i("b64b"),i("07ac"),i("ac1f"),i("2532"),i("466d"),i("1276"),i("eeec")),o=i("b3e7"),r=i("94ed"),l=i("1aeb"),c=i("47f3"),d=i("1b30"),u=i("7a7d"),h=i("6fab"),v=i("7163"),m=i("d22a"),f=i("517c"),p=i("1b36"),g=[2,3,4,5,6],b={name:"AquariumPage",mixins:[h["a"]],components:{PageTemplate:v["a"],RcAutocomplete:p["a"],RawItemIcon:f["a"],FishAquarium:d["a"]},props:["original"],data:function(){return{mdiInformation:r["ib"],aquariumSettingImg:u["a"].getImgUrl("aquarium-setting.webp"),isElectron:c["a"].isElectron(),sizeIndicesToShow:Object.keys(n["AQUARIUM_FISH_SIZE"]).map((function(t){return t-1})),waterIndicesToShow:Object.keys(n["AQUARIUM_WATER"]).map((function(t){return t-1})),PATCH_TEXT:g.map((function(t){return t+".X"})),fishPatchIndicesToShow:g.map((function(t,e){return e})),allSizes:n["AQUARIUM_FISH_SIZE"],allWater:n["AQUARIUM_WATER"],AVAILABLE_TYPES:[this.$t("aquariumPage.filter.normal"),this.$t("aquariumPage.filter.new"),this.$t("aquariumPage.filter.future")],availableIndicesFilter:[0,1,2],fishId:void 0}},computed:{cols:function(){return this.isMobile?12:4},aquariumFishList:function(){return Object.values(n["AQUARIUMS"]).map((function(t){var e,i,a,s,n,r=null!==(e=null===(i=l["a"].FISH_ID_TO_WIKI_IDS[t.id])||void 0===i||null===(a=i[0])||void 0===a||null===(s=a.split("-"))||void 0===s?void 0:s[3])&&void 0!==e?e:t.id,c=null!==(n=l["a"].FISH_DATA[r])&&void 0!==n?n:o["OCEAN_FISHING_FISH"][t.id];return l["a"].assembleAquarium(t,c)}))},filteredList:function(){var t=this;return this.aquariumFishList.filter((function(e){return t.sizeIndicesToShow.map((function(t){return t+1})).includes(e.sizeId)})).filter((function(e){return t.waterIndicesToShow.map((function(t){return t+1})).includes(e.waterId)})).filter((function(e){return t.fishPatchIndicesToShow.map((function(t){return g[t]})).includes(Math.floor(e.patch))})).filter((function(e){return t.availableIndicesFilter.includes(e.available)}))},searchFilteredList:function(){var t=this;return this.filteredList.filter((function(e){return null==t.fishId||e.id===t.fishId}))}},methods:{filterOptions:function(t,e,i){return"zh-CN"===this.$i18n.locale?!1!==m["a"].match(i,e):i.toLowerCase().indexOf(e.toLowerCase())>-1}}},_=b,w=i("2877"),y=i("6544"),x=i.n(y),S=i("8336"),I=i("a609"),C=i("b0af"),k=i("99d9"),$=i("62ad"),T=i("cd55"),P=i("49e2"),V=i("c865"),A=i("0393"),E=i("132d"),O=i("adda"),j=i("5530"),L=i("24b2"),q=i("f2e7"),z=i("90a2"),D=i("58df"),F=i("80d2"),B=Object(D["a"])(L["a"],q["a"]).extend({name:"VLazy",directives:{intersect:z["a"]},props:{options:{type:Object,default:function(){return{root:void 0,rootMargin:void 0,threshold:void 0}}},tag:{type:String,default:"div"},transition:{type:String,default:"fade-transition"}},computed:{styles:function(){return Object(j["a"])({},this.measurableStyles)}},methods:{genContent:function(){var t=this.isActive&&Object(F["u"])(this);return this.transition?this.$createElement("transition",{props:{name:this.transition}},t):t},onObserve:function(t,e,i){this.isActive||(this.isActive=i)}},render:function(t){return t(this.tag,{staticClass:"v-lazy",attrs:this.$attrs,directives:[{name:"intersect",value:{handler:this.onObserve,options:this.options}}],on:this.$listeners,style:this.styles},[this.genContent()])}}),N=i("8270"),R=i("5d23"),Q=i("0fd9"),H=i("1f4f"),M=i("e0c7"),W=Object(w["a"])(_,a,s,!1,null,null,null);e["default"]=W.exports;x()(W,{VBtn:S["a"],VBtnToggle:I["a"],VCard:C["a"],VCardText:k["c"],VCol:$["a"],VExpansionPanel:T["a"],VExpansionPanelContent:P["a"],VExpansionPanelHeader:V["a"],VExpansionPanels:A["a"],VIcon:E["a"],VImg:O["a"],VLazy:B,VListItemAvatar:N["a"],VListItemContent:R["a"],VListItemTitle:R["c"],VRow:Q["a"],VSimpleTable:H["a"],VSubheader:M["a"]})},"5d2d":function(t,e,i){"use strict";i("265e")},"5e66":function(t,e,i){"use strict";i("a9e3");var a=i("5530"),s=(i("63b7"),i("f665")),n=i("afdd"),o=i("9d26"),r=i("37c6"),l=i("3860"),c=i("80d2"),d=i("d9bd");e["a"]=s["a"].extend({name:"v-carousel",props:{continuous:{type:Boolean,default:!0},cycle:Boolean,delimiterIcon:{type:String,default:"$delimiter"},height:{type:[Number,String],default:500},hideDelimiters:Boolean,hideDelimiterBackground:Boolean,interval:{type:[Number,String],default:6e3,validator:function(t){return t>0}},mandatory:{type:Boolean,default:!0},progress:Boolean,progressColor:String,showArrows:{type:Boolean,default:!0},verticalDelimiters:{type:String,default:void 0}},provide:function(){return{parentTheme:this.theme}},data:function(){return{internalHeight:this.height,slideTimeout:void 0}},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({},s["a"].options.computed.classes.call(this)),{},{"v-carousel":!0,"v-carousel--hide-delimiter-background":this.hideDelimiterBackground,"v-carousel--vertical-delimiters":this.isVertical})},isDark:function(){return this.dark||!this.light},isVertical:function(){return null!=this.verticalDelimiters}},watch:{internalValue:"restartTimeout",interval:"restartTimeout",height:function(t,e){t!==e&&t&&(this.internalHeight=t)},cycle:function(t){t?this.restartTimeout():(clearTimeout(this.slideTimeout),this.slideTimeout=void 0)}},created:function(){this.$attrs.hasOwnProperty("hide-controls")&&Object(d["a"])("hide-controls",':show-arrows="false"',this)},mounted:function(){this.startTimeout()},methods:{genControlIcons:function(){return this.isVertical?null:s["a"].options.methods.genControlIcons.call(this)},genDelimiters:function(){return this.$createElement("div",{staticClass:"v-carousel__controls",style:{left:"left"===this.verticalDelimiters&&this.isVertical?0:"auto",right:"right"===this.verticalDelimiters?0:"auto"}},[this.genItems()])},genItems:function(){for(var t=this,e=this.items.length,i=[],a=0;a<e;a++){var s=this.$createElement(n["a"],{staticClass:"v-carousel__controls__item",attrs:{"aria-label":this.$vuetify.lang.t("$vuetify.carousel.ariaLabel.delimiter",a+1,e)},props:{icon:!0,small:!0,value:this.getValue(this.items[a],a)}},[this.$createElement(o["a"],{props:{size:18}},this.delimiterIcon)]);i.push(s)}return this.$createElement(l["a"],{props:{value:this.internalValue,mandatory:this.mandatory},on:{change:function(e){t.internalValue=e}}},i)},genProgress:function(){return this.$createElement(r["a"],{staticClass:"v-carousel__progress",props:{color:this.progressColor,value:(this.internalIndex+1)/this.items.length*100}})},restartTimeout:function(){this.slideTimeout&&clearTimeout(this.slideTimeout),this.slideTimeout=void 0,window.requestAnimationFrame(this.startTimeout)},startTimeout:function(){this.cycle&&(this.slideTimeout=window.setTimeout(this.next,+this.interval>0?+this.interval:6e3))}},render:function(t){var e=s["a"].options.render.call(this,t);return e.data.style="height: ".concat(Object(c["i"])(this.height),";"),this.hideDelimiters||e.children.push(this.genDelimiters()),(this.progress||this.progressColor)&&e.children.push(this.genProgress()),e}})},"63b7":function(t,e,i){},"6fab":function(t,e,i){"use strict";var a,s,n={name:"PageMixin",props:{isMobile:{type:Boolean,default:!1}}},o=n,r=i("2877"),l=Object(r["a"])(o,a,s,!1,null,"6cc451db",null);e["a"]=l.exports},7163:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:{"detail-wrapper":!0,"detail-wrapper--web":!t.isElectron,"detail-wrapper--electron":t.isElectron}},[t._t("default"),i("v-spacer"),i("rc-footer")],2)},s=[],n=i("04d5"),o=i("4588"),r={name:"PageTemplate",components:{RcFooter:o["a"]},mixins:[n["a"]]},l=r,c=(i("5d2d"),i("2877")),d=i("6544"),u=i.n(d),h=i("2fa4"),v=Object(c["a"])(l,a,s,!1,null,"57e0ed8d",null);e["a"]=v.exports;u()(v,{VSpacer:h["a"]})},"8b37":function(t,e,i){},b5b6:function(t,e,i){},c5f5:function(t,e,i){}}]);