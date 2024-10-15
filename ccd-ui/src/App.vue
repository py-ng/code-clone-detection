<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item">
          <h3 class="title is-5 has-text-dark">Code Clone Detection</h3>
        </RouterLink>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<style></style>
