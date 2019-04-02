<template>
    <div>
        <b-form-select v-model="selected" :options="getTableOptions"></b-form-select>
    </div>
</template>

<script>
export default {
  name: 'MealOrderNew',
  props: ['menu', 'orders', 'tables'],
  data: function(){
      return {

      };
  },
  methods: {
      getTableOptions: function() {
          if (!this.tables || !this.tables.length) return [];
          return this.tables
            .map(table => { return {
                value: table,
                text: table.name
            }});
      }
  }
}
</script>