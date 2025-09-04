export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Successful Opening Night of 'Romeo and Juliet'",
      date: "February 15, 2024",
      excerpt: "Our latest production opened to a packed house with standing ovations. The cast delivered exceptional performances that moved the audience to tears and laughter.",
      author: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Behind the Scenes: Costume Design Workshop",
      date: "February 8, 2024",
      excerpt: "Our costume team hosted a workshop for community members interested in learning about period costume design and construction techniques.",
      author: "Mike Chen"
    },
    {
      id: 3,
      title: "New Member Auditions - Great Turnout!",
      date: "January 28, 2024",
      excerpt: "We welcomed over 30 new potential members to our audition day. The talent pool continues to grow in our community.",
      author: "Emma Davis"
    },
    {
      id: 4,
      title: "Community Outreach Program Launch",
      date: "January 20, 2024",
      excerpt: "MMTC is proud to announce our new outreach program bringing theatre education to local schools and community centers.",
      author: "David Wilson"
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Recent Activities & News</h1>
        
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 hover:text-purple-700 cursor-pointer">
                  {post.title}
                </h2>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{post.date}</span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">By {post.author}</span>
                <button className="text-purple-700 hover:text-purple-900 font-medium">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}