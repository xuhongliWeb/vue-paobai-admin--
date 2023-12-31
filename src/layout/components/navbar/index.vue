<template>
  <div class="app-navbar">
    <div class="left-wrapper">
      <div class="logo-wrapper">
        <img class="logo" src="/images/logo/logo-with-text-small.png" />
      </div>
      <menu-main v-if="navbarMenuShow"></menu-main>
    </div>
    <div class="right-wrapper">
      <ul class="right-side">
        <li>
          <a-tooltip content="搜索">
            <a-button class="nav-btn" type="outline" :shape="'circle'" @click="showAppSearch">
              <template #icon>
                <a-icon-search />
              </template>
            </a-button>
          </a-tooltip>
        </li>
        <li>
          <a-tooltip content="消息通知">
            <div class="message-box-trigger">
              <a-badge :count="9" dot>
                <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                  <a-icon-notification />
                </a-button>
              </a-badge>
            </div>
          </a-tooltip>
          <a-popover
            trigger="click"
            :arrow-style="{ display: 'none' }"
            :content-style="{ padding: 0, minWidth: '400px' }"
            content-class="message-popover">
            <div ref="refBtn" class="ref-btn"></div>
            <template #content>
              <message-box />
            </template>
          </a-popover>
        </li>
      </ul>
      <a-avatar>
        <img class="avatar" alt="avatar" :src="userInfo.avatar" />
      </a-avatar>
      <div class="username">{{ userInfo.realName }}</div>
      <a-dropdown @popup-visible-change="getDropDownState" @select="tagSelect">
        <a-button type="primary" class="arco-btn-only-icon">
          <template #icon>
            <a-icon-down v-if="!dropDownState" />
            <a-icon-up v-else /> </template
        ></a-button>
        <template #content>
          <a-doption value="logout">登出</a-doption>
          <a-doption>修改密码</a-doption>
          <a-doption>个人信息</a-doption>
        </template>
      </a-dropdown>
    </div>
    <app-search ref="appSearch"></app-search>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import type { Ref } from "vue"
import { useUserHook } from "@/hooks/user"
import { useAppHook } from "@/hooks/app"
import ArcoModal from "@arco-design/web-vue/es/modal"
import menuMain from "./menu-main.vue"
import messageBox from "./message-box/index.vue"
import appSearch from "@/components/search/index.vue"
export default defineComponent({
  components: {
    menuMain,
    messageBox,
    appSearch
  },
  setup() {
    let { navbarMenuShow } = useAppHook()
    let { logoutEvent, userInfo } = useUserHook()
    let dropDownState = ref(false)
    const getDropDownState = function (status: boolean) {
      dropDownState.value = status
    }
    const logOutHand = function () {
      ArcoModal.warning({
        title: "确认登出",
        content: "是否确认登出？",
        cancelText: "取消",
        closable: true,
        hideCancel: false,
        onOk: () => {
          logoutEvent()
        }
      })
    }
    const tagSelect = function (tagValue: string) {
      if (tagValue === "logout") {
        logOutHand()
      }
    }
    const refBtn = ref()
    const setPopoverVisible = () => {
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
      })
      refBtn.value.dispatchEvent(event)
    }
    const appSearch: Ref<ElRef> = ref(null)
    const showAppSearch = () => {
      ;(appSearch as any).value.showSearch()
    }
    return {
      getDropDownState,
      dropDownState,
      tagSelect,
      userInfo,
      setPopoverVisible,
      refBtn,
      navbarMenuShow,
      appSearch,
      showAppSearch
    }
  }
})
</script>

<style lang="less" scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;

  .left-wrapper {
    display: flex;
    flex: auto;
    flex-wrap: nowrap;
    align-items: center;
    width: 0;

    .logo-wrapper {
      width: @app-sidebar-width;
      height: 100%;
      line-height: @app-navbar-height;
      text-align: center;
      white-space: pre;

      .logo {
        width: 130px;
        vertical-align: middle;
      }
    }
  }

  .right-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    padding-right: 18px;

    .username {
      padding: 0 10px;
      font-size: 14px;
      line-height: 19px;
      color: var(--color-white);
    }

    .avatar {
    }

    .right-side {
      display: flex;
      padding-right: 20px;
      list-style: none;

      :deep(.locale-select) {
        border-radius: 20px;
      }

      li {
        display: flex;
        align-items: center;
        padding: 0 10px;
      }

      .nav-btn {
        font-size: 16px;
        color: var(--color-white);
        border-color: var(--color-white);
      }

      .trigger-btn,
      .ref-btn {
        position: absolute;
        bottom: 14px;
      }

      .trigger-btn {
        margin-left: 14px;
      }
    }
  }
}
</style>
