<template>
    <div>
        <div class="container">
            <div class="login-form">
                <Card>
                    <div style="text-align:center">
                        <img src="../assets/citrus_logo_small.png" style="height: 64px;width: 64px"/>
                        <h3>欢迎登录</h3>
                        <Divider/>
                        <Form ref="loginForm" :model="loginForm" :rules="ruleInline">
                            <FormItem prop="user">
                                <Input type="text" v-model="loginForm.user" placeholder="用户名">
                                    <Icon type="ios-person-outline" slot="prepend"/>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="loginForm.password" placeholder="密码">
                                    <Icon type="ios-lock-outline" slot="prepend"/>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit(loginForm)" style="width: 100%">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                        <p class="secondaryText">柑橘化肥农药减施增效信息系统</p>
                    </div>
                </Card>
            </div>
        </div>
        <canvas id="bgCanvas"></canvas>
    </div>
</template>

<script>
    const Trianglify=require('trianglify');
    import {setCookie} from '../util/util'
    import {login} from "../api/user";

    export default {
        name: "Login",
        data () {
            return {
                loginForm: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不符合要求', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(form) {
                this.$refs.loginForm.validate((valid) => {
                    if (valid){
                        login(form.user,form.password)
                            .then(res=>{
                                let auth=res.data;
                                if (auth){
                                    setCookie("Authorization",auth);
                                    this.$Message.success("登录成功");
                                    this.$router.replace('/');
                                }else {
                                    this.$Message.error("登录失败");
                                }
                            },err=>{
                                console.log(err);
                                this.$Message.error("登录失败");
                            })
                    } else {
                        this.$Message.error("填写信息有误");
                    }
                })
            }
        },
        mounted(){
            let canvas=document.getElementById('bgCanvas');
            let pattern = Trianglify({cell_size: 75, x_colors: 'Spectral',width: document.body.clientWidth,
                height: document.body.clientHeight,});
            pattern.canvas(canvas);
        }
    }
</script>

<style scoped>
    #bgCanvas{
        min-height:100vh;
        display:flex
    }
    .container{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        height: 100%;
        width: 100%;
    }
    .login-form{
        width: 375px;
        height: 400px;
        background-color:rgba(0,0,0,0);
        text-align: left;
        border-radius: 4px;
        position: relative;
        margin-left: 0;
        margin-right: 0;
        zoom: 1;
        display: block;
    }
</style>