<!--虫害百科-->
<template>
    <div>
        <Row>
            <i-col :sm="{span:12}" :lg="{span:18}">
                <h1 class="header">{{pest.chsName}}</h1>
                <h2 class="header"><i>{{pest.scientificName}}</i></h2>
                <h3 class="header" :hidden="pest.alias===null||pest.alias==='无'">
                    （{{pest.alias}}）
                </h3>
                <h3 class="header">{{pest.order}} {{pest.family}}</h3>
            </i-col>
            <i-col :sm="{span:12}" :lg="{span:6}">
                <Tooltip :content="pest.images[0].desc">
                    <img :src="thumbnail" style="max-width: 160px;max-height: 160px"/>
                </Tooltip>
            </i-col>
        </Row>
        <h2 class="header">形态</h2>
        <p class="intro-text">
            <b>卵的形态：</b>{{pest.egg}}
        </p>
        <p class="intro-text">
            <b>幼虫形态：</b>{{pest.larva}}
        </p>
        <p class="intro-text">
            <b>成虫形态：</b>{{pest.imago}}
        </p>
        <h2 class="header">发生规律</h2>
        <p class="intro-text">{{pest.occurrence}}</p>
        <h2 class="header">分布</h2>
        <p class="intro-text">{{pest.distribution}}</p>
        <h2 class="header">症状</h2>
        <p class="intro-text">{{pest.damageSymptom}}</p>
        <h2 class="header">防治方法</h2>
        <p class="intro-text" v-for="method in pest.controllingMethods">
            <b>{{controllingMethodTypes[method.type]}}：</b>{{method.desc}}
        </p>
        <h2 class="header">图示</h2>
        <div class="images" v-for="img in pest.images">
            <template>
                <img :src="img.url" style="width: 100%;height: 100%" @click="showImg(img)">
            </template>
        </div>
        <Modal v-model="imgShow"
               title="查看图片"
               draggable>
            <div v-if="imgToShow!==null">
                <img :src="imgToShow.url" style="width: 100%;height: 100%;max-height: 320px"/>
                <Alert show-icon>
                    <Icon type="ios-information-circle-outline" slot="icon"></Icon>
                    {{imgToShow.desc}}
                </Alert>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {resize_wh} from "../api/image";

    export default {
        name: "PestWiki",
        data(){
            return{
                controllingMethodTypes:{
                    1:'化学防治',
                    2:'农业防治',
                    3:'生物防治',
                    4:'物理防治',
                    5:'其他防治',
                },
                imgShow:false,
                imgToShow:null,
            }
        },
        props: {
            /**
             * @description 需要展示的虫害数据
             */
            pest: {
                type: Object,
                default: null
            }
        },
        computed:{
            thumbnail(){
                return resize_wh(this.pest.images[0].url,320,240);
            }
        },
        methods:{
            showImg(img){
                this.imgShow=true;
                this.imgToShow=img;
            }
        }
    }
</script>

<style scoped>
    .header{
        text-align: start;
        margin-top: 8px;
    }
    .intro-text{
        text-align: start;
        text-indent:2em
    }
    .images{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
</style>