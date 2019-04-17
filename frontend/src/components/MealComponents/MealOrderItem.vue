<template>
  <b-list-group-item v-bind:variant="this.toDelete ? 'warning': 'default'">
    {{ order.meal.name }} [ {{ order.size }} ]
    <!-- State -->
    <b-button
      v-if="this.order.state == 0 && this.$api.user && this.$api.user.role == 'admin'"
      class="inline-hck-button"
      size="sm"
      variant="success"
      @click="setState(1)"
    >
      <i class="fas fa-money-bill-wave-alt"></i> Bezahlen
    </b-button>

    <b-button
      v-if="this.order.state == 1 && this.$api.user && this.$api.user.role == 'admin'"
      class="inline-hck-button"
      size="sm"
      variant="success"
      @click="setState(2)"
    >
      <i class="fas fa-box"></i> Ausliefern
    </b-button>

    <!-- Reset -->
    <b-button
      v-if="this.$api.user && this.$api.user.role == 'admin'"
      class="inline-hck-button"
      size="sm"
      variant="success"
      @click="setState(0)"
    >
      <i class="fas fa-undo"></i> Zurücksetzen
    </b-button>

    <!-- Delete -->
    <b-button
      v-if="this.$api.user && this.$api.user.role == 'admin'"
      class="inline-hck-button"
      size="sm"
      variant="danger"
      @click="handleDelete"
    >
      <i class="fas fa-trash-alt"></i>
    </b-button>
    <Alert ref="orderAlert" duration=5></Alert>
  </b-list-group-item>
</template>

<script>
import Alert from '@/components/Alert'

const STATES = {
    "New": 0,
    "Paid": 1,
    "Delivered": 2,
    0: "Neu",
    1: "Bezahlt",
    2: "Ausgeliefert",
    isValid: function(state) {
        return STATES[state] !== undefined  || (state >= STATES.New && state < STATES.Delivered);
    },
    toString: function(state) {
        if (!STATES.isValid(state)) return "INVALID";
        return STATES[state];
    }
}

export default {
  name: "MealOrderItem",
  components: { Alert },
  props: ["order"],
  data: function() {
    return {
      toDelete: false
    };
  },
  methods: {
    setState: function(state) {
      if (!this.toDelete) {
          this.toDelete = false;
      }

      this.$api.setOrderState(this.order.id, state, function(err, newOrder) {
        this.order = newOrder;
        this.$forceUpdate();
        if (err) return this.$refs.orderAlert.showError(this.$api.formatError(err));
      }.bind(this));
    },
    handleDelete: function() {
      if (!this.toDelete) {
        this.toDelete = true;
      } else {
        this.$api.deleteOrder(this.order.id, function(err, order) {
            if (err) return this.$refs.orderAlert.showError(this.$api.formatError(err));
        }.bind(this));
      }
    }
  }
};
</script>

<style>
.inline-hck-button {
  padding: 0.125rem 0.25rem;
  margin-left: 0.5rem;
  font-size: small;
  float: right;
}

.list-group-item {
    font-size: small;
}
</style>
