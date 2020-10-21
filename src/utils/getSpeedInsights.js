import fetch from "isomorphic-fetch";
// import psi from "psi";

export async function getInsight(url) {
  const URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=pwa&category=performance&category=accessibility&category=best-practices&category=seo&key=${process.env.PAGESPEEDINSIGHTS_KEY}&url=${url}`;
  try {
    const jsonRes = await fetch(URL);
    if (jsonRes.status === 200) {
      const jsonResult = await jsonRes.json();
      const {
        categories,
        audits,
        finalUrl,
        requestedUrl,
      } = jsonResult.lighthouseResult;
      const { performance, accessibility, seo, pwa } = categories;

      const categoriesScore = {
        performance: performance.score * 100,
        accessibility: accessibility.score * 100,
        seo: seo.score * 100,
        pwa: pwa.score * 100,
        "best-practices": categories["best-practices"].score * 100,
        "speed-index": audits["speed-index"].displayValue,
        "total-blocking-time": audits["total-blocking-time"].displayValue,
        "time-to-interactive": audits["interactive"].displayValue,
        "first-meaning-fulpaint": audits["first-meaningful-paint"].displayValue,
        "first-contentful-paint": audits["first-contentful-paint"].displayValue,
        "largest-contentful-paint":
          audits["largest-contentful-paint"].displayValue,
        "cumulative-layout-shift":
          audits["cumulative-layout-shift"].displayValue,
      };
      return {
        ...categoriesScore,
        requestedUrl,
        finalUrl,
      };
    }
  } catch (error) {
    console.log(error);
  }
}
