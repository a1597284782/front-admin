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
      />
      <Row type="flex" justify="space-between" align="middle">
        <Button style="margin: 10px 0" type="primary" @click="exportExcel"
          >导出为Excel文件</Button
        >
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
  </div>
</template>

<script>
import Tables from '_c/tables'
import EdiModel from './index/edit'
import { getList, deletePostById, updatePostById } from '@/api/content'
import dayjs from 'dayjs'

export default {
  name: 'content_management',
  components: {
    Tables,
    EdiModel
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
          title: '标题',
          key: 'title',
          minWidth: 400
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
          }
        },
        {
          title: '积分',
          key: 'fav',
          minWidth: 100,
          align: 'center'
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
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
          }
        },
        {
          title: '阅读计数',
          key: 'reads',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '回答计数',
          key: 'answer',
          minWidth: 100,
          align: 'center'
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
      tableData: []
    }
  },
  methods: {
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
      getList({ page: this.page - 1, limit: this.limit }).then(res => {
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

<style>
</style>
