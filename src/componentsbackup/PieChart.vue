<template>
  <canvas ref="chart"></canvas> 
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js'; 
Chart.register(ArcElement, Tooltip, Legend, PieController); 

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
        type: 'pie',
        data: this.chartData,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'NIS2 Mandatory vs Strategic' 
            },
            legend: {
              position: 'bottom' // Customize as needed 
            }
          }
        },
      });
    },
  },
};
</script>     
