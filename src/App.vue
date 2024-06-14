<template>
  <div id="app">
    <div class="app-container">  
      <header>
        <h1>NIS2 Readiness Assessment</h1>
        <img class="header-logo" src="https://storage.pardot.com/931493/1707771196VmVYJBIh/BlueVoyantLockupCMYKCobalt.png" alt="BlueVoyant Logo" />
        <p>Welcome to the NIS2 Readiness Assessment, a tool designed to help you align your security configurations with the Top-Level NIS2 directive requirements.</p>
      </header>

      <section class="overview-section"> 
        <div class="overview-and-video">  
          <div class="about-tool">
           <h3>About This Tool</h3>
           <p>This tool analyzes your Secure Score configuration to evaluate your compliance with NIS2 requirements. Get actionable insights on how to strengthen your security posture.</p>
          </div>
          <div id="video-explanation">
           <h3>How It Works</h3>
             <iframe width="400" height="315" src="https://www.youtube.com/embed/00hMi9PYE4Y?si=XhseaRcTfX9tcYGW" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </section>  

      <section class="legend-section">
        <h2>Article Reference Guide</h2>
        <div class="legend-content">
          <ul>
            <li v-for="(description, letter) in articles" :key="letter">
              <b>{{ letter }}</b>: {{ description }}
            </li>
          </ul>
        </div>
      </section>

      <section id="file-upload">
        <h2>Get Started</h2>
        <p>Upload your Secure Score configuration file to see how it stacks up against NIS2 requirements.</p>
        <button class="upload-button">
          <img src="https://storage.pardot.com/931493/1707770955YJugoPNA/BlueVoyant_Symbol_RGB_Black.png" alt="Upload File">
        </button>
        <FileUpload /> 
      </section>

      <div class="loading-overlay" v-if="isLoading"> 
        <div class="loading-content">
          <p>Loading Microsoft Secure Score Data</p>
        </div>  
      </div> 
    </div>
  </div>
</template>

<script>
import FileUpload from './components/FileUpload.vue';

export default {
  name: 'App',
  components: {
    FileUpload
  },
  data() {
    return {
      articles: {
        'A': '(a) policies on risk analysis and information system security;',
        'B': '(b) incident handling;',
        'C': '(c) business continuity, such as backup management and disaster recovery, and crisis management;',
        'D': '(d) supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers;', 
        'E': '(e) security in network and information systems acquisition, development and maintenance, including vulnerability handling and disclosure;',
        'F': '(f) policies and procedures to assess the effectiveness of cybersecurity risk-management measures;',
        'G': '(g) basic cyber hygiene practices and cybersecurity training;',
        'H': '(h) policies and procedures regarding the use of cryptography and, where appropriate, encryption;',
        'I': '(i) human resources security, access control policies and asset management;',
        'J': '(j) the use of multi-factor authentication or continuous authentication solutions, secured voice, video and text communications and secured emergency communication systems within the entity, where appropriate.'
      },
      isLoading: false
    }
  }
}
</script>

<style>
:root {
  --primary-color: #0659FF; /* BV Blue */
  --secondary-color: #676BFB; /* Azurite */
  --white: #FFFFFF;
  --black: #000000;
  --calcite: #8DEDC7;
}

body {
  font-family: 'Everett', sans-serif;
}

#app {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); 
  min-height: 100vh; 
  color: var(--black) !important; 
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin: 40px auto;
  max-width: 900px; 
  background-color: var(--white);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); 
}

header {
  background-color: var(--white); 
  border-radius: 10px; 
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  padding: 20px 30px; 
  margin-bottom: 30px; 
  display: flex; 
  justify-content: center;
  align-items: center;
}

h1 {
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

p {
  font-size: 1rem; 
  line-height: 1.6;
  font-weight: 300;
}

.overview-section,
.legend-section {
  background-color: var(--white);
  padding: 30px;
  margin: 30px 0;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08); 
}

button {
  background-color: var(--primary-color); 
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600; 
  cursor: pointer;
  transition: background-color 0.2s ease; 
}

button:hover {
  background-color: #0056b3;
}

.header-logo {
  height: 225px;
  position: absolute;
  top: 10px; 
  left: 50%;
  transform: translateX(-50%);
}

.overview-and-video {
  display: flex;
  justify-content: space-around; 
}

.about-tool, 
#video-explanation {
  width: 45%; 
}

h3 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.upload-button {
  background: none; 
  border: none; 
  cursor: pointer;
  padding: 0; 
}

.upload-button img {
  height: 35px; 
} 

.loading-overlay {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex; 
  align-items: center;
  justify-content: center;
}

.loading-content {
  background-color: var(--white);
  padding: 20px;
  border-radius: 5px;
}

/* Add geometric shapes for brand imagery */
.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-color) 0%, var(--secondary-color) 100%),
              linear-gradient(45deg, var(--calcite) 25%, transparent 25%),
              linear-gradient(-45deg, var(--calcite) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, var(--calcite) 75%),
              linear-gradient(-45deg, transparent 75%, var(--calcite) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 0, 10px -10px, 0px 10px, -10px 10px;
  opacity: 0.1;
  z-index: -1;
}
</style>