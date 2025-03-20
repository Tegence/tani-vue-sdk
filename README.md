# @tegence/tani-vue-sdk

A **Vue 3 TypeScript SDK** for **face enrollment, facial recognition, face comparison, and liveness check**.

## 📌 Installation

Install the SDK using **npm** or **yarn**:

```sh
npm install @tegence/tani-vue-sdk
# or
yarn add @tegence/tani-vue-sdk
```

## 🚀 Usage

### 1️⃣ Initialize the SDK

Before using the components, create an instance of `TaniAuth` with your **API key** and **Group ID**.

```ts
import { TaniAuth } from "@tegence/tani-vue-sdk";

const taniAuth = new TaniAuth("your-api-key", "your-group-id");
```

---

### 2️⃣ Enroll a User (Face Enrollment)

```vue
<script setup>
import { EnrollUser } from "@tegence/tani-vue-sdk";

const handleSuccess = (data) => {
  console.log("Enrollment successful", data);
};
</script>

<template>
  <EnrollUser :authInstance="taniAuth" @onSuccess="handleSuccess" />
</template>
```

✅ **Response:**

```json
{
  "message": "Person created successfully",
  "person_details": {
      "person_id": "ca18a8c6-00eb-4b8d-string",
      "client_id": "string",
      "group_id": "d2ea1214-22fd-4512-9844-string",
      "person_name": "john doe",
      "person_email": "johndoe@email.com"
  },
  "image_details": {
    "name": "john doe",
    "image_url": "image url",
    "person_id": "string"
  }
}
```

---

### 3️⃣ Face Recognition (Identify a Face)

```vue
<script setup>
import { FaceRecognition } from "@tegence/tani-vue-sdk";

const handleSuccess = (result) => {
  console.log("Face recognized:", result);
};
</script>

<template>
  <FaceRecognition :authInstance="taniAuth" @onSuccess="handleSuccess" />
</template>
```

✅ **Response Shape:**  

```json
{
  "message": "We found a match for the uploaded image",
  "similarity_score": 88.99883838838,
  "potential_match": "John Doe"
}
```

---

### 4️⃣ Face Comparison (Compare Two Faces)

```vue
<script setup>
import { CompareFaces } from "@tegence/tani-vue-sdk";

const imageUrl = "https://image.com";
const handleSuccess = (data) => {
  console.log("Faces match", data);
};
</script>

<template>
  <CompareFaces :authInstance="taniAuth" :imageUrl="imageUrl" @onSuccess="handleSuccess" />
</template>
```

✅ **Response Shape:**  

```json
{
  "message": "The images you uploaded are the same person",
  "similarity_score": 0.7556397799150376
}
```

---

### 5️⃣ Liveness Check (Verify If the Face Is Real)

```vue
<script setup>
import { LivenessCheck } from "@tegence/tani-vue-sdk";

const handleSuccess = (data) => {
  console.log("Liveness checked", data);
};
</script>

<template>
  <LivenessCheck @onSuccess="handleSuccess" />
</template>
```
✅ **Response Shape:**  

```json
{
  "blink_detected": false,
  "mouth_open_detected": false,
  "head_movement_detected": false,
  "is_live": false
}
```

---

## 📖 Additional Notes
- Ensure you have a valid **API key** and **Group ID** for authentication.
- The SDK is designed to be **Vue 3-compatible** and **framework-agnostic**.
- Components provide a **callback function (`@onSuccess`)** to handle responses.

---

### 📄 License
This project is licensed under the **MIT License**.


