<template>
  <div>
    <ul v-if="beans.length">
      <li v-for="bean in sortedBeans" :key="bean.beanId">
        <Card>
          <template #title>{{ bean.roaster }} &bull; {{ bean.name }} &bull; {{ bean.origin }}</template>
          <template #actions>
            <router-link :to="{ path: `/details/${bean.beanId}` }"
              ><action-button>See more</action-button>
            </router-link>
          </template>
          <div class="text-gray-600">
            {{ bean.name }} - {{ bean.roaster }} - {{ bean.roastDate }} - {{ bean.dateAdded }}
          </div>
        </Card>
      </li>
    </ul>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AxiosError } from 'axios';
import { Bean, ErrorResponse } from '@/types';
import Card from '@/components/Card.vue';
import ActionButton from '@/components/ActionButton.vue';

import apiClient from '@/axios';

const beans = ref<Bean[]>([]);
const message = ref('');

const fetchBeanSummary = async () => {
  try {
    const response = await apiClient.get<Bean[]>('/api/beans');
    beans.value = response.data?.summary?.recentBeans;
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
