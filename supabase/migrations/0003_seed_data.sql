-- ============================================================
-- GrooveIQ seed data — 4 founding scenes
-- Run this in the Supabase SQL Editor after 0001 and 0002
-- ============================================================

-- ============ SCENES ============

insert into scenes (slug, name, city, era_start, era_end, anchor_venue, key_figures, order_index, overview, dj_culture, dance_styles) values
(
  'ny-garage',
  'NY Garage',
  'New York City',
  1977,
  1987,
  'Paradise Garage',
  'Larry Levan, Frankie Knuckles, Nicky Siano, Mel Cheren',
  1,
  'Born in the underground clubs of lower Manhattan, NY Garage was the sound of liberation. Larry Levan''s Paradise Garage was the spiritual home — a members-only loft club on King Street where Black and Latino gay men danced until noon on Sundays. Levan was less DJ, more shaman: stretching, dubbing, and layering records into emotional journeys that could last an hour. The music blended soulful vocals, gospel-tinged chords, and driving percussion. It was church for people the church had rejected.',
  'DJs were musical directors, not just selectors. Levan''s booth was elevated — literally above the crowd — and his control over the sound system was total. He''d been trained as an electrician and helped wire the Garage''s legendary Richard Long speaker system himself. Sets were emotional arcs: build, release, transcendence. Records were often reedited on reel-to-reel tape before being played.',
  'Free-form, expressive movement rooted in Black and Latino club culture. No dress codes, no mirrors — the dance floor was about feeling, not performance.'
),
(
  'chicago-house',
  'Chicago House',
  'Chicago',
  1983,
  1990,
  'The Warehouse / Music Box',
  'Frankie Knuckles, Ron Hardy, Larry Heard, Jesse Saunders, Marshall Jefferson',
  2,
  'House music was born at The Warehouse on South Jefferson Street, where Frankie Knuckles played to predominantly Black and Latino gay crowds from 1977. When Knuckles left in 1982, Ron Hardy took over the Music Box and pushed the music harder, faster, and darker. The name "house" stuck — records at local shops were filed under "as played at the Warehouse." By 1985, local producers like Larry Heard and Jesse Saunders were making their own records, and house spread from Chicago basement studios to record shops, radio, and the world.',
  'Chicago DJs built on the NY Garage tradition but pushed tempos higher (120–130 BPM) and stripped arrangements down. Ron Hardy was notorious for playing records at the wrong speed, for fading in edits mid-track, and for clearing the floor intentionally just to rebuild. He''d play a track multiple times in one night. Knuckles was more polished, more musical — but both understood the DJ as architect of feeling.',
  'High-energy movement: voguing, lofting, stepping. The floor was a community space as much as a dance space.'
),
(
  'detroit-techno',
  'Detroit Techno',
  'Detroit',
  1985,
  1993,
  'Music Institute',
  'Juan Atkins, Derrick May, Kevin Saunderson, Eddie Fowlkes, Blake Baxter',
  3,
  'Three Black teenagers in Belleville, Michigan — Juan Atkins, Derrick May, and Kevin Saunderson — absorbed Kraftwerk, George Clinton, and Chicago house through a show called The Electrifying Mojo, and synthesized something entirely new. Detroit techno was cold, mechanical, and deeply human at the same time. It reflected the city''s post-industrial collapse: automated factories, unemployment, racial tension. The music sounded like machines dreaming. Atkins released records as Cybotron and Model 500; May''s "Strings of Life" became one of electronic music''s defining moments.',
  'Detroit''s Music Institute, opened in 1988 by Chez Damier and George Baker, became the city''s answer to the Paradise Garage. DJs like Derrick May and Kevin Saunderson played relentless, precise sets — the music demanded technical discipline. Less about emotional manipulation, more about physical lock-in. The groove was hypnotic and uncompromising.',
  'Uptight, geometric movement. Less about expression, more about surrendering to the machine. The floor was predominantly young Black Detroiters, later increasingly mixed as the music spread to Europe.'
),
(
  'berlin-techno',
  'Berlin Techno',
  'Berlin',
  1989,
  null,
  'Tresor / Berghain',
  'Dimitri Hegemann, Paul van Dyk, Sven Väth, Speedy J, Jeff Mills, Juan Atkins',
  4,
  'The Berlin Wall fell on November 9, 1989. Within weeks, ravers were throwing parties in the abandoned ruins of East Berlin — factories, bunkers, power stations. The city''s unique moment of lawlessness and possibility gave birth to a techno culture of radical freedom. Tresor, opened in 1991 in a bank vault under the ruins of the Wertheim department store, became the flagship. Detroit techno artists — Mills, Atkins, Blake Baxter — found their largest audiences in Berlin. The sound got harder, darker, and more hypnotic. Berghain, opened in 2004 in a former power plant, extended that lineage into the 21st century.',
  'Berlin DJs play long — 6, 8, 12-hour sets are common. The goal is total immersion, a kind of collective trance. Mixing is seamless: no gaps, no drops, just a continuous wall of sound that evolves over hours. The DJ is anonymous — the music is the star. Berghain''s Panorama Bar and main floor represent two distinct philosophies that coexist in one building.',
  'Heads-down, introverted movement. Eyes closed. The Berghain floor is famous for its lack of spectacle — no phones, no shows, just bodies surrendering to sound. A form of secular ritual.'
);

