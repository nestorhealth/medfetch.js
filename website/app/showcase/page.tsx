import Link from "next/link";
import {
  ArrowRight,
  Database,
  Users,
  TrendingUp,
  FileText,
  Activity,
  Calendar,
  PieChart,
  BarChart3,
  Search,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

export default function Showcase() {
  const showcaseItems = [
    {
      id: "researcher",
      title: "Clinical Researcher Dashboard",
      description:
        "Interactive spreadsheet interface for medical researchers to query patient data, analyze treatment outcomes, and generate reports.",
      features: [
        "Natural language queries",
        "Real-time data filtering",
        "Export capabilities",
        "Statistical analysis",
      ],
      icon: Database,
      status: "Live Demo",
      complexity: "Advanced",
      href: "/showcase/researcher",
    },
    {
      id: "analytics",
      title: "Healthcare Analytics",
      description:
        "Comprehensive analytics dashboard for hospital administrators to track metrics, outcomes, and operational efficiency.",
      features: [
        "Performance metrics",
        "Trend analysis",
        "Custom reports",
        "KPI tracking",
      ],
      icon: TrendingUp,
      status: "Coming Soon",
      complexity: "Expert",
      href: "#",
    },
  ];

  const stats = [
    { label: "Healthcare Facilities", value: "40+", icon: Activity },
    { label: "Data Points Processed", value: "2.3K", icon: Database },
    { label: "Query Response Time", value: "<50ms", icon: Clock },
    { label: "Uptime Guarantee", value: "100.0%", icon: Shield },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Beginner":
        return "bg-green-900/30 text-green-300 border-green-700/30";
      case "Intermediate":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700/30";
      case "Advanced":
        return "bg-orange-900/30 text-orange-300 border-orange-700/30";
      case "Expert":
        return "bg-red-900/30 text-red-300 border-red-700/30";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live Demo":
        return "bg-green-900/30 text-green-300 border-green-700/30";
      case "Beta":
        return "bg-blue-900/30 text-blue-300 border-blue-700/30";
      case "Coming Soon":
        return "bg-gray-900/30 text-gray-300 border-gray-700/30";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-white/2 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative px-6 py-16 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-white/10 to-gray-300/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2">
                <span className="text-white/90 text-sm font-medium">
                  🎯 Live Demonstrations
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Medfetch in
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {" "}
                Action
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore real-world applications of Medfetch across different
              healthcare scenarios. From clinical research to administrative
              analytics, see how natural language transforms data interaction.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-800/40 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-6 py-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {showcaseItems.map((item, index) => {
              const IconComponent = item.icon;
              const isAvailable =
                item.status === "Live Demo" || item.status === "Beta";

              return (
                <div key={item.id} className="group relative">
                  <div
                    className={`bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-300 h-full ${
                      isAvailable
                        ? "hover:bg-gray-800/50 hover:border-gray-600/50 hover:transform hover:scale-105 cursor-pointer"
                        : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="bg-white/10 rounded-xl p-3 group-hover:bg-white/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getComplexityColor(item.complexity)}`}
                        >
                          {item.complexity}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <div className="space-y-2 mb-8">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Key Features:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {item.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {isAvailable ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg"
                      >
                        <span>Try Demo</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-gray-700/50 text-gray-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                        <Clock className="h-4 w-4" />
                        <span>Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative px-6 py-16 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/30 backdrop-blur-lg border border-gray-600/50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Makes Our Demos Special?
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Each showcase demonstrates real-world healthcare scenarios with
                production-ready features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Real Data Queries
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Work with realistic medical datasets and see how natural
                  language translates to complex SQL queries in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Interactive Experience
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Fully functional interfaces that respond to your inputs,
                  demonstrating the full power of conversational data access.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Visual Analytics
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  See your data come alive with charts, graphs, and
                  visualizations that update instantly based on your queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 py-16 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-600/50 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Own?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              These demos show just a fraction of what's possible with Medfetch.
              Start building your custom healthcare data solution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>View Documentation</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2 border border-gray-600 hover:border-gray-500 bg-gray-800/30 hover:bg-gray-700/30"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
