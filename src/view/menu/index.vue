<template>
  <div>
    <Row :gutter="10">
      <i-col span="6" :sm="24" :md="9" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <i-row type="flex" align="middle" justify="center">
            <ButtonGroup class="imooc-btn-group">
              <Button size="small">
                <Dropdown @on-click="addMenu">
                  <a href="javascript:void(0)">
                    <Icon type="md-add"></Icon>
                    <span class="imooc-dropdown">新增</span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">兄弟节点</DropdownItem>
                    <DropdownItem name="child" :disabled="menuData.length === 0">子节点</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Button>
              <Button size="small" icon="ios-create" type="primary" @click="editMenu()">修改</Button>
              <Button size="small" icon="md-trash" type="error">删除</Button>
            </ButtonGroup>
          </i-row>
          <Tree :data="menuData" ref="tree" @on-select-change="handleTreeChange"></Tree>
        </Card>
      </i-col>
      <i-col span="18" :sm="24" :md="15" :lg="18">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px;"
        >
          <Form
            :disabled="!isEdit"
            ref="form"
            :model="formDate"
            :rules="formRules"
            :label-width="80"
          >
            <FormItem label="菜单标题" prop="name">
              <i-input v-model="formDate.name" placeholder="请输入菜单名称"></i-input>
            </FormItem>
            <FormItem label="路径" prop="path">
              <i-input v-model="formDate.path" placeholder="请输入菜单路由"></i-input>
            </FormItem>
            <FormItem label="菜单类型">
              <Select v-model="formDate.type" placeholder="请选择菜单类型">
                <Option value="menu">目录</Option>
                <Option value="resouce">资源</Option>
              </Select>
            </FormItem>
            <FormItem label="组件" prop="component">
              <i-input v-model="formDate.component" placeholder="请输入前端组件名称">
                <span slot="prepend">()=>import('@/view</span>
                <span slot="append">.vue')</span>
              </i-input>
            </FormItem>
            <FormItem label="排序">
              <i-input v-model="formDate.sort" placeholder="组件默认排序"></i-input>
            </FormItem>
            <FormItem label="面包屑">
              不显示
              <Switch v-model="formDate.hideInBread" />显示
            </FormItem>
            <FormItem label="菜单显示">
              不显示
              <Switch v-model="formDate.hideInMenu" />显示
            </FormItem>
            <FormItem label="页面缓存">
              是
              <!-- Method 1 -->
              <!-- <i-switch v-model="formDate.notCache"></i-switch> -->
              <Switch v-model="formDate.notCache" />否
            </FormItem>
            <FormItem label="图标">
              <i-input v-model="formDate.icon" placeholder="请输入前端组件名称"></i-input>
            </FormItem>
            <FormItem label="重定向">
              <i-input v-model="formDate.redirect" placeholder="重定向组件"></i-input>
            </FormItem>
            <FormItem v-if="isEdit">
              <Button type="primary" @click="submit()">确定</Button>
              <Button style="margin-left: 8px" @click="cancel()">取消</Button>
            </FormItem>
          </Form>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <tables
            ref="tables"
            searchable
            search-place="top"
            :columns="columns"
            v-model="tableData"
            @on-row-edit="handleRowEdit"
            @on-row-remove="handleRowRemove"
            @on-selection-change="handleSelect"
            @searchEvent="handleSearch"
          >
            <template v-slot:table-header>
              <Button @click="handleAdd" class="search-btn" type="primary">
                <Icon type="md-person-add" />&nbsp;&nbsp;添加
              </Button>
            </template>
          </tables>
          <Row type="flex" justify="space-between" align="middle">
            <i-col class="ctrls">
              <Button @click="handleDeleteBatch()">批量删除</Button>
              <Button @click="handleSetBatch()">批量设置</Button>
            </i-col>
            <i-col>
              <Page
                :total="total"
                :current="page"
                :page-size="limit"
                :page-size-opts="pageArr"
                show-elevator
                show-sizer
                show-total
                @on-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
              />
            </i-col>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
export default {
  components: {
    Tables
  },
  data () {
    return {
      isEdit: false,
      selectNode: [],
      menuData: [],
      type: '',
      formDate: {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      },
      formRules: {
        name: [
          {
            required: true,
            message: '菜单名称不得为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路由路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          search: {
            type: 'input'
          }
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'methods',
          search: {
            type: 'input'
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          }
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 100,
          align: 'center'
        }
      ],
      selection: [],
      tableData: [],
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100]
    }
  },
  mounted () {
    window.vue = this
  },
  methods: {
    addMenu (type) {
      this.type = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true
      } else {
        this.$Message.error('请选择菜单节点后再添加！')
      }
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 检验通过后的逻辑
          const data = {
            title: this.formDate.name,
            ...this.formDate,
            expand: true
          }
          // 1. 获取 formData中的数据 -> menuData中
          //   a. type -> 数据插入的节点
          //   b. 数据需要按照tree的数据格式进行格式化 -> title
          if (this.type === 'bro') {
            // 兄弟节点
            if (this.menuData.length === 0) {
              this.menuData.push(data)
              this.isEdit = false
              // 清空formData中的数据
              this.$refs.form.resetFields()
            } else {
              // this.selectNode.length > 0
              const selectNode = this.selectNode[0]
              // this.menuData = this.menuData -> children -> ... -> selectNode
              // 1. parent 2. selectNdoe -> new menuData
              const getMenu = (parent, select) => {
                // 1. 遍历parent -> select push
                // 2. children -> push child
                // 3. return parent
                for (let i = 0; i < parent.length; i++) {
                  const item = parent[i]
                  // 去重
                  if (item.name === select.name) {
                    // 排序
                    parent.push(data)
                    return parent
                  } else {
                    if (item.children && item.children.length > 0) {
                      getMenu(item.children, select)
                    }
                  }
                }
                return parent
              }
              this.menuData = getMenu(this.menuData, selectNode)
            }
          } else if (this.type === 'child') {
            // 子节点
            if (typeof this.selectNode[0].children === 'undefined') {
              this.$set(this.selectNode[0], 'children', [data])
            } else {
              // 排序？
              this.$set(this.selectNode[0], 'children', [
                ...this.selectNode[0].children,
                data
              ])
            }
          }
          // 恢复到默认状态
          this.isEdit = false
          this.$refs.form.resetFields()
          // 2. 提交对应的数据到后台接口
        } else {
          this.$Message.error('请检验表单数据！')
        }
      })
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.isEdit = true
      } else {
        this.$Message.error('请选择菜单节点后再编辑！')
      }
    },
    handleTreeChange (item) {
      this.selectNode = item
    },
    handleRowEdit () {},
    handleRowRemove () {},
    handleSelect () {},
    handleSearch () {},
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteUserById(arr).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData = this.tableData.filter(
              (item) => !arr.includes(item._id)
            )
            this.$Message.success('删除成功！')
            //  this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    handleAdd () {},
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .imooc-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .imooc-dropdown {
      display: none;
    }
  }
}
.imooc-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
}
</style>