-- ============ LABELS ============

insert into labels (slug, name, founding_story, founded_year, city) values
('west-end', 'West End Records', 'Founded by Mel Cheren, West End was the definitive New York garage label. Cheren was a music industry veteran who understood what was happening on the dance floors and documented it. Home to classics by Loose Joints, Class Action, and raw garage 12-inches that defined the Larry Levan sound.', 1976, 'New York City'),
('prelude', 'Prelude Records', 'Marvin Schlachter''s Prelude bridged the gap between disco and garage, releasing early house-adjacent records and genre-defining tracks by D.C. LaRue and Patrick Adams. Crucial to understanding the pre-house continuum.', 1976, 'New York City'),
('trax', 'Trax Records', 'The most important label in Chicago house history. Larry Sherman pressed records on whatever vinyl he could find — sometimes warped, always raw. Frankie Knuckles, Ron Hardy, Marshall Jefferson, Larry Heard, and Sleezy D all released key records here. The label''s chaos is legendary: no contracts, royalties paid in cash from a grocery bag, masters stored in a garage.', 1984, 'Chicago'),
('djax-up-beats', 'DJAX-UP-Beats', 'Rotterdam label that was a crucial bridge between Detroit and Europe, releasing early records by Terrence Dixon and other Detroit artists for European audiences.', 1989, 'Rotterdam'),
('transmat', 'Transmat', 'Derrick May''s own label, releasing his own productions as Mayday and Rhythim Is Rhythim, plus records from close collaborators. The sound of Detroit techno at its most refined and emotional.', 1987, 'Detroit'),
('metroplex', 'Metroplex', 'Juan Atkins'' label, home to Model 500 and the earliest, most austere Detroit techno. Atkins released "No UFOs" here in 1985, widely considered the first Detroit techno record.', 1985, 'Detroit'),
('kms', 'KMS Records', 'Kevin Saunderson''s label, home to Inner City — the pop-facing side of Detroit techno. Saunderson had the commercial instincts of the trio; "Big Fun" and "Good Life" brought the Detroit sound to mainstream audiences worldwide.', 1987, 'Detroit'),
('tresor-records', 'Tresor Records', 'The label arm of the Berlin club, releasing records by Detroit artists (Jeff Mills, Robert Hood, Underground Resistance) and European techno producers. The label documented the Berlin-Detroit axis that defined techno''s global spread.', 1991, 'Berlin'),
('hardwax', 'Hard Wax', 'Not a label but the record shop that defined Berlin''s techno culture. Founded by Mark Ernestus and Moritz von Oswald, Hard Wax distributed Detroit records in Europe and launched the Basic Channel / Chain Reaction empire.', 1989, 'Berlin');

-- ============ GEAR ============

