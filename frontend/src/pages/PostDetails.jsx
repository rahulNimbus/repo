import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const posts = [
  {
    id: 0,
    title: "Featured Recipe: Avocado Toast Deluxe",
    fullContent: `This deluxe avocado toast features smashed avocado on sourdough, topped with cherry tomatoes, radish slices, poached egg, and a drizzle of chili oil.`,
    image: "https://edibledelmarva.ediblecommunities.com/sites/default/files/images/recipe/deluxe-avocado-1.jpg",
  },
  {
    id: 1,
    title: "5 Quick & Healthy Breakfast Ideas",
    fullContent: `Here are 5 breakfast ideas:\n\n1. Avocado Toast\n2. Greek Yogurt Parfait\n3. Overnight Oats\n4. Smoothie Bowl\n5. Banana Pancakes.`,
  },
  {
    id: 2,
    title: "How to Make The Perfect Smoothie Bowl",
    fullContent: `Blend frozen fruits with almond milk. Top with granola, chia seeds, fresh fruits, and honey.`,
  },
];

function PostDetails() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            {post.image && <img src={post.image} className="card-img-top" alt={post.title} />}
            <div className="card-body">
              <h3 className="card-title">{post.title}</h3>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                {post.fullContent}
              </p>
              <Link to="/" className="btn btn-secondary me-2">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PostDetails;
