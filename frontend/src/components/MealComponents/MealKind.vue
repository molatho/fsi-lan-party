<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{this.mealKind.name}}</h5>
            <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
            <p class="card-text">
                Auswahl:
                    <b-form-select v-model="selected" :options="getOptions()" />
            </p>
            <!--<ul
                class="list-group list-group-flush"
                v-for="config in mealKind.configs"
                v-bind:key="config">
              <li class="list-group-item"><MealConfiguration v-bind:mealConfig="config"/></li>
            </ul>-->
        </div>
    </div>
</template>

<script>
import MealConfiguration from './MealConfiguration'; 

export default {
  name: 'MealKind',
  props: ['mealKind'],
  data () {
    return {
        'selected': this.mealKind.configs[0],
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        })
    }
  },
  components: { 
    MealConfiguration
  },
  methods: {
      getOptions(){
          return this.mealKind.configs.map(mk=> { return { 
              value: mk,
              text: `${mk.size} - ${this.formatter.format(mk.price)}`
              }
          });
      },
      formatCurrency(price) {
      }
  }
}
</script>

<style>

</style>
