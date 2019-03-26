<template>
    <div>
        <div v-if="mealConfig">{{mealConfig.size}} - {{mealConfig.price}}</div>
        <div v-if="!mealConfig">Empty</div>
    </div>

</template>

<script>
export default {
  name: 'MealConfiguration',
  props: ['mealConfig'],
  data () {
    return {
    }
  }
}
</script>

<style>

</style>
