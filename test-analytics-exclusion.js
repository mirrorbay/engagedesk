// Test script to verify analytics exclusion for analytics pages
const fetch = require("node-fetch");

const API_BASE_URL = "http://localhost:5000/api";

async function testAnalyticsExclusion() {
  console.log("Testing Analytics Exclusion...\n");

  // Test data for different pages
  const testCases = [
    {
      name: "Homepage Visit",
      page_path: "/",
      shouldTrack: true,
    },
    {
      name: "Public Analytics Page Visit",
      page_path: "/analytics",
      shouldTrack: false,
    },
    {
      name: "Protected Analytics Page Visit",
      page_path: "/app/analytics",
      shouldTrack: false,
    },
    {
      name: "Demo Page Visit",
      page_path: "/demo",
      shouldTrack: true,
    },
    {
      name: "About Page Visit",
      page_path: "/about",
      shouldTrack: true,
    },
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Page Path: ${testCase.page_path}`);
    console.log(`Should Track: ${testCase.shouldTrack}`);

    try {
      // Test page visit tracking
      const pageVisitResponse = await fetch(
        `${API_BASE_URL}/analytics/page-visit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: testCase.page_path,
            referrer: "test-referrer",
          }),
        }
      );

      const pageVisitResult = await pageVisitResponse.json();
      console.log(`Page Visit Response: ${pageVisitResult.message}`);

      // Test click event tracking
      const clickResponse = await fetch(
        `${API_BASE_URL}/analytics/click-events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: testCase.page_path,
            click_events: [
              {
                element_id: "test-button",
                element_class: "test-class",
                element_text: "Test Button",
                element_tag: "button",
                click_timestamp: new Date().toISOString(),
              },
            ],
          }),
        }
      );

      const clickResult = await clickResponse.json();
      console.log(`Click Event Response: ${clickResult.message}`);

      // Test visit duration tracking
      const durationResponse = await fetch(
        `${API_BASE_URL}/analytics/visit-duration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: testCase.page_path,
            visit_duration: 5000,
          }),
        }
      );

      const durationResult = await durationResponse.json();
      console.log(`Visit Duration Response: ${durationResult.message}`);

      // Test scroll event tracking
      const scrollResponse = await fetch(
        `${API_BASE_URL}/analytics/scroll-events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: testCase.page_path,
            scroll_events: [
              {
                scroll_depth: 50,
                scroll_timestamp: new Date(),
                viewport_height: 800,
                document_height: 1600,
              },
            ],
            max_scroll_depth: 50,
          }),
        }
      );

      const scrollResult = await scrollResponse.json();
      console.log(`Scroll Event Response: ${scrollResult.message}`);
    } catch (error) {
      console.error(`Error testing ${testCase.name}:`, error.message);
    }

    console.log("---\n");
  }

  console.log("Analytics exclusion test completed!");
  console.log("\nExpected behavior:");
  console.log(
    '- Analytics pages (/analytics, /app/analytics) should return "Analytics tracking skipped for analytics page"'
  );
  console.log('- Other pages should return "tracked successfully" messages');
}

// Run the test
testAnalyticsExclusion().catch(console.error);
