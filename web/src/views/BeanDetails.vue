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

console.log('Bean details component has loaded!!');
const route = useRoute();
const beanId = ref(route.params.beanId as string);
const bean = ref<Bean | null>(null);
const message = ref('');

const fetchBeanDetails = async () => {
  console.log('Fetching bean details for ID:', beanId.value);
  try {
    const response = await apiClient.get<Bean>(`/api/beans/${beanId.value}`);
    console.log('Bean details fetched:', response.data);
    bean.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error fetching bean details:', axiosError);
    message.value = axiosError.response?.data?.message || 'Error fetching bean details';
  }
};

onMounted(() => {
  fetchBeanDetails();
});
</script>
