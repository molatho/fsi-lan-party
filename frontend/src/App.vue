<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">[FS-I] LAN-Party</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <router-link to="/" exact tag="li" class="nav-item">
              <a class="nav-link">Home</a>
            </router-link>
            <router-link to="/about" tag="li" class="nav-item">
              <a class="nav-link">About</a>
            </router-link>
            <router-link to="/pizza" tag="li" class="nav-item">
              <a class="nav-link">Pizza</a>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>

    <router-view :host="host"></router-view>
  </div>
</template>


<script>
  export default {
    name: 'app',
    data() {
      return {
        host: "http://localhost:7777"
      };
    }
  }
</script>
