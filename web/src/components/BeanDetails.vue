<template>
  <div>
    <h2>Bean Details</h2>
    <div v-if="bean">
      <h3>Details:</h3>
      <p>Name: {{ bean.Name }}</p>
      <p>Roaster: {{ bean.Roaster }}</p>
      <p>Roast Date: {{ bean.RoastDate }}</p>
      <p>Date Added: {{ bean.DateAdded }}</p>
    </div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { Bean, ErrorResponse } from '@/types';
import apiClient from '@/axios';

const route = useRoute();
const beanId = ref(route.params.beanId);
const bean = ref<Bean | null>(null);
const message = ref('');

const fetchBeanDetails = async () => {
  try {
    const response = await apiClient.get(`/api/beans/${beanId.value}`);
    bean.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    message.value = axiosError?.response?.data?.message || 'Error fetching bean details';
  }
};

onMounted(() => {
  fetchBeanDetails();
});
</script>
