<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/MeMeStore" class="navbar-brand text-secondary fs-1 fw-bolder">MEME Shop</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link
          to="/MeMeStore/userboard"
          class="nav-link"
          active-class="active"
        >
          Products
        </router-link></li>
      <li class="breadcrumb-item active" aria-current="page">Data</li>
    </ol>
  </nav>
</template>
