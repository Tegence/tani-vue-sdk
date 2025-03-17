<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import WebCamComponent from './utils/Webcam.vue';
import Dialog from './utils/Dialog.vue';
import axios from './api/useAxios';
import { fetchAndProcessImage } from './lib/helpers';

const props = defineProps({
  authInstance: Object,
  onSuccess: Function,
  imageUrl: String
});

const selectedFile = ref(null);
const imageFile = ref(null);
const capturedImage = ref(null);
const capturedImage2 = ref(null);
const isLoading = ref(false);
const facesSimilarity = ref(null);
const openDialog = ref(false);
const comparedImages = ref(null);
const error = ref(null);
const webCamRef = ref(null);

const compareImages = async () => {
  isLoading.value = true;
  openDialog.value = true;

  try {
    if (imageFile.value && selectedFile.value) {
      isLoading.value = true;
      comparedImages.value = [capturedImage.value ?? '', capturedImage2.value ?? ''];
      const formData = new FormData();
      formData.append('image1', selectedFile.value);
      formData.append('image2', imageFile.value);

      const response = await axios.post('/persons/compare', formData, {
        headers: props.authInstance.getHeaders(),
      });

      isLoading.value = false;
      facesSimilarity.value = response.data;
      props.onSuccess(response.data);
      openDialog.value = true;
    }
  } catch (err) {
    isLoading.value = false;
    const axiosError = err.response;

    if (axiosError) {
      if (axiosError.status === 400) {
        error.value = "No Faces Detected in one or both images. Kindly take a clearer picture and try again";
      } else if (axiosError.status === 401) {
        error.value = "API key/Group Id is missing";
      } else if (axiosError.status === 500) {
        error.value = "Internal server error";
      }
    }
  }
};

const closeDialog = () => {
    openDialog.value = false;
    closeCamera();
}

const closeCamera = () => {
  capturedImage2.value = null;
  facesSimilarity.value = null;
  isLoading.value = false;
  error.value = null;
  webCamRef.value?.closeCamera();
};

watchEffect(async () => {
  if (!props.imageUrl) return;
  try {
    const file = await fetchAndProcessImage(props.imageUrl, `image-${Date.now()}.jpg`);
    if (file) {
      const url = URL.createObjectURL(file);
      imageFile.value = file;
      capturedImage.value = url;
    }
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="mt-3 w-full rounded-md bg-white p-4 relative">
    <h1 class="font-bold text-4xl text-center">Compare Faces</h1>
    <div class="w-fit mx-auto">
      <WebCamComponent
        ref="webCamRef"
        :setImageFile="file => (selectedFile = file)"
        :setImageSrc="src => (capturedImage2 = src)"
        :imageSrc="capturedImage2"
      />
    </div>
    <div v-if="capturedImage2" class="flex justify-end">
      <button class="py-3 mt-5 text-white bg-[#4327B2] border-[#4327B2] border-[1px] px-5 rounded-md cursor-pointer" @click="compareImages">
        Compare Faces
      </button>
    </div>

    <Dialog v-if="openDialog" @close="closeDialog">
      <div class="flex flex-col justify-center">
        <div class="flex space-x-3">
          <div v-for="(image, index) in comparedImages" :key="index" class="relative h-fit w-1/2 rounded-md bg-white shadow-md mb-3">
            <img :src="image" alt="Selected Image" class="selected-image rounded-md mx-auto" style="object-fit: scale-down;" />
          </div>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center">
          <div class="border-t-[#4327B2] h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
          <h4 class="mt-3 text-xl font-bold">Comparing Images</h4>
        </div>

        <div v-if="error" class="text-center flex justify-center items-center">
          <h5 class="w-1/2">{{ error }}</h5>
        </div>

        <div v-if="facesSimilarity" class="mt-5 text-center">
          <p class="text-lg font-semibold text-gray-600">Confidence Percentage</p>
          <h2 class="font-bold">{{ (facesSimilarity.similarity_score * 100).toFixed(2) }}%</h2>
          <p class="text-gray-500">{{ facesSimilarity.message }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>
