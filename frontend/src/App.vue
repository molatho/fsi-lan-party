<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">[FS-I] LAN-Party</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <router-link to="/" exact tag="li" class="nav-item">
              <a class="nav-link">Home</a>
            </router-link>
            <router-link to="/orders" tag="li" class="nav-item">
              <a class="nav-link">Bestellungen</a>
            </router-link>
            <!--<router-link to="/about" tag="li" class="nav-item">
                            <a class="nav-link">Über</a>
            </router-link>-->
            <div class="nav-item">
              <a
                class="nav-link"
                v-on:click="handleLoginLogout"
              >{{$api.user ? `Logout (${$api.user.name})` : `Login`}}</a>
              <LoginModal ref="loginModal"></LoginModal>
            </div>
          </ul>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>


<script>
import LoginModal from "./components/LoginModal";

export default {
  name: "app",
  components: { LoginModal },
  data() {
    return {};
  },
  methods: {
    handleLoginLogout: function() {
      if (!this.$api.user) {
        this.$refs.loginModal.showModal();
      } else {
        this.$api.logout(err => console.error(err));
      }
    }
  },
  created: function() {
    this.$api.getAuthStatus((err, user) => console.log(err));
  }
};
</script>