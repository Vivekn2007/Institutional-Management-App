import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Code, Palette, Mic, Book, Dumbbell, Languages } from "lucide-react";

const SkillsRecommendation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skillCategories = [
    {
      category: "Technology",
      skills: [
        { name: "Data Science", icon: Code, description: "Learn Python, ML, and analytics" },
        { name: "Web Development", icon: Code, description: "Build modern websites and apps" },
        { name: "Mobile Development", icon: Code, description: "Create iOS and Android apps" },
        { name: "AI/Machine Learning", icon: Code, description: "Explore artificial intelligence" }
      ]
    },
    {
      category: "Creative",
      skills: [
        { name: "Graphic Design", icon: Palette, description: "Master visual communication" },
        { name: "Video Editing", icon: Palette, description: "Create stunning videos" },
        { name: "Photography", icon: Palette, description: "Capture perfect moments" },
        { name: "UI/UX Design", icon: Palette, description: "Design user experiences" }
      ]
    },
    {
      category: "Personal Development",
      skills: [
        { name: "Public Speaking", icon: Mic, description: "Improve presentation skills" },
        { name: "Language Learning", icon: Languages, description: "Master new languages" },
        { name: "Writing", icon: Book, description: "Enhance communication skills" },
        { name: "Leadership", icon: Book, description: "Develop management abilities" }
      ]
    },
    {
      category: "Health & Wellness",
      skills: [
        { name: "Fitness Training", icon: Dumbbell, description: "Build strength and endurance" },
        { name: "Meditation", icon: Dumbbell, description: "Improve mental well-being" },
        { name: "Cooking", icon: Book, description: "Master culinary arts" },
        { name: "Yoga", icon: Dumbbell, description: "Enhance flexibility and peace" }
      ]
    }
  ];

  const filteredSkills = skillCategories.map(category => ({
    ...category,
    skills: category.skills.filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.skills.length > 0);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(name => name !== skillName)
        : [...prev, skillName]
    );
  };

  const handleContinue = () => {
    // Store selected skills
    localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
    navigate("/generated-timetable");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/daily-setup")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Skills Recommendation</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Enhance Your Free Time</h2>
            <p className="text-muted-foreground">
              Based on your schedule, here are skills you can develop during your free time
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Selected Skills ({selectedSkills.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="default"
                      className="gradient-primary text-white cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Grid */}
          <div className="space-y-8">
            {filteredSkills.map((category) => (
              <div key={category.category} className="space-y-4">
                <h3 className="text-xl font-semibold">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.skills.map((skill) => {
                    const Icon = skill.icon;
                    const isSelected = selectedSkills.includes(skill.name);
                    
                    return (
                      <Card 
                        key={skill.name}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-glow'
                        }`}
                        onClick={() => toggleSkill(skill.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{skill.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {skill.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="text-primary font-medium">✓</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredSkills.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No skills found matching "{searchQuery}"</p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/generated-timetable")}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button 
              onClick={handleContinue}
              className="flex-1 gradient-primary text-white"
              disabled={selectedSkills.length === 0}
            >
              Continue with {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillsRecommendation;