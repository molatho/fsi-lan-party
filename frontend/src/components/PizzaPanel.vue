<template>
  <div>
    <h3>Deine Bestellungen</h3>
    <div
      v-if="!(orders && orders.length > 0)"
      class="alert alert-warning alert-dismissible fade show"
      role="alert">
      <strong>¯\_(ツ)_/¯</strong> Du hast (noch) nichts bestellt.
    </div>
    <table 
      v-if="orders && orders.length > 0"
      class="table">
      <thead>
        <tr>
          <th scope="col"><input type="checkbox" class="form-check-input" v-model="allSelected" v-on:click="checkAll"></th>
          <th scope="col">Auswahl</th>
          <th scope="col">Größe</th>
          <th scope="col">Anzahl</th>
        </tr>
      </thead>
      <tbody>
        <PizzaPanelItem
          v-for="order in orders"
          v-bind:key="order.id"
          v-bind:order="order"
          v-on:selectedChanged="selectedChanged"></PizzaPanelItem>
      </tbody>
    </table>
  </div>
</template>

<script>
import PizzaPanelItem from './PizzaPanelItem'

export default {
  name: 'PizzaPanel',
  props: ['orders'],
  data () {
    return {
      allSelected: false,
      msg: 'This page is about me.'
    }
  },
  components: { 
    PizzaPanelItem 
  },
  methods: {
    checkAll: function(event) {
      if (this.orders && this.orders.length) {
        for (var i = 0; i < this.orders.length; i++) {
          this.orders[i].selected = !this.allSelected;
        }
      }
      if (this.orders[0].selected) {
        this.$emit("anySelected");
      } else {
        this.$emit("noneSelected");
      }
    },
    selectedChanged: function(event) {
      //Important: 
      //  This event is triggered BEFORE the "selected"-property of orders is updated.
      //  This requires inverting the value of the "selected"-property.
      var order = event.order;
      this.allSelected = false;
      if (this.orders && this.orders.length) {
        if (this.orders.length == 0) {
          //Empty list of orders
          this.allSelected = false;
          this.anySelected = false;
          this.$emit("noneSelected");
        } else if (this.orders.length == 1) {
          //Just one order
          var val = !(order.selected || false);
          this.allSelected = val;
          this.anySelected = val;
          if (val) {
            this.$emit("anySelected");
          } else {
            this.$emit("noneSelected");
          }
        } else {
          //Many orders...
          var all = true;
          var any = false;
          for (var i = 0; i < this.orders.length - 1; i++) {
            //Compare pairs of orders
            var o1 = this.orders[i].id === order.id ? !(order.selected || false) : (this.orders[i].selected || false);
            var o2 = this.orders[i + 1].id === order.id ? !(order.selected || false) : (this.orders[i + 1].selected || false);
            if (o1 === false || o2 === false) {
              //If either is false, all can't be true
              all = false;
            }
            if (o1 || o2) {
              //If either is true, any is true
              any = true;
            }
          }
          this.allSelected = all;
          if (any) {
            this.$emit("anySelected");
          } else {
            this.$emit("noneSelected");
          }
        }
      }
    }
  }
}
</script>
