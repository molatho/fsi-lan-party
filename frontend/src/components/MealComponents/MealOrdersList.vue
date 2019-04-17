<template>
  <div>
    <p>
      <i>Prüft gerne nach, ob eure Bestellungen auch richtig aufgenommen wurden und meldet euch bei Unstimmigkeiten bitte sofort vorne bei der Fachschaft!</i>
    </p>
    <div v-for="order in ordersByTables" :key="order.table.name">
      <b-card-group deck>
        <b-card>
          <b-card-title>
            <b>{{ order.table.name }}</b>
          </b-card-title>
          <div v-for="seat in order.seats" :key="seat.seat">
            <button
              disabled
              v-if="seat.orders.length == 0"
              class="m-1 seat-button"
            > Platz {{ seat.seat +1 }} - <i>Keine Bestellungen</i>
            </button>
            <div v-if="seat.orders.length > 0">
              <b-button v-b-toggle="(order.table.name + seat.seat)" class="m-1 seat-button">Platz {{ seat.seat + 1 }} - <i>{{ seat.orders.length }} Bestellung(en)</i></b-button>
              <b-collapse v-bind:id="(order.table.name + seat.seat)">
                <b-card>
                  <b-list-group>
                    <MealOrderItem v-for="order in seat.orders" :key="order.id" v-bind:order="order"></MealOrderItem>
                  </b-list-group>
                </b-card>
              </b-collapse>
            </div>
          </div>
        </b-card>
      </b-card-group>
    </div>
    <Alert ref="orderAlert" :duration="5"></Alert>
  </div>
</template>

<script>
import Alert from "@/components/Alert";
import MealOrderItem from "@/components/MealComponents/MealOrderItem";
import { clearInterval } from 'timers';

export default {
  name: "MealOrdersList",
  components: { Alert, MealOrderItem },
  props: ["menu", "orders", "tables"],
  data() {
    return {
      updateInterval: null
    };
  },
  methods: {
    deleteOrder: function(orderId) {
      this.$api.deleteOrder(
        orderId,
        function(err, order) {
          if (err) {
            this.$refs.orderAlert.showError(err.toString());
          } else {
            this.$refs.orderAlert.showSuccess(order.id);
          }
        }.bind(this)
      );
    },
    //tables -> seats -> orders
    /*getOrdersForTables: function(table) {
      if (
        !this.tables ||
        !this.tables.length ||
        !this.orders ||
        !this.orders.length
      )
        return [];

      return (this.seatOrders = this.tables.map(table => {
        return {
          table: table,
          seats: Array.apply(null, { length: table.seats })
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
                      state: order.state,
                      size: order.size,
                      price: this.menu.sizes.find(
                        size => size.size == order.size
                      ).price,
                      meal: this.menu.meals.find(meal => meal.id == order.meal)
                    };
                  })
              };
            })
            //.filter(s => s.orders && s.orders.length > 0)
        };
      }));
    }*/
  },
  mounted: function() {
    if (!this.updateInterval) this.updateInterval = setInterval(()=> {
      this.$api.getFullInfo((err, data)=> {
        if (err) this.$refs.orderAlert.showError(`Update fehlgeschlagen: ${this.$api.formatError(err)}`);
      });
    }, 1000);
  },
  destroyed: function() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  },
  computed: {
    ordersByTables: function() {
      if (!this.$api) return [];
      return this.$api.ordersByTables;
    }
  }
};
</script>

<style>
.seat-button {
    width: 100%;
}
.inline-hck-button {
  padding: 0.125rem 0.25rem;
  font-size: small;
}
</style>
