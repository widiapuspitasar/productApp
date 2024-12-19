import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRevenueStore } from './revenueStore';

export const useTargetStore = defineStore('target', () => {
  // State untuk target revenue dan persentase target
  const targetRevenue = ref<number>(100000000); // Default target revenue
  const targetPercentage = ref<number>(0); // Persentase target yang tercapai

  // Mengakses store revenue untuk total revenue
  const revenueStore = useRevenueStore();

  // Action untuk mengatur target revenue
  const setTargetRevenue = (value: number) => {
    targetRevenue.value = value;
    calculateTargetPercentage();
  };

  // Menghitung persentase target revenue yang tercapai
  const calculateTargetPercentage = () => {
    // Safely get the total revenue value
    const totalRevenueValue = revenueStore.totalRevenue;
    
    if (totalRevenueValue > 0 && targetRevenue.value > 0) {
      targetPercentage.value = (totalRevenueValue / targetRevenue.value) * 100;
    } else {
      targetPercentage.value = 0;
    }
  };

  return {
    targetRevenue,
    targetPercentage,
    setTargetRevenue,
    calculateTargetPercentage,
  };
});