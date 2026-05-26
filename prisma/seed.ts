import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Staff accounts for the employee intranet (/portal).
//
// ⚠️  TRAINING TARGET — these are deliberately weak, default-style credentials.
// They exist so the BLUE TEAM can find and harden them (enforce strong unique
// passwords, remove/rename the default admin, etc.). Do NOT use real secrets
// here, and do NOT reuse these anywhere outside the exercise. Seeding is
// create-if-missing, so once the blue team changes a password it is never
// reset on container restart.
// ---------------------------------------------------------------------------
type SeedUser = {
  email: string;
  username: string;
  displayName: string;
  password: string;
  role: "admin" | "employee";
  jobTitle?: string;
  department?: string;
  phone?: string;
};

const SEED_USERS: SeedUser[] = [
  {
    email: "admin@valitsus.local",
    username: "admin",
    displayName: "Communication Unit",
    password: "admin1234", // default admin credentials — intended hardening target
    role: "admin",
    jobTitle: "System Administrator",
    department: "Government Office — IT",
    phone: "+372 693 5701",
  },
  {
    email: "kristjan.mets@valitsus.local",
    username: "kristjan.mets",
    displayName: "Kristjan Mets",
    password: "Suvi2026", // seasonal password
    role: "employee",
    jobTitle: "Press Officer",
    department: "Government Communication Unit",
    phone: "+372 693 5712",
  },
  {
    email: "mari.saar@valitsus.local",
    username: "mari.saar",
    displayName: "Mari Saar",
    password: "parool123", // "parool" = password
    role: "employee",
    jobTitle: "Policy Adviser",
    department: "Strategy Unit",
    phone: "+372 693 5723",
  },
  {
    email: "jaanus.kivi@valitsus.local",
    username: "jaanus.kivi",
    displayName: "Jaanus Kivi",
    password: "Password1", // classic weak password
    role: "employee",
    jobTitle: "IT Support Specialist",
    department: "Government Office — IT",
    phone: "+372 693 5734",
  },
  {
    email: "liis.oja@valitsus.local",
    username: "liis.oja",
    displayName: "Liis Oja",
    password: "valitsus", // organisation name as password
    role: "employee",
    jobTitle: "HR Coordinator",
    department: "Human Resources",
    phone: "+372 693 5745",
  },
  {
    email: "toomas.ilves@valitsus.local",
    username: "toomas.ilves",
    displayName: "Toomas Ilves",
    password: "Welcome1", // default onboarding password, never changed
    role: "employee",
    jobTitle: "Records Officer",
    department: "Document Management",
    phone: "+372 693 5756",
  },
];

// ---------------------------------------------------------------------------
// Government cast. Fictional names — this is exercise/scenario material and is
// deliberately NOT attributed to real serving officials, while keeping the
// Government-of-the-Republic framing used by the paired Tw@er scenario.
// ---------------------------------------------------------------------------
const MINISTERS = [
  {
    name: "Maarja Lepik",
    title: "Prime Minister",
    portfolio: "Stenbock House",
    party: "Reform Coalition",
    photoUrl: "/img/pm.jpg",
    order: 1,
    bio: "Maarja Lepik has served as Prime Minister since 2024, chairing the Government and the Security Committee. Her priorities are national defence, cyber resilience and the Estonia 2035 strategy.",
  },
  {
    name: "Hendrik Saar",
    title: "Minister of Defence",
    portfolio: "Ministry of Defence",
    party: "Reform Coalition",
    order: 2,
    bio: "Responsible for national defence policy, the Defence Forces, and host-nation support for allied units stationed in Estonia.",
  },
  {
    name: "Kerttu Vaher",
    title: "Minister of Foreign Affairs",
    portfolio: "Ministry of Foreign Affairs",
    party: "Social Democrats",
    order: 3,
    bio: "Leads Estonia's foreign policy, NATO and EU coordination, and engagement with Nordic-Baltic (NB8) partners.",
  },
  {
    name: "Toomas Rebane",
    title: "Minister of the Interior",
    portfolio: "Ministry of the Interior",
    party: "Reform Coalition",
    order: 4,
    bio: "Oversees internal security, the Police and Border Guard Board, the Rescue Board and national crisis management.",
  },
  {
    name: "Liis Kukk",
    title: "Minister of Economic Affairs and Information Technology",
    portfolio: "Ministry of Economic Affairs and Communications",
    party: "Reform Coalition",
    order: 5,
    bio: "Responsible for the economy, digital state, critical infrastructure and the Real-time Economy programme.",
  },
  {
    name: "Andres Tamm",
    title: "Minister of Justice",
    portfolio: "Ministry of Justice",
    party: "Social Democrats",
    order: 6,
    bio: "Responsible for legislation, the rule of law and the courts.",
  },
];

