import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRevenueStore } from './revenueStore';

interface Trendline {
  year: number;
  revenue: number;
}

export const useTrendlineStore = defineStore('trendline', () => {
  const trendlineData = ref<Trendline[]>([]); // Untuk menyimpan data revenue per tahun
  const revenueStore = useRevenueStore();

  // Action untuk menghitung total revenue per tahun
  const calculateAnnualRevenue = () => {
    const revenueByYear: Record<number, number> = {};
  
    // Ensure transactions are available
    if (!revenueStore.transactions || revenueStore.transactions.length === 0) {
      console.warn('No transactions available');
      return;
    }
  
    revenueStore.transactions.forEach(transaction => {
      // Parse the date manually to handle "MM/DD/YYYY" format
      const [day, month, year] = transaction.time.split('/').map(Number);
      
      // Create a valid Date object
      const transactionDate = new Date(year, month - 1, day);
      
      // Validate date and product
      if (transactionDate && transaction.product) {
        const revenue = transaction.count * transaction.product.price;
        
        if (!revenueByYear[year]) {
          revenueByYear[year] = 0;
        }
        
        revenueByYear[year] += revenue;
      }
    });
  
    // Convert to trendline data
    trendlineData.value = Object.entries(revenueByYear)
      .map(([year, revenue]) => ({
        year: Number(year),
        revenue: revenue
      }))
      .sort((a, b) => a.year - b.year);
  
    // Log for debugging
    console.log('Trendline Data:', trendlineData.value);
  };
  
  

  return {
    trendlineData,
    calculateAnnualRevenue,
  };
});
