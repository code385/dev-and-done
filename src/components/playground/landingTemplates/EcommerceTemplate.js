'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EcommerceTemplate({ demoComponent, demoName }) {
  const [cartCount, setCartCount] = useState(0);
  const products = [
    { id: 1, name: 'Premium Headphones', price: '$299', image: '🎧' },
    { id: 2, name: 'Smart Watch', price: '$399', image: '⌚' },
    { id: 3, name: 'Wireless Earbuds', price: '$149', image: '🎵' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            ShopHub
          </motion.div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition">Products</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">About</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition">Contact</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 py-2 border border-border rounded-lg text-sm font-semibold"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-background rounded-full text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Demo */}
        <div className="absolute inset-0 -z-10 opacity-30">
          {demoComponent}
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Discover Amazing
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Products
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Shop the latest trends and find your perfect style
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-background rounded-lg text-lg font-semibold shadow-lg"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Featured Products
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/50 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{product.price}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCartCount(cartCount + 1)}
                    className="w-full px-4 py-2 bg-primary text-background rounded-lg font-semibold"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold mb-4">ShopHub</div>
              <p className="text-sm text-muted-foreground">Your trusted shopping destination</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">New Arrivals</a></li>
                <li><a href="#" className="hover:text-foreground transition">Best Sellers</a></li>
                <li><a href="#" className="hover:text-foreground transition">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Our Story</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 ShopHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

