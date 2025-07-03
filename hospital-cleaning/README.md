# Hospital Data Cleaning & IRB Workflow MVP

## Overview
This project is an MVP for a hospital data cleaning and IRB integration workflow. It features:
- **Researcher Portal**: Upload IRB documents, receive AI review, and access approved datasets.
- **Admin Dashboard**: Review IRBs with AI validation, approve/reject, and trigger dynamic FHIR data workflows.
- **Dynamic FHIR Querying**: Queries public HAPI FHIR server based on IRB content, cleans data, and creates seed datasets.
- **Persistent Storage**: All IRBs, workflows, and datasets are stored in file-based JSON for reliability.

---

## Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v8+ recommended)
- **Git**
- **Internet access** (for public HAPI FHIR server)

---

## 1. Clone the Repository
```sh
git clone <REPO_URL>
cd medfetch.js/hospital-cleaning
```

---

## 2. Install Dependencies
```sh
npm install
```

---

## 3. Set Up Environment Variables
Create a `.env` file in `hospital-cleaning/` with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
# or
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
```

- Only one is required, but both can be set for compatibility.
- You can get an API key from https://platform.openai.com/

---

## 4. Run All Tests
Run the full suite of end-to-end and dynamic FHIR tests:

```sh
npm run test:irb-dynamic-fhir
npm run test-end-to-end-irb
```

- All tests should pass and show successful resource retrieval from the HAPI FHIR server.

---

## 5. Start the Servers
### Admin Dashboard (port 3001)
```sh
npm run start-admin
```
- Visit: [http://localhost:3001](http://localhost:3001)

### Researcher Portal (port 3002)
Open a new terminal:
```sh
npm run start-researcher
```
- Visit: [http://localhost:3002](http://localhost:3002)

---

## 6. Usage
- **Researcher Portal**: Upload IRB docs, see AI review, submit for admin approval, and download datasets after approval.
- **Admin Dashboard**: Review IRBs, see AI validation, approve/reject, and monitor workflow progress and datasets.

---

## 7. Troubleshooting
- **OpenAI API Key Not Set**: Ensure `.env` is present and contains a valid key.
- **No Data Returned**: The public HAPI FHIR server may have limited data for some queries. Try uploading a different IRB or check logs for query details.
- **Port Conflicts**: Make sure ports 3001 and 3002 are free.
- **File Permissions**: Ensure the app can write to `public/seeds/` and `cleaned-data/`.

---

## 8. Resetting Data
To clear all IRB and dataset data (for a fresh start):
```sh
npm run clear-data
```

---

## 9. Project Structure
- `admin-server/` — Admin dashboard backend
- `researcher-server/` — Researcher portal backend
- `utils/` — Core logic for AI, FHIR, cleaning, and storage
- `bin/` — Test and utility scripts
- `public/seeds/` — Generated datasets (ZIPs)
- `cleaned-data/` — Cleaned CSVs

---

## 10. Support
For help, contact the project lead or open an issue in the repository. 