insert into gear (slug, name, category, release_year, manufacturer, description) values
('roland-tb-303', 'Roland TB-303 Bass Line', 'synth', 1981, 'Roland', 'A bass guitar simulator that failed commercially and was discontinued in 1984. DJs and producers bought them for next to nothing at pawn shops. When driven to extremes — filter cranked, resonance maxed, accents fired at random — it produced an alien, bubbling, acidic squeal that defined acid house. DJ Pierre, Spanky, and Herb J (Phuture) discovered the sound in 1986. "Acid Tracks" was the result.'),
('roland-tr-808', 'Roland TR-808 Rhythm Composer', 'drum machine', 1980, 'Roland', 'Another commercial failure that became foundational. The 808 couldn''t emulate real drums convincingly — its kick drum was a sine wave, its clap an obvious electronic snap. But these "flaws" became features. The 808 kick became the heartbeat of house, hip-hop, and techno. Its sub-bass frequencies required major PA systems to reproduce properly, pushing club sound systems to evolve.'),
('roland-tr-909', 'Roland TR-909 Rhythm Composer', 'drum machine', 1983, 'Roland', 'The 909 combined analog synthesis with digital samples and introduced MIDI. Its open hi-hat, snare crack, and driving kick pattern became the template for house and techno. The machine''s ability to sync to external MIDI gear made it central to live electronic performance. Derrick May''s "Strings of Life" rides on a 909 pattern.'),
('yamaha-dx7', 'Yamaha DX7', 'synth', 1983, 'Yamaha', 'The first commercially successful digital synthesizer. FM synthesis produced metallic, glassy, and bell-like tones impossible on analog gear. The "E. Piano" patch is on thousands of records. Larry Heard used it on "Can You Feel It" — the DX7''s shimmering chords became the sound of deep house.'),
('moog-minimoog', 'Moog Minimoog', 'synth', 1970, 'Moog', 'The portable, monophonic synthesizer that brought synthesis out of university labs and into studios. Its filter — warm, resonant, expressive — remains one of the most musical ever made. Giorgio Moroder''s Eurodisco productions and early Kraftwerk records both relied on the Minimoog, feeding directly into what would become electronic dance music.'),
('akai-mpc60', 'Akai MPC60', 'sampler', 1988, 'Akai', 'Roger Linn''s MPC60 merged a sampler with a step sequencer and velocity-sensitive pads. Producers could slice breaks, layer sounds, and program groove patterns with unprecedented feel. The MPC''s swing quantize function — adding micro-timing variations — gave sampled beats their human feel. Essential to late-80s house and hip-hop production.'),
('technics-sl1200', 'Technics SL-1200 MK2', 'mixer', 1978, 'Technics', 'The DJ''s tool. The direct-drive motor was designed for broadcast studios but became the industry standard for DJs because it reached speed instantly (no belt slippage) and held pitch under pressure. Larry Levan, Ron Hardy, and every DJ who followed played on 1200s. The pitch control allowed precise beatmatching — essential for the long blended mixes that defined club culture.'),
('arp-2600', 'ARP 2600', 'synth', 1971, 'ARP', 'A semi-modular synthesizer that came pre-patched but allowed extensive reconfiguration. Its filters and oscillators had a specific character — slightly harsh, enormously powerful. Giorgio Moroder used it on "I Feel Love." Once electronic music had "I Feel Love," everything changed.'),
('roland-juno-106', 'Roland Juno-106', 'synth', 1984, 'Roland', 'Affordable, polyphonic, and with the distinctive Roland chorus effect, the Juno-106 became the workhorse of house and early techno. Its pads and string sounds appear on hundreds of garage and house records. Accessible to producers who couldn''t afford a Prophet-5 or Oberheim.'),
('korg-m1', 'Korg M1', 'synth', 1988, 'Korg', 'The M1''s "Universe" organ preset — a gospel-inflected, slightly metallic pipe organ sound — became the most recognizable keyboard patch in house music history. Marshall Jefferson''s "Move Your Body" in 1986 was the first house track built around piano/organ chords, and the M1 carried that tradition into the late 80s and early 90s.');

-- ============ LINK: labels → scenes ============

