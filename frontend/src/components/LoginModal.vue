<template>
  <div>
    <b-modal id="modal" ref="modal" title="[FS-I] Login" @ok="handleOk">
      <div class="d-block text-center">
        <i class="fas fa-angle-double-left"></i>
        <i>pls no hakkerino</i>
        <i class="fas fa-angle-double-right"></i>
      </div>

      <form @submit.stop.prevent="handleSubmit">
        <label for="username">Username</label>

        <b-form-input id="username" type="text" placeholder="Enter your name" v-model="username"/>

        <label for="username">Passwort</label>

        <b-form-input
          id="password"
          type="password"
          placeholder="Enter your password"
          v-model="password"
        />

        <b-alert
          dismissible
          fade
          :show="(errormsg && errormsg.length > 0)"
          @dismissed="errormsg=null"
          ref="alert"
          variant="danger"
        >{{errormsg}}</b-alert>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "LoginModal",
  data: function() {
    return {
      username: "",
      password: "",
      errormsg: null
    };
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.username || !this.password) {
        this.errormsg = "Fehlender Username/Passwort";
      } else {
        this.handleSubmit();
      }
    },
    handleSubmit() {
      this.$refs.modal.busy = true;
      this.errormsg = null;
      this.$api.login(this.username, this.password, function(err, user) {
          this.$refs.modal.busy = false;
          if (!err) {
              this.$emit("loggedIn", user);
              this.hideModal();
              return;
          }
          if (
            err.response &&
            err.response.data &&
            err.response.data.err
          ) {
            this.errormsg = err.response.data.err;
          } else {
            this.errormsg = err.toString();
          }
      }.bind(this));
    }
  }
};
</script>