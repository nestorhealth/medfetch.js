"use client";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  TrendingUp,
  Activity,
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full top-20 right-20 w-72 h-72 bg-white/3 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full bottom-20 left-20 w-96 h-96 bg-gray-400/5 blur-3xl animate-pulse"></div>
        <div className="absolute w-48 h-48 rounded-full top-1/2 right-1/3 bg-white/2 blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-block mb-6">
              <div className="px-6 py-2 border rounded-full bg-gradient-to-r from-white/10 to-gray-300/10 backdrop-blur-sm border-white/20">
                <span className="text-sm font-medium text-white/90">
                  🎯 Live Demonstrations
                </span>
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Medfetch in
              <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                {" "}
                Action
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300">
              Explore real-world applications of Medfetch across different
              healthcare scenarios. From clinical research to administrative
              analytics, see how natural language transforms data interaction.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 text-center transition-all duration-300 border bg-gray-900/40 backdrop-blur-sm border-gray-700/50 rounded-xl hover:bg-gray-800/40"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-white" />
                <div className="mb-1 text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {showcaseItems.map((item, index) => {
              const IconComponent = item.icon;
              const isAvailable =
                item.status === "Live Demo" || item.status === "Beta";

              return (
                <div key={item.id} className="relative group">
                  <div
                    className={`bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-300 h-full ${
                      isAvailable
                        ? "hover:bg-gray-800/50 hover:border-gray-600/50 hover:transform hover:scale-105 cursor-pointer"
                        : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 transition-colors bg-white/10 rounded-xl group-hover:bg-white/20">
                        <IconComponent className="w-8 h-8 text-white" />
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

                    <h3 className="mb-4 text-2xl font-semibold text-white transition-colors group-hover:text-gray-100">
                      {item.title}
                    </h3>
                    <p className="mb-6 leading-relaxed text-gray-300">
                      {item.description}
                    </p>

                    <div className="mb-8 space-y-2">
                      <h4 className="mb-3 text-sm font-medium text-gray-400">
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
                        className="inline-flex items-center gap-2 px-6 py-3 font-medium text-gray-900 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 group-hover:shadow-lg"
                      >
                        <span>Try Demo</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-6 py-3 font-medium text-gray-400 rounded-lg cursor-not-allowed bg-gray-700/50">
                        <Clock className="w-4 h-4" />
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

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 border bg-gray-900/30 backdrop-blur-lg border-gray-600/50 rounded-3xl md:p-12">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                What Makes Our Demos Special?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-300">
                Each showcase demonstrates real-world healthcare scenarios with
                production-ready features
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="p-4 mx-auto mb-4 rounded-full bg-white/10 w-fit">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Real Data Queries
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Work with realistic medical datasets and see how natural
                  language translates to complex SQL queries in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 mx-auto mb-4 rounded-full bg-white/10 w-fit">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Interactive Experience
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Fully functional interfaces that respond to your inputs,
                  demonstrating the full power of conversational data access.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 mx-auto mb-4 rounded-full bg-white/10 w-fit">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Visual Analytics
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  See your data come alive with charts, graphs, and
                  visualizations that update instantly based on your queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 border bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-lg border-gray-600/50 rounded-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Build Your Own?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-300">
              These demos show just a fraction of what's possible with Medfetch.
              Start building your custom healthcare data solution today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-900 transition-all duration-300 transform bg-white shadow-xl hover:bg-gray-100 rounded-xl hover:scale-105"
              >
                <span>View Documentation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-300 transition-colors border border-gray-600 hover:text-white rounded-xl hover:border-gray-500 bg-gray-800/30 hover:bg-gray-700/30"
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
