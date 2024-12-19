import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRevenueStore } from './revenueStore';

export const useTargetStore = defineStore('target', () => {
  const targetRevenue = ref<number>(100000000); 
  const targetPercentage = ref<number>(0); 

  const revenueStore = useRevenueStore();

  const setTargetRevenue = (value: number) => {
    targetRevenue.value = value;
    calculateTargetPercentage();
  };

  const calculateTargetPercentage = () => {
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