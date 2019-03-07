<template>
  <div class="container">
    <h1>About</h1>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      msg: 'This page is about me.'
    }
  }
}
</script>
