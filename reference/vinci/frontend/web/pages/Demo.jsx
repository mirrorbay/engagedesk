import React, { useState } from "react";
import {
  Play,
  Check,
  X,
  Trophy,
  Star,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import SEOHead from "../components/SEOHead.jsx";
import styles from "../styles/demo.module.css";

function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("home");

  // Demo data for realistic screenshots based on actual pages
  const demoData = {
    home: {
      selectedConcepts: ["addition", "subtraction", "multiplication"],
      studyTime: 12,
      gradeLevel: "3rd Grade Fall",
    },
    study: {
      currentPage: 2,
      totalPages: 4,
      problems: [
        { question: "24 × 3 + 15", answer: "87", isAnswered: true },
        { question: "144 ÷ 12 - 7", answer: "5", isAnswered: true },
        { question: "8 × (15 - 9)", answer: "", isAnswered: false },
        { question: "96 ÷ 8 + 4 × 3", answer: "", isAnswered: false },
      ],
      elapsedTime: "8:42",
    },
    results: {
      score: 85,
      totalProblems: 16,
      correctAnswers: 14,
      studyTime: "12:34",
      celebrationMessage: "Outstanding work!",
      celebrationSub: "You're building strong math skills",
    },
    progress: {
      overallAccuracy: 78,
      weeklyStudyTime: 145,
      totalProblems: 127,
      recentSessions: [
        {
          date: "Today",
          score: 85,
          topics: "Addition, Subtraction",
          status: "completed",
        },
        {
          date: "Yesterday",
          score: 72,
          topics: "Multiplication",
          status: "completed",
        },
        {
          date: "2 days ago",
          score: 91,
          topics: "Division, Fractions",
          status: "completed",
        },
      ],
    },
  };

  const renderHomeDemo = () => (
    <div className={styles.demoScreenshot}>
      <div className={styles.screenshotHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.screenshotTitle}>Goal Setting</h1>
          <div className={styles.headerSubtitle}>
            Create a personalized study session by selecting topics and setting
            your preferred study time.
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.startButtonContainer}>
            <div className={styles.startLabel}>Ready to Begin?</div>
            <button className={styles.startButton}>
              <Play size={18} />
              START
            </button>
          </div>
        </div>
      </div>

      <div className={styles.gradeReminder}>
        We will design study materials appropriate for{" "}
        <strong>{demoData.home.gradeLevel}</strong> level.
      </div>

      <div className={styles.setupSection}>
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>STEP 1</div>
          <div className={styles.stepTitle}>Select Topics</div>
          <div className={styles.stepSubtitle}>
            Choose the math concepts you want to practice, and we will assemble
            a personalized exercise for your study session.
          </div>
        </div>

        <div className={styles.conceptGrid}>
          {[
            "Addition",
            "Subtraction",
            "Multiplication",
            "Division",
            "Fractions",
            "Word Problems",
          ].map((concept, index) => (
            <div
              key={concept}
              className={`${styles.conceptItem} ${
                demoData.home.selectedConcepts.includes(concept.toLowerCase())
                  ? styles.selected
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={demoData.home.selectedConcepts.includes(
                  concept.toLowerCase()
                )}
                readOnly
              />
              <span>{concept}</span>
            </div>
          ))}
        </div>

        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>STEP 2</div>
          <div className={styles.stepTitle}>Set Study Time</div>
          <div className={styles.stepSubtitle}>
            Choose how long you want to study. We recommend 10-15 minutes for
            optimal focus.
          </div>
        </div>

        <div className={styles.timeSliderContainer}>
          <div className={styles.timeDisplay}>
            <div className={styles.timeValue}>{demoData.home.studyTime}</div>
            <div className={styles.timeLabel}>Minutes</div>
          </div>

          <div className={styles.timeSliderWrapper}>
            <div
              className={styles.timeSliderProgress}
              style={{ width: "40%" }}
            />
            <input
              type="range"
              min="6"
              max="20"
              value={demoData.home.studyTime}
              className={styles.timeSlider}
              readOnly
            />
          </div>

          <div className={styles.timeRecommendation}>
            <div className={styles.optimalMessage}>
              <Check size={24} className={styles.optimalIcon} />
              Optimal study duration for focused learning
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudyDemo = () => (
    <div className={styles.demoScreenshot}>
      <div className={styles.screenshotHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.screenshotTitle}>Study Session</h1>
          <div className={styles.sessionDetails}>
            Page {demoData.study.currentPage} of {demoData.study.totalPages}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.clockContainer}>
            <div className={styles.clockLabel}>Time</div>
            <div className={styles.clockTime}>{demoData.study.elapsedTime}</div>
          </div>
        </div>
      </div>

      <div className={styles.problemsGrid}>
        {demoData.study.problems.map((problem, index) => (
          <div key={index} className={styles.problemItem}>
            <div className={styles.problemExpression}>
              <span className={styles.expression}>{problem.question}</span>
              <span className={styles.equals}>=</span>
              <input
                type="text"
                value={problem.answer}
                className={styles.problemInput}
                placeholder={problem.isAnswered ? "" : "?"}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pageNavigation}>
        <div className={styles.pageNavLabel}>Pages:</div>
        <div className={styles.pageNavButtons}>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className={`${styles.pageNavButton} ${
                page === demoData.study.currentPage ? styles.currentPage : ""
              } ${
                page < demoData.study.currentPage ? styles.submittedPage : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.navigationSection}>
        <div className={styles.progressInfo}>
          2 of 4 problems answered on this page
          <span className={styles.checkBeforeSubmit}>
            • Check your answers before submitting - once submitted, answers
            cannot be modified
          </span>
        </div>
      </div>
    </div>
  );

  const renderResultsDemo = () => (
    <div className={styles.demoScreenshot}>
      <div className={styles.screenshotHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.screenshotTitle}>Study Session Results</h1>
          <div className={styles.sessionDetails}>
            December 19, 2024 • 3:42 PM - 3:54 PM
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.overallScoreContainer}>
            <div className={styles.scoreLabel}>Overall Score</div>
            <div className={styles.scoreValue}>{demoData.results.score}%</div>
            <div className={styles.additionalStats}>
              <div className={styles.additionalStatValue}>
                {demoData.results.totalProblems} problems
              </div>
              <div className={styles.additionalStatValue}>
                {demoData.results.studyTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.celebrationSection}>
        <div className={styles.celebrationIcon}>
          <Sparkles size={48} className={styles.happyIcon} />
        </div>
        <div className={styles.celebrationMessage}>
          <div className={styles.primaryMessage}>
            {demoData.results.celebrationMessage}
          </div>
          <div className={styles.subMessage}>
            {demoData.results.celebrationSub}
          </div>
        </div>
      </div>

      <div className={styles.problemsSection}>
        <h2 className={styles.sectionTitle}>Problem Details</h2>
        <div className={styles.problemResultsGrid}>
          {[
            { question: "24 × 3 + 15", studentAnswer: "87", correct: true },
            { question: "144 ÷ 12 - 7", studentAnswer: "5", correct: true },
            {
              question: "8 × (15 - 9)",
              studentAnswer: "42",
              correct: false,
              correctAnswer: "48",
            },
            {
              question: "96 ÷ 8 + 4 × 3",
              studentAnswer: "24",
              correct: true,
            },
          ].map((problem, index) => (
            <div
              key={index}
              className={`${styles.problemResult} ${
                problem.correct
                  ? styles.correctProblem
                  : styles.incorrectProblem
              }`}
            >
              <div className={styles.statusIndicator}>
                <div
                  className={`${styles.statusBadge} ${
                    problem.correct
                      ? styles.correctStatus
                      : styles.incorrectStatus
                  }`}
                >
                  {problem.correct ? (
                    <Check className={styles.statusIcon} />
                  ) : (
                    <X className={styles.statusIcon} />
                  )}
                </div>
              </div>
              <div className={styles.problemExpression}>
                <span className={styles.expression}>{problem.question}</span>
                <span className={styles.equals}>=</span>
                <span
                  className={`${styles.answerDisplay} ${
                    problem.correct
                      ? styles.correctAnswer
                      : styles.incorrectAnswer
                  }`}
                >
                  {problem.studentAnswer}
                </span>
              </div>
              {!problem.correct && (
                <div className={styles.correctAnswerSection}>
                  <span className="green-badge">
                    Correct: {problem.correctAnswer}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgressDemo = () => (
    <div className={styles.demoScreenshot}>
      <div className={styles.screenshotHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.screenshotTitle}>Progress Report</h1>
          <div className={styles.headerSubtitle}>
            Track your progress, analyze performance trends, and celebrate
            achievements.
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.achievementBadge}>
            <div className={styles.badgeIcon}>
              <Trophy size={24} />
            </div>
            <div className={styles.badgeContent}>
              <div className={styles.badgeTitle}>Math Champion</div>
              <div className={styles.badgeDescription}>
                Completed 10 sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overviewSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>OVERVIEW & ANALYTICS</div>
          <div className={styles.sectionTitle}>
            Performance Summary & Trends
          </div>
        </div>

        <div className={styles.performanceSummary}>
          <div className={styles.accuracyCard}>
            <div className={styles.accuracyCircle}>
              <div className={styles.accuracyValue}>
                {demoData.progress.overallAccuracy}%
              </div>
              <div className={styles.accuracyLabel}>Overall Accuracy</div>
            </div>
          </div>

          <div className={styles.keyMetrics}>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>
                {demoData.progress.weeklyStudyTime} study minutes
              </div>
              <div className={styles.metricLabel}>in past 7 days</div>
            </div>
          </div>
        </div>

        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <h4>Strengths & Achievements</h4>
              <Star size={20} />
            </div>
            <div className={styles.insightList}>
              <div className={styles.insightItem}>
                <span>Excellent progress in addition and subtraction</span>
              </div>
              <div className={styles.insightItem}>
                <span>Consistent daily practice habits</span>
              </div>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <h4>Growth Opportunities</h4>
              <Star size={20} />
            </div>
            <div className={styles.insightList}>
              <div className={styles.insightItem}>
                <span>Focus on multiplication tables practice</span>
              </div>
              <div className={styles.insightItem}>
                <span>Try longer study sessions for better retention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pastStudiesSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>HISTORY</div>
          <div className={styles.sectionTitle}>Your Study Sessions</div>
        </div>

        <div className={styles.sessionsGrid}>
          {demoData.progress.recentSessions.map((session, index) => (
            <div key={index} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <div className={styles.sessionDate}>{session.date}</div>
                <div className={`${styles.sessionStatus} ${styles.completed}`}>
                  {session.status}
                </div>
              </div>
              <div className={styles.sessionConcepts}>
                <div className={styles.sessionConceptsTitle}>Topics:</div>
                <div className={styles.sessionConceptsList}>
                  {session.topics}
                </div>
              </div>
              <div className={styles.sessionStats}>
                <div className={styles.sessionScore}>{session.score}%</div>
                <div className={styles.sessionDetails}>
                  12 problems
                  <br />
                  15 min target
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const demoSections = [
    {
      id: "home",
      title: "Goal Setting & Session Creation",
      description:
        "Parents easily set up sessions with their child in minutes - no tutorials or complex setup. Children feel excited to start because the interface is designed for attention challenges, with clear choices and achievable goals that build immediate confidence.",
      features: [
        "No setup stress - start immediately",
        "Attention-friendly design reduces resistance",
        "Children feel capable and motivated",
        "Grade-appropriate content builds confidence",
      ],
      component: renderHomeDemo,
    },
    {
      id: "study",
      title: "Interactive Study Sessions",
      description:
        "Children engage happily with structured, bite-sized problems designed for shorter attention spans. Each completed problem creates a small win, building intrinsic motivation while developing real focus skills that transfer to schoolwork.",
      features: [
        "Structured wins keep kids engaged",
        "Attention-friendly pacing prevents overwhelm",
        "Focus skills that improve classroom performance",
        "Short sessions fit any family schedule",
      ],
      component: renderStudyDemo,
    },
    {
      id: "results",
      title: "Immediate Results & Celebration",
      description:
        "Children see instant success and feel proud of their accomplishments. Parents witness their child's genuine excitement about learning, while detailed feedback shows exactly how focus and math skills are improving.",
      features: [
        "Children feel successful and want to continue",
        "Parents see clear evidence of progress",
        "Builds lasting confidence and motivation",
        "Immediate feedback shows what's working",
      ],
      component: renderResultsDemo,
    },
    {
      id: "progress",
      title: "Comprehensive Progress Analytics",
      description:
        "Parents are empowered with clear data showing their child's improving focus and academic performance. Track real improvements in attention span, math skills, and classroom behavior - proof that your efforts are working.",
      features: [
        "Parents feel confident and in control",
        "Clear evidence of academic improvement",
        "Track focus development over time",
        "See results in days, not months",
      ],
      component: renderProgressDemo,
    },
  ];

  return (
    <div className={styles.demoContainer}>
      <SEOHead
        title="See How It Works | DaVinci Focus Demo - ADHD Focus Training Preview"
        description="See DaVinci Focus in action. Interactive demo shows how 10-minute daily math practice builds focus skills for children with ADHD. Preview goal setting, study sessions, results, and progress tracking."
        keywords="DaVinci Focus demo, ADHD focus training preview, how it works, math practice demo, attention training preview, focus skills demo, parent supervised learning demo"
        image="/1.png"
      />
      {/* Header */}
      <header className={styles.demoHeader}>
        <h1 className={styles.demoTitle}>How It Works</h1>
        <div className={styles.demoSubtitle}>
          DaVinci Focus helps children with attention challenges build focus
          skills through engaging math practice. Our system is designed for kids
          with attention struggles, including those with ADHD-like difficulties.
          Just 10-15 minutes of daily supervision - we handle the teaching so
          you can focus on supporting your child's success.
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.demoNavigation}>
        {demoSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveDemo(section.id)}
            className={`${styles.navTab} ${
              activeDemo === section.id ? styles.active : ""
            }`}
          >
            <span className={styles.tabLabel}>{section.title}</span>
          </button>
        ))}
      </nav>

      {/* Demo Content */}
      <main className={styles.demoContent}>
        {demoSections.map((section) => (
          <section
            key={section.id}
            className={`${styles.demoSection} ${
              activeDemo === section.id ? styles.active : ""
            }`}
          >
            <article className={styles.demoInfo}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionDescription}>{section.description}</p>

              <aside className={styles.featuresList}>
                <h3 className={styles.featuresTitle}>Key Features:</h3>
                <ul className={styles.features}>
                  {section.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <Check size={16} className={styles.featureIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </aside>
            </article>

            <figure className={styles.demoVisual}>
              <div className={styles.sampleScreenLabel}>
                <span
                  className="green-badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Sample Screen Preview
                  <ArrowDown size={16} />
                </span>
              </div>
              {section.component()}
            </figure>
          </section>
        ))}
      </main>
    </div>
  );
}

export default DemoPage;
