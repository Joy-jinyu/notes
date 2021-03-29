<template>
  <el-input
    v-model="inputValue"
    :placeholder="placeholder"
    :suffix-icon="suffixIcon"
  >
    <template #suffix>
      <slot name="suffix"></slot>
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'Input',
  props: {
    value: String,
    placeholder: {
      default: '',
    },
    suffixIcon: {
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    inputValue: {
      set: function (value) {
        this.$emit('input', value);
      },
      get: function () {
        return this.value;
      },
    },
  },
  methods: {
    vnodeKey(name, index) {
      return name + index;
    },
  },
};
</script>