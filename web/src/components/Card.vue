<!-- Card.vue - Reusable Card Component -->
<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        <slot name="title"></slot>
      </h3>
      <slot name="actions"></slot>
    </div>
    <slot></slot>
  </div>
</template>
