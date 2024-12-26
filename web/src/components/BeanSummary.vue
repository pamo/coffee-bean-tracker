<template>
  <div>
    <h2>Bean Summary</h2>
    <button @click="fetchBeanSummary">Fetch Summary</button>
    <ul v-if="beans.length">
      <li v-for="bean in beans"
          :key="bean.BeanId">
        {{ bean.Name }} - {{ bean.Roaster }} - {{ bean.RoastDate }} - {{ bean.DateAdded }}
      </li>
    </ul>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AxiosError } from 'axios';
import apiClient from '@/axios';
import { Bean, ErrorResponse } from '@/types';

const beans = ref<Bean[]>([]);
const message = ref('');

const fetchBeanSummary = async () => {
  try {
    const response = await apiClient.get('/beans');
    beans.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    message.value = axiosError?.response?.data?.message || 'Error fetching bean summary';
  }
};
</script>
