<template>
  <base-modal
    :title="formData.id ? '编辑角色' : '新增角色'"
    width="690px"
    @ok="handleOk"
    @cancel="handleCancel"
    @register="modalInnerRegister">
    <a-form ref="arcoForm" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="roleName" label="角色名称：" :rules="[{ required: true, message: '请输入' }]">
            <a-input v-model="formData.roleName" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="roleCode" label="角色编码：" :rules="[{ required: true, message: '请输入' }]">
            <a-input v-model="formData.roleCode" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="description" label="角色描述：">
            <a-textarea v-model="formData.description" style="height: 140px" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="routerKeys" label="选择权限：">
            <a-tree
              ref="menuTree"
              v-model:checked-keys="formData.routerKeys"
              only-check-leaf
              checked-strategy="all"
              style="width: 100%; max-height: 500px; overflow-y: auto"
              :field-names="{
                key: 'key',
                title: 'title',
                children: 'children',
                icon: ''
              }"
              :checkable="true"
              :data="treeData">
              <template #title="data">
                <span v-if="data.type === 0">菜单：</span>
                <span v-else-if="data.type === 1">页面：</span>
                <span v-else-if="data.type === 2">外链：</span>
                <span v-else-if="data.type === 3">按钮：</span>
                <span>{{ data.title }}</span>
              </template>
            </a-tree>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount, ref, getCurrentInstance } from "vue"
import { modalMixins, useModalInner } from "@/components/base-modal"
import type { modalInnerInfoType } from "@/components/base-modal"
import { MenuApi, RoleApi } from "@/api/upms"
import { Message, Tree } from "@arco-design/web-vue"
import { resetFormData } from "@/utils/form-data"
import { getArcoFormRef } from "@/hooks/arco"

export default defineComponent({
  mixins: [modalMixins],
  props: {},
  emits: ["refreshData"],
  setup(props, context) {
    let sourceFormData = {
      id: "",
      roleName: "",
      roleCode: "",
      description: "",
      routerKeys: [] as string[]
    }
    let menuTree = ref<InstanceType<typeof Tree>>()
    let formData = reactive(resetFormData({}, sourceFormData))
    let instance = getCurrentInstance()
    let treeData = ref()
    let checkedKeys = ref()
    let initFunction = (modalInnerInfo: modalInnerInfoType, data: any) => {
      resetFormData(formData, sourceFormData, data)
      if (data) {
        RoleApi.getDetailsById(data.id).then(res => {
          Object.assign(formData, res.data)
        })
      }
      modalInnerInfo.showModal()
    }
    let { modalInnerRegister, modalInnerInfo } = useModalInner(props, context, initFunction)
    let fixSourceMenuTree = (source: any[]) => {
      return source
    }
    let handleOk = () => {
      getArcoFormRef(instance).validate(error => {
        if (error) return
        let methods: PromiseFn = RoleApi.add.bind(RoleApi)
        if (formData.id) methods = RoleApi.update.bind(RoleApi)
        let choseList = menuTree.value!.getCheckedNodes({ checkedStrategy: "all", includeHalfChecked: true })
        formData.routerKeys = choseList.filter(e => e).map(e => e!.key as string)
        methods(formData, formData.id).then(() => {
          Message.success("成功")
          modalInnerInfo.closeModal()
          context.emit("refreshData")
        })
      })
    }
    let handleCancel = () => {
      modalInnerInfo.closeModal()
    }
    onBeforeMount(() => {
      MenuApi.get({ attachButton: true }).then(res => {
        treeData.value = fixSourceMenuTree(res.data)
      })
    })
    return {
      modalInnerRegister,
      formData,
      treeData,
      checkedKeys,
      handleOk,
      handleCancel,
      menuTree
    }
  }
})
</script>

<style lang="less" scoped>
.add-or-edit {
}
</style>
