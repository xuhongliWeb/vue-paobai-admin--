<template>
  <div class="file-detail">
    <section class="left">
      <div>
        <a-button @click="back"><a-icon-left /></a-button>
      </div>
      <div class="view-box">
        <pre-image></pre-image>
      </div>
    </section>
    <section class="right">
      <a-descriptions title="文件详情" :column="1" layout="inline-vertical">
        <a-descriptions-item label="名称：">头像01</a-descriptions-item>
        <a-descriptions-item label="类型：">jpg</a-descriptions-item>
        <a-descriptions-item label="路径：">/</a-descriptions-item>
        <a-descriptions-item label="文件大小：">256K</a-descriptions-item>
        <a-descriptions-item label="创建人：">admin</a-descriptions-item>
        <a-descriptions-item label="创建时间：">2022-05-18 15:25:08</a-descriptions-item>
        <a-descriptions-item label="文件ID：">1511952522629615617</a-descriptions-item>
        <a-descriptions-item label="标签：">
          <a-space :size="5">
            <a-tag color="red">头像</a-tag>
            <a-tag color="orangered">图片</a-tag>
            <a-tag color="purple">JPG</a-tag>
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="说明："
          >基于 v-viewer vue3 实现自定义按钮的图片预览，其他功能可自行扩展</a-descriptions-item
        >
      </a-descriptions>

      <a-row justify="end" class="foot-btn">
        <a-space>
          <a-button>
            <template #icon><a-icon-download :size="16" /></template>
          </a-button>
          <a-button>
            <template #icon><a-icon-share-alt :size="16" /></template>
          </a-button>
          <a-button>
            <template #icon><a-icon-drag-arrow :size="16" /></template>
          </a-button>
          <a-button>
            <template #icon><a-icon-delete :size="16" /></template>
          </a-button>
        </a-space>
      </a-row>
    </section>
  </div>
</template>

<script setup lang="ts" name="FileDetail">
import PreImage from "./pre-image.vue"
import { useRouter } from "vue-router"
const router = useRouter()

const back = () => {
  router.back()
}
</script>

<style lang="less" scoped>
:deep(.arco-btn) {
  border-radius: 4px;
}

:deep(.arco-descriptions-item) {
  display: flex;
  margin-bottom: 8px;

  .arco-descriptions-item-label-inline {
    font-size: 13px;
    white-space: nowrap;
  }

  .arco-descriptions-item-value-inline {
    font-size: 13px;
  }
}

.file-detail {
  display: flex;
  width: 100%;
  height: 100%;

  > .left,
  > .right {
    box-sizing: border-box;
    padding: 16px;
    overflow: hidden;
    background-color: var(--color-bg-1);
    border-radius: 2px;
  }

  > .left {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 16px;

    .view-box {
      flex: 1;
      margin-top: 12px;
      overflow: hidden;
    }
  }

  > .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 300px;
    margin: 16px;
    margin-left: 0;
  }
}
</style>
