/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'js-beautify' {
  // beautify_js:any
  const beautify_js:(a:any) => any
  export default beautify_js
}
// declare var beautify_js:any
// declare var ace:any
interface Window {
  ace: any,
  aceError: any
  [property: string]: any
}
declare const windos: Window & typeof globalThis