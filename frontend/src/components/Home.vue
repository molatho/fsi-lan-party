<template>
    <div>
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <img src="../assets/lan-party.gif" style="width:100px; float:left; margin-right:20px;"/>
          <h1 class="display-3">Hello, world!</h1>
          <p class="lead">Dies ist die Infoseite zur LAN-Party der FS-I <b>{{this.year}}</b>.</p>
        </div>
      </div>
      <Code :keys="['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyB']"></Code>
    </div>
</template>

<script>
import Code from '@/components/Code';

export default {
  name: 'Home',
  components: { Code },
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
