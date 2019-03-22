<!--总览-->
<template>
    <div style="background-color: #f5f7f9;min-height: 600px">
        <Row :gutter=16>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#ff9900" icon="ios-leaf" :icon-size="36">
                    <CountTo :end="citrusCount" class="count-to"/>
                    <p>柑橘品种</p>
                </InfoCard>
            </i-col>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#ed3f14" icon="ios-medkit" :icon-size="36">
                    <CountTo :end="diseaseCount" class="count-to"/>
                    <p>柑橘病害</p>
                </InfoCard>
            </i-col>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#E46CBB" icon="ios-bug" :icon-size="36">
                    <CountTo :end="pestCount" class="count-to"/>
                    <p>柑橘虫害</p>
                </InfoCard>
            </i-col>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#2d8cf0" icon="ios-color-fill" :icon-size="36">
                    <CountTo :end="fertilizerSampleCount" class="count-to"/>
                    <p>施肥采样点</p>
                </InfoCard>
            </i-col>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#9A66E4" icon="md-leaf" :icon-size="36">
                    <CountTo :end="diseasePestSampleCount" class="count-to"/>
                    <p>病虫害采样点</p>
                </InfoCard>
            </i-col>
            <i-col :lg="4" :sm="8" span="4" style="height: 120px;padding-bottom: 10px;">
                <InfoCard shadow color="#19be6b" icon="ios-people" :icon-size="36">
                    <CountTo :end="userCount" class="count-to"/>
                    <p>用户</p>
                </InfoCard>
            </i-col>
        </Row>
        <Card shadow>
            <Divider>欢迎使用</Divider>
            <Row :gutter="16">
                <i-col :sm="24" :lg="8">
                    <Carousel autoplay loop dots="none" height="auto">
                        <CarouselItem v-for="image in carouselImages" :key="image.url">
                            <img :src="image.url+'?x-oss-process=image/resize,w_360,h_320,limit_0,m_fill'"/>
                            <Row type="flex" justify="center">
                                <i-col span="18">
                                    <p class="image-desc">{{image.desc}}</p>
                                </i-col>
                            </Row>
                        </CarouselItem>
                    </Carousel>
                </i-col>
                <i-col :sm="24" :lg="16">
                    <p class="intro-text">柑橘化肥农药减施增效信息系统应用GIS和数据库等技术，结合实际需要，实现对柑橘施肥和病虫害空间信息的科学组织和有效管理，使柑橘种植区管理人员能够方便的对柑橘施肥和病虫害信息进行可视化管理。</p>
                    <p class="intro-text">华中农业大学是教育部直属、国家“211工程”重点建设的大学。资源与环境学院的前身是建于1948年的武汉大学农业化学系。1952年，武汉大学农学院、湖北农学院和湖南农学院有关系科合并组建华中农学院土壤农化系。1994年，土壤农化系微生物学科专业整体划入新成立的生命科学技术学院。1997年，土壤农化系更名为资源环境与农业化学系。2002年，以资源环境与农业化学系为基础组建资源与环境学院。</p>
                    <p class="intro-text">学院现设有土壤与植物营养、生态环境、资源环境信息等3个系，3个实验教学中心，5个教学科研实践基地，1个农业部重点实验室、2个湖北省重点实验室、1个湖北工程技术研究中心、4个校级研究中心、1个农业信息网站，湖北省土壤肥料学会挂靠本院；拥有2个博士后科研流动站、2个一级学科博士点，7个二级学科博士点，10个二级学科硕士点， 5个普通本科专业；拥有2个湖北省一级重点学科。</p>
                    <p class="intro-text">华中农业大学1956年开始柑橘研究，1980年成立柑橘研究室，著名柑橘专家章文才教授任柑橘研究室主任；1992年由农业部批准成立华中农业大学柑橘研究所。</p>

                </i-col>
            </Row>
        </Card>
        <Row type="flex" justify="center" style="margin-top: 32px">
            <i-col span="18">
                <p>Copyright © {{new Date().getFullYear()}} 华中农业大学 版权所有 鄂ICP备18016816号</p>
                <p>地址：中国湖北省武汉市南湖狮子山街一号</p>
            </i-col>
        </Row>
    </div>
</template>

<script>

    import {count as countCitrus,getList as getCitrusList} from "../api/citrus";
    import {count as countDisease,getList as getDiseaseList} from "../api/disease";
    import {count as countPest,getList as getPestList} from "../api/pest";
    import {count as countFertSample} from "../api/fertilizer_sample";
    import {count as countDiseasePestSample} from "../api/disease_pest_sample";
    import {count as countUser} from "../api/user";
    import InfoCard from "../components/InfoCard";
    import CountTo from "../components/CountTo";

    export default {
        name: "Explore",
        components: {CountTo, InfoCard},
        data(){
            return{
                citrusCount:0,
                diseaseCount:0,
                pestCount:0,
                fertilizerSampleCount:0,
                diseasePestSampleCount:0,
                userCount:0,
                carouselImages:[],
                carouselWidth:0,
            }
        },
        mounted(){
            this.getStats();
            this.getImages();
        },
        methods:{
            getStats(){
                countCitrus().then(resp=>{
                    if (resp.code===0){
                        this.citrusCount=resp.data;
                    }else {
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                });
                countDisease().then(resp=>{
                    if (resp.code===0){
                        this.diseaseCount=resp.data;
                    } else {
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                }).catch(err=>{
                    console.error(err);
                });
                countPest().then(resp=>{
                    if (resp.code===0){
                        this.pestCount=resp.data;
                    } else{
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                });
                countFertSample().then(resp=>{
                    if (resp.code===0){
                        this.fertilizerSampleCount=resp.data;
                    } else{
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                });
                countDiseasePestSample().then(resp=>{
                    if (resp.code===0){
                        this.diseasePestSampleCount=resp.data;
                    } else {
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                });
                countUser().then(resp=>{
                    if (resp.code===0){
                        this.userCount=resp.data;
                    } else {
                        console.log(resp.msg);
                    }
                }).catch(err=>{
                    console.error(err);
                });
            },
            getImages(){
                countCitrus().then(resp=>{
                    return resp.data;
                }).then(count=>{
                    return getCitrusList(Math.floor(count*Math.random()),1,null);
                }).then(resp=>{
                    resp.data.forEach(citrus=>{
                        this.carouselImages.push(...citrus.images);
                    })
                }).catch(err=>{
                    log.error(err);
                })
                countDisease().then(resp=>{
                    return resp.data;
                }).then(count=>{
                    return getDiseaseList(Math.floor(count*Math.random()),1,null);
                }).then(resp=>{
                    resp.data.forEach(disease=>{
                        this.carouselImages.push(...disease.images);
                    })
                }).catch(err=>{
                    log.error(err);
                })
                countPest().then(resp=>{
                    return resp.data;
                }).then(count=>{
                    return getPestList(Math.floor(count*Math.random()),1,null);
                }).then(resp=>{
                    resp.data.forEach(pest=>{
                        this.carouselImages.push(...pest.images);
                    })
                }).catch(err=>{
                    log.error(err);
                })
            }
        }
    }
</script>

<style scoped>
    .count-to{
        font-size: 50px;
    }
    .image-desc{
        text-align: center;
        width: auto;
    }
    .intro-text{
        text-align: start;
        text-indent:2em
    }
</style>