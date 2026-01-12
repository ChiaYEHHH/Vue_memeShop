import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 引入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入 Bootstrap JS (可選，如果需要互動功能)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

dayjs.extend(utc);
dayjs.extend(timezone);
// 設定預設時區
dayjs.tz.setDefault('Asia/Taipei'); // 台北時區
// const now = dayjs().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
app.use(createPinia())
app.use(router)

app.mount('#app')
