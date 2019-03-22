<!--柑橘虫害数据管理-->
<template>
    <div>
        <Card :bordered="false" style="min-height: 650px">
            <Row slot="title" type="flex" justify="end" :gutter=16>
                <i-col span="6">
                    <Input search enter-button placeholder="搜索虫害"
                           @on-search="search"/>
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
            <Table border :loading="tableLoading" :columns="columns" :data="data" ref="pestTable"></Table>
            <Page :total="dataCount" :page-size="size" show-elevator  @on-change="handlePageChange" style="margin-top: 16px" />
        </Card>
        <Modal v-model="editModalShow"
               :title="isEdit?'编辑':'添加'"
               draggable
               @on-ok="saveEdit"
               @on-cancel="cancelEdit">
            <Form :model="editItemData" :label-width="80">
                <Row type="flex" justify="start">
                    <i-col span="12">
                        <FormItem label="病害编号">
                            <Input v-model="editItemData.pestId" :disabled="isEdit"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="中文名称">
                            <Input v-model="editItemData.chsName"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="12">
                        <FormItem label="科学名称">
                            <Input v-model="editItemData.scientificName"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="别名">
                            <Input v-model="editItemData.alias"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row type="flex" justify="start">
                    <i-col span="12">
                        <FormItem label="目">
                            <Input v-model="editItemData.order"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="科">
                            <Input v-model="editItemData.family"/>
                        </FormItem>
                    </i-col>
                </Row>
                <FormItem label="卵形态">
                    <Input v-model="editItemData.egg"/>
                </FormItem>
                <FormItem label="幼虫形态">
                    <Input v-model="editItemData.larva"/>
                </FormItem>
                <FormItem label="成虫形态">
                    <Input v-model="editItemData.imago"/>
                </FormItem>
                <FormItem label="发生规律">
                    <Input v-model="editItemData.occurrence"/>
                </FormItem>
                <FormItem label="分布范围">
                    <Input v-model="editItemData.distribution"/>
                </FormItem>
                <FormItem label="为害现象">
                    <Input v-model="editItemData.damageSymptom"/>
                </FormItem>
            </Form>
            <div v-for="(controllingMethod,index) in editItemData.controllingMethods">
                <template>
                    <Row :gutter=16 type="flex" justify="center" align="middle"
                         style="margin-top: 4px;margin-bottom: 4px">
                        <i-col span="1">
                            <span>{{index+1}}</span>
                        </i-col>
                        <i-col span="5">
                            <Input size="small" v-model="controllingMethod.id" placeholder="id"/>
                        </i-col>
                        <i-col span="5">
                            <i-select size="small" v-model="controllingMethod.type">
                                <Option v-for="item in controllingMethodsTypeList" :value="item.value"
                                        :key="item.value">{{ item.label }}</Option>
                            </i-select>
                        </i-col>
                        <i-col span="11">
                            <Input size="small" v-model="controllingMethod.desc" placeholder="描述"/>
                        </i-col>
                        <i-col span="2">
                            <Button size="small" type="error" ghost icon="md-close"
                                    @click="handleControllingMethodRemove(index)"/>
                        </i-col>
                    </Row>
                </template>
            </div>
            <Row type="flex" justify="end" :gutter=16>
                <i-col span="2">
                    <Button size="small" type="primary" ghost icon="md-add" @click="handleControllingMethodAdd"/>
                </i-col>
            </Row>

            <div class="demo-upload-list" v-for="(img,index) in editItemData.images">
                <template>
                    <img :src="img.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click="handleImgView(index)"></Icon>
                        <Icon type="ios-trash-outline" @click="handleImgRemove(index)"></Icon>
                    </div>
                </template>
            </div>
            <Upload
                    ref="uploadImg"
                    :show-upload-list="false"
                    :default-file-list="uploadFileList"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleImgFormatError"
                    :on-exceeded-size="handleImgMaxSize"
                    :before-upload="handleImgBeforeUpload"
                    type="drag"
                    action="//foo"
                    style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
        </Modal>
        <Modal v-model="imgModalShow"
               title="查看图片"
               draggable>
            <div v-if="imgViewIndex!==-1">
                <img :src="editItemData.images[imgViewIndex].url" style="width: 100%;height: 100%;"/>
                <Input prefix="md-create" v-model="editItemData.images[imgViewIndex].desc" placeholder="在此输入图片描述"/>
            </div>
        </Modal>

    </div>
</template>

