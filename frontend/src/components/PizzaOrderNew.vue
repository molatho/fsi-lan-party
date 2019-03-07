<template>
  <div>
    <h3>Neue Bestellung</h3>
    <form>
        <div class="row">
            <div class="col">
                <label for="selection">Sorte</label>
                <select id="selection" class="form-control" v-model="selection">
                    <option v-for="name in names" v-bind:key="name">{{name}}</option>
                </select>
            </div>
            <div class="col">
                <label for="size">Größe</label>
                <select id="size" class="form-control" v-model="size">
                    <option v-for="size in sizes" v-bind:key="size">{{size}}</option>
                </select>
            </div>
            <div class="col">
                <label for="qty">Anzahl</label>
                <input 
                    v-model="qty"
                    id="qty"
                    type="number"
                    value="1"
                    class="form-control"
                    min="1"
                    max="3"/>
            </div>
            <div class="col">
                <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="addNew"
                    ><i class="fas fa-plus"></i></button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PizzaOrderNew',
  props: ['orders'],
  data () {
    return {
        names: ["Berlusconi", "Bilancia", "Calzone", "Caruso", "Cavallo", "Etna", "Frutti di Mare", "Gambaretti", "Gentile", "Hawaii", "Mare e Monte", "Margherita", "Mix Spezial", "Mozzarella", "Petra", "Quattro Gusti", "Ragu", "Sicilia", "Tonno", "Vegetarier", "ai Spinaci"],
        sizes: ["Klein (22 cm)", "Normal (26 cm)", "Groß (30 cm)"],
        selection: "",
        size: "",
        qty: 1
    }
  },
  methods: {
      addNew() {
          this.$emit("addNew", {
            order: {
                selection: this.selection,
                size: this.size,
                qty: parseInt(this.qty) | 0
            }
          });
      }
  }
}
</script>
