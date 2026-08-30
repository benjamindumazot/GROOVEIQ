-- ============================================================
-- GrooveIQ — Disco Roots & Disco scene
-- Source: independent research / Brewster & Broughton ch. 6-7 topic map
-- ============================================================

-- Scene
insert into scenes (slug, name, city, era_start, era_end, anchor_venue, key_figures, order_index, overview, dj_culture, dance_styles) values
(
  'disco-roots',
  'Disco Roots',
  'New York City',
  1969,
  1979,
  'The Loft / The Sanctuary',
  'David Mancuso, Francis Grasso, Nicky Siano, Larry Levan',
  0,
  'Before house, before garage, before techno — there was The Loft. David Mancuso began throwing invite-only rent parties at 647 Broadway in 1970, playing records from start to finish without mixing, curating an emotional journey for a crowd of mostly Black, Latino, and gay New Yorkers. Mancuso never had a liquor license; admission was a donation. Meanwhile, Francis Grasso at the Sanctuary and Continental Baths was inventing the technical language of DJing itself — slip-cueing, headphone monitoring, beatmatching. These two figures, barely known outside specialist circles, invented the conditions that made everything else possible.',
  'Two distinct philosophies were born here. Mancuso: records played whole, no EQ, no mixing — the DJ as curator of an emotional arc. Grasso: continuous mixing, slip-cueing on felt slipmats, blending rock, Motown, and African percussion into a seamless flow. Both approaches live on — Mancuso''s lineage runs through Paradise Garage''s emotional intensity; Grasso''s technique is the foundation of every beatmatching DJ since.',
  'Expressive, communal movement in spaces where Black, Latino, and gay communities could be fully themselves. The dance floor as sanctuary — literally, in Grasso''s case (the Sanctuary was a converted church). Fluid, improvisational, partner and solo dancing coexisting.'
);

-- Artists
insert into artists (slug, name, bio, birth_year, active_years) values
(
  'david-mancuso',
  'David Mancuso',
  'David Mancuso was an American DJ and the founder of The Loft — the invite-only rent party at 647 Broadway, New York, that he began hosting in 1970. Mancuso was not a mixer; he played records from beginning to end, using the full arc of each track as the building block of an evening''s emotional journey. He was obsessed with sound quality and built an audiophile system using Klipschorn speakers and custom tweeter arrays. The Loft had no liquor license — admission was by invitation, and a donation covered costs. The crowd was predominantly Black, Latino, and gay. Mancuso''s vision of the DJ as emotional curator, not technical showman, directly shaped Larry Levan and Frankie Knuckles. He died in 2016.',
  1944,
  '1970–2016'
),
(
  'francis-grasso',
  'Francis Grasso',
  'Francis Grasso was the resident DJ at the Sanctuary (a converted church at 407 West 43rd Street) and the Continental Baths in the early 1970s. He is credited with inventing slip-cueing — holding a record stationary on a felt slipmat while the platter spins beneath it, then releasing at the exact moment needed — which made precise beatmatching possible for the first time. He also pioneered headphone monitoring, allowing DJs to cue the next record privately while the current one played. His sets blended rock, Motown, James Brown, and African percussion in a continuous flow that was genuinely new. Grasso burned out and left DJing by the mid-70s; he died in 2001, largely unrecognised outside specialist circles.',
  1949,
  '1969–1975'
);

-- Venues
insert into venues (slug, name, city, years_active, description) values
(
  'the-loft',
  'The Loft',
  'New York City',
  '1970–present',
  'David Mancuso''s apartment at 647 Broadway, then later at 99 Prince Street and other addresses. An invite-only rent party with no liquor license, no cover, no commercial agenda. Mancuso''s audiophile sound system — Klipschorn speakers, custom tweeters, Koetsu cartridges — was designed to reproduce records as faithfully as possible, as loud as comfortable. The Loft is still held periodically to this day.'
),
(
  'the-sanctuary',
  'The Sanctuary',
  'New York City',
  '1969–1972',
  'A converted German church at 407 West 43rd Street that became one of New York''s earliest DJ-driven clubs. Francis Grasso''s residency here established the technical template for DJing. The crowd was mixed — gay, straight, Black, white — and the music ranged from rock to soul to African rhythms. The venue closed in 1972.'
),
(
  'continental-baths',
  'Continental Baths',
  'New York City',
  '1968–1975',
  'A gay bathhouse at the Ansonia Hotel on Broadway that hosted live performances and DJ nights. Bette Midler launched her career here with Barry Manilow as her accompanist. Francis Grasso played DJ sets. The Baths represent the overlap between the emerging gay social scene and the club culture that would become disco and eventually house.'
);

-- Link venues to scene
update venues set scene_id = (select id from scenes where slug = 'disco-roots')
where slug in ('the-loft', 'the-sanctuary', 'continental-baths');

-- Link artists to scene
with
  s as (select id from scenes where slug = 'disco-roots'),
  a_dm as (select id from artists where slug = 'david-mancuso'),
  a_fg as (select id from artists where slug = 'francis-grasso'),
  a_ns as (select id from artists where slug = 'nicky-siano')
insert into artist_scenes (artist_id, scene_id, influence_rating, role)
select a_dm.id, s.id, 10, 'DJ / Host'    from a_dm, s union all
select a_fg.id, s.id, 10, 'DJ'           from a_fg, s union all
select a_ns.id, s.id,  8, 'DJ'           from a_ns, s;

