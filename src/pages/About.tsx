import { Link } from "react-router-dom";

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">About Filhaal</h1>

      <section className="mb-6">
        <p className="text-gray-700">Filhaal is an independent magazine published from Patna since May 1995, started by economists and public intellectuals associated with Prof. Pradhan Harishankar Prasad (1.11.1928 – 28.3.2001). The magazine aims to promote democratic and socialist consciousness, highlight exploitation and resistance, and analyze imperialism, feudalism and capitalist reforms from a progressive perspective.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Editorial Team</h2>
        <p className="text-gray-700">Filhaal is produced by a small editorial team led by the Editor (listed on the source site) and supported by editorial collaborators in different locations.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filhaal Trust</h2>
        <p className="text-gray-700">To ensure continuity of publication the Filhaal Trust was formed in October 2004. The Trust publishes collected works as books, organizes annual lecture series, and accepts donations from Indian citizens and NRIs in Indian currency. Donations may be tax-exempt under applicable law.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Values & Focus</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Opposition to various forms of exploitation and oppression</li>
          <li>Critical analysis of imperialism and feudal structures</li>
          <li>Support for changes that weaken the roots of capitalism</li>
          <li>Search for alternatives and promotion of scientific socialism</li>
        </ul>
      </section>

      {/* <div className="mt-6 text-sm text-gray-600">
        <p>Summary extracted from the public About page.</p>
        <p>See the original page for full details: <a href="https://filhaal.vercel.app/aboutus" className="text-red-700 underline">Filhaal — About Us</a></p>
      </div> */}

      <div className="mt-8">
        <Link to="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}

export default About;
