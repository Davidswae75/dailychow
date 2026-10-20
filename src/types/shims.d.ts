// v-lazy-image ships without type declarations
declare module "v-lazy-image" {
  import type { DefineComponent } from "vue";
  const VLazyImage: DefineComponent<{ src: string; srcPlaceholder?: string; srcset?: string; intersectionOptions?: object; usePicture?: boolean }>;
  export default VLazyImage;
}
