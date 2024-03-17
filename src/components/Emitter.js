import { createApp } from 'vue';

const app = createApp({});

// Custom $emit and $on methods for our simple event bus
app.config.globalProperties.$emit = (eventName, ...args) => {
  app.emit(eventName, ...args); // Use the built-in Vue emit function
}; 
app.config.globalProperties.$on = (eventName, callback) => {
  app.on(eventName, callback);  // Use the built-in Vue on function
};

export default app;
