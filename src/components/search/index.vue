<template>
  <Teleport to="body">
    <transition name="zoom-fade" mode="out-in">
      <div v-if="visible" class="app-search-modal">
        <div v-click-outside="handleClose" class="app-search-modal-content">
          <div class="app-search-modal-input__wrapper">
            <a-input
              ref="inputRef"
              class="app-search-modal-input"
              placeholder="请输入关键字"
              allow-clear
              @input="handleSearch">
              <template #prefix>
                <a-icon-search />
              </template>
            </a-input>
          </div>

          <div v-if="getIsNotData" class="app-search-modal-not-data">暂无搜索结果</div>
          <ul v-else ref="scrollWrap" class="app-search-modal-list">
            <li
              v-for="(item, index) in searchResult"
              :ref="setRefs(index)"
              :key="item.path"
              :data-index="index"
              :class="[
                'app-search-modal-list__item',
                {
                  [`app-search-modal-list__item--active`]: activeIndex === index
                }
              ]"
              @mouseenter="handleMouseenter"
              @click="handleEnter">
              <div class="app-search-modal-list__item-icon">
                <a-icon-list size="22" />
              </div>
              <div class="app-search-modal-list__item-text">
                {{ item.title }}
              </div>
              <div class="app-search-modal-list__item-enter">
                <a-icon-import size="22" />
              </div>
            </li>
          </ul>
          <!--          <AppSearchFooter />-->
          <search-footer></search-footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, unref, ref, watch, nextTick } from "vue"
import type { Ref } from "vue"
import { useMenuSearch } from "./useMenuSearch"
import { useRefs } from "@/hooks/core"
import SearchFooter from "./search-footer.vue"

let visible = ref(false)

const scrollWrap: Ref<ElRef> = ref(null)
const inputRef = ref<Nullable<HTMLElement>>(null)

const [refs, setRefs] = useRefs()

watch(
  () => visible.value,
  visible => {
    visible &&
      nextTick(() => {
        unref(inputRef)?.focus()
      })
  }
)

const { handleSearch, searchResult, keyword, activeIndex, handleMouseenter, handleEnter, showSearch, handleClose } =
  useMenuSearch(refs, scrollWrap, visible)

defineExpose({ showSearch })

const getIsNotData = computed(() => !keyword || unref(searchResult).length === 0)
</script>
<style scoped lang="less">
.app-search-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 800;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: @app-navbar-height;
  background-color: rgb(0 0 0 / 25%);

  &-content {
    position: relative;
    flex-direction: column;
    width: 632px;
    margin: 0 auto auto;
    background-color: var(--color-bg-1);
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
  }

  &-input__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 14px 0;
  }

  &-input {
    width: 100%;
    height: 48px;
    font-size: 1.5em;
    border-radius: 6px;

    span[role="img"] {
      color: #999;
    }
  }

  &-cancel {
    display: none;
    font-size: 1em;
    color: #666;
  }

  &-not-data {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    color: rgb(150, 159, 175);
  }

  &-list {
    max-height: 472px;
    padding: 0 14px;
    padding-bottom: 20px;
    margin: 0 auto;
    margin-top: 14px;
    overflow: auto;

    &__item {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 56px;
      padding-bottom: 4px;
      padding-left: 14px;
      margin-top: 8px;
      font-size: 14px;
      color: @normal-text-color;
      cursor: pointer;
      background-color: var(--color-bg-1);
      border-radius: 4px;
      box-shadow: 0 1px 3px 0 #d4d9e1;

      > div:first-child,
      > div:last-child {
        display: flex;
        align-items: center;
      }

      &-enter {
        width: 40px;
        opacity: 0;
      }

      &--active {
        color: #fff;
        background-color: @primary-color;

        .app-search-modal-list__item-enter {
          opacity: 1;
        }
      }

      &-icon {
        width: 40px;
      }

      &-text {
        flex: 1;
        font-size: 16px;
      }
    }
  }
}
</style>