with
  s_nyg  as (select id from scenes where slug = 'ny-garage'),
  s_chi  as (select id from scenes where slug = 'chicago-house'),
  s_det  as (select id from scenes where slug = 'detroit-techno'),
  s_ber  as (select id from scenes where slug = 'berlin-techno'),
  l_we   as (select id from labels where slug = 'west-end'),
  l_pre  as (select id from labels where slug = 'prelude'),
  l_trax as (select id from labels where slug = 'trax'),
  l_tran as (select id from labels where slug = 'transmat'),
  l_met  as (select id from labels where slug = 'metroplex'),
  l_kms  as (select id from labels where slug = 'kms'),
  l_tre  as (select id from labels where slug = 'tresor-records')
insert into label_scenes (label_id, scene_id)
select l_we.id,   s_nyg.id from l_we,  s_nyg union all
select l_pre.id,  s_nyg.id from l_pre, s_nyg union all
select l_trax.id, s_chi.id from l_trax, s_chi union all
select l_tran.id, s_det.id from l_tran, s_det union all
select l_met.id,  s_det.id from l_met,  s_det union all
select l_kms.id,  s_det.id from l_kms,  s_det union all
select l_tre.id,  s_ber.id from l_tre,  s_ber;

-- ============ LINK: gear → scenes ============

with
  s_nyg as (select id from scenes where slug = 'ny-garage'),
  s_chi as (select id from scenes where slug = 'chicago-house'),
  s_det as (select id from scenes where slug = 'detroit-techno'),
  s_ber as (select id from scenes where slug = 'berlin-techno'),
  g_303   as (select id from gear where slug = 'roland-tb-303'),
  g_808   as (select id from gear where slug = 'roland-tr-808'),
  g_909   as (select id from gear where slug = 'roland-tr-909'),
  g_dx7   as (select id from gear where slug = 'yamaha-dx7'),
  g_mini  as (select id from gear where slug = 'moog-minimoog'),
  g_mpc   as (select id from gear where slug = 'akai-mpc60'),
  g_1200  as (select id from gear where slug = 'technics-sl1200'),
  g_arp   as (select id from gear where slug = 'arp-2600'),
  g_juno  as (select id from gear where slug = 'roland-juno-106'),
  g_m1    as (select id from gear where slug = 'korg-m1')
insert into gear_scenes (gear_id, scene_id)
-- NY Garage
select g_mini.id,  s_nyg.id from g_mini,  s_nyg union all
select g_1200.id,  s_nyg.id from g_1200,  s_nyg union all
select g_dx7.id,   s_nyg.id from g_dx7,   s_nyg union all
-- Chicago House
select g_303.id,   s_chi.id from g_303,   s_chi union all
select g_808.id,   s_chi.id from g_808,   s_chi union all
select g_909.id,   s_chi.id from g_909,   s_chi union all
select g_dx7.id,   s_chi.id from g_dx7,   s_chi union all
select g_m1.id,    s_chi.id from g_m1,    s_chi union all
select g_juno.id,  s_chi.id from g_juno,  s_chi union all
select g_1200.id,  s_chi.id from g_1200,  s_chi union all
-- Detroit Techno
select g_909.id,   s_det.id from g_909,   s_det union all
select g_808.id,   s_det.id from g_808,   s_det union all
select g_mpc.id,   s_det.id from g_mpc,   s_det union all
select g_juno.id,  s_det.id from g_juno,  s_det union all
select g_1200.id,  s_det.id from g_1200,  s_det union all
-- Berlin Techno
select g_909.id,   s_ber.id from g_909,   s_ber union all
select g_808.id,   s_ber.id from g_808,   s_ber union all
select g_303.id,   s_ber.id from g_303,   s_ber union all
select g_1200.id,  s_ber.id from g_1200,  s_ber;

-- ============ ARTISTS ============

