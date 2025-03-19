<template>
  <div class="absolute inset-0 backdrop-blur-2xl flex justify-center items-center">
    <div class="backdrop-blur-sm p-6 shadow flex flex-col">
      <X @click="$emit('close')" class="text-black text-xl mb-4 self-end cursor-pointer" />
      <div class="bg-white shadow-md p-4 rounded-md mx-auto w-fit lg:w-1/2 h-fit">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { X } from "lucide-vue-next";

export default defineComponent({
  components: { X },
  emits: ['close'], 
});
</script>


  