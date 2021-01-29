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
          <Button @click="handleSelectAll(true)">批量全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button>
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
  </div>
</template>

<script>
import { getUserList, updateUserById, deleteUserById, addUser } from '@/api/admin'
import Tables from '_c/tables'
import EditModel from './edit'
import AddModel from './add'
import dayjs from 'dayjs'

export default {
  name: 'user_management',
  components: {
    Tables,
    EditModel,
    AddModel
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
          align: 'center'
        },
        {
          title: '用户昵称',
          key: 'name',
          align: 'center',
          minWidth: 140
        },
        {
          title: '登录名',
          key: 'username',
          align: 'center',
          minWidth: 200
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            return h('div', [h('span', params.row.roles.join(','))])
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [h('span', params.row.status === '0' ? '否' : '是')])
          }
        },
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
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
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          minWidth: 160,
          align: 'center'
        }
      ],
      tableData: [],
      showAdd: false
    }
  },
  mounted () {
    this._getList()
  },
  methods: {
    // 页码改变的回调，返回改变后的页码
    onPageChange (page) {
      this.page = page
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    onPageSizeChange (size) {
      this.limit = size
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
      getUserList({ page: this.page - 1, limit: this.limit }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    // 新增用户
    handleAddUser () {
      this.showAdd = true
    },
    handleItemAdd (item) {
      addUser(item).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.tableData.length, 0, res.data)
          this.$Message.success('添加成功!')
        }
      })
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
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
