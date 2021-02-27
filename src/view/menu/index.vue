<template>
  <div>
    <Row :gutter="10">
      <i-col span="6" :sm="24" :md="9" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <TreeMenu
            :isEdit="isEdit"
            :menu="menuData"
            @addMenuEvent="addMenu"
            @editMenuEvent="editMenu"
            @deleteMenuEvent="deleteMenu"
            @on-select="handleTreeChange"
          ></TreeMenu>
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
          <MenuForm
            :formData="formData"
            :isEdit="isEdit"
            :selectNode="selectNode"
            @cancel="initForm"
            @submit="submit"
          ></MenuForm>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <OperationsTable :columns="columns" :tableData="tableData" :isEdit="isEdit"></OperationsTable>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import TreeMenu from './tree.vue'
import MenuForm from './form.vue'
import OperationsTable from './operations.vue'
import { sortObj, updateNode, insertNode, deleteNode } from '@/libs/util'
export default {
  components: {
    TreeMenu,
    MenuForm,
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      type: '',
      selectNode: [],
      menuData: [],
      formData: {
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
          },
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
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
          },
          align: 'center'
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
      tableData: []
    }
  },
  mounted () {
    window.vue = this
  },
  methods: {
    handleTreeChange (item) {
      this.selectNode = item
    },
    addMenu (type) {
      this.type = type
      this.isEdit = true
    },
    editMenu (select) {
      this.isEdit = true
      this.formData = select
    },
    deleteMenu (select) {
      this.menuData = deleteNode(this.menuData, select)
    },
    submit (data) {
      data.title = this.formData.name
      // 1. 获取 formData中的数据 -> menuData中
      //   a. type -> 数据插入的节点
      //   b. 数据需要按照tree的数据格式进行格式化 -> title
      if (this.type === 'bro') {
        // 兄弟节点
        if (this.menuData.length === 0) {
          this.menuData.push(data)
          this.initForm()
        } else {
          // this.selectNode.length > 0
          const selectNode = this.selectNode[0]
          this.menuData = insertNode(this.menuData, selectNode, data)
        }
      } else if (this.type === 'child') {
        // 子节点
        if (typeof this.selectNode[0].children === 'undefined') {
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [...this.selectNode[0].children, data]
          arr = sortObj(arr, 'sort')
          // 排序？
          this.$set(this.selectNode[0], 'children', arr)
        }
      } else {
        // 更新菜单节点
        this.menuData = updateNode(this.menuData, data)
        this.$set(this.selectNode, 0, data)
      }
    },
    initForm () {
      this.isEdit = false
      this.type = ''
      this.formData = {
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
      }
    }
  }
}
</script>

<style lang="scss">
</style>
