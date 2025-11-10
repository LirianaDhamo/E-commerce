<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import type { Product } from '~/types'

// 🧩 Import modals
import ProductAddModal from '~/components/products/ProductsAddModal.vue'
import ProductUpdateModal from '~/components/products/ProductUpdateModal.vue'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

// 🧠 State for table
const columnFilters = ref([{ id: 'name', value: '' }])
const columnVisibility = ref()
const rowSelection = ref({})
const statusFilter = ref('all')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

// 🧠 Data
const { data, status } = await useFetch<Product[]>('http://localhost:5000/api/products', {
  lazy: false,
  default: () => [] // 👈 ensures data is always an array
})

// 🧩 Modal control
const editOpen = ref(false)
const selectedProduct = ref<Product | null>(null)

// 🗑️ Delete handler
async function deleteProduct(product: Product) {
  const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`)
  if (!confirmed) return

  try {
    await $fetch(`http://localhost:5000/api/products/${product.id}`, {
      method: 'DELETE'
    })

    if (data.value) {
      data.value = data.value.filter((p) => p.id !== product.id)
    }

    toast.add({
      title: 'Product deleted',
      description: `${product.name} has been deleted.`,
      color: 'success'
    })
  } catch (err) {
    console.error(err)
    toast.add({
      title: 'Delete failed',
      description: `Could not delete ${product.name}`,
      color: 'error'
    })
  }
}

// ⚙️ Row dropdown menu actions
function getRowItems(row: Row<Product>) {
  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'Copy Product ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Product ID copied to clipboard'
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Edit Product',
      icon: 'i-lucide-pencil',
      onSelect() {
        selectedProduct.value = row.original
        editOpen.value = true
      }
    },
    {
      label: 'Delete Product',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        await deleteProduct(row.original)
      }
    }
  ]
}

// 📋 Table columns
const columns: TableColumn<Product>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.image
            ? `http://localhost:5000${row.original.image}`
            : undefined,
          icon: !row.original.image ? 'i-lucide-package' : undefined,
          size: 'lg'
        }),
        h('div', null, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          row.original.description
            ? h('p', { class: 'text-sm text-muted truncate max-w-[180px]' }, row.original.description)
            : h('p', { class: 'text-sm text-muted italic' }, 'No description')
        ])
      ])
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `$${(row.original.price / 100).toFixed(2)}`
  },
  {
    accessorKey: 'active',
    header: 'Status',
    filterFn: 'equals',
    cell: ({ row }) => {
      const color = row.original.active ? 'success' : 'error'
      const text = row.original.active ? 'Active' : 'Inactive'
      return h(UBadge, { variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h('div', { class: 'text-right' },
        h(UDropdownMenu, {
          content: { align: 'end' },
          items: getRowItems(row)
        }, () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            class: 'ml-auto'
          })
        )
      )
  }
]

// 🧩 Status filter
watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return
  const statusColumn = table.value.tableApi.getColumn('active')
  if (!statusColumn) return
  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal === 'true')
  }
})
</script>

<template>
  <UDashboardPanel id="Products">
    <template #header>
      <UDashboardNavbar title="Products">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <ProductAddModal @product-added="data?.push($event)" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter products by name..."
          @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' }
            ]"
            placeholder="Filter by status"
            class="min-w-28"
          />

          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
      />

      <!-- 📦 Update Modal -->
      <ProductUpdateModal
        v-if="selectedProduct"
        :product="selectedProduct"
        :show="editOpen"
        @close="editOpen = false"
        @product-updated="(updated) => {
          const index = data.findIndex(p => p.id === updated.id)
          if (index !== -1) data[index] = updated
          editOpen = false
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} product(s) selected.
        </div>
        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
