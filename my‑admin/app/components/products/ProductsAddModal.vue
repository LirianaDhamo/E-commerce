<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const toast = useToast()
const emit = defineEmits(['product-added']) // 👈 notify parent when product is added

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.any().optional(),
  active: z.boolean().default(true)
})

const state = reactive({
  name: '',
  description: '',
  price: 0,
  image: null as File | null,
  active: true
})

async function onSubmit(e: FormSubmitEvent<z.infer<typeof schema>>) {
  const form = new FormData()

  // ✅ append everything except the image first
  Object.entries(e.data).forEach(([k, v]) => {
    if (k !== 'image' && v != null) form.append(k, v as any)
  })

  // ✅ append image only if it exists
  if (state.image) form.append('image', state.image)

  try {
    const newProduct = await $fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: form
    })

    toast.add({
      title: 'Success',
      description: `Product "${e.data.name}" added`,
      color: 'success'
    })

    emit('product-added', newProduct) // 👈 send the product to the parent
    open.value = false
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Failed to add product',
      color: 'error'
    })
  }
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input?.files?.[0]) state.image = input.files[0]
}
</script>

<template>
  <UModal v-model:open="open" title="New Product">
    <UButton label="New Product" icon="i-lucide-plus" />
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-3">
        <UFormField label="Name"><UInput v-model="state.name" /></UFormField>
        <UFormField label="Description"><UTextarea v-model="state.description" /></UFormField>
        <UFormField label="Price"><UInput v-model.number="state.price" type="number" /></UFormField>
        <UFormField label="Image">
          <UInput type="file" accept="image/*" @change="handleFileChange" />
        </UFormField>
        <UCheckbox v-model="state.active" label="Active" />
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" variant="subtle" @click="open = false" />
          <UButton type="submit" label="Create" color="primary" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
