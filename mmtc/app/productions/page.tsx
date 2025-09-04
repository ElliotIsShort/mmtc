export default function Productions() {
  const productions = [
    {
      id: 1,
      title: "Romeo and Juliet",
      playwright: "William Shakespeare",
      year: "2024",
      dates: "February 10-18, 2024",
      director: "Sarah Johnson",
      description: "A timeless tale of love and tragedy, set in modern-day Verona. Our interpretation brought fresh energy to this classic story.",
      cast: ["Emma Davis as Juliet", "Michael Brown as Romeo", "David Wilson as Mercutio"],
      image: "/productions/romeo-juliet.jpg"
    },
    {
      id: 2,
      title: "The Importance of Being Earnest",
      playwright: "Oscar Wilde",
      year: "2023",
      dates: "November 15-23, 2023",
      director: "Mike Chen",
      description: "Wilde's brilliant comedy of manners delivered with wit and style. The audience was delighted by the clever wordplay and mistaken identities.",
      cast: ["Tom Anderson as Jack", "Lisa Parker as Gwendolen", "James Miller as Algernon"],
      image: "/productions/earnest.jpg"
    },
    {
      id: 3,
      title: "Our Town",
      playwright: "Thornton Wilder",
      year: "2023",
      dates: "September 8-16, 2023",
      director: "Emma Davis",
      description: "A moving portrayal of life in small-town America. This production touched hearts and reminded us of life's precious moments.",
      cast: ["Sarah Johnson as Emily", "David Wilson as George", "Mike Chen as Stage Manager"],
      image: "/productions/our-town.jpg"
    },
    {
      id: 4,
      title: "A Midsummer Night's Dream",
      playwright: "William Shakespeare",
      year: "2023",
      dates: "June 2-10, 2023",
      director: "David Wilson",
      description: "A magical summer production performed in our outdoor amphitheater. The natural setting enhanced the enchanted forest atmosphere.",
      cast: ["Lisa Parker as Titania", "Tom Anderson as Oberon", "James Miller as Puck"],
      image: "/productions/midsummer.jpg"
    },
    {
      id: 5,
      title: "Steel Magnolias",
      playwright: "Robert Harling",
      year: "2022",
      dates: "October 14-22, 2022",
      director: "Sarah Johnson",
      description: "A heartwarming story of friendship and resilience among Southern women. Not a dry eye in the house during our emotional performances.",
      cast: ["Emma Davis as Shelby", "Lisa Parker as M'Lynn", "Sarah Johnson as Truvy"],
      image: "/productions/steel-magnolias.jpg"
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Productions</h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore our collection of memorable performances that have graced our stage over the years.
        </p>
        
        <div className="grid gap-8">
          {productions.map((production) => (
            <div key={production.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <p className="text-sm text-gray-500">Production Photo</p>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{production.title}</h2>
                      <p className="text-lg text-gray-600">by {production.playwright}</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {production.year}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Dates:</strong> {production.dates} | <strong>Director:</strong> {production.director}
                    </p>
                    <p className="text-gray-700 leading-relaxed">{production.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Featured Cast:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {production.cast.map((member, index) => (
                        <li key={index}>• {member}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Want to see more of our work or get involved?</p>
          <button className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors">
            Join Our Next Production
          </button>
        </div>
      </div>
    </div>
  );
}