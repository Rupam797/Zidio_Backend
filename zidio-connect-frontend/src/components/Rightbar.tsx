import React from 'react';
import { Link } from 'react-router-dom';
import { Circle, ChevronDown, ArrowRight, Info } from 'lucide-react';

const NEWS = [
  { title: 'Tech hiring sees a strong rebound in 2025', meta: 'Top story · 12.4k readers' },
  { title: 'AI & ML skills dominate recruiter searches', meta: 'Top story · 9.8k readers' },
  { title: 'Remote-first companies outperform office counterparts', meta: '1d ago · 6.2k readers' },
  { title: 'How to ace your next technical interview', meta: '2d ago · 4.1k readers' },
  { title: 'Open source contributions boost career prospects', meta: '3d ago · 3.5k readers' },
];

const SUGGESTED_PEOPLE = [
  { id: 1, name: 'Arjun Mehta', role: 'Backend Dev @ Infosys', initials: 'AM', color: 'bg-blue-100 text-blue-700' },
  { id: 2, name: 'Sneha Patel', role: 'UI/UX Designer @ Flipkart', initials: 'SP', color: 'bg-pink-100 text-pink-700' },
  { id: 3, name: 'Vikram Singh', role: 'Recruiter @ Google India', initials: 'VS', color: 'bg-amber-100 text-amber-700' },
];

const Rightbar = () => {
  return (
    <div className="w-[300px] hidden lg:flex flex-col gap-3 flex-shrink-0">
      {/* News Card */}
      <div className="card p-4 sticky top-[72px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900">Zidio News</h2>
          <span className="text-gray-500 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-200">
            <Info className="w-4 h-4" />
          </span>
        </div>
        <ul className="flex flex-col gap-3">
          {NEWS.map((item, i) => (
            <li key={i} className="flex items-start gap-2 cursor-pointer group">
              <Circle className="text-emerald-500 mt-2 w-2 h-2 flex-shrink-0 fill-current" />
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-zidio-green group-hover:underline leading-tight">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.meta}</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-sm text-gray-500 font-semibold hover:text-gray-700 flex items-center gap-1 transition-colors">
          Show more <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* People You May Know */}
      <div className="card p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-4">People You May Know</h2>
        <div className="flex flex-col gap-4">
          {SUGGESTED_PEOPLE.map(person => (
            <div key={person.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${person.color}`}>
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{person.name}</p>
                <p className="text-xs text-gray-500 truncate">{person.role}</p>
              </div>
              <button className="btn-outline py-1 px-3 text-xs flex-shrink-0">Connect</button>
            </div>
          ))}
        </div>
        <Link to="/network" className="mt-4 text-sm text-zidio-green font-semibold hover:underline flex items-center justify-center gap-1">
          View all suggestions <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Footer */}
      <div className="px-2 text-xs text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
        {['About', 'Help', 'Privacy', 'Terms', 'Advertising'].map(item => (
          <span key={item} className="cursor-pointer hover:underline hover:text-gray-600">{item}</span>
        ))}
        <span className="w-full mt-1">Zidio Connect © 2025</span>
      </div>
    </div>
  );
};

export default Rightbar;
