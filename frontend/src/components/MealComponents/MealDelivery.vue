<template>
  <div>
    <b-form inline>
      <label class="mr-sm-2" for="mealSelect">Speise</label>
      <b-form-select
        v-model="selectedMeal"
        :options="mealOptions"
        id="mealSelect"
        class="mb-2 mr-sm-2 mb-sm-0"
      ></b-form-select>
    </b-form>
    <b-card-group deck v-if="selectedMeal">
      <b-card>
        <b-card-title>
          <b>Auslieferung ausstehend</b>
        </b-card-title>
        <b-list-group>
          <MealOrderItem
            v-for="order in selectedUndeliveredOrders"
            :key="order.id"
            v-bind:order="order"
          ></MealOrderItem>
          <p v-if="selectedUndeliveredOrders.length == 0">
            <i>
              Keine ausstehenden Auslieferungen für {{selectedMeal.name}}
            </i>
          </p>
        </b-list-group>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import MealOrderItem from "@/components/MealComponents/MealOrderItem";

export default {
  name: "MealDelivery",
  props: ["menu", "orders", "tables"],
  components: { MealOrderItem },
  data: function() {
    return {
      showUndeliveredOrders: true,
      mealOptions: [],
      selectedMeal: null,
      selectedUndeliveredOrders: []
    };
  },
  mounted: function() {
    if (this.menu && this.menu.meals)
      this.mealOptions = this.getMealOptions(this.menu.meals);
  },
  methods: {
    getMealOptions: function(meals) {
      if (!this.menu.meals || !this.menu.meals.length) return [];
      return meals.map(meal => {
        return {
          value: meal,
          text: `[${meal.id}] ${meal.name}`
        };
      });
    }
  },
  watch: {
    selectedMeal: function(newVal, oldVal) {
      if (!newVal) {
        this.selectedUndeliveredOrders = null;
      } else {
        this.selectedUndeliveredOrders = this.undeliveredOrders.filter(
          x => x.id == this.selectedMeal.id
        )[0].orders;
      }
    },
    menu: function(newVal, oldVal) {
      if (!newVal) return;
      this.mealOptions = this.getMealOptions(newVal.meals);
      if (this.selectedMeal == null && this.mealOptions.length > 0) {
        this.selectedMeal = this.mealOptions[0].value;
      }
    }
  },
  computed: {
    undeliveredOrders: function() {
      if (!this.$api) return [];
      return this.$api.undeliveredOrders;
    }
  }
};
</script>