import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Filter, Search } from "lucide-react";

const StorePage = () => {
  const storeItems = [
    { id: 1, name: "Premium Koi Food", price: "350.000", category: "Food" },
    {
      id: 2,
      name: "Water Testing Kit",
      price: "275.000",
      category: "Equipment",
    },
    { id: 3, name: "Koi Medication", price: "180.000", category: "Health" },
    {
      id: 4,
      name: "Pond Filter System",
      price: "1.200.000",
      category: "Equipment",
    },
    { id: 5, name: "Koi Net", price: "125.000", category: "Equipment" },
    { id: 6, name: "Water Conditioner", price: "95.000", category: "Health" },
    {
      id: 7,
      name: "Decorative Pond Plants",
      price: "75.000",
      category: "Decoration",
    },
    {
      id: 8,
      name: "Automatic Feeder",
      price: "450.000",
      category: "Equipment",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Our Store</h1>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg bg-yellow-100 p-4 md:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          </div>
          <div className="flex gap-4">
            <select className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800">
              <option value="">All Categories</option>
              {/* <option value="food"></option>
              <option value="equipment">Equipment</option>
              <option value="health">Health</option>
              <option value="decoration">Decoration</option> */}
            </select>
            <select className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <button className="flex items-center gap-2 rounded-md bg-red-800 px-4 py-2 text-white transition-colors hover:bg-red-700">
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {storeItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              <div className="relative aspect-square">
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute right-2 top-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-red-800">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-medium">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Rp. {item.price}</span>
                  <button className="rounded-full bg-red-800 p-2 text-white transition-colors hover:bg-red-700">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-1">
            <button className="rounded-l-md bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300">
              Previous
            </button>
            <button className="bg-red-800 px-4 py-2 text-white">1</button>
            <button className="bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300">
              2
            </button>
            <button className="bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300">
              3
            </button>
            <button className="rounded-r-md bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300">
              Next
            </button>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {["Food", "Equipment", "Health", "Decoration"].map((category) => (
              <div
                key={category}
                className="group relative h-40 overflow-hidden rounded-lg"
              >
                <Image
                  src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(category)}`}
                  alt={category}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <h3 className="text-xl font-bold text-white">{category}</h3>
                </div>
                <Link
                  href={`/store?category=${category.toLowerCase()}`}
                  className="absolute inset-0"
                >
                  <span className="sr-only">Shop {category}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="bg-red-800 text-white rounded-lg p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="mb-6">Subscribe to our newsletter for exclusive offers and updates on new products</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-l-md text-black focus:outline-none"
            />
            <button className="bg-yellow-100 text-red-800 font-bold px-6 py-2 rounded-r-md hover:bg-yellow-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default StorePage;
