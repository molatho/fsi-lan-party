<template>
  <div>
    <p>
      <i>Prüft gerne nach, ob eure Bestellungen auch richtig aufgenommen wurden und meldet euch bei Unstimmigkeiten bitte sofort vorne bei der Fachschaft!</i>
    </p>
    <div v-for="tableOrders in getOrdersForTables()" :key="tableOrders.table.name">
      <b-card-group deck>
        <b-card>
          <b-card-title>
            <b>{{ tableOrders.table.name }}</b>
          </b-card-title>
          <div v-for="seat in tableOrders.seats" :key="seat.seat">
            <!--<button
              disabled
              v-if="seat.orders == 0"
              class="m-1 seat-button"
            > Platz {{ seat.seat +1 }} - <i>Keine Bestellungen</i>
            </button>
            <div v-if="seat.orders > 0">-->
              <b-button v-b-toggle="(tableOrders.table.name + seat.seat)" class="m-1 seat-button">Platz {{ seat.seat + 1 }}</b-button>
              <b-collapse v-bind:id="(tableOrders.table.name + seat.seat)">
                <b-card>
                  <b-list-group>
                    <MealOrderItem v-for="order in seat.orders" :key="order.id" v-bind:order="order"></MealOrderItem>
                    <b-list-group-item v-if="tableOrders.seats.length == 0">
                      <i>Noch keine Bestellungen für diesen Tisch</i>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-collapse>
            <!--</div>-->
          </div>
        </b-card>
      </b-card-group>
    </div>
    <Alert ref="orderAlert" duration="5"></Alert>
  </div>
</template>

<script>
import Alert from "@/components/Alert";
import MealOrderItem from "@/components/MealComponents/MealOrderItem";

export default {
  name: "MealOrdersList",
  components: { Alert, MealOrderItem },
  props: ["menu", "orders", "tables"],
  data() {
    return {
      formatter: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2
      }),
      seatOrders: null
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
    getOrdersForTables: function(table) {
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
