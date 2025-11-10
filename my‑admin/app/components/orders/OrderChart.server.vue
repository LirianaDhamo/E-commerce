<script setup lang="ts">
interface ChartData {
  date: string
  total: number
}

// Define props
defineProps<{
  data: ChartData[]
}>()
</script>

<template>
  <div class="w-full h-80">
    <ResponsiveContainer>
      <LineChart :data="data" :margin="{ top: 5, right: 20, left: 0, bottom: 5 }">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#8884d8" stroke-width="2" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</template>
