<script setup>
// Composition API

</script>
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link to="/MeMeStore" class="navbar-brand text-secondary fs-1 fw-bolder">MEME Shop</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              to="/MeMeStore/userboard"
              class="nav-link"
              active-class="active"
            >
              Products
            </router-link>
          </li>
        </ul>
        <span class="navbar-text">
          迷因梗圖
        </span>
      </div>
    </div>
  </nav>
</template>


