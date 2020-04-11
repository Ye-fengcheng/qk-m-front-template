<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" style="overflow: auto !important;" :class="{'content-collapse':collapse}">
            <div v-if="loading">loading</div>
            <div class="app-view-box" v-html="content" />
            <!-- <div class="content">
                
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div> -->
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import bus from './bus';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun'
import pager from "./pager"
/**
* 路由监听
* @param {*} routerPrefix 前缀
*/
const genActiveRule = routerPrefix => {
	return location => location.pathname.startsWith(routerPrefix)
}
export default {
    data() {
        return {
            loading: false,
			content: null,
            tagsList: [],
            collapse: false,
            apps: [
				{ name: 'other-app', entry: '//localhost:8081', render: this.render, activeRule: genActiveRule('/other-app'),props:{pager:pager} },
				{ name: 'userctr', entry: '//userorgctr-local.gtland.cn:8000/', render: this.render, activeRule: genActiveRule('/userctr'),props:{pager:pager} }
			]
        };
    },
    components: {
        vHead,
        vSidebar
    },
    methods: {
        render ({ appContent, loading }) {
			this.content = appContent
			this.loading = loading
		},
		initQiankun () {
            // 注册子应用
			registerMicroApps(
				this.apps,
				{
					beforeLoad: [
						app => {
                            debugger
							// eslint-disable-next-line no-console
							console.log('before load', app)
						}
					],
					beforeMount: [
						app => {
                            debugger
							// eslint-disable-next-line no-console
							console.log('before mount', app)
						}
					],
					afterUnmount: [
						app => {
                            debugger
							// eslint-disable-next-line no-console
							console.log('after unload', app)
						}
					]
				}
			)
            //设置默认子应用,参数与注册子应用时genActiveRule("/other-app")函数内的参数一致
            //setDefaultMountApp('/other-app')
            
            // 第一个子应用加载完毕回调
			runAfterFirstMounted(() => {
				// eslint-disable-next-line no-console
				console.info('first app mounted')
			})
            // 启动微服务
			start()
		}
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
        if (!window.__POWERED_BY_QIANKUN__) {
            debugger
			this.initQiankun()
		} else {
			location.reload()
		}
		// 在主应用注册呼机
		pager.subscribe(v => {
			console.log(`监听到子应用${v.from}发来消息：`, v)
		})
    }
};
</script>