type SeedArticle = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  kind: string;
  topic?: string;
  source?: string;
  heroImage?: string;
  featured?: boolean;
  pinned?: boolean;
  /** age in hours from "now" so the feed has a realistic spread */
  agoHours: number;
};

const ARTICLES: SeedArticle[] = [
  {
    slug: "security-committee-convenes-following-cyber-activity",
    title:
      "Government convenes Security Committee following overnight cyber activity against municipal services",
    summary:
      "The Security Committee met this morning after CERT-EE recorded a wave of low-grade attempts against local-government portals overnight. No disruption to public services has been identified.",
    body: `The Government's Security Committee convened at Stenbock House this morning to review a series of low-intensity cyber incidents directed at municipal online services overnight.

The Information System Authority (RIA) and CERT-EE report a coordinated wave of credential-stuffing and distributed denial-of-service attempts against local-government single sign-on and several municipal portals. The activity was absorbed without interruption to public services, and no personal data is known to have been compromised. Attribution is ongoing and the Government will not speculate ahead of the technical assessment.

"This is the everyday texture of the security environment we now operate in," the Prime Minister said. "Our systems held, our people did their jobs, and life continued normally. That is exactly the resilience we have built for."

Citizens and public-sector staff are reminded to enable multi-factor authentication and to treat unexpected "urgent invoice" attachments with caution. State and municipal e-services remain fully available at eesti.ee, and any disruption should be reported to CERT-EE.`,
    kind: "press-release",
    topic: "cyber",
    source: "Government Communication Unit",
    heroImage: "/img/govmeeting.jpg",
    featured: true,
    pinned: true,
    agoHours: 3,
  },
  {
    slug: "spring-storm-2026-main-manoeuvre-phase",
    title: "Spring Storm 2026 enters its main manoeuvre phase in north-east Estonia",
    summary:
      "The Defence Forces' annual large-scale exercise has moved into its main phase, with allied units from the United Kingdom and United States training alongside Estonian conscripts and reservists.",
    body: `The Defence Forces' annual exercise Spring Storm (Kevadtorm) 2026 has entered its main manoeuvre phase across training areas in north-east Estonia.

This year's exercise involves Estonian conscripts, reservists and active units training together with allied forces, including British and United States personnel rotating through the area around Tapa. The Ministry of Defence stresses that the scale and timing of the exercise follow the long-published training calendar and are not a response to any single event.

Residents in the exercise area may notice increased military traffic, low-flying aircraft and the sound of blank ammunition. The Defence Forces ask the public for understanding and remind drivers to follow the instructions of military police directing convoys.

"Spring Storm is how we prove, every year, that Estonia and its allies can operate as one," the Minister of Defence said. "An exercise on this scale is the most visible sign of a credible, collective defence."`,
    kind: "press-release",
    topic: "defence",
    source: "Ministry of Defence",
    heroImage: "/img/spring-storm.jpg",
    featured: true,
    agoHours: 9,
  },
  {
    slug: "counter-uas-measures-eastern-training-areas",
    title: "Defence Forces deploy counter-drone measures around eastern training areas",
    summary:
      "Counter-unmanned-aircraft systems have been positioned around active training areas after repeated unidentified drone sightings. The Defence Forces ask the public not to fly drones near military activity.",
    body: `The Defence Forces have deployed counter-unmanned-aircraft (counter-UAS) capabilities around active training areas in eastern Estonia following a number of unidentified drone sightings in recent days.

The measures are precautionary and are intended to protect personnel and to preserve the integrity of ongoing training. Several of the sightings are likely attributable to hobbyists and media, and the Defence Forces remind the public that flying drones over or near military activity is prohibited and may be treated as interference.

Anyone who observes a drone behaving suspiciously near critical infrastructure or military sites is asked to note the time and location and to contact the Police and Border Guard Board. The Government is treating the protection of the airspace over key sites as a standing priority.`,
    kind: "press-release",
    topic: "defence",
    source: "Ministry of Defence",
    heroImage: "/img/drone.png",
    featured: true,
    agoHours: 20,
  },
  {
    slug: "government-statement-on-remarks-from-donovia",
    title: "Statement by the Government on recent remarks from Donovia",
    summary:
      "The Government has noted recent statements from the Donovian presidency. Estonia remains committed to dialogue, to international law, and to the collective defence of NATO.",
    body: `The Government has taken note of recent public statements attributed to the Donovian presidency, including the assertion that Donovia "will not back down from western aggression".

Estonia rejects the premise of these remarks. The presence of allied forces on Estonian soil is defensive, transparent and conducted at the invitation of the Republic of Estonia within the NATO framework. It threatens no one.

"We distinguish carefully between rhetoric and policy," the Minister of Foreign Affairs said. "We are watching actions, not adjectives. Estonia's response will remain calm, lawful and coordinated with our allies."

The Government calls on all parties to avoid escalation and reaffirms that Estonia's security guarantees, anchored in Article 5 of the North Atlantic Treaty, are not subject to negotiation.`,
    kind: "statement",
    topic: "foreign-affairs",
    source: "Ministry of Foreign Affairs",
    featured: false,
    agoHours: 30,
  },
  {
    slug: "prime-minister-estonia-calm-prepared-united",
    title: "Prime Minister: Estonia is calm, prepared and united",
    summary:
      "In an address from Stenbock House, the Prime Minister urged the public to rely on verified information and reassured citizens that the state's services and defences are functioning normally.",
    body: `In a short address from Stenbock House, the Prime Minister reassured the public that the Republic's institutions, services and defences are functioning normally.

"There is a great deal of noise online at the moment, and some of it is designed to frighten you," the Prime Minister said. "I ask you to do three simple things: rely on verified sources, look after your neighbours, and carry on with your lives. The state is doing its job."

The Prime Minister noted that the Government meets regularly through its Security Committee, that the Defence Forces are conducting their planned annual exercise, and that allied cooperation is close and constant. She thanked municipal IT staff and volunteers of the Defence League for their work over recent days.

Verified information from the Government is published on this site and through official channels. The crisis-information portal kriis.ee carries practical guidance for households.`,
    kind: "speech",
    topic: "security",
    source: "Government Communication Unit",
    heroImage: "/img/pm.jpg",
    featured: true,
    agoHours: 28,
  },
  {
    slug: "additional-funding-national-cyber-resilience",
    title: "Government approves additional funding for national cyber resilience",
    summary:
      "At its weekly session the Government allocated additional resources to the Information System Authority to strengthen the protection of municipal and critical-infrastructure systems.",
    body: `At its regular session the Government approved an additional allocation to the Information System Authority (RIA) to reinforce the cyber defences of local-government and critical-infrastructure systems.

The funding will accelerate the roll-out of centralised monitoring for municipal services, expand CERT-EE's incident-response capacity, and support mandatory multi-factor authentication across public-sector single sign-on.

"Resilience is cheaper than recovery," the Minister of Economic Affairs and Information Technology said. "We are investing now so that an attempted disruption stays exactly that — an attempt."

The measure forms part of the Government's wider work on the security of the digital state and supports the goals of the Estonia 2035 strategy.`,
    kind: "decision",
    topic: "cyber",
    source: "Ministry of Economic Affairs and Communications",
    featured: false,
    agoHours: 33,
  },
  {
    slug: "tallinn-port-operating-normally",
    title: "Tallinn port operating normally; Harbour Master confirms no disruption to shipping",
    summary:
      "The Government has confirmed that operations at the Port of Tallinn are normal. Two vessels remain at anchor outside the inner harbour awaiting routine documentation.",
    body: `Following online speculation, the Government confirms that operations at the Port of Tallinn are proceeding normally and that no shipping has been turned away.

The Harbour Master reports that two foreign-flagged tankers are at anchor outside the inner harbour awaiting completion of routine documentation, in line with standard procedure. Their presence is administrative and is not connected to any security incident.

"Rumour travels faster than a tanker," a port spokesperson said. "The facts are dull, and we are glad of it: the port is open, cargo is moving, and the waiting vessels are a paperwork matter."

The Police and Border Guard Board and the Transport Administration continue routine monitoring of shipping in Estonian waters.`,
    kind: "press-release",
    topic: "domestic",
    source: "Ministry of Economic Affairs and Communications",
    featured: false,
    agoHours: 40,
  },
  {
    slug: "estonia-coordinates-with-nato-allies-baltic-posture",
    title: "Estonia coordinates closely with NATO allies on Baltic security posture",
    summary:
      "The Minister of Foreign Affairs held consultations with Allied counterparts. Allied force movements in the region are described as consistent with planned rotations.",
    body: `The Minister of Foreign Affairs held consultations this week with NATO and Nordic-Baltic counterparts on the security situation in the Baltic Sea region.

Allies confirmed that current force movements, including British convoys transiting toward Tapa and a modest uplift of United States liaison personnel, are consistent with planned rotations and enhanced situational awareness rather than any surge. Estonia and its allies will continue to calibrate their posture to the assessed environment.

"Our message to allies is steady, and theirs to us is steady," the Minister said. "Deterrence works precisely because it is predictable, visible and shared."

Estonia will host partners at the forthcoming Nordic-Baltic Eight (NB8) meeting in Tallinn, where regional resilience and security will be on the agenda.`,
    kind: "news",
    topic: "foreign-affairs",
    source: "Ministry of Foreign Affairs",
    featured: false,
    agoHours: 46,
  },
  {
    slug: "guidance-on-countering-disinformation",
    title: "Government guidance: recognising and countering coordinated disinformation",
    summary:
      "The Government Communication Unit has issued practical guidance after a rise in coordinated, state-aligned activity targeting Estonian audiences on social media.",
    body: `The Government Communication Unit has published practical guidance for the public in response to a rise in coordinated, state-aligned activity on social media targeting Estonian audiences.

Recent patterns include accounts mass-replying to posts that mention Estonia, the amplification of selectively edited clips, and attempts to present routine events — an exercise, a paperwork delay at the port, a brief online outage — as evidence of crisis.

The Government advises the public to:

- check whether a claim appears on official channels before sharing it;
- be wary of accounts that post identical messages at high volume;
- avoid amplifying provocative content, even to debunk it ("don't feed the engagement");
- report coordinated inauthentic behaviour to the relevant platform.

This is the everyday character of sub-threshold, or "grey-zone", pressure: no single act crosses a line, but the aggregate is intended to tire and divide. A calm, informed public is itself a defence.`,
    kind: "press-release",
    topic: "security",
    source: "Government Communication Unit",
    featured: false,
    agoHours: 52,
  },
  {
    slug: "nb8-summit-tallinn-regional-security-resilience",
    title: "Tallinn to host Nordic-Baltic Eight (NB8) summit on regional security and resilience",
    summary:
      "Estonia will welcome the leaders of the Nordic and Baltic states to Tallinn. The agenda focuses on collective resilience, energy and critical-infrastructure protection.",
    body: `Estonia will host the leaders of the Nordic-Baltic Eight (NB8) in Tallinn for a summit dedicated to regional security and resilience.

The agenda includes the protection of critical undersea and energy infrastructure, coordinated responses to hybrid threats, and deepening practical cooperation between the eight states. The summit underlines the close partnership between the Nordic and Baltic countries within the European Union and NATO.

"In our part of the world, security is a team sport," the Prime Minister said. "The NB8 is where neighbours turn shared geography into shared strength."

Further logistical and media information will be issued by the Government Communication Unit closer to the date.`,
    kind: "news",
    topic: "eu",
    source: "Government Communication Unit",
    heroImage: "/img/nb8.png",
    featured: false,
    agoHours: 60,
  },
  {
    slug: "government-session-summary-decisions",
    title: "Summary of decisions from the Government session",
    summary:
      "An overview of the principal decisions taken at the Government's regular Thursday session, including the cyber-resilience allocation and routine appointments.",
    body: `At its regular session the Government took the following principal decisions:

- approved an additional allocation to the Information System Authority for the cyber resilience of municipal and critical-infrastructure systems;
- endorsed the host-nation support arrangements for allied units participating in exercise Spring Storm 2026;
- approved Estonia's positions ahead of the forthcoming NB8 summit in Tallinn;
- confirmed routine personnel and administrative matters.

Full minutes and the texts of adopted regulations are published in the State Gazette (Riigi Teataja). The next regular session takes place as scheduled.`,
    kind: "decision",
    topic: "domestic",
    source: "Government Communication Unit",
    featured: false,
    agoHours: 70,
  },
];

