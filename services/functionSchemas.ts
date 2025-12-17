
// FIX: Import the Type enum from the Gemini API library.
import { AgentModule, FunctionDeclaration } from '../types';
import { Type } from '@google/genai';

// FIX: Replace all string literal types (e.g., "OBJECT") with the corresponding Type enum members (e.g., Type.OBJECT)
// to ensure type safety and compatibility with the Gemini API.
const FUNCTION_SCHEMAS: FunctionDeclaration[] = [
  {
    "name": "assess_sop_applicability",
    "description": "Interpret SBA SOP 50 10 8 and lender overlays for a proposed acquisition structure. Returns a compliance memo, rule checks, and required evidence checklist.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "deal": {
          "type": Type.OBJECT,
          "properties": {
            "deal_name": { "type": Type.STRING },
            "purchase_type": { "type": Type.STRING, "enum": ["asset", "stock"] },
            "purchase_price": { "type": Type.NUMBER },
            "revenue_ttm": { "type": Type.NUMBER },
            "ebitda_ttm": { "type": Type.NUMBER },
            "industry": { "type": Type.STRING },
            "state": { "type": Type.STRING },
            "lender_overlay_notes": { "type": Type.STRING, "description": "Optional free-text lender rules/overlays if known." }
          },
          "required": ["deal_name", "purchase_type", "purchase_price"]
        }
      },
      "required": ["deal"]
    }
  },
  {
    "name": "screen_sba_eligibility",
    "description": "Conducts a preliminary screening for core SBA 7(a) loan eligibility requirements, such as business type, location, and borrower status.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "business_details": {
          "type": Type.OBJECT,
          "properties": {
            "industry": { "type": Type.STRING, "description": "The industry the business operates in, e.g., 'SaaS', 'Restaurant', 'Lending'." },
            "location": { "type": Type.STRING, "enum": ["US-based", "International"], "description": "The primary location of business operations." }
          },
          "required": ["industry", "location"]
        },
        "borrower_status": {
            "type": Type.OBJECT,
            "properties": {
                "is_on_parole": { "type": Type.BOOLEAN, "description": "Whether the borrower is currently on parole." }
            },
            "required": ["is_on_parole"]
        }
      },
      "required": ["business_details", "borrower_status"]
    }
  },
  {
    "name": "check_business_health",
    "description": "Simulates pulling a comprehensive business credit report from sources like Dun & Bradstreet or Experian for a target company to assess its financial health and risk profile.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "target_business_name": { "type": Type.STRING, "description": "The legal name of the business being acquired." },
        "industry": { "type": Type.STRING, "description": "The industry the target business operates in." }
      },
      "required": ["target_business_name"]
    }
  },
  {
    "name": "generate_diligence_checklist",
    "description": "Generates a detailed, categorized due diligence checklist for a business acquisition, tailored to the specific deal.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "industry": {
          "type": Type.STRING,
          "description": "The industry of the target business, e.g., 'SaaS', 'Landscaping', 'E-commerce'."
        },
        "purchase_type": {
          "type": Type.STRING,
          "enum": ["asset", "stock"],
          "description": "The type of purchase (asset or stock)."
        },
        "business_model_notes": {
          "type": Type.STRING,
          "description": "Optional brief notes on the business model, e.g., 'B2B subscription', 'inventory-heavy'."
        }
      },
      "required": ["industry", "purchase_type"]
    }
  },
  {
    "name": "score_deal_health",
    "description": "Analyzes key deal metrics to produce an overall health score (A-F), a summary of strengths, and a summary of weaknesses.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "deal_summary": {
          "type": Type.OBJECT,
          "properties": {
            "purchase_price": { "type": Type.NUMBER },
            "ebitda_ttm": { "type": Type.NUMBER },
            "industry": { "type": Type.STRING },
            "purchase_type": { "type": Type.STRING },
            "borrower_cash_injection": { "type": Type.NUMBER },
            "seller_note_is_standby": { "type": Type.BOOLEAN },
            "estimated_dscr": { "type": Type.NUMBER, "description": "The estimated Debt Service Coverage Ratio, e.g., 1.5 for 1.5x." }
          },
          "required": ["purchase_price", "ebitda_ttm", "industry", "borrower_cash_injection"]
        }
      },
      "required": ["deal_summary"]
    }
  },
  {
    "name": "build_compliance_model",
    "description": "Generate 2–3 SBA-compliant Sources & Uses scenarios with DSCR snapshot and risk flags.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "deal": {
          "type": Type.OBJECT,
          "properties": {
            "purchase_price": { "type": Type.NUMBER },
            "working_capital": { "type": Type.NUMBER },
            "closing_costs": { "type": Type.NUMBER },
            "fees": { "type": Type.NUMBER },
            "revenue_ttm": { "type": Type.NUMBER },
            "ebitda_ttm": { "type": Type.NUMBER },
            "interest_rate_annual": { "type": Type.NUMBER, "description": "Percent, e.g. 11.0 for 11%" },
            "term_months": { "type": Type.INTEGER },
            "addbacks_annual": { "type": Type.NUMBER },
            "capex_annual": { "type": Type.NUMBER }
          },
          "required": ["purchase_price", "ebitda_ttm"]
        },
        "scenarios": {
          "type": Type.ARRAY,
          "description": "Optional scenario hints to shape outputs (e.g. 'more_seller_note', 'more_cash').",
          "items": { "type": Type.STRING }
        }
      },
      "required": ["deal"]
    }
  },
  {
    "name": "harvest_liquid_equity",
    "description": "Map borrower liquidity and propose a cash-equity plan with verification/evidence list and timing path to close.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "borrower": {
          "type": Type.OBJECT,
          "properties": {
            "cash": { "type": Type.NUMBER },
            "brokerage": { "type": Type.NUMBER },
            "cds": { "type": Type.NUMBER },
            "retirement_balance": { "type": Type.NUMBER },
            "credit_score_band": { "type": Type.STRING, "enum": ["<620","620-680","680-720","720+"] }
          },
          "required": []
        },
        "target_equity_need": { "type": Type.NUMBER, "description": "Dollar equity needed for the structure." }
      },
      "required": ["target_equity_need"]
    }
  },
  {
    "name": "validate_gifts_and_equity",
    "description": "Evaluate gifted funds and third-party (non-owner) equity for SBA acceptability. Produce AML/KYC checklist, cap-table before/after, and gift letter template fields.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "gifts": {
          "type": Type.ARRAY,
          "items": {
            "type": Type.OBJECT,
            "properties": {
              "source_name": { "type": Type.STRING },
              "relationship": { "type": Type.STRING },
              "amount": { "type": Type.NUMBER }
            },
            "required": ["source_name", "amount"]
          }
        },
        "third_party_equity": {
          "type": Type.ARRAY,
          "items": {
            "type": Type.OBJECT,
            "properties": {
              "investor_name": { "type": Type.STRING },
              "amount": { "type": Type.NUMBER },
              "rights": { "type": Type.STRING, "enum": ["non-control","minority_control","control"] }
            },
            "required": ["investor_name", "amount"]
          }
        }
      },
      "required": []
    }
  },
  {
    "name": "draft_standby_termsheet",
    "description": "Draft eligible (full-life standby) and optional subordinated seller-note term sheets with compliant language and payment waterfalls.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "seller_note_amount": { "type": Type.NUMBER },
        "interest_rate_annual": { "type": Type.NUMBER, "description": "Percent APR, e.g. 8.0" },
        "eligible_standby": { "type": Type.BOOLEAN, "description": "If true, counts toward the equity portion up to SBA limits." },
        "subordinated_tranche": {
          "type": Type.OBJECT,
          "properties": {
            "amount": { "type": Type.NUMBER },
            "interest_rate_annual": { "type": Type.NUMBER }
          }
        }
      },
      "required": ["seller_note_amount","interest_rate_annual"]
    }
  },
  {
    "name": "audit_rollover_treatment",
    "description": "Audit rollover equity for compliance, produce ownership map, and draft lender explanation memo.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "rollover_equity_amount": { "type": Type.NUMBER },
        "pre_deal_ownership_cap_table": { "type": Type.STRING, "description": "Free-text or CSV-like cap table before deal." },
        "post_deal_ownership_target": { "type": Type.STRING, "description": "Free-text or CSV-like proposed cap table after deal." }
      },
      "required": ["rollover_equity_amount"]
    }
  },
  {
    "name": "assemble_microequity_round",
    "description": "Compose a micro-investor round to meet equity shortfall without triggering affiliation/control issues. Output investor memo outline and subscription checklist.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "equity_shortfall": { "type": Type.NUMBER },
        "max_investors": { "type": Type.INTEGER },
        "max_single_investor_pct": { "type": Type.NUMBER, "description": "Cap to avoid control issues." },
        "investor_archetypes": {
          "type": Type.ARRAY,
          "items": { "type": Type.STRING },
          "description": "e.g. friends_and_family, angels, community_members"
        }
      },
      "required": ["equity_shortfall"]
    }
  },
  {
    "name": "evaluate_robs_path",
    "description": "Compare ROBS vs alternatives (HELOC, portfolio line) with an audit-risk and suitability matrix; return decision guidance.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "retirement_balance": { "type": Type.NUMBER },
        "heloc_limit": { "type": Type.NUMBER },
        "portfolio_line_limit": { "type": Type.NUMBER },
        "borrower_risk_tolerance": { "type": Type.STRING, "enum": ["low","moderate","high"] }
      },
      "required": ["retirement_balance"]
    }
  },
  {
    "name": "bolster_postclose_liquidity",
    "description": "Model post-close liquidity buffer and DSCR resilience; propose working-capital strategies and vendor-term plays.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "projected_monthly_debt_service": { "type": Type.NUMBER },
        "projected_monthly_ebitda": { "type": Type.NUMBER },
        "starting_cash_post_close": { "type": Type.NUMBER },
        "ar_days": { "type": Type.INTEGER },
        "ap_days": { "type": Type.INTEGER },
        "inventory_days": { "type": Type.INTEGER }
      },
      "required": ["projected_monthly_debt_service","projected_monthly_ebitda","starting_cash_post_close"]
    }
  },
  {
    "name": "select_lender_matches",
    "description": "Shortlist banks/CDC partners that fund the structure based on appetite and overlays; return Q&A pack and contact strategy.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "structure_summary": { "type": Type.STRING, "description": "Plain-English synopsis of the capital stack." },
        "geography": { "type": Type.STRING, "description": "State/region of borrower and target." },
        "collateral_profile": { "type": Type.STRING, "description": "e.g. service business (low collateral), CRE heavy, equipment, etc." },
        "avoid_list": { "type": Type.ARRAY, "items": { "type": Type.STRING }, "description": "Banks to skip if any." }
      },
      "required": ["structure_summary","geography"]
    }
  },
  {
    "name": "coach_communications",
    "description": "Drafts communications like emails or call scripts, provides negotiation talking points, and suggests next moves.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "objective": { "type": Type.STRING, "description": "The user's primary goal, e.g., 'Request outstanding tax returns from the broker.'" },
        "communication_type": { "type": Type.STRING, "enum": ["email", "script", "talking_points"], "description": "The desired format of the output." },
        "recipient": { "type": Type.STRING, "description": "The person being communicated with, e.g., 'Seller', 'Broker', 'Accountant'." },
        "tone": { "type": Type.STRING, "enum": ["polite", "firm", "conciliatory", "urgent"], "description": "The desired tone of the communication." }
      },
      "required": ["objective", "communication_type"]
    }
  },
  {
    "name": "summarize_discussion",
    "description": "Analyzes a list of comments from a discussion thread, summarizes key points, and extracts actionable items.",
    "parameters": {
        "type": Type.OBJECT,
        "properties": {
            "comments": {
                "type": Type.ARRAY,
                "description": "An array of comment objects from the discussion thread.",
                "items": {
                    "type": Type.OBJECT,
                    "properties": {
                        "user": { "type": Type.STRING, "description": "The name of the user who made the comment." },
                        "text": { "type": Type.STRING, "description": "The content of the comment." }
                    }
                }
            }
        },
        "required": ["comments"]
    }
  },
  {
    "name": "generate_lender_package",
    "description": "Generates a concise, professional financing request package for a specific lender, highlighting key metrics and strengths of the deal.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "lender_name": { "type": Type.STRING, "description": "The name of the target lender, e.g., 'Live Oak Bank'." }
      },
      "required": ["lender_name"]
    }
  },
  {
    "name": "coach_deal_negotiations",
    "description": "Generate negotiation scripts, LOI redlines, and a trade-off matrix for buyer-seller conversations.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "current_terms": { "type": Type.STRING, "description": "Bulleted LOI or key terms snapshot." },
        "buyer_priorities": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "seller_concerns": { "type": Type.ARRAY, "items": { "type": Type.STRING } }
      },
      "required": ["current_terms"]
    }
  },
  {
    "name": "compile_sba_closing_pack",
    "description": "Compile a lender-ready closing pack: equity verification, gift letters, S&U tables, and SBA form checklist.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "final_sources_and_uses": { "type": Type.STRING, "description": "CSV/JSON/markdown S&U representation." },
        "equity_sources_summary": { "type": Type.STRING },
        "gift_letter_fields": {
          "type": Type.ARRAY,
          "items": { "type": Type.OBJECT,
            "properties": {
              "donor_name": { "type": Type.STRING },
              "recipient_name": { "type": Type.STRING },
              "amount": { "type": Type.NUMBER },
              "bank_proof_provided": { "type": Type.BOOLEAN }
            },
            "required": ["donor_name","recipient_name","amount"]
          }
        },
        "attachments_manifest": { "type": Type.ARRAY, "items": { "type": Type.STRING }, "description": "Paths/URLs for included docs (bank stmts, retirement letters, etc.)." }
      },
      "required": ["final_sources_and_uses","equity_sources_summary"]
    }
  },
  {
    "name": "analyze_lender_compatibility",
    "description": "Analyzes lender overlays against the current deal structure and recommends specific adjustments to improve financing prospects.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "lender_overlays": {
          "type": Type.OBJECT,
          "description": "The specific rules and preferences of the target lender.",
          "properties": {
            "seller_note_counts": { "type": Type.BOOLEAN, "description": "Whether the lender counts a seller note towards the equity injection." },
            "gift_ok": { "type": Type.BOOLEAN, "description": "Whether the lender accepts gifted funds." },
            "min_borrower_cash_pct": { "type": Type.NUMBER, "description": "The minimum percentage of the total project cost the borrower must contribute from their own cash." }
          }
        },
        "deal_context": {
          "type": Type.OBJECT,
          "description": "Key figures from the current deal for analysis.",
          "properties": {
            "total_project_cost": { "type": Type.NUMBER },
            "borrower_cash_contribution": { "type": Type.NUMBER },
            "seller_note_amount": { "type": Type.NUMBER },
            "is_seller_note_on_standby": { "type": Type.BOOLEAN }
          }
        }
      },
      "required": ["lender_overlays", "deal_context"]
    }
  },
  {
    "name": "web_fetch_url",
    "description": "Fetch raw content from a URL (HTML, JSON, text, binary) with optional headers.",
    "parameters": {
      "type": Type.OBJECT,
      "properties": {
        "url": { "type": Type.STRING, "description": "The URL to fetch content from." },
        "headers": { "type": Type.OBJECT, "description": "Optional key-value pairs for request headers." },
        "timeout_ms": { "type": Type.INTEGER, "description": "Request timeout in milliseconds. Default: 10000." }
      },
      "required": ["url"]
    }
  }
];

/**
 * Converts a Command string to a snake_case function name.
 * e.g., "Assess_SOP_Applicability" -> "assess_sop_applicability"
 */
const commandToFunctionName = (command: string): string => {
  return command.toLowerCase();
};


/**
 * Finds the corresponding function schema for a given agent module.
 */
export const getSchemaForAgent = (agent: AgentModule): FunctionDeclaration | undefined => {
  const functionName = commandToFunctionName(agent.command);
  // FIX: Use the corrected FUNCTION_SCHEMAS directly.
  return FUNCTION_SCHEMAS.find(schema => schema.name === functionName);
};
