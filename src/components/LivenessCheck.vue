<script setup>
import { ref } from 'vue';
import VidWebCam from './utils/VidWebcam.vue';
import Dialog from './utils/Dialog.vue';
import { Check } from "lucide-vue-next";
import '../style.css';

const props = defineProps({
  onSuccess: Function,
});

const message = ref(null);
const error = ref(null);
const result = ref(null);
const openDialog = ref(false);
const closeDialog = () => {
    openDialog.value = false;
};
</script>

<template>
  <main class="flex w-full flex-col p-8 relative">
    <h1 class="font-bold text-4xl text-center">Liveness Check</h1>
    <div class="flex-1">
      <VidWebCam
        title="Start liveness check"
        :setMessage="(msg) => (message = msg)"
        :setError="(err) => (error = err)"
        :setOpenDialog="(status) => (openDialog = status)"
        :setResult="(res) => (result = res)"
        :onSuccess="props.onSuccess"
      />
    </div>
    <Dialog v-if="openDialog" @close="closeDialog">
      <div class="flex justify-center p-6">
        <div v-if="message" class="relative flex h-52 w-full px-6 flex-col items-center justify-center rounded-md bg-white">
          <h5 class="mb-2 text-center">{{ message }}</h5>
          <div>
            <div class="flex items-center gap-1">
              <span>
                <Check 
                  :stroke-width="3" 
                  :size="18" 
                  :class="['font-bold', result?.blink_detected ? 'text-[#64C155]' : 'text-[#F2F4F7]']" 
                />
              </span>
              <span> Eyes Blink </span>
            </div>
            <div class="flex items-center gap-1">
              <span>
                <Check 
                  :stroke-width="3" 
                  :size="18" 
                  :class="['font-bold', result?.mouth_open_detected ? 'text-[#64C155]' : 'text-[#F2F4F7]']" 
                />
              </span>
              <span> Mouth Open </span>
            </div>
            <div class="flex items-center gap-1">
              <span>
                <Check 
                  :stroke-width="3" 
                  :size="18" 
                  :class="['font-bold', result?.head_movement_detected ? 'text-[#64C155]' : 'text-[#F2F4F7]']" 
                />
              </span>
              <span> Head Movement </span>
            </div>
            <div class="flex items-center gap-1">
              <span>
                <Check 
                  :stroke-width="3" 
                  :size="18" 
                  :class="['font-bold', result?.is_live ? 'text-[#64C155]' : 'text-[#F2F4F7]']" 
                />
              </span>
              <span> Live </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="error" class="text-center">
        <h5>{{ error }}</h5>
      </div>
    </Dialog>
  </main>
</template>