insert into artists (slug, name, bio, birth_year, active_years) values
('larry-levan', 'Larry Levan', 'Born Lawrence Philpot in Harlem in 1954, Larry Levan was the resident DJ at Paradise Garage from its opening in 1977 until it closed in 1987. He was also a producer, remixer, and recording artist — his remixes for Taana Gardner, Gwen Guthrie, and Shep Pettibone are foundational documents. Levan died in 1992. The music he made still defines what a DJ can be.', 1954, '1977–1992'),
('frankie-knuckles', 'Frankie Knuckles', 'Francis Warren Nicholls Jr. grew up in the South Bronx and met Larry Levan as a teenager in New York''s Black gay club scene. He moved to Chicago in 1977 to run The Warehouse, where he blended Philadelphia soul, European electronic music, and New York disco into something new. He was the "Godfather of House Music." He died in 2014.', 1955, '1977–2014'),
('ron-hardy', 'Ron Hardy', 'The Music Box''s resident DJ was darker, more confrontational than Knuckles. Hardy played at extreme volumes and tempos, favored rawer edits, and was known to play a track multiple times in a night if the crowd needed to feel it again. He gave Phuture''s "Acid Tracks" its first airing to a confused and eventually ecstatic crowd. He died in 1992.', 1958, '1982–1992'),
('larry-heard', 'Larry Heard', 'Known as Mr. Fingers, Larry Heard recorded some of the most emotionally resonant house music ever made — "Can You Feel It," "Mystery of Love," and "Washing Machine" — often with just a drum machine, a DX7, and a bass synth. His deep house tracks have never been bettered.', 1960, '1985–present'),
('juan-atkins', 'Juan Atkins', 'The originator. Juan Atkins was recording electronic music as Cybotron (with Rick Davis) in the early 1980s, and launched Metroplex Records in 1985. His Model 500 alias produced a string of records that defined Detroit techno''s cold, precise aesthetic. He remains active and is considered the founding architect of the form.', 1962, '1981–present'),
('derrick-may', 'Derrick May', 'Rhythim Is Rhythim. Mayday. Derrick May''s "Strings of Life" (1987) is one of electronic music''s unrepeatable moments — a piano line that sounds like it was composed by a machine that learned to cry. May''s production output was small but every record was a landmark. His Transmat label released key records from the Detroit scene.', 1963, '1985–present'),
('kevin-saunderson', 'Kevin Saunderson', 'The third member of the Belleville Three, Saunderson had the broadest commercial instincts. His Inner City project (with vocalist Paris Grey) produced "Big Fun" and "Good Life" — techno''s pop breakthrough. His KMS label documented the Detroit sound for mainstream audiences.', 1964, '1985–present'),
('jeff-mills', 'Jeff Mills', 'The Wizard. Jeff Mills was Detroit''s most technically ferocious DJ — known for three-deck mixing, near-inhuman speed, and sets of absolute precision and power. He co-founded Underground Resistance with Mad Mike Banks, and his solo work on Tresor and his own Axis label pushed techno toward pure abstraction. He became one of Berlin''s defining artists.', 1963, '1985–present'),
('nicky-siano', 'Nicky Siano', 'The Gallery was Siano''s club, and it predated Paradise Garage as New York''s most important DJ-driven dance space. Siano was a musical mentor to Larry Levan and Frankie Knuckles — both worked at The Gallery before launching their own careers. Understanding Siano is understanding where house and garage came from.', 1955, '1973–present'),
('marshall-jefferson', 'Marshall Jefferson', 'A postal worker who bought a drum machine and changed music. Jefferson''s "Move Your Body" (1986) was the first house track built on piano chords — house music''s answer to a gospel song. He also produced Frankie Knuckles'' first single and helped define the uplifting, spiritual side of Chicago house.', 1959, '1985–present');

-- ============ LINK: artists → scenes ============

with
  s_nyg as (select id from scenes where slug = 'ny-garage'),
  s_chi as (select id from scenes where slug = 'chicago-house'),
  s_det as (select id from scenes where slug = 'detroit-techno'),
  s_ber as (select id from scenes where slug = 'berlin-techno'),
  a_lev as (select id from artists where slug = 'larry-levan'),
  a_fk  as (select id from artists where slug = 'frankie-knuckles'),
  a_rh  as (select id from artists where slug = 'ron-hardy'),
  a_lh  as (select id from artists where slug = 'larry-heard'),
  a_ja  as (select id from artists where slug = 'juan-atkins'),
  a_dm  as (select id from artists where slug = 'derrick-may'),
  a_ks  as (select id from artists where slug = 'kevin-saunderson'),
  a_jm  as (select id from artists where slug = 'jeff-mills'),
  a_ns  as (select id from artists where slug = 'nicky-siano'),
  a_mj  as (select id from artists where slug = 'marshall-jefferson')
