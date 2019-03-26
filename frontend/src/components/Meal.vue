<template>
  <div class="container">
    <div class="row">
      <!-- Menu -->
      <div class=".col-6">
        <!--<MealKind
          v-for="kind in menu"
          v-bind:key="kind"
          v-bind:mealKind="kind"
        ></MealKind>-->
        <MealMenu v-if="user != null" v-bind:menu="menu"></MealMenu>
      </div>
      <!-- Orders -->
      <div class=".col-4">
      </div>
    </div>
  </div>
</template>

<script>
import Alert from './Alert'
import MealKind from './MealComponents/MealKind'
import MealMenu from './MealComponents/MealMenu'

export default {
  name: 'Meal',
  props: ['host'],
  data () {
    return {
        menu: [],
        user: null
    }
  },
  components: { 
    Alert, MealKind, MealMenu
  },
  created: function() {
      this.getMenu();
      this.getUserInfo();
  },
  methods: {
    formatError: function(error) {
      if (!error) {
        return "";
      } else {
        if (error.response) {
          if (error.response.data) {
            return `${error.response.data} (${error.response.status} - ${error.response.statusText})`;
          }
          return `${error.response.status} - ${error.response.statusText}`;
        } else {
          return "Keine Antwort."
        }
      }
    },
    getEndpoint: function(resource) {
      return `${this.host}${(resource || "")}`
    },
    getMenu: function(event) {
      this.axios
        .get(this.getEndpoint('/meals/menu'))
        .then(res => {
          this.menu = res.data;
        });
    },
    getUserInfo: function() {
      this.axios
        .get(this.getEndpoint('/auth/status'))
        .then(res => {
          this.menu = res.data;
        }).catch((error) => {
          console.warn(error);
          //this.$refs.alertRemove.show('danger','Fehler!', this.formatError(error));
        });
    },
    deleteOrders: function(event) {
      var orders = this.info.orders.filter(x => x.selected || false);
      for (var i = 0; i < orders.length; i++) {
        this.axios
          .delete(this.getEndpoint(`orders/${orders[i].id}`))
          .then(res => {
            this.info.orders = res.data;
          }).catch((error) => {
            console.warn(error);
            this.$refs.alertRemove.show('danger','Fehler!', this.formatError(error));
          })
      }
      this.showButton = false;
    },
    newOrder: function(event) {
      var order = event.order;
      this.axios
        .post(this.getEndpoint(), order)
        .then(res => {
          this.info = {orders: res.data};
        }).catch((error) => {
          this.$refs.alertAdd.show('danger','Fehler!', this.formatError(error));
        });
    }
  }
}
</script>