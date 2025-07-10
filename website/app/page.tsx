import Link from "next/link";
import {
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  Code,
  Users,
  Calendar,
  MapPin,
  Activity,
} from "lucide-react";
import SanityCheck from "@/app/page.SanityCheck";

export default function IndexPage() {
  const mockPatientData = [
    {
      id: "P001",
      age: 22,
      gender: "M",
      admissionDate: "2018-03-15",
      location: "Boston, MA",
      diagnosis: "Tibial Shaft Fracture",
      status: "Discharged",
    },
    {
      id: "P002",
      age: 25,
      gender: "F",
      admissionDate: "2019-07-22",
      location: "New York, NY",
      diagnosis: "Closed Tibial Fracture",
      status: "Recovered",
    },
    {
      id: "P003",
      age: 28,
      gender: "M",
      admissionDate: "2020-11-08",
      location: "Chicago, IL",
      diagnosis: "Tibial Shaft Fracture",
      status: "Follow-up",
    },
    {
      id: "P004",
      age: 24,
      gender: "F",
      admissionDate: "2021-05-14",
      location: "Los Angeles, CA",
      diagnosis: "Complex Tibial Fracture",
      status: "Discharged",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-white/5 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full top-1/2 -left-40 w-96 h-96 bg-gray-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 w-64 h-64 rounded-full right-1/3 bg-white/3 blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="px-6 py-2 border rounded-full bg-gradient-to-r from-white/10 to-gray-300/10 backdrop-blur-sm border-white/20">
                <span className="text-sm font-medium text-white/90">
                  🚀 Healthcare Data Revolution
                </span>
              </div>
            </div>
            <h1 className="mb-8 text-5xl font-bold leading-tight text-white md:text-7xl">
              Data fetching made
              <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                {" "}
                effortless
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-300 md:text-2xl">
              Transform complex medical data queries into simple conversations.
              Medfetch combines the power of SQL with natural language
              processing for seamless healthcare data management.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/showcase/researcher/create"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-900 transition-all duration-300 transform bg-white shadow-xl hover:bg-gray-100 rounded-xl hover:scale-105 hover:shadow-2xl"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Try Interactive Demo</span>
              </Link>
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://docs.medfetch.io"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-300 border border-gray-600 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 rounded-xl hover:border-gray-500"
              >
                <Code className="w-5 h-5" />
                <span>View Documentation</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Why Choose Medfetch?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">
              Built for healthcare professionals who need powerful data insights
              without the complexity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 transition-all duration-300 border border-gray-700 group bg-gray-900/50 backdrop-blur-sm hover:border-gray-600 rounded-2xl hover:bg-gray-800/60 hover:transform hover:scale-105">
              <div className="p-3 mb-6 transition-colors bg-white/10 rounded-xl w-fit group-hover:bg-white/20">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-white">
                Natural Language Queries
              </h3>
              <p className="leading-relaxed text-gray-300">
                Ask questions in plain English and get instant SQL queries. No
                need to remember complex syntax or table structures.
              </p>
            </div>

            <div className="p-8 transition-all duration-300 border border-gray-700 group bg-gray-900/50 backdrop-blur-sm hover:border-gray-600 rounded-2xl hover:bg-gray-800/60 hover:transform hover:scale-105">
              <div className="p-3 mb-6 transition-colors bg-white/10 rounded-xl w-fit group-hover:bg-white/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-white">
                Lightning Fast
              </h3>
              <p className="leading-relaxed text-gray-300">
                Built on SQLite with optimized queries for instant results.
                Perfect for real-time data analysis and reporting.
              </p>
            </div>

            <div className="p-8 transition-all duration-300 border border-gray-700 group bg-gray-900/50 backdrop-blur-sm hover:border-gray-600 rounded-2xl hover:bg-gray-800/60 hover:transform hover:scale-105">
              <div className="p-3 mb-6 transition-colors bg-white/10 rounded-xl w-fit group-hover:bg-white/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-white">
                Secure & Compliant
              </h3>
              <p className="leading-relaxed text-gray-300">
                Healthcare-grade security with HIPAA compliance in mind. Your
                data stays secure and private at all times.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              See It In Action
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">
              Experience the power of conversational data queries with our
              interactive demo
            </p>
          </div>

          <div className="p-8 border shadow-2xl bg-gray-900/40 backdrop-blur-lg border-gray-600/50 rounded-3xl md:p-12">
            <div className="flex flex-col items-stretch gap-8 lg:col-span-2 lg:flex-row">
              <div className="flex flex-col flex-shrink-0 w-full max-w-md min-w-0">
                <h3 className="mb-6 text-2xl font-semibold text-white">
                  Chat with Your Data
                </h3>
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col flex-1 p-4 border border-gray-700 bg-gray-800/60 backdrop-blur-sm rounded-xl">
                    <p className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      You ask:
                    </p>
                    <p className="flex-1 text-sm leading-relaxed text-white">
                      "Show me pediatric patients over 20 years old admitted in
                      the US after 2015 with tibial shaft fractures."
                    </p>
                  </div>
                  <div className="p-4 mt-4 border bg-gray-900/60 backdrop-blur-sm rounded-2xl border-gray-600/50">
                    <div className="flex items-center mb-2 space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 delay-300 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 delay-700 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 border border-gray-700 rounded-lg bg-gray-800/80">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-white" />
                          <span className="text-xs text-gray-300">
                            Patient Database Connected
                          </span>
                        </div>
                      </div>
                      <div className="p-1 font-mono text-xs text-gray-400 border border-gray-600 rounded-lg bg-gray-700/60">
                        Loading 1,247 patient records...
                      </div>
                      <div className="flex items-center gap-2 p-1 font-mono text-xs text-green-400 border border-gray-600 rounded-lg bg-gray-700/60">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        ✓ Ready for natural language queries
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/showcase/researcher/create"
                  className="inline-flex items-center justify-center px-4 py-3 mt-8 space-x-2 font-medium text-gray-900 transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 w-fit"
                >
                  <span>Try It Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>

                  <div className="relative">
                    <div className="w-3 h-3 transform rotate-45 border-t-2 border-r-2 border-white/60 animate-bounce"></div>
                    <div className="absolute inset-0 w-3 h-3 transform rotate-45 border-t-2 border-r-2 border-white/20 animate-ping"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex flex-col flex-1 p-4 border bg-white/5 backdrop-blur-sm rounded-xl border-white/20">
                  <p className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                    <Activity className="w-4 h-4" />
                    Medfetch responds with data:
                  </p>
                  <div className="overflow-x-auto border border-gray-700 rounded-lg bg-gray-900/80">
                    <div className="px-3 py-2 border-b border-gray-700 bg-gray-800/50">
                      <h4 className="text-xs font-medium text-white">
                        Patient Query Results (4 records found)
                      </h4>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="bg-gray-800/30">
                        <tr>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            ID
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Age
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Gender
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Admission
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Location
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Diagnosis
                          </th>
                          <th className="px-4 py-1 font-medium text-left text-gray-300">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPatientData.map((patient, index) => (
                          <tr
                            key={patient.id}
                            className="transition-colors border-t border-gray-700/50 hover:bg-gray-800/20"
                          >
                            <td className="px-4 py-1 font-mono text-white">
                              {patient.id}
                            </td>
                            <td className="px-4 py-1 text-gray-300">
                              {patient.age}
                            </td>
                            <td className="px-4 py-1 text-gray-300">
                              {patient.gender}
                            </td>
                            <td className="flex items-center gap-1 px-4 py-1 text-gray-300">
                              <Calendar className="w-3 h-3" />
                              {patient.admissionDate}
                            </td>
                            <td className="flex items-center gap-1 px-4 py-1 text-gray-300">
                              <MapPin className="w-3 h-3" />
                              {patient.location}
                            </td>
                            <td className="px-4 py-1 text-gray-300">
                              {patient.diagnosis}
                            </td>
                            <td className="px-4 py-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                                  patient.status === "Discharged"
                                    ? "bg-green-900/30 text-green-300 border border-green-700/30"
                                    : patient.status === "Recovered"
                                      ? "bg-blue-900/30 text-blue-300 border border-blue-700/30"
                                      : "bg-yellow-900/30 text-yellow-300 border border-yellow-700/30"
                                }`}
                              >
                                {patient.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-3 py-1 text-gray-400 border-t border-gray-700 bg-gray-800/20 text-2xs">
                      Query executed in 0.023s • 4 rows returned
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 border bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-600/50 rounded-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Transform Your Data Workflow?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-300">
              Join healthcare professionals who are already using Medfetch to
              streamline their data analysis
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/showcase/researcher/create"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-900 transition-all duration-300 transform bg-white shadow-xl hover:bg-gray-100 rounded-xl hover:scale-105 hover:shadow-2xl"
              >
                <span>Start Free Demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-300 transition-colors border border-gray-600 hover:text-white rounded-xl hover:border-gray-500 bg-gray-800/30 hover:bg-gray-700/30"
              >
                <span>View All Examples</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SanityCheck />
    </div>
  );
}
