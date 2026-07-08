import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Building2, 
  Download,
  DollarSign,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Deal } from '../types';

interface DealMarketplaceProps {
  onImportDeal: (deal: Omit<Deal, 'id'>) => void;
  existingDeals: Deal[];
}

interface BrokerListing {
  id: string;
  title: string;
  industry: string;
  location: string;
  askingPrice: number;
  revenue: number;
  ebitda: number;
  sde: number; // Seller's Discretionary Earnings
  multiple: number;
  description: string;
  established: number;
  employees: number;
  realEstate: 'owned' | 'leased' | 'none';
  reasonsForSale: string;
}

const DealMarketplace: React.FC<DealMarketplaceProps> = ({ onImportDeal, existingDeals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [importedListingId, setImportedListingId] = useState<string | null>(null);

  const listings: BrokerListing[] = [
    {
      id: 'list-1',
      title: 'Apex HVAC & Commercial Services',
      industry: 'Services',
      location: 'Atlanta, GA',
      askingPrice: 1650000,
      revenue: 2200000,
      ebitda: 480000,
      sde: 520000,
      multiple: 3.4,
      description: 'Well-established commercial and residential HVAC servicing firm with over 15 active service contract routes. High customer retention rate and experienced field technicians on staff.',
      established: 2011,
      employees: 12,
      realEstate: 'leased',
      reasonsForSale: 'Retirement / Relocation'
    },
    {
      id: 'list-2',
      title: 'CloudScribe B2B SaaS Platform',
      industry: 'Technology',
      location: 'Austin, TX',
      askingPrice: 2800000,
      revenue: 1200000,
      ebitda: 710000,
      sde: 710000,
      multiple: 3.9,
      description: 'Niche artificial intelligence content generation platform tailored specifically for legal and compliance departments. Highly predictable recurring subscription revenue with 105% net dollar retention.',
      established: 2019,
      employees: 6,
      realEstate: 'none',
      reasonsForSale: 'Pursuing other ventures'
    },
    {
      id: 'list-3',
      title: 'Pinnacle Pediatric Medical Group',
      industry: 'Healthcare',
      location: 'Denver, CO',
      askingPrice: 1950000,
      revenue: 2500000,
      ebitda: 550000,
      sde: 610000,
      multiple: 3.5,
      description: 'Reputable pediatric clinic servicing over 4,500 active family accounts. Long-term lease in premium medical office complex. Excellent transition package offered by the practicing lead physician.',
      established: 2008,
      employees: 14,
      realEstate: 'leased',
      reasonsForSale: 'Partner retirement'
    },
    {
      id: 'list-4',
      title: 'Tri-County Precision Machine Shop',
      industry: 'Manufacturing',
      location: 'Detroit, MI',
      askingPrice: 3200000,
      revenue: 4100000,
      ebitda: 820000,
      sde: 850000,
      multiple: 3.9,
      description: 'Tier-2 automotive and industrial metal parts manufacturer featuring an array of 8 state-of-the-art CNC machining cells. Holds aerospace AS9100 quality certifications.',
      established: 1995,
      employees: 22,
      realEstate: 'owned',
      reasonsForSale: 'Partner health concerns'
    },
    {
      id: 'list-5',
      title: 'Subway & QSR Multi-Unit Franchise',
      industry: 'Retail & Food',
      location: 'Orlando, FL',
      askingPrice: 850000,
      revenue: 1450000,
      ebitda: 240000,
      sde: 270000,
      multiple: 3.5,
      description: 'Turnkey three-unit quick-service restaurant operation located in heavy traffic plazas. Fully staffed with general managers in place. Corporate training and franchisor transfer approval supported.',
      established: 2015,
      employees: 28,
      realEstate: 'leased',
      reasonsForSale: 'Consolidating portfolios'
    },
    {
      id: 'list-6',
      title: 'Lakeside Premium Dental Clinic',
      industry: 'Healthcare',
      location: 'Chicago, IL',
      askingPrice: 1400000,
      revenue: 1750000,
      ebitda: 380000,
      sde: 420000,
      multiple: 3.6,
      description: 'Stellar general dentistry practice with 4 fully equipped ops and digital imaging scanners. Generates consistent patient flows with an active base of over 2,200 returning patients.',
      established: 2014,
      employees: 7,
      realEstate: 'leased',
      reasonsForSale: 'Relocating out of state'
    }
  ];

  const industries = ['All', 'Services', 'Technology', 'Healthcare', 'Manufacturing', 'Retail & Food'];

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = industryFilter === 'All' || item.industry === industryFilter;
      return matchesSearch && matchesIndustry;
    });
  }, [searchTerm, industryFilter]);

  const handleImportClick = (listing: BrokerListing) => {
    setImportedListingId(listing.id);
    
    // Map BrokerListing to standard Omit<Deal, 'id'> schema
    const dealPayload: Omit<Deal, 'id'> = {
      deal_name: listing.title,
      status: 'Initial Analysis',
      purchase_type: 'asset',
      industry: listing.industry,
      business_location: listing.location,
      purchase_price: listing.askingPrice,
      revenue_ttm: listing.revenue,
      ebitda_ttm: listing.ebitda,
      working_capital: Math.round(listing.revenue * 0.05), // assumed 5% of rev
      closing_costs: Math.round(listing.askingPrice * 0.015), // assumed 1.5% closing
      fees: 15000,
      borrower_profile: {
        liquidity: { cash: 250000, brokerage: 100000, cds: 50000, hsas: 0, rsus: 0 },
        debt_capacity: { heloc_limit: 50000, portfolio_line: 0 },
        retirement_assets: { balance: 150000, robs_interest: true },
        credit_score_band: '720+',
        on_parole: false,
      },
      seller_note: {
        proposed_amount: Math.round(listing.askingPrice * 0.15), // 15% seller note
        standby_full_life: true,
        interest: 8.5,
      },
      gifts: [],
      third_party_equity: [],
      rollover_equity: 0,
      lender_overlays: {
        seller_note_counts: true,
        gift_ok: true,
        min_borrower_cash_pct: 0.10,
      },
      diligenceItems: [
        { id: Date.now() + 1, task_name: 'Analyze last 3 years of P&Ls and Tax Returns', category: 'financial', is_completed: false },
        { id: Date.now() + 2, task_name: 'Request SBA Form 1919 and personal history', category: 'legal', is_completed: false },
        { id: Date.now() + 3, task_name: 'Verify customer concentration thresholds', category: 'commercial', is_completed: false },
        { id: Date.now() + 4, task_name: 'Validate key staff employment agreements', category: 'operational', is_completed: false },
      ],
      scenarios: [
        {
          id: Date.now() + 5,
          scenario_name: 'Base Case (Broker Financials)',
          ebitda: listing.ebitda,
          revenue: listing.revenue,
          interest_rate: 11.25,
          amortization_years: 10,
          isPrimary: true,
        },
        {
          id: Date.now() + 6,
          scenario_name: 'Stress Case (15% EBITDA Reduction)',
          ebitda: Math.round(listing.ebitda * 0.85),
          revenue: Math.round(listing.revenue * 0.90),
          interest_rate: 11.25,
          amortization_years: 10,
          isPrimary: false,
        }
      ]
    };

    setTimeout(() => {
      onImportDeal(dealPayload);
      setImportedListingId(null);
    }, 800);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 py-2 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative max-w-2xl space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-3xs font-bold bg-brand-blue-500 text-white uppercase tracking-wider">
            Live Broker Listings
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Deal Marketplace</h1>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
            Browse verified listings from leading small business brokerages. Import any deal immediately to build its compliant capital stack, run multi-agent stress scenarios, and print lender books.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keyword, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20"
          />
        </div>

        {/* Industry Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mr-1 hidden sm:block" />
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={`
                whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                ${industryFilter === ind
                  ? 'bg-brand-blue-600 text-white shadow-3xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-750'
                }
              `}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map((list) => {
            const isImportedAlready = existingDeals.some(d => d.deal_name === list.title);
            const isImporting = importedListingId === list.id;

            return (
              <div 
                key={list.id} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 md:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-4xs font-bold uppercase tracking-wider bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/40 dark:text-brand-blue-400">
                          {list.industry}
                        </span>
                        <div className="flex items-center text-4xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                          <MapPin className="w-3 h-3 mr-0.5" />
                          <span>{list.location}</span>
                        </div>
                      </div>
                      <h3 className="text-base md:text-lg font-extrabold text-gray-950 dark:text-white group-hover:text-brand-blue-600">
                        {list.title}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-mono font-black text-brand-blue-600 dark:text-brand-blue-400">
                        {formatCurrency(list.askingPrice)}
                      </p>
                      <span className="text-4xs font-bold text-gray-400 uppercase tracking-wider">Asking Price</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed truncate-3-lines">
                    {list.description}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-150 dark:border-gray-800/80">
                    <div className="text-center md:text-left">
                      <p className="text-xs font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(list.revenue)}</p>
                      <span className="text-4xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">Revenue (TTM)</span>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(list.ebitda)}</p>
                      <span className="text-4xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">EBITDA (TTM)</span>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(list.sde)}</p>
                      <span className="text-4xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">SDE (Cash Flow)</span>
                    </div>
                  </div>

                  {/* Metadata labels */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-4xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
                    <span className="flex items-center"><Building2 className="w-3 h-3 mr-1" /> Est: {list.established}</span>
                    <span>• {list.employees} Employees</span>
                    <span>• Real Estate: {list.realEstate}</span>
                  </div>
                </div>

                {/* Footer Import Action */}
                <div className="pt-5 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-4xs font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Multiple: {list.multiple}x SDE</span>
                  </div>

                  {isImportedAlready ? (
                    <button
                      disabled
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-550 font-bold rounded-lg text-xs cursor-not-allowed border border-gray-200 dark:border-gray-800"
                    >
                      Imported to Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => handleImportClick(list)}
                      disabled={isImporting}
                      className={`
                        px-4 py-1.5 font-bold rounded-lg text-xs transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer
                        ${isImporting 
                          ? 'bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-600 dark:text-brand-blue-400 cursor-wait' 
                          : 'bg-brand-blue-600 hover:bg-brand-blue-700 text-white hover:shadow-xs'
                        }
                      `}
                    >
                      {isImporting ? (
                        <>
                          <div className="w-3 h-3 border-2 border-brand-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Importing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Import Deal</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">No business listings match your query.</p>
          <button 
            onClick={() => { setSearchTerm(''); setIndustryFilter('All'); }} 
            className="text-xs font-bold text-brand-blue-600 dark:text-brand-blue-400 mt-2 hover:underline cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DealMarketplace;
