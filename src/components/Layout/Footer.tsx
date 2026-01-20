// import { BookOpen } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/research" className="hover:text-white transition-colors">Research</a></li>
              <li><a href="/videos" className="hover:text-white transition-colors">Videos</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/donations" className="hover:text-white transition-colors">Donations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Related</h3>
            <ul className="space-y-2">
              <li><a href="/terms-and-policies#website-policy" className="hover:text-white transition-colors">Website Policy</a></li>
              <li><a href="/terms-and-policies#editorial-team" className="hover:text-white transition-colors">Editorial Team</a></li>
              <li><a href="/terms-and-policies#filhaal-trust" className="hover:text-white transition-colors">Filhaal Trust</a></li>
              <li><a href="/terms-and-policies#editorial-policy" className="hover:text-white transition-colors">Editorial Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">For inquiries and collaborations, please reach out through our <a href="/contact" className="underline">contact form</a>.</p>
            <p className="text-gray-400 text-sm mt-3"> Contact e-mail:  contact@filhaal.in, filhaalpatna@gmail.com</p>
             <p className="text-gray-400 text-sm mt-3">Contact number: +91 94720 48408 </p>
            <p className="text-gray-400 text-sm">Office : L 164, Road No. 23, Sri Krishna Nagar, Patna. Pin – 800001</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p> <span className="copyleft" >&copy;</span>  {currentYear} Filhaal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
