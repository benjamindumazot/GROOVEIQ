-- ============================================================
-- GrooveIQ question bank — 30 questions, 4 scenes
-- ============================================================

-- NY Garage questions
with s as (select id from scenes where slug = 'ny-garage')
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
select * from (values
  (
    'What was the address of Paradise Garage?',
    '["84 King Street, Manhattan", "120 Wooster Street, SoHo", "20 Hudson Street, Tribeca", "45 West 28th Street, Chelsea"]'::jsonb,
    0,
    'Paradise Garage was located at 84 King Street in lower Manhattan. It operated from 1977 to 1987 and was accessible only to members — predominantly Black and Latino gay men.',
    (select id from s), 'medium', 'history'
  ),
  (
    'What time did Paradise Garage typically close?',
    '["2am", "6am", "Noon on Sundays", "Midnight"]'::jsonb,
    2,
    'The Garage was famous for its Sunday sessions that ran until noon — dancers would emerge blinking into bright daylight after a night of transcendence. It was church, literally on Sunday morning.',
    (select id from s), 'hard', 'culture'
  ),
  (
    'Which label was co-founded by Larry Levan''s mentor Mel Cheren and became the voice of NY Garage?',
    '["Prelude Records", "West End Records", "Salsoul Records", "Sleeping Bag Records"]'::jsonb,
    1,
    'West End Records, founded by Mel Cheren, was the definitive NY Garage label. Cheren was a music industry veteran who documented what was happening on Levan''s dance floor.',
    (select id from s), 'medium', 'labels'
  ),
  (
    'Who taught Larry Levan and Frankie Knuckles to DJ?',
    '["Frankie Crocker", "Nicky Siano", "David Mancuso", "DJ Hollywood"]'::jsonb,
    1,
    'Nicky Siano ran The Gallery, which predated Paradise Garage as New York''s most important DJ-driven club. Levan and Knuckles worked there as teenagers — Siano was their direct mentor.',
    (select id from s), 'hard', 'artists'
  ),
  (
    'What did Larry Levan do to records before playing them at Paradise Garage?',
    '["He played them at the wrong speed", "He edited them on reel-to-reel tape", "He always played them in key order", "He only played 7-inch singles"]'::jsonb,
    1,
    'Levan was meticulous about his edits. He''d rework tracks on reel-to-reel tape — extending breakdowns, removing vocals, creating versions that didn''t exist on any commercial release.',
    (select id from s), 'hard', 'culture'
  ),
  (
    'What was the sound system at Paradise Garage designed by?',
    '["Martin Audio", "Richard Long & Associates", "Meyer Sound", "Void Acoustics"]'::jsonb,
    1,
    'Richard Long was the pioneering sound system designer who built the Garage''s legendary rig. Levan himself had trained as an electrician and helped wire it. The system was a direct-field, time-aligned design unlike anything before.',
    (select id from s), 'hard', 'culture'
  )
) as q(question, options, correct_index, explanation, scene_id, difficulty, category);

-- Chicago House questions
with s as (select id from scenes where slug = 'chicago-house')
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
select * from (values
  (
    'Where did the name "house music" come from?',
    '["House parties in the South Side", "A record shop filing records as played at The Warehouse", "A producer''s home studio name", "The house band at a radio station"]'::jsonb,
    1,
    'Record shops in Chicago started filing certain records under "as heard at The Warehouse." Customers shortened it to "house music" and the name stuck — an accidental genre name born in a record shop.',
    (select id from s), 'easy', 'history'
  ),
  (
    'Which track is widely considered the first acid house record?',
    '["Your Love by Frankie Knuckles", "Acid Tracks by Phuture", "Move Your Body by Marshall Jefferson", "Can You Feel It by Mr. Fingers"]'::jsonb,
    1,
    'Phuture (DJ Pierre, Spanky, and Herb J) recorded "Acid Tracks" in 1986. Ron Hardy premiered it at the Music Box to an initially baffled crowd. The track used a Roland TB-303 pushed to extremes — the first deliberate use of the acid sound.',
    (select id from s), 'medium', 'history'
  ),
  (
    'What year did Frankie Knuckles move from New York to Chicago?',
    '["1974", "1977", "1980", "1983"]'::jsonb,
    1,
    'Knuckles moved to Chicago in 1977 to run The Warehouse, taking the New York garage sound with him and developing it into what would become house music.',
    (select id from s), 'medium', 'history'
  ),
  (
    '"Move Your Body" by Marshall Jefferson was groundbreaking because:',
    '["It was the first house track to use a drum machine", "It was the first house track built around piano/organ chords", "It was the first house track released on vinyl", "It was the first house track played on UK radio"]'::jsonb,
    1,
    'Jefferson''s "Move Your Body" (1986) was the first house track centered on live piano/organ playing — a gospel-influenced approach that gave house its spiritual dimension. It was also called "the first house anthem."',
    (select id from s), 'medium', 'artists'
  ),
  (
    'What made Ron Hardy''s DJ style different from Frankie Knuckles?',
    '["He only played slow, soulful tracks", "He was darker, faster, more confrontational — and would play a record multiple times in one night", "He used live musicians", "He never played imported records"]'::jsonb,
    1,
    'Hardy was notorious for extreme volumes, higher tempos, and his willingness to play a track two or three times in one set if the crowd needed to feel it again. Where Knuckles was musical and crafted, Hardy was raw and relentless.',
    (select id from s), 'medium', 'culture'
  ),
  (
    'Which label released the most important Chicago house records and was famous for its chaotic business practices?',
    '["Def Jam", "Trax Records", "Sub Pop", "Factory Records"]'::jsonb,
    1,
    'Trax Records, run by Larry Sherman, was foundational but legendarily chaotic — no contracts, royalties paid in cash from a grocery bag, masters stored in a garage. Despite this, it released records by Knuckles, Hardy, Jefferson, Heard, and Phuture.',
    (select id from s), 'easy', 'labels'
  ),
  (
    'Larry Heard''s deep house alias was:',
    '["Larry Love", "Mr. Fingers", "Deep Space", "Inner Chord"]'::jsonb,
    1,
    'Larry Heard recorded as Mr. Fingers — his "Can You Feel It," "Mystery of Love," and "Washing Machine" are among the most emotionally resonant house records ever made, often recorded with just a drum machine, DX7, and bass synth.',
    (select id from s), 'easy', 'artists'
  )
) as q(question, options, correct_index, explanation, scene_id, difficulty, category);

