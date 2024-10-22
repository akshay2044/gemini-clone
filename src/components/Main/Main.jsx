import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import html2pdf from 'html2pdf.js';

const Main = () => {
  const { onSent, recentPrompt, currentInput, showResult, loading, resultData, setInput, input } = useContext(Context);

  const [error, setError] = useState(false); // State to manage error messages
  const [output, setOutput] = useState(''); // State to manage the output (SRS report)

  const srsPrompt = `
  Please generate a comprehensive Software Requirements Specification (SRS) report with the following sections:

  Heading of Project name srs report
   

  **Table of Contents**:
  - Table of Contents
  - Revision History
  - 1. Introduction
    - 1.1 Purpose
    - 1.2 Document Conventions
    - 1.3 Intended Audience and Reading Suggestions
    - 1.4 Product Scope
    - 1.5 References
  - 2. Overall Description
    - 2.1 Product Perspective
    - 2.2 Product Functions
    - 2.3 User Classes and Characteristics
    - 2.4 Operating Environment
    - 2.5 Design and Implementation Constraints
    - 2.6 User Documentation
    - 2.7 Assumptions and Dependencies
  - 3. External Interface Requirements
    - 3.1 User Interfaces
    - 3.2 Hardware Interfaces
    - 3.3 Software Interfaces
    - 3.4 Communications Interfaces
  - 4. System Features
    - 4.1 System Feature 1
    - 4.2 System Feature 2 (and so on)
  - 5. Nonfunctional Requirements
    - 5.1 Performance Requirements
    - 5.2 Safety Requirements
    - 5.3 Security Requirements
    - 5.4 Software Quality Attributes
    - 5.5 Business Rules
  - 6. Language
  - 7. Database
  - 8. Time Required
  - 9. Total Developers
  - 10. Testing
  - 11.Recommendation Software
  - 12.Recommendation tool
  -13. Total Cost Estimation
  
  **Revision History**:
  - Include a detailed list of changes made to the document, including version numbers, dates, and a brief description of the revisions.

  **1. Introduction**:
    - **1.1 Purpose**: Provide the specific purpose of this document, outlining what the SRS aims to accomplish. Highlight how the document will guide the development process.
    - **1.2 Document Conventions**: List the symbols, acronyms, or terms used throughout the document to ensure clarity for the reader.
    - **1.3 Intended Audience and Reading Suggestions**: Identify the primary audience for the document, such as developers, project managers, or testers. Provide suggestions on how each type of reader should approach the document.
    - **1.4 Product Scope**: Define the overall scope of the software product. Briefly describe what the software will do, the problem it solves, and its intended use.
    - **1.5 References**: Provide references to any related documents, external standards, or resources that are important for understanding the software requirements.

  **2. Overall Description**:
    - **2.1 Product Perspective**: Explain how this product fits within a larger system or other products, including any dependencies or interactions with other software/hardware.
    - **2.2 Product Functions**: List and briefly describe the main functions the software will perform.
    - **2.3 User Classes and Characteristics**: Identify the different types of users who will interact with the system and their relevant characteristics (e.g., technical expertise).
    - **2.4 Operating Environment**: Detail the environments where the software will run, such as specific operating systems, hardware configurations, and other technical requirements.
    - **2.5 Design and Implementation Constraints**: List any constraints that may impact the design and development of the system (e.g., regulatory requirements, programming languages, development tools).
    - **2.6 User Documentation**: Mention the types of user documentation that will be provided, such as user manuals, online help systems, or installation guides.
    - **2.7 Assumptions and Dependencies**: Describe any assumptions that have been made in defining the requirements and list external factors the project may depend on (e.g., third-party libraries, external services).

  **3. External Interface Requirements**:
    - **3.1 User Interfaces**: Describe the graphical or textual interfaces users will interact with. Include details about the design elements, such as screen layouts, button placements, and user flow.
    - **3.2 Hardware Interfaces**: Specify the physical devices the software will interact with (e.g., printers, sensors, or external storage).
    - **3.3 Software Interfaces**: Describe how the software will interface with other systems or applications, including API integrations and data exchange methods.
    - **3.4 Communications Interfaces**: Define the methods of communication between the software and external systems, such as network protocols, data formats, or communication standards.

  **4. System Features**:
    - List each major feature of the system in detail, including how users will interact with it and what functional goals it will accomplish. For each feature:
      - **4.1 System Feature 1**: Provide an overview of the feature, its importance, and how it benefits the system.
      - **4.2 System Feature 2 (and so on)**: Continue with the remaining features in the same format, providing necessary details for each.

  **5. Nonfunctional Requirements**:
    - **5.1 Performance Requirements**: Specify any performance goals, such as response times, throughput, or load-handling capabilities.
    - **5.2 Safety Requirements**: Highlight safety-related concerns, such as how the system will prevent data loss, avoid hazards, or manage risk.
    - **5.3 Security Requirements**: Outline the security measures that must be in place to protect the system from unauthorized access, data breaches, or other threats.
    - **5.4 Software Quality Attributes**: Discuss important quality attributes, such as reliability, maintainability, scalability, and usability.
    - **5.5 Business Rules**: Include any specific business rules the system must comply with, such as regulatory standards or company policies.

   6. **Language**:
     - Recommend the most suitable programming language(s) for developing the software. 
     - Justify the selection by considering factors like performance, scalability, ease of use, and community support.
     - Mention any alternative languages, if applicable, and reasons for their exclusion.

  7. **Database**:
     - Suggest the best database management system (DBMS) to be used, considering the nature of the project (e.g., SQL or NoSQL).
     - Provide reasons for the recommendation, such as ease of integration, scalability, performance, or suitability for storing specific data types.
     - Mention any backup or redundancy strategies to ensure data availability and reliability.

  8. **Time Required**:
     - Estimate the total time required to complete the development of the project.
     - Break down the time estimation into phases (e.g., planning, development, testing, deployment).
     - If possible, mention factors that could affect the timeline, such as external dependencies, team availability, or complexity of features.

  9. **Total Developers**:
     - Provide an estimate of the number of developers required, broken down into front-end and back-end developers.
     - Mention any specific expertise or experience required for the development team, such as proficiency in certain programming languages or frameworks.
     - Include any roles for support personnel, like project managers or quality assurance testers, if necessary.

  10. **Testing**:
     - Outline the testing strategy to ensure the software meets all requirements and functions as expected.
     - Mention specific types of testing, such as unit testing, integration testing, system testing, user acceptance testing (UAT), and performance testing.
     - Recommend testing tools that should be used, such as Selenium for automated testing, or Jest for JavaScript unit testing.

  11. **Recommendation Software**:
     - Suggest the most suitable platform for the software (e.g., Android, iOS, Web).
     - Consider factors like the target audience, distribution methods, and performance requirements.
     - If multiple platforms are recommended, justify why cross-platform development may be necessary.

  12. **Recommendation Tool**:
      - Recommend development tools, IDEs, or frameworks that should be used for building the software.
      - Provide justifications for each recommendation, such as developer productivity, community support, or ease of use.
      - Mention any additional tools for version control, collaboration, or deployment (e.g., Git, Docker, Jenkins).

  13. **Total Cost Estimation**:
      - Provide an estimate of the overall cost to complete the project, broken down into categories like development, testing, deployment, and maintenance.
      - Include cost factors like software licenses, developer salaries, hosting services, and other necessary resources.
      - Mention the currency in INR (Indian Rupees) and consider different pricing models (e.g., fixed cost, time and materials).

  **Conclusion**:
  - Provide a summary of the key points of the SRS document. Highlight the next steps for development and any open questions or unresolved issues.

  Important: Ensure the response is detailed and well-organized in PDF format, while strictly following the outlined format. Only include the specified sections without adding any additional information.
`;


  // Validation logic for SRS-related input
  const validateInput = () => {
    const lowerCaseInput = input.toLowerCase();

    // Check if input contains 'srs' (you can customize this condition based on your needs)
    const isSRS = lowerCaseInput.includes('srs');

    if (isSRS) {
      setError(false); // Clear any previous errors
      return true; // Return true for valid input
    } else {
      setError(true); // Show error if input doesn't match the validation
      setOutput(''); // Clear output
      return false; // Return false for invalid input
    }
  };

  // Function to generate dynamic SRS based on AI response
  const generateSRS = () => {
    // Validate input before generating SRS
    if (validateInput()) {
      // Call the AI to get the result and set it in the output
      onSent(input + srsPrompt).then(() => {
        setOutput(resultData); // Set the output after the AI responds
      });
    }
  };

  const formatResultData = (resultData) => {
    const parts = resultData.split(/(<b>|<\/b>)/g);
    const formattedParts = parts.map((part, index) => {
      if (part === '<b>' || part === '</b>') {
        return part; // Return the tag itself without modification
      }
      return index > 0 ? `<br/>${part}` : part; // Add <br /> for formatting
    }).join('');
    return formattedParts;
  };

  // PDF download functionality
  const pdfRef = useRef();

  const generatePDF = () => {
    const element = pdfRef.current;
    const fileName = input ? `${input}_SRS_Report.pdf` : 'SRS_Report.pdf';
    html2pdf().from(element).save(fileName);
  };

  return (
    <div className='main'>
      <div className="nav">
      <div class="srs-insider-bot">
        SRS INSIDER BOT
      </div>

        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {showResult
          ? <div className="result">
            <div className='result-title'>
              <img src={assets.user_icon} alt="" />
              <p>{currentInput}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading
                ? <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
                : <div className=''>
                  <div ref={pdfRef}
                    className="srs-output"
                    dangerouslySetInnerHTML={{ __html: formatResultData(resultData) }}
                  />
                  {resultData && <button onClick={generatePDF}>Download PDF</button>}
                </div>
              }
            </div>
          </div>
          : <>
            <div className="greet">
              <p><span>WELCOME</span></p>
              <p>How can I assist you with your SRS?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest elements to include in an SRS for a new project</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Summarize key components of an SRS document</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm ideas for improving the SRS process</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Enhance the structure of an SRS for clarity</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        }

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder='Enter a prompt here'
            />
            <div>
              <img src={assets.gallery_icon} width={30} alt="" />
              <img src={assets.mic_icon} width={30} alt="" />
              {input && <img
                onClick={generateSRS} // Generate SRS directly
                src={assets.send_icon}
                width={30}
                alt=""
              />}
            </div>
          </div>
          {error && <p className="error">Please enter a valid SRS-related prompt (e.g., "Your Project Name SRS")</p>}
          {output && <p className="output" dangerouslySetInnerHTML={{ __html: output }}></p>}  {/* Output displayed if input is valid */}
          <p className="bottom-info">
            SRS Insider Bot may display inaccurate info. Please verify responses. Your privacy is protected.
            <p>Developed by : @ADMH Tech</p>
          </p>
          
             
         

        </div>
      </div>
    </div>
  );
};

export default Main;
