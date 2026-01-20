import { Link } from "react-router-dom";

export function TermsAndPolicies() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Terms & Policies (Summary)</h1>

      <section id="website-policy" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Website Policy</h2>
        <p className="text-gray-700">This website respects user privacy and does not commercially exploit personal information. For inquiries, contact the editorial team using the email addresses listed in the Contact section. Full policy and legal details are available at the original source (link below).</p>
      </section>

      <section id="editorial-team" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Editorial Team</h2>
        <p className="text-gray-700">The publication is produced by a small editorial team led by the Editor and supported by editorial collaborators. Key names listed on the source site include the Editor and several editorial collaborators across locations.</p>
      </section>

      <section id="filhaal-trust" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Filhaal Trust</h2>
        <p className="text-gray-700">The Filhaal Trust was formed (October 2004) to ensure the stability of the publication and to publish collected works as books. The Trust organizes annual lectures, accepts donations from Indian citizens/residents in INR only, and has a roster of founding and later trustees. Donations may be tax-exempt under applicable law.</p>
      </section>

      <section id="editorial-policy" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Editorial Policy</h2>
        <p className="text-gray-700">Contributions published on Filhaal present the authors' own views and do not necessarily reflect the positions of the Editor or the Filhaal Trust.</p>
      </section>

      

      <div className="mt-8">
        <Link to="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}

export default TermsAndPolicies;
