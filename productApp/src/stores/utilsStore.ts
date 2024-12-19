import { defineStore } from "pinia";

export const useUtilsStore = defineStore("utils", {
  actions: {
    formatCurrency(amount: number, currency: string = "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount);
    },
  },
});