<script>
    import {update,del,add,search} from "../api/pest";
    import {uploadFile} from "../api/file";
    import {resize} from "../api/image";

    export default {
        name: "PestData",
        data(){
            return{
                tableLoading:false,
                columns:[
                    {
                        title:'虫害编号',
                        key:'pestId',
                    },
                    {
                        title:'中文名称',
                        key:'chsName',
                    },
                    {
                        title:'科学名称',
                        key:'scientificName',
                    },
                    {
                        title:'别名',
                        key:'alias',
                        tooltip:true,
                    },
                    {
                        title:'目',
                        key:'order',
                    },
                    {
                        title:'科',
                        key:'family',
                    },
                    {
                        title:'分布',
                        key:'distribution',
                        tooltip:true,
                    },
                    {
                        title:'图示',
                        key:'images',
                        maxWidth:80,
                        align:'center',
                        render:(h,params)=>{
                            return h('div',[h('Avatar', {
                                props: {
                                    src:resize(params.row.images[0].url,80),
                                }
                            }),])
                        }
                    },
                    {
                        title:"操作",
                        align:"center",
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
                key:'',
                page:1,
                size:10,
                sort:"",
                isEdit:false,//true:编辑模式 false:添加模式
                editModalShow:false,
                editItemData:{},
                editItemIndex:-1,
                imgModalShow:false,
                uploadFileList:[],
                imgViewIndex:-1,
                controllingMethodsTypeList:[
                    {
                        value: 1,
                        label: '化学防治'
                    },
                    {
                        value: 2,
                        label: '农业防治'
                    },
                    {
                        value: 3,
                        label: '生物防治'
                    },
                    {
                        value: 4,
                        label: '物理防治'
                    },
                    {
                        value: 5,
                        label: '其他防治'
                    },
                ]
            }
        },
        mounted(){
            this.search('*');
        },
        methods:{
            search(key){
                if (key!==this.key){
                    this.key=key;
                    this.page=1;
                }
                this.tableLoading=true;
                search(this.key.length===0?'*':this.key,this.page-1,this.size,"")
                    .then(response=>{
                        if (response.code===0){
                            this.dataCount=response.data.totalElements;
                            this.data=response.data.content;
                        } else{
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
                //创建一个空的数据以供编辑后添加
                this.editItemData={
                    pestId: "",
                    chsName: "",
                    scientificName: "",
                    alias: "",
                    order: "",
                    family: "",
                    imago: "",
                    egg:"",
                    larva:"",
                    occurrence:"",
                    distribution:"",
                    damageSymptom: "",
                    controllingMethods:[],
                    images:[],
                };
                this.editModalShow=true;
                this.imgViewIndex=-1;
            },
            exportData(){
                this.$refs.pestTable.exportCsv({
                    filename: '柑橘虫害_'+new Date().toLocaleString()
                })
            },
            handlePageChange(page){
                this.page=page;
                this.search(this.key);
            },
            editItem(index){
                this.isEdit=true;
                this.editItemIndex=index;
                this.editItemData=JSON.parse(JSON.stringify(this.data[index]));
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
                if (this.isEdit){//编辑
                    update(this.editItemData)
                        .then(response=>{
                            if (response.code===0){
                                this.$Message.success("保存成功");
                                this.data[this.editItemIndex]=this.editItemData;
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
            handleImgFormatError(){
                this.$Message.error("图片文件格式错误");
            },
            handleImgMaxSize(){
                this.$Message.error("文件大小超出限制");
            },
            handleImgBeforeUpload(file){
                this.$Loading.start();
                uploadFile('pest_image/'+this.editItemData.pestId+'/'+file.name,file).then(result=>{
                    if (result.res.status===200) {
                        this.$Loading.finish();
                        this.editItemData.images.push({
                            url:result.url,
                            desc:'',
                        })
                    }else {
                        this.$Loading.error();
                    }
                }).catch(err=>{
                    this.$Loading.error();
                    console.log(err);
                });
                return false;
            },
            handleImgView(index){
                this.imgViewIndex=index;
                this.imgModalShow=true;
            },
            handleImgRemove(index){
                this.editItemData.images.splice(index,1);
            },
            handleControllingMethodRemove(index){
                this.editItemData.controllingMethods.splice(index,1);
            },
            handleControllingMethodAdd(){
                this.editItemData.controllingMethods.push({
                    id:'',
                    type:5,
                    desc:'',
                })
            },
        }
    }
</script>

<style scoped>
    .demo-upload-list{
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
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>