<template>
  <div>
    <Form :disabled="!isEdit" ref="form" :model="formDataItem" :rules="formRules" :label-width="80">
      <FormItem label="菜单标题" prop="name">
        <i-input v-model="formDataItem.name" placeholder="请输入菜单名称"></i-input>
      </FormItem>
      <FormItem label="路径" prop="path">
        <i-input v-model="formDataItem.path" placeholder="请输入菜单路由"></i-input>
      </FormItem>
      <FormItem label="菜单类型">
        <Select v-model="formDataItem.type" placeholder="请选择菜单类型">
          <Option value="menu">目录</Option>
          <Option value="resouce">资源</Option>
        </Select>
      </FormItem>
      <FormItem label="组件" prop="component">
        <i-input v-model="formDataItem.component" placeholder="请输入前端组件名称">
          <span slot="prepend">()=>import('@/view</span>
          <span slot="append">.vue')</span>
        </i-input>
      </FormItem>
      <FormItem label="排序">
        <i-input v-model="formDataItem.sort" placeholder="组件默认排序"></i-input>
      </FormItem>
      <FormItem label="面包屑">
        不显示
        <Switch v-model="formDataItem.hideInBread" />显示
      </FormItem>
      <FormItem label="菜单显示">
        不显示
        <Switch v-model="formDataItem.hideInMenu" />显示
      </FormItem>
      <FormItem label="页面缓存">
        是
        <!-- Method 1 -->
        <!-- <i-switch v-model="formDataItem.notCache"></i-switch> -->
        <Switch v-model="formDataItem.notCache" />否
      </FormItem>
      <FormItem label="图标">
        <i-input v-model="formDataItem.icon" placeholder="请输入前端组件名称"></i-input>
      </FormItem>
      <FormItem label="重定向">
        <i-input v-model="formDataItem.redirect" placeholder="重定向组件"></i-input>
      </FormItem>
      <FormItem v-if="isEdit">
        <Button type="primary" @click="submit()">确定</Button>
        <Button style="margin-left: 8px" @click="cancel()">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
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
      // 表单
      formDataItem: {}
    }
  },
  watch: {
    formData: {
      handler: function (val, old) {
        this.formDataItem = val
      },
      deep: true
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 检验通过后的逻辑
          const data = {
            ...this.formDataItem,
            expand: true
          }
          data.title = this.formDataItem.name
          this.$emit('submit', data)
          // 恢复到默认状态
          this.initFields()
          // 2. 提交对应的数据到后台接口
        } else {
          this.$Message.error('请检验表单数据！')
        }
      })
    },
    cancel () {
      this.initFields()
    },
    initFields () {
      this.$emit('cancel')
      this.$refs.form.resetFields()
    },
    setMenu (data) {
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
