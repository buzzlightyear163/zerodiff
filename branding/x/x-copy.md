# Zero Diff – X-kit

## Domän och handle
Domän (kolla att den är ledig och vad den kostar):
1. zerodiff.so – .so är filen domaren jämför (original.so mot candidate.so)
2. zerodiff.app – ren produktändelse, lätt att säga
3. zerodiff.io – klassisk ändelse för dev-verktyg
4. usezerodiff.com – .com om de korta är tagna
5. zerodiff.tech – reserv, tydligt tech

Handle: @zerodiffso · @zerodiffsol · @usezerodiff · @zerodiffhq
Visningsnamn: Zero Diff

## Kärnmening
$ZERODIFF is a bounty market for closed Solana programs: rebuild one as Rust source, a judge replays mainnet against both binaries, and if the diff is zero you sell the source in USDC.

## Bio
Manifest (148 tecken tecken)
```text
Closed Solana programs, rebuilt as source and replayed against mainnet. Zero diff earns a public proof and a sealed source the hunter sells in USDC.
```

Överblick (145 tecken tecken)
```text
A bounty market for closed Solana programs.
· Wishes: name a program and your price
· Hunt: rebuild it in Rust
· The judge: zero diff or it fails
```

Webbplats: domänen, fylls i när launch-inlägget postas. Plats: `0 lines changed`

## Pre-launch
1. Reveal – dag −2, kväll (fäst) · 693 tecken tecken · bild: pfp.png
```text
You sign transactions for Solana programs you can't read. Closed bytecode, holding real funds, and the only people who know what it does are the ones who deployed it.

$ZERODIFF pays to open them up. Rebuild a closed program as Rust source, let a machine replay mainnet against your build, and sell the source if nothing differs.

No human decides the verdict. The judge compiles your crate itself, runs it next to the original on the same inputs, and compares every case. One byte off is a FAIL.

A PASS goes public as a proof ticket. The source stays encrypted until someone pays to unlock it, and the hunter keeps 92% of that payment.

Launching on pump.fun [tid].
```

2. Inuti – dag −1, kväll · 689 tecken tecken · bild: skärminspelning av "Submit a crate, get a verdict"
```text
A crate lands. The judge builds it on its own machine, with no secrets and a ten minute cap, then loads it beside the binary that runs on mainnet and feeds both the exact same instructions.

Real ones first, pulled from recent mainnet transactions. Then fuzzed variants of those, under the same compute budget.

For every case it checks:
- the result, down to the exact error code
- every byte of every account the instruction can write
- return data
- every log line, minus compute-unit noise
- CPI calls and the order they happen in

One difference anywhere and the report points to the case and the field.

Zero differences, and the crate becomes a ticket with the hunter's price on it.
```

3. Varför nu – launchdagen, 30–90 min före · 452 tecken tecken · bild: banner.png
```text
[tid]. pump.fun.

Rebuilding closed code keeps getting easier. Proving a rebuild is exact never had a referee. Until now it ended in a blog post and a "trust me".

Zero Diff ends it in a verdict with hashes that anyone can re-run.

Wishes cost nothing to sign. Hunters price their own work from 25 USDC. Buyers pay only for a source that already matched mainnet.

The CA and the link will only ever be posted from this account.
```

## Launch (fäst)
1067 tecken tecken · bild: og.png eller en launch-bild med status Live
```text
$ZERODIFF is live.

A bounty market for closed Solana programs. Rebuild one as Rust source, the judge replays mainnet against both binaries, and if the diff is zero you sell that source in USDC.

[länk]

How it works:
→ Wishes: name any program id and the price you'd pay. A signed message, no deposit.
→ Hunt: submit your crate. Your browser hashes and encrypts it before upload.
→ The judge: builds it on a pinned toolchain, replays real and fuzzed instructions in two identical SVMs, returns PASS or FAIL.
→ Proof wall: every verdict and its source commitment.
→ Verifier: re-run any verdict yourself.

How the money moves:
92% of every unlock goes to the hunter at once.
8% is bought into $ZERODIFF and burned.
Whoever signed the wish gets the first 7 days on a proof made from it.

Calibration comes first. Before it judges anything else, the judge has to PASS a program whose source is already public and FAIL a copy with one line changed.

Read exactly how a verdict is decided: [länk]/docs/judge

Zero diff, full payout.
```

Svar 1 – CA (101 tecken tecken)
```text
CA: [CA]

This is the only contract. Anything else is a copy.
```

## Efter launch
1. Första timmarna (200 tecken tecken)
```text
Zero Diff on pump.fun

CA: [CA]

Rebuild what's closed. Prove it matches mainnet byte for byte. Sell the source in USDC.

[länk]
```

2. Dag 1–2 – djupdykning: Pay to decrypt (609 tecken tecken)
```text
Pay to decrypt, explained.

When the judge passes a crate, the proof goes public right away: the program, the match count, the report hash and the sha256 of the source. The source itself stays encrypted.

A buyer pays the hunter's price in USDC. The server reseals the key to a one-time key made in the buyer's own browser, the browser decrypts the archive and checks it against the hash that was printed on the ticket from the first minute. If it doesn't match, it doesn't save.

The hunter gets 92% in the same run. Each proof sells once.

The full flow, step by step: [länk]/docs/unlocking
```

3. Dag 2–3 – narrativ + milstolpe (512 tecken tecken)
```text
[X] holders.

Not every proof finds a buyer. Zero Diff still pays the hunter.

Every Monday the vault keeps a small SOL reserve for fees, swaps half of the rest to USDC and sends it to the orphan fund. The fund buys the oldest unsold proofs past all their windows, at the hunter's price or 250 USDC, whichever is lower, and publishes the source on the ticket for everyone.

The other half is bought into $ZERODIFF and burned.

That's what the fund is for: a proof that diffs to zero shouldn't sit unsold forever.
```
