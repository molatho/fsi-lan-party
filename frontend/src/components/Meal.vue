<template>
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1>Bestellungen</h1>
        <p>
          Hier findet ihr die aktuelle Speisekarte und eine Liste aller Bestellungen.
          <br>Informiert euch vor der Bestellung, was alles auf der Speisekarte steht - dann geht es mit der Bestellaufnahme gleich schneller!
        </p>
      </div>
    </div>
    <div class="container">
      <b-tabs content-class="mt-3">
        <b-tab title="Speisekarte" active>
          <MealMenu :menu="this.$api.menu"></MealMenu>
        </b-tab>
        <b-tab title="Bestellungen">
          <div v-if="this.$api.user && this.$api.user.role == 'admin'">
            <MealOrderNew
            v-bind:menu="this.$api.menu"
            v-bind:tables="this.$api.tables"
            v-bind:orders="this.$api.orders"
          ></MealOrderNew>
          <hr>
          </div>
          <MealOrdersList
            :menu="this.$api.menu"
            :tables="this.$api.tables"
            :orders="this.$api.orders"
          ></MealOrdersList>
        </b-tab>
        <b-tab v-if="this.$api.user && this.$api.user.role == 'admin'" title="Auslieferung">
          <MealDelivery
            :menu="this.$api.menu"
            :tables="this.$api.tables"
            :orders="this.$api.orders">

          </MealDelivery>
        </b-tab>
        <!--<b-tab title="Neue Bestellung" v-if="this.$api.user && this.$api.user.role == 'admin'">
              <MealOrderNew
                v-bind:menu="this.$api.menu"
                v-bind:tables="this.$api.tables"
                v-bind:orders="this.$api.orders">
                </MealOrderNew>
        </b-tab>-->
      </b-tabs>
    </div>
    <Alert ref="alert" :duration=5></Alert>
  </div>
</template>

<script>
import Alert from "./Alert";
import MealMenu from "./MealComponents/MealMenu";
import MealOrdersList from "./MealComponents/MealOrdersList";
import MealOrderNew from "./MealComponents/MealOrderNew";
import MealDelivery from "./MealComponents/MealDelivery"
//TODO: Meals nicht löschen sondern auf "gelöscht" Status
export default {
  name: "Meal",
  data() {
    return {
      formatter: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2
      })
    };
  },
  components: {
    Alert,
    MealMenu,
    MealOrdersList,
    MealOrderNew,
    MealDelivery
  },
  created: function() {
    this.$api.getFullInfo(
      function(err) {
        if (err) {
          this.$refs.alert.showError(this.$api.formatError(err));
          console.error(this.$api.formatError(err));
        }
      }.bind(this)
    );
  },
  methods: {
    getTableSizes: function() {
      if (!this.menu || !this.menu.sizes || !this.menu.sizes.length) return [];
      return arr.map(s => {
        return { Größe: s.size, Preis: this.formatter.format(s.price) };
      });
    }
  }
};
</script>