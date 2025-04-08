// import { App } from 'vue';
// import EnrollUser from './components/EnrollUser.vue';
// import './style.css';

// export function install(app: App) {
//   app.component('EnrollUser', EnrollUser);
// }

// export { EnrollUser };

import EnrollUser from "./components/EnrollUser.vue";
import CompareFaces from "./components/CompareFaces.vue";
import FaceRecognition from "./components/FaceRecognition.vue";
import LivenessCheck from "./components/LivenessCheck.vue";
import { TaniAuth } from "./components/controllers/TaniAuth";

export { EnrollUser };
export { CompareFaces };
export { FaceRecognition };
export { LivenessCheck };
export {TaniAuth};
