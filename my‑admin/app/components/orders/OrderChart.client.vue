<script setup lang="ts">
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, startOfDay } from 'date-fns'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { Period, Range } from '~/types'
import OrderChartServer from '~/components/orders/OrderChart.server.vue'

interface Order {
  id: number
  email: string
  amount: number
  status: string
  createdAt: string
}
const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

const props = defineProps<{
  period: Period
  range: Range
}>()

type DataRecord = {
  date: Date
  amount: number
}

const { width } = useElementSize(cardRef)

const data = ref<DataRecord[]>([])

// ✅ Load and group orders from DB
const { data: fetchOrders } = await useFetch<Order[]>('http://localhost:5000/api/orders')

watchEffect(() => {
  if (!fetchOrders.value) return
  const grouped: Record<string, number> = {}

  for (const order of fetchOrders.value) {
    const day = format(startOfDay(new Date(order.createdAt)), 'yyyy-MM-dd')
    grouped[day] = (grouped[day] || 0) + order.amount
  }

  data.value = Object.entries(grouped).map(([date, amount]) => ({
    date: new Date(date),
    amount
  }))
})


const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.amount

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))

const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format

const formatDate = (date: Date): string => {
  return ({
    daily: format(date, 'd MMM'),
    weekly: format(date, 'd MMM'),
    monthly: format(date, 'MMM yyy')
  })[props.period]
}

const xTicks = (i: number) => {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }

  return formatDate(data.value[i].date)
}

const template = (d: DataRecord) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`

const { data: orders } = await useFetch<Order[]>('http://localhost:5000/api/orders')

const dailyData = computed(() => {
  if (!orders.value) return []
  const grouped: Record<string, { date: string; total: number }> = {}

  for (const order of orders.value) {
    const day = format(startOfDay(new Date(order.createdAt)), 'yyyy-MM-dd')
    if (!grouped[day]) grouped[day] = { date: day, total: 0 }
    grouped[day].total += order.amount
  }

  return Object.values(grouped)
})
</script>

<template>
   <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <VisXYContainer
      :data="data"
      :padding="{ top: 40 }"
      class="h-96"
      :width="width"
    >
      <VisLine
        :x="x"
        :y="y"
        color="var(--ui-primary)"
      />
      <VisArea
        :x="x"
        :y="y"
        color="var(--ui-primary)"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="var(--ui-primary)"
        :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