insert into artist_scenes (artist_id, scene_id, influence_rating, role)
select a_lev.id, s_nyg.id, 10, 'DJ / Producer' from a_lev, s_nyg union all
select a_fk.id,  s_nyg.id,  9, 'DJ'             from a_fk,  s_nyg union all
select a_ns.id,  s_nyg.id,  8, 'DJ'             from a_ns,  s_nyg union all
select a_fk.id,  s_chi.id, 10, 'DJ'             from a_fk,  s_chi union all
select a_rh.id,  s_chi.id, 10, 'DJ'             from a_rh,  s_chi union all
select a_lh.id,  s_chi.id,  9, 'Producer'       from a_lh,  s_chi union all
select a_mj.id,  s_chi.id,  8, 'Producer'       from a_mj,  s_chi union all
select a_ja.id,  s_det.id, 10, 'Producer / DJ'  from a_ja,  s_det union all
select a_dm.id,  s_det.id, 10, 'Producer / DJ'  from a_dm,  s_det union all
select a_ks.id,  s_det.id,  9, 'Producer / DJ'  from a_ks,  s_det union all
select a_jm.id,  s_det.id,  9, 'DJ / Producer'  from a_jm,  s_det union all
select a_jm.id,  s_ber.id, 10, 'DJ / Producer'  from a_jm,  s_ber union all
select a_ja.id,  s_ber.id,  8, 'Producer'       from a_ja,  s_ber union all
select a_dm.id,  s_ber.id,  7, 'DJ'             from a_dm,  s_ber;

-- ============ ARTIST INFLUENCES (for The Web) ============

with
  a_lev as (select id from artists where slug = 'larry-levan'),
  a_fk  as (select id from artists where slug = 'frankie-knuckles'),
  a_rh  as (select id from artists where slug = 'ron-hardy'),
  a_lh  as (select id from artists where slug = 'larry-heard'),
  a_ja  as (select id from artists where slug = 'juan-atkins'),
  a_dm  as (select id from artists where slug = 'derrick-may'),
  a_ks  as (select id from artists where slug = 'kevin-saunderson'),
  a_jm  as (select id from artists where slug = 'jeff-mills'),
  a_ns  as (select id from artists where slug = 'nicky-siano'),
  a_mj  as (select id from artists where slug = 'marshall-jefferson')
insert into artist_influences (from_artist_id, to_artist_id, weight, note)
select a_ns.id, a_lev.id, 9, 'Levan and Knuckles both worked at Siano''s Gallery as coat-checkers and learned to DJ there' from a_ns, a_lev union all
select a_ns.id, a_fk.id,  9, 'Siano was a direct mentor' from a_ns, a_fk union all
select a_lev.id, a_fk.id, 8, 'Childhood friends who shaped each other; Knuckles carried the Garage sound to Chicago' from a_lev, a_fk union all
select a_fk.id, a_lh.id,  7, 'Knuckles played early Mr. Fingers records at the Warehouse, validating the deep house direction' from a_fk, a_lh union all
select a_fk.id, a_rh.id,  6, 'Hardy inherited Chicago''s DJ culture from Knuckles and pushed it harder' from a_fk, a_rh union all
select a_rh.id, a_mj.id,  7, 'Hardy premiered Phuture''s Acid Tracks and championed early producer scenes' from a_rh, a_mj union all
select a_fk.id, a_ja.id,  6, 'Chicago house was the launching pad; Atkins absorbed it and transformed it into Detroit techno' from a_fk, a_ja union all
select a_ja.id, a_dm.id,  9, 'The Belleville Three — Atkins was the elder, May and Saunderson his students' from a_ja, a_dm union all
select a_ja.id, a_ks.id,  9, 'Direct mentor relationship in the Belleville high school scene' from a_ja, a_ks union all
select a_dm.id, a_jm.id,  8, 'May''s records and Transmat label were foundational to Mills'' direction' from a_dm, a_jm union all
select a_ja.id, a_jm.id,  7, 'Metroplex records were essential listening for Mills' from a_ja, a_jm;
