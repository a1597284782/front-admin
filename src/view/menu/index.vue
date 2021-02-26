<template>
  <div>
    <Row :gutter="10">
      <i-col span="5" :sm="24" :md="9" :lg="5">
        <Card :dis-hover="true" :shadow="true">
          <Tree :data="data1" ref="tree"></Tree>
        </Card>
      </i-col>
      <i-col span="19" :sm="24" :md="15" :lg="19">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px;"
        >
          <Form ref="form" :model="formDate" :rules="formRules" :label-width="80">
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
          </Form>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <Table border ref="selection" :columns="columns4" :data="data2"></Table>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data1: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
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
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
