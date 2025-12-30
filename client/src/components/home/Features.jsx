import { Zap, FileText, Search, MessageSquare, BookOpen } from "lucide-react";
import React from "react";
import Title from "./Title";

const Features = () => {
  const [activeFeature, setActiveFeature] = React.useState(0);

  const features = [
    {
      icon: FileText,
      title: "AI Resume Builder",
      description: "Create professional, ATS-optimized resumes in minutes with AI-powered suggestions and beautiful templates.",
      color: "violet"
    },
    {
      icon: Search,
      title: "Resume Analyzer",
      description: "Get instant feedback on your resume with our ML-powered analyzer. Identify strengths and areas for improvement.",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Mock Interview",
      description: "Practice with AI-powered mock interviews. Get real-time feedback on your answers and improve your confidence.",
      color: "orange"
    },
    {
      icon: BookOpen,
      title: "Interview Preparation",
      description: "Access curated interview questions, tips, and resources tailored to your industry and role.",
      color: "emerald"
    }
  ];

  const colorClasses = {
    violet: { bg: "bg-violet-100", border: "border-violet-300", stroke: "stroke-violet-600" },
    blue: { bg: "bg-[#1568ab]/10", border: "border-[#1568ab]/30", stroke: "stroke-[#1568ab]" },
    orange: { bg: "bg-orange-100", border: "border-orange-300", stroke: "stroke-orange-600" },
    emerald: { bg: "bg-emerald-100", border: "border-emerald-300", stroke: "stroke-emerald-600" }
  };

  return (
    <div id="features" className="flex flex-col items-center my-10 scroll-mt-12">
    
     <div className="flex items-center gap-2 text-sm text-[#1568ab] bg-[#1568ab]/10 rounded-full px-6 py-1.5">
            <Zap width={14} />
            <span>Powerful Features</span>
        </div>

        <Title title='Your Complete Career Toolkit' description='JobMate AI provides everything you need to land your dream job — from building the perfect resume to acing your interviews.' />

      <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10">
        <img
          className="max-w-2xl w-full xl:-ml-32"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="JobMate AI Features"
        />
        <div className="px-4 md:px-0">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-center gap-6 max-w-md group cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`p-6 border border-transparent flex gap-4 rounded-xl transition-colors ${
                    activeFeature === index ? `${colors.bg} ${colors.border}` : `group-hover:${colors.bg} group-hover:${colors.border}`
                  }`}
                >
                  <Icon className={`size-6 ${colors.stroke}`} />
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-700">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
    </div>
  );
};

export default Features;