-- Influence edges: Disco Roots → NY Garage
with
  a_dm  as (select id from artists where slug = 'david-mancuso'),
  a_fg  as (select id from artists where slug = 'francis-grasso'),
  a_lev as (select id from artists where slug = 'larry-levan'),
  a_fk  as (select id from artists where slug = 'frankie-knuckles'),
  a_ns  as (select id from artists where slug = 'nicky-siano')
insert into artist_influences (from_artist_id, to_artist_id, weight, note)
select a_dm.id, a_lev.id, 9, 'Levan attended The Loft as a teenager — Mancuso''s vision of the DJ as emotional curator directly shaped his approach at Paradise Garage' from a_dm, a_lev union all
select a_dm.id, a_fk.id,  8, 'Knuckles was also a Loft regular; the idea of the DJ as selector rather than just record-player came from Mancuso' from a_dm, a_fk union all
select a_fg.id, a_ns.id,  8, 'Grasso''s technical innovations (slip-cueing, beatmatching) were absorbed by the next generation of NY DJs including Siano' from a_fg, a_ns union all
select a_dm.id, a_ns.id,  7, 'Mancuso''s curatorial approach influenced The Gallery''s programming' from a_dm, a_ns
on conflict (from_artist_id, to_artist_id) do nothing;

-- SCENE_STYLES entry note (for developers):
-- Add 'disco-roots' to SCENE_STYLES in app/scenes/page.tsx:
-- gradient: "from-yellow-900/40 via-zinc-900 to-zinc-900"
-- accent: "border-yellow-500/50 hover:border-yellow-400"
-- dot: "bg-yellow-400"

-- Quiz questions for Disco Roots
with s as (select id from scenes where slug = 'disco-roots')
insert into quiz_questions (question, options, correct_index, explanation, scene_id, difficulty, category)
values
(
  'What was unique about David Mancuso''s approach to DJing at The Loft?',
  '["He mixed records seamlessly at 130 BPM", "He played records from start to finish with no mixing, as a curated emotional journey", "He only played imported European records", "He used a live band to extend tracks"]'::jsonb,
  1,
  'Mancuso never mixed. He played each record from beginning to end, believing the artist''s intention should be heard complete. His skill was sequencing — choosing what came next. This curatorial philosophy directly shaped Larry Levan, who attended The Loft as a teenager.',
  (select id from s), 'medium', 'culture'
),
(
  'What DJing technique did Francis Grasso invent at the Sanctuary around 1969–70?',
  '["The crossfader blend", "Slip-cueing using a felt slipmat to hold a record while the platter spins", "Playing two copies of the same record to extend a track", "Using a drum machine to fill between records"]'::jsonb,
  1,
  'Grasso placed a felt slipmat between the record and the platter, allowing him to hold the record still while the motor spun underneath. Releasing at exactly the right moment — slip-cueing — meant he could drop a new record perfectly on beat. This is the physical foundation of all DJ beatmatching.',
  (select id from s), 'hard', 'gear'
),
(
  'Why did The Loft not have a liquor licence?',
  '["Mancuso was against alcohol on principle", "It was a private rent party — admission was a donation, not a ticket purchase", "The building''s lease prohibited it", "The city refused to grant one to a gay venue"]'::jsonb,
  1,
  'The Loft was legally a private party, not a commercial club. Mancuso charged a donation to cover costs and invited guests personally. This legal structure gave him freedom — no commercial pressure, no mainstream audience to satisfy, no rules about who could attend or how long they could stay.',
  (select id from s), 'medium', 'history'
),
(
  'The Sanctuary, where Francis Grasso played, was notable because:',
  '["It was the first club to install a proper sound system", "It was a converted German church — the dance floor was literally a former place of worship", "It was the first club to admit gay customers openly", "It had a rooftop dance floor"]'::jsonb,
  1,
  'The Sanctuary at 407 West 43rd Street was a converted German Gothic church. The symbolism was obvious to its clientele — mostly gay men dancing in a space that the mainstream church had rejected them from. The idea of the dance floor as sanctuary (a safe, sacred space) began here quite literally.',
  (select id from s), 'medium', 'culture'
),
(
  'Which future superstar launched her career performing at the Continental Baths?',
  '["Diana Ross", "Patti LaBelle", "Bette Midler", "Donna Summer"]'::jsonb,
  2,
  'Bette Midler performed regularly at the Continental Baths, a gay bathhouse at the Ansonia Hotel, with Barry Manilow as her accompanist. The Baths were a hotbed of talent and cultural mixing — the same milieu that produced the DJ culture Grasso was developing.',
  (select id from s), 'hard', 'history'
),
(
  'The lineage from The Loft to Paradise Garage runs through which figure?',
  '["Ron Hardy", "Nicky Siano", "Marshall Jefferson", "Kevin Saunderson"]'::jsonb,
  1,
  'Nicky Siano''s Gallery was the link. Siano was a Loft regular who absorbed Mancuso''s curatorial philosophy, opened The Gallery in 1973, and mentored Larry Levan and Frankie Knuckles there. The direct connective tissue: Mancuso → Siano → Levan/Knuckles → Paradise Garage/Chicago Warehouse.',
  (select id from s), 'hard', 'history'
);
