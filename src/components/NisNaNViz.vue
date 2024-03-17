<template>
  <div>
    <div class="pie-chart-container" ref="pieChart"></div>
    <div class="pie-chart-container" ref="deploymentPieChart"></div>
    <div class="bar-chart-container" ref="barChart"></div>
    <div class="sankey-container" ref="sankeyDiagram"></div>
    <div class="license-chart-container" ref="licenseChart"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';

export default {
  props: {
    comparisonResults: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.renderPieChart();
    this.renderDeploymentPieChart();
    this.renderBarChart();
    this.renderSankey();
    this.renderLicenseChart();
  },
  methods: {
    renderPieChart() {
      const pieChartData = this.calculatePieChartData();

      const layout = {
        title: 'NIS2 Explicit vs Implicit Recommended Actions',
        font: {
          size: 14,
        },
      };

      Plotly.newPlot(this.$refs.pieChart, pieChartData.data, layout).then((plot) => {
        plot.on('plotly_click', (data) => {
          const pointData = data.points[0];
          const filterValue = pointData.label;
          this.$emit('chart-click', { type: 'pie', value: filterValue });
        });
      });
    },
    calculatePieChartData() {
  let implicitCount = 0;
  let explicitCount = 0;
  let notRecommendedCount = 0;

  this.comparisonResults.forEach((item) => {
    if (item.NIS2Score === 1) {
      implicitCount++;
    } else if (item.NIS2Score === 2) {
      explicitCount++;
    } else if (item.NIS2Score === 0) {
      notRecommendedCount++;
    }
  });

  return {
    data: [
      {
        values: [implicitCount, explicitCount, notRecommendedCount],
        labels: ['Implicit', 'Explicit', 'Not Recommended'],
        type: 'pie',
        marker: {
          colors: ['#1f77b4', '#ff7f0e', '#2ca02c'],
        },
        textinfo: 'value',
        hoverinfo: 'label+percent',
      },
    ],
  };
},
    renderBarChart() {
      const barChartData = this.calculateBarChartData();

      const layout = {
        title: 'Article 21 Completion Status',
        xaxis: {
          title: 'Article',
        },
        yaxis: {
          title: 'Count',
        },
        barmode: 'group',
      };

      Plotly.newPlot(this.$refs.barChart, barChartData.data, layout).then((plot) => {
    plot.on('plotly_click', (data) => {
      const pointData = data.points[0];
      const article = pointData.x;
      const status = pointData.data.name;
      this.$emit('chart-click', { type: 'bar', value: { article, status } });
    });
  });
},
calculateDeploymentPieChartData() {
  let completedCount = 0;
  let toAddressCount = 0;

  this.comparisonResults.forEach((item) => {
    if (item.NIS2Score === 1 || item.NIS2Score === 2) {
      if (item.Status === 'Completed') {
        completedCount++;
      } else if (item.Status === 'To address') {
        toAddressCount++;
      }
    }
  });

  return {
    data: [
      {
        values: [completedCount, toAddressCount],
        labels: ['Deployed', 'Not Deployed'],
        type: 'pie',
        marker: {
          colors: ['green', 'red'],
        },
        textinfo: 'value',
        hoverinfo: 'label+percent',
      },
    ],
  };
},

renderDeploymentPieChart() {
  const deploymentPieChartData = this.calculateDeploymentPieChartData();

  const layout = {
    title: 'Deployment Status',
    font: {
      size: 14,
    },
  };

  Plotly.newPlot(this.$refs.deploymentPieChart, deploymentPieChartData.data, layout).then((plot) => {
    plot.on('plotly_click', (data) => {
      const pointData = data.points[0];
      const filterValue = pointData.label;
      this.$emit('chart-click', { type: 'deployment', value: filterValue });
    });
  });
},
    calculateBarChartData() {
      const articleDeploymentStatus = {
        A: { Completed: 0, 'To address': 0 },
        B: { Completed: 0, 'To address': 0 },
        C: { Completed: 0, 'To address': 0 },
        D: { Completed: 0, 'To address': 0 },
        E: { Completed: 0, 'To address': 0 },
        F: { Completed: 0, 'To address': 0 },
        G: { Completed: 0, 'To address': 0 },
        H: { Completed: 0, 'To address': 0 },
        I: { Completed: 0, 'To address': 0 },
        J: { Completed: 0, 'To address': 0 },
      };

      this.comparisonResults.forEach((item) => {
        if (item.Article21) {
          const articles = item.Article21.split(',');
          articles.forEach((article) => {
            if (articleDeploymentStatus[article]) {
              articleDeploymentStatus[article][item.Status]++;
            }
          });
        }
      });

      const x = Object.keys(articleDeploymentStatus);
      const completedData = x.map((article) => articleDeploymentStatus[article]['Completed']);
      const toAddressData = x.map((article) => articleDeploymentStatus[article]['To address']);

      return {
        data: [
          {
            x,
            y: completedData,
            name: 'Completed',
            type: 'bar',
            marker: { color: 'green' },
          },
          {
            x,
            y: toAddressData,
            name: 'to Address',
            type: 'bar',
            marker: { color: 'red' },
          },
        ],
      };
    },
    renderSankey() {
      const sankeyData = this.calculateSankeyData();

      const data = {
        type: 'sankey',
        orientation: 'h',
        node: {
          pad: 15,
          thickness: 30,
          line: {
            color: 'black',
            width: 0.5,
          },
          label: sankeyData.nodes,
          color: 'blue',
        },
        link: {
          source: sankeyData.sources,
          target: sankeyData.targets,
          value: sankeyData.values,
        },
      };

      const layout = {
        title: 'Sankey Diagram',
        font: {
          size: 10,
        },
      };

      Plotly.newPlot(this.$refs.sankeyDiagram, [data], layout);
    },
    calculateSankeyData() {
      const nodes = [];
      const sources = [];
      const targets = [];
      const values = [];

      this.comparisonResults.forEach((item) => {
        if (!nodes.includes(item.Category)) {
          nodes.push(item.Category);
        }
        if (!nodes.includes(item.NIS2Score)) {
          nodes.push(item.NIS2Score);
        }
        const sourceIndex = nodes.indexOf(item.Category);
        const targetIndex = nodes.indexOf(item.NIS2Score);
        sources.push(sourceIndex);
        targets.push(targetIndex);
        values.push(1);
      });

      return {
        nodes,
        sources,
        targets,
        values,
      };
    },
    renderLicenseChart() {
      const licenseChartData = this.calculateLicenseChartData();

      const layout = {
        title: 'License Status by NIS2 Score',
        xaxis: {
          title: 'NIS2 Score',
        },
        yaxis: {
          title: 'Count',
        },
        barmode: 'group',
      };

      Plotly.newPlot(this.$refs.licenseChart, licenseChartData.data, layout).then((plot) => {
        plot.on('plotly_click', (data) => {
          const pointData = data.points[0];
          const filterValue = pointData.x;
          this.$emit('chart-click', { type: 'license', value: filterValue });
        });
      });
    },
    calculateLicenseChartData() {
      const licenseStatus = {
        '1': { 'With License': 0, 'Without License': 0 },
        '2': { 'With License': 0, 'Without License': 0 },
      };

      this.comparisonResults.forEach((item) => {
        if (item.NIS2Score === 1 || item.NIS2Score === 2) {
          const licenseKey = item.HasLicense ? 'With License' : 'Without License';
          licenseStatus[item.NIS2Score][licenseKey]++;
        }
      });

      const x = ["1", "2"];
      const withLicenseData = x.map((score) => licenseStatus[score]['With License']);
      const withoutLicenseData = x.map((score) => licenseStatus[score]['Without License']);

      return {
        data: [
          {
            x,
            y: withLicenseData,
            name: 'With License',
            type: 'bar',
          },
          {
            x,
            y: withoutLicenseData,
            name: 'Without License',
            type: 'bar',
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.pie-chart-container {
  width: 100%;
  height: 400px;
}
.bar-chart-container {
  width: 100%;
  height: 600px; /* Adjust the height as needed */
}
</style>