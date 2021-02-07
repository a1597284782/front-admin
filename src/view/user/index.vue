<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary"
            ><Icon type="md-person-add" />&nbsp;&nbsp;新增用户</Button
          >
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>
            导出为Excel文件
          </Button>
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
        </Col>
        <Col
          ><Page
            :total="total"
            :current="page"
            :page-size="limit"
            :page-size-opts="pageArr"
            show-elevator
            show-sizer
            show-total
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
        /></Col>
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
    <AddModel
      :isShow="showAdd"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></AddModel>
    <BatchSet
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import { getUserList, updateUserById, updateUserBatchById, deleteUserById, addUser } from '@/api/admin'
import Tables from '_c/tables'
import EditModel from './edit'
import AddModel from './add'
import BatchSet from './batchSet'
import dayjs from 'dayjs'

export default {
  name: 'user_management',
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchSet
  },
  data () {
    return {
      // 当前页
      page: 1,
      // 每页多少条
      limit: 10,
      // 总条数
      total: 40,
      pageArr: [10, 20, 30, 50, 100],
      // 控制显示对话框
      showEdit: false,
      // 行数据
      currentItem: {},
      currentIndex: 0,
      // 表头
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'name',
          align: 'center',
          minWidth: 140,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          align: 'center',
          minWidth: 200,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            return h('div', [h('span', params.row.roles.join(','))])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true,
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [h('span', params.row.status === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          hidden: true,
          minWidth: 160,
          align: 'center'
        }
      ],
      tableData: [],
      showAdd: false,
      // 批量
      showSet: false,
      selection: [],
      option: {}
    }
  },
  mounted () {
    this._getList()
  },
  methods: {
    handleSearch (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      if (
        (typeof this.option.search !== 'undefined' &&
          value.search !== this.option.search) ||
        this.option === {}
      ) {
        this.page = 1 // 从1开始
      }
      this.option = value
      this._getList()
    },
    // 页码改变的回调，返回改变后的页码
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    // 确定
    handleEdit (item) {
      updateUserById(item).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, item)
          this.$Message.success(res.msg)
        }
      })
      this.showEdit = false
    },
    // 取消
    handleChangeEvent (value) {
      this.showEdit = value
    },
    // 编辑
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentItem = { ...row }
      this.currentIndex = index
    },
    // 删除
    handleRowRemove (row, index) {
      console.log('handleRowRemove -> row', row)
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除"${row.name}"的用户吗？`,
        onOk: () => {
          deleteUserById(row._id).then(res => {
            console.log('🚀 ~ file: index.vue ~ line 212 ~ deleteUserById ~ res', res)
            this.$Message.success('删除成功!')
            this.tableData.splice(index, 1)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    // 导出
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    // 获取列表数据
    _getList () {
      getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    // 新增用户
    handleAddUser () {
      this.showAdd = true
    },
    // 添加模态框
    handleItemAdd (item) {
      addUser(item).then(res => {
        if (res.code === 200) {
          this.tableData.splice(0, 0, res.data)
          this.$Message.success('添加成功!')
        }
      })
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
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
      // 批量设置
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    // 批量设置模态框
    handleItemSet (settings) {
      console.log('handleItemSet -> settings', settings)
      // const msg = this.selection.map((o) => o.username).join(',')
      const arr = this.selection.map((o) => o._id)
      updateUserBatchById({ ids: arr, settings }).then((res) => {
        // this.tableData.splice(index, 1)
        this.tableData = this.tableData.map((item) => {
          if (arr.includes(item._id)) {
            for (var keys of Object.keys(settings)) {
              item[keys] = settings[keys]
            }
          }
        })
        this.$Message.success('批量设置成功！')
        //  this._getList()
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin: 10px;
  }
}
</style>
