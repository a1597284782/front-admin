<template>
  <div>
    <Modal
      v-model="showStats"
      title="添加用户信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form
        :model="localItem"
        :label-width="80"
        :rules="ruleValidate"
        ref="table"
      >
        <FormItem label="登录名" prop="username">
          <Input
            prefix="md-mail"
            v-model="localItem.username"
            placeholder="请输入登录名"
          />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input
            prefix="md-lock"
            type="password"
            v-model="localItem.password"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem label="用户昵称" prop="name">
          <Input
            prefix="md-person"
            v-model="localItem.name"
            placeholder="请输入用户昵称"
          />
        </FormItem>
        <FormItem label="手机" prop="mobile">
          <Input v-model="localItem.mobile" placeholder="请输入手机" />
        </FormItem>
        <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否是VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户积分" prop="favs">
          <Input type="number" v-model="localItem.favs" style="width: 120px" />
        </FormItem>
        <FormItem label="所在城市">
          <Input
            prefix="md-pin"
            v-model="localItem.location"
            placeholder="请输入所在城市"
          />
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="localItem.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="个性签名">
          <Input
            type="textarea"
            v-model="localItem.regmark"
            placeholder="请输入个性签名"
          />
        </FormItem>

        <!-- <FormItem label="标签">
          <Select v-model="formatTags" multiple>
            <Option
              v-for="(item, index) in tagsList"
              :value="item.tagName"
              :key="'editTags-' + index"
              >{{ item.tagName }}</Option
            >
          </Select>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUsername } from '@/api/admin'

const favPassCheck = (rule, value, callback) => {
  console.log('🚀 ~ file: edit.vue', typeof value)
  if (!value) {
    return callback(new Error('积分不能为空'))
  }
  const result = parseFloat(value)
  if (result % 1 === 0 && result > 0) {
    callback()
  } else {
    callback(new Error('积分必须是正整数'))
  }
}

const userNamePassCheck = (rule, value, callback, vm) => {
  checkUsername(value).then(res => {
    if (res.code === 200) {
      const data = res.data
      if (data === 1) {
        // 校验通过
        callback()
      } else if (data === 0) {
        // 校验失败
        callback(new Error('用户名冲突！'))
      }
    }
  })
}

const mobileCheck = (rule, value, callback, vm) => {
  if (/^1[3456789]\d{9}/.test(value)) {
    callback()
  } else {
    callback(new Error('请检查手机格式！'))
  }
}

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
      loading: true,
      // 数据
      localItem: {
        name: '',
        username: '',
        password: '',
        status: '0',
        favs: 100,
        isVip: '0',
        mobile: '',
        regmark: '用户很懒，什么都没有写~~',
        location: '',
        gender: ''
      },
      // 校验
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 4, message: '昵称长度至少为4位', trigger: 'change' },
          { type: 'string', man: 16, message: '昵称长度不能超过16位', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'email', message: '请检查邮箱格式', trigger: 'blur' },
          {
            validator: (rule, value, callback) =>
              userNamePassCheck(rule, value, callback, this),
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度至少为6位', trigger: 'change' },
          { type: 'string', man: 20, message: '密码长度不能超过20位', trigger: 'change' }
        ],
        favs: [
          // { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: favPassCheck, trigger: 'change' }
        ],
        mobile: [
          { validator: mobileCheck, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    item (newVal, oldVal) {
      console.log('🚀 ~ file: edit.vue ~ line 148 ~ item ~ newVal', newVal)
      this.localItem = { ...newVal }
    },
    isShow (newVal, oldVal) {
      this.showStats = newVal
    }
  },
  mounted () {
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('changeEvent', false)
          this.$emit('editEvent', { ...this.localItem })
          setTimeout(() => {
            this.$refs.table.resetFields()
          }, 0)
        } else {
          this.loading = false
          this.$nextTick(() => { this.loading = true })
          this.$Message.error('请检查输入数据')
        }
      })
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
    }
  }
}
</script>
