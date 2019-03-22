<!--柑橘种类数据管理-->
<template>
    <div>
        <Card :bordered="false" style="min-height: 650px">
            <Row slot="title" type="flex" justify="end" :gutter=16>
                <i-col span="6">
                    <Input search enter-button placeholder="搜索品种"
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
            <Table border :loading="tableLoading" :columns="columns" :data="data" ref="citrusTable"></Table>
            <Page :total="dataCount" :page-size="size" show-elevator  @on-change="handlePageChange" style="margin-top: 16px" />
        </Card>
        <Modal v-model="editModalShow"
               :title="isEdit?'编辑':'添加'"
               draggable
               @on-ok="saveEdit"
               @on-cancel="cancelEdit">
            <Form :model="editItemData" :label-width="80">
                <FormItem label="品种编号">
                    <Input v-model="editItemData.speciesId" :disabled="isEdit"/>
                </FormItem>
                <FormItem label="品种名称">
                    <Input v-model="editItemData.species"/>
                </FormItem>
                <FormItem label="别名">
                    <Input v-model="editItemData.alias"/>
                </FormItem>
                <FormItem label="科">
                    <Input v-model="editItemData.family"/>
                </FormItem>
                <FormItem label="属">
                    <Input v-model="editItemData.genus"/>
                </FormItem>
                <FormItem label="分布范围">
                    <Input v-model="editItemData.distribution" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="editItemData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                </FormItem>
            </Form>

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
    import {update,del,add,search} from "../api/citrus";
    import {uploadFile} from "../api/file";
    import {resize} from "../api/image";

    export default {
        name: "CitrusData",
        data(){
            return{
                tableLoading:false,
                columns:[
                    {
                        title:"品种编号",
                        key:"speciesId"
                    },
                    {
                        title:"品种",
                        key:"species"
                    },
                    {
                        title:"别名",
                        key:"alias"
                    },
                    {
                        title:"科",
                        key:"family"
                    },
                    {
                        title:"属",
                        key:"genus"
                    },
                    {
                        title:"图示",
                        key:"images",
                        maxWidth:80,
                        align:"center",
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
            }
        },
        mounted(){
            this.search('*');
        },
        methods:{
            search(key){
                if (key!==this.key){//如果搜索关键词被更新，则将page重置为1
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
                    speciesId: "",
                    species: "",
                    alias: "",
                    family: "",
                    genus: "",
                    distribution: "",
                    desc: "",
                    images: [],
                };
                this.editModalShow=true;
                this.imgViewIndex=-1;
            },
            exportData(){
                this.$refs.citrusTable.exportCsv({
                    filename: '柑橘品种_'+new Date().toLocaleString()
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
                uploadFile('citrus_image/'+this.editItemData.speciesId+'/'+file.name,file).then(result=>{
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
            }
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