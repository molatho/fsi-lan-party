<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Menü</h5>
            <p class="card-text">
                <b-form-group
                    id="mealKindGroup"
                    label="Gericht:"
                    label-for="mealKindSelection"
                >
                    <b-form-select 
                        id="mealKindSelection"
                        v-model="selectedKind"
                        :options="getKindOptions()"
                        v-on:change="onKindChanged"/>
                </b-form-group>
                <b-form-group
                    id="mealConfigGroup"
                    label="Größe:"
                    label-for="mealConfigSelection"
                >
                    <b-form-select 
                        id="mealConfigSelection"
                        v-model="selectedConfig"
                        :options="getConfigOptions()" />
                </b-form-group>
                
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
  name: 'MealMenu',
  props: ['menu'],
  data () {
    return {
        'selectedKind': null,
        'selectedConfig': null,
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        })
    }
  },
  watch: { 
    menu: function(newVal, oldVal) {
        this.selectedKind = newVal[0];
        this.selectedConfig = newVal[0].configs[0];
    }
  },
  components: { 
    MealConfiguration
  },
  methods: {
      getKindOptions() {
          if (!this.hasData()) return [];
          return this.menu
          .slice(0)
          .sort((a, b) => (a.name > b.name) ? 1 : -1)
          .map(mk => { return { 
              value: mk,
              text: `${mk.name} (ab ${this.formatter.format(mk.configs[0].price)})`
              }
          });
      },
      getConfigOptions() {
          if (!this.hasData() || this.selectedKind == null) return [];
          return this.selectedKind.configs
          .slice(0)
          .sort((a, b) => (a.price > b.price) ? 1 : -1)
          .map(mc => { return { 
              value: mc,
              text: `${mc.size} - ${this.formatter.format(mc.price)}`
              }
          });
      },
      onKindChanged(event) {
          this.selectedConfig = event.configs[0];
      },
      hasData(){
          return !(!this.menu || !this.menu.length || !this.formatter);
      }
  }
}
</script>

<style>

</style>
