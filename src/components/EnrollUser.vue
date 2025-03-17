<template>
  <div class="mx-auto mt-10 w-fit rounded-md bg-white p-5 relative">
    <div class="mb-3 border-b border-gray-300 py-3 text-gray-700">
      <h4 class="font-bold">Create a new user</h4>
    </div>
    <div class="my-4 flex flex-col gap-2">
      <label class="text-sm font-semibold" for="Name">Name</label>
      <input
        type="text"
        placeholder="Enter Your Customer's Name"
        class="rounded border p-2"
        ref="inputRef"
        v-model="inputName"
      />
    </div>
    <WebCamComponent 
      ref="webCamRef"
      :setImageFile="setImageFile"
      :setImageSrc="setImageSrc"
      :imageSrc="imageSrc"
    />
    <div v-if="imageSrc" class="flex justify-end">
      <button
        class="mt-5 py-3 text-white bg-[#4327B2] border-[#4327B2] border-[1px] px-5 rounded-md cursor-pointer"
        @click="createPersonWithImage"
      >
        Upload Photo
      </button>
    </div>
    <Dialog v-if="openDialog" @close="closeDialog">
      <div class="flex justify-center">
        <div v-if="imageSrc" class="relative h-fit w-2/3 rounded-md bg-white shadow-md mb-3">
          <img :src="imageSrc" alt="Selected Image" class="rounded-md" style="object-fit: scale-down;" />
        </div>
      </div>
      <div v-if="isLoading" class="flex flex-col items-center justify-center">
        <div class="border-t-[#4327B2] h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
        <h4 class="mt-3 text-xl font-bold">Uploading Image</h4>
      </div>
      <div v-if="uploadCompleted && !isLoading" class="flex flex-col items-center justify-center">
        <h4 class="mt-3 text-xl font-bold">Person added successfully</h4>
      </div>
      <div v-if="uploadError && !isLoading" class="flex flex-col items-center justify-center">
        <h4 class="mt-3 text-xl font-bold">Unable To Add Person</h4>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import WebCamComponent from './utils/Webcam.vue';
import Dialog from './utils/Dialog.vue';
import axios from './api/useAxios';
//import { TaniAuthTypes } from "../types/TaniAuthTypes";

export default {
  components: {
    WebCamComponent,
    Dialog
  },
  props: {
    authInstance: Object,
    onSuccess: Function
  },
  setup(props) {
    const inputRef = ref(null);
    const webCamRef = ref(null);
    const inputName = ref('');
    const imageSrc = ref(null);
    const imageFile = ref(null);
    const isLoading = ref(false);
    const uploadCompleted = ref(false);
    const uploadError = ref(false);
    const openDialog = ref(false);

    const setImageFile = (file) => {
      imageFile.value = file;
    };

    const setImageSrc = (src) => {
      imageSrc.value = src;
    };

    const createPersonWithImage = async () => {
      isLoading.value = true;
      openDialog.value = true;
      try {
        if (imageFile.value && inputName.value) {
          const formData = new FormData();
          formData.append('person_name', inputName.value);
          const group_id = props.authInstance.getGroupId();
          if (group_id) {
            formData.append('group_id', group_id);
          }
          formData.append('image', imageFile.value);

          const response = await axios.post('/persons/create-with-image', formData, {
            headers: props.authInstance.getHeaders(),
          });

          isLoading.value = false;
          uploadCompleted.value = true;
          props.onSuccess(response.data);
        }
      } catch (error) {
        console.error(error);
        isLoading.value = false;
        uploadError.value = true;
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
      uploadCompleted.value = false;
      isLoading.value = false;
      uploadError.value = false;
    };

    onMounted(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });

    return {
      inputRef,
      webCamRef,
      inputName,
      imageSrc,
      imageFile,
      isLoading,
      uploadCompleted,
      uploadError,
      openDialog,
      setImageFile,
      setImageSrc,
      createPersonWithImage,
      closeDialog,
    };
  }
};
</script>

<style>
@import '../style.css';
</style>