async function main() {
  // --- Staff accounts -----------------------------------------------------
  // Create-if-missing only: an existing account (e.g. one the blue team has
  // re-passworded) is left completely untouched. We refresh directory fields
  // for existing accounts but never overwrite the password or role.
  let created = 0;
  for (const u of SEED_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          displayName: u.displayName,
          jobTitle: u.jobTitle,
          department: u.department,
          phone: u.phone,
        },
      });
      continue;
    }
    await prisma.user.create({
      data: {
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        passwordHash: await bcrypt.hash(u.password, 10),
        role: u.role,
        jobTitle: u.jobTitle,
        department: u.department,
        phone: u.phone,
      },
    });
    created++;
  }
  console.log(`✓ staff accounts (${created} created, ${SEED_USERS.length - created} already present)`);

  const admin = await prisma.user.findUnique({ where: { email: "admin@valitsus.local" } });
  if (!admin) throw new Error("admin account missing after seed");

  // --- Ministers (upsert-ish by name) -------------------------------------
  for (const m of MINISTERS) {
    const existing = await prisma.minister.findFirst({ where: { name: m.name } });
    if (existing) {
      await prisma.minister.update({ where: { id: existing.id }, data: m });
    } else {
      await prisma.minister.create({ data: m });
    }
  }
  console.log(`✓ ${MINISTERS.length} ministers`);

  // --- Articles -----------------------------------------------------------
  // Idempotent: only seed when the table is empty, so live-published exercise
  // content is never overwritten on container restart.
  const existingCount = await prisma.article.count();
  if (existingCount > 0) {
    console.log(`• ${existingCount} articles already present — skipping article seed`);
  } else {
    const now = Date.now();
    for (const a of ARTICLES) {
      const when = new Date(now - a.agoHours * 60 * 60 * 1000);
      await prisma.article.create({
        data: {
          slug: a.slug,
          title: a.title,
          summary: a.summary,
          body: a.body,
          kind: a.kind,
          topic: a.topic ?? null,
          source: a.source ?? "Government Communication Unit",
          heroImage: a.heroImage ?? null,
          featured: a.featured ?? false,
          pinned: a.pinned ?? false,
          status: "published",
          publishedAt: when,
          createdAt: when,
          authorId: admin.id,
        },
      });
    }
    console.log(`✓ ${ARTICLES.length} articles`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
