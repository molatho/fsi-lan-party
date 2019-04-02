<template>
    <div>
        <h3>Bestellgrößen</h3>
        <b-table striped hover :items="getTableSizes"></b-table>
        <h3>Speisen</h3>
        <b-table striped hover :items="getTableMeals"></b-table>
    </div>
</template>

<script>
export default {
  name: 'MealMenu',
  props: ['menu'],
  data () {
    return {
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        })
    }
  },
  methods:{
    getTableSizes: function(){
      if (!this.menu || !this.menu.sizes || !this.menu.sizes.length) return [];
      return this.menu.sizes.map(s=>{return { Größe: s.size, Preis: this.formatter.format(s.price) };});
    },
    getTableMeals: function(){
      if (!this.menu || !this.menu.meals || !this.menu.meals.length) return [];
      return this.menu.meals.map(m=>{return { Nummer: m.id, Name: m.name, Zutaten: m.description };});
    }
  }
}
</script>

<style>

</style>
