<script setup lang="ts">
import SideBar from '../components/SideBar.vue'
import { defineComponent, onMounted, ref, onUnmounted } from 'vue';
import { useRevenueStore } from '../stores/revenueStore';
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import TrendlineChart from '../components/TrendlineChart.vue'
import { useTrendlineStore } from '../stores/trendlineStore';
import { useTargetStore  } from '../stores/targetStore';


const revenueStore = useRevenueStore();
const showYearModal = ref<boolean>(false);
const trendlineStore = useTrendlineStore();
const targetStore = useTargetStore();

onMounted(async () =>{
  await revenueStore.fetchTransactions();
  trendlineStore.calculateAnnualRevenue();
  document.addEventListener("click", handleOutsideClick)
});

const closeAllModals = (): void => {
  showYearModal.value = false;
}

const handleOutsideClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (!target.closest(".modal-trigger")) {
    closeAllModals();
  }
};

onUnmounted( () =>{
  document.removeEventListener("click", handleOutsideClick);
})

</script>

<template>
  <div class="flex flex-row bg-backgroundCream w-full">
    <SideBar class="w-1/5" />
    
    <div class=" relative flex flex-col justify-between h-fit p-8 w-full modal-trigger">
      <div class="relative  flex justify-end p-2" @click="showYearModal = !showYearModal">
        <div class="flex flex-row items-center">
          <CalendarDaysIcon class="h-12 w-12 text-backgroundBlue" />
          <p>Year's</p>
        </div>
        <div
          v-if="showYearModal"
          class="absolute top-full right-0  w-24 bg-backgroundCream text-black rounded-lg shadow-lg z-10"
        >
          <ul class="text-center text-lg  ">
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">all</li>
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">2020</li>
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">2021</li>
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">2022</li>
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">2023</li>
            <li class="hover:bg-backgroundBlue hover:text-customWhite p-2 rounded-lg  ">2024</li>
          </ul>
        </div>
      </div>

      <div class="flex flex-row justify-between w-full gap-10 text-center">
        <div class="bg-backgroundBlue text-customWhite rounded-lg p-4 w-full">
          <p class="font-bold text-xl">Total Revenue: </p>
          <p class="font-montserrat text-center text-xl pt-2">{{ revenueStore.getFormattedRevenue("USD") }}</p>
        </div>
        <div class="bg-backgroundBlue text-customWhite rounded-lg p-4 w-full">
          <p class="font-bold text-xl">Repeat Purchase: </p>
          <p class="font-montserrat text-center text-xl pt-2">{{ revenueStore.repeatOrdersPercentage.toFixed(2) }} %</p>
        </div>
        <div class="bg-backgroundBlue text-customWhite rounded-lg p-4 w-full">
          <p class="font-bold text-xl">AOV: </p>
          <p class="font-montserrat text-center text-xl pt-2">{{ revenueStore.getFormattedAov("USD") }}</p>
        </div>
        <div class="bg-backgroundBlue text-customWhite rounded-lg p-4 w-full">
          <p class="font-bold text-xl">Profit Margin: </p>
          <p class="font-montserrat text-xl pt-2">{{ revenueStore.getFormattedProfitMargin() }}</p>
        </div>
      </div>
      <div class="pt-8 w-1/2 h-1/2">
        <!-- Example: Display Revenue Trendline -->
        <TrendlineChart :data="trendlineStore.trendlineData" />
      </div>
      <p>Target Percentage Achieved: {{ targetStore.targetPercentage.toFixed(2) }}%</p>
    </div>
  </div>
</template>
