<template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".csv" />

    <div v-if="comparisonResults.length">
      <h2>Comparison Results</h2>
      <NisNaNViz :comparison-results="filteredResults" @chart-click="handleChartClick" />

      <div v-for="result in filteredResults" :key="result.RecommendedAction" class="result-item">
        <p><strong>Recommended Action:</strong> {{ result.RecommendedAction }}</p>
        <p><strong>Status:</strong> {{ result.Status }}</p>
        <p><strong>Points Achieved:</strong> {{ result.PointsAchieved }}</p>
        <div class="progress-bar">
          <div :style="{ width: getPercentage(result.PointsAchieved) + '%', backgroundColor: getColor(result.Status) }"></div>
        </div>
        <p><strong>NIS2 Score:</strong> {{ result.NIS2Score }}</p>
        <p><strong>Article 21:</strong> {{ result.Article21 }}</p>
        <p><strong>Rationale:</strong> {{ result.Rationale }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
import nis2Data from '../assets/nis2-data.json';
import NisNaNViz from './NisNaNViz.vue';

export default {
  name: 'FileUpload',
  components: {
    NisNaNViz
  },
  data() {
    return {
      processedData: [],
      comparisonResults: [],
      filteredResults: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.readFile(file);
    },
    readFile(file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.processData(result.data);
        },
      });
    },
    processData(data) {
      this.processedData = data.map((row) => ({
        Rank: row.Rank,
        RecommendedAction: row['Recommended action'],
        ScoreImpact: row['Score impact'],
        PointsAchieved: row['Points achieved'],
        Status: row.Status,
        Regressed: row.Regressed,
        HasLicense: row['Have license?'] === 'Yes',
        Category: row.Category,
        Product: row.Product,
        LastSynced: row['Last synced'],
        MicrosoftUpdate: row['Microsoft update'],
        Notes: row.Notes
      }));
      this.compareData();
    },
    compareData() {
      this.comparisonResults = this.processedData.map((item) => {
        const nis2Item = nis2Data.find((nis2) => nis2.RecommendedAction === item.RecommendedAction);

        if (!nis2Item || nis2Item.NIS2Score === '0') {
          return null;
        }

        return {
          ...item,
          NIS2Score: nis2Item.NIS2Score,
          Article21: nis2Item.Article21,
          Rationale: nis2Item.Rationale,
        };
      }).filter(item => item !== null);

      this.filteredResults = [...this.comparisonResults];
    },
    getPercentage(points) {
      const [achieved, total] = points.split('/').map(Number);
      return (achieved / total) * 100;
    },
    getColor(status) {
      if (status === 'Completed') return 'green';
      if (status === 'To Address') return 'red';
      return 'gray';
    },
    handleChartClick(filterValue) {
      if (filterValue === 'All') {
        this.filteredResults = [...this.comparisonResults];
      } else {
        this.filteredResults = this.comparisonResults.filter(item => item.Status === filterValue);
      }
    }
  },
};
</script>


<style>
.app-container {
  background-color: #222; /* Dark background */
  color: #eee; /* Light text color */
  padding: 20px;
  font-family: sans-serif;
}

.file-upload {
  margin-bottom: 20px; 
}

.charts-section {
  display: flex; 
  justify-content: space-around; 
}

.pie-chart-container, .bar-chart-container {
  width: 45%; 
}

.results-list {
  margin-top: 30px;
}

.result-item {
  background-color: #80d0ff; 
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.progress-bar {
  width: 100%; 
  background-color: #e0e0e0;
  height: 20px;
}

.progress-bar div {
  height: 100%;
}
</style>
