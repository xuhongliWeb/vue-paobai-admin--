<template>
  <div class="app-sidebar" :class="{ 'menu-collapse': collapse }">
    <div class="logo-wrapper">
      <img class="logo logo-big" src="/images/logo/logo-with-text-small.png" />
      <img class="logo logo-small" src="/images/logo/logo.png" />
    </div>
    <menu-main v-if="sidebarMenuShow"></menu-main>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import menuMain from "./menu-main.vue"
import { useAppHook } from "@/hooks/app"
export default defineComponent({
  components: {
    menuMain
  },
  setup() {
    let { collapse, sidebarMenuShow } = useAppHook()
    return {
      collapse,
      sidebarMenuShow
    }
  }
})
</script>

<style lang="less" scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;

  .logo-wrapper {
    display: none;
    width: 100%;
    height: @app-navbar-height;
    line-height: @app-navbar-height;
    text-align: center;

    .logo {
      vertical-align: middle;
    }

    .logo-big {
      width: 130px;
    }

    .logo-small {
      display: none;
      width: 40px;
    }
  }

  &.menu-collapse {
    .logo-wrapper {
      .logo-big {
        display: none;
      }

      .logo-small {
        display: unset;
      }
    }
  }

  .menu-wrapper {
    flex: 1;
    height: 0;
  }
}
</style>
