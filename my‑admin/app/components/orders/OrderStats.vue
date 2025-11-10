<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
import type { Period, Range, Stat } from '~/types'

interface Order {
  id: number
  email: string
  amount: number
  status: string
  createdAt: string
}

const stats = ref({
  total: 0,
  revenue: 0,
  pending: 0,
  completed: 0
})

onMounted(async () => {
  const { data } = await useFetch<Order[]>('http://localhost:5000/api/orders')

  if (data.value) {
    stats.value.total = data.value.length
    stats.value.revenue = data.value.reduce((sum, o) => sum + o.amount, 0)
    stats.value.pending = data.value.filter(o => o.status === 'PENDING').length
    stats.value.completed = data.value.filter(o => o.status === 'COMPLETED').length
  }
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <UCard>
      <p class="text-sm text-gray-500">Total Orders</p>
      <p class="text-2xl font-semibold">{{ stats.total }}</p>
    </UCard>
    <UCard>
      <p class="text-sm text-gray-500">Total Revenue</p>
      <p class="text-2xl font-semibold">${{ stats.revenue }}</p>
    </UCard>
    <UCard>
      <p class="text-sm text-gray-500">Pending</p>
      <p class="text-2xl font-semibold text-yellow-600">{{ stats.pending }}</p>
    </UCard>
    <UCard>
      <p class="text-sm text-gray-500">Completed</p>
      <p class="text-2xl font-semibold text-green-600">{{ stats.completed }}</p>
    </UCard>
  </div>
</template>
