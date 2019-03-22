<!--用户管理-->
<template>
  <div>
    <Card :bordered="false" style="min-height: 650px">
      <Row slot="title" type="flex" justify="end" :gutter=16>
        <i-col span="6">
          <Input search enter-button placeholder="搜索用户"
                 @on-search="searchUser"/>
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
      <Table border :loading="tableLoading" :columns="columns" :data="data" ref="userTable"></Table>
      <Page :total="dataCount" :page-size="size" show-elevator @on-change="handlePageChange" style="margin-top: 16px"/>
    </Card>

    <Modal v-model="editModalShow"
           :title="isEdit?'编辑':'添加'"
           draggable
           @on-ok="saveEdit"
           @on-cancel="cancelEdit">
      <Form :model="editItemData" :label-width="80">
        <FormItem label="用户编号">
          <Input v-model="editItemData.code" :disabled="isEdit"/>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="editItemData.username"/>
        </FormItem>
        <FormItem label="角色">
          <Select v-model="editItemData.role.name">
            <Option value="NORMAL">NORMAL</Option>
            <Option value="SENIOR">SENIOR</Option>
          </Select>
        </FormItem>
        <FormItem label="姓名">
          <Input v-model="editItemData.name"/>
        </FormItem>
        <FormItem label="性别">
          <Input v-model="editItemData.gender"/>
        </FormItem>
        <FormItem label="电话">
          <Input v-model="editItemData.telephone"/>
        </FormItem>
        <FormItem label="手机">
          <Input v-model="editItemData.mobilephone"/>
        </FormItem>
        <FormItem label="邮箱">
          <Input v-model="editItemData.email"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {update, del, add, search} from "../api/user";

  export default {
    name: 'UserAdmin',
    data() {
      return {
        tableLoading: false,
        columns: [
          {
            title: '编号',
            key: 'code'
          },
          {
            title: '角色',
            key: 'role',
            render: (h, params) => {
              return h('div', [
                h('normal', params.row.role.desc)
              ]);
            }
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '性别',
            key: 'gender',
            render: (h, params) => {
              if (params.row.gender === 1) {
                return h('div', [
                  h('normal', '男')
                ]);
              }
              else {
                return h('div', [
                  h('normal', '女')
                ]);
              }
            }
          },
          {
            title: '电话',
            key: 'telephone'
          },
          {
            title: '手机',
            key: 'mobilephone'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '头像',
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
            title: '单位',
            key: 'unit',
            render: (h, params) => {
              return h('div', [
                h('normal', params.row.unit.name)
              ]);
            }
          },
          {
            title: "操作",
            align: "center",
            width: 150,
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
        name: '',
        dataCount: 0,
        page: 1,
        size: 10,
        sort: '',
        isEdit: false, // true:编辑模式 false:添加模式
        editModalShow: false,
        editItemData: {
          code: "",
          role: {name:'NORMAL'},
          name: "",
          gender: "",
          telephone: "",
          mobilephone: "",
          email: "",
          avatar: "",
          unit: {name:''},
        },
        editItemIndex: -1,
      }
    },
    mounted() {
      this.searchUser('*');
    },
    methods: {
      searchUser(name) {
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
        //创建一个空的数据以供编辑后添加
        this.editItemData = {
          code: "",
          role: {name:'NORMAL'},
          name: "",
          gender: "",
          telephone: "",
          mobilephone: "",
          email: "",
          avatar: "",
          unit: {name:''},
        };
        this.editModalShow = true;
      },
      exportData() {
        this.$refs.userTable.exportCsv({
          filename: '用户表_' + new Date().toLocaleString()
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
