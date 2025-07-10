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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative px-6 py-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-white/10 to-gray-300/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2">
                <span className="text-white/90 text-sm font-medium">
                  🚀 Healthcare Data Revolution
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Data fetching made
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {" "}
                effortless
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform complex medical data queries into simple conversations.
              Medfetch combines the power of SQL with natural language
              processing for seamless healthcare data management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/showcase/researcher/create"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-2 shadow-xl"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Try Interactive Demo</span>
              </Link>
              <Link
                href="/docs"
                className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 inline-flex items-center justify-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>View Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 py-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Medfetch?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Built for healthcare professionals who need powerful data insights
              without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/10 rounded-xl p-3 w-fit mb-6 group-hover:bg-white/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Natural Language Queries
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Ask questions in plain English and get instant SQL queries. No
                need to remember complex syntax or table structures.
              </p>
            </div>

            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/10 rounded-xl p-3 w-fit mb-6 group-hover:bg-white/20 transition-colors">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Built on SQLite with optimized queries for instant results.
                Perfect for real-time data analysis and reporting.
              </p>
            </div>

            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/10 rounded-xl p-3 w-fit mb-6 group-hover:bg-white/20 transition-colors">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Secure & Compliant
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Healthcare-grade security with HIPAA compliance in mind. Your
                data stays secure and private at all times.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 py-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See It In Action
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the power of conversational data queries with our
              interactive demo
            </p>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-lg border border-gray-600/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="lg:col-span-2 flex flex-col lg:flex-row items-stretch gap-8">
              <div className="min-w-0 max-w-md w-full flex-shrink-0 flex flex-col">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Chat with Your Data
                </h3>
                <div className="flex-1 flex flex-col">
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700 flex-1 flex flex-col">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      You ask:
                    </p>
                    <p className="text-white leading-relaxed text-sm flex-1">
                      "Show me pediatric patients over 20 years old admitted in
                      the US after 2015 with tibial shaft fractures."
                    </p>
                  </div>
                  <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-700"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-800/80 rounded-lg p-2 border border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-white" />
                          <span className="text-gray-300 text-xs">
                            Patient Database Connected
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-700/60 rounded-lg p-1 text-xs text-gray-400 font-mono border border-gray-600">
                        Loading 1,247 patient records...
                      </div>
                      <div className="bg-gray-700/60 rounded-lg p-1 text-xs text-green-400 font-mono border border-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        ✓ Ready for natural language queries
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/showcase/researcher/create"
                  className="mt-8 bg-white text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 w-fit"
                >
                  <span>Try It Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>

                  <div className="relative">
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white/60 transform rotate-45 animate-bounce"></div>
                    <div className="absolute inset-0 w-3 h-3 border-t-2 border-r-2 border-white/20 transform rotate-45 animate-ping"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Medfetch responds with data:
                  </p>
                  <div className="bg-gray-900/80 rounded-lg border border-gray-700 overflow-x-auto">
                    <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700">
                      <h4 className="text-white font-medium text-xs">
                        Patient Query Results (4 records found)
                      </h4>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="bg-gray-800/30">
                        <tr>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            ID
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Age
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Gender
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Admission
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Location
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Diagnosis
                          </th>
                          <th className="text-left px-4 py-1 text-gray-300 font-medium">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPatientData.map((patient, index) => (
                          <tr
                            key={patient.id}
                            className="border-t border-gray-700/50 hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="px-4 py-1 text-white font-mono">
                              {patient.id}
                            </td>
                            <td className="px-4 py-1 text-gray-300">
                              {patient.age}
                            </td>
                            <td className="px-4 py-1 text-gray-300">
                              {patient.gender}
                            </td>
                            <td className="px-4 py-1 text-gray-300 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {patient.admissionDate}
                            </td>
                            <td className="px-4 py-1 text-gray-300 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
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
                    <div className="px-3 py-1 bg-gray-800/20 border-t border-gray-700 text-2xs text-gray-400">
                      Query executed in 0.023s • 4 rows returned
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-600/50 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Data Workflow?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join healthcare professionals who are already using Medfetch to
              streamline their data analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/showcase/researche/create"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
              >
                <span>Start Free Demo</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/showcase"
                className="text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2 border border-gray-600 hover:border-gray-500 bg-gray-800/30 hover:bg-gray-700/30"
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
