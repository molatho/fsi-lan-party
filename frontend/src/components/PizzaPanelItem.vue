<template>
  <tr>
    <th scope="row"><input type="checkbox" class="form-check-input" v-model="order.selected" v-on:click="selectedChanged"></th>
    <td>{{ order.selection }}</td>
    <td>{{ order.size }}</td>
    <td>{{ order.qty }}</td>
  </tr>
</template>

<script>
export default {
  name: 'PizzaPanelItem',
  props: ['order'],
  data () {
    return {
    }
  },
  methods: {
    selectedChanged: function(event) {
      this.$emit('selectedChanged', { order: this.order });
    }
  }
}
</script>
