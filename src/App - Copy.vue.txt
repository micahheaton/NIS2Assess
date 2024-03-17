<template>
  <div id="app">
    <div class="app-container">  
      <header>
        <h1>NIS2 Compliance Checker</h1>
        <img class="header-logo" src="https://storage.pardot.com/931493/1707771196VmVYJBIh/BlueVoyantLockupCMYKCobalt.png" alt="BlueVoyant Logo" />
        <p>Welcome to the NIS2 Compliance Checker, a tool designed to help you align your security configurations with the NIS2 directive requirements.</p>
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
#app {
  background: linear-gradient(to right, #007bff, #43a7fc); 
  min-height: 100vh; 
  font-family: 'Lato', sans-serif;
  color: black !important; 
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin: 40px auto;
  max-width: 900px; 
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); 
  color: black;
}

header {
  background-color: #fff; 
  border-radius: 10px; 
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  padding: 20px 30px; 
  margin-bottom: 30px; 
   display: flex; 
  justify-content: center; /* Center children horizontally */
  align-items: center; /* Center children vertically */
}

h1 {
  color: #007bff; /* Use primary brand color */
  font-size: 2.2em;
  margin-bottom: 10px;
}

p {
  font-size: 1em; 
  line-height: 1.6;
}

.overview-section,
.legend-section {
  background-color: #fff;
  padding: 30px;
  margin: 30px 0;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08); 
}

button {
  background-color: #007bff; 
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600; 
  cursor: pointer;
  transition: background-color 0.2s ease; 
}

button:hover {
  background-color: #0056b3; /* Slightly darker on hover */
}

.header-logo {
  height: 225px; /* Adjust as needed */
  position: absolute; /* Already existing */
  top: 10px; 
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
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
  color: #007bff; /* Emphasize headers */
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
  background-color: rgba(0,0,0,0.5); 
  display: flex; 
  align-items: center;
  justify-content: center;
}

.loading-content {
   background-color: #fff;
   padding: 20px;
   border-radius: 5px;
}

</style>
