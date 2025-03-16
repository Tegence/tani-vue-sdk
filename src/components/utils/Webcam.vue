<template>
    <div :class="['flex flex-col items-center gap-4', backgroundStyle || 'bg-white', 'p-16 pt-12 rounded-md']">
      <div>
        <h5 class="font-semibold">Capture Image</h5>
        <p class="text-sm text-gray-500">
          Click to open the camera module and allow the browser to access your camera.
        </p>
      </div>
      <template v-if="!imageSrc">
        <div v-if="displayCamera">
          <div class="relative flex flex-col justify-center">
            <video ref="video" autoplay width="400" height="400"></video>
            <div class="flex items-center space-x-2">
                <button @click="captureImage" class="mt-5 py-1 text-white bg-[#4327B2] border-[#4327B2] border-[1px] flex items-center justify-center px-5 rounded-md cursor-pointer">
                    <CameraIcon class="mr-2" size="15" /> Capture Photo
                </button>
              <button @click="closeCamera" class="mt-5 text-[#4327B2] border-[#4327B2] border-[1px] px-4 py-1 rounded-md cursor-pointer">
                Close Camera
              </button>
            </div>
          </div>
        </div>
        <div v-else @click="openFileDialog" class="relative mt-5 flex w-full min-h-[300px] flex-col items-center justify-center rounded-md border border-gray-300 bg-white p-8">
          <CameraIcon size="70" class="text-gray-500" />
          <div class="mt-3 text-center">
            <p class="text-gray-700">
              <span class="text-primary cursor-pointer font-semibold">Click to capture</span> or drag and drop
            </p>
            <p class="text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
          <div class="mt-5 flex w-full flex-col items-center gap-2 md:flex-row">
            <button @click.stop="openCamera" class="flex-grow basis-10 md:basis-10 text-[#4327B2] border-[#4327B2] border-[1px] px-4 py-1 rounded-md cursor-pointer">
              Open Camera
            </button>
            <div class="flex-grow basis-10 md:basis-10">
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileInputChange" class="hidden" />
              <label @click.stop="openFileDialog" class="bg-[#B9AEE7] text-primary flex w-full cursor-pointer items-center justify-center rounded-md p-2 font-medium">
                <CloudUploadIcon size="15" class="text-primary mr-2" />
                <span class="text-sm"> Upload Image</span>
              </label>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="relative mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-md bg-white p-5">
          <img :src="imageSrc" alt="Selected Image" width="300" height="300" class="selected-image" />
          <div class="flex w-full justify-start">
            <button @click="imageSrc = null" class="mt-5 text-[#4327B2] border-[#4327B2] border-[1px] px-4 py-1 rounded-md cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent, onBeforeUnmount } from 'vue';
  import { Camera as CameraIcon, CloudUpload as CloudUploadIcon } from 'lucide-vue-next';
  import { convertBase64StringToFile, handleImageCompression } from '../lib/helpers';
  
  export default defineComponent({
    components: { CameraIcon, CloudUploadIcon },
    props: {
      setImageFile: Function,
      setImageSrc: Function,
      imageSrc: String,
      backgroundStyle: String,
    },
    setup(props, {expose}) {
        const video = ref(null);
        const displayCamera = ref(false);
        const fileInput = ref(null);
        const imageSrc = ref(props.imageSrc);
        let stream = null;
  
        const openCamera = async () => {
            try {
                displayCamera.value = true; // Show the camera UI when clicking Open Camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (video.value) {
                    video.value.srcObject = stream;
                    console.log("Camera opened successfully.");
                } else {
                    console.error("Video element is not found.");
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };
  
        const captureImage = () => {
            if (!video.value || !video.value.videoWidth || !video.value.videoHeight) {
                console.error("Video is not ready yet.");
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = video.value.videoWidth;
            canvas.height = video.value.videoHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error("Canvas context is not available.");
                return;
            }

            ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');
            imageSrc.value = imageData;  // Update local `imageSrc` reference
            props.setImageSrc(imageData); // Update parent component
            props.setImageFile(convertBase64StringToFile(imageData, `captured-${Date.now()}.jpg`));

            console.log("Image captured successfully.");
        };

  
        const closeCamera = () => {
          displayCamera.value = false;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          imageSrc.value = null
          props.setImageSrc(null);
          console.log("Camera closed.");
        };
  
        const openFileDialog = (event) => {
            event.stopPropagation(); // Prevents click event from bubbling
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

  
        const handleFileInputChange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            try {
                const compressedFile = await handleImageCompression(file);
                const convertedFile = new File([compressedFile], file.name, { type: file.type });

                const imageUrl = URL.createObjectURL(convertedFile);
                imageSrc.value = imageUrl; // Update local state
                props.setImageFile(convertedFile);
                props.setImageSrc(imageUrl); // Update parent component

                console.log("File uploaded successfully:", convertedFile);
            } catch (error) {
                console.error("Error processing file upload:", error);
            }
        };
  
      onBeforeUnmount(() => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      });

      expose({ closeCamera });
  
      return { displayCamera, video, captureImage, openCamera, closeCamera, openFileDialog, handleFileInputChange, fileInput, imageSrc };
    },
  });
  </script>
  
  
  