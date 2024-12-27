<template>
  <div id="app">
    <nav>
      <router-link to="/">Bean Summary</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style>
nav {
  display: flex;
  gap: 10px;
}
</style>
