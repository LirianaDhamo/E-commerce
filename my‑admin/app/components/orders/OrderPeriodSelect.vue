<script setup lang="ts">
import type { Range, Period } from '~/types'

defineProps<{
  modelValue: Period
  range: Range
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <USelect
    :options="[
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' }
    ]"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
