<!--施肥采样点数据-->
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
            <Table border :loading="tableLoading" :columns="columns" :data="data" ref="fertSampleTable"></Table>
            <Page :total="dataCount" :page-size="size" show-elevator  @on-change="handlePageChange" style="margin-top: 16px" />
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
                            <DatePicker type="date" v-model="editItemDate" placeholder="选择时间" style="min-width: 80px"/>
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
                                <Option v-for="item in citrus_data" :value="item.speciesId" :key="item.speciesId">{{ item.species }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="单果重(Kg)">
                            <InputNumber v-model="editItemData.weightSingle"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="果形指数">
                            <InputNumber v-model="editItemData.shapeIndex"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="可食率">
                            <InputNumber v-model="editItemData.edibleRate"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="6">
                        <FormItem label="可滴定酸(g/L)">
                            <InputNumber v-model="editItemData.ta"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="可溶性固形物(%)">
                            <InputNumber v-model="editItemData.ssc"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="固酸比">
                            <InputNumber v-model="editItemData.sar"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="VC含量(mg/100g)">
                            <InputNumber v-model="editItemData.vc"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Tabs type="card">
                    <TabPane label="土壤元素含量">
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="N">
                                    <InputNumber v-model="editItemData.solidN"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="P">
                                    <InputNumber v-model="editItemData.solidP"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="K">
                                    <InputNumber v-model="editItemData.solidK"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mg">
                                    <InputNumber v-model="editItemData.solidMg"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Ca">
                                    <InputNumber v-model="editItemData.solidCa"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Fe">
                                    <InputNumber v-model="editItemData.solidFe"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mn">
                                    <InputNumber v-model="editItemData.solidMn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Cu">
                                    <InputNumber v-model="editItemData.solidCu"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Zn">
                                    <InputNumber v-model="editItemData.solidZn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="B">
                                    <InputNumber v-model="editItemData.solidB"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mo">
                                    <InputNumber v-model="editItemData.solidMo"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="pH">
                                    <InputNumber v-model="editItemData.solidPh"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="有机质">
                                    <InputNumber v-model="editItemData.solidOrganic"/>
                                </FormItem>
                            </i-col>
                        </Row>
                    </TabPane>
                    <TabPane label="叶片元素含量">
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="N">
                                    <InputNumber v-model="editItemData.leafN"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="P">
                                    <InputNumber v-model="editItemData.leafP"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="K">
                                    <InputNumber v-model="editItemData.leafK"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mg">
                                    <InputNumber v-model="editItemData.leafMg"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Ca">
                                    <InputNumber v-model="editItemData.leafCa"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Fe">
                                    <InputNumber v-model="editItemData.leafFe"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mn">
                                    <InputNumber v-model="editItemData.leafMn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Cu">
                                    <InputNumber v-model="editItemData.leafCu"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Zn">
                                    <InputNumber v-model="editItemData.leafZn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="B">
                                    <InputNumber v-model="editItemData.leafB"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mo">
                                    <InputNumber v-model="editItemData.leafMo"/>
                                </FormItem>
                            </i-col>
                        </Row>
                    </TabPane>
                    <TabPane label="果皮元素含量">
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="N">
                                    <InputNumber v-model="editItemData.peelN"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="P">
                                    <InputNumber v-model="editItemData.peelP"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="K">
                                    <InputNumber v-model="editItemData.peelK"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mg">
                                    <InputNumber v-model="editItemData.peelMg"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Ca">
                                    <InputNumber v-model="editItemData.peelCa"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Fe">
                                    <InputNumber v-model="editItemData.peelFe"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mn">
                                    <InputNumber v-model="editItemData.peelMn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Cu">
                                    <InputNumber v-model="editItemData.peelCu"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Zn">
                                    <InputNumber v-model="editItemData.peelZn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="B">
                                    <InputNumber v-model="editItemData.peelB"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mo">
                                    <InputNumber v-model="editItemData.peelMo"/>
                                </FormItem>
                            </i-col>
                        </Row>
                    </TabPane>
                    <TabPane label="果肉元素含量">
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="N">
                                    <InputNumber v-model="editItemData.pulpN"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="P">
                                    <InputNumber v-model="editItemData.pulpP"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="K">
                                    <InputNumber v-model="editItemData.pulpK"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mg">
                                    <InputNumber v-model="editItemData.pulpMg"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Ca">
                                    <InputNumber v-model="editItemData.pulpCa"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Fe">
                                    <InputNumber v-model="editItemData.pulpFe"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mn">
                                    <InputNumber v-model="editItemData.pulpMn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Cu">
                                    <InputNumber v-model="editItemData.pulpCu"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Zn">
                                    <InputNumber v-model="editItemData.pulpZn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="B">
                                    <InputNumber v-model="editItemData.pulpB"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mo">
                                    <InputNumber v-model="editItemData.pulpMo"/>
                                </FormItem>
                            </i-col>
                        </Row>
                    </TabPane>
                    <TabPane label="果实元素含量">
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="N">
                                    <InputNumber v-model="editItemData.fruitN"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="P">
                                    <InputNumber v-model="editItemData.fruitP"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="K">
                                    <InputNumber v-model="editItemData.fruitK"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mg">
                                    <InputNumber v-model="editItemData.fruitMg"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Ca">
                                    <InputNumber v-model="editItemData.fruitCa"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Fe">
                                    <InputNumber v-model="editItemData.fruitFe"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mn">
                                    <InputNumber v-model="editItemData.fruitMn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Cu">
                                    <InputNumber v-model="editItemData.fruitCu"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start">
                            <i-col span="6">
                                <FormItem label="Zn">
                                    <InputNumber v-model="editItemData.fruitZn"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="B">
                                    <InputNumber v-model="editItemData.fruitB"/>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="Mo">
                                    <InputNumber v-model="editItemData.fruitMo"/>
                                </FormItem>
                            </i-col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {update,del,add,search} from "../api/fertilizer_sample";
    import {getList as getCitrusList,count as countCitrus} from "../api/citrus";

    export default {
        name: "FertSampleData",
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
                        title:"品种名称",
                        maxWidth:180,
                        render:(h,params)=>{
                            let name=null;
                            this.citrus_data.forEach(citrus=>{
                                if (params.row.speciesId===citrus.speciesId){
                                    name=citrus.species;
                                }
                            })
                            return h('p',{},name);
                        }
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
                citrus_data:[],//柑橘全部种类数据
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
            this.search();
            this.getCitrusData();
        },
        methods:{
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
                    console.log(err);
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
                search(this.key_sampleId,this.key_province,this.key_location,this.page-1,this.size,"id")
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
                    speciesId: null,
                    lng: null,
                    lat: null,
                    weightSingle: null,
                    shapeIndex: null,
                    edibleRate: null,
                    ta: null,
                    ssc: null,
                    sar: null,
                    vc: null,
                    solidN: null,
                    solidP: null,
                    solidK: null,
                    solidMg: null,
                    solidCa: null,
                    solidFe: null,
                    solidMn: null,
                    solidCu: null,
                    solidZn: null,
                    solidB: null,
                    solidMo: null,
                    solidPh: null,
                    solidOrganic: null,
                    leafN: null,
                    leafP: null,
                    leafK: null,
                    leafCa: null,
                    leafMg: null,
                    leafFe: null,
                    leafMn: null,
                    leafCu: null,
                    leafZn: null,
                    leafB: null,
                    leafMo: null,
                    peelN: null,
                    peelP: null,
                    peelK: null,
                    peelCa: null,
                    peelMg: null,
                    peelFe: null,
                    peelMn: null,
                    peelCu: null,
                    peelZn: null,
                    peelB: null,
                    peelMo: null,
                    pulpN: null,
                    pulpP: null,
                    pulpK: null,
                    pulpCa: null,
                    pulpMg: null,
                    pulpFe: null,
                    pulpMn: null,
                    pulpCu: null,
                    pulpZn: null,
                    pulpB: null,
                    pulpMo: null,
                    fruitN: null,
                    fruitP: null,
                    fruitK: null,
                    fruitCa: null,
                    fruitMg: null,
                    fruitFe: null,
                    fruitMn: null,
                    fruitCu: null,
                    fruitZn: null,
                    fruitB: null,
                    fruitMo: null,
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
                this.$refs.fertSampleTable.exportCsv({
                    filename: '施肥采样点_'+new Date().toLocaleString()
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
                console.log('单独处理采样日期',this.data[index].time,this.editItemDate);
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
                    this.editItemData.lat];
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