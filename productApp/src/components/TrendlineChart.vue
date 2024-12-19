<script setup lang="ts">
import { defineProps, ref, onMounted, watch, nextTick } from 'vue';
import { Chart as ChartJS, Chart, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, LineController, type ScriptableContext } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  LineController 
);

interface Trendline {
  year: number;
  revenue: number;
}

const props = defineProps({
  data: {
    type: Array as () => Trendline[],
    required: true,
  },
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createGradient = (ctx: CanvasRenderingContext2D, chartArea: { bottom: number; top: number }) => {
  if (!chartArea) return undefined; 
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.7)');
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
  return gradient;
};


const initializeChart = async () => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    if (ctx) {
      if (chart) {
        chart.destroy(); 
      }

      chart = new Chart(chartRef.value, {
        type: 'line',
        data: {
          labels: props.data.map((d) => d.year.toString()),
          datasets: [
            {
              label: 'Revenue per Year',
              data: props.data.map((d) => d.revenue),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: (context: ScriptableContext<'line'>) => {
                const chart = context.chart; 
                const chartArea = chart.chartArea;
                if (!chartArea) return undefined;
                return createGradient(chart.ctx, chartArea);
              },

              borderWidth: 3,
              pointBackgroundColor: 'rgb(75, 192, 192)',
              pointBorderColor: 'white',
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: 'rgb(75, 192, 192)',
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: true,
              tension: 0.4, 
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Revenue Trendline',
              color: 'white',
              font: {
                size: 18,
                family: 'Poppins, sans-serif',
                weight: 'bold',
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: 'white',
              bodyColor: 'lightgray',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  family: 'Poppins, sans-serif',
                },
              },
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  family: 'Poppins, sans-serif',
                },
                callback: function (value) {
                  return new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(Number(value));
                },
              },
              beginAtZero: false,
              min: 10000000, 
            },
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
          },
        },
        plugins: [
          {
            afterDraw: (chart) => {
              const ctx = chart.ctx;
              const xAxis = chart.scales['x'];
              const yAxis = chart.scales['y'];

              const currentYear = new Date().getFullYear();
              const currentYearIndex = props.data.findIndex((d) => d.year === currentYear);

              if (currentYearIndex !== -1) {
                const x = xAxis.getPixelForValue(currentYearIndex);
                ctx.beginPath();
                ctx.moveTo(x, yAxis.top);
                ctx.lineTo(x, yAxis.bottom);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            },
            id: ''
          },
        ],
      });
    }
  }
};

onMounted(async () => {
  await nextTick();
  await initializeChart(); 
});

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data.labels = newData.map((d) => d.year.toString());
    chart.data.datasets[0].data = newData.map((d) => d.revenue);
    chart.update();
  }
});
</script>

<template>
  <div
    class="chart-container"
    style="height: 400px; background-color: #090B31; border-radius: 12px; padding: 10px;">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
</style>
