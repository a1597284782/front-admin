<template>
  <div>
    <tables
      ref="tables"
      searchable
      search-place="top"
      :columns="columns"
      v-model="localData"
      @on-row-edit="handleRowEdit"
      @on-row-remove="handleRowRemove"
      @on-selection-change="handleSelect"
      @searchEvent="handleSearch"
    >
      <template v-slot:table-header>
        <Button @click="handleAdd" class="search-btn" type="primary" v-if="isEdit">
          <Icon type="md-person-add" />&nbsp;&nbsp;添加
        </Button>
      </template>
    </tables>
    <Row type="flex" justify="space-between" align="middle">
      <i-col class="ctrls" v-if="isEdit">
        <Button @click="handleDeleteBatch()">批量删除</Button>
        <Button @click="handleSetBatch()">批量设置</Button>
      </i-col>
      <i-col>
        <Page
          v-if="total.length > 0"
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
    <AddModel :isShow="showAdd" @editEvent="handleItemAdd" @changeEvent="handleAddChangeEvent"></AddModel>
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddModel from './operations/add'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tables,
    AddModel
  },
  data () {
    return {
      showAdd: false,
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100]
    }
  },
  computed: {
    localData: {
      get: function () {
        return this.tableData
      },
      set: function (value) {
        console.log('value', value)
      }
    }
  },
  methods: {
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
            // this.localData.splice(index, 1)
            this.localData = this.localData.filter(
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
    handleAdd () {
      this.showAdd = true
    },
    handleItemAdd (item) {
      this.localData.push(item)
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