-- Detroit Techno questions
with s as (select id from scenes where slug = 'detroit-techno')
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
select * from (values
  (
    'What are the "Belleville Three"?',
    '["Three Detroit clubs that launched techno", "Three DJs: Juan Atkins, Derrick May, Kevin Saunderson", "Three record labels that defined Detroit techno", "Three drum machines used in early Detroit techno"]'::jsonb,
    1,
    'Juan Atkins, Derrick May, and Kevin Saunderson grew up together in Belleville, Michigan — a suburb of Detroit. They synthesized Kraftwerk, George Clinton, and Chicago house into something entirely new: Detroit techno.',
    (select id from s), 'easy', 'artists'
  ),
  (
    'Which radio DJ introduced the Belleville Three to European electronic music and funk?',
    '["Alan Freed", "The Electrifying Mojo", "Frankie Crocker", "Jeff Mills"]'::jsonb,
    1,
    'The Electrifying Mojo (Charles Johnson) hosted a late-night radio show in Detroit that played Kraftwerk, Prince, Parliament, and European synth music alongside each other — providing the sonic education that shaped Detroit techno.',
    (select id from s), 'hard', 'history'
  ),
  (
    'Derrick May''s most celebrated track "Strings of Life" was released under which alias?',
    '["Model 500", "Rhythim Is Rhythim", "Inner City", "Suburban Knight"]'::jsonb,
    1,
    'Derrick May recorded as Rhythim Is Rhythim. "Strings of Life" (1987) — with its piano line and orchestral stabs over a driving 909 pattern — is one of electronic music''s most referenced and unrepeatable moments.',
    (select id from s), 'medium', 'artists'
  ),
  (
    'What was the name of Detroit''s most important techno club, opened in 1988?',
    '["The Warehouse", "Music Institute", "Tresor Detroit", "The Shelter"]'::jsonb,
    1,
    'The Music Institute, opened by Chez Damier and George Baker on Broadway in downtown Detroit, was the city''s answer to Paradise Garage — an all-night, all-Black club where Derrick May and Kevin Saunderson played relentless sets.',
    (select id from s), 'medium', 'history'
  ),
  (
    'Juan Atkins'' label, which released the first Detroit techno record in 1985, was called:',
    '["Transmat", "KMS Records", "Metroplex", "Axis"]'::jsonb,
    2,
    'Metroplex, launched by Juan Atkins in 1985, released "No UFOs" as Model 500 — widely considered the first Detroit techno record. The cold, precise, synthesized sound was unlike anything from Chicago or New York.',
    (select id from s), 'medium', 'labels'
  ),
  (
    'Detroit techno''s sound has been described as reflecting:',
    '["The optimism of the automobile industry''s recovery", "The post-industrial collapse of Detroit — machines, automation, unemployment", "The vibrant nightlife of downtown Detroit in the 1980s", "The influence of Southern soul and R&B"]'::jsonb,
    1,
    'Detroit in the mid-80s was a city in crisis — automated factories, mass unemployment, racial tension. The techno the Belleville Three made sounded like machines dreaming: cold, precise, and deeply human at the same time.',
    (select id from s), 'medium', 'culture'
  )
) as q(question, options, correct_index, explanation, scene_id, difficulty, category);

