# Hard-question authoring brief (August 2026)

Input for authoring difficulty-3 questions. Combines (1) online research into why ~35-45% of
candidates fail the real exam and (2) an audit of our 315 questions against the road code.

## Real-exam facts (verified)

- 50 questions, pass 41/50. 45 questions × 1 point + **exactly 5 severe questions × 5 points**
  (severe = 3rd/4th-degree offences + speeding). 2 severe errors = fail (40/50), even with all
  others correct. Candidates are NOT told which questions are severe.
- Question types mix knowledge, insight and risk perception; ~15 s per question.
- No official per-theme distribution is published; only the 45/5 split is fixed.
- After 2 consecutive fails: mandatory 12 h theory course.
- **1 Sept 2026**: the new "Code van de openbare weg" (KB 03/06/2024) replaces the 1975 wegcode —
  cite the 1975 code now, expect article remapping.

## Trap-question patterns (form)

1. Deciding element at the image periphery (sign/marking easy to miss).
2. Negation phrasing ("which statement is FALSE", "you are NOT allowed unless…").
3. Intuition-inversion: the plausible answer is exactly wrong (bigger road ≠ priority; tram from
   the left goes first; trams are overtaken on the RIGHT).
4. Region-dependent numerics: same picture, answer depends on the stated region.
5. Near-value numeric options (15/20/25 m; 0.22/0.09/0.5; 750/3 500/4 250 kg; 24 h/8 h/3 h).
6. Exception-of-the-rule probing (right-overtaking a left-turner; priority road that has ended;
   flashing-amber restores sign priority).
7. Definitional splits: overtaking vs passing a queue; stopping vs parking; maneuver vs movement;
   MTM vs actual load; blue lights (any mission) vs siren (urgent mission).
8. Most-complete-answer format: several options partly right, only one fully right.
9. Sign lookalikes (C1/C3, E1/E3, B22/B23, E9-family) — always with images, never codes.
10. 3-4 vehicle ordering questions where one element (tram, cyclist crossing, one B1) flips the order.
11. Marking discrimination: dashed (crossable to turn) vs solid bus/reserved-lane markings.
12. Hidden-risk framing: mirrors show nothing, correct answer still demands the shoulder check.

## Priority gap list per category (from the code audit)

The full audit lives in the PR description; per-category assignments are given directly in each
authoring agent's prompt. Highest-value systemic gaps:

- **Traffic lights are untested anywhere**: steady amber (Art. 61.1.2°), green ≠ priority over
  clearing traffic/pedestrians (61.1.3° + 40.4.1), arrow and bicycle lights (61.1.4°/6°),
  clearance arrow (62), flashing amber = caution, priority unchanged (64.1).
- **Hierarchy untested**: authorized person > lights > signs > rules (Art. 4-6); officer signals;
  lights failing to flashing amber → priority signs regain force (Art. 6.3 + 64).
- Numeric recall: parking 15/20/5 m; long-term parking 24 h/8 h/3 h; following ≥50 m for >7.5 t;
  pedestrian-crossing use within 20 m; pedestrian lateral gap 1 m/1.5 m; main beam off within
  50 m behind; 2.55 m width / 4 m height; alcohol 0.22/0.09 mg/l and the 0.8‰ boundary;
  fine degrees €64/128/191/520 with example classifications.
- Rule interactions: B9 outside built-up = no parking on carriageway (Art. 25.1.9°); working
  traffic lights suspend priority signs; blue zone includes Saturdays; coach 90/100 speed caps;
  trams overtaken right (Art. 16.9); hazard-light legitimate uses (Art. 32bis); zipper with both
  outer lanes ending; buses/>3.5 t restricted to two rightmost lanes on ≥3-lane motorways.

## Authoring rules (unchanged from CONTENT_SPEC.md, plus)

- Difficulty 3 only for this batch; severity per the severe taxonomy (3rd/4th degree + speeding).
- NEVER a sign code in question text or options (codes allowed in explanations/citations only).
- No traffic-light scenes — the scene renderer has no traffic-light support; phrase light
  questions in text ("the light is steady amber…") without an image, or use a sign image.
- Build distractors from the intuitive-but-wrong answer and near-value numbers.
- Avoid the audit's redundancy list (facts already tested 3+ times: cyclist gap, left-turn yields,
  zipper basics, min-70 motorway, woonerf 20, pedestrian-zone pace, 2×2 markings rule…).
- Verify every article number against wegcode.be before citing.
