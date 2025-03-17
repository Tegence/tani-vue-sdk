<script setup lang="ts">
import { ref, reactive } from "vue";
import Webcam from "./utils/Webcam.vue";
import Dialog from "./utils/Dialog.vue";
import axios from "./api/useAxios";
import { FaceRecognitionResult } from "../types/FaceRecognitionResult";
import { AxiosError } from "axios";
import { TaniAuthTypes } from "../types/TaniAuthTypes";

const props = defineProps<TaniAuthTypes>();

const imageSrc = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const webCamRef = ref<any>(null);
const isLoading = ref<boolean>(false);
const verifyFaceResult = ref<FaceRecognitionResult | null>(null);
const error = ref<string | null>(null);
const openDialog = ref<boolean>(false);

const identifyUserFace = async () => {
  isLoading.value = true;
  openDialog.value = true;

  try {
    if (imageFile.value) {
      const formData = new FormData();
      formData.append("image", imageFile.value);

      const response = await axios.post("/persons/authenticate", formData, {
        headers: props.authInstance.getHeaders(),
      });

      isLoading.value = false;
      verifyFaceResult.value = response.data;
      props.onSuccess(response.data);
      openDialog.value = true;
    }
  } catch (err) {
    isLoading.value = false;
    const axiosError = err as AxiosError<{ detail?: string }>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 400) error.value = "No Faces Detected. Try again.";
      if (status === 404) error.value = "No match found for the uploaded image.";
      if (status === 401) error.value = "API key/Group Id is missing.";
      if (status === 500) error.value = "Internal server error.";
    }

    openDialog.value = true;
  }
};

const closeDialog = () => {
    openDialog.value = false;
    closeCamera();
};

const closeCamera = () => {

    if (!webCamRef.value) {
    console.warn("webCamRef is not set yet.");
    return;
    }

    if (typeof webCamRef.value.closeCamera !== "function") {
    console.error("closeCamera method does not exist on webCamRef.");
    return;
    }

    webCamRef.value.closeCamera();
    imageSrc.value = null;
    verifyFaceResult.value = null;
    isLoading.value = false;
    error.value = null;
};
</script>

<template>
  <main class="flex w-full flex-col bg-gray-100 p-8 relative">
    <h1 class="font-bold text-4xl text-center">Face Search</h1>
    <div class="w-fit mx-auto mt-6">
      <Webcam
        ref="webCamRef"
        :setImageFile="(file: File) => (imageFile = file)"
        :setImageSrc="(src: string) => (imageSrc = src)"
        :imageSrc="imageSrc"
      />
    </div>

    <div v-if="imageSrc" class="flex justify-end">
      <button
        class="mt-5 py-3 text-white bg-[#4327B2] border-[#4327B2] border-[1px] px-5 rounded-md cursor-pointer"
        @click="identifyUserFace"
      >
        Verify Photo
      </button>
    </div>

    <Dialog v-if="openDialog" @close="closeDialog">
      <div class="flex justify-center">
        <div v-if="imageSrc" class="relative h-fit w-2/3 rounded-md bg-white shadow-md mb-3">
          <img :src="imageSrc" alt="Selected Image" class="rounded-md mx-auto" />
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center">
        <div class="border-t-[#4327B2] h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
        <h4 class="mt-3 text-xl font-bold">Verifying Image</h4>
      </div>

      <div v-if="verifyFaceResult" class="mt-5 text-center">
        <h4 class="mb-2">We have your result!</h4>
        <p>{{ verifyFaceResult.message }}</p>
        <p v-if="verifyFaceResult.potential_match">
          Based on our records, there's a
          <strong>{{ (verifyFaceResult.similarity_score).toFixed(2) }}%</strong> probability that
          you're <strong>{{ verifyFaceResult.potential_match }}</strong>
        </p>
      </div>

      <div v-if="error" class="flex flex-col items-center justify-center">
        <h4 class="mt-3 text-xl font-bold w-1/2">{{ error }}</h4>
      </div>
    </Dialog>
  </main>
</template>

<style>
@import '../style.css';
</style>
