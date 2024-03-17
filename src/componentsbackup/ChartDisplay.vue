<template>
  <div class="chart-container">
    <div class="pie-chart-container">
      <PieChart :chart-data="chartData.pieChartData" />
    </div>
    <div class="bar-chart-container">
      <BarChart :chart-data="chartData.barChartData" :key="barChartKey" />
      <div class="bar-chart-legend"></div>   
    </div>
  </div>
</template>

<script>
import PieChart from './PieChart.vue';
import BarChart from './BarChart.vue';

export default {
  name: 'ChartDisplay',
  components: {
    PieChart,
    BarChart,
  },

  props: {
    comparisonResults: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      chartData: {
        pieChartData: null, 
        barChartData: null, 
      },
      barChartKey: 0,
    };
  },

  watch: {
    comparisonResults: {
      immediate: true, 
      handler() {
        this.calculateChartData(); 
      },
    },
  },

  methods: {
    calculateChartData() {
      let pieChartData = {
        labels: ['Strategic', 'Mandatory'],
        datasets: [
          {
            data: [0, 0],
             backgroundColor: [
      'blue', // Strategic
      'red'   // Mandatory
             ] 
          },
        ],
      };

      let barChartData = {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        datasets: [
          {
    label: 'Deployed',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: 'black'
  }, 
  {
    label: 'Not Deployed',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: 'red'
  },
        ],
      };

      this.comparisonResults.forEach((result) => {
        // Pie Chart Logic
        if (result.NIS2Score === 1) {
          pieChartData.datasets[0].data[0]++;
        } else if (result.NIS2Score === 2) {
          pieChartData.datasets[0].data[1]++;
        }

        // Bar Chart Logic
        console.log('Article 21 for this result:', result.Article21);
        result.Article21.split(',').forEach((articleLetter) => {
          const charCode = articleLetter.charCodeAt(0);
          let index = charCode - 'A'.charCodeAt(0);

          if (index >= 0 && index <= 9) {
            console.log(
              'Article Letter:',
              articleLetter,
              'Index:',
              index,
              'Status:',
              result.Status
            );

            if (result.Status === 'Completed') {
              barChartData.datasets[0].data[index]++;
            } else {
              barChartData.datasets[1].data[index]++;
            }
          } else {
            console.error('Invalid Article Letter:', articleLetter);
          }
        });
      });

      this.chartData.pieChartData = pieChartData; 
      this.chartData.barChartData = barChartData; 
    },
  },
};
</script>

<style>
.chart-container {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}

.pie-chart-container,
.bar-chart-container {
  width: 400px;
  height: 400px;
  border: 1px solid #ddd;
  padding: 10px;
}
.bar-chart-legend {
    margin-top: 20px; /* Space between the chart and the legend */
    border: 1px solid #ddd; 
    padding: 15px; 
}
</style>
