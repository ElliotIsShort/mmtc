export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Banner for Upcoming Production */}
      <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MMTC</h1>
          <p className="text-xl mb-8">Bringing Stories to Life Through Theatre</p>
          
          <div className="bg-yellow-400 text-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Next Production</h2>
            <h3 className="text-2xl font-semibold mb-2">"The Tempest"</h3>
            <p className="text-lg mb-4">by William Shakespeare</p>
            <div className="flex justify-center space-x-8 text-sm">
              <div>
                <strong>Dates:</strong> March 15-17, 2024
              </div>
              <div>
                <strong>Time:</strong> 7:30 PM
              </div>
              <div>
                <strong>Venue:</strong> Main Theatre Hall
              </div>
            </div>
            <button className="mt-6 bg-purple-900 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors">
              Get Tickets
            </button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About MMTC Theatre Group</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a passionate community of theatre enthusiasts dedicated to creating memorable 
              performances that inspire, entertain, and bring people together through the magic of live theatre.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Productions</h3>
              <p className="text-gray-600">Professional-level performances with attention to every detail</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
              <p className="text-gray-600">Building connections through shared love of theatre arts</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">Committed to artistic excellence in every performance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
