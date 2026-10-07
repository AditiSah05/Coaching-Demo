import React, { useState } from 'react';
import { Award, Star, Search, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AvatarInitials } from '../components/common/ImageWithFallback';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const Results = () => {
  const { toppers, results } = useData();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchTerm, setSearchTerm] = useState('');

  const years = ['2025', '2024', '2023'];

  const filteredToppers = toppers.filter(t => t.year === selectedYear);

  const filteredResults = results.filter(r => {
    const matchesYear = r.year === selectedYear;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.exam.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Risultati Eccellenti</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            IMU-CET & Sponsorship Results
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Celebrating our stellar cadets who secured top All-India Ranks and prestigiou shipping company sponsorships.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#FBF6EC" />
        </div>
      </section>

      {/* Year Selector Tabs */}
      <section className="py-8 bg-white border-b border-navy-deep/10 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-navy-deep uppercase tracking-wider">Exam Year:</span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-6 py-2.5 rounded-xl text-xs font-serif font-bold transition-all ${
                  selectedYear === y
                    ? 'bg-terracotta text-white shadow-terracotta scale-105'
                    : 'bg-ivory text-ink/70 hover:bg-navy-deep/10'
                }`}
              >
                {y} Results
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toppers Showcase Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-solid bg-navy-deep/10 text-navy-deep mb-2">Hall of Fame</span>
            <h2 className="font-serif text-3xl font-bold text-navy-deep">
              Top Performers of {selectedYear}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredToppers.map((top) => (
              <div
                key={top.id}
                className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky relative flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div className="absolute -top-4 right-6 bg-gold text-navy-deep font-serif font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                  {top.rank}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <AvatarInitials initials={top.photo} name={top.name} color={top.color} size="w-14 h-14 text-base" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-navy-deep">{top.name}</h3>
                      <span className="text-xs font-semibold text-terracotta">{top.batch}</span>
                    </div>
                  </div>

                  <div className="bg-ivory p-3 rounded-2xl border border-navy-deep/5 space-y-1 text-xs">
                    <p className="flex justify-between">
                      <span className="text-ink/60">IMU Score:</span>
                      <span className="font-bold text-navy-deep">{top.score}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-ink/60">Sponsorship:</span>
                      <span className="font-bold text-sea-blue">{top.selection}</span>
                    </p>
                  </div>

                  {top.quote && (
                    <p className="text-xs text-ink/70 italic bg-sea-blue/5 p-3 rounded-xl border border-sea-blue/10">
                      "{top.quote}"
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Searchable Results Table */}
      <section className="py-16 bg-white border-t border-navy-deep/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-deep">
                Complete Roll-Wise Merit List ({selectedYear})
              </h2>
              <p className="text-xs text-ink/60">Search by Cadet Name, Roll Number, or Company Selection</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-ink/50 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Roll No or Name..."
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div className="bg-ivory rounded-3xl border-2 border-navy-deep/10 overflow-hidden shadow-chunky">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-deep text-white text-xs uppercase font-serif tracking-wider">
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Cadet Name</th>
                    <th className="p-4">Exam Name</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Selection Status</th>
                    <th className="p-4 text-center">Scorecard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-deep/10 text-xs">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((row) => (
                      <tr key={row.id} className="hover:bg-white transition-colors">
                        <td className="p-4 font-mono font-bold text-navy-deep">{row.rollNo}</td>
                        <td className="p-4 font-bold text-navy-deep">{row.name}</td>
                        <td className="p-4 text-ink/70">{row.exam}</td>
                        <td className="p-4 font-bold text-navy-deep">{row.score}</td>
                        <td className="p-4"><span className="bg-gold text-ink font-bold px-2 py-0.5 rounded text-[10px]">{row.rank}</span></td>
                        <td className="p-4 font-semibold text-sea-blue">{row.status}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => alert(`Downloading official score verification sheet for ${row.name} (${row.rollNo})`)}
                            className="p-2 rounded-xl bg-navy-light/10 hover:bg-terracotta hover:text-white text-navy-deep transition-colors"
                            title="Download Verification Scorecard"
                          >
                            <Download className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-xs text-ink/60">
                        No result records found matching your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
