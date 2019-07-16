<template>
    
</template>

<script>
export default {
    name: "Code",
    props: ['keys'],
    data: function(){
        return {
            keyBuffer: [],
            index: 0
        };
    },
    created: function () {
        window.addEventListener('keyup', this.onkey)
        this.keyBuffer = new Array(this.keys.length);
    },
    beforeDestroy: function () {
        window.removeEventListener('keyup', this.onkey)
    },
    methods: {
        onkey: function(event) {
            if (!this.keys || !this.keys.length) return;
            this.keyBuffer[this.index] = event.code;
            this.index = (this.index + 1) % this.keys.length;
            if (this.checkCode()) this.$emit('codeFired');
        },
        checkCode() {
            var start = (this.index + this.keys.length) % this.keys.length;
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keyBuffer[(start+i) % this.keys.length] != this.keys[i]) {
                    return false;
                }
            }
            return true;
        }
    },
    watch: {
        keys: function(newVal, oldVal) {
            console.log("newVal:", newval, "oldval:", oldval);
            if (newVal && newVal.length) {
                this.keyBuffer = new Array(newVal.length);
            } else{
                this.keyBuffer = [];
            }
            this.index = 0;
        }
    }
}
</script>