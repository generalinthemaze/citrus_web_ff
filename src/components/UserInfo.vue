<!--用户个人信息-->
<template>
    <div>
        <div style="text-align: center">
            <Avatar style="width: 64px;height: 64px" :src="user.avatar"></Avatar>
            <Upload :before-upload="handleUpload" action="//">
                <Button icon="ios-cloud-upload-outline" size="small" style="margin-top: 8px">
                    选择头像
                </Button>
            </Upload>
        </div>
        <Form :model="user" :label-width="80">
            <FormItem label="用户编号">
                <Input v-model="user.code" disabled/>
            </FormItem>
            <FormItem label="用户名">
                <Input v-model="user.username" disabled/>
            </FormItem>
            <FormItem label="角色">
                <Input v-model="user.role.desc" disabled/>
            </FormItem>
            <FormItem label="姓名">
                <Input v-model="user.name"/>
            </FormItem>
            <FormItem label="性别">
                <RadioGroup v-model="user.gender">
                    <Radio :label=1>男</Radio>
                    <Radio :label=0>女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="电话">
                <Input v-model="user.telephone"/>
            </FormItem>
            <FormItem label="手机">
                <Input v-model="user.mobilephone"/>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="user.email"/>
            </FormItem>
            <FormItem label="单位">
                <Select v-model="unitId" filterable clearable>
                    <Option v-for="item in unitList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
        <div style="text-align:center">
            <Button type="primary" @click="save" style="margin: 0 auto;">保存</Button>
        </div>
    </div>
</template>

<script>
    import {updateSelf} from '../api/user';
    import {uploadFile} from "../api/file";
    import {getList as getUnitList,count as countUnit} from "../api/unit";

    export default {
        name: "UserInfo",
        props:{
            /**
             * @description 用户
             */
            user:{
                type:Object,
                default:null
            }
        },
        data(){
            return{
                unitList:[],
            }
        },
        methods:{
            handleUpload(file){
                this.$Loading.start();
                uploadFile('user_avatar/'+this.user.code+'/'+file.name,file).then(result=>{
                    if (result.res.status===200) {
                        this.user.avatar=result.url;
                        return updateSelf(this.user);
                    }else {
                        return Promise.reject('avatar upload err:'+result);
                    }
                }).then(response=>{
                    if (response.code===0){
                        this.$Loading.finish();
                    }else{
                        return Promise.reject(response.msg);
                    }
                }).catch(err=>{
                    this.$Loading.error();
                    console.log(err);
                });
                return false;
            },
            getUnitData(){
                countUnit().then(resp=>{
                    if (resp.code===0){
                        return getUnitList(0,resp.data,null);
                    } else{
                        return Promise.reject(resp.msg);
                    }
                }).then(resp=>{
                    if (resp.code===0){
                        this.unitList.push(...resp.data);
                    } else{
                        return Promise.reject(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err.toString());
                })
            },
            save(){
                this.user.unit=this.idToUnit(this.unitId);
                updateSelf(this.user).then(resp=>{
                    if (resp.code===0){
                        this.$Message.success("保存成功");
                        this.$store.commit('setCurrentUser',this.user);
                    } else {
                        this.$Message.error("保存失败");
                    }
                }).catch(err=>{
                    console.error(err);
                    this.$Message.error("保存失败");
                })
            },
            idToUnit(unitId){
                let unit=null;
                this.unitList.forEach(u=>{
                    if (u.id===unitId){
                        unit=u;
                    }
                })
                return unit;
            }
        },
        mounted(){
            this.getUnitData();
        },
        computed:{
            /**
             * 选中unit的id
             */
            unitId:{
                get:function () {
                    if (this.user===null||this.user.unit===null){
                        return null
                    } else {
                        return this.user.unit.id;
                    }
                },
                set:function (newVal) {
                    this.unitList.forEach(u=>{
                        if (u.id===newVal){
                            this.user.unit=u;
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>