-- Berlin Techno questions
with s as (select id from scenes where slug = 'berlin-techno')
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
select * from (values
  (
    'When did the Berlin Wall fall?',
    '["October 3, 1990", "November 9, 1989", "December 31, 1988", "June 4, 1989"]'::jsonb,
    1,
    'The Berlin Wall fell on November 9, 1989. Within weeks, ravers were throwing parties in the abandoned ruins of East Berlin — the lawless gap before reunification created conditions for an unprecedented club culture.',
    (select id from s), 'easy', 'history'
  ),
  (
    'Where was Tresor club located?',
    '["An old power plant in Mitte", "A vault under the ruins of the Wertheim department store", "A converted factory in Prenzlauer Berg", "A former Stasi headquarters"]'::jsonb,
    1,
    'Tresor opened in 1991 in a bank vault — literally steel-doored, underground, in the ruins of the Wertheim department store on Potsdamer Platz. The low ceilings, darkness, and hard acoustics defined a generation''s idea of what a techno club should feel like.',
    (select id from s), 'medium', 'history'
  ),
  (
    'Which Detroit artist had the biggest impact on early Berlin techno?',
    '["Kevin Saunderson", "Derrick May", "Jeff Mills", "Juan Atkins"]'::jsonb,
    2,
    'Jeff Mills — formerly of Underground Resistance — became one of Berlin''s defining artists. His residencies at Tresor, his label Axis, and his ferocious three-deck DJ style set the template for Berlin techno''s uncompromising aesthetic.',
    (select id from s), 'medium', 'artists'
  ),
  (
    'What is Berghain''s no-phone policy primarily designed to protect?',
    '["Copyright of the DJs'' sets", "The anonymity and freedom of the dance floor", "The club''s trade secrets", "Its fire safety capacity limit"]'::jsonb,
    1,
    'Berghain''s no-phone rule protects the space for people who may be dancing, dressing, or behaving in ways they wouldn''t want photographed. It''s about creating a zone of genuine freedom — the same logic that made Paradise Garage members-only.',
    (select id from s), 'medium', 'culture'
  ),
  (
    'How long do Berlin techno DJ sets typically last?',
    '["1-2 hours", "3-4 hours", "6-12 hours", "30 minutes"]'::jsonb,
    2,
    'Berlin DJs play long — 6, 8, 12-hour sets are common at clubs like Berghain. The goal is total immersion over time, a gradual shift in consciousness. This is fundamentally different from the set-based format of most global club culture.',
    (select id from s), 'easy', 'culture'
  ),
  (
    'The label Hard Wax, which was foundational to Berlin''s techno culture, was founded by:',
    '["Dimitri Hegemann", "Mark Ernestus and Moritz von Oswald", "Jeff Mills", "Paul van Dyk"]'::jsonb,
    1,
    'Mark Ernestus and Moritz von Oswald founded Hard Wax as a record shop in 1989, distributing Detroit records in Europe. They also created Basic Channel and Chain Reaction — two of the most influential minimal techno labels of the 90s.',
    (select id from s), 'hard', 'labels'
  )
) as q(question, options, correct_index, explanation, scene_id, difficulty, category);

-- Cross-scene / gear questions
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
values
(
  'The Roland TB-303 was originally designed to:',
  '["Create acid house basslines", "Simulate a bass guitar for practice", "Replace the TR-808 drum machine", "Generate ambient textures"]'::jsonb,
  1,
  'The TB-303 was a commercial failure designed to simulate a bass guitar for solo musicians to practice with. It was discontinued in 1984 and sold cheaply. DJ Pierre of Phuture discovered that cranking the filter and resonance to extremes produced the alien "acid" sound by accident.',
  null, 'medium', 'gear'
),
(
  'The Roland TR-808''s kick drum is technically a:',
  '["Digital sample of a real kick drum", "Sawtooth wave through a filter", "Sine wave — not a real drum sound at all", "White noise burst"]'::jsonb,
  2,
  'The 808''s kick is a decaying sine wave — completely synthetic and unlike any real drum. This was seen as a flaw when it launched in 1980. It became the definitive electronic kick because its sub-bass frequencies hit the body in a way samples couldn''t.',
  null, 'hard', 'gear'
),
(
  'Which synthesizer''s "Universe" organ preset became the most recognisable patch in house music?',
  '["Roland Juno-106", "Yamaha DX7", "Korg M1", "Oberheim OB-8"]'::jsonb,
  2,
  'The Korg M1''s "Universe" preset — a slightly metallic, gospel-inflected pipe organ — is on hundreds of house records from the late 80s and early 90s. Marshall Jefferson''s piano-driven sound paved the way; the M1 made it accessible to any producer.',
  null, 'medium', 'gear'
),
(
  'The Technics SL-1200 became the DJ standard because:',
  '["It was the cheapest turntable available", "Its direct-drive motor reached full speed instantly with no belt slippage", "It could play records backwards", "It had built-in effects processing"]'::jsonb,
  1,
  'The SL-1200 was designed for broadcast studios. Its direct-drive motor — no belt — meant it reached target speed almost instantly and held pitch under pressure. DJs could cue, scratch, and pitch-adjust with precision impossible on consumer decks.',
  null, 'medium', 'gear'
);
