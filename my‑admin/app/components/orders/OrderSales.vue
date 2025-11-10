<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range, Sale } from '~/types'
import type { Order } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const UBadge = resolveComponent('UBadge')

const orders = ref<Order[]>([])

onMounted(async () => {
  const { data, error } = await useFetch<Order[]>('http://localhost:5000/api/orders')

  if (error.value) {
    console.error('Error fetching orders:', error.value)
  }

  orders.value = data.value || []
})

const columns: TableColumn<Order>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const rawAmount = row.getValue('amount')
      const amount = Number(rawAmount)
      const normalized = amount > 1000 ? amount / 100 : amount // auto-detect cents
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(normalized)
      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  }
]
const selectedOrder = ref<Order | null>(null)
const open = ref(false)

function openOrderModal(order: Order) {
  selectedOrder.value = order
  open.value = true
}

// Add this extra column for the "View Details" button
columns.push({
  header: 'Actions',
  cell: ({ row }) =>
    h(
      'button',
      {
        class: 'text-blue-600 hover:underline font-medium',
        onClick: () => openOrderModal(row.original),
      },
      'View Details'
    ),
})
</script>

<template>
  <UTable
    :data="orders"
    :columns="columns"
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  />
  <UModal v-model:open="open" title="Order Details" size="lg">
  <template #body>
    <div v-if="selectedOrder" class="space-y-4">
      <div>
        <p><strong>Order ID:</strong> #{{ selectedOrder.id }}</p>
        <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
        <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
        <p><strong>Total:</strong> €{{ (selectedOrder.amount / 100).toFixed(2) }}</p>
        <p><strong>Date:</strong> {{ new Date(selectedOrder.createdAt).toLocaleString() }}</p>
      </div>

      <hr />

      <div>
        <h3 class="text-lg font-semibold mb-2">Items</h3>
        <div
          v-for="(item, index) in selectedOrder.items"
          :key="index"
          class="border rounded-lg p-3 mb-2 flex justify-between items-center"
        >
          <div>
            <p><strong>Product:</strong> {{ item.product?.name || 'Unknown' }}</p>
            <p><strong>Quantity:</strong> {{ item.quantity }}</p>
          </div>
          <div class="text-right">
            <p>€{{ (item.price / 100).toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</UModal>
</template>
