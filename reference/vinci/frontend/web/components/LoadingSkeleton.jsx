import React from 'react';
import styles from '../styles/loading-skeleton.module.css';

// Generic skeleton components
export const SkeletonBox = ({ width = '100%', height = '20px', className = '' }) => (
  <div 
    className={`${styles.skeleton} ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonBox 
        key={i} 
        height="16px" 
        width={i === lines - 1 ? '75%' : '100%'}
        className={styles.skeletonLine}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`${styles.skeletonCard} ${className}`}>
    <SkeletonBox height="24px" width="60%" className={styles.skeletonTitle} />
    <SkeletonText lines={2} className={styles.skeletonContent} />
    <SkeletonBox height="16px" width="40%" className={styles.skeletonFooter} />
  </div>
);

// Home page specific skeletons
export const HomePageSkeleton = () => (
  <div className={styles.homeSkeletonContainer}>
    {/* Welcome Section */}
    <div className={styles.welcomeSkeleton}>
      <SkeletonBox height="36px" width="200px" className={styles.titleSkeleton} />
      <SkeletonText lines={2} className={styles.subtitleSkeleton} />
    </div>

    {/* Setup Section */}
    <div className={styles.setupSkeleton}>
      {/* Concept Selection */}
      <div className={styles.formGroupSkeleton}>
        <SkeletonBox height="20px" width="150px" className={styles.labelSkeleton} />
        <div className={styles.conceptCategorySkeleton}>
          <SkeletonBox height="24px" width="120px" className={styles.categoryTitleSkeleton} />
          <div className={styles.conceptGridSkeleton}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.conceptItemSkeleton}>
                <SkeletonBox height="16px" width="16px" className={styles.checkboxSkeleton} />
                <SkeletonBox height="16px" width="80px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slider */}
      <div className={styles.formGroupSkeleton}>
        <SkeletonBox height="20px" width="100px" className={styles.labelSkeleton} />
        <div className={styles.timeSliderSkeleton}>
          <SkeletonBox height="60px" width="80px" className={styles.timeDisplaySkeleton} />
          <SkeletonBox height="8px" width="100%" className={styles.sliderSkeleton} />
        </div>
      </div>

      {/* Start Button */}
      <SkeletonBox height="48px" width="200px" className={styles.buttonSkeleton} />
    </div>

    {/* Sessions Section */}
    <div className={styles.sessionsSkeleton}>
      <SkeletonBox height="28px" width="180px" className={styles.sectionTitleSkeleton} />
      <div className={styles.sessionsGridSkeleton}>
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} className={styles.sessionCardSkeleton} />
        ))}
      </div>
    </div>
  </div>
);

// Results page specific skeletons
export const ResultsPageSkeleton = () => (
  <div className={styles.resultsSkeletonContainer}>
    {/* Header */}
    <div className={styles.resultsHeaderSkeleton}>
      <SkeletonBox height="32px" width="250px" className={styles.titleSkeleton} />
      <SkeletonBox height="16px" width="180px" className={styles.dateSkeleton} />
    </div>

    {/* Summary Section */}
    <div className={styles.summarySkeleton}>
      <div className={styles.summaryStatsSkeleton}>
        <div className={styles.overallScoreSkeleton}>
          <SkeletonBox height="48px" width="80px" className={styles.scoreValueSkeleton} />
          <SkeletonBox height="16px" width="100px" className={styles.scoreLabelSkeleton} />
        </div>
        <div className={styles.statItemSkeleton}>
          <SkeletonBox height="24px" width="40px" />
          <SkeletonBox height="14px" width="60px" />
        </div>
        <div className={styles.statItemSkeleton}>
          <SkeletonBox height="24px" width="50px" />
          <SkeletonBox height="14px" width="70px" />
        </div>
      </div>
      
      {/* Celebration skeleton */}
      <div className={styles.celebrationSkeleton}>
        <SkeletonBox height="40px" width="40px" className={styles.celebrationIconSkeleton} />
        <div className={styles.celebrationMessageSkeleton}>
          <SkeletonBox height="20px" width="200px" />
          <SkeletonBox height="16px" width="150px" />
        </div>
      </div>
    </div>

    {/* Problems Section */}
    <div className={styles.problemsSkeleton}>
      <SkeletonBox height="24px" width="140px" className={styles.sectionTitleSkeleton} />
      <div className={styles.problemsGridSkeleton}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={styles.problemResultSkeleton}>
            <SkeletonBox height="20px" width="60px" className={styles.statusBadgeSkeleton} />
            <SkeletonBox height="24px" width="100%" className={styles.problemExpressionSkeleton} />
          </div>
        ))}
      </div>
    </div>

    {/* Actions */}
    <div className={styles.actionsSkeleton}>
      <SkeletonBox height="40px" width="120px" className={styles.buttonSkeleton} />
    </div>
  </div>
);

// Study page specific skeletons
export const StudyPageSkeleton = () => (
  <div className={styles.studySkeletonContainer}>
    {/* Header */}
    <div className={styles.studyHeaderSkeleton}>
      <div className={styles.sessionInfoSkeleton}>
        <SkeletonBox height="28px" width="150px" className={styles.titleSkeleton} />
        <SkeletonBox height="16px" width="200px" className={styles.detailsSkeleton} />
      </div>
      <div className={styles.clockSkeleton}>
        <SkeletonBox height="14px" width="40px" className={styles.clockLabelSkeleton} />
        <SkeletonBox height="24px" width="60px" className={styles.clockTimeSkeleton} />
      </div>
    </div>

    {/* Problems Section */}
    <div className={styles.problemsSectionSkeleton}>
      <div className={styles.problemsGridSkeleton}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.problemSkeleton}>
            <div className={styles.problemExpressionSkeleton}>
              <SkeletonBox height="24px" width="120px" />
              <SkeletonBox height="16px" width="20px" />
              <SkeletonBox height="40px" width="100px" className={styles.inputSkeleton} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Navigation */}
    <div className={styles.navigationSkeleton}>
      <div className={styles.navigationButtonsSkeleton}>
        <SkeletonBox height="40px" width="100px" className={styles.buttonSkeleton} />
        <SkeletonBox height="40px" width="120px" className={styles.buttonSkeleton} />
      </div>
      <SkeletonBox height="16px" width="250px" className={styles.progressInfoSkeleton} />
    </div>
  </div>
);
