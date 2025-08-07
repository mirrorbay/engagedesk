import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Mail,
  Calendar,
  FolderOpen,
  ArrowRight,
  CheckCircle,
  Eye,
  MousePointer,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Send,
  BarChart3,
  Settings,
  X,
  ChevronDown,
} from "lucide-react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
import styles from "../styles/demo.module.css";

const Demo = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleFeatureSelect = (index) => {
    setActiveFeature(index);
    setIsDropdownOpen(false);
  };

  const features = [
    {
      id: 0,
      icon: <FileSpreadsheet size={24} />,
      title: "Worksheet Data Manager",
      subtitle: "Track every client detail in one organized view",
      description:
        "See all your clients at a glance with customizable columns for status, contact history, project progress, and revenue. Sort, filter, and search instantly. Update multiple records with bulk actions. Export data for reports or backup. No more scattered spreadsheets or lost client information - everything stays current and accessible.",
      benefits: [
        "View 50+ clients on one screen with key metrics",
        "Custom fields for your specific business needs",
        "Real-time progress tracking with visual indicators",
        "Bulk updates save hours of repetitive data entry",
        "Export to Excel or PDF for external reporting",
      ],
      mockupType: "worksheet",
    },
    {
      id: 1,
      icon: <Mail size={24} />,
      title: "Email Campaign Manager",
      subtitle: "Professional emails with complete tracking visibility",
      description:
        "Send branded emails that look professional and track every interaction. See exactly when clients open your emails, which links they click, and how engaged they are. Pre-built templates for common scenarios like follow-ups, proposals, and check-ins. Schedule emails for optimal timing and set up automatic sequences.",
      benefits: [
        "Know when clients read your emails (no more guessing)",
        "Click tracking shows which services interest them most",
        "Templates reduce writing time by 80%",
        "Schedule emails for perfect timing across time zones",
        "Automatic follow-up sequences for consistent outreach",
      ],
      mockupType: "email",
    },
    {
      id: 2,
      icon: <Calendar size={24} />,
      title: "Calendar & Task Manager",
      subtitle: "Never miss a deadline or follow-up opportunity",
      description:
        "Integrated calendar shows appointments, deadlines, and follow-up tasks in one view. Set reminders for important client touchpoints. Track recurring tasks and project milestones. Color-coded events help you prioritize urgent items. Mobile sync keeps you updated anywhere.",
      benefits: [
        "All client appointments and deadlines in one calendar",
        "Automatic reminders prevent missed opportunities",
        "Recurring task templates for consistent service delivery",
        "Mobile access keeps you organized on the go",
        "Time blocking helps you focus on high-value activities",
      ],
      mockupType: "calendar",
    },
    {
      id: 3,
      icon: <FolderOpen size={24} />,
      title: "Client File Storage",
      subtitle: "Instant access to every document and conversation",
      description:
        "Dedicated folders for each client store contracts, photos, invoices, and communication history. Upload files directly from your phone or computer. Version control tracks document changes. Search across all files instantly. Share secure links with clients for easy collaboration.",
      benefits: [
        "Find any client document in under 5 seconds",
        "Mobile upload from job sites or meetings",
        "Version history prevents confusion over document changes",
        "Secure client portals for document sharing",
        "Automatic backup protects against data loss",
      ],
      mockupType: "storage",
    },
  ];

  const WorksheetMockup = () => (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Client Data Manager</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              Add Client
            </button>
            <button className={styles.mockupButton}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <div className={styles.mockupToolbar}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input placeholder="Search clients..." />
          </div>
          <button className={styles.filterButton}>
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className={styles.worksheetGrid}>
          <div className={styles.worksheetHeader}>
            <div className={styles.worksheetCell}>Client Name</div>
            <div className={styles.worksheetCell}>Status</div>
            <div className={styles.worksheetCell}>Last Contact</div>
            <div className={styles.worksheetCell}>Next Action</div>
            <div className={styles.worksheetCell}>Progress</div>
            <div className={styles.worksheetCell}>Value</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Premier Auto Group - Susan Oliver
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusActive}>Hot Lead</span>
            </div>
            <div className={styles.worksheetCell}>Yesterday 3:42 PM</div>
            <div className={styles.worksheetCell}>
              Schedule test drive appointment
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$47,500</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              GreenScape Solutions - Mike Rodriguez
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusPending}>Proposal Sent</span>
            </div>
            <div className={styles.worksheetCell}>Dec 6, 2:15 PM</div>
            <div className={styles.worksheetCell}>
              Follow up on landscape redesign quote
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$28,900</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Coastal Properties - Jennifer Walsh
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusCompleted}>Contract Signed</span>
            </div>
            <div className={styles.worksheetCell}>Dec 5, 11:30 AM</div>
            <div className={styles.worksheetCell}>
              Begin property management transition
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$156,000/yr</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Peak Performance - David Kim
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusActive}>In Progress</span>
            </div>
            <div className={styles.worksheetCell}>Dec 4, 9:00 AM</div>
            <div className={styles.worksheetCell}>
              Quarterly coaching review session
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$18,000</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Radiant Wellness - Lisa Thompson
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusActive}>Treatment Plan</span>
            </div>
            <div className={styles.worksheetCell}>Dec 3, 4:20 PM</div>
            <div className={styles.worksheetCell}>
              Send skincare routine recommendations
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$8,500</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Secure Lending - Robert Martinez
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusPending}>Documentation Review</span>
            </div>
            <div className={styles.worksheetCell}>Dec 2, 1:45 PM</div>
            <div className={styles.worksheetCell}>
              Submit final loan application
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$425,000</div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmailMockup = () => (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Email Campaign Manager</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              New Email
            </button>
            <button className={styles.mockupButton}>
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>
        </div>
        <div className={styles.emailComposer}>
          <div className={styles.emailHeader}>
            <div className={styles.emailField}>
              <label>To:</label>
              <input value="susan.oliver@premierautosales.com" readOnly />
            </div>
            <div className={styles.emailField}>
              <label>Subject:</label>
              <input
                value="Your 2024 BMW X5 - Test Drive Confirmation & Financing Options"
                readOnly
              />
            </div>
            <div className={styles.templateSelector}>
              <label>Template:</label>
              <select>
                <option>Hot Lead Follow-up</option>
                <option>Financing Pre-approval</option>
                <option>Trade-in Evaluation</option>
                <option>Service Appointment</option>
                <option>Welcome New Customer</option>
              </select>
            </div>
          </div>
          <div className={styles.emailBody}>
            <div className={styles.emailContent}>
              <p>Hi Susan,</p>
              <p>
                Thank you for your interest in the 2024 BMW X5 xDrive40i we
                discussed yesterday. I'm excited to help you find the perfect
                vehicle for your family's needs.
              </p>
              <p>
                <strong>Test Drive Confirmation:</strong>
              </p>
              <ul>
                <li>
                  Vehicle: 2024 BMW X5 xDrive40i - Alpine White, Premium Package
                </li>
                <li>Date: Tomorrow (December 9th) at 2:00 PM</li>
                <li>
                  Duration: 30-45 minutes including highway and city driving
                </li>
                <li>Location: Premier Auto Group - 1247 Commerce Drive</li>
              </ul>

              <p>
                <strong>Financing Pre-Approval Update:</strong>
              </p>
              <p>
                Great news! Based on your credit profile, you've been
                pre-approved for:
              </p>
              <ul>
                <li>Loan Amount: Up to $52,000</li>
                <li>Interest Rate: 4.9% APR (excellent credit tier)</li>
                <li>Term Options: 60 or 72 months</li>
                <li>Monthly Payment: Approximately $785/month (60 months)</li>
              </ul>

              <p>
                <strong>Trade-in Value:</strong>
              </p>
              <p>
                Your 2019 Acura MDX preliminary evaluation: $28,500 - $31,200
                depending on final inspection.
              </p>

              <p>
                I'll have all the paperwork ready for your visit tomorrow.
                Please bring your driver's license, insurance card, and the
                title for your trade-in vehicle.
              </p>

              <p>Looking forward to seeing you tomorrow!</p>
              <p>
                Best regards,
                <br />
                Marcus Johnson
                <br />
                Senior Sales Consultant
                <br />
                Premier Auto Group
                <br />
                Direct: (555) 234-7890
                <br />
                marcus.johnson@premierautosales.com
              </p>
            </div>
          </div>
          <div className={styles.emailActions}>
            <button className={styles.sendButton}>
              <Send size={16} />
              Send & Track
            </button>
            <button className={styles.saveButton}>Save Draft</button>
          </div>
        </div>
        <div className={styles.trackingStats}>
          <div className={styles.trackingStat}>
            <Eye size={16} />
            <span>Opens: 8</span>
          </div>
          <div className={styles.trackingStat}>
            <MousePointer size={16} />
            <span>Clicks: 5</span>
          </div>
          <div className={styles.trackingStat}>
            <Clock size={16} />
            <span>Last opened: 47 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const CalendarMockup = () => (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Calendar & Actions</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              New Event
            </button>
            <button className={styles.mockupButton}>
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
        <div className={styles.calendarView}>
          <div className={styles.calendarHeader}>
            <h3>December 2024</h3>
            <div className={styles.viewToggle}>
              <button className={styles.viewButton}>Week</button>
              <button className={styles.viewButton + " " + styles.active}>
                Month
              </button>
            </div>
          </div>
          <div className={styles.calendarGrid}>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>9</div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>2:00 PM</div>
                <div className={styles.eventTitle}>
                  BMW X5 Test Drive - Susan Oliver
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>10</div>
              <div
                className={styles.calendarEvent + " " + styles.eventDeadline}
              >
                <div className={styles.eventTime}>5:00 PM</div>
                <div className={styles.eventTitle}>
                  Landscape Proposal Due - GreenScape
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>11</div>
              <div
                className={styles.calendarEvent + " " + styles.eventFollowup}
              >
                <div className={styles.eventTime}>10:30 AM</div>
                <div className={styles.eventTitle}>
                  Property Inspection - Coastal Properties
                </div>
              </div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>3:00 PM</div>
                <div className={styles.eventTitle}>
                  Coaching Session - David Kim
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>12</div>
              <div
                className={styles.calendarEvent + " " + styles.eventDeadline}
              >
                <div className={styles.eventTime}>12:00 PM</div>
                <div className={styles.eventTitle}>
                  Loan Documentation - Secure Lending
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>13</div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>9:00 AM</div>
                <div className={styles.eventTitle}>
                  Wellness Consultation - Lisa Thompson
                </div>
              </div>
              <div
                className={styles.calendarEvent + " " + styles.eventFollowup}
              >
                <div className={styles.eventTime}>4:30 PM</div>
                <div className={styles.eventTitle}>
                  Follow-up: Auto Financing
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>14</div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>15</div>
            </div>
          </div>
        </div>
        <div className={styles.actionsList}>
          <h4>High-Priority Actions</h4>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>
              Send financing pre-approval to Susan Oliver ($47,500 BMW deal)
            </span>
            <span className={styles.actionDue}>Due: Today 6:00 PM</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>Complete landscape redesign proposal for Mike Rodriguez</span>
            <span className={styles.actionDue}>Due: Tomorrow 5:00 PM</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>
              Submit final loan application documents ($425K mortgage)
            </span>
            <span className={styles.actionDue}>Due: Dec 12</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>Prepare quarterly coaching review materials for David</span>
            <span className={styles.actionDue}>Due: Dec 11</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>Schedule property management transition meeting</span>
            <span className={styles.actionDue}>Due: Dec 13</span>
          </div>
        </div>
      </div>
    </div>
  );

  const StorageMockup = () => (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Client Storage</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Upload size={16} />
              Upload
            </button>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              New Folder
            </button>
          </div>
        </div>
        <div className={styles.storageLayout}>
          <div className={styles.storageSidebar}>
            <div className={styles.clientList}>
              <h4>Active Clients</h4>
              <div className={styles.clientItem + " " + styles.active}>
                <Users size={16} />
                <span>Premier Auto - Susan Oliver</span>
              </div>
              <div className={styles.clientItem}>
                <Users size={16} />
                <span>GreenScape - Mike Rodriguez</span>
              </div>
              <div className={styles.clientItem}>
                <Users size={16} />
                <span>Coastal Properties - Jennifer</span>
              </div>
              <div className={styles.clientItem}>
                <Users size={16} />
                <span>Peak Performance - David</span>
              </div>
              <div className={styles.clientItem}>
                <Users size={16} />
                <span>Radiant Wellness - Lisa</span>
              </div>
              <div className={styles.clientItem}>
                <Users size={16} />
                <span>Secure Lending - Robert</span>
              </div>
            </div>
          </div>
          <div className={styles.storageMain}>
            <div className={styles.breadcrumb}>
              <span>Premier Auto Group - Susan Oliver</span>
              <ArrowRight size={14} />
              <span>BMW X5 Purchase Documents</span>
            </div>
            <div className={styles.fileGrid}>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileContract}>
                  📄
                </div>
                <div className={styles.fileName}>
                  Purchase Agreement - BMW X5.pdf
                </div>
                <div className={styles.fileSize}>3.2 MB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileDocument}>
                  📝
                </div>
                <div className={styles.fileName}>
                  Financing Pre-Approval Letter.pdf
                </div>
                <div className={styles.fileSize}>1.8 MB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileSpreadsheet}>
                  📊
                </div>
                <div className={styles.fileName}>
                  Trade-in Evaluation - 2019 Acura MDX.xlsx
                </div>
                <div className={styles.fileSize}>245 KB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileImage}>
                  🖼️
                </div>
                <div className={styles.fileName}>
                  Vehicle Photos & Inspection
                </div>
                <div className={styles.fileSize}>24 files, 18.5 MB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileDocument}>
                  📝
                </div>
                <div className={styles.fileName}>
                  Insurance Documentation.pdf
                </div>
                <div className={styles.fileSize}>892 KB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileFolder}>
                  📁
                </div>
                <div className={styles.fileName}>
                  Email Communication History
                </div>
                <div className={styles.fileSize}>47 messages</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileContract}>
                  📄
                </div>
                <div className={styles.fileName}>
                  Extended Warranty Agreement.pdf
                </div>
                <div className={styles.fileSize}>2.1 MB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileSpreadsheet}>
                  📊
                </div>
                <div className={styles.fileName}>
                  Payment Schedule & Terms.xlsx
                </div>
                <div className={styles.fileSize}>156 KB</div>
              </div>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon + " " + styles.fileFolder}>
                  📁
                </div>
                <div className={styles.fileName}>
                  Service & Maintenance Records
                </div>
                <div className={styles.fileSize}>8 documents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMockup = (type) => {
    switch (type) {
      case "worksheet":
        return <WorksheetMockup />;
      case "email":
        return <EmailMockup />;
      case "calendar":
        return <CalendarMockup />;
      case "storage":
        return <StorageMockup />;
      default:
        return <WorksheetMockup />;
    }
  };

  return (
    <div className={styles.demo}>
      <HomepageHeader onLogin={handleGetStarted} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>See How EngageDesk Works</h1>
            <p className={styles.heroSubtitle}>
              Explore the complete client management system built specifically
              for service professionals. See exactly how each tool helps you
              stay organized, save time, and grow your business. Click through
              each feature to see real workflows in action.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Demo Section */}
      <section className={styles.featureDemo}>
        <div className={styles.container}>
          <div className={styles.demoLayout}>
            {/* Feature Navigation */}
            <div className={styles.featureNav}>
              <h3 className={styles.navTitle}>Platform Features</h3>

              {/* Mobile Dropdown */}
              <div className={styles.mobileDropdown}>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className={styles.navIcon}>
                    {features[activeFeature].icon}
                  </div>
                  <div className={styles.navContent}>
                    <div className={styles.navItemTitle}>
                      {features[activeFeature].title}
                    </div>
                    <div className={styles.navItemSubtitle}>
                      {features[activeFeature].subtitle}
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`${styles.dropdownArrow} ${
                      isDropdownOpen ? styles.open : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {features.map((feature, index) => (
                      <button
                        key={feature.id}
                        className={`${styles.dropdownItem} ${
                          activeFeature === index ? styles.active : ""
                        }`}
                        onClick={() => handleFeatureSelect(index)}
                      >
                        <div className={styles.navIcon}>{feature.icon}</div>
                        <div className={styles.navContent}>
                          <div className={styles.navItemTitle}>
                            {feature.title}
                          </div>
                          <div className={styles.navItemSubtitle}>
                            {feature.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className={styles.desktopNav}>
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    className={`${styles.featureNavItem} ${
                      activeFeature === index ? styles.active : ""
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className={styles.navIcon}>{feature.icon}</div>
                    <div className={styles.navContent}>
                      <div className={styles.navItemTitle}>{feature.title}</div>
                      <div className={styles.navItemSubtitle}>
                        {feature.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Display */}
            <div className={styles.featureDisplay}>
              <div className={styles.featureInfo}>
                <div className={styles.featureHeader}>
                  <div className={styles.featureIcon}>
                    {features[activeFeature].icon}
                  </div>
                  <div>
                    <h2 className={styles.featureTitle}>
                      {features[activeFeature].title}
                    </h2>
                    <p className={styles.featureSubtitle}>
                      {features[activeFeature].subtitle}
                    </p>
                  </div>
                </div>
                <p className={styles.featureDescription}>
                  {features[activeFeature].description}
                </p>
                <div className={styles.featureBenefits}>
                  <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
                  <ul className={styles.benefitsList}>
                    {features[activeFeature].benefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>
                        <CheckCircle size={16} className={styles.benefitIcon} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature Mockup */}
              {renderMockup(features[activeFeature].mockupType)}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Highlight */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Why Service Professionals Choose EngageDesk
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <CheckCircle size={32} />
              </div>
              <h3 className={styles.benefitTitle}>All-in-One Solution</h3>
              <p className={styles.benefitDescription}>
                Everything you need to manage client relationships in one
                integrated platform. No more juggling multiple tools or losing
                track of important information.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Clock size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Save Hours Weekly</h3>
              <p className={styles.benefitDescription}>
                Streamlined workflows and intelligent automation help you focus
                on serving clients instead of managing administrative tasks.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Users size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Improve Client Retention</h3>
              <p className={styles.benefitDescription}>
                Stay on top of follow-ups, track engagement, and provide
                consistent professional service that keeps clients coming back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Start Managing Clients More Effectively Today
            </h2>
            <p className={styles.ctaDescription}>
              Join service professionals who save 10+ hours weekly and increase
              client retention by 40% with organized workflows, automated
              follow-ups, and professional communication tools.
            </p>
            <button onClick={handleGetStarted} className={styles.ctaButton}>
              Start Your Free Account
              <ArrowRight size={16} />
            </button>
            <p className={styles.ctaNote}>
              No credit card required • Full access to all features • Setup in
              minutes
            </p>
          </div>
        </div>
      </section>

      <HomepageFooter />
    </div>
  );
};

export default Demo;
