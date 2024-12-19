import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUtilsStore } from './utilsStore';

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  colorId: number;
  stock: number;
}

interface Transaction {
  id: number;
  productId: number;
  count: number;
  customerId: number;
  time: string;
  product: Product;
}

export const useRevenueStore = defineStore('revenue', () => {
  const transactions = ref<Transaction[]>([]);
  const repeatOrdersPercentage = ref<number>(0);
  const totalRevenue = ref<number>(0);
  const totalAov = ref<number>(0);
  const totalCost = ref<number>(50000000); 
  const profitMargin = ref<number>(0); 

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://product-db-git-main-widiapuspitasars-projects.vercel.app/transactions?_expand=product');
      const data: Transaction[] = await response.json();

      console.log('Fetched Transactions:', data);

      transactions.value = data;
      calculateRepeatOrdersAndRevenue();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateRepeatOrdersAndRevenue = () => {
    const customerOrders = transactions.value.reduce((acc, transaction) => {
      if (!acc[transaction.customerId]) {
        acc[transaction.customerId] = 0;
      }
      acc[transaction.customerId]++;
      return acc;
    }, {} as Record<number, number>);

    const totalCustomers = Object.keys(customerOrders).length;
    const totalTransactions = transactions.value.length;

    const repeatOrders = Object.values(customerOrders).filter(orderCount => orderCount > 1).length;
    repeatOrdersPercentage.value = (repeatOrders / totalCustomers) * 100;

    totalRevenue.value = transactions.value.reduce((total, transaction) => {
      if (transaction.product) {
        return total + transaction.count * transaction.product.price;
      }
      return total;
    }, 0);

    totalAov.value = totalRevenue.value / totalTransactions;

    if (totalRevenue.value > 0 && totalCost.value > 0) {
      const profit = totalRevenue.value - totalCost.value;
      profitMargin.value = (profit / totalRevenue.value) * 100;
    }
  };

  const getFormattedRevenue = (currency: string = 'USD') => {
    const utilsStore = useUtilsStore();
    return utilsStore.formatCurrency(totalRevenue.value, currency);
  };

  const getFormattedAov = (currency: string = 'USD') => {
    const utilsStore = useUtilsStore();
    return utilsStore.formatCurrency(totalAov.value, currency);
  };

  const getFormattedProfitMargin = () => {
    return `${profitMargin.value.toFixed(2)}%`;
  };

  return {
    transactions,
    repeatOrdersPercentage,
    totalRevenue,
    totalAov,
    totalCost,
    profitMargin,
    fetchTransactions,
    calculateRepeatOrdersAndRevenue,
    getFormattedRevenue,
    getFormattedAov,
    getFormattedProfitMargin, 
  };
});
