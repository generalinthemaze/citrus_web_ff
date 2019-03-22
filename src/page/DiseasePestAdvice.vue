<!--病虫害防治推荐-->
<template>
    <div>
        <Row type="flex" justify="center" style="margin-top: 8px">
            <i-col span="8">
                <Select v-model="disease_pest" filterable clearable placeholder="搜索病害、虫害"
                        @on-change="handleSelectItem">
                    <Option v-for ="item in disease_pest_data" :value="item.id" :key="item.id">
                        <Row type="flex" justify="center" :gutter="16" align="middle">
                                <i-col span="2">
                                    <Avatar :src="item.thumbnail"/>
                                </i-col>
                                <i-col span="16">
                                    {{item.chsName}}({{item.scientificName}})
                                </i-col>
                            </Row>
                    </Option>
                </Select>
            </i-col>
        </Row>
        <Divider></Divider>
        <DiseaseWiki :disease="disease" style="margin: 16px" v-if="disease!==null"/>
        <PestWiki :pest="pest" style="margin: 16px" v-if="pest!==null"/>
    </div>
</template>

<script>
    import {getList as getDiseaseList,count as countDisease} from "../api/disease";
    import {getList as getPestList,count as countPest} from "../api/pest";
    import {resize} from "../api/image";
    import DiseaseWiki from "../components/DiseaseWiki";
    import PestWiki from "../components/PestWiki";

    export default {
        name: "DiseasePestAdvice",
        components: {PestWiki, DiseaseWiki},
        data(){
            return{
                disease_pest_data:[],//全部病害、虫害数据
                disease_pest:null,//保存选中病害/虫害的对象id
                disease:null,//选中展示的病害
                pest:null,//选中展示的虫害
            }
        },
        mounted(){
          this.getDiseaseData();
          this.getPestData();
        },
        methods:{
            getDiseaseData(){
                countDisease().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getDiseaseList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.disease_pest_data.push(...resp.data);
                            this.disease_pest_data.forEach(d=>d.thumbnail=resize(d.images[0].url,80));
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getDiseaseData',err);
                })
            },
            getPestData(){
                countPest().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getPestList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.disease_pest_data.push(...resp.data);
                            this.disease_pest_data.forEach(d=>d.thumbnail=resize(d.images[0].url,80));
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getPestData',err);
                })
            },
            handleSelectItem(value){
                let item=null;
                this.disease_pest_data.forEach(d=>{
                    if (d.id===value){
                        item=d;
                    }
                });
                if (item.diseaseId!==undefined){
                    //item为病害
                    console.log('item为病害',item);
                    this.disease=item;
                    this.pest=null;
                }else if (item.pestId!==undefined){
                    //item为虫害
                    console.log('item为虫害',item);
                    this.pest=item;
                    this.disease=null;
                }
            }
        }
    }
</script>

<style scoped>

</style>