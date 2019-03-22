<!--组织单位管理-->
<template>
  <div>
    <Card :bordered="false" style="min-height: 650px">
      <Row slot="title" type="flex" justify="end" :gutter=16>
        <i-col span="6">
          <Input search enter-button placeholder="搜索单位"
                 @on-search="searchUnit"/>
        </i-col>
        <i-col>
          <Button type="success" size="large" @click="addItem">
            <Icon type="md-add"></Icon>
            添加数据
          </Button>
        </i-col>
        <i-col>
          <Button type="primary" size="large" @click="exportData">
            <Icon type="md-download"></Icon>
            导出数据
          </Button>
        </i-col>
      </Row>
      <Table border :loading="tableLoading" :columns="columns" :data="data" ref="unitTable"></Table>
      <Page :total="dataCount" :page-size="size" show-elevator @on-change="handlePageChange" style="margin-top: 16px"/>
    </Card>

    <Modal v-model="editModalShow"
           :title="isEdit?'编辑':'添加'"
           draggable
           @on-ok="saveEdit"
           @on-cancel="cancelEdit">
      <Form :model="editItemData" :label-width="80">
        <FormItem label="单位编号">
          <Input v-model="editItemData.code" :disabled="isEdit"/>
        </FormItem>
        <FormItem label="单位名称">
          <Input v-model="editItemData.name"/>
        </FormItem>
        <FormItem label="地址">
          <Input v-model="editItemData.address"/>
        </FormItem>
        <FormItem label="邮编">
          <Input v-model="editItemData.postcode"/>
        </FormItem>
        <FormItem label="简介">
          <Input v-model="editItemData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
        </FormItem>
        <FormItem label="电话">
          <Input v-model="editItemData.telephone"/>
        </FormItem>
        <FormItem label="邮箱">
          <Input v-model="editItemData.email"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {update, del, add, search} from "../api/unit";

  export default {
    name: 'UnitAdmin',
    data() {
      return {
        tableLoading: false,
        columns: [
          {
            title: '编号',
            key: 'code'
          },
          {
            title: '单位名称',
            key: 'name'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title: '邮编',
            key: 'postcode'
          },
          {
            title: '电话',
            key: 'telephone'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '图标',
            key: 'avatar',
            maxWidth: 80,
            align: "center",
            render: (h, params) => {
              return h('div', [h('Avatar', {
                attrs: {
                  src: params.row.avatar,
                }
              }),])
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    ghost: true,
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
                    ghost: true,
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
        data: [],
        key: '',
        page: 1,
        size: 10,
        sort: "",
        dataCount: 0,
        isEdit: false, // true:编辑模式 false:添加模式
        editModalShow: false,
        editItemData: {},
        imgModalShow: false,
        uploadList: [],
        imgViewIndex: -1,
      }
    },
    mounted() {
      this.searchUnit('*');
    },
    methods: {
      searchUnit(name) {
        if (name !== this.name) {//如果搜索关键词被更新，则将page重置为1
          this.name = name;
          this.page = 1;
        }
        this.tableLoading = true;
        search(this.name.length === 0 ? '*' : this.name, this.page - 1, this.size, "")
          .then(response => {
            if (response.code === 0) {
              this.dataCount = response.data.totalElements;
              this.data = response.data.content;
            } else {
              this.$Message.error("获取数据失败");
            }
          })
          .catch(err => {
            this.$Message.error("获取数据失败");
          })
          .finally(() => {
            this.tableLoading = false;
          });
      },
      addItem() {
        this.isEdit = false;
        // 创建一个空的数据以供编辑后添加
        this.editItemData = {
          name: '',
          code: '',
          address: '',
          postcode: '',
          desc: '',
          telephone: '',
          email: '',
          avatar: '',
        }
        this.editModalShow = true;
      },
      exportData() {
        this.$refs.unitTable.exportCsv({
          filename: '组织单位_' + new Date().toLocaleString()
        })
      },
      handlePageChange(page) {
        this.page = page;
        this.searchUser(this.name);
      },
      editItem(index) {
        this.isEdit = true;
        this.editItemIndex = index;
        //创建一个选中项数据的临时深拷贝用于编辑
        this.editItemData = JSON.parse(JSON.stringify(this.data[index]));
        this.editModalShow = true;
      },
      deleteItem(index) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认删除该条数据吗？</p>',
          onOk: () => {
            del(this.data[index]).then(response => {
              this.data.splice(index, 1);
              this.$Message.success("删除成功");
            }).catch(err => {
              console.log(err);
              this.$Message.error("删除失败");
            })
          },
        });
      },
      saveEdit() {
        if (this.isEdit) {//编辑
          update(this.editItemData)
            .then(response => {
              if (response.code === 0) {
                this.$Message.success("保存成功");
                this.$set(this.data,this.editItemIndex,this.editItemData);
              } else {
                this.$Message.error("保存失败");
              }
            })
            .catch(err => {
              this.$Message.error("保存失败");
              console.log(err);
            })
        } else {//添加
          add(this.editItemData)
            .then(response => {
              if (response.code === 0) {
                this.$Message.success("保存成功");
                this.data.unshift(response.data);//新数据插入列表最前
              } else {
                this.$Message.error("添加失败," + response.message);
              }
            })
            .catch(err => {
              this.$Message.error("添加失败");
              console.log(err);
            })
        }
      },
      cancelEdit() {
        this.editModalShow = false;
      },
    }
  }
</script>

<style scoped>

</style>
