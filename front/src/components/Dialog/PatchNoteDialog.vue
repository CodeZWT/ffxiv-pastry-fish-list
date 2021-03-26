<template>
  <v-dialog
    :value="showPatchNoteDialog && !inMigrationPage"
    @input="$emit('input', $event)"
    max-width="600px"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ $t('top.patchNote') }}
        <v-spacer />
        <div class="d-flex flex-column align-center">
          <a
            href="https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/3"
            target="_blank"
          >
            如有错误，请前往此页面
          </a>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text style="max-height: 600px;">
        <div class="text-h6">Version 0.7.1</div>
        <div class="text-subtitle-1">更新时间: 2021/03/26 23:55</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>
            修正“只能用该鱼饵”在普通列表中显示的问题
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.7.0</div>
        <div class="text-subtitle-1">更新时间: 2021/03/26 22:40</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <v-alert outlined type="success" border="left" icon="mdi-ferry">
          <ul>
            <li>
              增加了5.4海钓新页面，游戏正式更新后，旧海钓页面将会删除
            </li>
            <li>
              更新海钓页面部分内容的排版
            </li>
            <li>
              增加海钓任务的支持
            </li>
            <li>
              增加5.4海钓攻略，感谢
              <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 的大力支持!
            </li>
          </ul>
        </v-alert>

        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            修复退出副本时的报错，如还有问题欢迎反馈。
          </li>
        </ul>
        <v-alert outlined type="warning" border="left">
          预先告知：国服预计将在近期更新5.4版本，届时渔捞相关检测功能会失效一段时间，等待自动更新即可。更新时间预计在游戏正式更新后几天内，请耐心等待。
        </v-alert>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.10</div>
        <div class="text-subtitle-1">更新时间: 2021/03/16 23:40</div>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            尝试修复关闭鱼糕时的报错，如还有问题欢迎反馈。
          </li>
          <li>
            修复无网络时更新报错的问题。
          </li>
        </ul>
        <p />

        <v-divider />

        <v-alert outlined type="warning" border="left">
          3/15
          更新了多次版本，但是没有更新版本号。由于主要是后台代码更新，所以看上去像是出了无限更新的BUG...因此之后版本更新都会更新版本号，并加入更新时间。
        </v-alert>
        <div class="text-h6">Version 0.6.9</div>
        <div class="text-subtitle-1">更新时间: 2021/03/16 01:11</div>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            修复切换迷你模式的报错
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.8</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <v-alert outlined type="success" border="left">
          <ul>
            <li>
              增加了海钓蓝鱼攻略，感谢
              <span class="font-weight-bold">鱼太公@摩杜纳</span> 的大力支持!
            </li>
            <li>
              增加5.X鱼王攻略，感谢
              <span class="font-weight-bold">克图格亚w@神意之地</span> 的大力支持!
            </li>
          </ul>
        </v-alert>
        <ul>
          <li>水族馆S尺寸鱼，增加了新图（高清版本在未来更新）</li>
          <li>去除第二期空岛的过期信息</li>
        </ul>

        <div class="text-h5 text-center my-1">
          渔捞
        </div>
        <v-alert outlined type="error" border="left">
          若使用渔捞报错，请检查是否使用了防火墙相关的软件。若是，请将鱼糕安装目录加入信任区。
          <a
            href="https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/3"
            target="_blank"
          >
            具体做法请见此处
          </a>
        </v-alert>
        <v-alert outlined type="warning" border="left">
          <ul>
            <li>
              本次更新后，渔捞部分设置（窗口大小、位置、透明度、缩放）重置，需要重新配置。
            </li>
            <li>
              国际服海钓幻海流补偿机制仍在测试中，欢迎反馈。
            </li>
          </ul>
        </v-alert>
        <ul>
          <li>
            增加自定义咬钩提示音
          </li>
          <li>
            增加自定义计时器迷你模式的缩放比例
          </li>
          <li>
            支持删除单条历史记录
          </li>
          <li>
            修复部分脱钩判断错误的问题
          </li>
          <li>
            修复5.4海钓钓场判断错误
          </li>
          <li>
            修复收藏品状态的判断问题
          </li>
        </ul>
        <div class="text-h5 text-center my-1">
          桌面版
        </div>
        <ul>
          <li>
            增加系统托盘支持
          </li>
          <li>
            增加鼠标穿透支持
          </li>
          <li>
            修复<kbd>WIN</kbd>+<kbd>D</kbd>导致渔捞和悬浮窗最小化的问题
          </li>
          <li>
            修复更新时打开安装文件夹报错的问题
          </li>
          <li>
            修复WINDOWS 8.1无法显示渔捞界面的问题
          </li>
        </ul>

        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.7</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>增加水族馆<v-icon>mdi-fishbowl</v-icon></li>
          <li>增加列表页面水族馆支持</li>
        </ul>

        <div class="text-h5 text-center my-1">
          渔捞
        </div>
        <ul>
          <li>国际服支持</li>
          <li>
            国际服海钓增加了补偿机制，暂未支持，目前仍为固定的2分钟，请暂时自行判断是否延长幻海流时间（预计在下版本加入支持）。
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.6</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>
            再次修复鱼饵筛选选择错位的问题 (是的，上次修出新的问题了。。。）
          </li>
          <li>
            修复列表展开过慢的问题
          </li>
          <li>
            支持在列表上点击鱼饵列中的鱼（即鱼饵列中以小钓大中的鱼）显示对应鱼信息
          </li>
          <li>
            钓鱼笔记中的批量选择框变为默认不显示，点击批量处理按钮以显示原先的选择框。（防止误操作）
          </li>
          <li>
            更新部分鱼数据，以及5.X鱼攻略。
          </li>
        </ul>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <v-subheader>计时器</v-subheader>
        <ul>
          <li>
            修复未打开计时器仍会发出提钩提示音的问题
          </li>
          <li>
            修复刺鱼造成的记录错误
          </li>
          <li>
            增加迷你模式
          </li>
          <li>
            增加主界面跳转到对应钓场的功能
          </li>
          <li>
            增加配置仅在钓上HQ鱼时才标记为已完成的功能
          </li>
          <li>
            增加显示当前获得力、鉴别力、采集力
          </li>
        </ul>
        <v-subheader>历史记录</v-subheader>
        <ul>
          <li>
            历史记录增加显示
            <ul>
              <li>
                hq，长度，获得力，鉴别力，提钩类别
              </li>
              <li>
                状态增加：捕鱼人之识，耐心，耐心II
              </li>
            </ul>
          </li>
          <li>
            增加新的筛选
          </li>
          <li>
            增加导出文件功能
          </li>
          <li>
            增加清除历史记录功能
          </li>
          <li>
            增加对于脱钩记录的支持
          </li>
          <li>
            更新图标，计时条
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.5</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>
            修复无法导入的问题
          </li>
          <li>
            修复右上按钮显示不全的问题
          </li>
          <li>
            修复鱼饵筛选选择错位的问题
          </li>
          <li>
            增加存储默认与固定列表的展开状态的功能
          </li>
          <li>
            增加存储鱼饵筛选状态的功能
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.4</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>
            增加5.4版本鱼
          </li>
          <li>
            增加5.4版本鱼眼功能支持
            <span class="error--text">（请注意：国服当前版本尚未实装新鱼眼）</span>
          </li>
        </ul>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            修复查看帮助后，最小化悬浮窗出现黑色底框的问题。
          </li>
          <li>
            修复最小化悬浮窗后，透明窗体覆盖其他窗口的问题。
          </li>
        </ul>
        <p />

        <v-divider />

        <div class="text-h6">Version 0.6.3</div>
        <div class="text-h5 text-center my-1">
          鱼糕
        </div>
        <ul>
          <li>
            更新攻略内容的修正
          </li>
          <li>
            增加滚动条宽度
          </li>
        </ul>

        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            增加页面缩放功能（对应浏览器的页面缩放功能，在主界面设置中配置）。
          </li>
          <li>
            支持保存窗口位置与大小
          </li>
          <li>
            渔捞
            <ul>
              <li>
                增加初始加载页面
              </li>
              <li>
                增加历史记录页面
              </li>
              <li>
                增加钓场统计界面
              </li>
              <li>
                增加透明度与缩放配置界面
              </li>
              <li>
                支持保存窗口位置与大小
              </li>
            </ul>
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.6.2</div>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            修复最小化按钮没有正常显示的问题。
          </li>
          <li>
            修复游戏“窗口全屏模式”下无法置顶的问题。
          </li>
          <li>
            修复直接通过WIN10任务栏关闭窗口后报错的问题。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.6.1</div>
        <div class="text-h5 text-center my-1">
          渔捞 - 钓鱼辅助
        </div>
        <div class="text-subtitle-1 text-center">
          （点击桌面版左侧侧边栏<v-icon>mdi-fish</v-icon>开启）
        </div>
        <div class="text-subtitle-2 error--text">
          为了确保最准确的倒计时，请在开始海钓前或空岛进图前开启桌面版程序。
        </div>
        <ul>
          <li>
            支持自动标记已完成（可在渔捞右上
            <v-icon small>mdi-cog</v-icon>
            设置中配置是否开启）
          </li>
          <li>
            支持自动更新，当未来版本更新时会自动更新。但并不能保证开服时马上能够使用，届时会有相应的提示，请以提示为准。
          </li>
          <li>桌面版增加钓鱼自动计时功能</li>
          <li>支持杆型声音提示</li>
          <li>支持幻海流计时</li>
          <li>支持空岛天气计时</li>
          <li>支持显示当前状态（拍击水面、撒饵、专一垂钓、收藏品采集）</li>
        </ul>
        <v-divider />
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>
            支持透明并在游戏上层显示，支持悬浮窗模式。（透明度可在左下设置中调整）
          </li>
          <li>
            可以跳过更新（跳过更新后，下次打开程序会再次检查更新）
          </li>
        </ul>
        <p />
        <v-divider />
        <div class="text-h5 text-center my-1">
          修正
        </div>
        <ul>
          <li>更新部分鱼以及5.X攻略数据。</li>
          <li>
            在搜索框跳转时自动关闭搜索对话框。
          </li>
          <li>
            修正手机网页版钓鱼笔记列表的显示问题。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.6.0</div>
        <div class="text-h5 text-center my-1">
          网站迁移
        </div>
        <ul>
          <li>如果你看到这行字，说明已经在新版页面了。</li>
          <li>请更新收藏夹中的地址：https://ricecake.traveleorzea.com</li>
          <li>
            桌面版是自动更新的，无需任何操作
          </li>
        </ul>
        <div class="text-h5 text-center my-1">
          鱼糕桌面版
        </div>
        <ul>
          <li>点击左侧 <v-icon>mdi-desktop-mac-dashboard</v-icon> 下载桌面版</li>
          <li>
            支持自动更新
          </li>
        </ul>
        <p />
        <v-divider />
        <div class="text-h6">Version 0.5.3</div>
        <div class="text-h5 text-center my-1">
          鱼饵相关功能
        </div>
        <ul>
          <li>
            增加鱼饵筛选功能，在筛选界面中可以开启鱼饵筛选。
          </li>
          <li>
            增加鱼饵查询小工具，点击右上角 <v-icon>mdi-hook</v-icon>按钮即可使用。
            <ul>
              <li>
                可以筛选，查找鱼饵，以查看鱼饵的使用情况。
              </li>
              <li>
                可以设置鱼饵使用完毕的提醒功能（默认开启），在鱼饵对应鱼全部标记已完成时将会跳出提示。
              </li>
            </ul>
          </li>
        </ul>
        <div class="subtitle-1 text-center">
          其他功能更新
        </div>
        <ul>
          <li>
            筛选功能更新，所有选项变为多选，可以支持更多的条件。
          </li>
          <li>
            去除了显示个数的配置，增加了加载更多的按钮。
          </li>
          <li>
            增加随系统主题（Windows 10: 设置 -> 颜色 -> 选择颜色）自动设置深浅模式的功能。
          </li>
          <li>
            增加链接跳转的设置功能，支持鱼和钓场的多网站跳转。
          </li>
          <li>
            增加跳转至顶的按钮。
          </li>

          <li>
            增加关于天钢之球的说明。
          </li>
          <li>
            增加5.x的鱼王心得，感谢
            <span class="font-weight-bold">颜君行@琥珀原</span> 和
            <span class="font-weight-bold">Aki秋山@摩杜纳</span> 的支持！
          </li>
          <li>
            增加空岛钓场的范围提示。
          </li>
        </ul>
        <div class="subtitle-1 text-center">
          错误修正
        </div>
        <ul>
          <li>
            修正多钓场鱼不能在笔记中正常标记的问题。
          </li>
          <li>
            计算逻辑更新，列表将更加流畅。
          </li>
          <li>
            海钓双提数据修正为国服数据：<br />
            <ul>
              <li>
                沉寂者 双提个数 4 -> 2
              </li>
              <li>
                剪碎手巴塞洛缪 双提个数 4 -> 2
              </li>
            </ul>
          </li>
          <li>
            鱼数据修正。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.5.2</div>
        <div class="text-h5 text-center">
          刺鱼笔记
        </div>
        <ul>
          <li>
            增加钓鱼笔记中刺鱼相关内容。
          </li>
          <li>
            增加默认列表中刺鱼内容的支持。
          </li>
          <li>
            增加搜索中刺鱼内容的支持。
          </li>
          <li>
            修正窗口期计算的问题。
          </li>
          <li>
            调整钓鱼笔记的顺序，与游戏中对应。
          </li>
          <li>
            调整出海垂钓钓鱼笔记的结构，与游戏中对应。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.5.1</div>
        <ul>
          <li>
            固定列表鱼默认列表合并，显示在同一页面中。
          </li>
          <li>
            列表中增加传承录，收藏品信息。
          </li>
          <li>
            修正多条鱼数据。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.5.0</div>
        <div>
          <div class="text-h5 text-center">
            新增出海垂钓攻略支持
          </div>
          <div class="text-h6 text-center">
            钓鱼图鉴也已同步更新
          </div>
          <div>
            页面中攻略与资料参考：
            <div class="d-flex align-center">
              <div class="text-subtitle-1">
                <a :href="oceanFishTipReference.link" target="_blank">
                  {{ oceanFishTipReference.title }}
                </a>
              </div>
              <v-spacer />
              <div>
                {{ oceanFishTipReference.author }}
              </div>
            </div>
            <p />
            <div></div>
          </div>
        </div>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.4.3</div>
        <div>
          <div class="text-h5 text-center">
            新增云冠群岛支持
          </div>
          <div class="text-h6 text-center">
            包括第二期以及即将更新的第三期重建
          </div>
          <div>
            页面中攻略与资料参考：
            <div class="text-subtitle-1">
              <a :href="diademTips[0].reference.link" target="_blank">
                {{ diademTips[0].reference.title }}
              </a>
            </div>
            <div class="text-subtitle-1">
              <a :href="diademTips[1].reference.link" target="_blank">
                {{ diademTips[1].reference.title }}
              </a>
            </div>
            <div>
              {{ diademTips[0].reference.author }}
            </div>
            <p />
            <div>
              感谢
              <span style="font-weight: bold">煋月丶幻神@琥珀原</span>
              友情绘制的云冠群岛图标！
            </div>
          </div>
        </div>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.4.2</div>
        <div>
          <div class="text-h5 text-center">
            星芒节快乐！
          </div>
          <div>
            在星芒节期间，三大主城以及四个住宅区的天气变为了
            <span style="font-weight: bold">小雪</span>。<br />
            根据饿猫的招雨王的小雪上钩记录，<br />
            以及游戏内天气预报员处天气也显示为小雪为前提，<br />
            有理由相信，实际游戏判断的天气为小雪。因此对相应天气鱼的时间进行了修正。<br />
            <em>*星芒节时段外的窗口期计算没有改变</em><br />
            当然，也可以通过右上角的红色切换按钮切换成普通模式。<br />
            <em>*此模式将依旧按照原先的天气算法计算窗口期</em><br />
            <p />
            受影响鱼：<br />
            星芒节期间全勤奖普通鱼：求雨鱼<br />
            星芒节期间窗口期变长：招雨王<br />
            星芒节期间无窗口期：倔强鲫鱼、抽须王、枪鼻头、芳香蝾螈 (<s>我们放寒假了~</s>）
          </div>
        </div>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.4.1</div>
        <ul>
          <li>
            更新列表中所有按钮的位置，增加操作栏，所有按钮移动至操作栏中。
          </li>
          <li>
            列表中增加版本号，未实装的鱼的版本底色为灰色。
          </li>
          <li>
            修正多条鱼数据。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.4.0</div>
        <ul>
          <li>
            增加海钓时间表。点击左侧图标
            <v-icon small>mdi-ferry</v-icon>
            即可查看。
            <div>之后会增加更多海钓相关功能，敬请期待~</div>
          </li>
          <li>
            修正多条鱼数据。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.3.2</div>
        <ul>
          <li>
            增加攻略支持：（感谢攻略作者的授权与支持！）
            <div>
              在详情界面或直接点击
              <v-icon small>mdi-book</v-icon>
              按钮即可查看。
            </div>
            <ul>
              <li>
                <a
                  class="text-subtitle-1"
                  href="https://ngabbs.com/read.php?tid=18484723"
                  target="_blank"
                >
                  [烟波钓徒]红莲之狂潮&苍穹之禁城 钓场之皇捕获指南
                </a>
                <div>月咏泠音@摩杜纳</div>
              </li>
              <li>
                <a
                  class="text-subtitle-1"
                  href="https://ngabbs.com/read.php?tid=23672580"
                  target="_blank"
                >
                  [烟波钓徒][我本烟波一钓徒][5.x]烟波204鱼王心得攻略
                </a>
                <div>谈清若风柔@神拳痕</div>
              </li>
            </ul>
          </li>
          <li>
            修正多条鱼数据。
          </li>
          <li>
            修正界面问题。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.3.1</div>
        <ul>
          <li>
            界面颜色调整：
            <ul>
              <li>
                窗口期中的颜色从
                <v-chip small color="#572746"></v-chip>
                调整为
                <v-chip small color="#183027"></v-chip>
              </li>
              <li>
                已完成的颜色从
                <v-chip small color="#214040"></v-chip>
                调整为
                <v-chip small color="#0c2242"></v-chip>
              </li>
            </ul>
          </li>
          <li>增加浅色模式，点击右上角开关切换。</li>
          <li>
            更新
            <v-chip x-small>5.3</v-chip>
            和
            <v-chip x-small>5.35</v-chip>
            数据。
            <div class="error--text text-h6">
              为了便于查看，5.3以及5.35的普通鱼仍会显示在默认列表中。
              之前版本没有任何时间天气限制的普通鱼请在图鉴中查找或直接搜索。
            </div>
          </li>
          <li>
            更新官方攻略本数据（涵盖4.2前数据）。
            <ul>
              <li>
                <a
                  href="https://store.jp.square-enix.com/item/9784757556898.html"
                  target="_blank"
                >
                  FINAL FANTASY XIV Crafter and Gatherer Official Guide
                </a>
              </li>
            </ul>
          </li>
          <li>
            界面各部分都有所调整。
          </li>
          <li>修复部分鱼的窗口期计算的错误。</li>
          <li>修复部分鱼倒计时没有及时更新的错误。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.3.0</div>
        <ul>
          <li>增加图鉴功能。</li>
          <li>
            增加系统提示支持。
            <ul>
              <li>需要在浏览器授权，地址栏弹框时选择“允许”。</li>
              <li>在Windows10系统中的“设置-通知和操作”中授权。</li>
              <li>系统管理员会有一系列问题，请使用普通用户。</li>
              <li>请关闭Windows的“专注助手”，以正常跳出通知。</li>
            </ul>
          </li>
          <li>增加窗口期列表的加载更多功能。</li>
          <li>增加按窗口期稀有度排序的功能。</li>
          <li>增加按键 ' / ' 可以直接搜索，以及打开搜索界面自动开始搜索输入的功能。</li>
          <li>增加部分钓鱼技能的悬浮提示。</li>
          <li>
            更新界面，由于增加了新的图鉴界面，所以原先右上角设置类的功能与新的页面切换一起整合至左侧侧边栏中。
          </li>
          <li>
            更新地图范围提示完成。感谢
            <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 的大力支持。
          </li>
          <li>
            更新地图控件，现在可以点击“锁”图标自由拖动放大地图，以及切换显示文本以及钓场提示。
          </li>
          <li>
            更新时间文本，增加“今天”，“明天”，“周一”等的文本。
          </li>
          <li>
            更新列表中的前置鱼，隐去了“固定”和“完成”的勾选按钮，详细界面中不变。
          </li>
          <li>
            更新详细界面的倒计时，现在会显示2个时间单位，如“10分09秒”。
          </li>
          <li>
            更新图标。
          </li>
          <li>
            修复“复制道具名”按钮。
          </li>
          <li>
            修复详细页面的前置鱼图标。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.2.3</div>
        <ul>
          <li>
            增加闹钟列表，点击列表中时间或详细列表中铃铛即可添加，详细设置在设置对话框中。
          </li>
          <li>更新列表：在CD中的鱼显示下一次窗口期时间。</li>
          <li>
            更新设置
            <ul>
              <li>现在点击“应用”按钮才会生效。</li>
              <li>添加闹钟相关选项。</li>
              <li>添加详情页面的自定义布局功能。</li>
            </ul>
          </li>
          <li>
            更新地图范围提示，增加地图：翻云雾海，龙堡内陆低地，基拉巴尼亚山区，安慕·艾兰，伊尔美格，黑风海。（持续更新中）
          </li>
          <li>修复详细列表中的前置鱼列表。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.2.2</div>
        <ul>
          <li>修复列表固定鱼完成按钮的问题。</li>
          <li>更新地图范围提示：延夏，高脚孤丘，魔大陆阿济兹拉。（持续更新中）</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.2.1</div>
        <ul>
          <li>提升页面流畅度。</li>
          <li>更新地图，增加水晶和部分地图的钓点范围提示，持续更新中。</li>
          <li>
            范围都是
            <span class="font-weight-bold">轩辕十四@沃仙曦染</span>
            大佬的标的，万分感谢！
          </li>
          <li>修复了一些复制的问题。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.2.0</div>
        <ul>
          <li>界面更新，原先扩展列表变为右侧详细界面。</li>
          <li>固定和默认列表变为选项卡的形式。</li>
          <li>ACT界面（即较小的界面下），详细列表将全屏显示。</li>
          <li>ACT缩小模式更新。</li>
          <li>增加常驻（即全天可以钓）鱼王的筛选项。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.1.6</div>
        <ul>
          <li>修复等待状态，倒计时与持续时长乱序的问题。</li>
          <li>修复ACT下按钮有时没有相应的问题。</li>
          <li>修复道具提示框错位，被对话框遮挡的问题</li>
          <li>增加 猎手鱼 信息，咬钩：中杆，提钩：强力提钩。</li>
          <li>更新缩小模式，现在只显示鱼图标。</li>
          <li>搜索选项增加了鱼的图标。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.1.5</div>
        <ul>
          <li>更新帮助文档，ACT相关。现在通过配置ACT可以正常输入了。</li>
          <li>更新所有对话框的滚动条，以及一些样式更新。</li>
          <li>更新透明度滚动条，调整粒度变为0.01，可直接输入。</li>
          <li>调整复制、链接按钮大小。</li>
          <li>更新页脚。</li>
          <li>
            更新窗口期计算逻辑，现在窗口期正确地计算最长可能的时长（原先部分鱼的第一个和最后一个窗口期少计算了一部分时间）。
          </li>
          <li>更新倒计时和时长的显示位置。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.1.4</div>
        <ul>
          <li>更新后台算法，解决长时间后，倒计时出错的问题。</li>
          <li>增加ACT下使用的缩小功能，点击左上角，钓鱼时钟旁的鱼图标切换。</li>
          <li>更新帮助文档（ACT相关）。</li>
          <li>固定列表也按时间排序（和默认列表相同）。</li>
          <li>
            当一条鱼的界面处于展开模式时，以任意的形式从当前列表移除后，下一条鱼不会继承打开的状态。
          </li>
          <li>
            更新了 不朽巨鱼 的天气和咬钩 天气：从 阴云 修正为 晴朗/碧空 转
            阴云/薄雾，补充了 咬钩 为 鱼王竿。
          </li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.1.3</div>
        <ul>
          <li>向关于页面增加了重置按钮。</li>
          <li>修复了对导入数据的检测。</li>
          <li>更新了 冥河灯 的ET时间：0-4 修正为 23-4。</li>
          <li>在默认列表中不再显示固定的鱼。</li>
        </ul>
        <p />
        <v-divider />

        <div class="text-h6">Version 0.1.2</div>
        <p>更新了 众神之爱 的ET时间：5-7 修正为 5:30-6:30。</p>
        <v-divider />

        <div class="text-h6">Version 0.1.1</div>
        <ul>
          <li>修正了FishTracker导入的问题。</li>
          <li>显示没有钓场的鱼。</li>
          <li>调整行间距更紧凑。</li>
          <li>调整整体配色更暗。</li>
          <li>将鱼的背景色也根据状态进行了调整</li>
          <li>将鱼饵，前置鱼，天气图标的大小调整的更小。</li>
          <li>更新了通知栏的文本。</li>
          <li>更新鱼，鱼饵，钓场的提示文本。</li>
          <li>
            增加“配置”功能，目前支持调整透明度。原先默认0.8，现在默认1.0（即不透明）。透明度功能主要为ACT悬浮窗提供支持。
          </li>
          <li>增加时间提示，当鼠标悬停在倒计时文字上时，显示具体的时刻。</li>
          <li>增加“更新笔记”功能，当版本更新时显示。</li>
          <li>
            给等待中的鱼加上下次窗口期的持续时间（简易显示一个时间单位，鼠标悬停显示全部）。
          </li>
        </ul>
        <p />
        <v-divider />
        <div class="text-h6">Version 0.1.0</div>
        <p>初始版本</p>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-column flex-fill">
          <click-helper @click="onConfirmPatchNote">
            <v-btn color="primary" block>
              {{ $t('general.dialog.confirm') }}
            </v-btn>
          </click-helper>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import FIX from 'Data/fix'
import DIADEM from 'Data/diadem'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'PatchNoteDialog',
  components: { ClickHelper },
  model: {
    prop: 'showPatchNoteDialog',
    event: 'input',
  },
  props: {
    showPatchNoteDialog: {
      type: Boolean,
      default: false,
    },
    inMigrationPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      oceanFishTipReference: FIX.OCEAN_FISHING_TIPS.tip1,
      diademTips: DIADEM.SIMPLE_TIPS,
    }
  },
  methods: {
    onConfirmPatchNote() {
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped></style>
