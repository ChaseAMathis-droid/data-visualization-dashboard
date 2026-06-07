import './style.css'

const tableauViewUrl =
  'https://public.tableau.com/views/RegionalSampleWorkbook/College?:showVizHome=no'

document.querySelector('#app').innerHTML = `
  <main class="layout">
    <header class="hero">
      <p class="eyebrow">Interactive Analytics</p>
      <h1>Data Visualization Dashboard</h1>
      <p class="subtitle">
        A Tableau-powered demo experience for exploring trends and insights.
      </p>
    </header>

    <section class="stats" aria-label="Key metrics overview">
      <article class="stat-card">
        <h2>Data Source</h2>
        <p>Tableau Public sample workbook</p>
      </article>
      <article class="stat-card">
        <h2>Visualization Type</h2>
        <p>Interactive Tableau dashboard embed</p>
      </article>
      <article class="stat-card">
        <h2>Demo Readiness</h2>
        <p>Deployed via static hosting pipeline</p>
      </article>
    </section>

    <section class="viz-shell" aria-label="Embedded Tableau dashboard">
      <iframe
        title="Tableau dashboard demo"
        src="${tableauViewUrl}"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </section>

    <section class="fallback">
      <p>
        If the embed does not load in your environment,
        <a href="${tableauViewUrl}" target="_blank" rel="noreferrer">open the visualization directly in Tableau Public</a>.
      </p>
    </section>
  </main>
`
