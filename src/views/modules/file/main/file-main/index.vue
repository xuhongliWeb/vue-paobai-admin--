<template>
  <div class="file-main">
    <!-- 面包屑导航 -->
    <file-nav-path></file-nav-path>

    <a-row justify="space-between" class="row-operate">
      <!-- 左侧区域 -->
      <a-space>
        <a-dropdown>
          <a-button type="primary" shape="round">
            <template #icon><a-icon-upload /></template>
            <template #default>上传</template>
          </a-button>
          <template #content>
            <a-doption>
              <template #icon><gi-svg-icon name="upload-file" /></template>
              <span>上传文件</span>
            </a-doption>
            <a-doption>
              <template #icon><gi-svg-icon name="upload-folder" /></template>
              <span>上传文件夹</span>
            </a-doption>
          </template>
        </a-dropdown>

        <a-input-group>
          <a-select style="width: 150px" placeholder="请选择">
            <a-option v-for="item in fileTypeList" :key="item.value">
              <template #icon>
                <component :is="item.icon" size="18" color="#999"></component>
              </template>
              <template #default>{{ item.name }}</template>
            </a-option>
          </a-select>
          <a-input placeholder="请输入关键词..." allow-clear> </a-input>
          <a-button type="primary">
            <template #icon><a-icon-search /></template>
            <template #default>搜索</template>
          </a-button>
        </a-input-group>
      </a-space>

      <!-- 右侧区域 -->
      <a-space v-if="windowWidth > 715">
        <a-button
          v-if="isBatchMode"
          :disabled="!fileStore.selectedFileIdList.length"
          type="primary"
          status="danger"
          @click="handleMulDelete"
          ><template #icon><a-icon-delete /></template
        ></a-button>
        <a-button type="primary" @click="isBatchMode = !isBatchMode">
          <template #icon><a-icon-select-all /></template>
          <template #default>{{ isBatchMode ? "取消批量" : "批量操作" }}</template>
        </a-button>
        <a-button-group>
          <a-tooltip content="传输列表" position="bottom">
            <a-button @click="loading = !loading">
              <template #icon>
                <a-icon-swap />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="排序" position="bottom">
            <a-button>
              <template #icon>
                <a-icon-filter />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="视图" position="bottom">
            <a-button @click="fileStore.changeViewMode">
              <template #icon>
                <a-icon-apps v-if="fileStore.viewMode === 'grid'" />
                <a-icon-list v-else />
              </template>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </a-space>
    </a-row>

    <!-- 文件列表-宫格模式 -->
    <a-spin :loading="loading" class="file-wrap">
      <file-grid-comp
        v-show="fileList.length && fileStore.viewMode === 'grid'"
        :data="fileList"
        :is-batch-mode="isBatchMode"
        :selected-file-id-list="fileStore.selectedFileIdList"
        @click="handleClickFile"
        @check="handleCheckFile"
        @right-menu-click="handleRightMenuClick"></file-grid-comp>

      <!-- 文件列表-列表模式 -->
      <file-list-comp
        v-show="fileList.length && fileStore.viewMode === 'list'"
        :data="fileList"
        :is-batch-mode="isBatchMode"
        @click="handleClickFile"
        @right-menu-click="handleRightMenuClick"></file-list-comp>

      <a-empty v-show="!fileList.length"></a-empty>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Message, Modal } from "@arco-design/web-vue"
import { fileTypeList, imageTypeList } from "@/constant/file"
import { useFileStore } from "@/store/modules/file"
import { useWindowSize } from "@vueuse/core"
import { api as viewerApi } from "v-viewer"
import "viewerjs/dist/viewer.css"
import FileNavPath from "./file-nav-path.vue"
import FileGridComp from "./file-grid.vue"
import FileListComp from "./file-list.vue"
import ThePreviewVideo from "../../components/the-preview-video"
import ThePreviewAudio from "../../components/the-preview-audio"
import TheFileRename from "../../components/the-file-rename"
import TheFileMove from "../../components/the-file-move"
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router"
import { getFileList } from "@/api/file"
import type { ApiFileItem } from "@/api/file"
import GiSvgIcon from "@/components/gi/gi-svg-icon.vue"
const route = useRoute()
const router = useRouter()

const { width: windowWidth } = useWindowSize()
const fileStore = useFileStore()

const loading = ref(false)
// 文件列表数据
const fileList = ref<ApiFileItem[]>([])
const fileType = ref("0")
fileType.value = route.query.fileType?.toString() || "0"

const getListData = async () => {
  try {
    loading.value = true
    isBatchMode.value = false
    const res = await getFileList({ fileType: fileType.value })
    fileList.value = res.data.list
  } catch (error) {
    return error
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getListData()
})

onBeforeRouteUpdate(to => {
  if (!to.query.fileType) return
  fileType.value = to.query.fileType?.toString()
  getListData()
})

// 批量操作
const isBatchMode = ref(false)

// 点击文件
const handleClickFile = (item: ApiFileItem) => {
  Message.success(`点击了文件-${item.name}`)
  if (imageTypeList.includes(item.extendName)) {
    if (item.src) {
      const imgList: string[] = fileList.value.filter(i => imageTypeList.includes(i.extendName)).map(a => a.src || "")
      const index = imgList.findIndex(i => i === item.src)
      if (imgList.length) {
        viewerApi({
          options: {
            initialViewIndex: index
          },
          images: imgList
        })
      }
    }
  }
  if (item.extendName === "mp4") {
    ThePreviewVideo(item)
  }
  if (item.extendName === "mp3") {
    ThePreviewAudio(item)
  }
}

// 勾选文件
const handleCheckFile = (item: ApiFileItem) => {
  fileStore.addSelectedFileItem(item)
}
// 鼠标右键
const handleRightMenuClick = (mode: string, fileInfo: ApiFileItem) => {
  Message.success("点击了" + mode)
  if (mode === "delete") {
    Modal.warning({
      title: "提示",
      content: "是否删除该文件？",
      hideCancel: false
    })
  }
  if (mode === "rename") {
    TheFileRename(fileInfo)
  }
  if (mode === "move") {
    TheFileMove(fileInfo)
  }
  if (mode === "detail") {
    router.push({ path: "/file/detail" })
  }
}

// 批量删除
const handleMulDelete = () => {
  Modal.warning({
    title: "提示",
    content: "是否确认删除？",
    hideCancel: false
  })
}
</script>

<style lang="less" scoped>
.file-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 16px;
  overflow: hidden;
  background: var(--color-bg-1);
  border-radius: 4px;

  .row-operate {
    padding-bottom: 12px;
    margin: 0 16px;
    border-bottom: 1px dashed var(--color-border-3);
  }

  .file-wrap {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 16px 16px;
    overflow: hidden;
  }
}
</style>
