<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const toast = useToast()
const emit = defineEmits(['product-updated', 'close'])

const props = defineProps({
  product: { type: Object, required: true },
  show: { type: Boolean, default: false }
})

// --- Watch the modal open state ---
watch(() => props.show, (val) => (open.value = val))
watch(open, (val) => {
  if (!val) emit('close')
})

// --- API base ---
const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:5000'

// --- Validation schema ---
const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.any().optional(),
  active: z.boolean().default(true)
})

// --- Form state (prefilled from props.product) ---
const state = reactive({
  name: props.product.name,
  description: props.product.description,
  price: props.product.price,
  image: null as File | null,
  active: props.product.active
})

// --- Watch for product changes ---
watch(() => props.product, (p) => {
  state.name = p.name
  state.description = p.description
  state.price = p.price
  state.active = p.active
  state.image = null
})

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input?.files?.[0]) state.image = input.files[0]
}

// --- Submit handler ---
async function onSubmit(e: FormSubmitEvent<z.infer<typeof schema>>) {
  const form = new FormData()

  // append data
  Object.entries(e.data).forEach(([k, v]) => {
    if (k !== 'image' && v != null) form.append(k, v as any)
  })

  if (state.image) form.append('image', state.image)

  try {
    const updatedProduct = await $fetch(`${apiBase}/api/products/${props.product.id}`, {
      method: 'PUT',
      body: form
    })

    toast.add({
      title: 'Success',
      description: `Product "${e.data.name}" updated`,
      color: 'success'
    })

    emit('product-updated', updatedProduct)
    open.value = false
  } catch (err) {
    console.error(err)
    toast.add({
      title: 'Error',
      description: 'Failed to update product',
      color: 'error'
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="`Edit ${state.name}`">
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-3">
        <UFormField label="Name"><UInput v-model="state.name" /></UFormField>
        <UFormField label="Description"><UTextarea v-model="state.description" /></UFormField>
        <UFormField label="Price"><UInput v-model.number="state.price" type="number" /></UFormField>

        <UFormField label="Current Image" v-if="props.product.image">
          <img
            :src="`${apiBase}${props.product.image}`"
            alt="Current image"
            class="w-24 h-24 rounded object-cover border"
          />
        </UFormField>

        <UFormField label="Replace Image">
          <UInput type="file" accept="image/*" @change="handleFileChange" />
        </UFormField>

        <UCheckbox v-model="state.active" label="Active" />

        <div class="flex justify-end gap-2">
          <UButton label="Cancel" variant="subtle" @click="open = false" />
          <UButton type="submit" label="Save Changes" color="primary" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
