<template>
    <div>
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <img src="../assets/lan-party.gif" style="width:100px; float:left; margin-right:20px;"/>
          <h1 class="display-3">Hello, world!</h1>
          <p class="lead">Dies ist die Infoseite zur LAN-Party der FS-I <b>{{this.year}}</b>.</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      year: '20xx'
    }
  },
  created: function() {
    this.year = new Date().getFullYear();
  }
}
</script>
