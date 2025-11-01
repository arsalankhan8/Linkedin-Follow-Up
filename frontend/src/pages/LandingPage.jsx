import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Manage Your LinkedIn Follow-ups with Ease 🚀
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          Never lose track of a potential client or conversation again.
          FollowUpFlow helps you organize, schedule, and track all your LinkedIn
          contacts in one dashboard.
        </p>
        <Link
          to="/signup"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition"
        >
          Start Free
        </Link>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mt-24 px-6 md:px-16 grid md:grid-cols-3 gap-10 text-center"
      >
        <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
          <div className="text-3xl mb-3">📇</div>
          <h3 className="text-xl font-semibold mb-2">
            Smart Contact Management
          </h3>
          <p className="text-gray-600">
            Add your LinkedIn contacts, track their roles, messages, and
            follow-up status easily.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-xl font-semibold mb-2">
            Auto Follow-up Reminders
          </h3>
          <p className="text-gray-600">
            Stay on top of your schedule with upcoming, due today, and overdue
            reminders.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="text-xl font-semibold mb-2">Easy Status Updates</h3>
          <p className="text-gray-600">
            Quickly mark contacts as done, pending reply, or reschedule with one
            click.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-24 text-center bg-orange-100 py-16 rounded-2xl mx-6 md:mx-16 shadow-sm">
        <h2 className="text-3xl font-bold mb-4 text-orange-700">
          Ready to Simplify Your LinkedIn Workflow?
        </h2>
        <p className="text-gray-700 mb-6">
          Join hundreds of professionals managing their follow-ups smarter every
          day.
        </p>
        <Link
          to="/signup"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-8 text-center border-t border-gray-200 text-gray-500 text-sm">
        © {new Date().getFullYear()} FollowUpFlow — All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
