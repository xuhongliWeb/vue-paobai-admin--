import type { PropType as VuePropType, App } from "vue"

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }
  interface Window {
    // Global vue app instance
    __APP__: App<Element>
    webkitCancelAnimationFrame: (handle: number) => void
    mozCancelAnimationFrame: (handle: number) => void
    oCancelAnimationFrame: (handle: number) => void
    msCancelAnimationFrame: (handle: number) => void

    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number
  }

  // vue
  type PropType<T> = VuePropType<T>

  type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  type Indexable<T = any> = {
    [key: string]: T
  }
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>

  interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  interface ViteEnv {
    VITE_BUILD_VIS: boolean
    VITE_HOST: string
    VITE_PORT: number
    VITE_USE_MOCK: boolean
    VITE_USE_PWA: boolean
    VITE_PUBLIC_PATH: string
    VITE_PROXY: [string, string][]
    VITE_APP_VERSION: string
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_USE_CDN: boolean
    VITE_DROP_CONSOLE: boolean
    VITE_BUILD_COMPRESS: "gzip" | "brotli" | "none"
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_LEGACY: boolean
    VITE_USE_IMAGEMIN: boolean
    VITE_GENERATE_UI: string
    VITE_API_BASE_URL: string
  }

  interface ServerConfigs {
    Version?: string
    Title?: string
    FixedHeader?: boolean
    HiddenSideBar?: boolean
    KeepAlive?: boolean
    Locale?: string
    Layout?: string
    MapConfigure?: {
      amapKey?: string
      baiduKey?: string
      options: {
        resizeEnable?: boolean
        center?: number[]
        zoom?: number
      }
    }
  }

  function parseInt(s: string | number, radix?: number): number

  function parseFloat(string: string | number): number

  interface Date {
    format(fmt?: string): string
  }
  interface String {
    format(args: string | string[]): String
  }
}

export interface AnyObject {
  [key: string]: unknown
}

export interface GeneralChart {
  xAxis: string[]
  data: Array<{ name: string; value: number[] }>
}