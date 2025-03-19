<template>
    <div class="mx-auto max-w-xl p-8">
      <h5>{{ title || 'Record Video' }}</h5>
      <p class="text-sm text-gray-500">
        Click to open the camera module and allow the browser to access your camera.
      </p>
  
      <div v-if="displayCamera" class="mt-5">
        <div class="relative flex items-center justify-center" id="container">
            <div class="h-full w-full flex justify-center items-center relative">
                <div 
                    :class="[
                        'relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full border-8 border-[#D3D3D3]',
                        progressValue
                    ]"
                >
                    <video
                        ref="videoRef"
                        autoplay
                        playsinline
                        class="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
        </div>
        <p class="my-4 text-center text-lg text-gray-700">{{ instructions }}</p>
        <button
          class="mx-auto block py-2 text-white bg-[#4327B2] border-[#4327B2] border-[1px] px-5 rounded-md cursor-pointer"
          @click="closeCamera"
        >
          Close Liveness
        </button>
      </div>
      
      <div v-else class="relative mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-md border border-gray-300 bg-white p-8">
        <SquarePlay :size="70" class="text-gray-500" />
        <div class="mt-3 text-center">
          <p class="text-gray-700">
            <span class="text-[#4327B2] cursor-pointer font-semibold">Click on open camera to start recording</span>
          </p>
        </div>
        <div class="mt-5 flex w-full flex-col items-center gap-2 md:flex-row">
          <button
            @click="openCamera"
            class="flex-grow basis-10 md:basis-10 hover:bg-[#B9AEE7] text-[#4327B2] border-[#4327B2] border-[1px] px-4 py-2 rounded-md cursor-pointer"
          >
            Open Camera
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, watch, computed, onUnmounted, nextTick, defineAsyncComponent } from 'vue';
    import { SquarePlay } from "lucide-vue-next";

    const props = defineProps<{ 
      title?: string;
      setMessage: (msg: string) => void;
      setError?: (error: string) => void;
      setOpenDialog: (open: boolean) => void;
      setResult: (result: any) => void;
      onSuccess: (result: any) => void;
    }>();


    const displayCamera = ref(false);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const socketRef = ref<WebSocket | null>(null);
    const instructions = ref('Waiting for instructions...');

    const progressValue = computed(() => {
    switch (instructions.value) {
        case 'Please open your mouth': return 'border-t-[#4327B2]';
        case 'Please move your head': return 'border-l-[#4327B2]';
        case 'Liveness detection completed!': return 'border-[#4327B2]';
        default: return 0;
    }
    });

    const openCamera = () => {
    displayCamera.value = true;
    };

    const closeCamera = () => {
    displayCamera.value = false;
    };

    // ✅ Handle WebSocket Connection
    const setupWebSocket = () => {
      if (socketRef.value) {
          socketRef.value.close();
      }

      socketRef.value = new WebSocket(
          'wss://tani-face-model-77573755128.us-central1.run.app/real-time-liveliness-detection'
      );

      socketRef.value.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.instruction) instructions.value = message.instruction;
        if (message.results) {
        instructions.value = 'Liveness detection completed!';
        props.setResult(message.results);
        props.onSuccess(message.results);
        socketRef.value?.close();
        props.setOpenDialog(true);
        props.setMessage('Liveness detection completed!');
        displayCamera.value = false;
        }
        if (message.error) props.setError?.(message.error);
      };

      socketRef.value.onerror = console.error;
    };

    // ✅ Handle Webcam
    const setupWebcam = async () => {
      await nextTick(); // Ensure DOM updates before accessing videoRef

      const video = videoRef.value;
      if (!video) return;

      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            sendFrame();
        };
        })
        .catch((err) => {
        console.error('Error accessing webcam:', err);
        alert('Please allow access to your webcam.');
        });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      const waitForWebSocket = (callback: () => void) => {
        if (socketRef.value?.readyState === WebSocket.OPEN) {
          callback();
        } else {
          setTimeout(() => waitForWebSocket(callback), 100); // Retry in 100ms
        }
      };

      const sendFrame = () => {
        if (!videoRef.value?.videoWidth || !videoRef.value?.videoHeight) return;
        
        canvas.width = videoRef.value.videoWidth;
        canvas.height = videoRef.value.videoHeight;
        context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);

        const frame = canvas.toDataURL('image/jpeg');
        if (frame === 'data:,') return;

        waitForWebSocket(() => {
          socketRef.value?.send(JSON.stringify({ frame }));
          setTimeout(sendFrame, 200); // Continue sending every 200ms
        });
      };
    };

    // ✅ Watch displayCamera state
    watch(displayCamera, async (newVal) => {
      if (newVal) {
          setupWebSocket();
          await setupWebcam(); 
      } else {
          cleanupCamera();
      }
    });

    // ✅ Cleanup function
    const cleanupCamera = () => {
      if (videoRef.value?.srcObject) {
          (videoRef.value.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
      if (socketRef.value) {
          socketRef.value.close();
      }
    };

    onUnmounted(() => {
      cleanupCamera();
    });
  </script>
  
  <style scoped>
  </style>
  