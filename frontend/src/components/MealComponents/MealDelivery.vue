<template>
  <div></div>
</template>

<script>
export default {
  name: "MealDelivery",
  props: ["menu", "orders", "tables"],
  data: function() {
    return {};
  },
  computed: {
    unpaidOrders: function() {
      if (!this.$api) return [];
      return this.$api.unpaidOrders;
    }
  }
};
</script>