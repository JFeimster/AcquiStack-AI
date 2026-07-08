import { Deal, BorrowerProfile, SellerNote, PFSData, QoEData, Task } from './types';

/**
 * Validation Schemas and Payload structures for the AcquiStack AI full-stack APIs.
 * This ensures that all deals, profile data, and calculator states match the required specs.
 */

export class SchemaValidator {
  /**
   * Validate a partial or full Deal object
   */
  static validateDeal(deal: any): Omit<Deal, 'id'> & { id?: number } {
    if (!deal || typeof deal !== 'object') {
      throw new Error('Deal payload must be a valid object');
    }

    if (!deal.deal_name || typeof deal.deal_name !== 'string' || deal.deal_name.trim() === '') {
      throw new Error('Deal name is required and must be a non-empty string');
    }

    const purchasePrice = Number(deal.purchase_price);
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      throw new Error('Purchase price must be a valid non-negative number');
    }

    const ebitda = Number(deal.ebitda_ttm);
    if (isNaN(ebitda)) {
      throw new Error('EBITDA TTM must be a valid number');
    }

    const revenue = Number(deal.revenue_ttm);
    if (isNaN(revenue) || revenue < 0) {
      throw new Error('Revenue TTM must be a valid non-negative number');
    }

    // Default structure normalization
    return {
      deal_name: deal.deal_name.trim(),
      status: deal.status || 'Initial Analysis',
      purchase_type: deal.purchase_type || 'asset',
      industry: deal.industry || 'Other',
      business_location: deal.business_location || 'US-based',
      purchase_price: purchasePrice,
      revenue_ttm: revenue,
      ebitda_ttm: ebitda,
      working_capital: Number(deal.working_capital) || 0,
      closing_costs: Number(deal.closing_costs) || 0,
      fees: Number(deal.fees) || 0,
      borrower_profile: this.normalizeBorrowerProfile(deal.borrower_profile),
      seller_note: this.normalizeSellerNote(deal.seller_note),
      gifts: Array.isArray(deal.gifts) ? deal.gifts : [],
      third_party_equity: Array.isArray(deal.third_party_equity) ? deal.third_party_equity : [],
      rollover_equity: Number(deal.rollover_equity) || 0,
      lender_overlays: this.normalizeLenderOverlays(deal.lender_overlays),
      diligenceItems: Array.isArray(deal.diligenceItems) ? deal.diligenceItems : [],
      scenarios: Array.isArray(deal.scenarios) ? deal.scenarios : [],
      id: deal.id ? Number(deal.id) : undefined
    };
  }

  private static normalizeBorrowerProfile(profile: any): BorrowerProfile {
    const defaults: BorrowerProfile = {
      liquidity: { cash: 0, brokerage: 0, cds: 0, hsas: 0, rsus: 0 },
      debt_capacity: { heloc_limit: 0, portfolio_line: 0 },
      retirement_assets: { balance: 0, robs_interest: false },
      credit_score_band: '720+',
      on_parole: false
    };

    if (!profile || typeof profile !== 'object') return defaults;

    const liq = profile.liquidity || {};
    const debt = profile.debt_capacity || {};
    const ret = profile.retirement_assets || {};

    return {
      liquidity: {
        cash: Number(liq.cash) || 0,
        brokerage: Number(liq.brokerage) || 0,
        cds: Number(liq.cds) || 0,
        hsas: Number(liq.hsas) || 0,
        rsus: Number(liq.rsus) || 0,
      },
      debt_capacity: {
        heloc_limit: Number(debt.heloc_limit) || 0,
        portfolio_line: Number(debt.portfolio_line) || 0,
      },
      retirement_assets: {
        balance: Number(ret.balance) || 0,
        robs_interest: !!ret.robs_interest,
      },
      credit_score_band: profile.credit_score_band || '720+',
      on_parole: !!profile.on_parole,
    };
  }

  private static normalizeSellerNote(note: any): SellerNote {
    if (!note || typeof note !== 'object') {
      return { proposed_amount: 0, standby_full_life: false, interest: 0 };
    }
    return {
      proposed_amount: Number(note.proposed_amount) || 0,
      standby_full_life: !!note.standby_full_life,
      interest: Number(note.interest) || 0
    };
  }

  private static normalizeLenderOverlays(overlays: any) {
    if (!overlays || typeof overlays !== 'object') {
      return { seller_note_counts: true, gift_ok: true, min_borrower_cash_pct: 0.1 };
    }
    return {
      seller_note_counts: overlays.seller_note_counts !== false,
      gift_ok: overlays.gift_ok !== false,
      min_borrower_cash_pct: typeof overlays.min_borrower_cash_pct === 'number' ? overlays.min_borrower_cash_pct : 0.1
    };
  }

  /**
   * Validate Personal Financial Statement (PFS) payload
   */
  static validatePFS(pfs: any): PFSData {
    if (!pfs || typeof pfs !== 'object') {
      throw new Error('PFS payload must be a valid object');
    }
    return {
      cashOnHandAndInBanks: pfs.cashOnHandAndInBanks !== '' ? Number(pfs.cashOnHandAndInBanks) || 0 : '',
      savingsAccounts: pfs.savingsAccounts !== '' ? Number(pfs.savingsAccounts) || 0 : '',
      iraOrOtherRetirement: pfs.iraOrOtherRetirement !== '' ? Number(pfs.iraOrOtherRetirement) || 0 : '',
      accountsAndNotesReceivable: pfs.accountsAndNotesReceivable !== '' ? Number(pfs.accountsAndNotesReceivable) || 0 : '',
      lifeInsuranceCashValue: pfs.lifeInsuranceCashValue !== '' ? Number(pfs.lifeInsuranceCashValue) || 0 : '',
      stocksAndBonds: Array.isArray(pfs.stocksAndBonds) ? pfs.stocksAndBonds : [],
      realEstate: Array.isArray(pfs.realEstate) ? pfs.realEstate : [],
      automobiles: Array.isArray(pfs.automobiles) ? pfs.automobiles : [],
      otherPersonalAssets: Array.isArray(pfs.otherPersonalAssets) ? pfs.otherPersonalAssets : [],
      accountsPayable: pfs.accountsPayable !== '' ? Number(pfs.accountsPayable) || 0 : '',
      notesPayableToBanks: Array.isArray(pfs.notesPayableToBanks) ? pfs.notesPayableToBanks : [],
      notesPayableToOthers: Array.isArray(pfs.notesPayableToOthers) ? pfs.notesPayableToOthers : [],
      realEstateMortgages: Array.isArray(pfs.realEstateMortgages) ? pfs.realEstateMortgages : [],
      otherLiabilities: Array.isArray(pfs.otherLiabilities) ? pfs.otherLiabilities : [],
      salary: pfs.salary !== '' ? Number(pfs.salary) || 0 : '',
      netInvestmentIncome: pfs.netInvestmentIncome !== '' ? Number(pfs.netInvestmentIncome) || 0 : '',
      otherIncome: pfs.otherIncome !== '' ? Number(pfs.otherIncome) || 0 : '',
      contingentLiabilities: {
        asEndorser: pfs.contingentLiabilities?.asEndorser !== '' ? Number(pfs.contingentLiabilities?.asEndorser) || 0 : '',
        legalClaims: pfs.contingentLiabilities?.legalClaims !== '' ? Number(pfs.contingentLiabilities?.legalClaims) || 0 : '',
        federalTaxes: pfs.contingentLiabilities?.federalTaxes !== '' ? Number(pfs.contingentLiabilities?.federalTaxes) || 0 : '',
        other: pfs.contingentLiabilities?.other !== '' ? Number(pfs.contingentLiabilities?.other) || 0 : '',
      }
    };
  }

  /**
   * Validate Quality of Earnings (QoE) payload
   */
  static validateQoE(qoe: any): QoEData {
    if (!qoe || typeof qoe !== 'object') {
      throw new Error('QoE payload must be a valid object');
    }
    return {
      totalRevenue: qoe.totalRevenue !== '' ? Number(qoe.totalRevenue) || 0 : '',
      topCustomerRevenue: qoe.topCustomerRevenue !== '' ? Number(qoe.topCustomerRevenue) || 0 : '',
      topFiveCustomersRevenue: qoe.topFiveCustomersRevenue !== '' ? Number(qoe.topFiveCustomersRevenue) || 0 : '',
      recurringRevenuePercentage: qoe.recurringRevenuePercentage !== '' ? Number(qoe.recurringRevenuePercentage) || 0 : '',
      reportedSDE: qoe.reportedSDE !== '' ? Number(qoe.reportedSDE) || 0 : '',
      questionableAddBacks: Array.isArray(qoe.questionableAddBacks) ? qoe.questionableAddBacks : [],
      averageWorkingCapital: qoe.averageWorkingCapital !== '' ? Number(qoe.averageWorkingCapital) || 0 : '',
      targetWorkingCapital: qoe.targetWorkingCapital !== '' ? Number(qoe.targetWorkingCapital) || 0 : '',
    };
  }
}
