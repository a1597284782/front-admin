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
      />
      <Row type="flex" justify="space-between" align="middle">
        <i-col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </i-col>
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
      </Row>
    </Card>
    <EdiModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleEdit"
      @changeEvent="handleChangeEvent"
    ></EdiModel>
    <BatchSet
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EdiModel from './index/edit'
import { getList, deletePostById, updatePostById, updatePostBatchById } from '@/api/content'
import BatchSet from './index/batchSet'
import dayjs from 'dayjs'

export default {
  name: 'content_management',
  components: {
    Tables,
    EdiModel,
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
          title: '标题',
          key: 'title',
          minWidth: 400,
          search: {
            type: 'input'
          }
        },
        {
          title: '创建时间',
          key: 'created',
          minWidth: 200,
          align: 'center',
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
          title: '作者',
          key: 'user',
          minWidth: 120,
          align: 'center',
          // 结构化数据
          render: (h, params) => {
            return h('div', [
              h('span', params.row.uid.name)
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '分类',
          key: 'catalog',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask':
                result = '提问'
                break
              case 'advise':
                result = '建议'
                break
              case 'discuss':
                result = '交流'
                break
              case 'share':
                result = '分享'
                break
              case 'logs':
                result = '动态'
                break
              case 'notice':
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', [h('span', result)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '提问',
                value: 'ask'
              },
              {
                key: '建议',
                value: 'advise'
              },
              {
                key: '交流',
                value: 'discuss'
              },
              {
                key: '分享',
                value: 'share'
              },
              {
                key: '公告',
                value: 'notice'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'fav',
          minWidth: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '标签',
          key: 'tags',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map((o) => o.name).join(',') || '')
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '阅读计数',
          key: 'reads',
          minWidth: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '回答计数',
          key: 'answer',
          minWidth: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isTop === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          minWidth: 160,
          align: 'center',
          hidden: true
        }
      ],
      tableData: [],
      option: {},
      showSet: false,
      selection: []
    }
  },
  methods: {
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${msg}的文章吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deletePostById(arr).then((res) => {
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
      // 批量修改
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要修改的数据！')
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
      // const msg = this.selection.map((o) => o.title).join(',')
      const arr = this.selection.map((o) => o._id)
      updatePostBatchById({ ids: arr, settings }).then((res) => {
        // this.tableData.splice(index, 1)
        this.tableData.map((item) => {
          if (arr.includes(item._id)) {
            for (var keys of Object.keys(settings)) {
              item[keys] = settings[keys]
            }
          }
        })
        this.$Message.success('批量设置成功！')
        //  this._getList()
      })
    },
    handleSearch (value) {
      console.log('🚀 ~ file: index.vue ~ line 355 ~ handleSearch ~ value', value)
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
    // 确定
    handleEdit (item) {
      updatePostById(item).then(res => {
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
      console.log('🚀 ~ file: index.vue ~ line 215 ~ handleChangeEvent ~ value', value)
    },
    // 编辑
    handleRowEdit (row, index) {
      console.log('handleRowEdit -> row', row)
      this.showEdit = true
      this.currentItem = { ...row }
      this.currentIndex = index
    },
    // 删除
    handleRowRemove (row, index) {
      console.log('handleRowRemove -> row', row)
      this.$Modal.confirm({
        title: '确定删除这条数据吗？',
        content: `删除标题为"${row.title}"的文章吗？`,
        onOk: () => {
          deletePostById(row._id).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.tableData = this.tableData.filter((item) => {
                return item._id !== row._id
              })
            }
          }).catch(err => {
            this.$Message.info('删除失败！' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
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
    // 请求
    _getList () {
      getList({
        page: this.page - 1,
        limit: this.limit,
        ...this.option
      }).then((res) => {
        // 方法一： -> 修改getList接口
        // const data = res.data
        // data.forEach((item) => {
        //   if (item.status === 0) {
        //     item.status = '打开回复'
        //   } else {
        //     item.status = '禁止回复'
        //   }
        // })
        this.tableData = res.data
        this.total = res.total
      })
    }

  },
  mounted () {
    this._getList()
  }
}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
