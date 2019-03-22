<!--病虫害采样点数据-->
<template>
    <div>
        <Card :bordered="false" style="min-height: 650px">
            <Row slot="title" type="flex" justify="end" :gutter=16>
                <i-col span="12">
                    <Row type="flex" justify="end" align="middle" :gutter="8">
                        <i-col span="4">
                            <Input v-model="et_sampleId" clearable placeholder="样本编号"/>
                        </i-col>
                        <i-col span="4">
                            <Input v-model="et_province" clearable placeholder="省份"/>
                        </i-col>
                        <i-col span="4">
                            <Input v-model="et_location" clearable placeholder="地址"/>
                        </i-col>
                        <i-col span="3">
                            <Button type="info" size="large" @click="search">
                                <Icon type="md-search"></Icon>搜索
                            </Button>
                        </i-col>
                    </Row>
                </i-col>
                <i-col>
                    <Button type="success" size="large" @click="addItem">
                        <Icon type="md-add"></Icon> 添加数据
                    </Button>
                </i-col>
                <i-col >
                    <Button type="primary" size="large" @click="exportData">
                        <Icon type="md-download"></Icon> 导出数据
                    </Button>
                </i-col>
            </Row>
            <Table border :loading="tableLoading" :columns="columns"
                   :data="data" ref="diseasePestSampleTable"></Table>
            <Page :total="dataCount" :page-size="size" show-elevator
                  @on-change="handlePageChange" style="margin-top: 16px" />
        </Card>
        <Modal v-model="editModalShow"
               :title="isEdit?'编辑':'添加'"
               draggable
               @on-ok="saveEdit"
               @on-cancel="cancelEdit"
               width="75">
            <Form :model="editItemData" :label-width="80">
                <Row type="flex" justify="start">
                    <i-col span="12">
                        <FormItem label="样本编号">
                            <Input v-model="editItemData.sampleId"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="6">
                        <FormItem label="省">
                            <Input v-model="editItemData.province"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="地址">
                            <Input v-model="editItemData.location"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="经度">
                            <InputNumber v-model="editItemData.lng"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="纬度">
                            <InputNumber v-model="editItemData.lat"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="6">
                        <FormItem label="采样时间">
                            <DatePicker type="date" v-model="editItemDate"
                                        placeholder="选择时间" style="min-width: 80px"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="调查人">
                            <Input v-model="editItemData.surveyInquirer"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="随同调查人">
                            <Input v-model="editItemData.surveySuite"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="调查单位">
                            <Input v-model="editItemData.surveyUnit"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="6">
                        <FormItem label="品种">
                            <Select v-model="editItemData.speciesId" style="min-width:120px">
                                <Option v-for="item in citrus_data" :value="item.speciesId"
                                        :key="item.speciesId">{{ item.species }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="病害">
                            <Select v-model="editItemData.diseaseId" clearable style="min-width:120px">
                                <Option v-for="item in disease_data" :value="item.diseaseId"
                                        :key="item.diseaseId">{{ item.chsName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="虫害">
                            <Select v-model="editItemData.pestId" clearable style="min-width:120px">
                                <Option v-for="item in pest_data" :value="item.pestId"
                                        :key="item.pestId">{{ item.chsName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="灾情等级">
                            <Select v-model="editItemData.level" style="min-width:120px">
                                <Option v-for="item in levels" :value="item.value"
                                        :key="item.key">{{item.key}}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {update,del,add,search} from "../api/disease_pest_sample";

    import {getList as getCitrusList,count as countCitrus} from "../api/citrus";
    import {getList as getDiseaseList,count as countDisease} from "../api/disease";
    import {getList as getPestList,count as countPest} from "../api/pest";

    export default {
        name: "DiseasePestSampleData",
        data(){
            return{
                tableLoading:false,
                columns:[
                    {
                        title:"样本编号",
                        key:"sampleId",
                        maxWidth:100
                    },
                    {
                        title:"省份",
                        key:"province",
                        maxWidth:125
                    },
                    {
                        title:"地址",
                        key:"location",
                        tooltip:true,
                    },
                    {
                        title:"采样时间",
                        render:(h,params)=>{
                            return h('p',{},params.row.time.toLocaleDateString());
                        },
                        maxWidth:100
                    },
                    {
                        title:"病害/虫害",
                        maxWidth:180,
                        render:(h,params)=>{
                            let name=params.row.diseaseName!==null?params.row.diseaseName:params.row.pestName;
                            return h('p',{},name);
                        }
                    },
                    {
                        title:"灾情等级",
                        key:"level",
                        maxWidth:100,
                        align:'center',
                    },
                    {
                        title:"调查人",
                        key:"surveyInquirer",
                        maxWidth:100
                    },
                    {
                        title:"调查单位",
                        key:"surveyUnit"
                    },
                    {
                        title:"操作",
                        align:"center",
                        maxWidth:150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        ghost:true,
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editItem(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        ghost:true,
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteItem(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                dataCount:0,
                data:[],
                citrus_data:[],//全部品种数据
                disease_data:[],//全部病害数据
                pest_data:[],//全部虫害数据
                levels:[
                    {
                        value:1,
                        key:1,
                    },
                    {
                        value:2,
                        key:2,
                    },
                    {
                        value:3,
                        key:3,
                    },
                    {
                        value:4,
                        key:4,
                    },
                    {
                        value:5,
                        key:5,
                    },
                ],//灾情等级
                et_sampleId:'',//搜索关键词输入框中的内容
                et_province:'',
                et_location:'',
                key_sampleId:'',//当前搜索的关键字
                key_province:'',
                key_location:'',
                page:1,
                size:10,
                sort:"",
                isEdit:false,//true:编辑模式 false:添加模式
                editModalShow:false,
                editItemData:{},
                editItemIndex:-1,
                editItemDate:new Date(),//采样时间
            }
        },
        mounted(){
            this.getCitrusData();
            this.getDiseaseData();
            this.getPestData();
            this.search();
        },
        methods: {
            getCitrusData(){
                countCitrus().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getCitrusList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.citrus_data=resp.data;
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getCitrusData',err);
                })
            },
            getDiseaseData(){
                countDisease().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getDiseaseList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.disease_data=resp.data;
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
                            this.pest_data=resp.data;
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getPestData',err);
                })
            },
            search(){
                if(this.et_sampleId!==this.key_sampleId){
                    this.key_sampleId=this.et_sampleId;
                    this.page=1;
                }
                if(this.et_province!==this.key_province){
                    this.key_province=this.et_province;
                    this.page=1;
                }
                if (this.et_location!==this.key_location){
                    this.key_location=this.et_location;
                    this.page=1;
                }
                this.tableLoading=true;
                search(this.key_sampleId,this.key_province,this.key_location,
                    this.page-1,this.size,"id")
                    .then(response=>{
                        if (response.code===0){
                            this.dataCount=response.data.totalElements;
                            this.data=response.data.content;
                            this.data.forEach(d=>{
                                d.time=new Date(d.time);
                            });
                        }else {
                            this.$Message.error("获取数据失败");
                        }
                    }).catch(err=>{
                    this.$Message.error("获取数据失败");
                }).finally(()=>{
                    this.tableLoading=false;
                });
            },
            addItem(){
                this.isEdit=false;
                this.editItemData={
                    sampleId: null,
                    province: null,
                    location: null,
                    time: null,
                    speciesId:null,
                    diseaseId: null,
                    pestId:null,
                    diseaseName:null,
                    pestName:null,
                    lng: null,
                    lat: null,
                    level:null,
                    surveyInquirer: null,
                    surveyUnit: null,
                    surveySuite: null,
                    geoLocation:{
                        type:'Point',
                        coordinates:[0.0,0.0]
                    }
                }
                this.editModalShow=true;
            },
            exportData(){
                this.$refs.diseasePestSampleTable.exportCsv({
                    filename: '病虫害采样点_'+new Date().toLocaleString()
                })
            },
            handlePageChange(page){
                this.page=page;
                this.search(this.key);
            },
            editItem(index){
                this.isEdit=true;
                this.editItemIndex=index;
                //创建一个选中项数据的临时深拷贝用于编辑
                this.editItemData=JSON.parse(JSON.stringify(this.data[index]));
                //单独处理采样日期
                this.editItemDate=new Date(this.data[index].time);//new Date()使用的是本地时区
                this.editModalShow=true;
            },
            deleteItem(index){
                this.$Modal.confirm({
                    title: '删除',
                    content: '<p>确认删除该条数据吗？</p>',
                    onOk: () => {
                        del(this.data[index]).then(response=>{
                            this.data.splice(index,1);
                            this.$Message.success("删除成功");
                        }).catch(err=>{
                            console.log(err);
                            this.$Message.error("删除失败");
                        })
                    },
                });
            },
            saveEdit(){
                this.editItemData.time=this.editItemDate;
                this.editItemData.geoLocation.coordinates=[this.editItemData.lng,
                    this.editItemData.lat];//更新GeoLocation对象中的经纬度
                if (this.isEdit){//编辑
                    update(this.editItemData)
                        .then(response=>{
                            if (response.code===0){
                                this.$Message.success("保存成功");
                                this.$set(this.data,this.editItemIndex,this.editItemData);
                            } else {
                                this.$Message.error("保存失败");
                            }
                        })
                        .catch(err=>{
                            this.$Message.error("保存失败");
                            console.log(err);
                        })
                } else {//添加
                    add(this.editItemData)
                        .then(response=>{
                            if (response.code===0){
                                this.$Message.success("保存成功");
                                response.data.time=new Date(response.data.time);//转换time为时间对象
                                this.data.unshift(response.data);//新数据插入列表最前
                            } else{
                                this.$Message.error("添加失败,"+response.message);
                            }
                        })
                        .catch(err=>{
                            this.$Message.error("添加失败");
                            console.log(err);
                        })
                }
            },
            cancelEdit(){
                this.editModalShow=false;
            },
        }
    }
</script>

<style scoped>
</style>
