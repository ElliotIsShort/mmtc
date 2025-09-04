export default function About() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Artistic Director",
      bio: "Sarah has been with MMTC for over 8 years, bringing her passion for classical theatre and modern interpretations to our stage."
    },
    {
      name: "Mike Chen",
      role: "Technical Director",
      bio: "Mike oversees all technical aspects of our productions, from lighting design to set construction, ensuring every show runs smoothly."
    },
    {
      name: "Emma Davis",
      role: "Education Coordinator",
      bio: "Emma leads our community outreach programs and workshops, helping to nurture the next generation of theatre enthusiasts."
    },
    {
      name: "David Wilson",
      role: "Production Manager",
      bio: "David coordinates all aspects of production planning and scheduling, keeping our ambitious season on track."
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About MMTC Theatre Group</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded in 2015, MMTC Theatre Group has been a cornerstone of our community&apos;s cultural life, 
            bringing exceptional live theatre to audiences while fostering artistic growth and creative expression.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-purple-700 mb-4">What We Do</h3>
              <p className="text-gray-600 leading-relaxed">
                We produce high-quality theatrical performances ranging from classical works to contemporary pieces, 
                providing our community with diverse and engaging entertainment while creating opportunities for 
                local talent to shine.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-700 mb-4">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Artistic excellence and integrity</li>
                <li>• Inclusive and welcoming community</li>
                <li>• Educational outreach and mentorship</li>
                <li>• Collaborative creative process</li>
                <li>• Accessibility for all audiences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2015 - Founded</h3>
                <p className="text-gray-600">Started by a group of passionate theatre enthusiasts with a dream to bring professional-quality theatre to our community.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2018 - New Home</h3>
                <p className="text-gray-600">Moved to our current theatre space, allowing us to expand our productions and welcome larger audiences.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2024 - Today</h3>
                <p className="text-gray-600">Over 50 productions performed, hundreds of community members involved, and thousands of audience members entertained.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-purple-700 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-purple-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Theatre Family</h2>
          <p className="text-lg mb-6">
            Whether you&apos;re interested in acting, directing, technical work, or volunteering, 
            there&apos;s a place for you at MMTC Theatre Group.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-medium">
              Audition Information
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-purple-700 transition-colors font-medium">
              Volunteer Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}