<template>
    <div>
        <p><i>Prüft gerne nach, ob eure Bestellungen auch richtig aufgenommen wurden und meldet euch bei Unstimmigkeiten bitte sofort vorne bei der Fachschaft!</i></p>
        <div v-for="tableOrders in getOrdersForTables()" :key="tableOrders.table.name">
            <b-card-group deck>
                <b-card>
                    <b-card-title><b>{{ tableOrders.table.name }}</b></b-card-title>
                    <b-list-group flush>
                        <b-list-group-item 
                            v-for="seat in tableOrders.seats"
                            :key="seat.seat"
                        >
                            Platz {{ seat.seat + 1 }}:
                            <b-badge
                                variant="primary"
                                v-for="order in seat.orders"
                                :key="order.id"
                                style="margin-left:4px;">
                                {{ order.meal.name }} [ {{ order.size }} | {{ formatter.format(order.price) }} ]

                                <b-button
                                    class="inline-hck-button"
                                    size="sm"
                                    variant="danger"
                                    v-if="this.$api.user && this.$api.user.role == 'admin'"
                                    @click="deleteOrder(order.id)"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </b-button>
                            </b-badge>
                            | Summe: {{ formatter.format(seat.orders.reduce((sum, order) => sum + order.price, 0)) }} 
                        </b-list-group-item> 
                        <b-list-group-item                    
                                v-if="tableOrders.seats.length == 0">
                                <i>Noch keine Bestellungen für diesen Tisch</i>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </b-card-group>
        </div>
        <Alert ref="orderAlert" duration="5"></Alert>
    </div>
</template>

<script>
import Alert from '@/components/Alert'

export default {
  name: 'MealOrdersList',
  components: {Alert},
  props: ['menu', 'orders', 'tables'],
  data () {
    return {
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }),
        seatOrders: null
    }
  },
  methods:{
      deleteOrder: function(orderId) {
          this.$api.deleteOrder(orderId, function(err, order) {
              if (err) {
                  this.$refs.orderAlert.showError(err.toString());
              } else {
                  this.$refs.orderAlert.showSuccess(order.id);
              }
          }.bind(this));
      },
    //tables -> seats -> orders
    getOrdersForTables: function(table){
        if (!this.tables || !this.tables.length || !this.orders || !this.orders.length) return [];
        
        return this.seatOrders = this.tables
            .map(table => {
                return {
                    table: table,
                    seats: Array.apply(null, {length: table.seats})
                        .map(Number.call, Number)
                        .map(s => {
                            return {
                                seat: s,
                                orders: this.orders
                                    .filter(order => order.table == table.name && order.seat == s)
                                    .map(order => {
                                        return {
                                            id: order.id,
                                            seat: s,
                                            size: order.size,
                                            price: this.menu.sizes.find(size => size.size == order.size).price,
                                            meal: this.menu.meals.find(meal => meal.id == order.meal)
                                        }
                                    })
                            }
                        })
                        .filter(s => s.orders && s.orders.length > 0)
                }
            });
    }
  }
}
</script>

<style>
.inline-hck-button {
    padding: 0.125rem .25rem;
    font-size: small;
}
</style>
