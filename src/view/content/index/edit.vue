<template>
  <div>
    <Modal
      v-model="showStats"
      title="Common Modal dialog box title"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form :model="localItem" :label-width="80">
        <FormItem label="标题">
          <Input v-model="localItem.title" placeholder="请输入文章标题" />
        </FormItem>
        <FormItem label="分类">
          <Select v-model="localItem.catalog">
            <Option value="ask">提问</Option>
            <Option value="advise">建议</Option>
            <Option value="discuss">讨论</Option>
            <Option value="share">分享</Option>
            <Option value="logs">动态</Option>
            <Option value="notice">公告</Option>
          </Select>
        </FormItem>
        <FormItem label="是否结束">
          <RadioGroup v-model="localItem.isEnd">
            <Radio label="0">未结束</Radio>
            <Radio label="1">已结贴</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="回复状态">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">打开回复</Radio>
            <Radio label="1">禁止回复</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否置顶">
          <RadioGroup v-model="localItem.isTop">
            <Radio label="0">未置顶</Radio>
            <Radio label="1">已置顶</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="帖子积分">
          <Slider v-model="formatFav" show-input :step="10"></Slider>
        </FormItem>
        <FormItem label="标签">
          <Select v-model="formatTags" multiple>
            <Option
              v-for="(item, index) in tagsList"
              :value="item.tagName"
              :key="'editTags-' + index"
              >{{ item.tagName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getTags } from '@/api/content'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      showStats: false,
      tagsList: [],
      localItem: {
        tid: '',
        uid: '',
        title: '',
        content: '',
        created: '',
        catalog: '',
        fav: '',
        isEnd: '',
        reads: '',
        answer: '',
        status: '',
        isTop: '',
        sort: '',
        tags: []
      }
    }
  },
  watch: {
    item (newVal, oldVal) {
      this.localItem = newVal
    },
    isShow (newVal, oldVal) {
      this.showStats = newVal
    }
  },
  computed: {
    formatFav: {
      get () {
        return parseInt(this.localItem.fav)
      },
      set (value) {
        this.localItem.fav = value
      }
    },
    formatTags: {
      get () {
        return this.localItem.tags.map((o) => o.name)
      },
      set (value) {
        const arr = this.tagsList.filter(
          (item) => value.indexOf(item.tagName) !== -1
        )
        this.localItem.tags = arr.map((o) => {
          return {
            class: o.tagClass,
            name: o.tagName
          }
        })
        // this.localItem.tags.push()
      }
    }
  },
  mounted () {
    this._getTags()
  },
  methods: {
    // 获取标签数据
    _getTags () {
      getTags().then((res) => {
        if (res.code === 200) {
          this.tagsList = res.data
        }
      })
    },
    ok () {
      this.$emit('editEvent', this.localItem)
    },
    cancel () {
      this.$emit('changeEvent', false)
      this.$Message.info('Clicked cancel')
    }
  }
}
</script>
