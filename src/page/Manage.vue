<!--主界面-->
<template>
    <div>
        <Layout>
            <Header :style="{ position:'fixed',width: '100%',zIndex:1000}">
                <Row style="height:60px;width: 240px;float: left;">
                    <i-col span="8"><Avatar shape="square" :src="logo"/></i-col>
                    <i-col span="16">
                        <p style="text-align: left;font-size: 18px;color: #fff;">
                        柑橘减施增效系统</p></i-col>
                </Row>
                <div class="layout-option-menu">
                    <Row :gutter="16" type="flex" justify="end" align="middle">
                        <i-col span="4">
                            <Avatar :src="currentUser===null?'':currentUser.avatar"/>
                        </i-col>
                        <i-col span="4">
                            <Button @click="showUserInfo" type="text" ghost>
                                {{currentUser===null?'':currentUser.name}}
                            </Button>
                        </i-col>
                        <i-col span="4" :offset="2">
                            <Button @click="logout" type="text" ghost icon="md-exit">退出</Button>
                        </i-col>
                    </Row>
                </div>
            </Header>

            <Layout>
                <Sider  hide-trigger :style="{background: '#fff',marginTop:'64px'}">
                    <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
                        <MenuItem name="1" to="/">
                            <Icon type="md-compass" />总览
                        </MenuItem>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="md-stats" />
                                统计分析
                            </template>
                            <MenuItem name="2-1" to="/FertAttrAnalysis">施肥属性分析</MenuItem>
                            <MenuItem name="2-2" to="/DiseasePestAttrAnalysis">病虫害属性分析</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="logo-buffer" />
                                空间分析
                            </template>
                            <MenuItem name="3-1" to="/FertSpatialAnalysis">施肥空间分析</MenuItem>
                            <MenuItem name="3-2" to="/DiseasePestSpatialAnalysis">病虫害空间分析</MenuItem>
                        </Submenu>
                        <Submenu name="4">
                            <template slot="title">
                                <Icon type="md-checkmark-circle-outline" />
                                专业推荐
                            </template>
                            <MenuItem name="4-1" to="/FertAdvice">施肥推荐</MenuItem>
                            <MenuItem name="4-2" to="/DiseasePestAdvice">病虫害防治</MenuItem>
                        </Submenu>
                        <Submenu name="5">
                            <template slot="title">
                                <Icon type="md-document" />
                                基础数据
                            </template>
                            <MenuItem name="5-1" to="/FertSampleData">施肥采样点</MenuItem>
                            <MenuItem name="5-2" to="/DiseasePestSampleData">病虫害采样点</MenuItem>
                            <MenuItem name="5-3" to="/CitrusData">柑橘种类</MenuItem>
                            <MenuItem name="5-4" to="/DiseaseData">柑橘病害</MenuItem>
                            <MenuItem name="5-5" to="/PestData">柑橘虫害</MenuItem>
                        </Submenu>
                        <Submenu name="6">
                            <template slot="title">
                                <Icon type="md-settings" />
                                系统管理
                            </template>
                            <MenuItem name="6-1" to="/UserAdmin">用户管理</MenuItem>
                            <MenuItem name="6-2" to="/UnitAdmin">组织管理</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{margin: '88px 20px 0', minHeight: '580px'}">
                    <Breadcrumb :style="{margin: '0px 0px 20px'}" separator=">">
                        <BreadcrumbItem>首页</BreadcrumbItem>
                        <BreadcrumbItem v-for="(item, index) in $route.meta" key="index">{{item}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{minHeight: '280px', background: '#fff',marginBottom:'24px'}">
                        <div style="width: 100%;height: 100%;min-height:600px;background-color: white">
                            <keep-alive>
                                <router-view/>
                            </keep-alive>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <Modal v-model="userInfoShow"
               title="用户信息"
               draggable>
            <UserInfo :user="currentUserToEdit" v-if="currentUserToEdit!==null"/>
            <p slot="footer"></p>
        </Modal>
    </div>
</template>

<script>
    import {getCookie,delCookie} from "../util/util";
    import {verify} from "../api/user";
    import UserInfo from "../components/UserInfo";

    export default {
        name: "Manage",
        components: {UserInfo},
        data(){
            return{
                logo:require('../assets/citrus_logo_small.png'),
                userInfoShow:false,
                currentUserToEdit:null,
            }
        },
        beforeMount(){
            this.verifyUser()
        },
        mounted(){

        },
        methods:{
            verifyUser(){
                let token=getCookie('Authorization');
                if (token!=null){
                    verify(token).then(user=>{
                        console.log('verifyUser：success');
                        //在vuex中保存全局可获取的currentUser
                        this.$store.commit('setCurrentUser',user);
                    }).catch(err=>{
                        console.error('verifyUser:',err)
                        this.$router.replace('/login')
                    })
                } else {
                    console.log('Token is null,route to login page.');
                    this.$router.replace('/login');
                }
            },
            logout(){
                delCookie('Authorization');
                this.$router.replace('/login');
            },
            showUserInfo(){
                this.currentUserToEdit=JSON.parse(JSON.stringify(this.$store.state.currentUser));
                this.userInfoShow=true;
            }
        },
        computed:{
            currentUser(){
                return this.$store.state.currentUser;
            }
        }
    }
</script>

<style scoped>
    .layout-option-menu{
        float: right;
        width: auto;
        margin: 0 auto;
    }
</style>