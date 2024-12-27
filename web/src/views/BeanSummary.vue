<template>
  <div>
    <h2>Bean Summary</h2>
    <button @click="fetchBeanSummary">Fetch Summary</button>
    <ul v-if="beans.length">
      <li v-for="bean in sortedBeans" :key="bean.BeanId">
        <router-link :to="{ path: `/details/${bean.BeanId}` }">
          {{ bean.Name }} - {{ bean.Roaster }} - {{ bean.RoastDate }} - {{ bean.DateAdded }}
        </router-link>
      </li>
    </ul>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AxiosError } from 'axios';
import { Bean, ErrorResponse } from '@/types';
import apiClient from '@/axios';

const beans = ref<Bean[]>([]);
const message = ref('');

const fetchBeanSummary = async () => {
  try {
    const response = await apiClient.get<Bean[]>('/api/beans');
    beans.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    message.value = axiosError.response?.data?.message || 'Error fetching bean summary';
  }
};

const sortedBeans = computed(() => {
  return beans.value
    .slice()
    .sort((a, b) => new Date(b.DateAdded).getTime() - new Date(a.DateAdded).getTime());
});

fetchBeanSummary();
</script>
