<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range } from '~/types'
import { sub } from 'date-fns'

// 🟢 Define your order interface
interface Order {
  id: number
  email: string
  amount: number
  status: string
  createdAt: string
}

// 🟢 Reactive data
const orders = ref<Order[]>([])
const isLoading = ref(true)
const isNotificationsSlideoverOpen = ref(false)

// 🟢 Fetch orders from your backend
onMounted(async () => {
  const { data, error } = await useFetch<Order[]>('http://localhost:5000/api/orders')
  if (data.value) orders.value = data.value
  isLoading.value = false
})

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

// 🟢 Define table columns
const columns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Customer Email' },
  { accessorKey: 'amount', header: 'Amount ($)' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Date' }
]

// 🟢 Example dropdown menu items
const items = [
  [
    { label: 'Add Order', icon: 'i-lucide-plus', to: '/orders/new' },
    { label: 'Export Orders', icon: 'i-lucide-download', click: () => alert('Exporting...') }
  ]
]
</script>

<template>
  <UDashboardPanel id="orders">
    <template #header>
      <UDashboardNavbar title="Orders" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            icon="i-lucide-search"
            placeholder="Search orders..."
            class="w-64"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <OrderStats :period="period" :range="range" />
      <OrderChart :period="period" :range="range" />
      <OrderSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
