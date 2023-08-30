<template>
    <textarea
        ref="textarea"
        v-model="value_mut"
        rows="1"
        @focus="resize"
        @input="resize"
        @keyup="resize"
        @onfocusout="$emit('update:value', this.value_mut)"
    >
  </textarea>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: true,
        }
    },
    data() {
        return { value_mut: this.value }
    },
    watch: {
        value_mut() {
            this.$emit('update:value', this.value_mut);
        }
    },
    mounted() {
        this.resize();
    },
    methods: {
        resize() {
            const { textarea } = this.$refs;
            textarea.style.height = 0;
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }
}
</script>