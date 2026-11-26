# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.



```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/determined-planck-qhjicj",
  "reviewed_head": "44d84c5e1d10bec7155bd990978371a64349145c",
  "claude_md_blob": "f64a951521c10de869504338aa4ef6bb4db5c33c",
  "log_commit": "44d84c5e1d10bec7155bd990978371a64349145c",
  "review_base": "c45b37165376cd0c46baa9111bf6bd902b4079c3",
  "implementation": [
    "e32b5c5",
    "bb49f15"
  ],
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/9",
  "result": "changes_requested_before_merge",
  "observations": [
    "PR #8 merge is inherited from main. The Claude.md reset is header-only. The new log and pinned diff independently corroborate both Claude implementation commits.",
    "Nine playable hypercars (+Pur Sport, Veyron Super Sport, McLaren F1). Prior corrections verified in diff: Nissan Z 1,600–5,200 rpm and explicit assumed cut; Chiron Sport retrofit downgraded to equivalent with old-ID migration; Chiron SS 2,500 rpm launch; Carrera GT equivalent and timing unknown; Veyron test fitment/dimensions and timing caveat.",
    "The previous limiter-presence labeling bug is fixed for the ordinary binding and nonbinding cases. The new drag/rev distinction has boundary and model-consistency gaps."
  ],
  "findings": [
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/h11-bugatti-chiron-pur-sport.ts:78,99,119",
      "impact": "A 10% lateral acceleration improvement is mapped one-to-one into longitudinal launch grip. The 2.25 s simulation vs 2.3 s factory claim cannot independently validate that assumption.",
      "request": "Use a neutral transferred longitudinal baseline or document an explicitly independent provisional estimate, and publish sensitivity at baseline vs +10%. Keep factory claims separate from measured comparisons.",
      "acceptance": "Provenance explicitly distinguishes lateral evidence and longitudinal assumptions; rerun generated stats and report 0–100/quarter-mile sensitivity."
    },
    {
      "priority": "P2",
      "path": "src/physics/dyno.ts:71–87,108–116; src/lib/topSpeed.ts:4–17; src/data/catalog/cars/h12-bugatti-veyron-super-sport.ts:77,93",
      "impact": "The first infeasible 0.5 km/h grid sample can be beyond both the force crossing and rev cap. The classifier then calls rev limit even if drag bound first. A stretched top gear may be force-infeasible while a lower gear reaches its rev limit. Veyron SS also documents a roughly 410 km/h modeled gearing ceiling while the log reports drag-limited at 410 km/h. Very close cap/speed values can still round equal at one decimal.",
      "request": "Compare attainable wheel force and rev/gear limits at the actual boundary; make unknown/tied constraints explicit. Reconcile Veyron SS description with computed constraint and EPA rolling-radius sensitivity. Use formatting that preserves the distinction or describe an approximate tie.",
      "acceptance": "Tests cover force crossing just before cut, a lower gear setting maximum speed, near-equal cap, and existing Chiron SS/GTI/GT-R/Nissan examples. Preserve published 415 km/h vs separate record and simulated result."
    },
    {
      "priority": "P3",
      "path": "src/data/catalog/index.ts:21–29; src/storage/results.ts:115–120",
      "impact": "The plain-object alias map resolves inherited names such as constructor to a non-string. Saved result sanitation applies this conversion after validation and can emit an invalid vehicleId.",
      "request": "Use a Map or own-property lookup for canonicalId.",
      "acceptance": "Old Chiron ID migrates and unknown string IDs, including constructor, retain string semantics."
    }
  ],
  "unfinished": [
    "11 more playable hypercars toward 20; all original 18 catalog-only cars still unpromoted. Preserve exact blockers and model validation requirements for AMT/ASG, EV, hybrid, MCT, CVT, 4WD and gearing gaps.",
    "Source queue: Pur Sport table rpm and launch conditions; Veyron SS production rev cut, dimensions and instrumented run; F1 exact production year, road-car rev cut, bevel-stage ratio and timing basis; CCXR and Agera RS gearing; Nissan Z production US limiter and distinct fuel cut; Chiron production Sport exact run and relevant drive modes."
  ],
  "needs": {
    "claude": "Address findings, attach focused regressions, regenerate both outputs, and keep provisional F1 gearing and acceleration residuals visible.",
    "eason": "Native iPad Safari smoke when available; exact-market original documents for the outstanding inputs if available. Merge decision remains yours."
  },
  "verification": {
    "pinned_diff": "Compared main c45b371 to reviewed head, with previous observed 6f6cf33 as an ancestor. git diff --check clean.",
    "ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45738167099 (success for reviewed head)",
    "reported": "Claude/PR reports 951 tests in 22 files, typecheck/lint/build and iPad-size Chromium smoke.",
    "limits": "No independent local test rerun, native iPad Safari verification, or fresh comprehensive audit of manufacturer source documents."
  }
}
```
