<template>
    <div>
        <div v-for="tableOrders in getOrdersForTables()" :key="tableOrders">
            <b-card-group deck>
                <b-card>
                    <b-card-title><b>{{ tableOrders.table.name }}</b></b-card-title>
                    <div v-for="n in tableOrders.table.seats" :key="n">
                        <div v-if="seatHasOrders(tableOrders, n-1)">
                            <b-card-title class="mb-2">Platz {{n}}</b-card-title>                    
                            <b-list-group flush>
                            <b-list-group-item href="#">Cras justo odio</b-list-group-item> <!-- per order -->
                            </b-list-group>
                        </div>
                    </div>

                    <p class="card-text mt-2">
                    Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex nulla tempor. Laborum
                    consequat non elit enim exercitation cillum aliqua consequat id aliqua. Esse ex consectetur
                    mollit voluptate est in duis laboris ad sit ipsum anim Lorem.
                    </p>
                </b-card>
            </b-card-group>
        </div>
    </div>
</template>

<script>

export default {
  name: 'MealOrdersList',
  props: ['menu', 'orders', 'tables'],
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
    },
    getOrdersForTables: function(table){
        if (!this.tables || !this.tables.length || !this.orders || !this.orders.length) return [];
        var _o = this.tables
            .map(table => {
                return {
                    table: table,
                    orders: this.orders
                        .filter(order => order.table == table.name)
                        .map(order => { return {
                            seat: order.seat,
                            size: order.size,
                            meal: this.menu.meals.find(meal => meal.id == order.meal)
                        }})
                }
            })
            .filter(obj => obj.orders && obj.orders.length > 0);
            console.log(_o);
            return _o;
    },
    seatHasOrders: function(tableOrder, seat){
        return tableOrder.orders.find(x=>x.seat == seat) !== undefined;
    }
  }
}
</script>

<style>

</style>
