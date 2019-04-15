<template>
  <div>
    <b-form inline>
      <label class="mr-sm-2" for="tableSelect">Tisch</label>
      <b-form-select
        v-model="selectedTable"
        :options="tableOptions"
        id="tableSelect"
        class="mb-2 mr-sm-2 mb-sm-0"
      ></b-form-select>
      <label class="mr-sm-2" for="seatSelect">Platz</label>
      <b-form-input
        v-model="selectedSeat"
        id="seatSelect"
        :type="'number'"
        :max="maxSeat"
        :min="1"
        number
      ></b-form-input>
      <label class="mr-sm-2" for="sizeSelect">Größe</label>
      <b-form-select
        v-model="selectedSize"
        :options="sizeOptions"
        id="sizeSelect"
        class="mb-2 mr-sm-2 mb-sm-0"
      ></b-form-select>
      <label class="mr-sm-2" for="mealSelect">Speise</label>
      <b-form-select
        v-model="selectedMeal"
        :options="mealOptions"
        id="mealSelect"
        class="mb-2 mr-sm-2 mb-sm-0"
      ></b-form-select>
      <b-button variant="success" @click="createOrder">
        <i class="fas fa-plus"></i>
      </b-button>
    </b-form>
    <Alert ref="orderNewAlert" duration="5"></Alert>
  </div>
</template>

<script>
import Alert from '@/components/Alert'

export default {
  name: "MealOrderNew",
  components: {Alert},
  props: ["menu", "orders", "tables"],
  data: function() {
    return {
      tableOptions: [],
      selectedTable: null,
      selectedSeat: 1,
      maxSeat: 0,
      sizeOptions: [],
      selectedSize: null,
      mealOptions: [],
      selectedMeal: null
    };
  },
  created: function() {
    this.tableOptions = this.getTableOptions(this.tables);
    if (this.tableOptions && this.tableOptions.length)
      this.selectedTable = this.tableOptions[0].value;
    this.sizeOptions = this.getSizeOptions(this.menu.sizes);
    if (this.sizeOptions && this.sizeOptions.length)
      this.selectedSize = this.sizeOptions[0].value;
    this.mealOptions = this.getMealOptions(this.menu.meals);
    if (this.mealOptions && this.mealOptions.length)
      this.selectedMeal = this.mealOptions[0].value;
  },
  watch: {
    menu: function(newVal, oldVal) {
      this.sizeOptions = this.getSizeOptions(newVal.sizes);
      this.mealOptions = this.getMealOptions(newVal.meals);
    },
    tables: function(newVal, oldVal) {
      this.tableOptions = this.getTableOptions(newVal);
    },
    selectedTable: function(newVal, oldVal) {
      this.selectedSeat = 1;
      this.maxSeat = newVal.seats;
    }
  },
  methods: {
    getTableOptions: function(tables) {
      if (!tables || !tables.length) return [];
      return tables.map(table => {
        return {
          value: table,
          text: table.name
        };
      });
    },
    getSizeOptions: function(sizes) {
      if (!sizes || !sizes.length) return [];
      return sizes.map(size => {
        return {
          value: size,
          text: size.size
        };
      });
    },
    getMealOptions: function(meals) {
      if (!meals || !meals.length) return [];
      return meals.map(meal => {
        return {
          value: meal,
          text: `[${meal.id}] ${meal.name}`
        };
      });
    },
    createOrder: function() {
        //createOrder(table, seat, mealId, size, cb) {
        this.$api.createOrder(this.selectedTable.name, this.selectedSeat, this.selectedMeal.id, this.selectedSize.size, (err, order) => {
            if (err) {
              console.log(err);
              this.$refs.orderNewAlert.showError(err.toString());
            } else {
              console.log(order);
              this.$refs.orderNewAlert.showSuccess(`Created order #${order.id}`);
            }
        });
    },
  }
};
</script>