<template>
  <div class="file-upload-container">
    <input type="file" @change="handleFileUpload" accept=".csv" />
    <button @click="exportToPDF">Export to PDF</button>

    <div v-if="comparisonResults.length" class="comparison-results">
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
import html2pdf from 'html2pdf.js';
import nis2Data from '../assets/nis2-data.json';
import NisNaNViz from './NisNaNViz.vue';

export default {
  name: 'FileUpload',
  components: {
    NisNaNViz,
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
    exportToPDF() {
      this.$nextTick(() => {
        const element = this.$el;
        const opt = {
          margin: 1,
          filename: 'comparison_results.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(opt).from(element).save();
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
        Notes: row.Notes,
      }));
      this.compareData();
    },
    compareData() {
      this.comparisonResults = this.processedData
        .map((item) => {
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
        })
        .filter((item) => item !== null);

      this.filteredResults = [...this.comparisonResults];
    },
    getPercentage(points) {
      const [achieved, total] = points.split('/').map(Number);
      return (achieved / total) * 100;
    },
    getColor(status) {
      if (status === 'Completed') return 'var(--primary-color)';
      if (status === 'To Address') return 'var(--secondary-color)';
      return 'var(--calcite)';
    },
    handleChartClick(chartData) {
      if (chartData.type === 'bar') {
        if (chartData.value === 'All') {
          this.filteredResults = this.comparisonResults.filter((item) => item.NIS2Score !== 0);
        } else {
          this.filteredResults = this.comparisonResults.filter((item) => {
            if (item.Article21) {
              const articles = item.Article21.split(',');
              return articles.includes(chartData.value.article) && item.Status === chartData.value.status && item.NIS2Score !== 0;
            }
            return false;
          });
        }
      } else if (chartData.type === 'pie') {
        if (chartData.value === 'Not Recommended') {
          this.filteredResults = this.comparisonResults.filter((item) => item.NIS2Score === 0);
        } else {
          const nis2Score = chartData.value === 'Implicit' ? 1 : 2;
          this.filteredResults = this.comparisonResults.filter((item) => item.NIS2Score === nis2Score);
        }
      } else if (chartData.type === 'license') {
        const hasLicense = chartData.value === '1';
        this.filteredResults = this.comparisonResults.filter((item) => item.HasLicense === hasLicense && item.NIS2Score !== 0);
      } else if (chartData.type === 'deployment') {
        const status = chartData.value === 'Deployed' ? 'Completed' : 'To address';
        this.filteredResults = this.comparisonResults.filter((item) => item.Status === status && item.NIS2Score !== 0);
      }
    },
  },
};
</script>

<style>
.file-upload-container {
  background-color: var(--white);
  color: var(--text-color);
  padding: 20px;
  font-family: 'Everett', sans-serif;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.file-upload-container input[type="file"],
.file-upload-container button {
  margin-bottom: 20px;
}

.comparison-results {
  margin-top: 30px;
}

.result-item {
  background-color: var(--calcite);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: var(--text-color);
}

.progress-bar {
  width: 100%;
  background-color: var(--secondary-color);
  height: 20px;
  border-radius: 5px;
}

.progress-bar div {
  height: 100%;
  border-radius: 5px;
}

h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 300;
}

strong {
  font-weight: 600;
}
</style>