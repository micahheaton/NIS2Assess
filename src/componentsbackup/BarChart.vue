<template>
  <canvas ref="chart"></canvas>
</template>

<script>
import { Chart, BarElement, BarController, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'; 
Chart.register(BarElement, BarController, Tooltip, Legend, CategoryScale, LinearScale); 

export default {
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    this.renderChart();
  },

  watch: {
    chartData() {
      this.renderChart();
    },
  },

  methods: {
    renderChart() {
      const ctx = this.$refs.chart.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: { 
          labels: this.chartData.labels,
          datasets: [
            {
              label: 'Deployed', 
              data: this.chartData.datasets[0].data,
              backgroundColor: 'black' 
            }, 
            {
              label: 'Not Deployed', 
              data: this.chartData.datasets[1].data,
              backgroundColor: 'red' 
            }
          ]
        }, 
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Article 21 Influence Weighting' 
            }
          } 
        },
      });
    },
  },
};
</script>
