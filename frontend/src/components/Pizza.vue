<template>
  <div class="container">
    <br/>
    <!--New-->
    <PizzaOrderNew v-on:addNew="newOrder"></PizzaOrderNew>
    <hr/>
    <Alert ref="alertAdd"></Alert>
    <!--Panel-->
    <PizzaPanel
      v-bind:orders="info.orders"
      v-on:anySelected="showButton = true"
      v-on:noneSelected="showButton = false"></PizzaPanel>
    <button 
      v-if="showButton"
      type="button"
      class="btn btn-danger"
      style="float:right;"
      v-on:click="deleteOrders"
      ><i class="fas fa-trash-alt"></i></button>
    <Alert ref="alertRemove"></Alert>
    <p>Host: {{host}}</p>
  </div>
</template>

<script>
import Alert from './Alert'
import PizzaPanel from './PizzaPanel'
import PizzaOrderNew from './PizzaOrderNew'

export default {
  name: 'Pizza',
  props: ['host'],
  data () {
    return {
        info: {orders:[]},
        showButton: false
    }
  },
  components: { 
    PizzaPanel, PizzaOrderNew, Alert
  },
  created: function() {
      this.getPizzaStatus();
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
    getEndpoint: function(suffix) {
      return `${this.host}/pizza/${(suffix || "")}`
    },
    getPizzaStatus: function(event) {
      this.axios
        .get(this.getEndpoint('orders'))
        .then(res => {
          this.info = {orders: res.data};
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