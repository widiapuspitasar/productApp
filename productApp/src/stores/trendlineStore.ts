import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRevenueStore } from './revenueStore';

interface Trendline {
  year: number;
  revenue: number;
}

export const useTrendlineStore = defineStore('trendline', () => {
  const trendlineData = ref<Trendline[]>([]); 
  const revenueStore = useRevenueStore();

  const calculateAnnualRevenue = () => {
    const revenueByYear: Record<number, number> = {};
  
    if (!revenueStore.transactions || revenueStore.transactions.length === 0) {
      console.warn('No transactions available');
      return;
    }
  
    revenueStore.transactions.forEach(transaction => {
      const [day, month, year] = transaction.time.split('/').map(Number);
      
      const transactionDate = new Date(year, month - 1, day);
      
      if (transactionDate && transaction.product) {
        const revenue = transaction.count * transaction.product.price;
        
        if (!revenueByYear[year]) {
          revenueByYear[year] = 0;
        }
        
        revenueByYear[year] += revenue;
      }
    });
  
    trendlineData.value = Object.entries(revenueByYear)
      .map(([year, revenue]) => ({
        year: Number(year),
        revenue: revenue
      }))
      .sort((a, b) => a.year - b.year);
  
    console.log('Trendline Data:', trendlineData.value);
  };
  
  

  return {
    trendlineData,
    calculateAnnualRevenue,
  };
});
