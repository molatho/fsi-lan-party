<template>
    <div>
        <h3>Bestellgrößen</h3>
        <b-table striped hover :items="this.tableSizes"></b-table>
        <h3>Speisen</h3>
        <b-table striped hover :items="this.tableMeals"></b-table>
    </div>
</template>

<script>
export default {
  name: 'MealMenu',
  props: ['menu'],
  data: function(){
    return {
      tableSizes: null,
      tableMeals: null,
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }),
    }
  },
  methods:{
    getTableSizes: function(menu){
      if (!menu || !menu.sizes || !menu.sizes.length) return [];
      return menu.sizes.map(s=>{return { Größe: s.size, Preis: this.formatter.format(s.price) };});
    },
    getTableMeals: function(menu){
      if (!menu || !menu.meals || !menu.meals.length) return [];
      return menu.meals.map(m=>{return { Nummer: m.id, Name: m.name, Zutaten: m.description };});
    }
  },
  created: function() {
    this.tableSizes = this.getTableSizes(this.menu);
    this.tableMeals = this.getTableMeals(this.menu);
  },
  watch: {
    menu: function(newVal, oldVal) {
      this.tableSizes = this.getTableSizes(this.menu);
      this.tableMeals = this.getTableMeals(this.menu);
    }
  }

}
</script>

<style>

</style>
