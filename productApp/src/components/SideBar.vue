<script setup lang="ts">
import { RectangleGroupIcon, HomeIcon, ChevronDownIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const showCategoryModal = ref<boolean>(false);
const showTableModal = ref<boolean>(false);

const router = useRouter();

const navigateTo = (path: string): void => {
  router.push(path);
};

const closeAllModals = (): void => {
  showCategoryModal.value = false;
  showTableModal.value = false;
}

const handleOutsideClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (!target.closest(".modal-trigger")) {
    closeAllModals();
  }
};

onMounted(() =>{
  document.addEventListener("click", handleOutsideClick);
})

onUnmounted(()=> {
  document.removeEventListener("click", handleOutsideClick);
})

</script>

<template>
  <div class="p-4 bg-backgroundBlue text-customWhite h-screen w-42 rounded-r-lg relative">
    <h1 class="pb-12 text-2xl font-poppins font-bold">ProductApp</h1>
    <div class="flex flex-col gap-4">
      <div class="items-center flex flex-row gap-2 text-xl">
        <HomeIcon class="h-8 w-8 text-customWhite" />
        <p>Home</p>
      </div>

      <!-- Category Product -->
      <div class="relative modal-trigger">
        <div class="flex flex-row items-center gap-2 text-xl cursor-pointer" @click="showCategoryModal = !showCategoryModal">
          <RectangleGroupIcon class="h-8 w-8 text-customWhite" />
          <p>Category Product</p>
          <ChevronDownIcon class="h-6 w-6 text-center" />
        </div>
        <!-- Modal -->
        <div
          v-if="showCategoryModal"
          class="absolute top-full right-0 mt-2 w-48 bg-backgroundCream text-black rounded-lg shadow-lg z-10"
        >
          <ul class="py-2">
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('/category/electronics')"
            >
              Electronics
            </li>
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('/category/clothing')"
            >
              Clothing
            </li>
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('/category/others')"
            >
              Others
            </li>
          </ul>
        </div>
      </div>

      <!-- Table List Product -->
      <div class="relative modal-trigger">
        <div class="items-center flex flex-row gap-2 text-xl cursor-pointer" @click="showTableModal = !showTableModal">
          <TableCellsIcon class="h-8 w-8 text-customWhite" />
          <p>Table Product</p>
          <ChevronDownIcon class="h-6 w-6 text-center" />
        </div>
        <!-- Modal -->
        <div
          v-if="showTableModal"
          class="absolute top-full right-0 mt-2 w-48 bg-backgroundCream text-black rounded-lg shadow-lg z-10"
        >
          <ul class="py-2">
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('/table/products')"
            >
              Products Table
            </li>
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('/table/sales')"
            >
              Sales Data
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
